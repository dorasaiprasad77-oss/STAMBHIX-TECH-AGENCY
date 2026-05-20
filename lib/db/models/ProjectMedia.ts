import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectMedia extends Document {
  projectName: string;
  description: string;
  mediaType: 'image' | 'video' | 'both';
  imageUrl: string;
  images: string[];
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  client: string;
  completionDate: Date | null;
  tags: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectMediaSchema = new Schema<IProjectMedia>(
  {
    projectName: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'both'],
      required: true,
    },
    imageUrl: { type: String, default: '', trim: true },
    images: [{ type: String, trim: true }],
    videoUrl: { type: String, default: '', trim: true },
    thumbnailUrl: { type: String, default: '', trim: true },
    category: {
      type: String,
      enum: ['web', 'app', 'design', 'seo', 'home', 'other'],
      default: 'web',
    },
    client: { type: String, default: '', trim: true },
    completionDate: { type: Date, default: null },
    tags: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectMediaSchema.index({ order: 1, isActive: 1 });
projectMediaSchema.index({ category: 1 });

export default (mongoose.models.ProjectMedia as mongoose.Model<IProjectMedia>) ||
  mongoose.model<IProjectMedia>('ProjectMedia', projectMediaSchema);
