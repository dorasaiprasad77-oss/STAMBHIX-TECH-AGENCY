import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Collection from '@/lib/db/models/Collection';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const collection = await Collection.findById(id).populate('user', 'name email');
    if (!collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { message: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await dbConnect();

    // Check ownership
    const existing = await Collection.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      );
    }
    if (existing.user.toString() !== authUser.id) {
      return NextResponse.json(
        { message: 'Not authorized to edit this collection' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const collection = await Collection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { message: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await dbConnect();

    const existing = await Collection.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      );
    }
    if (existing.user.toString() !== authUser.id) {
      return NextResponse.json(
        { message: 'Not authorized to delete this collection' },
        { status: 403 }
      );
    }

    await Collection.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Collection deleted' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { message: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}
