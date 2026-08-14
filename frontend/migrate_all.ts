import fs from 'fs';
import path from 'path';
import { prisma } from './src/lib/prisma';

async function main() {
    console.log("Starting full migration from root portfolio.js...");
    // Use the file in the root folder as requested by the user
    const filePath = path.join(__dirname, '..', 'portfolio.js');
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // We only want the portfolioData array.
    const startIndex = content.indexOf('const portfolioData = [');
    const domIndex = content.indexOf('document.addEventListener');
    if (domIndex !== -1) {
        content = content.substring(0, domIndex);
    }
    
    const tempPath = path.join(__dirname, 'temp_portfolio.js');
    content += '\nmodule.exports = portfolioData;';
    fs.writeFileSync(tempPath, content);
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const portfolioData = require('./temp_portfolio.js');
    
    let updatedCount = 0;
    
    for (const item of portfolioData) {
        const res = await prisma.portfolio.updateMany({
            where: {
                title: item.title,
            },
            data: {
                category: item.category,
                subcategory: item.subcategory || null,
            }
        });
        
        if (res.count > 0) {
            console.log(`Updated: ${item.title} -> category: ${item.category}, subcategory: ${item.subcategory || 'none'}`);
            updatedCount += res.count;
        }
    }
    
    // cleanup
    fs.unlinkSync(tempPath);
    console.log(`Migration complete! Successfully updated ${updatedCount} items based on portfolio.js in the root directory.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
