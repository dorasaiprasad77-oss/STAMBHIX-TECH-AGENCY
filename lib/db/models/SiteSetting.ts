import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSetting extends Document {
  key: string;
  label: string;
  value: mongoose.Schema.Types.Mixed;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const siteSettingSchema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: {
      type: String,
      enum: ['number', 'string', 'boolean', 'array', 'object'],
      default: 'string',
    },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default (mongoose.models.SiteSetting as mongoose.Model<ISiteSetting>) ||
  mongoose.model<ISiteSetting>('SiteSetting', siteSettingSchema);
