import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.title || !data.content || !data.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBlog = await prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        hiddenContent: data.hiddenContent || null,
        author: data.author || 'Adversity Media',
      }
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.id || !data.title || !data.content || !data.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        hiddenContent: data.hiddenContent || null,
        author: data.author || 'Adversity Media',
      }
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll');

    if (deleteAll === 'true') {
      await prisma.blog.deleteMany({});
      return NextResponse.json({ message: 'All blogs deleted successfully' });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.blog.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
