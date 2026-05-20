const mongoose = require('mongoose');

const projectMediaSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'both'],
    required: [true, 'Media type is required'],
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true,
  },
  images: [{
    type: String,
    trim: true,
  }],
  videoUrl: {
    type: String,
    default: '',
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    enum: ['web', 'app', 'design', 'seo', 'home', 'other'],
    default: 'web',
  },
  client: {
    type: String,
    default: '',
    trim: true,
  },
  completionDate: {
    type: Date,
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
  }],
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

projectMediaSchema.index({ order: 1, isActive: 1 });
projectMediaSchema.index({ category: 1 });

module.exports = mongoose.model('ProjectMedia', projectMediaSchema);
