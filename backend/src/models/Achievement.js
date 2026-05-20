const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
  date: {
    type: Date,
    default: null,
  },
  icon: {
    type: String,
    default: '🏆',
    trim: true,
  },
  category: {
    type: String,
    enum: ['milestone', 'award', 'growth', 'recognition', 'other'],
    default: 'milestone',
  },
  metric: {
    type: String,
    default: '',
    trim: true,
  },
  metricValue: {
    type: String,
    default: '',
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

achievementSchema.index({ order: 1, isActive: 1 });
achievementSchema.index({ category: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
