const fs = require('fs');
const filePath = 'magnates-studio/public/js/tpl-snapshots.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = "    // 17. James Jani \"The Countdown Effect\" & Panic Ticker Tape";
const targetIdx = content.indexOf(target);
if (targetIdx !== -1) {
  const snapshotBlock = `    // 16.5. James Jani FTX 3D Kinetic Logo Builder
    'jani-ftx-logo-reveal': \`data:image/svg+xml;utf8,\${encodeURIComponent(\`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
        <defs>
          <radialGradient id="ftx-bg-grad" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stop-color="#071324"/>
            <stop offset="50%" stop-color="#030813"/>
            <stop offset="100%" stop-color="#010307"/>
          </radialGradient>
          <filter id="ftx-cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur1"/>
            <feGaussianBlur stdDeviation="16" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="ftx-white-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#ffffff" flood-opacity="0.9"/>
          </filter>
          <linearGradient id="ftx-cyan-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#00f0ff"/>
          </linearGradient>
        </defs>

        <!-- Void Background -->
        <rect width="400" height="225" fill="url(#ftx-bg-grad)"/>

        <!-- Expanding Shockwave Ring Aura -->
        <circle cx="140" cy="105" r="75" fill="none" stroke="#00f0ff" stroke-width="1.8" opacity="0.35"/>
        <circle cx="140" cy="105" r="95" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.18"/>

        <!-- Perspective Floor Grid Sheen -->
        <path d="M 0 175 L 400 175 M 40 195 L 360 195 M 0 220 L 400 220" stroke="rgba(0,240,255,0.06)" stroke-width="1"/>
        <path d="M 120 160 L 50 225 M 200 160 L 200 225 M 280 160 L 350 225" stroke="rgba(0,240,255,0.04)" stroke-width="1"/>

        <!-- Main Logo Group (Centered & High Contrast) -->
        <g transform="translate(62, 58)">
          <!-- Top Cyan Bar -->
          <rect x="0" y="0" width="76" height="20" rx="2" fill="url(#ftx-cyan-face)" filter="url(#ftx-cyan-glow)"/>
          
          <!-- Mid Cyan Bar -->
          <rect x="25" y="26" width="51" height="20" rx="2" fill="url(#ftx-cyan-face)" filter="url(#ftx-cyan-glow)"/>
          
          <!-- Left Cyan Anchor Block -->
          <rect x="0" y="26" width="20" height="20" rx="2" fill="url(#ftx-cyan-face)" filter="url(#ftx-cyan-glow)"/>
          
          <!-- Bottom White Accent Block -->
          <rect x="18" y="52" width="20" height="20" rx="2" fill="#ffffff" filter="url(#ftx-white-glow)"/>

          <!-- 3D Bold White Letters "FTX" -->
          <text x="96" y="56" fill="#ffffff" font-family="'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="44" letter-spacing="1" filter="url(#ftx-white-glow)">FTX</text>
        </g>

        <!-- Subtitle "THE GREAT FRAUD" -->
        <text x="200" y="172" fill="#00f0ff" font-family="'Inter', monospace" font-weight="800" font-size="11.5" letter-spacing="6" text-anchor="middle" filter="url(#ftx-cyan-glow)">THE GREAT FRAUD</text>

        <!-- Film Vignette Frame -->
        <rect width="400" height="225" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </svg>
    \`)}\`,\n\n`;

  content = content.substring(0, targetIdx) + snapshotBlock + content.substring(targetIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added jani-ftx-logo-reveal snapshot!');
} else {
  console.error('Target not found in tpl-snapshots.js');
}
