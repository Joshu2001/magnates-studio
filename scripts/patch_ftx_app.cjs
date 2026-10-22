const fs = require('fs');
const filePath = 'magnates-studio/public/js/app.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add template card into EFFECT_TEMPLATES_DATA
const targetCard = "id: 'jani-countdown-panic-suite',";
const cardIdx = content.indexOf(targetCard);
if (cardIdx !== -1) {
  // Find opening brace of this object
  const openBrace = content.lastIndexOf('{', cardIdx);
  const newCard = `{
    id: 'jani-ftx-logo-reveal',
    title: 'James Jani FTX 3D Kinetic Logo Builder',
    category: '3D Spatial',
    badge: 'James Jani Signature',
    difficulty: '1-Click',
    timeToApply: '7 sec',
    previewGradient: 'linear-gradient(to top, rgba(3, 7, 16, 0.95), rgba(0, 240, 255, 0.25), rgba(7, 9, 14, 0.4))',
    description: 'Cinematic 3D geometric block deconstruction with high-energy flare, wavy shockwave boom, kinetic cube ripple, and magnetic FTX logo convergence.',
    tags: ['Logo Reveal', 'FTX', '3D Blocks', 'Shockwave Boom', 'James Jani', 'Kinetic'],
    defaultImage: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20225%22%20width%3D%22400%22%20height%3D%22225%22%3E%3Crect%20width%3D%22400%22%20height%3D%22225%22%20fill%3D%22%23030710%22%2F%3E%3Crect%20x%3D%22100%22%20y%3D%2270%22%20width%3D%2260%22%20height%3D%2218%22%20rx%3D%222%22%20fill%3D%22%2300f0ff%22%20filter%3D%22drop-shadow(0%200%208px%20%2300f0ff)%22%2F%3E%3Crect%20x%3D%22120%22%20y%3D%2294%22%20width%3D%2240%22%20height%3D%2218%22%20rx%3D%222%22%20fill%3D%22%2300f0ff%22%20filter%3D%22drop-shadow(0%200%208px%20%2300f0ff)%22%2F%3E%3Crect%20x%3D%22100%22%20y%3D%2294%22%20width%3D%2216%22%20height%3D%2218%22%20rx%3D%222%22%20fill%3D%22%2300f0ff%22%20filter%3D%22drop-shadow(0%200%208px%20%2300f0ff)%22%2F%3E%3Crect%20x%3D%22115%22%20y%3D%22118%22%20width%3D%2216%22%20height%3D%2218%22%20rx%3D%222%22%20fill%3D%22%23ffffff%22%20filter%3D%22drop-shadow(0%200%2010px%20%23ffffff)%22%2F%3E%3Ctext%20x%3D%22180%22%20y%3D%22112%22%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2236%22%20font-weight%3D%22900%22%3EFTX%3C%2Ftext%3E%3Ctext%20x%3D%22100%22%20y%3D%22158%22%20fill%3D%22%2300f0ff%22%20font-family%3D%22monospace%22%20font-size%3D%2211%22%20font-weight%3D%22700%22%20letter-spacing%3D%223%22%3ETHE%20GREAT%20FRAUD%3C%2Ftext%3E%3C%2Fsvg%3E',
    secondaryImage: ''
  },
  `;
  content = content.substring(0, openBrace) + newCard + content.substring(openBrace);
  console.log('Added template card to EFFECT_TEMPLATES_DATA');
}

// 2. Add to BRIDGED_HOVER_TEMPLATE_IDS
content = content.replace(
  "'wire-transfer', 'money-stack',",
  "'wire-transfer', 'money-stack', 'jani-ftx-logo-reveal',"
);
console.log('Added to BRIDGED_HOVER_TEMPLATE_IDS');

// 3. Add to preview HTML generator
const prevTarget = "} else if (tplId === 'jani-countdown-panic-suite') {";
const prevIdx = content.indexOf(prevTarget);
if (prevIdx !== -1) {
  const newPrevHtml = `} else if (tplId === 'jani-ftx-logo-reveal') {
      fxContainer.innerHTML = \`
        <div style="position: absolute; inset: 0; background: #030710; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; perspective: 700px;">
          <!-- Volumetric Cyan Haze -->
          <div style="position: absolute; inset: 0; background: radial-gradient(circle at 45% 45%, rgba(0,240,255,0.18) 0%, rgba(3,7,16,0.85) 60%, #020409 100%);"></div>
          
          <!-- Animated Shockwave Ripple Rings -->
          <div id="fx-ftx-wave-\${tplId}" style="position: absolute; width: 140px; height: 140px; border-radius: 50%; border: 2px solid #00f0ff; box-shadow: 0 0 25px #00f0ff, inset 0 0 15px #00f0ff; opacity: 0; transform: translate(-40px, -10px) scale(0.2); transition: transform 0.1s linear, opacity 0.1s linear;"></div>

          <!-- Assembled FTX Icon Preview Pieces -->
          <div style="position: relative; display: flex; align-items: center; gap: 14px; z-index: 5;">
            <div style="position: relative; width: 68px; height: 56px;">
              <!-- Top Bar -->
              <div id="fx-ftx-top-\${tplId}" style="position: absolute; top: 0; left: 0; width: 68px; height: 16px; background: #00f0ff; box-shadow: 0 0 16px rgba(0,240,255,0.8); border-radius: 2px; transition: transform 0.08s ease-out;"></div>
              <!-- Mid Bar -->
              <div id="fx-ftx-mid-\${tplId}" style="position: absolute; top: 20px; left: 22px; width: 46px; height: 16px; background: #00f0ff; box-shadow: 0 0 16px rgba(0,240,255,0.8); border-radius: 2px; transition: transform 0.08s ease-out;"></div>
              <!-- Left Anchor -->
              <div id="fx-ftx-left-\${tplId}" style="position: absolute; top: 20px; left: 0; width: 16px; height: 16px; background: #00f0ff; box-shadow: 0 0 16px rgba(0,240,255,0.8); border-radius: 2px; transition: transform 0.08s ease-out;"></div>
              <!-- Bottom Accent -->
              <div id="fx-ftx-bottom-\${tplId}" style="position: absolute; top: 40px; left: 16px; width: 16px; height: 16px; background: #ffffff; box-shadow: 0 0 20px rgba(255,255,255,0.9); border-radius: 2px; transition: transform 0.08s ease-out;"></div>
            </div>

            <!-- FTX Bold Text -->
            <div id="fx-ftx-title-\${tplId}" style="font-family: 'Inter', 'Segoe UI', sans-serif; font-weight: 900; font-size: 32px; color: #ffffff; text-shadow: 0 0 20px rgba(255,255,255,0.8); letter-spacing: 1px;">
              FTX
            </div>
          </div>

          <!-- Subtitle -->
          <div id="fx-ftx-sub-\${tplId}" style="position: absolute; bottom: 18px; font-family: monospace; font-size: 9px; font-weight: 800; color: #00f0ff; text-shadow: 0 0 12px #00f0ff; letter-spacing: 4px; text-transform: uppercase;">
            THE GREAT FRAUD
          </div>
        </div>
      \`;
    `;
  content = content.substring(0, prevIdx) + newPrevHtml + content.substring(prevIdx);
  console.log('Added preview HTML block');
}

// 4. Add to hover animation step loop
const stepTarget = "} else if (tplId === 'jani-countdown-panic-suite') {";
const stepIdx = content.indexOf(stepTarget, prevIdx + 200);
if (stepIdx !== -1) {
  const newStepHtml = `} else if (tplId === 'jani-ftx-logo-reveal') {
      const topP = fxContainer?.querySelector(\`#fx-ftx-top-\${tplId}\`);
      const midP = fxContainer?.querySelector(\`#fx-ftx-mid-\${tplId}\`);
      const leftP = fxContainer?.querySelector(\`#fx-ftx-left-\${tplId}\`);
      const botP = fxContainer?.querySelector(\`#fx-ftx-bottom-\${tplId}\`);
      const waveP = fxContainer?.querySelector(\`#fx-ftx-wave-\${tplId}\`);
      const titP = fxContainer?.querySelector(\`#fx-ftx-title-\${tplId}\`);
      const cycleT = t % 7.0;

      if (topP && midP && leftP && botP) {
        if (cycleT < 2.3) {
          const p = cycleT / 2.3;
          topP.style.transform = \`translate(\${-p * 30}px, \${-p * 10}px) rotate(\${cycleT * 120}deg) scale(\${1 - p * 0.3})\`;
          leftP.style.transform = \`translate(\${40 - p * 60}px, \${Math.sin(cycleT * 4) * 12}px)\`;
          botP.style.transform = \`translate(\${60 - p * 70}px, \${Math.cos(cycleT * 4) * 15}px)\`;
          midP.style.transform = \`translate(\${20 - p * 40}px, 20px)\`;
          if (waveP) waveP.style.opacity = '0';
          if (titP) titP.style.opacity = '0.2';
        } else if (cycleT < 3.8) {
          const p = (cycleT - 2.3) / 1.5;
          const wScale = 0.2 + p * 2.8;
          if (waveP) {
            waveP.style.transform = \`translate(-40px, -10px) scale(\${wScale})\`;
            waveP.style.opacity = (1 - p * 0.9).toFixed(2);
          }
          const wobble = Math.sin(p * 20) * 14 * (1 - p);
          leftP.style.transform = \`translate(\${-20 + wobble}px, \${wobble}px) rotate(\${wobble * 3}deg)\`;
          botP.style.transform = \`translate(\${-10 - wobble}px, \${-wobble}px) rotate(\${-wobble * 3}deg)\`;
          topP.style.transform = \`translate(0px, 0px) rotate(\${p * 360}deg)\`;
        } else {
          topP.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          midP.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          leftP.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          botP.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          if (waveP) waveP.style.opacity = '0';
          if (titP) titP.style.opacity = '1';
        }
      }
    `;
  content = content.substring(0, stepIdx) + newStepHtml + content.substring(stepIdx);
  console.log('Added hover animation step block');
}

// 5. Add stage mounting in openTopTemplateCustomizer
const mountTarget = "if (tplId === 'jani-countdown-panic-suite') {";
const mountIdx = content.indexOf(mountTarget);
if (mountIdx !== -1) {
  const newMountHtml = `if (tplId === 'jani-ftx-logo-reveal') {
    const ftxData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('jani-ftx-logo-reveal') : {};
    if (activeHoverAnimFrame) { cancelAnimationFrame(activeHoverAnimFrame); activeHoverAnimFrame = null; }
    hoverBridgeActive = false;
    hoverExternalT = null;
    if (typeof window.tplMountJaniFtxLogoStage === 'function') {
      window.tplMountJaniFtxLogoStage(stage, ftxData);
    }
    return;
  }

  `;
  content = content.substring(0, mountIdx) + newMountHtml + content.substring(mountIdx);
  console.log('Added stage mounting in openTopTemplateCustomizer');
}

// 6. Add timeline scrubber step sync
const scrubTarget = "if (tplId === 'jani-countdown-panic-suite') {";
const scrubIdx = content.indexOf(scrubTarget, mountIdx + 200);
if (scrubIdx !== -1) {
  const newScrubHtml = `if (tplId === 'jani-ftx-logo-reveal') {
    if (typeof window.stepJaniFtxLogoAnimation === 'function') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const ftxData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('jani-ftx-logo-reveal') : {};
      window.stepJaniFtxLogoAnimation(stage, 'jani-ftx-logo-reveal', localSceneT, ftxData);
    }
  }

  `;
  content = content.substring(0, scrubIdx) + newScrubHtml + content.substring(scrubIdx);
  console.log('Added timeline scrubber step sync in app.js');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated app.js!');
