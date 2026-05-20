import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import TeamMemberModel from '@/lib/db/models/TeamMember';
import { getAuthUser } from '@/lib/db/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const member = await TeamMemberModel.findByIdAndUpdate((await params).id, data, { new: true, runValidators: true });
    if (!member) return NextResponse.json({ message: 'Team member not found' }, { status: 404 });
    return NextResponse.json({ data: member, message: 'Team member updated' });
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
    const member = await TeamMemberModel.findByIdAndDelete((await params).id);
    if (!member) return NextResponse.json({ message: 'Team member not found' }, { status: 404 });
    return NextResponse.json({ message: 'Team member deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}
