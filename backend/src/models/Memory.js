const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters'],
  },
  type: {
    type: String,
    enum: ['text', 'note', 'journal', 'idea', 'reminder', 'other'],
    default: 'text',
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  favorite: {
    type: Boolean,
    default: false,
  },
  images: [{
    type: String,
  }],
  aiSummary: {
    type: String,
    default: '',
  },
  aiTags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Index for efficient queries
memorySchema.index({ user: 1, createdAt: -1 });
memorySchema.index({ user: 1, tags: 1 });

module.exports = mongoose.model('Memory', memorySchema);
