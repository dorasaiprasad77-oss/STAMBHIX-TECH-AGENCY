import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: authUser._id,
      name: authUser.name,
      email: authUser.email,
      avatar: authUser.avatar,
      preferences: authUser.preferences,
      createdAt: authUser.createdAt,
    },
  });
}

export async function PUT(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (data.name) authUser.name = data.name;
    if (data.preferences) authUser.preferences = { ...authUser.preferences, ...data.preferences };
    await authUser.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: authUser._id,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        preferences: authUser.preferences,
        createdAt: authUser.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
