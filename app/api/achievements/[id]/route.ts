import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import AchievementModel from '@/lib/db/models/Achievement';
import { getAuthUser } from '@/lib/db/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const achievement = await AchievementModel.findByIdAndUpdate((await params).id, data, { new: true, runValidators: true });
    if (!achievement) return NextResponse.json({ message: 'Achievement not found' }, { status: 404 });
    return NextResponse.json({ data: achievement, message: 'Achievement updated' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const achievement = await AchievementModel.findByIdAndDelete((await params).id);
    if (!achievement) return NextResponse.json({ message: 'Achievement not found' }, { status: 404 });
    return NextResponse.json({ message: 'Achievement deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}
