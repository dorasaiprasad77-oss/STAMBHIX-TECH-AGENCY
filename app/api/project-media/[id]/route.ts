import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import ProjectMediaModel from '@/lib/db/models/ProjectMedia';
import { getAuthUser } from '@/lib/db/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const project = await ProjectMediaModel.findByIdAndUpdate((await params).id, data, { new: true, runValidators: true });
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json({ data: project, message: 'Project updated' });
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
    const project = await ProjectMediaModel.findByIdAndDelete((await params).id);
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}
