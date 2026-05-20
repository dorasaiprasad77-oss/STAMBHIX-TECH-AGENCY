import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ message: 'Email, token, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
      email,
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error: any) {
    console.error('Reset password error:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
