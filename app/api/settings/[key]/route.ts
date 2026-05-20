import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SiteSettingModel from '@/lib/db/models/SiteSetting';
import { getAuthUser } from '@/lib/db/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const setting = await SiteSettingModel.findOneAndUpdate(
      { key: (await params).key },
      { $set: { value: data.value, label: data.label, type: data.type, description: data.description } },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ data: setting, message: 'Setting saved' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to save setting' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    await SiteSettingModel.findOneAndDelete({ key: (await params).key });
    return NextResponse.json({ message: 'Setting deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete setting' }, { status: 500 });
  }
}
