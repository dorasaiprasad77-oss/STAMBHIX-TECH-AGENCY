import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import AchievementModel from '@/lib/db/models/Achievement';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET() {
  try {
    await dbConnect();
    const achievements = await AchievementModel.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ data: achievements });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load achievements' }, { status: 500 });
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
    const achievement = await AchievementModel.create(data);
    return NextResponse.json({ data: achievement, message: 'Achievement created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create achievement' }, { status: 500 });
  }
}
