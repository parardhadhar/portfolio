import os
import glob
import re

replacements = {
    r"'#f4f4f4'(?!\s*=>)": "'var(--bg-color)'",
    r'"#f4f4f4"': '"var(--bg-color)"',
    r"'#111111'": "'var(--text-main)'",
    r'"#111111"': '"var(--text-main)"',
    r"'#111'": "'var(--text-main)'",
    r'"#111"': '"var(--text-main)"',
    r"'#000'": "'var(--text-main)'",
    r'"#000"': '"var(--text-main)"',
    r"'#666'": "'var(--text-muted)'",
    r'"#666"': '"var(--text-muted)"',
    r"'#444'": "'var(--text-muted)'",
    r'"#444"': '"var(--text-muted)"',
    r"'#555'": "'var(--text-muted)'",
    r'"#555"': '"var(--text-muted)"',
    r"'rgba\(0,0,0,0.15\)'": "'var(--border-color)'",
    r'"rgba\(0,0,0,0.15\)"': '"var(--border-color)"',
    r"'rgba\(0,0,0,0.1\)'": "'var(--border-color)'",
    r'"rgba\(0,0,0,0.1\)"': '"var(--border-color)"',
    r"'rgba\(0,0,0,0.05\)'": "'var(--border-light)'",
    r'"rgba\(0,0,0,0.05\)"': '"var(--border-light)"',
    r"'#fff'": "'var(--bg-color)'",
    r'"#fff"': '"var(--bg-color)"',
    r"'#ffffff'": "'var(--bg-color)'",
    r'"#ffffff"': '"var(--bg-color)"',
    r"'rgba\(255,255,255,1\)'": "'var(--bg-color)'"
}

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for pattern, repl in replacements.items():
        content = re.sub(pattern, repl, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
