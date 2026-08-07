import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

async function main() {
  try {
    const result = await cloudinary.search
      .expression('folder:"adversity-media porfolio videos" AND resource_type:video')
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();
      
    console.log(`Found ${result.resources.length} videos:`);
    for (const res of result.resources) {
        console.log(`${res.public_id}: ${res.secure_url}`);
    }
  } catch (e) {
    console.error("Error searching cloudinary:", e);
  }
}

main();
