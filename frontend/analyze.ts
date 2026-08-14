import fs from 'fs';
import path from 'path';

async function main() {
    const filePath = path.join(__dirname, '..', 'portfolio.js');
    let content = fs.readFileSync(filePath, 'utf-8');
    const domIndex = content.indexOf('document.addEventListener');
    if (domIndex !== -1) {
        content = content.substring(0, domIndex);
    }
    
    const tempPath = path.join(__dirname, 'temp_portfolio2.js');
    content += '\nmodule.exports = portfolioData;';
    fs.writeFileSync(tempPath, content);
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const portfolioData = require('./temp_portfolio2.js');
    
    const subcats = new Set<string>();
    for (const item of portfolioData) {
        if (item.subcategory) {
            subcats.add(item.subcategory);
        }
    }
    console.log("Unique subcategories in JS file:");
    console.log(Array.from(subcats));
    
    fs.unlinkSync(tempPath);
}

main().catch(console.error);
