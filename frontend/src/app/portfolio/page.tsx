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

  const categoriesData = await prisma.websiteData.findUnique({
    where: { key: 'portfolio_categories' }
  });

  let categories = [];
  if (categoriesData && categoriesData.value) {
    categories = JSON.parse(categoriesData.value);
  } else {
    categories = [
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
      { id: 'mobile', label: 'Mobile Applications', subcategories: [] }
    ];
  }
  
  const statsData = await prisma.websiteData.findUnique({
    where: { key: 'portfolio_stats_config' }
  });

  let statsConfig = ['all', 'social-media', 'digital-marketing', 'branding'];
  if (statsData && statsData.value) {
    try {
      statsConfig = JSON.parse(statsData.value);
    } catch (e) {
      console.error("Failed to parse stats config", e);
    }
  }
  
  return <PortfolioClient initialData={portfolios} videoData={videos} categories={categories} statsConfig={statsConfig} />;
}
