import React from 'react';
import PortfolioClient from './PortfolioClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensures it fetches latest data instead of caching permanently during build

export default async function PortfolioPage() {
  // Fetch portfolio items from Neon DB via Prisma
  const portfolios = await prisma.portfolio.findMany({
    orderBy: {
      id: 'asc' // Maintain original ordering
    }
  });

  const videos = await prisma.videoPortfolio.findMany({
    orderBy: {
      id: 'asc'
    }
  });
  
  return <PortfolioClient initialData={portfolios} videoData={videos} />;
}
