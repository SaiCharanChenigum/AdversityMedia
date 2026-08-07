import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

async function getLogos() {
    try {
        console.log("Listing subfolders...");
        const folders = await cloudinary.api.root_folders();
        console.log(folders.folders.map(f => f.path));

        const res = await cloudinary.search.expression('folder:"Adversity-media website logos"').execute();
        console.log("Found using search API:", res.resources.length);
        for (const img of res.resources) {
            console.log(`URL: ${img.secure_url}`);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

getLogos();
