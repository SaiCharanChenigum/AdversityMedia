import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.websiteData.findUnique({
      where: { key: 'clients_industries' }
    });

    if (data) {
      return NextResponse.json(JSON.parse(data.value));
    } else {
      // Default industries
      return NextResponse.json([
        { id: 'hospitality', label: 'Hospitality' },
        { id: 'healthcare', label: 'Healthcare' },
        { id: 'education', label: 'Education' },
        { id: 'retail', label: 'Retail & E-commerce' },
        { id: 'technology', label: 'Technology' },
        { id: 'fashion', label: 'Fashion & Lifestyle' }
      ]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await prisma.websiteData.upsert({
      where: { key: 'clients_industries' },
      update: { value: JSON.stringify(data) },
      create: { key: 'clients_industries', value: JSON.stringify(data) }
    });

    return NextResponse.json({ message: 'Industries updated successfully' });
  } catch (error) {
    console.error('Update industries error:', error);
    return NextResponse.json({ error: 'Failed to update industries' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industryId = searchParams.get('id');

    if (!industryId) {
      return NextResponse.json({ error: 'Industry ID is required' }, { status: 400 });
    }

    // 1. Delete all clients with this industry
    await prisma.client.deleteMany({
      where: { industry: industryId }
    });

    // 2. Remove industry from WebsiteData
    const data = await prisma.websiteData.findUnique({
      where: { key: 'clients_industries' }
    });
    
    if (data) {
      let industries = JSON.parse(data.value);
      industries = industries.filter((ind: any) => ind.id !== industryId);
      
      await prisma.websiteData.update({
        where: { key: 'clients_industries' },
        data: { value: JSON.stringify(industries) }
      });
    }

    return NextResponse.json({ message: 'Industry and related clients deleted successfully' });
  } catch (error) {
    console.error('Delete industry error:', error);
    return NextResponse.json({ error: 'Failed to delete industry' }, { status: 500 });
  }
}
