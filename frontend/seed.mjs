import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
})
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.siteSettings.create({
    data: {
      heroVideoUrl: "https://res.cloudinary.com/deftcnxf/video/upload/v1785946599/Adversity_media_hero_video_gulfsh.mp4"
    }
  });
  console.log("Seeded database");
}
main().finally(() => prisma.$disconnect());
