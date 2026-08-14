import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const homePortfolios = await prisma.homePortfolio.findMany({
      include: { portfolio: true },
      orderBy: { order: 'asc' }
    });

    const limitData = await prisma.websiteData.findUnique({
      where: { key: 'home_portfolio_limit' }
    });

    return NextResponse.json({
      homePortfolios,
      limit: limitData ? parseInt(limitData.value) || 6 : 6
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch home portfolio config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { portfolios, limit } = await req.json();

    if (limit) {
      await prisma.websiteData.upsert({
        where: { key: 'home_portfolio_limit' },
        update: { value: limit.toString() },
        create: { key: 'home_portfolio_limit', value: limit.toString() }
      });
    }

    if (portfolios && Array.isArray(portfolios)) {
      // Use transaction to delete all and insert new ones
      await prisma.$transaction(async (tx) => {
        await tx.homePortfolio.deleteMany();
        
        for (let i = 0; i < portfolios.length; i++) {
          if (portfolios[i]) {
            await tx.homePortfolio.create({
              data: {
                portfolioId: portfolios[i],
                order: i + 1 // 1-indexed order (1 to 6)
              }
            });
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save home portfolio config" }, { status: 500 });
  }
}
