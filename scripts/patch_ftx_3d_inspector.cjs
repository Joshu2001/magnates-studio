const fs = require('fs');
const filePath = 'magnates-studio/public/js/tpl-3d-inspector.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add jani-ftx-logo-reveal to SPATIAL_3D_CATEGORY_IDS
content = content.replace(
  "'jani-forbes-fraud-reveal',",
  "'jani-forbes-fraud-reveal',\n    'jani-ftx-logo-reveal',"
);

// 2. Add jani-ftx-logo-reveal to DEDICATED_CUSTOMIZER_IDS
content = content.replace(
  "'jani-forbes-fraud-reveal'",
  "'jani-forbes-fraud-reveal', 'jani-ftx-logo-reveal'"
);

// 3. Add canvas draw hook
const hookTarget = "if (clip.fxScene && clip.fxScene.tplId === 'jani-forbes-fraud-reveal' && typeof window.renderJaniForbesCanvas === 'function') {";
const hookIdx = content.indexOf(hookTarget);
if (hookIdx !== -1) {
  const newHook = `if (clip.fxScene && clip.fxScene.tplId === 'jani-ftx-logo-reveal' && typeof window.renderJaniFtxLogoCanvas === 'function') {
      window.renderJaniFtxLogoCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    `;
  content = content.substring(0, hookIdx) + newHook + content.substring(hookIdx);
  console.log('Successfully added canvas draw hook to tpl-3d-inspector.js');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated tpl-3d-inspector.js successfully!');
