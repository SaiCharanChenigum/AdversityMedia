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
  const htmlPath = 'C:/Users/cheni/OneDrive/Desktop/LifeAdversity Media/clients.html';
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Hardcoded mappings based on what we saw in clients.html vs Cloudinary
  // The ones actually defined in clients.html we will map manually based on the image name:
  // e.g. <img src="assets/images/testimonials/client1.jpg" alt="Client" class="author-image">
  
  // We'll extract all blocks of <div class="testimonial-card">
  const blocks = html.split('class="testimonial-card"');
  // First block is before the first card, skip it.
  blocks.shift();

  const testimonials = [];

  for (const block of blocks) {
    const textMatch = block.match(/<p class="testimonial-text">([\s\S]*?)<\/p>/);
    const authorMatch = block.match(/<h5>([^<]+)<\/h5>/);
    const companyMatch = block.match(/<span>([^<]+)<\/span>/);
    const imageMatch = block.match(/<img src="assets\/images\/testimonials\/([^"]+)"/);
    const ratingMatch = block.match(/class="testimonial-rating">([\s\S]*?)<\/div>/);
    
    if (textMatch && authorMatch) {
      let ratingCount = 5;
      if (ratingMatch) {
        ratingCount = (ratingMatch[1].match(/fa-star/g) || []).length;
      }
      
      const localImageName = imageMatch ? imageMatch[1] : ''; // e.g. client1.jpg
      const author = authorMatch[1].trim();
      const company = companyMatch ? companyMatch[1].trim() : null;
      let text = textMatch[1].trim().replace(/^"|"$/g, '').trim(); // remove quotes
      
      testimonials.push({
        text,
        author,
        company,
        rating: ratingCount,
        localImageName
      });
    }
  }

  // Get cloudinary URLs for testimonials
  console.log("Fetching testimonial images from Cloudinary...");
  const result = await cloudinary.search
    .expression('folder:"Adversity-media client testinominal images" OR folder:"Adversity-media client logos"') // The user uploaded to root or folder? Wait, the user said "i had uploaded alll testinimonal client images to cloudinary"
    // Let's just search everything recent since we know their names
    .sort_by('created_at', 'desc')
    .max_results(50)
    .execute();

  const cloudUrls = result.resources.map(r => r.secure_url);

  console.log(`Found ${testimonials.length} testimonials in HTML`);

  // Clear existing testimonials
  await prisma.testimonial.deleteMany();

  for (const t of testimonials) {
    // try to match localImageName to Cloudinary
    let matchedUrl = 'https://via.placeholder.com/150'; // default placeholder
    if (t.localImageName) {
      const baseName = t.localImageName.replace(/\.[^/.]+$/, ""); // e.g. client1
      const found = cloudUrls.find(url => url.toLowerCase().includes(baseName.toLowerCase()));
      if (found) {
        matchedUrl = found;
      } else {
        console.warn(`WARNING: Cloudinary URL not found for ${t.localImageName}`);
      }
    }
    
    await prisma.testimonial.create({
      data: {
        text: t.text,
        author: t.author,
        company: t.company,
        rating: t.rating,
        imageUrl: matchedUrl
      }
    });
    console.log(`Seeded testimonial from ${t.author}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
