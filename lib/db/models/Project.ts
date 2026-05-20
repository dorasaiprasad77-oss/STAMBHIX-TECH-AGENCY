import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  client: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Review' | 'Cancelled';
  amount: number;
  progress: number;
  startDate: Date;
  endDate: Date | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    client: { type: String, required: true, trim: true },
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
    amount: { type: Number, required: true, min: 0 },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ category: 1 });

export default (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>('Project', projectSchema);
