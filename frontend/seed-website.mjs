import { PrismaClient } from '@prisma/client';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const initialData = [
    { key: 'yearsOfExcellence', value: '5' },
    { key: 'projectsCompleted', value: '100' },
    { key: 'inHandProjects', value: '10' },
    { key: 'happyClients', value: '20' },
    { key: 'awardsWon', value: '10' },
    { key: 'contactNumber', value: '+91 7330924511' },
    { key: 'email', value: 'adversitymedia.in@gmail.com' },
    { key: 'location', value: 'Hyderabad, India' },
    {
      key: 'socialLinks',
      value: JSON.stringify({
        facebook: 'https://facebook.com/adversitymedia',
        instagram: 'https://instagram.com/adversitymedia',
        linkedin: 'https://linkedin.com/company/adversitymedia',
        twitter: 'https://twitter.com/adversitymedia',
      }),
    },
    {
      key: 'services',
      value: JSON.stringify([
        { id: 'seo', label: 'SEO Services', icon: 'fa-search' },
        { id: 'web-design', label: 'Web Development', icon: 'fa-laptop-code' },
        { id: 'digital-marketing', label: 'Digital Marketing', icon: 'fa-bullhorn' },
        { id: 'branding', label: 'Branding Services', icon: 'fa-paint-brush' },
        { id: 'mobile-apps', label: 'Mobile Apps', icon: 'fa-mobile-alt' },
        { id: 'ui-ux', label: 'UI/UX Design', icon: 'fa-object-group' },
        { id: 'social-media', label: 'Social Media Marketing', icon: 'fa-share-alt' },
        { id: 'other', label: 'Other', icon: 'fa-ellipsis-h' },
      ]),
    },
  ];

  for (const item of initialData) {
    await prisma.websiteData.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: { key: item.key, value: item.value },
    });
  }
  
  console.log('Successfully seeded WebsiteData.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
