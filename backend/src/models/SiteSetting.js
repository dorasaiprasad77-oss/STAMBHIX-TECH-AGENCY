const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Key is required'],
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    required: [true, 'Label is required'],
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Value is required'],
  },
  type: {
    type: String,
    enum: ['number', 'string', 'boolean', 'array', 'object'],
    default: 'string',
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
