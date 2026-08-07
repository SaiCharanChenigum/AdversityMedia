import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
let apiKey = '';
let apiSecret = '';

if (cloudinaryUrl) {
    const urlParts = cloudinaryUrl.replace('cloudinary://', '').split('@');
    if (urlParts.length === 2) {
        const credentials = urlParts[0].split(':');
        apiKey = credentials[0];
        apiSecret = credentials[1];
    }
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: apiKey,
    api_secret: apiSecret,
});

export async function GET() {
    try {
        // Search for all assets in the specified folder (and subfolders)
        // Fetch up to 500 items, and include tags and context metadata
        const results = await cloudinary.search
            .expression('folder:"adversity-media portfolio images" OR folder:"adversity-media portfolio images/*"')
            .with_field('context')
            .with_field('tags')
            .max_results(500)
            .execute();

        const portfolioItems = results.resources.map((asset: any) => {
            // Determine category from folder structure or tags
            // Example folder: "adversity-media portfolio images/branding" -> category is "branding"
            const folderParts = asset.folder.split('/');
            const subfolder = folderParts.length > 1 ? folderParts[1] : 'all';

            // Check if it's an AI video via tag or folder
            let viewType = asset.resource_type === 'video' ? 'videos' : 'images';
            if (asset.tags?.includes('ai-video') || asset.folder.includes('ai-video')) {
                viewType = 'ai-videos';
            }

            // Extract technologies from context (comma separated)
            const techString = asset.context?.custom?.technologies || '';
            const technologies = techString ? techString.split(',').map((t: string) => t.trim()) : [];

            return {
                id: asset.public_id,
                title: asset.context?.custom?.title || 'Untitled Project',
                category: subfolder, // 'branding', 'digital-marketing', etc.
                subcategory: asset.tags?.[0] || 'general', // use first tag as subcategory if available
                image: asset.public_id, // Cloudinary uses public_id for rendering
                url: asset.secure_url,
                description: asset.context?.custom?.description || 'No description provided.',
                technologies: technologies.length > 0 ? technologies : ['Marketing', 'Design'],
                viewType: viewType, // 'images', 'videos', or 'ai-videos'
                resourceType: asset.resource_type // 'image' or 'video'
            };
        });

        return NextResponse.json({ success: true, data: portfolioItems });
    } catch (error: any) {
        console.error('Error fetching from Cloudinary:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
