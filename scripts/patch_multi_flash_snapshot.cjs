const fs = require('fs');
const filePath = 'magnates-studio/public/js/tpl-snapshots.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = "'jani-ftx-logo-reveal': `data:image/svg+xml;utf8,";
const pos = content.indexOf(target);

if (pos !== -1 && !content.includes("'multi-image-flash-sequence':")) {
  const snapshotCode = `'multi-image-flash-sequence': \`data:image/svg+xml;utf8,\${encodeURIComponent(\`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
        <defs>
          <linearGradient id="mflash-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="60%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <radialGradient id="mflash-burst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.6"/>
            <stop offset="70%" stop-color="#0284c7" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="225" fill="url(#mflash-bg)"/>
        
        <!-- Film Strip Thumbnails -->
        <rect x="25" y="45" width="75" height="110" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="115" y="45" width="75" height="110" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <rect x="205" y="45" width="75" height="110" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <rect x="295" y="45" width="80" height="110" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>

        <!-- Flash burst on first item -->
        <circle cx="62" cy="100" r="48" fill="url(#mflash-burst)"/>

        <!-- Motion Arrows -->
        <path d="M 125 100 L 175 100 M 165 92 L 175 100 L 165 108" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 265 100 L 215 100 M 225 92 L 215 100 L 225 108" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Center Bloom Rings on 4th -->
        <circle cx="335" cy="100" r="14" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="335" cy="100" r="26" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2"/>

        <!-- Title Badge -->
        <rect x="50" y="175" width="300" height="28" rx="6" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.4)" stroke-width="1"/>
        <text x="200" y="193" fill="#38bdf8" font-family="'Inter', sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="1.5">⚡ MULTI-IMAGE FLASH &amp; LATERAL SEQUENCE</text>
      </svg>
    \`)}\`,\n    `;
  content = content.substring(0, pos) + snapshotCode + content.substring(pos);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully injected snapshot in tpl-snapshots.js');
} else {
  console.log('Already exists or target not found');
}
