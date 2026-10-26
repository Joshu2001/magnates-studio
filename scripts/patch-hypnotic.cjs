const fs = require('fs');
let file = fs.readFileSync('magnates-studio/public/js/app.js', 'utf8');

// 1. Add template to EFFECT_TEMPLATES_DATA
const targetEntry = "  {\r\n    id: 'text-texturing-grunge',";
const newEntry = `  {
    id: 'hypnotic-vertigo-roll',
    title: 'Hypnotic Vertigo & Dizziness Roll',
    category: '3D Spatial',
    origCategory: '3D Spatial',
    badge: 'Jani / Vertigo FX',
    difficulty: '1-Click',
    timeToApply: '3 sec',
    previewGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(2, 6, 23, 0.95))',
    description: 'Hypnotic zoomed-in vertigo camera with slow left-to-right spinning tilt, breathing dolly-zoom, optical CRT scanlines, and RGB chromatic aberration.',
    tags: ['Hypnosis', 'Vertigo', 'Dizziness', 'Camera Roll', 'CRT Scanlines', 'James Jani', 'Magnates Media'],
    defaultImage: '/hypnotic_creation_adam.png',
    secondaryImage: '/hypnotic_creation_adam_thumb.png'
  },\r\n  {\r\n    id: 'text-texturing-grunge',`;

if (!file.includes(targetEntry)) {
  console.error('Target entry not found');
  process.exit(1);
}
file = file.replace(targetEntry, newEntry);

// 2. Add sidecard thumbnail hover preview in populateTemplateHoverCards / sidecard logic
const targetSidecard = "} else if (tplId === 'text-texturing-grunge') {";
const newSidecard = `} else if (tplId === 'hypnotic-vertigo-roll') {
      if (typeof window.renderHypnoticVertigoCard === 'function') {
        window.renderHypnoticVertigoCard(fxContainer, tpl, 0);
      } else {
        fxContainer.innerHTML = '<div style="position:absolute;inset:0;background:#000;"><img src="' + tpl.defaultImage + '" style="width:100%;height:100%;object-fit:cover;transform:scale(1.4) rotate(12deg);" /></div>';
      }
    } else if (tplId === 'text-texturing-grunge') {`;

if (!file.includes(targetSidecard)) {
  console.error('Target sidecard not found');
  process.exit(1);
}
file = file.replace(targetSidecard, newSidecard);

// 3. Add to renderTopTemplatePreviewStage
const targetStage = "} else if (tplId === 'text-texturing-grunge') {";
const newStage = `} else if (tplId === 'hypnotic-vertigo-roll') {
    if (activeHoverAnimFrame) { cancelAnimationFrame(activeHoverAnimFrame); activeHoverAnimFrame = null; }
    hoverBridgeActive = false;
    hoverExternalT = null;
    if (typeof window.tplMountHypnoticVertigoStage === 'function') {
      window.tplMountHypnoticVertigoStage(stage, topCustomizerState);
    }
    return;
  } else if (tplId === 'text-texturing-grunge') {`;

file = file.replace(targetStage, newStage);

// 4. Add animation frame update in modal animation loop
const animTarget = "    if (typeof window.tplUpdateJaniGrungePaperFrame === 'function') {";
const animReplacement = `    if (tplId === 'hypnotic-vertigo-roll' && typeof window.tplUpdateHypnoticVertigoFrame === 'function') {
      window.tplUpdateHypnoticVertigoFrame(topCustomizerState, localSceneT, now);
    } else if (typeof window.tplUpdateJaniGrungePaperFrame === 'function') {`;

if (!file.includes(animTarget)) {
  console.error('animTarget not found');
  process.exit(1);
}
file = file.replace(animTarget, animReplacement);

// 5. Short name mapping for sidebar cards
const shortNameTarget = "    'text-texturing-grunge': 'Grunge Title'";
const shortNameReplacement = "    'hypnotic-vertigo-roll': 'Hypnotic Vertigo',\r\n    'text-texturing-grunge': 'Grunge Title'";
file = file.replace(shortNameTarget, shortNameReplacement);

fs.writeFileSync('magnates-studio/public/js/app.js', file, 'utf8');
console.log('Successfully updated app.js with hypnotic-vertigo-roll!');
