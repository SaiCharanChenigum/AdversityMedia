import { prisma } from './src/lib/prisma';
import { portfolioData } from './src/data/portfolioData';

async function main() {
    console.log("Starting migration...");
    let updatedCount = 0;
    for (const item of portfolioData) {
        if (item.category === 'branding' && item.subcategory) {
            const res = await prisma.portfolio.updateMany({
                where: {
                    title: item.title,
                },
                data: {
                    subcategory: item.subcategory,
                }
            });
            if (res.count > 0) {
                console.log(`Updated: ${item.title} -> ${item.subcategory}`);
                updatedCount += res.count;
            }
        }
    }
    console.log(`Migration complete! Updated ${updatedCount} items.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
