const fs = require('fs');

console.log('--- Patching Cinematic Light Trail Template into Magnates Studio ---');

// 1. Index.html: add script tag
let indexHtml = fs.readFileSync('magnates-studio/public/index.html', 'utf8');
if (!indexHtml.includes('cinematic-light-trail-engine.js')) {
  indexHtml = indexHtml.replace(
    'src="js/tpl-contextual-inspector.js',
    'src="js/cinematic-light-trail-engine.js?v=1"></script>\n  <script src="js/tpl-contextual-inspector.js'
  );
  fs.writeFileSync('magnates-studio/public/index.html', indexHtml, 'utf8');
  console.log('1. Added cinematic-light-trail-engine.js to index.html');
} else {
  console.log('1. cinematic-light-trail-engine.js already in index.html');
}

// 2. app.js: add to EFFECT_TEMPLATES_DATA
let appJs = fs.readFileSync('magnates-studio/public/js/app.js', 'utf8');
const templateId = 'cinematic-light-trail-typewriter';

if (!appJs.includes(`id: '${templateId}'`)) {
  const cardEntry = `  {
    id: '${templateId}',
    title: 'Cinematic Light Trail Typewriter & Glitch Reveal',
    category: 'Text & Titles',
    badge: 'Cinematic Master',
    difficulty: '1-Click',
    timeToApply: '7 sec',
    previewGradient: 'linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(56, 189, 248, 0.25), rgba(0, 0, 0, 0.8))',
    description: 'Cinematic typewriter typography with luminous directional light trails (horizontal anamorphic beams), CRT scanlines, dust scratches, intense digital glitch-out, and secondary scene reveal.',
    tags: ['Typewriter', 'Light Trail', 'Anamorphic Flare', 'Glitch Reveal', 'Cinematic Title', 'Text FX'],
    defaultImage: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20225%22%20width%3D%22400%22%20height%3D%22225%22%3E%3Crect%20width%3D%22400%22%20height%3D%22225%22%20fill%3D%22%23000000%22%2F%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22streak%22%20x1%3D%220%25%22%20y1%3D%2250%25%22%20x2%3D%22100%25%22%20y2%3D%2250%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22rgba(56%2C189%2C248%2C0)%22%2F%3E%3Cstop%20offset%3D%2235%25%22%20stop-color%3D%22rgba(56%2C189%2C248%2C0.3)%22%2F%3E%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23ffffff%22%2F%3E%3Cstop%20offset%3D%2265%25%22%20stop-color%3D%22rgba(56%2C189%2C248%2C0.3)%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22rgba(56%2C189%2C248%2C0)%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20x%3D%2220%22%20y%3D%22110%22%20width%3D%22360%22%20height%3D%224%22%20fill%3D%22url(%23streak)%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22116%22%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22900%22%20letter-spacing%3D%223%22%20text-anchor%3D%22middle%22%3ETHIS%20IS%20NOT%20ONE%20OF%20THOSE%20STO_%3C%2Ftext%3E%3C%2Fsvg%3E',
    secondaryImage: '/boardroom_scene_hd.jpg'
  },
`;
  const insertMarker = "id: 'jani-ftx-logo-reveal',";
  const markerIdx = appJs.indexOf(insertMarker);
  if (markerIdx !== -1) {
    const cardStart = appJs.lastIndexOf('{', markerIdx);
    appJs = appJs.substring(0, cardStart) + cardEntry + appJs.substring(cardStart);
    console.log('2. Added template card to EFFECT_TEMPLATES_DATA in app.js');
  } else {
    console.error('Could not find insertMarker in app.js');
  }

  // Add to BRIDGED_HOVER_TEMPLATE_IDS
  appJs = appJs.replace(
    "'jani-ftx-logo-reveal',",
    `'jani-ftx-logo-reveal', '${templateId}',`
  );
  console.log('3. Added to BRIDGED_HOVER_TEMPLATE_IDS in app.js');

  // Add hover preview HTML generator
  const hoverTarget = `} else if (tplId === 'jani-ftx-logo-reveal') {`;
  const hoverCode = `} else if (tplId === '${templateId}') {
      fxContainer.innerHTML = \`
        <div style="position: absolute; inset: 0; background: #000000; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <!-- Ambient Radial Fog -->
          <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(56,189,248,0.12) 0%, rgba(0,0,0,0.95) 70%, #000 100%);"></div>
          
          <!-- Luminous Anamorphic Streak -->
          <div style="position: absolute; width: 90%; height: 2px; background: linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.4) 30%, #ffffff 50%, rgba(56,189,248,0.4) 70%, transparent 100%); box-shadow: 0 0 16px rgba(56,189,248,0.8), 0 0 30px #ffffff; filter: blur(0.5px);"></div>
          
          <!-- Typewriter Text Preview -->
          <div style="position: relative; z-index: 5; font-family: 'Oswald', sans-serif; font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px rgba(255,255,255,0.8);">
            THIS IS NOT ONE OF THOSE STO<span style="animation: cltBlink 0.6s infinite;">_</span>
          </div>
          
          <!-- Film Dust / Scanline Hint -->
          <div style="position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px); pointer-events: none;"></div>
        </div>
      \`;
      `;
  appJs = appJs.replace(hoverTarget, hoverCode + hoverTarget);
  console.log('4. Added hover preview HTML generator in app.js');

  // Handle in openTopTemplateCustomizer
  const openCustomizerTarget = `} else if (tpl.id === 'jani-ftx-logo-reveal') {`;
  const openCustomizerBlock = `} else if (tpl.id === '${templateId}') {
      topCustomizerState.primaryUrl = '';
      topCustomizerState.secondaryUrl = '/boardroom_scene_hd.jpg';
      topCustomizerState.originalPhotoUrl = '';
      if (typeof window.tplMountCinematicLightTrailStage === 'function') {
        const stage = document.getElementById('tpl-modal-preview-stage');
        const d = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tpl.id) : {};
        if (stage) window.tplMountCinematicLightTrailStage(stage, d);
      }
      `;
  if (appJs.includes(openCustomizerTarget)) {
    appJs = appJs.replace(openCustomizerTarget, openCustomizerBlock + openCustomizerTarget);
  } else {
    // Add to Spooner / generic branch
    const spoonerCheck = `} else if (tpl.id === 'spooner-2-5d-photo-parallax') {`;
    appJs = appJs.replace(spoonerCheck, openCustomizerBlock + spoonerCheck);
  }
  console.log('5. Added customizer launcher in app.js');

  fs.writeFileSync('magnates-studio/public/js/app.js', appJs, 'utf8');
} else {
  console.log('2. Already present in app.js');
}

// 3. tpl-contextual-inspector.js: wire stage mounting and inspector
let inspectorJs = fs.readFileSync('magnates-studio/public/js/tpl-contextual-inspector.js', 'utf8');

if (!inspectorJs.includes(`tplId === '${templateId}'`)) {
  // 3a. In tplUpdateStageWithContextualData
  const stageTarget = `if (tplId === 'jani-ftx-logo-reveal') {`;
  const stageCode = `if (tplId === '${templateId}') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#cinematic-light-trail-root')) {
          if (typeof window.tplMountCinematicLightTrailStage === 'function') {
            window.tplMountCinematicLightTrailStage(stage, data);
          }
        } else {
          if (typeof window.tplUpdateCinematicLightTrail === 'function') {
            window.tplUpdateCinematicLightTrail(data);
          }
        }
      }
      return;
    }
    `;
  inspectorJs = inspectorJs.replace(stageTarget, stageCode + stageTarget);
  console.log('6. Added stage mounting check in tpl-contextual-inspector.js');

  // 3b. In tplRenderContextualInspector
  const inspectorTarget = `if (tplId === 'jani-ftx-logo-reveal') {`;
  const inspectorCode = `if (tplId === '${templateId}') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      const tpl3dControls = document.getElementById('tpl-modal-3d-controls');
      if (tpl3dControls) { tpl3dControls.style.display = 'none'; tpl3dControls.innerHTML = ''; }
      if (stdLayers) stdLayers.style.display = 'none';
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        const d = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildCinematicLightTrailInspector === 'function') {
          window.tplBuildCinematicLightTrailInspector(container, d, tplId);
        }
      }
      return;
    }
    `;
  inspectorJs = inspectorJs.replace(inspectorTarget, inspectorCode + inspectorTarget);
  console.log('7. Added inspector UI builder in tpl-contextual-inspector.js');

  fs.writeFileSync('magnates-studio/public/js/tpl-contextual-inspector.js', inspectorJs, 'utf8');
} else {
  console.log('6. Already present in tpl-contextual-inspector.js');
}

// 4. tester-templates-data.js: add to window.NEW_TESTER_TEMPLATES
let testerDataJs = fs.readFileSync('magnates-studio/public/js/tester-templates/tester-templates-data.js', 'utf8');
if (!testerDataJs.includes(`"id": "${templateId}"`)) {
  const itemJson = `  {
    "id": "${templateId}",
    "title": "Cinematic Light Trail Typewriter & Glitch Reveal",
    "category": "Text & Titles",
    "origCategory": "Text & Titles",
    "badge": "CINEMATIC MASTER",
    "difficulty": "Easy",
    "timeToApply": "7s",
    "previewGradient": "linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 23, 42, 0.95))",
    "description": "Black screen typewriter typography with horizontal luminous light trails (anamorphic flare beam), CRT scanlines, dust motes, high-frequency digital glitch-out, and secondary scene reveal.",
    "tags": [
      "Typewriter",
      "Light Trail",
      "Anamorphic Streak",
      "Glitch Out",
      "Cinematic Text",
      "Secondary Reveal",
      "CRT Scanlines"
    ],
    "previewType": "lightTrailTypewriter",
    "isTesterTemplate": true,
    "defaultImage": "/boardroom_scene_hd.jpg"
  },\n`;
  testerDataJs = testerDataJs.replace('window.NEW_TESTER_TEMPLATES = [', 'window.NEW_TESTER_TEMPLATES = [\n' + itemJson);
  fs.writeFileSync('magnates-studio/public/js/tester-templates/tester-templates-data.js', testerDataJs, 'utf8');
  console.log('8. Added template item to tester-templates-data.js');
} else {
  console.log('8. Already in tester-templates-data.js');
}

console.log('--- All patches successfully applied! ---');
