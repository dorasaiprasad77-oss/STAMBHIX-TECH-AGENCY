import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { NextRequest } from 'next/server';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Please define the JWT_SECRET environment variable');
  }
  return secret;
}

export function signToken(userId: string): string {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string & jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): { id: string } {
  return jwt.verify(token, getJwtSecret()) as { id: string };
}

export async function getAuthUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
}
