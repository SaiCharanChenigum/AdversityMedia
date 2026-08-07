import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

cloudinary.search
  .expression('folder:"Adversity-media blog images"')
  .sort_by('created_at', 'desc')
  .max_results(30)
  .execute()
  .then(result => {
    console.log(result.resources.map(r => r.secure_url));
  })
  .catch(console.error);
