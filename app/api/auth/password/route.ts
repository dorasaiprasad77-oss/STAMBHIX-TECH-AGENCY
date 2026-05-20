import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import { getAuthUser } from '@/lib/db/jwt';

export async function PUT(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { currentPassword, newPassword } = await req.json();

    const fullUser = await UserModel.findById(authUser._id).select('+password');
    if (!fullUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await fullUser.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
    }

    fullUser.password = newPassword;
    await fullUser.save();

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to change password' }, { status: 500 });
  }
}
