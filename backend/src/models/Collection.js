const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  color: {
    type: String,
    default: '#4F46E5', // indigo
  },
  memories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory',
  }],
}, {
  timestamps: true,
});

collectionSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Collection', collectionSchema);
