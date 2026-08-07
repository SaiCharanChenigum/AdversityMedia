import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching images from Cloudinary...");
  const result = await cloudinary.search
    .expression('')
    .sort_by('created_at', 'desc')
    .max_results(30)
    .execute();

  const cloudUrls = result.resources.map(r => r.secure_url);
  console.log("Found " + cloudUrls.length + " recent uploads.");

  const clients = await prisma.client.findMany();
  let updated = 0;

  for (const client of clients) {
    // The previous logoUrl was set to something like:
    // https://res.cloudinary.com/.../pack.jpg
    const oldFileNameMatch = client.logoUrl.match(/\/([^\/]+)\.[a-z0-9]+$/i);
    if (!oldFileNameMatch) continue;

    // the old name without extension, e.g. "pack"
    const oldName = oldFileNameMatch[1].toLowerCase();

    // Find the corresponding URL in the recent uploads
    // Recent uploads have names like pack_jsbwml.png
    const matchingCloudUrl = cloudUrls.find(url => {
      const match = url.match(/\/([^\/]+)\.[a-z0-9]+$/i);
      if (!match) return false;
      // Cloudinary adds _xxxxxx at the end, so we check if it starts with oldName + "_"
      const newName = match[1].toLowerCase();
      // e.g. pack_jsbwml starts with pack_
      // or exactly equal if no unique id was added
      return newName.startsWith(oldName + '_') || newName === oldName || (oldName === 'pnkt' && newName.startsWith('pnkt'));
    });

    if (matchingCloudUrl) {
      await prisma.client.update({
        where: { id: client.id },
        data: { logoUrl: matchingCloudUrl }
      });
      console.log(`Updated client ${client.name} with ${matchingCloudUrl}`);
      updated++;
    } else {
      console.log(`No match found for ${client.name} (searched for ${oldName})`);
    }
  }

  console.log(`Updated ${updated} client logos successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
