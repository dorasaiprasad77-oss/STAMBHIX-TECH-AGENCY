import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import BlogPostModel from '@/lib/db/models/BlogPost';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filter: Record<string, unknown> = { published: true };
    if (category && category !== 'All') filter.category = category;

    const skip = (page - 1) * limit;
    const total = await BlogPostModel.countDocuments(filter);
    const posts = await BlogPostModel.find(filter)
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { title, excerpt, content, author, category, tags, coverImage, readTime, published, featured } = await req.json();

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let finalSlug = slug;
    let counter = 1;
    while (await BlogPostModel.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await BlogPostModel.create({
      slug: finalSlug,
      title,
      excerpt: excerpt || content.substring(0, 300),
      content,
      author,
      category,
      tags: tags || [],
      coverImage: coverImage || '💻',
      readTime: readTime || Math.max(1, Math.ceil(content.split(' ').length / 200)),
      published: published || false,
      featured: featured || false,
    });

    return NextResponse.json({ post, message: 'Blog post created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}
