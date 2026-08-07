import 'dotenv/config';
import prisma from './src/lib/db.ts';

async function main() {
  await prisma.websiteData.upsert({
    where: { key: 'headerLogo' },
    update: { value: 'https://res.cloudinary.com/deftcnxf/image/upload/v1786121239/adversity-media-logo_gzo2wo.png' },
    create: { key: 'headerLogo', value: 'https://res.cloudinary.com/deftcnxf/image/upload/v1786121239/adversity-media-logo_gzo2wo.png' },
  });

  await prisma.websiteData.upsert({
    where: { key: 'footerLogo' },
    update: { value: 'https://res.cloudinary.com/deftcnxf/image/upload/v1786121239/adversity-media-logo-white_ig4i8l.png' },
    create: { key: 'footerLogo', value: 'https://res.cloudinary.com/deftcnxf/image/upload/v1786121239/adversity-media-logo-white_ig4i8l.png' },
  });

  console.log('Logos seeded successfully!');
}

main().catch(console.error).finally(() => process.exit(0));
