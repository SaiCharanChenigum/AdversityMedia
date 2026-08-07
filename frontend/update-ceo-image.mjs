import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
})
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.siteSettings.updateMany({
    data: {
      ceoImageUrl: "https://res.cloudinary.com/deftcnxf/image/upload/v1785948438/Adversitymedia_CEO_wabktg.jpg"
    }
  });
  console.log("Updated ceoImageUrl in database");
}
main().finally(() => prisma.$disconnect());
