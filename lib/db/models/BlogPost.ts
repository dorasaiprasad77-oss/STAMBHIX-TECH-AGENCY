import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  readTime: number;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Tech', 'Design', 'Marketing', 'Home Services', 'Business'],
    },
    tags: [{ type: String }],
    coverImage: { type: String, default: '💻' },
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1, published: 1 });
blogPostSchema.index({ createdAt: -1 });

export default (mongoose.models.BlogPost as mongoose.Model<IBlogPost>) ||
  mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
