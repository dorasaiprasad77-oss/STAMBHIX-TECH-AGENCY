const express = require('express');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/team — public, returns all active members sorted by order
router.get('/', async (req, res, next) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const members = await TeamMember.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: members, count: members.length });
  } catch (error) {
    next(error);
  }
});

// POST /api/team/reorder — auth protected, bulk update display order
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
    await TeamMember.bulkWrite(ops);
    const members = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: members, message: 'Order updated' });
  } catch (error) {
    next(error);
  }
});

// GET /api/team/:id — public, returns a single member
router.get('/:id', async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
});

// POST /api/team — auth protected, create a new team member
router.post('/', auth, async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
});

// PUT /api/team/:id — auth protected, update a team member
router.put('/:id', auth, async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/team/:id — auth protected, delete a team member
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
