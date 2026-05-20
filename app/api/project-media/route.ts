import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import ProjectMediaModel from '@/lib/db/models/ProjectMedia';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET() {
  try {
    await dbConnect();
    const projects = await ProjectMediaModel.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ data: projects });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load projects' }, { status: 500 });
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
    const project = await ProjectMediaModel.create(data);
    return NextResponse.json({ data: project, message: 'Project media created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create project' }, { status: 500 });
  }
}
