import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const statsData = await prisma.websiteData.findUnique({
      where: { key: 'clients_stats' }
    });

    if (statsData) {
      return NextResponse.json(JSON.parse(statsData.value));
    } else {
      // Default stats if none exist
      return NextResponse.json({
        happyClients: '50',
        industriesServed: '15',
        satisfaction: '98',
        repeatClients: '85'
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await prisma.websiteData.upsert({
      where: { key: 'clients_stats' },
      update: { value: JSON.stringify(data) },
      create: { key: 'clients_stats', value: JSON.stringify(data) }
    });

    return NextResponse.json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Update stats error:', error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}
