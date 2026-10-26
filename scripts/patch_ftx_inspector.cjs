const fs = require('fs');
const filePath = 'magnates-studio/public/js/tpl-contextual-inspector.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. In tplUpdateStageWithContextualData: replace the misplaced inspector code with stage mounting
const badBlock1Start = "if (tplId === 'jani-cross-section-reveal') {\n      const container = document.getElementById('tpl-modal-dynamic-controls');";
const badBlock1End = "if (tplId === 'jani-forbes-fraud-reveal') {\n      const stage = document.getElementById('tpl-modal-preview-stage');";

const pos1 = content.indexOf(badBlock1Start);
const pos2 = content.indexOf(badBlock1End);

if (pos1 !== -1 && pos2 !== -1) {
  const stageMountCode = `if (tplId === 'jani-cross-section-reveal') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#jani-cross-viewport-jani-cross-section-reveal')) {
          if (typeof window.tplMountJaniCrossSectionStage === 'function') {
            window.tplMountJaniCrossSectionStage(stage, data);
          }
        }
        if (typeof window.stepJaniCrossSectionAnimation === 'function') {
          window.stepJaniCrossSectionAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
    if (tplId === 'jani-ftx-logo-reveal') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#jani-ftx-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountJaniFtxLogoStage === 'function') {
            window.tplMountJaniFtxLogoStage(stage, data);
          }
        } else {
          if (typeof window.initJaniFtxLogoScene === 'function') {
            window.initJaniFtxLogoScene(vp, data);
          }
        }
      }
      return;
    }
    `;
  content = content.substring(0, pos1) + stageMountCode + content.substring(pos2);
  console.log('Successfully fixed stage mounting in tplUpdateStageWithContextualData');
} else {
  console.error('Failed to locate bad block 1', pos1, pos2);
}

// 2. In tplRenderContextualInspector: wrap container.innerHTML in backticks and add jani-ftx-logo-reveal inspector
const badBlock2Start = "if (tplId === 'jani-cross-section-reveal') {\n      const container = document.getElementById('tpl-modal-dynamic-controls');";
const pos3 = content.indexOf(badBlock2Start);
const badBlock2End = "if (tplId === 'jani-forbes-fraud-reveal') {\n      const container = document.getElementById('tpl-modal-dynamic-controls');";
const pos4 = content.indexOf(badBlock2End, pos3);

if (pos3 !== -1 && pos4 !== -1) {
  const inspectorCode = `if (tplId === 'jani-cross-section-reveal') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (wrapSec) wrapSec.style.display = 'block';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        container.innerHTML = \`
          <div style="font-size: 11px; font-weight: 700; color: #f59e0b; letter-spacing: 0.5px; margin-bottom: 6px; text-transform: uppercase;">
            ⚡ James Jani Cross-Section Engine Controls
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Hold Zoom (Start → End)</label>
              <div style="display: flex; gap: 4px;">
                <input type="number" id="inp-cross-startzoom" step="0.02" value="\${data.startZoom || 1.1}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
                <input type="number" id="inp-cross-endzoom" step="0.02" value="\${data.holdEndZoom || 1.02}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
              </div>
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Anticipation Zoom Punch</label>
              <input type="number" id="inp-cross-anticzoom" step="0.02" value="\${data.anticipationZoom || 1.08}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Anticipation Rise (px)</label>
              <input type="number" id="inp-cross-rise" step="2" value="\${data.anticipationYOffset || -22}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Scroll Duration (sec)</label>
              <input type="number" id="inp-cross-scrolldur" step="0.2" value="\${data.scrollDuration || 2.2}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; margin-top: 8px;">
            <label style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="inp-cross-dust" \${data.dustEnabled !== false ? 'checked' : ''} /> Floating Dust VFX
            </label>
            <div style="flex: 1; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 9px; color: #94a3b8;">Count:</span>
              <input type="range" id="inp-cross-dustcount" min="10" max="100" value="\${data.dustParticleCount || 45}" style="flex: 1;" />
            </div>
          </div>
        \`;

        const bindCross = (id, key, parser = parseFloat) => {
          const el = document.getElementById(id);
          if (el) {
            el.addEventListener('input', (e) => {
              const val = el.type === 'checkbox' ? el.checked : parser(e.target.value);
              data[key] = val;
              if (typeof window.tplUpdateJaniCrossSection === 'function') {
                window.tplUpdateJaniCrossSection({ [key]: val });
              }
            });
          }
        };

        bindCross('inp-cross-startzoom', 'startZoom');
        bindCross('inp-cross-endzoom', 'holdEndZoom');
        bindCross('inp-cross-anticzoom', 'anticipationZoom');
        bindCross('inp-cross-rise', 'anticipationYOffset');
        bindCross('inp-cross-scrolldur', 'scrollDuration');
        bindCross('inp-cross-dust', 'dustEnabled', v => v);
        bindCross('inp-cross-dustcount', 'dustParticleCount', parseInt);
      }
      return;
    }
    if (tplId === 'jani-ftx-logo-reveal') {
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
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildJaniFtxLogoInspector === 'function') {
          window.tplBuildJaniFtxLogoInspector(container, data, tplId);
        }
      }
      return;
    }
    `;
  content = content.substring(0, pos3) + inspectorCode + content.substring(pos4);
  console.log('Successfully fixed inspector rendering in tplRenderContextualInspector');
} else {
  console.error('Failed to locate bad block 2', pos3, pos4);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated tpl-contextual-inspector.js successfully!');
