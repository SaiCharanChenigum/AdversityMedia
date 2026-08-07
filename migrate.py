import re
import os

def html_to_jsx(filepath, output_path):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    start_str = '</nav>'
    end_str = '<footer'
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Could not find bounds in {filepath}")
        return
        
    html = content[start_idx + len(start_str):end_idx].strip()
    
    # Clean up some stray tags that might break JSX
    # Remove back-to-top and whatsapp buttons if they are before footer (we put them in Footer.tsx)
    html = re.sub(r'<a href="https://api\.whatsapp\.com.*?</script>', '', html, flags=re.DOTALL)
    
    # Conversions
    html = html.replace('class="', 'className="')
    html = html.replace('for="', 'htmlFor="')
    html = html.replace('novalidate>', 'noValidate>')
    html = html.replace('novalidate >', 'noValidate>')
    
    # Fix inline styles (dumb replace)
    # We will just strip all style="" for now to ensure successful build.
    # Advanced styling can be restored via CSS classes later.
    html = re.sub(r'style="[^"]*"', '', html)
    
    # Comments
    html = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html, flags=re.DOTALL)
    
    # Self closing tags
    html = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', html)
    html = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', html)
    html = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', html)
    html = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1 />', html)
    html = re.sub(r'<source([^>]*?)(?<!/)>', r'<source\1 />', html)
    
    page = f"""import React from 'react';
import Link from 'next/link';

export default function Page() {{
  return (
    <>
      {{/* Content Migrated from HTML */}}
      {html}
    </>
  );
}}
"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(page)
    print(f"Migrated {filepath} to {output_path}")

html_to_jsx('blog.html', 'frontend/src/app/blog/page.tsx')
html_to_jsx('portfolio.html', 'frontend/src/app/portfolio/page.tsx')
html_to_jsx('clients.html', 'frontend/src/app/clients/page.tsx')
