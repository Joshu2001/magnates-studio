const fs = require('fs');
const filePath = 'magnates-studio/public/js/app.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add template card into EFFECT_TEMPLATES_DATA
const targetCard = "id: 'jani-ftx-logo-reveal',";
const cardIdx = content.indexOf(targetCard);
if (cardIdx !== -1) {
  const openBrace = content.lastIndexOf('{', cardIdx);
  const newCard = `{\n` +
    `    id: 'multi-image-flash-sequence',\n` +
    `    title: 'Modular Multi-Image Shutter Flash & Lateral Sequence Suite',\n` +
    `    category: 'Transitions',\n` +
    `    badge: 'Granular Storyboard Suite',\n` +
    `    difficulty: 'Pro Editor',\n` +
    `    timeToApply: '5 sec',\n` +
    `    previewGradient: 'linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(56, 189, 248, 0.25), rgba(15, 23, 42, 0.85))',\n` +
    `    description: 'Cinematic documentary 4+ image sequence: high-impact forensic photoflash with realistic phosphor decay and micro-shake, counter-directional lateral pushes, and sluggish center core expansion. Unlimited images, 4 acoustic shutter profiles, and 1-click mood psychology presets.',\n` +
    `    tags: ['Camera Flash', 'Multi-Image', 'Lateral Push', 'Sluggish Bloom', 'Documentary', 'Sound FX', 'Mood Presets'],\n` +
    `    defaultImage: 'photocut_scene1.png',\n` +
    `    secondaryImage: 'photocut_scene4.png'\n` +
    `  },\n  `;
  content = content.substring(0, openBrace) + newCard + content.substring(openBrace);
  console.log('Added multi-image-flash-sequence template card to EFFECT_TEMPLATES_DATA');
}

// 2. Add to BRIDGED_HOVER_TEMPLATE_IDS
content = content.replace(
  "'wire-transfer', 'money-stack',",
  "'wire-transfer', 'money-stack', 'multi-image-flash-sequence',"
);
console.log('Added to BRIDGED_HOVER_TEMPLATE_IDS');

// 3. Add to preview HTML generator
const prevTarget = "} else if (tplId === 'jani-ftx-logo-reveal') {";
const prevIdx = content.indexOf(prevTarget);
if (prevIdx !== -1) {
  const newPrevHtml = `} else if (tplId === 'multi-image-flash-sequence') {\n` +
    `      fxContainer.innerHTML = \\\`\n` +
    `        <div style="position: absolute; inset: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center;">\n` +
    `          <img src="photocut_scene1.png" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" />\n` +
    `          <div id="fx-multi-flash-\\\${tplId}" style="position: absolute; inset: 0; background: #d6f0ff; opacity: 0; mix-blend-mode: screen; pointer-events: none;"></div>\n` +
    `          <div style="position: absolute; bottom: 12px; left: 14px; font-family: monospace; font-size: 9px; font-weight: 800; color: #38bdf8; background: rgba(0,0,0,0.7); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.4);">\n` +
    `            ⚡ MULTI-IMAGE FLASH & LATERAL SEQUENCE\n` +
    `          </div>\n` +
    `        </div>\n` +
    `      \\\`;\n    `;
  content = content.substring(0, prevIdx) + newPrevHtml + content.substring(prevIdx);
  console.log('Added preview HTML block');
}

// 4. Add to hover animation step loop
const stepTarget = "} else if (tplId === 'jani-ftx-logo-reveal') {";
const stepIdx = content.indexOf(stepTarget);
if (stepIdx !== -1) {
  const newStepCode = `} else if (tplId === 'multi-image-flash-sequence') {\n` +
    `      const flashEl = document.getElementById(\\\`fx-multi-flash-\\\${tplId}\\\`);\n` +
    `      if (flashEl) {\n` +
    `        const cycleT = (localT * 8.0) % 4.0;\n` +
    `        if (cycleT < 0.4) {\n` +
    `          flashEl.style.opacity = Math.max(0, 1.0 - (cycleT / 0.4) * 1.5).toString();\n` +
    `        } else {\n` +
    `          flashEl.style.opacity = '0';\n` +
    `        }\n` +
    `      }\n    `;
  content = content.substring(0, stepIdx) + newStepCode + content.substring(stepIdx);
  console.log('Added step animation handler for hover');
}

// 5. Add customizer modal open & stage update handlers
const custTarget = "if (tplId === 'jani-ftx-logo-reveal') {\n    const ftxData = (typeof window.tplGetContextualData === 'function')";
const custIdx = content.indexOf(custTarget);
if (custIdx !== -1) {
  const newCustCode = `if (tplId === 'multi-image-flash-sequence') {\n` +
    `    const flashData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('multi-image-flash-sequence') : {};\n` +
    `    if (activeHoverAnimFrame) { cancelAnimationFrame(activeHoverAnimFrame); activeHoverAnimFrame = null; }\n` +
    `    hoverBridgeActive = false;\n` +
    `    hoverExternalT = null;\n` +
    `    if (typeof window.tplMountMultiImageFlashStage === 'function') {\n` +
    `      window.tplMountMultiImageFlashStage(stage, flashData);\n` +
    `    }\n` +
    `    return;\n` +
    `  }\n\n  `;
  content = content.substring(0, custIdx) + newCustCode + content.substring(custIdx);
  console.log('Added customizer modal stage mount code');
}

// 6. In animation scrubber loop inside openTopTemplateCustomizer
const scrubTarget = "if (tplId === 'jani-ftx-logo-reveal') {\n    if (typeof window.stepJaniFtxLogoAnimation === 'function')";
const scrubIdx = content.indexOf(scrubTarget);
if (scrubIdx !== -1) {
  const newScrubCode = `if (tplId === 'multi-image-flash-sequence') {\n` +
    `    if (typeof window.stepMultiImageFlashAnimation === 'function') {\n` +
    `      const stage = document.getElementById('tpl-modal-preview-stage');\n` +
    `      const flashData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('multi-image-flash-sequence') : {};\n` +
    `      window.stepMultiImageFlashAnimation(stage, 'multi-image-flash-sequence', localSceneT, flashData);\n` +
    `    }\n` +
    `  }\n\n  `;
  content = content.substring(0, scrubIdx) + newScrubCode + content.substring(scrubIdx);
  console.log('Added customizer scrubber step loop');
}

// 7. Save to public/js/app.js
fs.writeFileSync(filePath, content, 'utf8');
console.log('app.js patched successfully for multi-image-flash-sequence');
