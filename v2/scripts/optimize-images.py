"""Create delivery assets without changing the original portfolio photographs."""
from pathlib import Path
from PIL import Image

public = Path(__file__).resolve().parents[1] / 'public'
out = public / 'media'
out.mkdir(exist_ok=True)
total_before = total_after = 0

def convert(source, name, width, quality=80):
    global total_before, total_after
    src = public / source
    image = Image.open(src)
    image.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
    target = out / f'{name}-v1.webp'
    image.save(target, 'WEBP', quality=quality, method=6)
    total_before += src.stat().st_size
    total_after += target.stat().st_size
    print(f'{target.name}: {src.stat().st_size:,} -> {target.stat().st_size:,} bytes ({image.width}x{image.height})')

for theme in ['day', 'night']:
    convert(f'field-personal-{theme}.png', f'valley-{theme}', 1672, 80)
    convert(f'field-personal-{theme}.png', f'valley-{theme}-mobile', 900, 77)
    convert(f'field-personal-{theme}.png', f'valley-{theme}-tiny', 80, 45)
convert('sprites/parardha-atlas.png', 'parardha-atlas', 1280, 85)
convert('sprites/valley-layers.png', 'valley-layers', 1536, 82)
for name in ['cafe','cinema','concert','portrait','building','iisc','vrgc-campus']:
    convert(f'personal/{name}.png', name, 960 if name.startswith('vrgc') else 720, 80)
convert('personal/vrgc-team.jpg', 'vrgc-team', 960, 80)
convert('personal/portrait.png', 'avatar', 96, 80)
print(f'Delivery variants total: {total_after:,} bytes')
