import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_CATEGORIES = [
  { id: 'branding', label: 'Branding & Design', subcategories: [
    { id: 'education', label: 'Education' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'spa-wellness', label: 'Spa & Wellness' },
    { id: 'food-beverage', label: 'Food & Beverage' }
  ]},
  { id: 'digital-marketing', label: 'Digital Marketing', subcategories: [] },
  { id: 'social-media', label: 'Social Media', subcategories: [] },
  { id: 'websites', label: 'Website Development', subcategories: [] },
  { id: 'mobile', "label": 'Mobile Applications', subcategories: [] }
];

export async function GET() {
  try {
    const data = await prisma.websiteData.findUnique({
      where: { key: 'portfolio_categories' }
    });

    if (data && data.value) {
      return NextResponse.json(JSON.parse(data.value));
    }

    // Seed default if not exists
    await prisma.websiteData.create({
      data: {
        key: 'portfolio_categories',
        value: JSON.stringify(DEFAULT_CATEGORIES)
      }
    });

    return NextResponse.json(DEFAULT_CATEGORIES);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const categories = await req.json();
    
    await prisma.websiteData.upsert({
      where: { key: 'portfolio_categories' },
      update: { value: JSON.stringify(categories) },
      create: { key: 'portfolio_categories', value: JSON.stringify(categories) }
    });

    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save categories" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // 1. Delete associated projects
    if (subcategoryId) {
      await prisma.portfolio.deleteMany({
        where: { category: categoryId, subcategory: subcategoryId }
      });
      // Assuming VideoPortfolio doesn't use subcategories, but just in case
      await prisma.videoPortfolio.deleteMany({
        where: { category: categoryId, description: { contains: subcategoryId } } // We don't have subcategory in VideoPortfolio schema
      });
    } else {
      await prisma.portfolio.deleteMany({
        where: { category: categoryId }
      });
      await prisma.videoPortfolio.deleteMany({
        where: { category: categoryId }
      });
    }

    // 2. Remove from JSON
    const data = await prisma.websiteData.findUnique({ where: { key: 'portfolio_categories' } });
    if (data) {
      let categories = JSON.parse(data.value);
      
      if (subcategoryId) {
        // Remove subcategory
        categories = categories.map((cat: any) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              subcategories: cat.subcategories.filter((sub: any) => sub.id !== subcategoryId)
            };
          }
          return cat;
        });
      } else {
        // Remove main category
        categories = categories.filter((cat: any) => cat.id !== categoryId);
      }

      await prisma.websiteData.update({
        where: { key: 'portfolio_categories' },
        data: { value: JSON.stringify(categories) }
      });
      
      return NextResponse.json({ success: true, categories });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
