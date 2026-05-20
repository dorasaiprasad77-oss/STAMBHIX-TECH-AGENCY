import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import MemoryModel from '@/lib/db/models/Memory';
import { getAuthUser } from '@/lib/db/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    await dbConnect();
    const memory = await MemoryModel.findOne({ _id: (await params).id, user: authUser._id });
    if (!memory) return NextResponse.json({ message: 'Memory not found' }, { status: 404 });

    const wordCount = memory.content.split(/\s+/).length;
    const sentences = memory.content.split(/[.!?]+/).filter(Boolean);
    const words = memory.content.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'a', 'an', 'is', 'was', 'are', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'and', 'or', 'but', 'it', 'this', 'that', 'i', 'we', 'you', 'he', 'she', 'they']);
    const wordFreq: Record<string, number> = {};
    words.forEach((w) => {
      if (!commonWords.has(w) && w.length > 2) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
    const topWords = Object.entries(wordFreq).sort(([, a], [, b]) => b - a).slice(0, 5).map(([w]) => w);

    const summary = sentences.length > 1
      ? `This ${memory.type} contains ${wordCount} words across ${sentences.length} sentences. Key themes: ${topWords.join(', ')}. ${sentences.slice(0, 2).join('. ')}.`
      : `A ${memory.type} with ${wordCount} words. Key topics: ${topWords.join(', ')}.`;

    memory.aiSummary = summary;
    memory.aiTags = topWords;
    await memory.save();

    return NextResponse.json({ message: 'Analysis complete', analysis: { summary, tags: topWords } });
  } catch (error: any) {
    return NextResponse.json({ message: 'Analysis failed' }, { status: 500 });
  }
}
