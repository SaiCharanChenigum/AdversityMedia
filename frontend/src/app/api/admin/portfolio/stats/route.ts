import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_STATS = ['all', 'social-media', 'digital-marketing', 'branding'];

export async function GET() {
  try {
    const data = await prisma.websiteData.findUnique({
      where: { key: 'portfolio_stats_config' }
    });

    if (data && data.value) {
      return NextResponse.json(JSON.parse(data.value));
    }

    return NextResponse.json(DEFAULT_STATS);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stats config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const stats = await req.json();
    
    // Ensure it's exactly 4 items
    if (!Array.isArray(stats) || stats.length !== 4) {
        return NextResponse.json({ error: "Stats config must have exactly 4 items" }, { status: 400 });
    }

    await prisma.websiteData.upsert({
      where: { key: 'portfolio_stats_config' },
      update: { value: JSON.stringify(stats) },
      create: { key: 'portfolio_stats_config', value: JSON.stringify(stats) }
    });

    return NextResponse.json({ success: true, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save stats config" }, { status: 500 });
  }
}
