const express = require('express');
const ProjectMedia = require('../models/ProjectMedia');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/project-media — public, returns all active project media sorted by order
router.get('/', async (req, res, next) => {
  try {
    const { all, category } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    if (category) filter.category = category;
    const projects = await ProjectMedia.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects, count: projects.length });
  } catch (error) {
    next(error);
  }
});

// POST /api/project-media/reorder — auth protected, bulk update display order
// MUST be placed BEFORE /:id routes to avoid route conflict
router.post('/reorder', auth, async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items must be an array' });
    }
    const ops = items.map((item, i) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order ?? i } },
      },
    }));
    await ProjectMedia.bulkWrite(ops);
    const projects = await ProjectMedia.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects, message: 'Order updated' });
  } catch (error) {
    next(error);
  }
});

// GET /api/project-media/:id — public, returns a single project media entry
router.get('/:id', async (req, res, next) => {
  try {
    const project = await ProjectMedia.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project media not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// POST /api/project-media — auth protected, create a new project media entry
router.post('/', auth, async (req, res, next) => {
  try {
    const project = await ProjectMedia.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// PUT /api/project-media/:id — auth protected, update a project media entry
router.put('/:id', auth, async (req, res, next) => {
  try {
    const project = await ProjectMedia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project media not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/project-media/:id — auth protected, delete a project media entry
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const project = await ProjectMedia.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project media not found' });
    res.json({ success: true, message: 'Project media deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
