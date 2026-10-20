/**
 * 3D Glassmorphic Search FX Engine (Vox / James Jani / Magnates Media / Johnny Harris Style)
 * 
 * Features:
 * - 3D spatial tilted frosted glass panel (15° - 25° Y-axis tilt, perspective depth)
 * - Micro-shimmer specular light sweep along container bevels and border
 * - Authentic Google logo with high-contrast dark-mode & glowing neon accents
 * - Realistic character-by-character typing animation with pulsing cursor (|)
 * - Fluid auto-suggest list with active item highlight & lens bokeh depth-of-field
 * - Atmospheric dark architectural grid backdrop with volumetric light shafts and edge vignette
 * - Full interactive OrbitControls (drag to tilt/rotate, scroll to zoom)
 * - Synchronized with Top Template Customizer (Video & 3D buttons, 3D by default)
 */
(function() {
  'use strict';

  let searchScene = null;
  let searchCamera = null;
  let searchRenderer = null;
  let searchAnimFrame = null;
  let searchControls = null;
  let searchCardGroup = null;
  let searchBgMesh = null;
  let searchRaysMesh = null;
  let searchCardMesh = null;
  let searchCardCanvas = null;
  let searchCardCtx = null;
  let searchCardTexture = null;

  let animClock = 0;
  let lastTime = 0;

  // Renders the high-definition canvas texture for the 3D frosted glass card
  function drawSearchCardTexture(data, t) {
    if (!searchCardCanvas || !searchCardCtx) {
      searchCardCanvas = document.createElement('canvas');
      searchCardCanvas.width = 1024;
      searchCardCanvas.height = 760;
      searchCardCtx = searchCardCanvas.getContext('2d');
    }
    const ctx = searchCardCtx;
    const w = searchCardCanvas.width;
    const h = searchCardCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const isDarkMode = data.styleMode !== 'classic'; // 'cinematic' (default) or 'classic'
    const query = data.query || 'how to invest in index funds';
    const sug1 = data.suggestion || 'top index funds for passive wealth';
    const sug2 = data.suggestion2 || 's&p 500 historical annual return';
    const sug3 = data.suggestion3 || 'vanguard vs fidelity index funds';

    // Typing physics: character-by-character animation with variable delay
    const totalChars = query.length;
    const loopDuration = 4.2; // seconds
    const cycleTime = t % loopDuration;
    let typedChars = 0;
    if (cycleTime < 0.3) {
      typedChars = 0;
    } else if (cycleTime < 2.3) {
      const progress = (cycleTime - 0.3) / 2.0;
      // organic typing pacing with slight easing
      typedChars = Math.min(totalChars, Math.floor(Math.pow(progress, 0.95) * totalChars));
    } else {
      typedChars = totalChars;
    }
    const currentTypedText = query.substring(0, typedChars);
    const showCursor = (Math.floor(t * 3.5) % 2 === 0);

    // Suggestions appearance progress
    const suggProgress = Math.max(0, Math.min(1, (cycleTime - 1.9) / 0.6));

    // 1. Frosted Glass Body
    const pad = 24;
    const cardX = pad;
    const cardY = pad;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    const r = 38;

    ctx.save();
    // Rounded Card Path
    ctx.beginPath();
    ctx.moveTo(cardX + r, cardY);
    ctx.lineTo(cardX + cardW - r, cardY);
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
    ctx.lineTo(cardX + cardW, cardY + cardH - r);
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
    ctx.lineTo(cardX + r, cardY + cardH);
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
    ctx.lineTo(cardX, cardY + r);
    ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
    ctx.closePath();

    if (isDarkMode) {
      // Sleek Frosted Glass with semi-transparent dark tint
      const glassGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      glassGrad.addColorStop(0, 'rgba(28, 36, 54, 0.78)');
      glassGrad.addColorStop(0.5, 'rgba(15, 20, 32, 0.85)');
      glassGrad.addColorStop(1, 'rgba(9, 13, 24, 0.90)');
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // Inner Ambient Glass Tint
      ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.fill();

      // Specular Light Sweep along Bevel Border
      const sweepPos = ((t * 0.45) % 1.6) - 0.3; // -0.3 to 1.3
      const strokeGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      const s0 = Math.max(0, sweepPos - 0.15);
      const s1 = Math.min(1, Math.max(0, sweepPos));
      const s2 = Math.min(1, sweepPos + 0.15);

      strokeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
      if (s0 > 0 && s0 < 1) strokeGrad.addColorStop(s0, 'rgba(255, 255, 255, 0.18)');
      if (s1 > 0 && s1 < 1) strokeGrad.addColorStop(s1, 'rgba(255, 255, 255, 0.95)'); // High specular highlight
      if (s2 > 0 && s2 < 1) strokeGrad.addColorStop(s2, 'rgba(56, 189, 248, 0.6)');
      strokeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = strokeGrad;
      ctx.stroke();
    } else {
      // Classic White Google Card
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(218, 220, 224, 0.8)';
      ctx.stroke();
    }
    ctx.restore();

    // 2. Google Logo
    const logoY = 145;
    ctx.save();
    ctx.font = '700 84px "Space Grotesk", "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const letters = [
      { char: 'G', color: '#4285F4' },
      { char: 'o', color: '#EA4335' },
      { char: 'o', color: '#FBBC05' },
      { char: 'g', color: '#4285F4' },
      { char: 'l', color: '#34A853' },
      { char: 'e', color: '#EA4335' }
    ];

    let fullLogoWidth = 0;
    letters.forEach(l => { fullLogoWidth += ctx.measureText(l.char).width + 3; });
    let curLogoX = (w / 2) - (fullLogoWidth / 2);

    letters.forEach(l => {
      const charW = ctx.measureText(l.char).width;
      ctx.fillStyle = l.color;
      if (isDarkMode) {
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 12;
      }
      ctx.fillText(l.char, curLogoX + charW / 2, logoY);
      curLogoX += charW + 3;
    });
    ctx.restore();

    // 3. Search Bar Container
    const barX = 84;
    const barY = 230;
    const barW = w - barX * 2;
    const barH = 76;
    const barR = barH / 2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(barX + barR, barY);
    ctx.lineTo(barX + barW - barR, barY);
    ctx.quadraticCurveTo(barX + barW, barY, barX + barW, barY + barR);
    ctx.lineTo(barX + barW, barY + barH - barR);
    ctx.quadraticCurveTo(barX + barW, barY + barH, barX + barW - barR, barY + barH);
    ctx.lineTo(barX + barR, barY + barH);
    ctx.quadraticCurveTo(barX, barY + barH, barX, barY + barH - barR);
    ctx.lineTo(barX, barY + barR);
    ctx.quadraticCurveTo(barX, barY, barX + barR, barY);
    ctx.closePath();

    if (isDarkMode) {
      ctx.fillStyle = 'rgba(18, 25, 42, 0.95)';
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = 'rgba(74, 144, 226, 0.45)';
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#dfe1e5';
      ctx.stroke();
    }
    ctx.restore();

    // 3.1 Search Icon inside bar
    const iconX = barX + 38;
    const iconY = barY + barH / 2;
    ctx.save();
    ctx.strokeStyle = isDarkMode ? '#38bdf8' : '#4285F4';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(iconX, iconY - 3, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(iconX + 8, iconY + 5);
    ctx.lineTo(iconX + 17, iconY + 14);
    ctx.stroke();
    ctx.restore();

    // 3.2 Typed Search Query Text + Pulsing Cursor
    const textStartX = iconX + 32;
    const textY = barY + barH / 2 + 1;
    ctx.save();
    ctx.font = '500 29px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isDarkMode ? '#f8fafc' : '#202124';
    ctx.fillText(currentTypedText, textStartX, textY);

    const typedWidth = ctx.measureText(currentTypedText).width;
    if (showCursor) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(textStartX + typedWidth + 4, textY - 18);
      ctx.lineTo(textStartX + typedWidth + 4, textY + 18);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Auto-Suggestions List (Dynamic highlight state & micro-glow)
    if (suggProgress > 0.05) {
      const suggStartY = barY + barH + 24;
      const suggItems = [
        { text: sug1, isFocused: true },
        { text: sug2, isFocused: false },
        { text: sug3, isFocused: false }
      ];

      suggItems.forEach((item, index) => {
        const itemY = suggStartY + index * 88;
        const itemH = 68;
        const itemR = 18;
        const itemAlpha = Math.min(1, suggProgress * (1.2 - index * 0.18));

        ctx.save();
        ctx.globalAlpha = Math.max(0, itemAlpha);

        // Rounded suggestion pill row
        ctx.beginPath();
        ctx.moveTo(barX + itemR, itemY);
        ctx.lineTo(barX + barW - itemR, itemY);
        ctx.quadraticCurveTo(barX + barW, itemY, barX + barW, itemY + itemR);
        ctx.lineTo(barX + barW, itemY + itemH - itemR);
        ctx.quadraticCurveTo(barX + barW, itemY + itemH, barX + barW - itemR, itemY + itemH);
        ctx.lineTo(barX + itemR, itemY + itemH);
        ctx.quadraticCurveTo(barX, itemY + itemH, barX, itemY + itemH - itemR);
        ctx.lineTo(barX, itemY + itemR);
        ctx.quadraticCurveTo(barX, itemY, barX + itemR, itemY);
        ctx.closePath();

        if (isDarkMode) {
          if (item.isFocused) {
            // First item: Focused luxury glass capsule state with specular edge glow
            ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
            ctx.fill();
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.85)';
            ctx.shadowColor = 'rgba(56, 189, 248, 0.45)';
            ctx.shadowBlur = 14;
            ctx.stroke();
          } else {
            // Inactive auto-suggest rows
            ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
            ctx.fill();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.stroke();
          }
        } else {
          if (item.isFocused) {
            ctx.fillStyle = '#f1f3f4';
            ctx.fill();
          } else {
            ctx.fillStyle = 'transparent';
          }
        }
        ctx.restore();

        // Magnifying glass icon for suggestions
        ctx.save();
        ctx.globalAlpha = Math.max(0, itemAlpha * 0.75);
        ctx.strokeStyle = isDarkMode ? (item.isFocused ? '#93c5fd' : '#64748b') : '#9aa0a6';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(barX + 34, itemY + itemH / 2 - 2, 8.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(barX + 40, itemY + itemH / 2 + 4);
        ctx.lineTo(barX + 47, itemY + itemH / 2 + 11);
        ctx.stroke();
        ctx.restore();

        // Suggestion Text
        ctx.save();
        ctx.globalAlpha = Math.max(0, itemAlpha);
        ctx.font = item.isFocused ? '700 26px "Inter", -apple-system, sans-serif' : '500 25px "Inter", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDarkMode ? (item.isFocused ? '#ffffff' : '#cbd5e1') : (item.isFocused ? '#202124' : '#3c4043');
        ctx.fillText(item.text, barX + 66, itemY + itemH / 2);
        ctx.restore();
      });
    }

    if (searchCardTexture) {
      searchCardTexture.needsUpdate = true;
    }
  }

  // Generate atmospheric architectural grid background canvas texture
  function generateGridBackdropCanvas() {
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1024;
    const ctx = cv.getContext('2d');

    // Deep rich dark gradient
    const grad = ctx.createRadialGradient(512, 420, 80, 512, 512, 600);
    grad.addColorStop(0, '#101626');
    grad.addColorStop(0.5, '#070a12');
    grad.addColorStop(1, '#020306');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Architectural isometric / perspective grid tiles
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1.2;
    const step = 64;
    for (let x = 0; x <= 1024; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Micro technical glyphs & data coordinates
    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.font = '11px monospace';
    for (let i = 0; i < 18; i++) {
      const rx = (i * 137) % 960 + 32;
      const ry = (i * 229) % 960 + 32;
      ctx.fillText(`SYS.NODE_[${i.toString(16).toUpperCase()}] f/2.8`, rx, ry);
    }

    return cv;
  }

  // Initialize Three.js 3D Scene
  window.initSearch3DScene = function(container, customData) {
    if (!container) return;
    cleanupSearch3DScene();

    const data = Object.assign({
      query: 'how to invest in index funds',
      suggestion: 'top index funds for passive wealth',
      suggestion2: 's&p 500 historical annual return',
      suggestion3: 'vanguard vs fidelity index funds',
      styleMode: 'cinematic', // 'cinematic' (3D glassmorphic dark mode) or 'classic'
      cameraPitch: 16,
      cameraYaw: -20,
      zoomLevel: 1.05,
      dofBlur: 0.85,
      tiltY: -18,
      tiltX: 8
    }, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    searchScene = new THREE.Scene();
    searchScene.background = new THREE.Color(0x04060a);
    searchScene.fog = new THREE.FogExp2(0x04060a, 0.0018);

    searchCamera = new THREE.PerspectiveCamera(36, width / height, 1, 3000);
    searchCamera.position.set(-45, 12, 430);
    searchCamera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    searchRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    searchRenderer.setSize(width, height);
    searchRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    searchRenderer.shadowMap.enabled = true;
    searchRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    searchRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    searchRenderer.toneMappingExposure = 1.3;

    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(searchRenderer.domElement);

    // 3. OrbitControls (Grab & Drag to tilt, wheel to zoom)
    if (typeof THREE.OrbitControls !== 'undefined') {
      searchControls = new THREE.OrbitControls(searchCamera, searchRenderer.domElement);
      searchControls.enableDamping = true;
      searchControls.dampingFactor = 0.06;
      searchControls.maxDistance = 850;
      searchControls.minDistance = 280;
      searchControls.maxPolarAngle = Math.PI / 1.7;
      searchControls.minPolarAngle = Math.PI / 3.5;
    }

    // 4. Lighting Rig (Directional Key light, rim lights, volumetric spotlight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    searchScene.add(ambientLight);

    const dirKeyLight = new THREE.DirectionalLight(0xa5f3fc, 1.4);
    dirKeyLight.position.set(120, 200, 260);
    searchScene.add(dirKeyLight);

    const rimBlueLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimBlueLight.position.set(-220, -100, 180);
    searchScene.add(rimBlueLight);

    const warmAccentLight = new THREE.PointLight(0xfef08a, 1.2, 800);
    warmAccentLight.position.set(200, 160, 220);
    searchScene.add(warmAccentLight);

    // 5. Atmospheric Background Plane (Architectural grid backdrop with vignette)
    const bgTexture = new THREE.CanvasTexture(generateGridBackdropCanvas());
    bgTexture.anisotropy = searchRenderer.capabilities.getMaxAnisotropy();
    const bgGeo = new THREE.PlaneGeometry(1200, 800);
    const bgMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    searchBgMesh = new THREE.Mesh(bgGeo, bgMat);
    searchBgMesh.position.set(0, 0, -220);
    searchScene.add(searchBgMesh);

    // 6. Volumetric Light Shafts (God rays streak overlay)
    const raysCanvas = document.createElement('canvas');
    raysCanvas.width = 512;
    raysCanvas.height = 512;
    const rCtx = raysCanvas.getContext('2d');
    const rGrad = rCtx.createLinearGradient(0, 0, 512, 512);
    rGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    rGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.08)');
    rGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.14)');
    rGrad.addColorStop(0.75, 'rgba(147, 197, 253, 0.04)');
    rGrad.addColorStop(1, 'transparent');
    rCtx.fillStyle = rGrad;
    rCtx.fillRect(0, 0, 512, 512);

    const raysTexture = new THREE.CanvasTexture(raysCanvas);
    const raysGeo = new THREE.PlaneGeometry(900, 600);
    const raysMat = new THREE.MeshBasicMaterial({
      map: raysTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    searchRaysMesh = new THREE.Mesh(raysGeo, raysMat);
    searchRaysMesh.position.set(60, 40, -60);
    searchRaysMesh.rotation.z = -0.18;
    searchScene.add(searchRaysMesh);

    // 7. Hero 3D Search Glass Card
    searchCardGroup = new THREE.Group();

    searchCardCanvas = document.createElement('canvas');
    searchCardCanvas.width = 1024;
    searchCardCanvas.height = 760;
    searchCardCtx = searchCardCanvas.getContext('2d');
    searchCardTexture = new THREE.CanvasTexture(searchCardCanvas);
    searchCardTexture.minFilter = THREE.LinearFilter;
    searchCardTexture.magFilter = THREE.LinearFilter;
    searchCardTexture.anisotropy = searchRenderer.capabilities.getMaxAnisotropy();

    // 3D Glass Plane Dimensions (Slightly larger for cinematic gold-standard presence)
    const cardGeo = new THREE.PlaneGeometry(350, 260);
    const cardMat = new THREE.MeshStandardMaterial({
      map: searchCardTexture,
      transparent: true,
      roughness: 0.12,
      metalness: 0.25,
      side: THREE.DoubleSide
    });

    searchCardMesh = new THREE.Mesh(cardGeo, cardMat);
    searchCardMesh.castShadow = true;
    searchCardMesh.receiveShadow = true;
    searchCardGroup.add(searchCardMesh);

    // Initial 3D Spatial Tilt: 15° - 25° Y-axis tilt
    const initTiltY = (data.tiltY !== undefined ? data.tiltY : -18) * (Math.PI / 180);
    const initTiltX = (data.tiltX !== undefined ? data.tiltX : 8) * (Math.PI / 180);
    searchCardGroup.rotation.y = initTiltY;
    searchCardGroup.rotation.x = initTiltX;

    searchScene.add(searchCardGroup);

    // Initial render
    drawSearchCardTexture(data, 0);

    // 8. Animation & Render Loop (Real-time camera pan push-in & specular light movement)
    animClock = 0;
    lastTime = performance.now();

    const animate = () => {
      searchAnimFrame = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      animClock += dt;

      // Update texture with character-by-character typing & cursor pulse
      const liveData = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : data);
      drawSearchCardTexture(liveData, animClock);

      // Smooth 3D Camera Pan: subtle push-in toward suggestions as typing finishes
      const cycle = animClock % 4.2;
      let pushFactor = 0;
      if (cycle > 2.0 && cycle < 3.8) {
        pushFactor = Math.sin(((cycle - 2.0) / 1.8) * Math.PI);
      }

      if (searchControls) {
        searchControls.update();
      } else if (searchCamera) {
        // Default subtle cinematic camera drift if user is not actively orbiting
        searchCamera.position.z = 430 - pushFactor * 30;
        searchCamera.position.x = -45 + pushFactor * 12;
      }

      // Specular ray pulse
      if (searchRaysMesh) {
        searchRaysMesh.material.opacity = 0.38 + Math.sin(animClock * 1.5) * 0.12;
      }

      if (searchRenderer && searchScene && searchCamera) {
        searchRenderer.render(searchScene, searchCamera);
      }
    };

    animate();
  };

  function cleanupSearch3DScene() {
    if (searchAnimFrame) {
      cancelAnimationFrame(searchAnimFrame);
      searchAnimFrame = null;
    }
    if (searchControls) {
      searchControls.dispose();
      searchControls = null;
    }
    if (searchRenderer) {
      searchRenderer.dispose();
      if (searchRenderer.domElement && searchRenderer.domElement.parentNode) {
        searchRenderer.domElement.parentNode.removeChild(searchRenderer.domElement);
      }
      searchRenderer = null;
    }
    searchScene = null;
    searchCamera = null;
    searchCardGroup = null;
    searchBgMesh = null;
    searchRaysMesh = null;
    searchCardMesh = null;
    searchCardCanvas = null;
    searchCardCtx = null;
    searchCardTexture = null;
  }

  window.cleanupSearch3DScene = cleanupSearch3DScene;

  // Mount into the top customizer preview modal stage
  window.tplMountSearch3DStage = function(stage, data) {
    if (!stage) return;
    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #04060a; overflow: hidden; cursor: grab;">
        <div id="search-3d-viewport-container" style="position: absolute; inset: 0; width: 100%; height: 100%;"></div>
      </div>
    `;
    const container = stage.querySelector('#search-3d-viewport-container');
    setTimeout(() => {
      window.initSearch3DScene(container, data);
    }, 30);
  };

})();
