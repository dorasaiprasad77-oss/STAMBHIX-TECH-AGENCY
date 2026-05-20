import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/db/jwt';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';

export async function getAuthUser(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  const token = header.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    await dbConnect();
    const user = await UserModel.findById(decoded.id);
    return user;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return { user: null, response: unauthorized() };
  }
  return { user, response: null };
}
