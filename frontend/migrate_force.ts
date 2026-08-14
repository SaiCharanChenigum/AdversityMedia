import fs from 'fs';
import path from 'path';
import { prisma } from './src/lib/prisma';

async function main() {
    console.log("Starting forced subcategory migration...");
    const filePath = path.join(__dirname, '..', 'portfolio.js');
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const domIndex = content.indexOf('document.addEventListener');
    if (domIndex !== -1) {
        content = content.substring(0, domIndex);
    }
    
    const tempPath = path.join(__dirname, 'temp_portfolio_force.js');
    content += '\nmodule.exports = portfolioData;';
    fs.writeFileSync(tempPath, content);
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const portfolioData = require('./temp_portfolio_force.js');
    
    let updatedCount = 0;
    
    for (const item of portfolioData) {
        let finalCategory = item.category;
        let finalSubcategory = item.subcategory || null;

        if (finalSubcategory === 'helathcare') finalSubcategory = 'healthcare';

        const brandingSubcategories = ['real-estate', 'spa-wellness', 'healthcare', 'education', 'food-beverage'];
        
        // If it has a subcategory that belongs to Branding, force the category to Branding
        if (finalSubcategory && brandingSubcategories.includes(finalSubcategory)) {
            finalCategory = 'branding';
        } else if (finalSubcategory && ['branding', 'digital-marketing', 'social-media', 'websites', 'mobile'].includes(finalSubcategory)) {
            // If the subcategory was actually meant to be a category
            finalCategory = finalSubcategory;
            finalSubcategory = null;
        }

        const res = await prisma.portfolio.updateMany({
            where: {
                title: item.title,
            },
            data: {
                category: finalCategory,
                subcategory: finalSubcategory,
            }
        });
        
        if (res.count > 0) {
            console.log(`Updated: ${item.title} -> category: ${finalCategory}, subcategory: ${finalSubcategory || 'none'}`);
            updatedCount += res.count;
        }
    }
    
    fs.unlinkSync(tempPath);
    console.log(`Migration complete! Successfully forced ${updatedCount} items into their proper categories based on their subcategory.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
