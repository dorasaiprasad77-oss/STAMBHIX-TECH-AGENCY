import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import TeamMemberModel from '@/lib/db/models/TeamMember';
import { getAuthUser } from '@/lib/db/jwt';

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: 'Items array is required' }, { status: 400 });
    }

    const operations = items.map((item: { _id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await TeamMemberModel.bulkWrite(operations);
    const members = await TeamMemberModel.find().sort({ order: 1 });
    return NextResponse.json({ data: members, message: 'Order updated' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to reorder' }, { status: 500 });
  }
}
