import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import TeamMemberModel from '@/lib/db/models/TeamMember';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET() {
  try {
    await dbConnect();
    const members = await TeamMemberModel.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ data: members });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load team members' }, { status: 500 });
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
    const member = await TeamMemberModel.create(data);
    return NextResponse.json({ data: member, message: 'Team member created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create team member' }, { status: 500 });
  }
}
