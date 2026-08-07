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
      aboutImageUrl: "https://res.cloudinary.com/deftcnxf/image/upload/v1785948120/Adersitymedia_Get_to_know_us_n9sd8m.jpg"
    }
  });
  console.log("Updated aboutImageUrl in database");
}
main().finally(() => prisma.$disconnect());
