import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import BlogPostModel from '@/lib/db/models/BlogPost';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const post = await BlogPostModel.findOne({ slug: (await params).slug, published: true });
    if (!post) return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const allowedFields = ['title', 'excerpt', 'content', 'author', 'category', 'tags', 'coverImage', 'readTime', 'published', 'featured'];
    const updates: Record<string, unknown> = {};
    const data = await req.json();
    for (const field of allowedFields) {
      if (data[field] !== undefined) updates[field] = data[field];
    }

    const post = await BlogPostModel.findOneAndUpdate({ slug: (await params).slug }, updates, { new: true, runValidators: true });
    if (!post) return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    return NextResponse.json({ post, message: 'Blog post updated' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const post = await BlogPostModel.findOneAndDelete({ slug: (await params).slug });
    if (!post) return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    return NextResponse.json({ message: 'Blog post deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete blog post' }, { status: 500 });
  }
}
