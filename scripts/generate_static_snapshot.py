import urllib.parse
import random

random.seed(42)
dots = []
for i in range(55):
    x = round(random.uniform(8, 392), 1)
    y = round(random.uniform(6, 218), 1)
    w = random.choice([3, 4, 4, 5])
    op = random.choice([0.25, 0.35, 0.45, 0.6, 0.75, 0.9])
    grp = (i % 4) + 1
    dots.append((x, y, w, op, grp))

scanlines = []
for i in range(10):
    y = round(i * 22.5, 1)
    scanlines.append(f'<line x1="0" y1="{y}" x2="400" y2="{y}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>')

dot_rects = []
for x, y, w, op, grp in dots:
    dot_rects.append(f'<rect class="n{grp}" x="{x}" y="{y}" width="{w}" height="{w}" fill="#ffffff" opacity="{op}"/>')

scanlines_str = "\n    ".join(scanlines)
dots_str = "\n    ".join(dot_rects)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
  <defs>
    <style>
      @keyframes staticNoise1 {{ 0%, 100% {{ opacity: 0.25; }} 50% {{ opacity: 0.85; }} }}
      @keyframes staticNoise2 {{ 0%, 100% {{ opacity: 0.8; }} 50% {{ opacity: 0.2; }} }}
      @keyframes staticNoise3 {{ 0%, 100% {{ opacity: 0.3; }} 40% {{ opacity: 0.9; }} 80% {{ opacity: 0.15; }} }}
      @keyframes staticNoise4 {{ 0%, 100% {{ opacity: 0.65; }} 30% {{ opacity: 0.1; }} 70% {{ opacity: 0.95; }} }}
      .n1 {{ animation: staticNoise1 0.18s steps(2) infinite 0.02s; }}
      .n2 {{ animation: staticNoise2 0.25s steps(2) infinite 0.08s; }}
      .n3 {{ animation: staticNoise3 0.14s steps(2) infinite 0.04s; }}
      .n4 {{ animation: staticNoise4 0.22s steps(2) infinite 0.11s; }}
    </style>
    <radialGradient id="tv-crt-vignette" cx="50%" cy="50%" r="72%">
      <stop offset="65%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>

  <!-- Dark CRT Screen Void -->
  <rect width="400" height="225" fill="#000000"/>

  <!-- Horizontal Scanlines (10% increments matching hover preview) -->
  <g class="tv-scanlines">
    {scanlines_str}
  </g>

  <!-- TV Static Noise Pixels -->
  <g class="tv-noise-pixels">
    {dots_str}
  </g>

  <!-- CRT Vignette -->
  <rect width="400" height="225" fill="url(#tv-crt-vignette)" pointer-events="none"/>
</svg>'''

encoded = f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"
print(f"Clean SVG length: {len(svg)}, Encoded length: {len(encoded)}")

with open("scripts/tv_static_snapshot.svg", "w", encoding="utf-8") as f:
    f.write(svg)

with open("scripts/tv_static_data_uri.txt", "w", encoding="utf-8") as f:
    f.write(encoded)
