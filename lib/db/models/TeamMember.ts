import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  position: string;
  bio: string;
  avatar: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    website: string;
  };
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    position: { type: String, required: true, trim: true, maxlength: 100 },
    bio: { type: String, trim: true, maxlength: 1000, default: '' },
    avatar: { type: String, default: '', trim: true },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ order: 1, isActive: 1 });

export default (mongoose.models.TeamMember as mongoose.Model<ITeamMember>) ||
  mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
