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
    const format = searchParams.get('format') || 'json';
    const memories = await MemoryModel.find({ user: authUser._id }).sort({ createdAt: -1 }).lean();

    if (format === 'csv') {
      const headers = 'title,type,content,tags,createdAt\n';
      const rows = memories.map((m: any) =>
        `"${(m.title || '').replace(/"/g, '""')}","${m.type}","${(m.content || '').replace(/"/g, '""').substring(0, 500)}","${(m.tags || []).join(';')}","${m.createdAt}"`
      ).join('\n');
      return new NextResponse(headers + rows, {
        headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="memorychain-export.csv"' },
      });
    }

    return NextResponse.json({ memories });
  } catch (error: any) {
    return NextResponse.json({ message: 'Export failed' }, { status: 500 });
  }
}
