import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const videos = [
    {
        title: "Ad Reel",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035735/ad-reel-12-08-25_g1tdpl.mp4",
        technologies: ["Video Editing", "Advertising"]
    },
    {
        title: "Aditya Wipro Video",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035745/aditya-wipro-video-2_pepuev.mp4",
        technologies: ["Corporate Video"]
    },
    {
        title: "Ameya Teachers Day",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035749/ameya-teachers-day_n03tq7.mp4",
        technologies: ["Event Coverage"]
    },
    {
        title: "Ganesh Offer",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035758/ganesh-offer_nezo5z.mp4",
        technologies: ["Promotional Video"]
    },
    {
        title: "Hello Kids Field Trip",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035751/hello-kids-field-trip_plxjjz.mp4",
        technologies: ["School Video"]
    },
    {
        title: "Hello Kids Rhyme Recitation",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035749/hello-kids-rhyme-recitation_c3odcv.mp4",
        technologies: ["School Video"]
    },
    {
        title: "Krafteria Brand Promo",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035758/krafteria-brand-promo_ya03qf.mp4",
        technologies: ["Brand Promo"]
    },
    {
        title: "Krafteria Laxmi Reel",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035746/krafteria-laxmi-reel-final-1_c8v6hu.mp4",
        technologies: ["Social Media Reel"]
    },
    {
        title: "Zuzus Ad Reel",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035747/zuzus-add-reel-31-10-25_eb9ion.mp4",
        technologies: ["Food Marketing"]
    },
    {
        title: "Zuzus Pizza Celebration",
        category: "videos",
        videoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1786035762/zuzus-pitsa-celebration_ckv4ob.mp4",
        technologies: ["Food Marketing"]
    }
];

async function main() {
    console.log('Seeding videos...');
    // Delete existing videos to avoid duplicates if run multiple times
    await prisma.videoPortfolio.deleteMany({});
    
    for (const video of videos) {
        await prisma.videoPortfolio.create({
            data: video
        });
        console.log(`Added: ${video.title}`);
    }
    console.log('Video seeding complete!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
