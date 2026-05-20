import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import MemoryModel from '@/lib/db/models/Memory';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const memory = await MemoryModel.findOne({ _id: (await params).id, user: authUser._id });
    if (!memory) return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
    return NextResponse.json({ memory });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load memory' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const memory = await MemoryModel.findOneAndUpdate({ _id: (await params).id, user: authUser._id }, data, { new: true, runValidators: true });
    if (!memory) return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
    return NextResponse.json({ message: 'Memory updated', memory });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const memory = await MemoryModel.findOneAndDelete({ _id: (await params).id, user: authUser._id });
    if (!memory) return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
    return NextResponse.json({ message: 'Memory deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete memory' }, { status: 500 });
  }
}
