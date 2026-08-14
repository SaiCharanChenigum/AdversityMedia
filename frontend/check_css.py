import re

def check_css(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove comments
    content_no_comments = re.sub(r'/\*[\s\S]*?\*/', '', content)
    
    depth = 0
    lines = content_no_comments.split('\n')
    for i, line in enumerate(lines):
        for char in line:
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth < 0:
                    print(f"Unexpected }} at line {i+1} in uncommented content")
                    return
    print(f"Final depth: {depth}")

check_css('src/styles/responsive.css')
