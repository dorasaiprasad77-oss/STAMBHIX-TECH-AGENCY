import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: string;
  tags: string[];
  favorite: boolean;
  images: string[];
  aiSummary: string;
  aiTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
    tags: [{ type: String, trim: true, lowercase: true }],
    favorite: { type: Boolean, default: false },
    images: [{ type: String }],
    aiSummary: { type: String, default: '' },
    aiTags: [{ type: String }],
  },
  { timestamps: true }
);

memorySchema.index({ user: 1, createdAt: -1 });
memorySchema.index({ user: 1, tags: 1 });

export default (mongoose.models.Memory as mongoose.Model<IMemory>) ||
  mongoose.model<IMemory>('Memory', memorySchema);
