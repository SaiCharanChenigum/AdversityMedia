import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Failed to fetch portfolios", error);
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newPortfolio = await prisma.portfolio.create({
      data: {
        title: data.title,
        category: data.category,
        subcategory: data.subcategory || null,
        image: data.image,
        description: data.description || null,
        technologies: data.technologies || [],
        liveUrl: data.liveUrl || null,
      }
    });
    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json(newPortfolio);
  } catch (error) {
    console.error("Failed to create portfolio", error);
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.portfolio.update({
      where: { id: Number(id) },
      data: updateData
    });
    
    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update portfolio", error);
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.portfolio.delete({
      where: { id: Number(id) }
    });
    
    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete portfolio", error);
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
  }
}
