import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const videos = await prisma.videoPortfolio.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch video portfolios", error);
    return NextResponse.json({ error: 'Failed to fetch video portfolios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newVideo = await prisma.videoPortfolio.create({
      data: {
        title: data.title,
        category: data.category,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        description: data.description || null,
        technologies: data.technologies || [],
      }
    });
    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Failed to create video portfolio", error);
    return NextResponse.json({ error: 'Failed to create video portfolio' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.videoPortfolio.update({
      where: { id: Number(id) },
      data: updateData
    });
    
    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update video portfolio", error);
    return NextResponse.json({ error: 'Failed to update video portfolio' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.videoPortfolio.delete({
      where: { id: Number(id) }
    });
    
    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete video portfolio", error);
    return NextResponse.json({ error: 'Failed to delete video portfolio' }, { status: 500 });
  }
}
