/**
 * Photorealistic 3D Paper Artifact Reveal Engine (Animated Checklist)
 * Replicating investigative documentary standards (Vox, James Jani, Magnates Media, Johnny Harris)
 *
 * Supports Dual Master Aesthetic Choices:
 * - Choice A (Image 2): "Stacked Evidence Slips" (Tactile cut paper slips falling down and pinned with masking tape)
 * - Choice B (Image 3): "3D Spatial Dossier" (25°-35° tilted weathered parchment document with rubber seal stamp & f/2.8 shallow DOF)
 */

(function() {
  'use strict';

  const CHECKLIST_DEFAULTS = {
    type: 'checklist',
    layoutMode: 'slips', // 'slips' (Image 2) or 'dossier' (Image 3)
    bgEnvironment: 'desk', // 'desk' (Dark Mahogany Desk) or 'blueprint' (Investigative Blue Map Grid)
    title: 'ACTION STEPS',
    items: [
      { text: 'Register Company LLC', checked: true },
      { text: 'Open Business Account', checked: true },
      { text: 'Acquire First 100 Clients', checked: true },
      { text: 'Automate Sales Funnel', checked: true }
    ],
    activeFocusIndex: 3, // f/2.8 focus item (0..N, or -1 for all sharp)
    depthOfField: true,
    spotlightIntensity: 1.0, // 0.2 to 1.5
    volumetricDust: true,
    stampColor: '#15803d', // authentic distressed green ink
    tiltAngleX: 14, // spatial pitch
    tiltAngleY: 0, // spatial yaw
    coverageScale: 58, // 50% - 65% of viewport width
    organicTape: true,
    organicStampSeal: true,
    organicStampSlam: true
  };

  window.CHECKLIST_3D_DEFAULTS = CHECKLIST_DEFAULTS;

  /**
   * Generates procedural SVG paper grain & deckle filter (embedded once per root)
   */
  function getPaperDefsSvg() {
    return `
      <svg class="cl-procedural-defs" style="position: absolute; width: 0; height: 0; pointer-events: none;" aria-hidden="true">
        <defs>
          <!-- Ink Stamp Distressed Rough Edge & Porous Filter -->
          <filter id="cl-ink-bleed-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 1.2 -0.05" in="displaced" result="punchy" />
            <feBlend in="SourceGraphic" in2="punchy" mode="multiply" />
          </filter>

          <!-- Paper Fiber Surface Texture -->
          <filter id="cl-paper-fiber" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="grain" />
            <feColorMatrix type="matrix" values="
              0 0 0 0 0.94
              0 0 0 0 0.91
              0 0 0 0 0.82
              0 0 0 0.22 0" />
            <feBlend mode="multiply" in="SourceGraphic" result="blend" />
          </filter>

          <!-- Masking Tape Wrinkled Adhesive Texture -->
          <linearGradient id="cl-tape-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(245, 235, 205, 0.55)" />
            <stop offset="15%" stop-color="rgba(250, 242, 220, 0.78)" />
            <stop offset="50%" stop-color="rgba(240, 228, 195, 0.65)" />
            <stop offset="85%" stop-color="rgba(252, 245, 225, 0.75)" />
            <stop offset="100%" stop-color="rgba(242, 230, 200, 0.55)" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  /**
   * Generates Topographic Coordinate Map Blueprint SVG Backdrop
   */
  function getBlueprintBackdropSvg() {
    return `
      <div class="cl-backdrop-blueprint">
        <!-- Coordinate HUD Markings -->
        <div class="cl-blueprint-hud cl-hud-tl">
          <span class="cl-coord-label">LAT // 40°42'51"N</span>
          <span class="cl-coord-label">LON // 74°00'23"W</span>
        </div>
        <div class="cl-blueprint-hud cl-hud-tr">
          <span class="cl-coord-badge">GRID REF 8842-X</span>
          <span class="cl-coord-label">ELEV 142M · SECTOR 04</span>
        </div>
        <div class="cl-blueprint-hud cl-hud-br">
          <span class="cl-coord-label">FORENSIC TACTICAL OVERLAY</span>
        </div>

        <!-- Topographic Contour Lines & Crosshair Grid -->
        <svg class="cl-blueprint-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <!-- Fine Tactical Grid Lines -->
          <pattern id="cl-topo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.12)" stroke-width="0.8" />
            <circle cx="60" cy="60" r="1.5" fill="rgba(56, 189, 248, 0.25)" />
          </pattern>
          <rect width="1000" height="600" fill="url(#cl-topo-grid)" />

          <!-- Major Coordinate Crosshairs -->
          <g stroke="rgba(56, 189, 248, 0.28)" stroke-width="1.2">
            <!-- Center Crosshair Left -->
            <line x1="180" y1="140" x2="200" y2="140" />
            <line x1="190" y1="130" x2="190" y2="150" />
            <!-- Center Crosshair Right -->
            <line x1="810" y1="440" x2="830" y2="440" />
            <line x1="820" y1="430" x2="820" y2="450" />
            <!-- Major Crosshair Mid -->
            <line x1="500" y1="60" x2="500" y2="90" stroke-dasharray="3,3" />
            <line x1="500" y1="510" x2="500" y2="540" stroke-dasharray="3,3" />
            <line x1="80" y1="300" x2="110" y2="300" stroke-dasharray="3,3" />
            <line x1="890" y1="300" x2="920" y2="300" stroke-dasharray="3,3" />
          </g>

          <!-- Organic Topographic Elevation Curves (Johnny Harris / Investigative Style) -->
          <g fill="none" stroke="rgba(56, 189, 248, 0.16)" stroke-width="1.2">
            <path d="M -50 120 C 180 80, 260 220, 480 180 C 700 140, 780 290, 1050 240" />
            <path d="M -50 190 C 150 140, 240 280, 450 250 C 660 220, 740 370, 1050 310" stroke-width="0.8" opacity="0.8" />
            <path d="M -50 260 C 120 200, 210 350, 420 320 C 630 290, 700 440, 1050 380" stroke-width="1.4" opacity="0.9" />
            <path d="M -50 330 C 90 270, 180 410, 390 390 C 600 360, 670 510, 1050 450" stroke-width="0.8" opacity="0.7" />
            <path d="M -50 410 C 60 340, 150 480, 360 460 C 570 430, 640 580, 1050 520" stroke-width="1.1" opacity="0.75" />
            <path d="M -50 490 C 40 420, 120 540, 330 530 C 540 510, 610 630, 1050 590" stroke-width="0.8" opacity="0.6" />
          </g>

          <!-- Topographic Elevation Indices (Numbers) -->
          <text x="120" y="275" fill="rgba(56, 189, 248, 0.35)" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">120m</text>
          <text x="890" y="395" fill="rgba(56, 189, 248, 0.35)" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">180m</text>
          <text x="760" y="165" fill="rgba(56, 189, 248, 0.28)" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">INDEX // 240</text>

          <!-- Compass Rose Navigator (Top-Right) -->
          <g transform="translate(870, 95)" opacity="0.4">
            <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="0.8" stroke-dasharray="2,3" />
            <polygon points="0,-24 5,-6 0,-10 -5,-6" fill="#38bdf8" />
            <polygon points="0,24 5,6 0,10 -5,6" fill="rgba(56, 189, 248, 0.4)" />
            <polygon points="-24,0 -6,5 -10,0 -6,-5" fill="rgba(56, 189, 248, 0.4)" />
            <polygon points="24,0 6,5 10,0 6,-5" fill="rgba(56, 189, 248, 0.4)" />
            <text x="0" y="-28" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-size="8" font-weight="800" text-anchor="middle">N</text>
          </g>
        </svg>
      </div>
    `;
  }

  /**
   * Generates Translucent Masking Tape Strip HTML
   */
  function getMaskingTapeHtml(extraStyle = '') {
    return `
      <div class="cl-masking-tape" style="${extraStyle}">
        <div class="cl-tape-texture"></div>
        <div class="cl-tape-edge-left"></div>
        <div class="cl-tape-edge-right"></div>
      </div>
    `;
  }

  /**
   * Generates Photorealistic Distressed Ink Stamp Checkbox & Mark
   */
  function getInkStampCheckboxHtml(isChecked, stampColor, stampDelay, isSlamActive) {
    const slamClass = isSlamActive ? 'is-slamming' : '';
    
    return `
      <div class="cl-stamp-box-wrap ${slamClass}" style="--cl-stamp-color: ${stampColor}; --cl-stamp-delay: ${stampDelay}s;">
        <svg class="cl-stamp-svg" viewBox="0 0 38 38" width="34" height="34">
          <!-- Distressed Stamped Outer Box -->
          <rect x="3.5" y="3.5" width="31" height="31" rx="2.5" 
                fill="none" 
                stroke="${stampColor}" 
                stroke-width="2.8" 
                stroke-dasharray="32 1.5 28 2" 
                class="cl-stamp-border" />
          
          <!-- Inner Stamped Checkmark (Heavy rubber ink impression) -->
          ${isChecked ? `
            <path d="M 9 19 L 16 26.5 L 29 11.5" 
                  fill="none" 
                  stroke="${stampColor}" 
                  stroke-width="4.2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="cl-stamp-check" />
          ` : ''}
        </svg>
        <div class="cl-stamp-ink-bleed"></div>
      </div>
    `;
  }

  /**
   * Generates Official Circular Rubber Stamp Seal (Mode B: Image 3)
   */
  function getOfficialStampSealHtml(stampColor) {
    return `
      <div class="cl-official-stamp-seal" style="--cl-seal-color: ${stampColor};">
        <svg viewBox="0 0 100 100" width="88" height="88">
          <!-- Double Distressed Circular Rings -->
          <circle cx="50" cy="50" r="44" fill="none" stroke="${stampColor}" stroke-width="2.6" stroke-dasharray="80 2 60 3" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="${stampColor}" stroke-width="1.2" stroke-dasharray="50 1.5 40 2" />
          
          <!-- Star Badges -->
          <text x="18" y="53" fill="${stampColor}" font-size="8" text-anchor="middle">★</text>
          <text x="82" y="53" fill="${stampColor}" font-size="8" text-anchor="middle">★</text>
          
          <!-- Curved Arc Text Paths -->
          <path id="cl-seal-arc-top" d="M 20 50 A 30 30 0 0 1 80 50" fill="none" />
          <path id="cl-seal-arc-bot" d="M 80 50 A 30 30 0 0 1 20 50" fill="none" />
          
          <text font-family="'Space Grotesk', sans-serif" font-size="7.5" font-weight="900" letter-spacing="1.8" fill="${stampColor}">
            <textPath href="#cl-seal-arc-top" startOffset="50%" text-anchor="middle">
              VERIFIED // EVIDENCE
            </textPath>
          </text>
          
          <text font-family="'Space Grotesk', sans-serif" font-size="7" font-weight="800" letter-spacing="1.5" fill="${stampColor}">
            <textPath href="#cl-seal-arc-bot" startOffset="50%" text-anchor="middle">
              FORENSIC AUDIT
            </textPath>
          </text>
          
          <!-- Center Stamped Approved Text -->
          <text x="50" y="47" fill="${stampColor}" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="900" letter-spacing="0.8" text-anchor="middle">
            APPROVED
          </text>
          <line x1="28" y1="52" x2="72" y2="52" stroke="${stampColor}" stroke-width="1.4" />
          <text x="50" y="60" fill="${stampColor}" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" letter-spacing="0.5" text-anchor="middle">
            DOC #8842-X
          </text>
        </svg>
      </div>
    `;
  }

  /**
   * Generates Floating Volumetric Dust Motes
   */
  function getVolumetricDustMotesHtml() {
    const motes = [
      { top: '22%', left: '42%', size: '3.5px', delay: '0s', dur: '7s', dx: '28px', dy: '-75px' },
      { top: '38%', left: '48%', size: '2.5px', delay: '1.2s', dur: '8.5s', dx: '-32px', dy: '-85px' },
      { top: '55%', left: '52%', size: '4px', delay: '2.5s', dur: '6.8s', dx: '35px', dy: '-95px' },
      { top: '28%', left: '58%', size: '3px', delay: '0.8s', dur: '9s', dx: '-24px', dy: '-65px' },
      { top: '46%', left: '38%', size: '2.2px', delay: '3.1s', dur: '7.8s', dx: '30px', dy: '-80px' },
      { top: '64%', left: '45%', size: '3.2px', delay: '1.8s', dur: '8.2s', dx: '-38px', dy: '-90px' },
      { top: '32%', left: '62%', size: '4.5px', delay: '4.0s', dur: '9.5s', dx: '22px', dy: '-70px' },
      { top: '50%', left: '56%', size: '2.8px', delay: '2.2s', dur: '7.2s', dx: '-26px', dy: '-85px' }
    ];

    return `
      <div class="cl-dust-container">
        ${motes.map(m => `
          <div class="cl-dust-mote" style="top: ${m.top}; left: ${m.left}; width: ${m.size}; height: ${m.size}; --dx: ${m.dx}; --dy: ${m.dy}; animation-duration: ${m.dur}; animation-delay: ${m.delay};"></div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Main Template HTML Builder: window.tplBuildChecklistHtml(data)
   */
  window.tplBuildChecklistHtml = function(customData) {
    const data = Object.assign({}, CHECKLIST_DEFAULTS, customData || {});
    const isDossier = (data.layoutMode === 'dossier');
    const bgEnv = data.bgEnvironment || 'desk';
    const stampColor = data.stampColor || '#15803d';
    const spotIntensity = (typeof data.spotlightIntensity === 'number') ? data.spotlightIntensity : 1.0;
    const isDof = data.depthOfField !== false;
    const focusIdx = (typeof data.activeFocusIndex === 'number') ? data.activeFocusIndex : (data.items.length - 1);
    
    // Scale factor: Robust unitless multiplier (1.00 = default 58% coverage)
    const rawCoverage = typeof data.coverageScale === 'number' ? data.coverageScale : 58;
    const scaleFactor = (Math.max(40, Math.min(85, rawCoverage)) / 58).toFixed(3);
    
    // 3D Spatial Angles
    const tiltX = (typeof data.tiltAngleX === 'number') ? data.tiltAngleX : (isDossier ? 28 : 14);
    const tiltY = (typeof data.tiltAngleY === 'number') ? data.tiltAngleY : (isDossier ? -12 : 0);
    const tiltZ = isDossier ? 2.5 : 0;

    const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : CHECKLIST_DEFAULTS.items;

    // Organic slip rotation angles matching Image 2
    const slipAngles = [-1.4, 1.8, -0.9, 1.3, -1.6, 1.5];

    return `
      <div class="tpl-checklist ${isDossier ? 'mode-dossier' : 'mode-slips'} env-${bgEnv}" 
           style="--cl-spot-intensity: ${spotIntensity}; --cl-scale-factor: ${scaleFactor};">
        
        ${getPaperDefsSvg()}

        <!-- 1. BACKDROP FOR MOOD & CONTEXT -->
        ${bgEnv === 'desk' ? `
          <div class="cl-desk-surface">
            <!-- Faint tactical coordinate blueprint overlay layered onto rich wood grain -->
            <div class="cl-desk-tactical-wash"></div>
          </div>
        ` : getBlueprintBackdropSvg()}

        <!-- 2. CINEMATIC ATMOSPHERIC LIGHTING PASS -->
        <!-- Overhead Key Spotlight Beam with Focused Hotspot -->
        <div class="cl-overhead-spotlight"></div>
        
        <!-- Volumetric Ambient Light Shafts / God Rays -->
        <div class="cl-volumetric-shafts"></div>

        <!-- Floating Volumetric Dust Motes drifting in the beam -->
        ${data.volumetricDust !== false ? getVolumetricDustMotesHtml() : ''}

        <!-- Deep Cinematic Edge Vignette -->
        <div class="cl-cinematic-vignette"></div>

        <!-- 3. 3D SPATIAL RIG & VIEWPORT FRAMING -->
        <div class="cl-3d-spatial-rig">
          <div class="cl-3d-stage" style="transform: perspective(1100px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${scaleFactor});">

            ${isDossier ? `
              <!-- CHOICE B (IMAGE 3): 3D SPATIAL AGED PARCHMENT DOSSIER SHEET (FALLING DOSSIER) -->
              <div class="cl-dossier-sheet ${isDof ? 'has-shallow-dof' : ''}">
                <div class="cl-paper-grain-overlay"></div>
                <div class="cl-paper-deckle-edge"></div>
                <div class="cl-paper-crease-h"></div>
                
                <!-- Inner Document Margin -->
                <div class="cl-dossier-inner">
                  <!-- Header Markings -->
                  <div class="cl-dossier-header">
                    <span class="cl-dossier-agency">INVESTIGATIVE ACTION FILE</span>
                    <span class="cl-dossier-code">CASE #8842-EVIDENCE</span>
                  </div>

                  <!-- Checklist Items inscribed onto sheet -->
                  <div class="cl-dossier-items-list">
                    ${items.map((item, idx) => {
                      const isFocused = (focusIdx === -1 || idx === focusIdx);
                      const blurClass = (isDof && !isFocused) ? 'is-blurred-dof' : 'is-sharp-focus';
                      const isChecked = (typeof item === 'object') ? item.checked !== false : true;
                      const text = (typeof item === 'object') ? (item.text || '') : item;
                      const itemDelay = (0.55 + idx * 0.3).toFixed(2);
                      const stampDelay = (0.7 + idx * 0.3).toFixed(2);

                      return `
                        <div class="cl-dossier-item ${blurClass}" style="--cl-item-delay: ${itemDelay}s;" data-item-idx="${idx}">
                          ${getInkStampCheckboxHtml(isChecked, stampColor, stampDelay, data.organicStampSlam !== false)}
                          <div class="cl-item-text">${text}</div>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <!-- Official Verified Rubber Stamp Seal (Image 3) -->
                  ${data.organicStampSeal !== false ? getOfficialStampSealHtml(stampColor) : ''}
                </div>
              </div>
            ` : `
              <!-- CHOICE A (IMAGE 2): STACKED TACTILE EVIDENCE SLIPS PINNED WITH TAPE (FALLING SLIPS) -->
              <div class="cl-slips-stack ${isDof ? 'has-shallow-dof' : ''}">
                ${items.map((item, idx) => {
                  const isFocused = (focusIdx === -1 || idx === focusIdx);
                  const blurClass = (isDof && !isFocused) ? 'is-blurred-dof' : 'is-sharp-focus';
                  const isChecked = (typeof item === 'object') ? item.checked !== false : true;
                  const text = (typeof item === 'object') ? (item.text || '') : item;
                  const rot = slipAngles[idx % slipAngles.length];
                  const dropDelay = (idx * 0.32 + 0.08).toFixed(2);
                  const stampDelay = (idx * 0.32 + 0.48).toFixed(2);

                  return `
                    <div class="cl-evidence-slip-wrapper ${blurClass}" 
                         style="--cl-slip-rot: ${rot}deg; --cl-drop-delay: ${dropDelay}s;" 
                         data-item-idx="${idx}">
                      
                      <!-- Translucent Masking Tape Pinning the Slip (Snaps after landing) -->
                      ${data.organicTape !== false ? getMaskingTapeHtml() : ''}

                      <div class="cl-evidence-slip">
                        <div class="cl-paper-grain-overlay"></div>
                        
                        <!-- Ink Stamped Checkmark Box (Slams after drop) -->
                        ${getInkStampCheckboxHtml(isChecked, stampColor, stampDelay, data.organicStampSlam !== false)}
                        
                        <!-- Tactile Paper Inscription Text -->
                        <div class="cl-item-text">${text}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}

          </div>
        </div>

      </div>
    `;
  };

  /**
   * Re-triggers the falling paper slips & stamp slam animations
   */
  window.tplTriggerChecklistStampAnimation = function(container) {
    if (!container) return;
    const animEls = container.querySelectorAll('.cl-evidence-slip-wrapper, .cl-dossier-sheet, .cl-dossier-item, .cl-stamp-box-wrap, .cl-masking-tape, .cl-official-stamp-seal');
    animEls.forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth; // Force reflow
      el.style.animation = '';
    });
  };

  /**
   * Contextual Inspector Controls Builder for Animated Checklist
   */
  window.tplBuildChecklistInspector = function(container, customData, tplId) {
    if (!container) return;
    const data = Object.assign({}, CHECKLIST_DEFAULTS, customData || {});
    const items = Array.isArray(data.items) ? data.items : CHECKLIST_DEFAULTS.items;

    const stampColors = [
      { label: 'Forensic Green', val: '#15803d' },
      { label: 'Emerald Mint', val: '#10b981' },
      { label: 'Bureau Crimson', val: '#b91c1c' },
      { label: 'Navy Classified', val: '#1d4ed8' },
      { label: 'Noir Charcoal', val: '#1e293b' }
    ];

    container.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 12px;">
        
        <!-- HEADER -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <span style="font-size: 15px;">📋</span>
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.8px;">3D PAPER ARTIFACT ENGINE</div>
              <div style="font-size: 9px; color: #94a3b8;">Physical Evidence Checklist &amp; Stamp Reveal</div>
            </div>
          </div>
          <button type="button" id="cl-btn-replay-slam" style="font-size: 9.5px; font-weight: 800; color: #34d399; cursor: pointer; padding: 3px 8px; border-radius: 5px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); display: flex; align-items: center; gap: 4px;">
            <span>⚡ Slam Stamp</span>
          </button>
        </div>

        <!-- 1. MASTER LAYOUT CHOICE (Image 2 vs Image 3) -->
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">1. Documentary Presentation Choice</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" id="cl-choice-slips" class="cl-btn-choice" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 7px 8px; border-radius: 6px; cursor: pointer; background: ${data.layoutMode === 'slips' ? 'rgba(16,185,129,0.22)' : 'rgba(0,0,0,0.35)'}; border: 1px solid ${data.layoutMode === 'slips' ? '#10b981' : 'rgba(255,255,255,0.12)'}; color: #fff;">
              <span style="font-size: 10px; font-weight: 800;">📑 Stacked Slips</span>
              <span style="font-size: 8px; color: #94a3b8;">Image 2 (Taped Evidence)</span>
            </button>
            <button type="button" id="cl-choice-dossier" class="cl-btn-choice" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 7px 8px; border-radius: 6px; cursor: pointer; background: ${data.layoutMode === 'dossier' ? 'rgba(16,185,129,0.22)' : 'rgba(0,0,0,0.35)'}; border: 1px solid ${data.layoutMode === 'dossier' ? '#10b981' : 'rgba(255,255,255,0.12)'}; color: #fff;">
              <span style="font-size: 10px; font-weight: 800;">🗺️ 3D Spatial Dossier</span>
              <span style="font-size: 8px; color: #94a3b8;">Image 3 (Tilted Document)</span>
            </button>
          </div>
        </div>

        <!-- 2. ENVIRONMENT & MOOD BACKDROP -->
        <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">2. Environment &amp; Backdrop</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #94a3b8; text-transform: uppercase;">Surface Backdrop</span>
              <select id="cl-sel-bg" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 4px; color: #fff; font-size: 9.5px;">
                <option value="desk" ${data.bgEnvironment === 'desk' ? 'selected' : ''}>🪵 Dark Mahogany Desk</option>
                <option value="blueprint" ${data.bgEnvironment === 'blueprint' ? 'selected' : ''}>🌐 Investigative Blue Grid</option>
              </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Key Spotlight</span>
                <span id="cl-val-spotlight">${Math.round((data.spotlightIntensity || 1.0) * 100)}%</span>
              </div>
              <input type="range" id="cl-range-spotlight" min="20" max="150" value="${Math.round((data.spotlightIntensity || 1.0) * 100)}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>
          </div>
        </div>

        <!-- 3. CINEMATIC OPTICS & 3D RIG -->
        <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">3. Cinematic Optics &amp; 3D Rig</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
              <input type="checkbox" id="cl-chk-dust" ${data.volumetricDust !== false ? 'checked' : ''} style="accent-color: #34d399;" />
              <span>Volumetric Dust Motes</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
              <input type="checkbox" id="cl-chk-dof" ${data.depthOfField !== false ? 'checked' : ''} style="accent-color: #34d399;" />
              <span>f/2.8 Depth of Field</span>
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 4px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Tilt X</span>
                <span id="cl-val-tiltx">${data.tiltAngleX !== undefined ? data.tiltAngleX : (data.layoutMode === 'dossier' ? 28 : 14)}°</span>
              </div>
              <input type="range" id="cl-range-tiltx" min="0" max="45" value="${data.tiltAngleX !== undefined ? data.tiltAngleX : (data.layoutMode === 'dossier' ? 28 : 14)}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Yaw Y</span>
                <span id="cl-val-tilty">${data.tiltAngleY !== undefined ? data.tiltAngleY : (data.layoutMode === 'dossier' ? -12 : 0)}°</span>
              </div>
              <input type="range" id="cl-range-tilty" min="-30" max="30" value="${data.tiltAngleY !== undefined ? data.tiltAngleY : (data.layoutMode === 'dossier' ? -12 : 0)}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Coverage</span>
                <span id="cl-val-scale">${data.coverageScale || 58}%</span>
              </div>
              <input type="range" id="cl-range-scale" min="45" max="75" value="${data.coverageScale || 58}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>
          </div>
        </div>

        <!-- 4. CHECKLIST ITEMS & INK STAMPS -->
        <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">4. Checklist Items &amp; Stamps</span>
            <button type="button" id="cl-btn-add-item" style="font-size: 9px; font-weight: 700; color: #34d399; cursor: pointer; padding: 2px 6px; border-radius: 4px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);">
              + Add Item
            </button>
          </div>

          <!-- Color Swatches for Rubber Ink Stamp -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 8.5px; color: #94a3b8;">Stamp Ink:</span>
            <div style="display: flex; align-items: center; gap: 5px;">
              ${stampColors.map(c => `
                <div class="cl-color-dot" data-val="${c.val}" title="${c.label}" style="width: 15px; height: 15px; border-radius: 50%; background: ${c.val}; cursor: pointer; border: ${data.stampColor === c.val ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)'};"></div>
              `).join('')}
            </div>
          </div>

          <!-- Items List Inputs -->
          <div style="display: flex; flex-direction: column; gap: 5px; max-height: 190px; overflow-y: auto; padding-right: 2px;">
            ${items.map((item, idx) => {
              const isChecked = (typeof item === 'object') ? item.checked !== false : true;
              const text = (typeof item === 'object') ? (item.text || '') : item;

              return `
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.06);">
                  <input type="checkbox" class="cl-item-chk" data-idx="${idx}" ${isChecked ? 'checked' : ''} style="accent-color: #34d399;" title="Toggle Checked Stamp" />
                  <input type="text" class="cl-item-input" data-idx="${idx}" value="${text.replace(/"/g, '&quot;')}" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #fff; font-size: 9px;" />
                  <button type="button" class="cl-item-focus-btn" data-idx="${idx}" style="background: none; border: none; cursor: pointer; font-size: 10px; color: ${data.activeFocusIndex === idx ? '#34d399' : '#64748b'};" title="Focus this item in f/2.8 DOF">🔍</button>
                  ${items.length > 1 ? `
                    <button type="button" class="cl-item-del-btn" data-idx="${idx}" style="background: none; border: none; cursor: pointer; font-size: 10px; color: #ef4444;" title="Delete Item">✕</button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    // Hook Events
    const update = (patch) => {
      window.tplSetContextualData(tplId, patch);
      window.tplRenderContextualInspector(tplId);
    };

    // Mode Choices
    const btnSlips = container.querySelector('#cl-choice-slips');
    if (btnSlips) {
      btnSlips.onclick = () => update({ layoutMode: 'slips', tiltAngleX: 14, tiltAngleY: 0 });
    }
    const btnDossier = container.querySelector('#cl-choice-dossier');
    if (btnDossier) {
      btnDossier.onclick = () => update({ layoutMode: 'dossier', tiltAngleX: 28, tiltAngleY: -12 });
    }

    // Background Environment
    const selBg = container.querySelector('#cl-sel-bg');
    if (selBg) {
      selBg.onchange = (e) => update({ bgEnvironment: e.target.value });
    }

    // Spotlight Slider
    const rangeSpot = container.querySelector('#cl-range-spotlight');
    if (rangeSpot) {
      rangeSpot.oninput = (e) => {
        const val = parseInt(e.target.value, 10) / 100;
        const valEl = container.querySelector('#cl-val-spotlight');
        if (valEl) valEl.textContent = `${e.target.value}%`;
        window.tplSetContextualData(tplId, { spotlightIntensity: val });
      };
    }

    // Volumetric Dust & DOF
    const chkDust = container.querySelector('#cl-chk-dust');
    if (chkDust) {
      chkDust.onchange = (e) => update({ volumetricDust: e.target.checked });
    }
    const chkDof = container.querySelector('#cl-chk-dof');
    if (chkDof) {
      chkDof.onchange = (e) => update({ depthOfField: e.target.checked });
    }

    // Tilt & Scale Sliders
    const rangeTiltX = container.querySelector('#cl-range-tiltx');
    if (rangeTiltX) {
      rangeTiltX.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#cl-val-tiltx');
        if (valEl) valEl.textContent = `${val}°`;
        window.tplSetContextualData(tplId, { tiltAngleX: val });
      };
    }
    const rangeTiltY = container.querySelector('#cl-range-tilty');
    if (rangeTiltY) {
      rangeTiltY.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#cl-val-tilty');
        if (valEl) valEl.textContent = `${val}°`;
        window.tplSetContextualData(tplId, { tiltAngleY: val });
      };
    }
    const rangeScale = container.querySelector('#cl-range-scale');
    if (rangeScale) {
      rangeScale.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#cl-val-scale');
        if (valEl) valEl.textContent = `${val}%`;
        window.tplSetContextualData(tplId, { coverageScale: val });
      };
    }

    // Ink Color Dots
    container.querySelectorAll('.cl-color-dot').forEach(dot => {
      dot.onclick = () => update({ stampColor: dot.dataset.val });
    });

    // Replay Slam & Drop
    const btnReplay = container.querySelector('#cl-btn-replay-slam');
    if (btnReplay) {
      btnReplay.onclick = () => {
        const stage = document.querySelector(`.tpl-checklist`);
        if (stage && typeof window.tplTriggerChecklistStampAnimation === 'function') {
          window.tplTriggerChecklistStampAnimation(stage.parentElement);
        }
      };
    }

    // Items Inputs & Checkboxes
    container.querySelectorAll('.cl-item-input').forEach(inp => {
      inp.oninput = (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        const curItems = Array.isArray(data.items) ? [...data.items] : [...CHECKLIST_DEFAULTS.items];
        if (typeof curItems[idx] === 'object') {
          curItems[idx] = Object.assign({}, curItems[idx], { text: e.target.value });
        } else {
          curItems[idx] = { text: e.target.value, checked: true };
        }
        window.tplSetContextualData(tplId, { items: curItems });
      };
    });

    container.querySelectorAll('.cl-item-chk').forEach(chk => {
      chk.onchange = (e) => {
        const idx = parseInt(chk.dataset.idx, 10);
        const curItems = Array.isArray(data.items) ? [...data.items] : [...CHECKLIST_DEFAULTS.items];
        if (typeof curItems[idx] === 'object') {
          curItems[idx] = Object.assign({}, curItems[idx], { checked: e.target.checked });
        } else {
          curItems[idx] = { text: curItems[idx], checked: e.target.checked };
        }
        update({ items: curItems, activeFocusIndex: idx });
      };
    });

    container.querySelectorAll('.cl-item-focus-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        update({ activeFocusIndex: idx });
      };
    });

    container.querySelectorAll('.cl-item-del-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const curItems = Array.isArray(data.items) ? [...data.items] : [...CHECKLIST_DEFAULTS.items];
        curItems.splice(idx, 1);
        update({ items: curItems });
      };
    });

    const btnAddItem = container.querySelector('#cl-btn-add-item');
    if (btnAddItem) {
      btnAddItem.onclick = () => {
        const curItems = Array.isArray(data.items) ? [...data.items] : [...CHECKLIST_DEFAULTS.items];
        curItems.push({ text: `Step ${curItems.length + 1} milestone`, checked: true });
        update({ items: curItems, activeFocusIndex: curItems.length - 1 });
      };
    }
  };

})();
