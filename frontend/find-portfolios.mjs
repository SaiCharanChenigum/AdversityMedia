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
  const identifiers = [
    '18a5aa58',
    '72ff2fa8',
    'af63635a',
    '7ac44cf2',
    '3d9c8177',
    '28af1970'
  ];

  for (const id of identifiers) {
    const item = await prisma.portfolio.findFirst({
      where: {
        image: {
          contains: id
        }
      }
    });
    if (item) {
      console.log(`Found ${id}: ID=${item.id}, Title="${item.title}"`);
    } else {
      console.log(`NOT FOUND: ${id}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
