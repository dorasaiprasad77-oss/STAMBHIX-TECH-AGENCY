import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  color: string;
  memories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
    color: { type: String, default: '#4F46E5' },
    memories: [{ type: Schema.Types.ObjectId, ref: 'Memory' }],
  },
  { timestamps: true }
);

collectionSchema.index({ user: 1, name: 1 }, { unique: true });

export default (mongoose.models.Collection as mongoose.Model<ICollection>) ||
  mongoose.model<ICollection>('Collection', collectionSchema);
