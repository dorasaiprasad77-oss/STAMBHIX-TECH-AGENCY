const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['web', 'app', 'design', 'seo', 'home', 'other'],
    default: 'web',
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Review', 'Cancelled'],
    default: 'In Progress',
  },
  amount: {
    type: Number,
    required: [true, 'Project amount is required'],
    min: 0,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
}, {
  timestamps: true,
});

// Index for efficient querying
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model('Project', projectSchema);
