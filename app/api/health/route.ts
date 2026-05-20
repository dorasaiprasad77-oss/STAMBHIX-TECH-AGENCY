import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
