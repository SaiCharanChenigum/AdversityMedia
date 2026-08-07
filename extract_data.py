import re
import os

def extract_array(filepath, array_name, output_path):
    if not os.path.exists(filepath):
        print(f"{filepath} not found")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the array declaration
    # e.g., const portfolioData = [
    pattern = rf"const {array_name}\s*=\s*\[(.*?)\];"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        # Sometimes the semicolon is missing or there's other code
        # We can just find the start and balance the brackets
        start_str = f"const {array_name} = ["
        start_idx = content.find(start_str)
        if start_idx == -1:
            print(f"Could not find {array_name} in {filepath}")
            return
            
        # extract everything from start_idx to the end of the array
        # simple parsing: find matching bracket
        bracket_count = 0
        end_idx = -1
        in_string = False
        escape = False
        quote_char = ''
        
        for i in range(start_idx + len(start_str) - 1, len(content)):
            char = content[i]
            
            if escape:
                escape = False
                continue
                
            if char == '\\':
                escape = True
                continue
                
            if in_string:
                if char == quote_char:
                    in_string = False
                continue
                
            if char in ('"', "'", '`'):
                in_string = True
                quote_char = char
                continue
                
            if char == '[':
                bracket_count += 1
            elif char == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end_idx = i
                    break
                    
        if end_idx == -1:
            print(f"Could not find end of {array_name}")
            return
            
        array_content = content[start_idx:end_idx + 1]
    else:
        array_content = f"const {array_name} = [{match.group(1)}]"
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"export {array_content};\n")
    print(f"Extracted {array_name} to {output_path}")

extract_array('JS/portfolio.js', 'portfolioData', 'frontend/src/data/portfolioData.ts')
extract_array('JS/portfolio.js', 'videoPortfolioData', 'frontend/src/data/videoPortfolioData.ts')
extract_array('JS/blog.js', 'blogData', 'frontend/src/data/blogData.ts')
extract_array('JS/main.js', 'clientsData', 'frontend/src/data/clientsData.ts') # Assume it's named clientsData
