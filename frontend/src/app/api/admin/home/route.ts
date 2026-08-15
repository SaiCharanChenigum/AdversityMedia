import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    const websiteData = await prisma.websiteData.findMany();
    const siteData = websiteData.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      heroVideoUrl: settings?.heroVideoUrl || '',
      aboutImageUrl: settings?.aboutImageUrl || '',
      ceoImageUrl: settings?.ceoImageUrl || '',
      primaryColor: settings?.primaryColor || '#2B4C8F',
      secondaryColor: settings?.secondaryColor || '#FF8C42',
      headerLogo: siteData.headerLogo || '',
      footerLogo: siteData.footerLogo || '',
      yearsOfExcellence: siteData.yearsOfExcellence || '5',
      projectsCompleted: siteData.projectsCompleted || '100',
      inHandProjects: siteData.inHandProjects || '10',
      happyClients: siteData.happyClients || '20',
      awardsWon: siteData.awardsWon || '10',
      contactNumber: siteData.contactNumber || '+91 7330924511',
      email: siteData.email || 'adversitymedia.in@gmail.com',
      location: siteData.location || 'Hyderabad, India',
      socialLinks: siteData.socialLinks || '{}',
      services: siteData.services || '[]',
    });
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      heroVideoUrl,
      aboutImageUrl,
      ceoImageUrl,
      primaryColor,
      secondaryColor,
      headerLogo,
      footerLogo,
      yearsOfExcellence,
      projectsCompleted,
      inHandProjects,
      happyClients,
      awardsWon,
      contactNumber,
      email,
      location,
      socialLinks,
      services,
    } = body;

    // Update SiteSettings
    const existingSettings = await prisma.siteSettings.findFirst();
    if (existingSettings) {
      await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: { heroVideoUrl, aboutImageUrl, ceoImageUrl, primaryColor, secondaryColor },
      });
    } else {
      await prisma.siteSettings.create({
        data: { heroVideoUrl, aboutImageUrl, ceoImageUrl, primaryColor, secondaryColor },
      });
    }

    // Upsert all WebsiteData key-value pairs
    const kvPairs: Record<string, string> = {
      headerLogo,
      footerLogo,
      yearsOfExcellence,
      projectsCompleted,
      inHandProjects,
      happyClients,
      awardsWon,
      contactNumber,
      email,
      location,
      socialLinks: typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks),
      services: typeof services === 'string' ? services : JSON.stringify(services),
    };

    for (const [key, value] of Object.entries(kvPairs)) {
      if (value !== undefined && value !== null) {
        await prisma.websiteData.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
