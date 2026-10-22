const fs = require('fs');
let file = fs.readFileSync('magnates-studio/public/js/tpl-contextual-inspector.js', 'utf8');

const targetStr = "window.tplRenderContextualInspector = function(tplId) {\n    if (tplId === 'instagram') {";
const replacementStr = `window.tplRenderContextualInspector = function(tplId) {
    if (tplId === 'hypnotic-vertigo-roll') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapPrim) wrapPrim.style.display = 'block';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';

        if (!topCustomizerState.hypnoticConfig) {
          topCustomizerState.hypnoticConfig = (typeof window.getHypnoticDefaultConfig === 'function')
            ? window.getHypnoticDefaultConfig()
            : { mode: 'pendulum', spinSpeed: 24.0, maxTiltAngle: 18.0, zoomBase: 1.45, zoomBreathing: 0.22, scanlines: true, chromaticAberration: true, hypnoticSpiralWobble: true };
        }
        const cfg = topCustomizerState.hypnoticConfig;

        container.innerHTML = \`
          <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; padding-bottom: 20px;">
            <div style="background: rgba(30, 58, 138, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 12px;">
              <div style="font-size: 12px; font-weight: 700; color: #60a5fa; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                <span>🌀</span> HYPNOTIC VERTIGO & DIZZINESS ROLL
              </div>
              <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
                Slow rolling tilt and dolly-zoom breathing cycle producing psychological trance / vertigo tension.
              </div>
            </div>

            <!-- Motion Mode Toggle -->
            <div>
              <label style="font-size: 11px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px; display: block;">Motion Pattern</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" id="hypnotic-mode-pendulum" style="
                  padding: 8px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;
                  background: \${cfg.mode === 'pendulum' ? '#2563eb' : '#1e293b'};
                  color: \${cfg.mode === 'pendulum' ? '#ffffff' : '#94a3b8'};
                  border: 1px solid \${cfg.mode === 'pendulum' ? '#60a5fa' : 'rgba(255,255,255,0.1)'};
                ">↔ Left-Right Tilt</button>
                <button type="button" id="hypnotic-mode-continuous" style="
                  padding: 8px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;
                  background: \${cfg.mode === 'continuous' ? '#2563eb' : '#1e293b'};
                  color: \${cfg.mode === 'continuous' ? '#ffffff' : '#94a3b8'};
                  border: 1px solid \${cfg.mode === 'continuous' ? '#60a5fa' : 'rgba(255,255,255,0.1)'};
                ">🔄 360° Infinite Roll</button>
              </div>
            </div>

            <!-- Tilt / Spin Speed Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Roll Cycle Duration</span>
                <span id="hypnotic-val-speed" style="color: #60a5fa; font-family: monospace;">\${cfg.spinSpeed}s</span>
              </div>
              <input type="range" id="hypnotic-slider-speed" min="6" max="45" step="1" value="\${cfg.spinSpeed}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- Tilt Angle (only relevant for pendulum) -->
            <div id="hypnotic-tilt-group" style="display: \${cfg.mode === 'pendulum' ? 'block' : 'none'};">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Max Tilt Angle</span>
                <span id="hypnotic-val-tilt" style="color: #60a5fa; font-family: monospace;">±\${cfg.maxTiltAngle}°</span>
              </div>
              <input type="range" id="hypnotic-slider-tilt" min="5" max="45" step="1" value="\${cfg.maxTiltAngle}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- Zoom Base Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Deep Zoom Crop</span>
                <span id="hypnotic-val-zoombase" style="color: #60a5fa; font-family: monospace;">\${Math.round(cfg.zoomBase * 100)}%</span>
              </div>
              <input type="range" id="hypnotic-slider-zoombase" min="1.0" max="2.5" step="0.05" value="\${cfg.zoomBase}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- Zoom Breathing Pulse Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Dolly-Zoom Breathing</span>
                <span id="hypnotic-val-breathing" style="color: #60a5fa; font-family: monospace;">±\${Math.round(cfg.zoomBreathing * 100)}%</span>
              </div>
              <input type="range" id="hypnotic-slider-breathing" min="0.0" max="0.5" step="0.02" value="\${cfg.zoomBreathing}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- FX Toggles -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; cursor: pointer;">
                <span>CRT Scanline Interlacing</span>
                <input type="checkbox" id="hypnotic-chk-scanlines" \${cfg.scanlines ? 'checked' : ''} style="accent-color: #3b82f6;" />
              </label>

              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; cursor: pointer;">
                <span>RGB Chromatic Aberration</span>
                <input type="checkbox" id="hypnotic-chk-chroma" \${cfg.chromaticAberration ? 'checked' : ''} style="accent-color: #3b82f6;" />
              </label>

              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; cursor: pointer;">
                <span>Hypnotic Wobble / Orbital Sway</span>
                <input type="checkbox" id="hypnotic-chk-wobble" \${cfg.hypnoticSpiralWobble ? 'checked' : ''} style="accent-color: #3b82f6;" />
              </label>
            </div>
          </div>
        \`;

        // Wire up event listeners
        const btnPendulum = container.querySelector('#hypnotic-mode-pendulum');
        const btnContinuous = container.querySelector('#hypnotic-mode-continuous');
        const tiltGroup = container.querySelector('#hypnotic-tilt-group');

        btnPendulum?.addEventListener('click', () => {
          cfg.mode = 'pendulum';
          if (btnPendulum) { btnPendulum.style.background = '#2563eb'; btnPendulum.style.color = '#fff'; }
          if (btnContinuous) { btnContinuous.style.background = '#1e293b'; btnContinuous.style.color = '#94a3b8'; }
          if (tiltGroup) tiltGroup.style.display = 'block';
        });

        btnContinuous?.addEventListener('click', () => {
          cfg.mode = 'continuous';
          if (btnContinuous) { btnContinuous.style.background = '#2563eb'; btnContinuous.style.color = '#fff'; }
          if (btnPendulum) { btnPendulum.style.background = '#1e293b'; btnPendulum.style.color = '#94a3b8'; }
          if (tiltGroup) tiltGroup.style.display = 'none';
        });

        container.querySelector('#hypnotic-slider-speed')?.addEventListener('input', (e) => {
          cfg.spinSpeed = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-speed');
          if (lbl) lbl.textContent = cfg.spinSpeed + 's';
        });

        container.querySelector('#hypnotic-slider-tilt')?.addEventListener('input', (e) => {
          cfg.maxTiltAngle = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-tilt');
          if (lbl) lbl.textContent = '±' + cfg.maxTiltAngle + '°';
        });

        container.querySelector('#hypnotic-slider-zoombase')?.addEventListener('input', (e) => {
          cfg.zoomBase = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-zoombase');
          if (lbl) lbl.textContent = Math.round(cfg.zoomBase * 100) + '%';
        });

        container.querySelector('#hypnotic-slider-breathing')?.addEventListener('input', (e) => {
          cfg.zoomBreathing = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-breathing');
          if (lbl) lbl.textContent = '±' + Math.round(cfg.zoomBreathing * 100) + '%';
        });

        container.querySelector('#hypnotic-chk-scanlines')?.addEventListener('change', (e) => {
          cfg.scanlines = e.target.checked;
          const scanEl = document.getElementById('hypnotic-crt-scanlines');
          if (scanEl) scanEl.style.opacity = cfg.scanlines ? '0.9' : '0';
        });

        container.querySelector('#hypnotic-chk-chroma')?.addEventListener('change', (e) => {
          cfg.chromaticAberration = e.target.checked;
          const r = document.getElementById('hypnotic-chroma-red');
          const c = document.getElementById('hypnotic-chroma-cyan');
          if (r) r.style.display = cfg.chromaticAberration ? 'block' : 'none';
          if (c) c.style.display = cfg.chromaticAberration ? 'block' : 'none';
        });

        container.querySelector('#hypnotic-chk-wobble')?.addEventListener('change', (e) => {
          cfg.hypnoticSpiralWobble = e.target.checked;
        });
      }
      return;
    }
    if (tplId === 'instagram') {`;

if (!file.includes(targetStr)) {
  console.error('Target string not found in tpl-contextual-inspector.js');
  process.exit(1);
}

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('magnates-studio/public/js/tpl-contextual-inspector.js', file, 'utf8');
console.log('Successfully updated tpl-contextual-inspector.js for hypnotic-vertigo-roll!');
