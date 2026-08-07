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
  const ids = [2, 9, 90, 68, 65, 35];

  for (let i = 0; i < ids.length; i++) {
    const pId = ids[i];
    await prisma.homePortfolio.upsert({
      where: { portfolioId: pId },
      update: { order: i + 1 },
      create: { portfolioId: pId, order: i + 1 },
    });
  }
  
  console.log('Successfully seeded HomePortfolio.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
