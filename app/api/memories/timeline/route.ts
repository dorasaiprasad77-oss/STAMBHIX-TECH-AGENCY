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
    const memories = await MemoryModel.find({ user: authUser._id }).sort({ createdAt: -1 }).lean();

    const timelineMap: Record<string, { items: any[]; count: number }> = {};
    memories.forEach((m: any) => {
      const date = new Date(m.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!timelineMap[monthKey]) timelineMap[monthKey] = { items: [], count: 0 };
      timelineMap[monthKey].items.push({ id: m._id, title: m.title, type: m.type, date: m.createdAt });
      timelineMap[monthKey].count++;
    });

    const timeline = Object.entries(timelineMap).map(([month, data]) => ({ month, ...data }));
    return NextResponse.json({ timeline });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load timeline' }, { status: 500 });
  }
}
