import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.blog.update({
    where: { id: 1 },
    data: { imageUrl: 'https://res.cloudinary.com/deftcnxf/image/upload/v1786069328/blog-pic-1_r7cynh.jpg' }
  });
  console.log('Fixed first blog image');
}

main().catch(console.error).finally(() => prisma.$disconnect());
