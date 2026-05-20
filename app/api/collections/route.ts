import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Collection from '@/lib/db/models/Collection';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const query: Record<string, unknown> = {};
    // If userId provided, filter by user; otherwise return public collections
    if (userId) {
      query.user = userId;
    } else {
      query.isPublic = true;
    }

    const collections = await Collection.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { message: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const collection = await Collection.create({
      ...body,
      user: authUser.id,
    });
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { message: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
