import os

files_to_update = [
    r"c:\Users\cheni\OneDrive\Desktop\LifeAdversity Media\JS\portfolio.js",
    r"c:\Users\cheni\OneDrive\Desktop\LifeAdversity Media\frontend\src\data\portfolioData.ts"
]

search_str = '"assets/images/portfolio/'
replace_str = '"https://res.cloudinary.com/deftcnxf/image/upload/v1/adversity-media%20portfolio%20images/'

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace(search_str, replace_str)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"File not found: {filepath}")
