const express = require('express');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/achievements — public, returns all active achievements sorted by order
router.get('/', async (req, res, next) => {
  try {
    const { all, category } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    if (category) filter.category = category;
    const achievements = await Achievement.find(filter).sort({ order: 1, date: -1 });
    res.json({ success: true, data: achievements, count: achievements.length });
  } catch (error) {
    next(error);
  }
});

// POST /api/achievements/reorder — auth protected, bulk update display order
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
    await Achievement.bulkWrite(ops);
    const achievements = await Achievement.find({}).sort({ order: 1, date: -1 });
    res.json({ success: true, data: achievements, message: 'Order updated' });
  } catch (error) {
    next(error);
  }
});

// GET /api/achievements/:id — public, returns a single achievement
router.get('/:id', async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
});

// POST /api/achievements — auth protected, create a new achievement
router.post('/', auth, async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
});

// PUT /api/achievements/:id — auth protected, update an achievement
router.put('/:id', auth, async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/achievements/:id — auth protected, delete an achievement
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
