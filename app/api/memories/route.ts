import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import MemoryModel from '@/lib/db/models/Memory';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const favorite = searchParams.get('favorite');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filter: Record<string, unknown> = { user: authUser._id };
    if (type) filter.type = type;
    if (tag) filter.tags = tag;
    if (favorite === 'true') filter.favorite = true;
    if (search) filter.$text = { $search: search };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as any).$gte = new Date(startDate);
      if (endDate) (filter.createdAt as any).$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const total = await MemoryModel.countDocuments(filter);
    const memories = await MemoryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return NextResponse.json({
      memories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load memories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const memory = await MemoryModel.create({ ...data, user: authUser._id });
    return NextResponse.json({ message: 'Memory created', memory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create memory' }, { status: 500 });
  }
}
