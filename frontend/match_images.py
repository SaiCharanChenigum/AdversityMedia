import json
import re

with open('cloudinary_files.json', 'r') as f:
    cloudinary_files = json.load(f)

# Create a mapping from original UUID to secure_url
mapping = {}
for c_file in cloudinary_files:
    # Filenames in cloudinary have a random suffix, e.g., '3e4458fe..._n3khxz'
    # We want to map the base UUID part.
    filename = c_file['filename']
    parts = filename.rsplit('_', 1)
    if len(parts) == 2:
        base_name = parts[0]
        mapping[base_name] = c_file['secure_url']

files_to_update = [
    r"c:\Users\cheni\OneDrive\Desktop\LifeAdversity Media\JS\portfolio.js",
    r"c:\Users\cheni\OneDrive\Desktop\LifeAdversity Media\frontend\src\data\portfolioData.ts"
]

def replace_func(match):
    original_uuid = match.group(1)
    if original_uuid in mapping:
        return f'image: "{mapping[original_uuid]}"'
    else:
        # Fallback if not found in Cloudinary
        print(f"Warning: {original_uuid} not found in Cloudinary")
        return match.group(0)

pattern = re.compile(r'image:\s*"https://res\.cloudinary\.com/deftcnxf/image/upload/v1/adversity-media%20portfolio%20images/([^.]+)\.jpg"')
old_pattern = re.compile(r'image:\s*"assets/images/portfolio/([^.]+)\.jpg"')

for filepath in files_to_update:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace the incorrectly prefixed Cloudinary URLs
        content = pattern.sub(replace_func, content)
        # Also catch any that might still have local paths
        content = old_pattern.sub(replace_func, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully processed {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
