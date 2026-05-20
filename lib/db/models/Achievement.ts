import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  date: Date | null;
  icon: string;
  category: string;
  metric: string;
  metricValue: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    date: { type: Date, default: null },
    icon: { type: String, default: '🏆', trim: true },
    category: {
      type: String,
      enum: ['milestone', 'award', 'growth', 'recognition', 'other'],
      default: 'milestone',
    },
    metric: { type: String, default: '', trim: true },
    metricValue: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

achievementSchema.index({ order: 1, isActive: 1 });
achievementSchema.index({ category: 1 });

export default (mongoose.models.Achievement as mongoose.Model<IAchievement>) ||
  mongoose.model<IAchievement>('Achievement', achievementSchema);
