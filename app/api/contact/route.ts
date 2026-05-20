import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import ContactModel from '@/lib/db/models/Contact';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, service, message } = await req.json();

    if (!name || name.length < 2) return NextResponse.json({ message: 'Name must be at least 2 characters' }, { status: 400 });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    if (!message || message.length < 10) return NextResponse.json({ message: 'Message must be at least 10 characters' }, { status: 400 });

    const contact = await ContactModel.create({
      name, email, service: service || 'other', message,
    });

    console.log(`📧 New contact inquiry from ${name} <${email}>: ${message.substring(0, 100)}...`);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you within 24 hours.",
      id: contact._id,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to submit contact form' }, { status: 500 });
  }
}
