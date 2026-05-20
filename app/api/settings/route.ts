import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SiteSettingModel from '@/lib/db/models/SiteSetting';
import { getAuthUser } from '@/lib/db/jwt';

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettingModel.find().sort({ key: 1 });
    return NextResponse.json({ data: settings });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const setting = await SiteSettingModel.create(data);
    return NextResponse.json({ data: setting, message: 'Setting created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create setting' }, { status: 500 });
  }
}
