/**
 * James Jani Narrative Puzzle & Modular Reconstruction Engine (2.0)
 * 
 * Features:
 * 1. Procedural Jigsaw Path Generator:
 *    Generates authentic jigsaw interlocking tab / blank Bezier curve paths
 *    for any NxM grid (2x2, 2x3, 3x3, 4x3, 4x4, etc.).
 * 
 * 2. Visual Aesthetic (matching James Jani's exact documentary look):
 *    - Cyan/Neon glowing outlines (#00f2fe / #38bdf8 / #818cf8) with multi-layered bloom
 *    - Dark moody background (#030508) with subtle volumetric vignetting & radial lighting
 *    - Ambient floating dust particles
 *    - Modular badge / label cards (e.g. "THE CRYPTO BOOM", "FTT TOKEN", "ALAMEDA RESEARCH")
 *    - Cutout portrait / icon integration directly on individual puzzle pieces
 * 
 * 3. Dynamic Animation Sequencing (Custom choreography matching the reference video):
 *    - Phase 1: Lead Piece arrives from top-left into center with ease-out cubic & cyan glow.
 *    - Phase 2: Second Piece enters from above, slides down, and snaps into place with click SFX.
 *    - Phase 3: The pair drifts leftward to re-center.
 *    - Phase 4: Full puzzle cascade: Multiple pieces fly in from left and right, snapping together.
 *    - Phase 5: Cinematic Camera Pan & 3D tilt across the completed puzzle wall.
 * 
 * 4. Granular Interactive Control (Shuffleable & Dynamic):
 *    - Mode: "Storyboard Sequence" (the full James Jani video animation)
 *    - Mode: "Falling Pieces" (gravity drops into position)
 *    - Mode: "Explode / Pop Out" (pop a piece out in 3D depth)
 *    - Mode: "Shuffle Scatter" (pieces dynamically disarrange and reconnect)
 *    - Custom Image Slicing: Any user-provided image is automatically sliced across the puzzle!
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'jani-puzzle-narrative-suite';

  // Default Preset Matching James Jani Reference Video
  const DEFAULT_CONFIG = {
    // Sizing & Grid
    cols: 3,
    rows: 2,
    aspectRatio: 16 / 9,
    
    // Aesthetic Styling
    glowColor: '#00f2fe',
    glowIntensity: 18,
    glowOpacity: 0.85,
    borderWidth: 2.2,
    innerDarken: 0.25,
    techGridOverlay: true,
    dustEnabled: true,
    dustCount: 35,
    vignetteIntensity: 0.65,
    
    // Custom Plate / Base Image
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    title: 'THE CRYPTO CONSPIRACY',
    
    // Animation Mode: 'cinematic-story' | 'assemble' | 'scatter' | 'fall' | 'pop-isolate'
    animationMode: 'cinematic-story',
    speed: 1.0,
    duration: 10.0,
    isolatedPieceIndex: 1, // for pop-isolate mode
    
    // Storyboard Pieces Metadata (like in reference video)
    piecesData: [
      {
        id: 0,
        col: 0, row: 1,
        label: 'THE CRYPTO BOOM',
        badgeType: 'label-strip',
        portraitUrl: '',
        tabTop: 1, tabRight: 1, tabBottom: 0, tabLeft: 0
      },
      {
        id: 1,
        col: 1, row: 0,
        label: 'ALAMEDA RESEARCH',
        badgeType: 'card',
        portraitUrl: '',
        tabTop: 0, tabRight: 1, tabBottom: 1, tabLeft: -1
      },
      {
        id: 2,
        col: 1, row: 1,
        label: 'SAM BANKMAN-FRIED',
        badgeType: 'portrait',
        portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        tabTop: -1, tabRight: 1, tabBottom: 0, tabLeft: -1
      },
      {
        id: 3,
        col: 2, row: 0,
        label: 'FTT TOKEN',
        badgeType: 'token',
        portraitUrl: '',
        tabTop: 0, tabRight: 0, tabBottom: 1, tabLeft: -1
      },
      {
        id: 4,
        col: 2, row: 1,
        label: 'PITCH DECK',
        badgeType: 'card',
        portraitUrl: '',
        tabTop: -1, tabRight: 0, tabBottom: 0, tabLeft: -1
      },
      {
        id: 5,
        col: 0, row: 0,
        label: 'GENESIS',
        badgeType: 'none',
        portraitUrl: '',
        tabTop: 0, tabRight: 1, tabBottom: -1, tabLeft: 0
      }
    ]
  };

  /**
   * Generates an SVG path string for a jigsaw puzzle piece tile with interlocking tabs/blanks
   * @param {number} x - tile origin x
   * @param {number} y - tile origin y
   * @param {number} w - tile width
   * @param {number} h - tile height
   * @param {Object} tabs - { top: -1|0|1, right: -1|0|1, bottom: -1|0|1, left: -1|0|1 }
   *        where 1 = tab pointing outward, -1 = blank pocket inward, 0 = straight outer border
   */
  function generatePuzzlePiecePath(x, y, w, h, tabs) {
    let d = `M ${x} ${y} `;

    // 1. TOP EDGE
    if (!tabs || tabs.top === 0) {
      d += `L ${x + w} ${y} `;
    } else {
      const s = tabs.top; // 1 = outward (upward, -y), -1 = inward (downward, +y)
      const tabH = h * 0.22 * -s;
      const tabW = w * 0.24;
      const cx = x + w * 0.5;
      d += `L ${cx - tabW * 0.8} ${y} `;
      d += `C ${cx - tabW * 0.9} ${y + tabH * 0.2}, ${cx - tabW * 1.1} ${y + tabH * 0.8}, ${cx - tabW * 0.4} ${y + tabH} `;
      d += `C ${cx - tabW * 0.1} ${y + tabH * 1.15}, ${cx + tabW * 0.1} ${y + tabH * 1.15}, ${cx + tabW * 0.4} ${y + tabH} `;
      d += `C ${cx + tabW * 1.1} ${y + tabH * 0.8}, ${cx + tabW * 0.9} ${y + tabH * 0.2}, ${cx + tabW * 0.8} ${y} `;
      d += `L ${x + w} ${y} `;
    }

    // 2. RIGHT EDGE
    if (!tabs || tabs.right === 0) {
      d += `L ${x + w} ${y + h} `;
    } else {
      const s = tabs.right; // 1 = outward (right, +x), -1 = inward (left, -x)
      const tabW = w * 0.22 * s;
      const tabH = h * 0.24;
      const cy = y + h * 0.5;
      d += `L ${x + w} ${cy - tabH * 0.8} `;
      d += `C ${x + w + tabW * 0.2} ${cy - tabH * 0.9}, ${x + w + tabW * 0.8} ${cy - tabH * 1.1}, ${x + w + tabW} ${cy - tabH * 0.4} `;
      d += `C ${x + w + tabW * 1.15} ${cy - tabH * 0.1}, ${x + w + tabW * 1.15} ${cy + tabH * 0.1}, ${x + w + tabW} ${cy + tabH * 0.4} `;
      d += `C ${x + w + tabW * 0.8} ${cy + tabH * 1.1}, ${x + w + tabW * 0.2} ${cy + tabH * 0.9}, ${x + w} ${cy + tabH * 0.8} `;
      d += `L ${x + w} ${y + h} `;
    }

    // 3. BOTTOM EDGE
    if (!tabs || tabs.bottom === 0) {
      d += `L ${x} ${y + h} `;
    } else {
      const s = tabs.bottom; // 1 = outward (downward, +y), -1 = inward (upward, -y)
      const tabH = h * 0.22 * s;
      const tabW = w * 0.24;
      const cx = x + w * 0.5;
      d += `L ${cx + tabW * 0.8} ${y + h} `;
      d += `C ${cx + tabW * 0.9} ${y + h + tabH * 0.2}, ${cx + tabW * 1.1} ${y + h + tabH * 0.8}, ${cx + tabW * 0.4} ${y + h + tabH} `;
      d += `C ${cx + tabW * 0.1} ${y + h + tabH * 1.15}, ${cx - tabW * 0.1} ${y + h + tabH * 1.15}, ${cx - tabW * 0.4} ${y + h + tabH} `;
      d += `C ${cx - tabW * 1.1} ${y + h + tabH * 0.8}, ${cx - tabW * 0.9} ${y + h + tabH * 0.2}, ${cx - tabW * 0.8} ${y + h} `;
      d += `L ${x} ${y + h} `;
    }

    // 4. LEFT EDGE
    if (!tabs || tabs.left === 0) {
      d += `Z`;
    } else {
      const s = tabs.left; // 1 = outward (left, -x), -1 = inward (right, +x)
      const tabW = w * 0.22 * -s;
      const tabH = h * 0.24;
      const cy = y + h * 0.5;
      d += `L ${x} ${cy + tabH * 0.8} `;
      d += `C ${x + tabW * 0.2} ${cy + tabH * 0.9}, ${x + tabW * 0.8} ${cy + tabH * 1.1}, ${x + tabW} ${cy + tabH * 0.4} `;
      d += `C ${x + tabW * 1.15} ${cy + tabH * 0.1}, ${x + tabW * 1.15} ${cy - tabH * 0.1}, ${x + tabW} ${cy - tabH * 0.4} `;
      d += `C ${x + tabW * 0.8} ${cy - tabH * 1.1}, ${x + tabW * 0.2} ${cy - tabH * 0.9}, ${x} ${cy - tabH * 0.8} `;
      d += `Z`;
    }

    return d;
  }

  // Smooth easing functions
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutBack(t, s = 1.35) {
    return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  /**
   * Computes the transform (x, y, scale, rotate, opacity, 3D tilt) for each piece
   * at time `t` based on the active animation mode.
   */
  function computePuzzleState(config, t) {
    const dur = config.duration || 10.0;
    const progressTime = (t * (config.speed || 1.0)) % dur;
    const mode = config.animationMode || 'cinematic-story';

    const cols = config.cols || 3;
    const rows = config.rows || 2;
    const totalPieces = cols * rows;

    const piecesState = [];
    let cameraState = { x: 0, y: 0, zoom: 1.0, pitch: 0, yaw: 0, roll: 0 };

    if (mode === 'cinematic-story') {
      /**
       * The iconic James Jani documentary choreography:
       * 0.0s - 1.8s: Piece 1 (center/lead) floats down from top-left, stabilizes.
       * 1.8s - 3.4s: Piece 2 slides down from top, aligns with piece 1 and connects!
       * 3.4s - 4.8s: Connected cluster shifts leftward to create room.
       * 4.8s - 7.5s: Suddenly the rest of the pieces fly in from right & bottom, snapping into place.
       * 7.5s - 10.0s: Dramatic slow cinematic 3D dolly & pan across the completed puzzle.
       */
      
      // Camera choreography
      if (progressTime < 1.8) {
        const p = easeOutCubic(progressTime / 1.8);
        cameraState = {
          x: (1 - p) * -80,
          y: (1 - p) * -50,
          zoom: 1.15 - p * 0.05,
          pitch: 6 - p * 2,
          yaw: -8 + p * 4,
          roll: -2 + p * 1
        };
      } else if (progressTime < 3.4) {
        const p = (progressTime - 1.8) / 1.6;
        cameraState = {
          x: 0,
          y: Math.sin(p * Math.PI) * 10,
          zoom: 1.10,
          pitch: 4,
          yaw: -4,
          roll: -1
        };
      } else if (progressTime < 4.8) {
        // Shift left
        const p = easeInOutCubic((progressTime - 3.4) / 1.4);
        cameraState = {
          x: -p * 140,
          y: p * 10,
          zoom: 1.10 - p * 0.05,
          pitch: 4 + p * 2,
          yaw: -4 - p * 3,
          roll: -1
        };
      } else if (progressTime < 7.5) {
        // Rapid zoom out to reveal full grid
        const p = easeInOutCubic((progressTime - 4.8) / 2.7);
        cameraState = {
          x: -140 + p * 140,
          y: 10 - p * 10,
          zoom: 1.05 - p * 0.12,
          pitch: 6 - p * 3,
          yaw: -7 + p * 6,
          roll: -1 + p * 1.5
        };
      } else {
        // Slow cinematic pan
        const p = (progressTime - 7.5) / 2.5;
        cameraState = {
          x: Math.sin(p * Math.PI) * 20,
          y: Math.cos(p * Math.PI) * 10,
          zoom: 0.93 + Math.sin(p * Math.PI) * 0.03,
          pitch: 3 + Math.cos(p * 2) * 2,
          yaw: -1 + Math.sin(p * 2) * 3,
          roll: 0.5
        };
      }

      for (let i = 0; i < totalPieces; i++) {
        let px = 0, py = 0, pz = 0, scale = 1.0, rot = 0, op = 1.0, glow = 1.0;

        // Piece 0 (The initial lead piece)
        if (i === 0) {
          if (progressTime < 1.6) {
            const p = easeOutBack(clamp(progressTime / 1.4, 0, 1), 1.1);
            px = (1 - p) * -380;
            py = (1 - p) * -260;
            pz = (1 - p) * 120;
            rot = (1 - p) * -18;
            op = clamp(progressTime / 0.4, 0, 1);
            glow = 1.8 - (p * 0.6);
          } else {
            px = 0; py = 0; pz = 0; rot = 0; op = 1.0; glow = 1.0;
          }
        } 
        // Piece 1 (The second piece that connects from above)
        else if (i === 1) {
          if (progressTime < 1.6) {
            op = 0;
            py = -400;
          } else if (progressTime < 3.2) {
            const p = easeOutBack(clamp((progressTime - 1.6) / 1.3, 0, 1), 1.25);
            px = (1 - p) * 60;
            py = (1 - p) * -320;
            pz = (1 - p) * 80;
            rot = (1 - p) * 12;
            op = clamp((progressTime - 1.6) / 0.3, 0, 1);
            glow = 1.9 - (p * 0.7);
          } else {
            px = 0; py = 0; pz = 0; rot = 0; op = 1.0; glow = 1.0;
          }
        }
        // Rest of the pieces fly in during Phase 4
        else {
          const delay = 4.6 + (i * 0.28);
          if (progressTime < delay) {
            op = 0;
            const seed = (i * 47) % 100;
            px = seed > 50 ? 450 : -450;
            py = (seed % 2 === 0 ? 1 : -1) * 350;
          } else if (progressTime < delay + 1.2) {
            const p = easeOutBack(clamp((progressTime - delay) / 0.9, 0, 1), 1.15);
            const side = i % 2 === 0 ? 1 : -1;
            px = (1 - p) * (380 * side);
            py = (1 - p) * ((i * 50) - 100);
            pz = (1 - p) * 70;
            rot = (1 - p) * (side * 15);
            op = clamp((progressTime - delay) / 0.25, 0, 1);
            glow = 1.7 - (p * 0.6);
          } else {
            px = 0; py = 0; pz = 0; rot = 0; op = 1.0; glow = 1.0;
          }
        }

        piecesState.push({ x: px, y: py, z: pz, scale, rot, op, glow });
      }
    } 
    else if (mode === 'falling') {
      // Gravity waterfall drop
      const cycle = progressTime % 6.0;
      for (let i = 0; i < totalPieces; i++) {
        const delay = (i % cols) * 0.2 + Math.floor(i / cols) * 0.3;
        let py = 0, op = 1, rot = 0, pz = 0;
        if (cycle < delay) {
          py = -500;
          op = 0;
        } else if (cycle < delay + 1.1) {
          const p = easeOutBack((cycle - delay) / 1.1, 1.4);
          py = (1 - p) * -500;
          pz = (1 - p) * 120;
          rot = (1 - p) * ((i % 2 === 0 ? 1 : -1) * 20);
          op = clamp((cycle - delay) / 0.2, 0, 1);
        } else if (cycle > 4.8) {
          const p = easeOutCubic((cycle - 4.8) / 1.2);
          py = p * 600;
          op = 1 - p;
        }
        piecesState.push({ x: 0, y: py, z: pz, scale: 1.0, rot, op, glow: 1.0 });
      }
      cameraState = { x: 0, y: 0, zoom: 1.0, pitch: 4, yaw: -3, roll: 0 };
    }
    else if (mode === 'scatter') {
      // Dynamic scatter and snap
      const isAssembled = Math.sin(progressTime * 1.5) > 0;
      for (let i = 0; i < totalPieces; i++) {
        if (isAssembled) {
          piecesState.push({ x: 0, y: 0, z: 0, scale: 1.0, rot: 0, op: 1.0, glow: 1.0 });
        } else {
          const rx = Math.sin(i * 37) * 180;
          const ry = Math.cos(i * 53) * 120;
          const rz = Math.sin(i * 19) * 80;
          const rot = Math.sin(i * 71) * 25;
          piecesState.push({ x: rx, y: ry, z: rz, scale: 0.9, rot, op: 0.8, glow: 1.4 });
        }
      }
      cameraState = { x: 0, y: 0, zoom: 0.96, pitch: 8, yaw: -6, roll: 1 };
    }
    else if (mode === 'pop-isolate') {
      // Pop a single piece forward in 3D space with high cyan bloom
      const targetIdx = config.isolatedPieceIndex || 1;
      for (let i = 0; i < totalPieces; i++) {
        if (i === targetIdx) {
          const lift = Math.sin(progressTime * 2.0) * 15;
          piecesState.push({ x: 0, y: -20 + lift, z: 120, scale: 1.15, rot: -3, op: 1.0, glow: 2.4 });
        } else {
          piecesState.push({ x: 0, y: 0, z: -40, scale: 0.96, rot: 0, op: 0.45, glow: 0.6 });
        }
      }
      cameraState = { x: 0, y: -10, zoom: 1.08, pitch: 7, yaw: -8, roll: -1 };
    }
    else {
      // Assembled static with gentle cinematic drift
      const floatX = Math.sin(progressTime * 0.8) * 10;
      const floatY = Math.cos(progressTime * 0.7) * 8;
      for (let i = 0; i < totalPieces; i++) {
        piecesState.push({ x: 0, y: 0, z: 0, scale: 1.0, rot: 0, op: 1.0, glow: 1.0 });
      }
      cameraState = { x: floatX, y: floatY, zoom: 1.0, pitch: 4, yaw: -4, roll: 0.5 };
    }

    return { camera: cameraState, pieces: piecesState };
  }

  /**
   * Builds the rich SVG & HTML structure for the puzzle stage
   */
  function buildPuzzleStageHtml(tplId, config) {
    const d = Object.assign({}, DEFAULT_CONFIG, config || {});
    const cols = d.cols || 3;
    const rows = d.rows || 2;
    const totalW = 960;
    const totalH = 540;
    const tileW = totalW / cols;
    const tileH = totalH / rows;

    // Build SVG Puzzle Piece Clips and Layers
    let svgDefs = '';
    let piecesHtml = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const meta = (d.piecesData && d.piecesData[idx]) || {};
        
        // Compute tabs: adjacent pieces must interlock (if left neighbor has right tab 1, this has -1)
        const tabTop = r === 0 ? 0 : ((r + c) % 2 === 0 ? 1 : -1);
        const tabRight = c === cols - 1 ? 0 : ((r + c) % 2 === 0 ? 1 : -1);
        const tabBottom = r === rows - 1 ? 0 : ((r + c) % 2 === 0 ? -1 : 1);
        const tabLeft = c === 0 ? 0 : ((r + c) % 2 === 0 ? -1 : 1);

        const piecePath = generatePuzzlePiecePath(
          0, 0, tileW, tileH,
          { top: tabTop, right: tabRight, bottom: tabBottom, left: tabLeft }
        );

        const clipId = `puzzle-clip-${tplId}-${idx}`;
        svgDefs += `
          <clipPath id="${clipId}">
            <path d="${piecePath}" />
          </clipPath>
        `;

        // Badge / overlay elements inside piece
        let overlayContent = '';
        if (meta.badgeType === 'label-strip' || meta.label === 'THE CRYPTO BOOM') {
          overlayContent = `
            <div style="position: absolute; top: 40%; left: 10%; transform: translateY(-50%) rotate(-1deg); background: #ffffff; color: #0a0c12; padding: 4px 14px; font-family: 'Oswald', 'Impact', sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(0,0,0,0.6); border: 1px solid rgba(0,0,0,0.15); pointer-events: none; z-index: 20;">
              ${meta.label || 'THE CRYPTO BOOM'}
            </div>
          `;
        } else if (meta.badgeType === 'portrait' && meta.portraitUrl) {
          overlayContent = `
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20; pointer-events: none;">
              <img src="${meta.portraitUrl}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid ${d.glowColor}; box-shadow: 0 0 16px ${d.glowColor}88; margin-bottom: 6px;" />
              <span style="font-family: 'Inter', sans-serif; font-weight: 800; font-size: 10px; color: #ffffff; background: rgba(0,0,0,0.75); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${meta.label || 'PORTRAIT'}</span>
            </div>
          `;
        } else if (meta.badgeType === 'card') {
          overlayContent = `
            <div style="position: absolute; top: 25%; left: 20%; background: rgba(10,14,24,0.85); border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.8); backdrop-filter: blur(8px); pointer-events: none; z-index: 20; text-align: center;">
              <div style="font-size: 8px; color: ${d.glowColor}; font-family: monospace; font-weight: 700;">DOCUMENT</div>
              <div style="font-size: 11px; color: #ffffff; font-weight: 800; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; margin-top: 2px;">${meta.label}</div>
            </div>
          `;
        } else if (meta.badgeType === 'token') {
          overlayContent = `
            <div style="position: absolute; top: 30%; left: 15%; display: flex; align-items: center; gap: 8px; z-index: 20; pointer-events: none;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, ${d.glowColor}, #0284c7); border: 2px solid #ffffff; box-shadow: 0 0 16px ${d.glowColor}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; color: #fff;">$</div>
              <div style="font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 800; color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.9);">${meta.label}</div>
            </div>
          `;
        }

        // Piece Container
        const pieceLeft = c * tileW;
        const pieceTop = r * tileH;

        piecesHtml += `
          <div id="jani-pz-piece-${tplId}-${idx}" class="jani-pz-piece" style="position: absolute; left: ${pieceLeft}px; top: ${pieceTop}px; width: ${tileW}px; height: ${tileH}px; transform-origin: 50% 50%; transform-style: preserve-3d; will-change: transform, opacity; z-index: ${idx === 1 ? 15 : (idx === 0 ? 12 : 5)};">
            
            <!-- SVG Shaped Jigsaw Piece Mask with Image Fill & Glowing Edge -->
            <svg viewBox="-40 -40 ${tileW + 80} ${tileH + 80}" style="position: absolute; left: -40px; top: -40px; width: ${tileW + 80}px; height: ${tileH + 80}px; overflow: visible; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.85)); pointer-events: auto; cursor: pointer;">
              
              <!-- Subtle Under-Glow / Ambient Bloom -->
              <path d="${piecePath}" fill="none" stroke="${d.glowColor}" stroke-width="${d.borderWidth * 2.8}" stroke-opacity="0.35" style="filter: blur(6px);" />
              
              <!-- Sharp Core Neon Outline -->
              <path d="${piecePath}" fill="none" stroke="#ffffff" stroke-width="${d.borderWidth * 0.75}" style="filter: drop-shadow(0 0 4px ${d.glowColor});" />
              <path d="${piecePath}" fill="none" stroke="${d.glowColor}" stroke-width="${d.borderWidth}" stroke-opacity="${d.glowOpacity}" />

              <!-- Clipped Piece Content (Image Background Sliced Perfectly Across Pieces) -->
              <g clip-path="url(#${clipId})">
                <!-- Base Dark Texture -->
                <rect x="0" y="0" width="${tileW}" height="${tileH}" fill="#080c14" />
                
                <!-- Sliced User Master Image -->
                <image href="${d.imageUrl}" x="${-pieceLeft}" y="${-pieceTop}" width="${totalW}" height="${totalH}" preserveAspectRatio="xMidYMid slice" opacity="0.82" style="filter: contrast(115%) brightness(95%);" />
                
                <!-- Cyber/Tech Overlay Grids (Authentic James Jani Aesthetic) -->
                ${d.techGridOverlay ? `
                  <rect x="0" y="0" width="${tileW}" height="${tileH}" fill="url(#jani-pz-tech-pattern-${tplId})" opacity="0.38" style="mix-blend-mode: screen;" />
                ` : ''}

                <!-- Inner Gradient Darkening for Physical Depth -->
                <rect x="0" y="0" width="${tileW}" height="${tileH}" fill="rgba(0,0,0,${d.innerDarken})" />
              </g>
            </svg>

            <!-- HTML Overlays (Badges, Titles, Cutout Icons) -->
            ${overlayContent}

            <!-- Node ID Tag in Corner -->
            <div style="position: absolute; top: 12px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; color: ${d.glowColor}; background: rgba(0,0,0,0.65); padding: 1px 6px; border-radius: 3px; border: 1px solid ${d.glowColor}44; pointer-events: none; z-index: 25;">
              #0${idx + 1}
            </div>

          </div>
        `;
      }
    }

    return `
      <div id="jani-pz-viewport-${tplId}" class="jani-pz-viewport" style="position: absolute; inset: 0; background: #030508; overflow: hidden; perspective: 1200px; display: flex; align-items: center; justify-content: center; user-select: none;">
        
        <!-- SVG Definitions for Clip Paths & Patterns -->
        <svg style="position: absolute; width: 0; height: 0; overflow: hidden;">
          <defs>
            ${svgDefs}
            <pattern id="jani-pz-tech-pattern-${tplId}" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="32" height="32" fill="none" stroke="rgba(0, 242, 254, 0.15)" stroke-width="0.8" />
              <rect x="0" y="0" width="8" height="8" fill="rgba(0, 242, 254, 0.08)" />
            </pattern>
          </defs>
        </svg>

        <!-- Ambient Volumetric Dust Particles -->
        <canvas id="jani-pz-dust-${tplId}" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 30; mix-blend-mode: screen;"></canvas>

        <!-- 3D Camera Rig -->
        <div id="jani-pz-camera-rig-${tplId}" class="jani-pz-camera-rig" style="position: relative; width: ${totalW}px; height: ${totalH}px; transform-style: preserve-3d; will-change: transform;">
          
          <!-- Subtle Backdrop Glow behind active puzzle pieces -->
          <div style="position: absolute; inset: -100px; background: radial-gradient(circle at center, rgba(0,242,254,0.12) 0%, transparent 65%); pointer-events: none; z-index: 1;"></div>

          <!-- All Jigsaw Puzzle Pieces Layer -->
          <div id="jani-pz-board-${tplId}" style="position: absolute; inset: 0; transform-style: preserve-3d;">
            ${piecesHtml}
          </div>

        </div>

        <!-- Master Title HUD Badge -->
        <div style="position: absolute; top: 16px; left: 18px; z-index: 35; display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; background: rgba(5,7,12,0.85); backdrop-filter: blur(8px); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #00f2fe; box-shadow: 0 0 8px #00f2fe;"></span>
          <span id="jani-pz-hud-title-${tplId}" style="font-weight: 700; color: #f8fafc; letter-spacing: 0.5px;">${d.title.toUpperCase()}</span>
          <span style="color: #64748b;">&bull;</span>
          <span id="jani-pz-hud-mode-${tplId}" style="color: #00f2fe; text-transform: uppercase;">MODE: ${d.animationMode}</span>
        </div>

        <!-- Cinematic Outer Radial Vignette -->
        <div style="position: absolute; inset: 0; pointer-events: none; z-index: 32; background: radial-gradient(ellipse at center, rgba(3,5,8,0) 40%, rgba(3,5,8,${d.vignetteIntensity}) 100%);"></div>

      </div>
    `;
  }

  /**
   * Applies the computed animation state to the DOM elements
   */
  function applyPuzzleStateToDOM(container, tplId, computedState, config) {
    if (!container) return;
    const cameraRig = container.querySelector(`#jani-pz-camera-rig-${tplId}`);
    if (cameraRig && computedState.camera) {
      const cam = computedState.camera;
      cameraRig.style.transform = `translate3d(${cam.x.toFixed(1)}px, ${cam.y.toFixed(1)}px, 0) scale(${cam.zoom.toFixed(4)}) rotateX(${cam.pitch.toFixed(2)}deg) rotateY(${cam.yaw.toFixed(2)}deg) rotateZ(${cam.roll.toFixed(2)}deg)`;
    }

    const cols = config.cols || 3;
    const rows = config.rows || 2;
    const totalPieces = cols * rows;

    for (let i = 0; i < totalPieces; i++) {
      const pieceEl = container.querySelector(`#jani-pz-piece-${tplId}-${i}`);
      const st = computedState.pieces[i];
      if (pieceEl && st) {
        pieceEl.style.transform = `translate3d(${st.x.toFixed(1)}px, ${st.y.toFixed(1)}px, ${st.z.toFixed(1)}px) rotate(${st.rot.toFixed(1)}deg) scale(${st.scale.toFixed(3)})`;
        pieceEl.style.opacity = st.op.toFixed(3);

        // Dynamic Glow / Bloom on piece
        const svgPathGlow = pieceEl.querySelectorAll('path');
        if (svgPathGlow.length >= 3) {
          const glowMulti = st.glow || 1.0;
          svgPathGlow[0].style.strokeWidth = `${(config.borderWidth || 2.2) * 2.8 * glowMulti}px`;
          svgPathGlow[0].style.strokeOpacity = `${Math.min(1, 0.35 * glowMulti)}`;
        }
      }
    }
  }

  /**
   * Standalone Engine Class for Mounting & Live Control
   */
  class JaniPuzzleEngine {
    constructor(container, options = {}) {
      this.container = container;
      this.config = Object.assign({}, DEFAULT_CONFIG, options);
      this.isPlaying = true;
      this.animFrameId = null;
      this.startTime = null;
      this.manualTime = null;
      this.dustParticles = [];

      this.init();
    }

    init() {
      this.container.innerHTML = buildPuzzleStageHtml(TEMPLATE_ID, this.config);
      this.dustCanvas = this.container.querySelector(`#jani-pz-dust-${TEMPLATE_ID}`);
      if (this.dustCanvas) {
        this.dustCtx = this.dustCanvas.getContext('2d');
        this.initDust();
        this.resizeCanvas();
      }

      this.bindPieceInteractions();
      this.startLoop();
    }

    initDust() {
      this.dustParticles = [];
      const count = this.config.dustCount || 35;
      for (let i = 0; i < count; i++) {
        this.dustParticles.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2.2 + 0.8,
          speedX: (Math.random() - 0.5) * 0.0006,
          speedY: -(Math.random() * 0.0012 + 0.0004),
          opacity: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    resizeCanvas() {
      if (!this.dustCanvas) return;
      this.dustCanvas.width = this.container.clientWidth || 960;
      this.dustCanvas.height = this.container.clientHeight || 540;
    }

    renderDust() {
      if (!this.dustCanvas || !this.dustCtx || !this.config.dustEnabled) return;
      const ctx = this.dustCtx;
      const w = this.dustCanvas.width;
      const h = this.dustCanvas.height;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < this.dustParticles.length; i++) {
        const p = this.dustParticles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        if (p.y < 0) p.y = 1;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        const currentOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.fillStyle = `rgba(0, 242, 254, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    bindPieceInteractions() {
      const cols = this.config.cols || 3;
      const rows = this.config.rows || 2;
      const totalPieces = cols * rows;

      for (let i = 0; i < totalPieces; i++) {
        const piece = this.container.querySelector(`#jani-pz-piece-${TEMPLATE_ID}-${i}`);
        if (piece) {
          piece.addEventListener('click', (e) => {
            e.stopPropagation();
            this.config.isolatedPieceIndex = i;
            if (this.config.animationMode !== 'pop-isolate') {
              this.config.animationMode = 'pop-isolate';
            } else {
              this.config.animationMode = 'cinematic-story';
            }
            const hudMode = this.container.querySelector(`#jani-pz-hud-mode-${TEMPLATE_ID}`);
            if (hudMode) hudMode.textContent = `MODE: ${this.config.animationMode}`;
          });
        }
      }
    }

    startLoop() {
      const step = (timestamp) => {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = this.manualTime !== null ? this.manualTime : (timestamp - this.startTime) / 1000;

        const computed = computePuzzleState(this.config, elapsed);
        applyPuzzleStateToDOM(this.container, TEMPLATE_ID, computed, this.config);
        this.renderDust();

        if (this.isPlaying) {
          this.animFrameId = requestAnimationFrame(step);
        }
      };
      this.animFrameId = requestAnimationFrame(step);
    }

    updateConfig(newOptions) {
      const shouldRebuild = (
        newOptions.cols !== undefined && newOptions.cols !== this.config.cols ||
        newOptions.rows !== undefined && newOptions.rows !== this.config.rows ||
        newOptions.imageUrl !== undefined && newOptions.imageUrl !== this.config.imageUrl
      );

      Object.assign(this.config, newOptions);

      if (shouldRebuild) {
        this.init();
      } else {
        const hudTitle = this.container.querySelector(`#jani-pz-hud-title-${TEMPLATE_ID}`);
        if (hudTitle && this.config.title) hudTitle.textContent = this.config.title.toUpperCase();

        const hudMode = this.container.querySelector(`#jani-pz-hud-mode-${TEMPLATE_ID}`);
        if (hudMode && this.config.animationMode) hudMode.textContent = `MODE: ${this.config.animationMode}`;
      }
    }

    setManualTime(t) {
      this.manualTime = t;
    }

    destroy() {
      this.isPlaying = false;
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.container.innerHTML = '';
    }
  }

  // Active Global Instance
  let activeInstance = null;

  window.tplMountJaniPuzzleStage = function(stageElement, customData = {}) {
    if (!stageElement) return null;
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }
    activeInstance = new JaniPuzzleEngine(stageElement, customData);
    return activeInstance;
  };

  window.tplUnmountJaniPuzzleStage = function() {
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }
  };

  window.tplUpdateJaniPuzzle = function(options) {
    if (activeInstance) {
      activeInstance.updateConfig(options);
    }
  };

  window.stepJaniPuzzleAnimation = function(container, tplId, manualT, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const computed = computePuzzleState(d, manualT);
    applyPuzzleStateToDOM(container, tplId, computed, d);
  };

  window.buildPuzzleStageHtml = buildPuzzleStageHtml;
  window.computePuzzleState = computePuzzleState;
  window.generatePuzzlePiecePath = generatePuzzlePiecePath;
  window.JANI_PUZZLE_CONFIG = DEFAULT_CONFIG;

  console.log('[Jani Puzzle Engine] Registered High-Precision Puzzle Reconstruction Template (2.0)');
})();
