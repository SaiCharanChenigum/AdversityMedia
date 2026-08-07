import os
import cloudinary
import cloudinary.api
import json

cloudinary.config(
    cloud_name="deftcnxf",
    api_key="431264928794468",
    api_secret="4rv004EYyjmbcw9OXH2ulJNzmz0"
)

try:
    resources = cloudinary.api.resources(
        type="upload", 
        max_results=500
    )
    
    files = []
    for r in resources.get('resources', []):
        files.append({
            'public_id': r['public_id'],
            'secure_url': r['secure_url'],
            'filename': r['public_id'].split('/')[-1]
        })
        
    with open('cloudinary_files.json', 'w') as f:
        json.dump(files, f, indent=2)
        
    print(f"Fetched {len(files)} files. Saved to cloudinary_files.json")
except Exception as e:
    print(f"Error: {e}")
