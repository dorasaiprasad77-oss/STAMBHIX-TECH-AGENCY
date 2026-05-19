const express = require('express');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/collections - List all collections for the user
router.get('/', async (req, res, next) => {
  try {
    const collections = await Collection.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-__v -memories')
      .lean();

    // Get memory count
    const collectionsWithCount = collections.map(c => ({
      ...c,
      memoryCount: 0, // memory IDs not loaded for list view, use populate on single get
    }));

    res.json({ collections: collectionsWithCount });
  } catch (error) {
    next(error);
  }
});

// GET /api/collections/:id - Get a single collection with its memories
router.get('/:id', async (req, res, next) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('memories').select('-__v');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({ collection });
  } catch (error) {
    next(error);
  }
});

// POST /api/collections - Create a new collection
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('color').optional().isString(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, description, color } = req.body;

    // Check if collection with same name exists
    const existing = await Collection.findOne({ user: req.user._id, name });
    if (existing) {
      return res.status(409).json({ message: 'A collection with this name already exists' });
    }

    const collection = await Collection.create({
      user: req.user._id,
      name,
      description: description || '',
      color: color || '#4F46E5',
    });

    res.status(201).json({ message: 'Collection created', collection });
  } catch (error) {
    next(error);
  }
});

// PUT /api/collections/:id - Update a collection
router.put('/:id', [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('color').optional().isString(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const allowedUpdates = ['name', 'description', 'color'];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({ message: 'Collection updated', collection });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/collections/:id - Delete a collection
router.delete('/:id', async (req, res, next) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Remove this collection's memories from the collection ref
    // (memories themselves are not deleted)

    res.json({ message: 'Collection deleted' });
  } catch (error) {
    next(error);
  }
});

// POST /api/collections/:id/memories - Add memories to a collection
router.post('/:id/memories', [
  body('memoryIds').isArray({ min: 1 }).withMessage('memoryIds must be a non-empty array'),
  body('memoryIds.*').isString().withMessage('Each memory ID must be a string'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { memoryIds } = req.body;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Add unique memory IDs
    const existingIds = new Set(collection.memories.map(id => id.toString()));
    const newIds = memoryIds.filter((id) => !existingIds.has(id));
    collection.memories.push(...newIds);
    await collection.save();

    res.json({ message: `${newIds.length} memories added to collection`, collection });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/collections/:id/memories/:memoryId - Remove a memory from a collection
router.delete('/:id/memories/:memoryId', async (req, res, next) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    collection.memories.pull(req.params.memoryId);
    await collection.save();

    res.json({ message: 'Memory removed from collection', collection });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
