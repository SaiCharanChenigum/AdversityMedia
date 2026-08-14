import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.author || !data.text || !data.imageUrl) {
      return NextResponse.json({ error: 'Author, text, and imageUrl are required' }, { status: 400 });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        author: data.author,
        text: data.text,
        company: data.company || null,
        imageUrl: data.imageUrl,
        rating: data.rating || 5
      }
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.id || !data.author || !data.text || !data.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: data.id },
      data: {
        author: data.author,
        text: data.text,
        company: data.company || null,
        imageUrl: data.imageUrl,
        rating: data.rating || 5
      }
    });

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
