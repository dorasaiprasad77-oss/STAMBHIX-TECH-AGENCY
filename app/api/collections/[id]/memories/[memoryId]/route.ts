import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/connect';
import Collection from '@/lib/db/models/Collection';
import { getAuthUser } from '@/lib/db/jwt';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memoryId: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id, memoryId } = await params;
    await dbConnect();

    const collection = await Collection.findById(id);
    if (!collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      );
    }
    if (collection.user.toString() !== authUser.id) {
      return NextResponse.json(
        { message: 'Not authorized to modify this collection' },
        { status: 403 }
      );
    }

    // Add memory to collection if not already present
    const memoryObjectId = new mongoose.Types.ObjectId(memoryId);
    if (!collection.memories.some((m: any) => m.equals(memoryObjectId))) {
      collection.memories.push(memoryObjectId);
      await collection.save();
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error adding memory to collection:', error);
    return NextResponse.json(
      { message: 'Failed to add memory to collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memoryId: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id, memoryId } = await params;
    await dbConnect();

    const collection = await Collection.findById(id);
    if (!collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      );
    }
    if (collection.user.toString() !== authUser.id) {
      return NextResponse.json(
        { message: 'Not authorized to modify this collection' },
        { status: 403 }
      );
    }

    collection.memories = collection.memories.filter(
      (m) => m.toString() !== memoryId
    );
    await collection.save();

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error removing memory from collection:', error);
    return NextResponse.json(
      { message: 'Failed to remove memory from collection' },
      { status: 500 }
    );
  }
}
