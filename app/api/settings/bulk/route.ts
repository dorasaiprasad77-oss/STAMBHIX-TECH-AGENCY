import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SiteSetting from '@/lib/db/models/SiteSetting';
import { getAuthUser } from '@/lib/db/jwt';

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
    const { settings } = body;

    if (!Array.isArray(settings) || settings.length === 0) {
      return NextResponse.json(
        { message: 'No settings provided' },
        { status: 400 }
      );
    }

    // Bulk upsert settings
    const operations = settings.map((s: { key: string; label: string; value: unknown; description?: string }) => ({
      updateOne: {
        filter: { key: s.key },
        update: {
          $set: {
            key: s.key,
            label: s.label || s.key,
            value: s.value,
            description: s.description || '',
          },
        },
        upsert: true,
      },
    })) as any;

    await SiteSetting.bulkWrite(operations);

    // Return updated settings
    const updatedSettings = await SiteSetting.find().sort({ key: 1 });
    const map: Record<string, unknown> = {};
    updatedSettings.forEach((s) => {
      map[s.key] = s.value;
    });

    return NextResponse.json({
      message: 'Settings saved successfully',
      data: updatedSettings,
      map,
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { message: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
