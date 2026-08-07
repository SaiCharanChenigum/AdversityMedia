import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { portfolioData } from './src/data/portfolioData'

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_rPnqCVtXH1d2@ep-broad-brook-ay3f39jj-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log(`Start seeding ${portfolioData.length} portfolio items...`)
  
  // To avoid duplicates or issues, we can clear the table or use upsert
  // We'll use createMany for simplicity, assuming the table is empty
  // Or upsert to be safe if running multiple times.
  
  for (const item of portfolioData) {
    await prisma.portfolio.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        category: item.category,
        subcategory: item.subcategory || null,
        image: item.image,
        description: item.description || null,
        technologies: item.technologies || [],
        liveUrl: item.liveUrl || null,
      },
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        subcategory: item.subcategory || null,
        image: item.image,
        description: item.description || null,
        technologies: item.technologies || [],
        liveUrl: item.liveUrl || null,
      },
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
