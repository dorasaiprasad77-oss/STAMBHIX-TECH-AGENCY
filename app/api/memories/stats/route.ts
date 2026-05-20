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
    const memories = await MemoryModel.find({ user: authUser._id }).lean();
    const total = memories.length;
    const byType: Record<string, number> = {};
    const favorites = memories.filter((m: any) => m.favorite).length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWeek = memories.filter((m: any) => new Date(m.createdAt) > weekAgo).length;

    memories.forEach((m: any) => {
      byType[m.type] = (byType[m.type] || 0) + 1;
    });

    return NextResponse.json({
      stats: { total, byType, favorites, recentWeek },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load stats' }, { status: 500 });
  }
}
