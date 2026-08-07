import fs from 'fs';

const html = fs.readFileSync('../clients.html', 'utf8');

// Regex to find each client block
const clientBlockRegex = /<div class="[^"]*client-item"[^>]*data-industry="([^"]*)"[\s\S]*?<img src="assets\/images\/clients\/([^"]+)"[^>]*>[\s\S]*?<h4 class="client-name">([^<]*)<\/h4>\s*<p class="client-category">([^<]*)<\/p>\s*<div class="client-services">([\s\S]*?)<\/div>/g;

let match;
const clients = [];

while ((match = clientBlockRegex.exec(html)) !== null) {
  const industry = match[1].trim();
  const imageFile = match[2].trim();
  const name = match[3].trim();
  const category = match[4].trim();
  
  const servicesHtml = match[5];
  const serviceRegex = /<span class="service-tag">([^<]*)<\/span>/g;
  let serviceMatch;
  const services = [];
  while ((serviceMatch = serviceRegex.exec(servicesHtml)) !== null) {
    services.push(serviceMatch[1].trim());
  }

  // Cloudinary URL conversion
  // We assume the user uploaded the exact filenames to the folder "Adversity-media client logos"
  // E.g. pack.jpg -> https://res.cloudinary.com/deftcnxf/image/upload/v1/Adversity-media%20client%20logos/pack.jpg
  // Actually, sometimes Cloudinary changes extensions or casing. Let's use the exact filename.
  const logoUrl = `https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/${imageFile}`;

  clients.push({
    name,
    category,
    industry,
    logoUrl,
    services
  });
}

const seedScript = `
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const clients = ${JSON.stringify(clients, null, 2)};

  console.log('Seeding ' + clients.length + ' clients...');

  // Optional: clear existing clients
  await prisma.client.deleteMany();

  for (const c of clients) {
    await prisma.client.create({
      data: c
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

fs.writeFileSync('seed-clients.ts', seedScript);
console.log('Generated seed-clients.ts with ' + clients.length + ' clients.');
