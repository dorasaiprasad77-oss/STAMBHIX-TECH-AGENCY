import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/db/jwt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    if (!files || files.length === 0) return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });

    const images = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await writeFile(filepath, buffer);
        return { url: `/uploads/${filename}`, filename, size: file.size, mimetype: file.type };
      })
    );

    return NextResponse.json({
      message: `${images.length} images uploaded successfully`,
      images,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Upload failed' }, { status: 500 });
  }
}
