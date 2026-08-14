import fs from 'fs';
import path from 'path';

async function main() {
    const filePath = path.join(__dirname, '..', 'portfolio.js');
    let content = fs.readFileSync(filePath, 'utf-8');
    const domIndex = content.indexOf('document.addEventListener');
    if (domIndex !== -1) {
        content = content.substring(0, domIndex);
    }
    
    const tempPath = path.join(__dirname, 'temp_portfolio3.js');
    content += '\nmodule.exports = portfolioData;';
    fs.writeFileSync(tempPath, content);
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const portfolioData = require('./temp_portfolio3.js');
    
    const cats = new Set<string>();
    for (const item of portfolioData) {
        if (item.category) {
            cats.add(item.category);
        }
    }
    console.log("Unique categories in JS file:");
    console.log(Array.from(cats));
    
    fs.unlinkSync(tempPath);
}

main().catch(console.error);
