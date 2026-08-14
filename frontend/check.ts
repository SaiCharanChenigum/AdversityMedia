import { prisma } from './src/lib/prisma';

async function main() {
    const all = await prisma.portfolio.findMany({
        where: {
            title: {
                contains: 'Sun',
                mode: 'insensitive'
            }
        }
    });
    console.log("Matching projects:");
    console.log(all.map(p => ({ title: p.title, category: p.category, subcategory: p.subcategory })));
}
main().finally(() => prisma.$disconnect());
