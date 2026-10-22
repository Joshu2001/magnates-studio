with open('magnates-studio/public/js/tpl-snapshots.js', 'r', encoding='utf-8') as f:
    c = f.read()

snapshot_code = """  SNAPSHOTS['circular-spin-flashlight-glitch'] = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
      <defs>
        <radialGradient id="csf-bg-dark" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="#0b1329"/>
          <stop offset="70%" stop-color="#050811"/>
          <stop offset="100%" stop-color="#020408"/>
        </radialGradient>
        <radialGradient id="csf-flash-burst" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="rgba(214,240,255,0.95)"/>
          <stop offset="70%" stop-color="rgba(56,189,248,0.3)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <linearGradient id="csf-arc-grad" x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="50%" stop-color="#f87171"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#csf-bg-dark)"/>
      <!-- Falling Particles -->
      <circle cx="85" cy="40" r="1.5" fill="#e2e8f0" opacity="0.6"/>
      <circle cx="120" cy="110" r="2.2" fill="#ffd166" opacity="0.8"/>
      <circle cx="170" cy="65" r="1.8" fill="#e2e8f0" opacity="0.7"/>
      <circle cx="230" cy="140" r="2.5" fill="#38bdf8" opacity="0.8"/>
      <circle cx="280" cy="75" r="1.5" fill="#e2e8f0" opacity="0.5"/>
      <circle cx="320" cy="130" r="2.0" fill="#ffd166" opacity="0.75"/>
      <circle cx="360" cy="90" r="1.5" fill="#e2e8f0" opacity="0.6"/>
      <circle cx="60" cy="165" r="2.2" fill="#e2e8f0" opacity="0.7"/>
      <circle cx="205" cy="180" r="1.8" fill="#38bdf8" opacity="0.6"/>
      <!-- Circular Doodle Arc Path -->
      <path d="M 110 145 C 100 65, 290 60, 285 140" fill="none" stroke="url(#csf-arc-grad)" stroke-width="3" stroke-dasharray="4,4"/>
      <polygon points="285,148 277,136 293,136" fill="#ef4444"/>
      <!-- Flashlight Optical Core -->
      <circle cx="200" cy="100" r="75" fill="url(#csf-flash-burst)"/>
      <!-- Glitch Slices -->
      <rect x="130" y="88" width="140" height="4" fill="rgba(255,0,85,0.7)"/>
      <rect x="145" y="105" width="130" height="3" fill="rgba(0,240,255,0.8)"/>
      <!-- Badge Title -->
      <rect x="75" y="185" width="250" height="26" rx="4" fill="rgba(0,0,0,0.85)" stroke="rgba(56,189,248,0.4)" stroke-width="1"/>
      <text x="200" y="202" fill="#ffffff" font-family="sans-serif" font-size="10.5" font-weight="800" letter-spacing="1.5" text-anchor="middle">CIRCULAR SPIN &amp; 4-FLASH</text>
    </svg>
  `)}`;
"""

target = "  window.tplGetSnapshot = function (id) {"
if "SNAPSHOTS['circular-spin-flashlight-glitch']" not in c and target in c:
    c = c.replace(target, snapshot_code + "\n" + target)
    with open('magnates-studio/public/js/tpl-snapshots.js', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Snapshot added to tpl-snapshots.js")
else:
    print("Already added or target not found")
