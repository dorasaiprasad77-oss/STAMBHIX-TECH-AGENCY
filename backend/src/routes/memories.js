const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');

const router = express.Router();

// Lazy OpenAI client initialization (created once, reused across requests)
let _openai = null;
const getOpenAI = () => {
  if (!_openai) {
    const { OpenAI } = require('openai');
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
};

// All routes require authentication
router.use(auth);

// GET /api/memories - List all memories for the user
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('type').optional().isIn(['text', 'note', 'journal', 'idea', 'reminder', 'other']),
  query('tag').optional().isString(),
  query('favorite').optional().isBoolean().toBoolean(),
  query('search').optional().isString(),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
], async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, tag, favorite, search, startDate, endDate } = req.query;

    // Build filter
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (tag) filter.tags = tag.toLowerCase();
    if (favorite !== undefined) filter.favorite = favorite;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    if (search) {
      // Escape special regex characters to prevent ReDoS attacks
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { content: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const [memories, total] = await Promise.all([
      Memory.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v'),
      Memory.countDocuments(filter),
    ]);

    res.json({
      memories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/memories/export - Export all memories
router.get('/export', [
  query('format').optional().isIn(['json', 'csv']).withMessage('Format must be json or csv'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const format = req.query.format || 'json';
    const memories = await Memory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v -aiSummary -aiTags');

    if (format === 'csv') {
      // Generate CSV
      const headers = 'id,title,content,type,tags,favorite,createdAt,updatedAt\n';
      const rows = memories.map(m => {
        const tags = (m.tags || []).join(';');
        const title = `"${(m.title || '').replace(/"/g, '""')}"`;
        const content = `"${(m.content || '').replace(/"/g, '""')}"`;
        return `${m._id},${title},${content},${m.type},"${tags}",${m.favorite ? 'yes' : 'no'},${m.createdAt.toISOString()},${m.updatedAt.toISOString()}`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=memorychain-export.csv');
      return res.send(headers + rows);
    }

    // Default: JSON export
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=memorychain-export.json');
    res.json({ memories, exportedAt: new Date().toISOString(), total: memories.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/memories/stats - Get memory statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [total, byType, favorites, recent] = await Promise.all([
      Memory.countDocuments({ user: req.user._id }),
      Memory.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Memory.countDocuments({ user: req.user._id, favorite: true }),
      Memory.countDocuments({
        user: req.user._id,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    res.json({
      stats: {
        total,
        byType: byType.reduce((acc, t) => ({ ...acc, [t._id]: t.count }), {}),
        favorites,
        recentWeek: recent,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/memories/timeline - Get memories grouped by date for timeline view
router.get('/timeline', async (req, res, next) => {
  try {
    const memories = await Memory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('title type createdAt tags');

    // Group by year-month
    const timelineMap = {};
    memories.forEach(m => {
      const key = m.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!timelineMap[key]) timelineMap[key] = [];
      timelineMap[key].push({
        id: m._id,
        title: m.title,
        type: m.type,
        date: m.createdAt,
      });
    });

    const timeline = Object.entries(timelineMap)
      .map(([month, items]) => ({ month, items, count: items.length }))
      .sort((a, b) => b.month.localeCompare(a.month));

    res.json({ timeline });
  } catch (error) {
    next(error);
  }
});

// GET /api/memories/:id - Get a single memory
router.get('/:id', async (req, res, next) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-__v');

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({ memory });
  } catch (error) {
    next(error);
  }
});

// POST /api/memories - Create a new memory
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 10000 }),
  body('type').optional().isIn(['text', 'note', 'journal', 'idea', 'reminder', 'other']),
  body('tags').optional().isArray(),
  body('tags.*').isString().trim().isLength({ max: 30 }),
  body('images').optional().isArray(),
  body('images.*').isString(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { title, content, type, tags, images } = req.body;

    const memory = await Memory.create({
      user: req.user._id,
      title,
      content,
      type: type || 'text',
      tags: tags || [],
      images: images || [],
    });

    res.status(201).json({ message: 'Memory created', memory });
  } catch (error) {
    next(error);
  }
});

// PUT /api/memories/:id - Update a memory
router.put('/:id', [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('content').optional().notEmpty().isLength({ max: 10000 }),
  body('type').optional().isIn(['text', 'note', 'journal', 'idea', 'reminder', 'other']),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString().trim(),
  body('favorite').optional().isBoolean(),
  body('images').optional().isArray(),
  body('images.*').optional().isString(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const allowedUpdates = ['title', 'content', 'type', 'tags', 'favorite', 'images'];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({ message: 'Memory updated', memory });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/memories/:id - Delete a memory
router.delete('/:id', async (req, res, next) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({ message: 'Memory deleted' });
  } catch (error) {
    next(error);
  }
});

// POST /api/memories/:id/analyze - AI analyze a memory
router.post('/:id/analyze', async (req, res, next) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    // Check if AI is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        message: 'AI features not configured. Set OPENAI_API_KEY in environment.'
      });
    }

    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful memory assistant. Analyze the given memory and provide a brief summary and relevant tags. Respond in JSON format with "summary" and "tags" fields.',
        },
        {
          role: 'user',
          content: `Title: ${memory.title}\n\nContent: ${memory.content}\n\nType: ${memory.type}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 200,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    memory.aiSummary = analysis.summary || '';
    memory.aiTags = analysis.tags || [];
    await memory.save();

    res.json({
      message: 'Memory analyzed',
      analysis: {
        summary: memory.aiSummary,
        tags: memory.aiTags,
      },
    });
  } catch (error) {
    if (error.status === 401) {
      return res.status(400).json({ message: 'Invalid OpenAI API key' });
    }
    next(error);
  }
});

module.exports = router;
