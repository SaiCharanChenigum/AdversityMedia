import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.logoUrl) {
      return NextResponse.json({ error: 'Name and Logo are required' }, { status: 400 });
    }

    const newClient = await prisma.client.create({
      data: {
        name: data.name,
        category: data.category || null,
        industry: data.industry || null,
        logoUrl: data.logoUrl,
        description: data.description || null,
        services: data.services || [],
        websiteUrl: data.websiteUrl || null,
      }
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.id || !data.name || !data.logoUrl) {
      return NextResponse.json({ error: 'ID, Name, and Logo are required' }, { status: 400 });
    }

    const updatedClient = await prisma.client.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category || null,
        industry: data.industry || null,
        logoUrl: data.logoUrl,
        description: data.description || null,
        services: data.services || [],
        websiteUrl: data.websiteUrl || null,
      }
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
