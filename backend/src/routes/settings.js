const express = require('express');
const SiteSetting = require('../models/SiteSetting');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/settings — public, returns all settings as a key-value map
router.get('/', async (req, res, next) => {
  try {
    const settings = await SiteSetting.find().sort({ key: 1 });
    // Return as both array and a flat key-value map for convenience
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    res.json({ success: true, data: settings, map });
  } catch (error) {
    next(error);
  }
});

// GET /api/settings/:key — public, returns a single setting by key
router.get('/:key', async (req, res, next) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings — auth protected, create a new setting
router.post('/', auth, async (req, res, next) => {
  try {
    const setting = await SiteSetting.create(req.body);
    res.status(201).json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings/:key — auth protected, update a setting by key
router.put('/:key', auth, async (req, res, next) => {
  try {
    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value, label: req.body.label, description: req.body.description },
      { new: true, runValidators: true }
    );
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings/bulk — auth protected, update multiple settings at once
router.post('/bulk', auth, async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings)) {
      return res.status(400).json({ message: 'settings must be an array' });
    }
    const results = await Promise.all(
      settings.map((s) =>
        SiteSetting.findOneAndUpdate(
          { key: s.key },
          { value: s.value, label: s.label, description: s.description },
          { upsert: true, new: true, runValidators: true }
        )
      )
    );
    const map = {};
    results.forEach((s) => { map[s.key] = s.value; });
    res.json({ success: true, data: results, map });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/settings/:key — auth protected, delete a setting
router.delete('/:key', auth, async (req, res, next) => {
  try {
    const setting = await SiteSetting.findOneAndDelete({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
