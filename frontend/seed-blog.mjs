import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const htmlPath = 'C:/Users/cheni/OneDrive/Desktop/LifeAdversity Media/blog.html';
  const html = fs.readFileSync(htmlPath, 'utf8');

  const blocks = html.split('<article class="blog-card">');
  blocks.shift(); // First block is before the first article

  const blogs = [];

  for (const block of blocks) {
    const titleMatch = block.match(/<h2>([^<]+)<\/h2>/);
    const textMatch = block.match(/<h2>.*?<\/h2>\s*<p>([\s\S]*?)<\/p>/);
    const hiddenTextMatch = block.match(/<div class="hidden-section">\s*<p>([\s\S]*?)<\/p>/);
    const imageMatch = block.match(/<img src="assets\/images\/blog\/([^"]+)"/);
    
    // Find gallery images
    const galleryImages = [];
    const galleryBlockMatch = block.match(/<div class="mini-gallery">([\s\S]*?)<\/div>/);
    if (galleryBlockMatch) {
      const galleryBlock = galleryBlockMatch[1];
      const imgRegex = /<img src="([^"]+)"/g;
      let match;
      while ((match = imgRegex.exec(galleryBlock)) !== null) {
        galleryImages.push(match[1]);
      }
    }

    if (titleMatch && textMatch) {
      const localImageName = imageMatch ? imageMatch[1] : ''; // e.g. blog-pic-1.jpg
      const title = titleMatch[1].trim();
      const content = textMatch[1].trim();
      const hiddenContent = hiddenTextMatch ? hiddenTextMatch[1].trim() : null;
      
      blogs.push({
        title,
        content,
        hiddenContent,
        galleryImages,
        localImageName
      });
    }
  }

  // Get cloudinary URLs for blogs
  console.log("Fetching blog images from Cloudinary...");
  const result = await cloudinary.search
    .expression('folder:"Adversity-media blog images"')
    .sort_by('created_at', 'desc')
    .max_results(30)
    .execute();

  const cloudUrls = result.resources.map(r => r.secure_url);

  console.log(`Found ${blogs.length} blogs in HTML`);

  // Clear existing blogs
  await prisma.blog.deleteMany();

  for (const b of blogs) {
    let matchedUrl = 'https://via.placeholder.com/800x400';
    if (b.localImageName) {
      const baseName = b.localImageName.replace(/\.[^/.]+$/, ""); // e.g. blog-pic-1
      const found = cloudUrls.find(url => url.toLowerCase().includes(baseName.toLowerCase()));
      if (found) {
        matchedUrl = found;
      } else {
        console.warn(`WARNING: Cloudinary URL not found for ${b.localImageName}`);
      }
    }
    
    await prisma.blog.create({
      data: {
        title: b.title,
        content: b.content,
        hiddenContent: b.hiddenContent,
        galleryImages: b.galleryImages,
        imageUrl: matchedUrl,
        author: 'Adversity Media'
      }
    });
    console.log(`Seeded blog: ${b.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
