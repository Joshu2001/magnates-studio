/**
 * 3D Glassmorphic Instagram Post Animation Engine
 * Replicating First-Class Documentary & Social Artifact Standards (Vox, Magnates Media, James Jani)
 *
 * Implements:
 * 1. UI Container & Material Shader:
 *    - Frosted dark-mode Instagram UI casing with subtle 1px specular border highlight
 *    - Micro-glass glint specular highlights sweeping across the screen
 *    - Authentic vector icons (Heart, Comment, Share, Bookmark, Audio Track)
 *    - Blue verified checkmark badge option for @creator
 *    - Dynamic double-tap popping heart with soft shadow and pulse physics
 *    - Dynamic like count ticker (0 -> 1,248,900 likes) and expandable caption text
 * 2. Scale & 3D Spatial Framing:
 *    - Perspective Rig: Dynamic 20°-30° spatial pitch and yaw tilt in 3D space
 *    - Framing: Scaled to cover 55%-70% of viewport height
 * 3. Backdrop Environment & Optics:
 *    - Multi-layered dark background: Darkened, blurred 3x3 Instagram feed grid with f/2.8 lens bokeh pass
 *    - Subtle tactical coordinate grid with glowing particle dust motes
 *    - Top-down warm directional key spotlight casting contact drop shadow beneath the card
 *    - Full interactive OrbitControls (drag to tilt/orbit in 3D, wheel to zoom)
 *    - Realtime timeline scrub synchronization & video export canvas pipeline
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'instagram';

  const DEFAULT_CONFIG = {
    type: 'instagram',
    username: '@creator',
    verified: true,
    postImage: '/clean_mountain_backdrop.png',
    likesCount: 1248900,
    likesFormatted: '1,248,900 likes',
    caption: 'Expandable 1 part to roast cinematic storytelling highlights and more...',
    location: '📍 Location, 💬 Comment',
    timestamp: '14 hours ago',
    audioTrack: 'Original Audio • @creator',
    // Atmospheric Optics & Cinema Depth
    frostedFilter: true,
    blurColor: 'rgba(18, 24, 38, 0.78)',
    keyLightColor: '#fff5ea',
    keyLightIntensity: 1.8,
    contactShadowColor: 'rgba(0, 0, 0, 0.85)',
    dropColor: '#000000',
    spatialPitch: 20, // 20° default pitch
    spatialTilt: 10,  // 10° default yaw / tilt
    spatialRoll: 2,
    zoomLevel: 1.05,
    backdropType: 'feed_grid', // 'feed_grid', 'tactical_grid', 'studio_spotlight'
    doubleTapHeart: true,
    glareSweep: true,
    cameraDistance: 460
  };

  // Three.js Scene References
  let igScene = null;
  let igCamera = null;
  let igRenderer = null;
  let igAnimFrame = null;
  let igControls = null;
  let igCardGroup = null;

  // Meshes
  let cardMesh = null;
  let cardCanvas = null;
  let cardCtx = null;
  let cardTexture = null;

  let bgMesh = null;
  let bgCanvas = null;
  let bgCtx = null;
  let bgTexture = null;

  let shadowMesh = null;
  let particlesMesh = null;
  let keySpotLight = null;
  let rimLight = null;
  let ambientLight = null;

  // Animation state
  let animClock = 0;
  let lastTimestamp = 0;
  let isManualScrub = false;
  let manualT = 0;

  // Image cache
  const imageCache = new Map();

  function getCachedImage(src) {
    if (!src) return null;
    if (imageCache.has(src)) {
      const img = imageCache.get(src);
      return img.complete && img.naturalWidth > 0 ? img : null;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    imageCache.set(src, img);
    img.onload = () => {
      // Trigger canvas re-draw
    };
    return null;
  }

  // Pre-load default assets
  getCachedImage('/clean_mountain_backdrop.png');
  getCachedImage('/hiker_background_inpainted.png');
  getCachedImage('/clean_traveler_bg.png');
  getCachedImage('/tokyo_1987_cinematic.jpg');
  getCachedImage('/cinematic_cyber_neon.jpg');
  getCachedImage('/boardroom_scene_hd.jpg');

  // Format numbers with commas
  function formatNumber(num) {
    return Number(num || 0).toLocaleString('en-US');
  }

  /**
   * 1. Draw High-Fidelity 3D Glassmorphic Instagram Card Texture
   */
  function drawInstagramCardTexture(data, t) {
    if (!cardCanvas || !cardCtx) {
      cardCanvas = document.createElement('canvas');
      cardCanvas.width = 1024;
      cardCanvas.height = 1320;
      cardCtx = cardCanvas.getContext('2d');
    }
    const ctx = cardCtx;
    const w = cardCanvas.width;
    const h = cardCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const username = data.username || '@creator';
    const verified = data.verified !== false;
    const rawLikes = data.likesCount || 1248900;
    const caption = data.caption || 'Expandable 1 part to roast cinematic storytelling highlights and more...';
    const location = data.location || '📍 Location, 💬 Comment';
    const timestamp = data.timestamp || '14 hours ago';
    const audioTrack = data.audioTrack || 'Original Audio • @creator';

    // Animation physics: 3.8s loop
    const loopDuration = 3.8;
    const cycleTime = t % loopDuration;

    // Like counter ticker animation
    let currentLikes = rawLikes;
    if (cycleTime < 0.8) {
      const p = cycleTime / 0.8;
      currentLikes = Math.floor(rawLikes * 0.94 + rawLikes * 0.06 * p);
    } else {
      currentLikes = rawLikes;
    }

    // Double-tap heart animation phase
    let heartScale = 0;
    let heartAlpha = 0;
    if (cycleTime >= 0.6 && cycleTime <= 2.6) {
      const hp = (cycleTime - 0.6) / 2.0;
      if (hp < 0.22) {
        // Fast pop & overshoot bounce
        const sub = hp / 0.22;
        heartScale = Math.sin(sub * Math.PI * 0.5) * 1.35;
        heartAlpha = Math.min(1, sub * 1.8);
      } else if (hp < 0.38) {
        // Settle from 1.35 to 1.0
        const sub = (hp - 0.22) / 0.16;
        heartScale = 1.35 - 0.35 * sub;
        heartAlpha = 1;
      } else if (hp < 0.72) {
        // Subtle heartbeat pulse
        const sub = (hp - 0.38) / 0.34;
        heartScale = 1.0 + Math.sin(sub * Math.PI * 4) * 0.06;
        heartAlpha = 1;
      } else {
        // Smooth fade out
        const sub = (hp - 0.72) / 0.28;
        heartScale = 1.0 - 0.2 * sub;
        heartAlpha = Math.max(0, 1 - sub * 1.2);
      }
    }

    // Glass glare sweep phase (runs concurrently with heart pop)
    let glintPos = -0.5;
    if (cycleTime >= 0.5 && cycleTime <= 2.8) {
      glintPos = (cycleTime - 0.5) / 2.3; // 0.0 to 1.0
    }

    // --- CARD GEOMETRY & MATERIAL ---
    const pad = 24;
    const cardX = pad;
    const cardY = pad;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    const r = 36;

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
    ctx.clip();

    // 1. Frosted Dark Glass Casing
    const glassGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    glassGrad.addColorStop(0, 'rgba(24, 30, 46, 0.88)');
    glassGrad.addColorStop(0.45, 'rgba(15, 20, 32, 0.82)');
    glassGrad.addColorStop(1, 'rgba(8, 12, 22, 0.92)');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Subtle glass noise / frosted texture simulation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let py = cardY; py < cardY + cardH; py += 6) {
      if (Math.sin(py * 3.7) > 0.3) {
        ctx.fillRect(cardX, py, cardW, 2.5);
      }
    }

    // 2. Micro-glass Glint Specular Sweep (diagonal glare)
    if (glintPos >= 0 && glintPos <= 1.0) {
      const glintX = cardX + (cardW + 500) * glintPos - 250;
      const glintGrad = ctx.createLinearGradient(glintX, cardY, glintX + 280, cardY + cardH);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glintGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0.06)');
      glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
      glintGrad.addColorStop(0.58, 'rgba(255, 255, 255, 0.06)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glintGrad;
      ctx.fillRect(cardX, cardY, cardW, cardH);
    }

    // 3. Header Section
    const headerY = cardY + 28;
    const avatarX = cardX + 42;
    const avatarY = headerY + 36;
    const avatarR = 26;

    // Instagram gradient avatar ring
    ctx.save();
    const ringGrad = ctx.createLinearGradient(avatarX - avatarR, avatarY - avatarR, avatarX + avatarR, avatarY + avatarR);
    ringGrad.addColorStop(0, '#f59e0b');
    ringGrad.addColorStop(0.35, '#ec4899');
    ringGrad.addColorStop(0.7, '#8b5cf6');
    ringGrad.addColorStop(1, '#3b82f6');
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR + 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // Inner avatar circle
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const avatarImg = getCachedImage('/clean_traveler_bg.png') || getCachedImage('/creator_portrait_cutout.png');
    if (avatarImg) {
      ctx.drawImage(avatarImg, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(username.charAt(1).toUpperCase() || 'C', avatarX, avatarY);
    }
    ctx.restore();

    // Username
    const textStartX = avatarX + avatarR + 18;
    ctx.font = '700 25px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(username, textStartX, avatarY - 8);

    const uWidth = ctx.measureText(username).width;

    // Verified Blue Badge SVG Checkmark
    if (verified) {
      const badgeX = textStartX + uWidth + 14;
      const badgeY = avatarY - 8;
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 10.5, 0, Math.PI * 2);
      ctx.fill();

      // Checkmark icon
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(badgeX - 4.5, badgeY - 0.5);
      ctx.lineTo(badgeX - 1, badgeY + 3.2);
      ctx.lineTo(badgeX + 5, badgeY - 3.5);
      ctx.stroke();
      ctx.restore();
    }

    // Audio attribution / subtitle row
    ctx.font = '500 16px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(audioTrack, textStartX, avatarY + 16);

    // Three horizontal dots icon (Right header)
    const dotsX = cardX + cardW - 52;
    ctx.fillStyle = '#cbd5e1';
    for (let di = -1; di <= 1; di++) {
      ctx.beginPath();
      ctx.arc(dotsX + di * 9, avatarY - 2, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Main Media Frame (Mountain Sunrise Photo)
    const mediaPad = 28;
    const mediaX = cardX + mediaPad;
    const mediaY = avatarY + avatarR + 24;
    const mediaW = cardW - mediaPad * 2;
    const mediaH = 680;
    const mediaR = 20;

    ctx.save();
    // Rounded Media Box
    ctx.beginPath();
    ctx.moveTo(mediaX + mediaR, mediaY);
    ctx.lineTo(mediaX + mediaW - mediaR, mediaY);
    ctx.quadraticCurveTo(mediaX + mediaW, mediaY, mediaX + mediaW, mediaY + mediaR);
    ctx.lineTo(mediaX + mediaW, mediaY + mediaH - mediaR);
    ctx.quadraticCurveTo(mediaX + mediaW, mediaY + mediaH, mediaX + mediaW - mediaR, mediaY + mediaH);
    ctx.lineTo(mediaX + mediaR, mediaY + mediaH);
    ctx.quadraticCurveTo(mediaX, mediaY + mediaH, mediaX, mediaY + mediaH - mediaR);
    ctx.lineTo(mediaX, mediaY + mediaR);
    ctx.quadraticCurveTo(mediaX, mediaY, mediaX + mediaR, mediaY);
    ctx.closePath();
    ctx.clip();

    // Draw Media Photo
    const postImg = getCachedImage(data.postImage) || getCachedImage('/clean_mountain_backdrop.png') || getCachedImage('/hiker_background_inpainted.png');
    if (postImg) {
      ctx.drawImage(postImg, mediaX, mediaY, mediaW, mediaH);
    } else {
      // Cinematic mountain sunrise fallback gradient
      const mtnGrad = ctx.createLinearGradient(mediaX, mediaY, mediaX, mediaY + mediaH);
      mtnGrad.addColorStop(0, '#0f172a');
      mtnGrad.addColorStop(0.35, '#38bdf8');
      mtnGrad.addColorStop(0.65, '#f59e0b');
      mtnGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = mtnGrad;
      ctx.fillRect(mediaX, mediaY, mediaW, mediaH);
    }

    // Media Inner Specular Glass Sheen
    const mediaSheen = ctx.createLinearGradient(mediaX, mediaY, mediaX + mediaW, mediaY + mediaH);
    mediaSheen.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    mediaSheen.addColorStop(0.25, 'rgba(255, 255, 255, 0.03)');
    mediaSheen.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = mediaSheen;
    ctx.fillRect(mediaX, mediaY, mediaW, mediaH);

    // Media Glass Glare Sweep (dynamic during heart pop)
    if (glintPos >= 0 && glintPos <= 1.0) {
      const mGlintX = mediaX + (mediaW + 400) * glintPos - 200;
      const mGlint = ctx.createLinearGradient(mGlintX, mediaY, mGlintX + 220, mediaY + mediaH);
      mGlint.addColorStop(0, 'rgba(255, 255, 255, 0)');
      mGlint.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
      mGlint.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = mGlint;
      ctx.fillRect(mediaX, mediaY, mediaW, mediaH);
    }

    // Double-Tap Popping Heart Animation
    if (heartScale > 0.02 && heartAlpha > 0.02) {
      const hx = mediaX + mediaW / 2;
      const hy = mediaY + mediaH / 2;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.scale(heartScale, heartScale);
      ctx.globalAlpha = heartAlpha;

      // Glow & Drop Shadow
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 38;

      // Heart Path
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      const s = 3.6; // Scale factor
      ctx.moveTo(0, 12 * s);
      ctx.bezierCurveTo(-14 * s, -4 * s, -28 * s, 8 * s, -28 * s, 22 * s);
      ctx.bezierCurveTo(-28 * s, 36 * s, -14 * s, 48 * s, 0, 62 * s);
      ctx.bezierCurveTo(14 * s, 48 * s, 28 * s, 36 * s, 28 * s, 22 * s);
      ctx.bezierCurveTo(28 * s, 8 * s, 14 * s, -4 * s, 0, 12 * s);
      ctx.closePath();
      ctx.fill();

      // Specular highlight on heart lobe
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      ctx.ellipse(-12 * s, 18 * s, 6 * s, 3.5 * s, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // end media clip

    // 1px inner border on media frame
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(mediaX + mediaR, mediaY);
    ctx.lineTo(mediaX + mediaW - mediaR, mediaY);
    ctx.quadraticCurveTo(mediaX + mediaW, mediaY, mediaX + mediaW, mediaY + mediaR);
    ctx.lineTo(mediaX + mediaW, mediaY + mediaH - mediaR);
    ctx.quadraticCurveTo(mediaX + mediaW, mediaY + mediaH, mediaX + mediaW - mediaR, mediaY + mediaH);
    ctx.lineTo(mediaX + mediaR, mediaY + mediaH);
    ctx.quadraticCurveTo(mediaX, mediaY + mediaH, mediaX, mediaY + mediaH - mediaR);
    ctx.lineTo(mediaX, mediaY + mediaR);
    ctx.quadraticCurveTo(mediaX, mediaY, mediaX + mediaR, mediaY);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 5. Action Icons Bar
    const actY = mediaY + mediaH + 28;
    const actX = mediaX + 6;

    // 5.1 Heart Icon (Red Filled with glow)
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.55)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    const hs = 0.55;
    const hox = actX + 16;
    const hoy = actY + 2;
    ctx.translate(hox, hoy);
    ctx.moveTo(0, 5 * hs);
    ctx.bezierCurveTo(-14 * hs, -11 * hs, -28 * hs, 1 * hs, -28 * hs, 15 * hs);
    ctx.bezierCurveTo(-28 * hs, 29 * hs, -14 * hs, 41 * hs, 0, 55 * hs);
    ctx.bezierCurveTo(14 * hs, 41 * hs, 28 * hs, 29 * hs, 28 * hs, 15 * hs);
    ctx.bezierCurveTo(28 * hs, 1 * hs, 14 * hs, -11 * hs, 0, 5 * hs);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 5.2 Comment Bubble Icon
    ctx.save();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const cX = actX + 76;
    const cY = actY + 16;
    ctx.beginPath();
    ctx.arc(cX, cY - 2, 13, 0.45 * Math.PI, 1.85 * Math.PI, false);
    ctx.lineTo(cX - 12, cY + 14);
    ctx.lineTo(cX - 4, cY + 9);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 5.3 Share Paper Airplane Icon
    ctx.save();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const sX = actX + 132;
    const sY = actY + 16;
    ctx.beginPath();
    ctx.moveTo(sX - 12, sY - 10);
    ctx.lineTo(sX + 14, sY);
    ctx.lineTo(sX - 12, sY + 10);
    ctx.lineTo(sX - 5, sY);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sX - 5, sY);
    ctx.lineTo(sX + 14, sY);
    ctx.stroke();
    ctx.restore();

    // 5.4 Music / Verified pill tag
    ctx.save();
    const pillX = actX + 185;
    const pillY = actY + 5;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, 150, 24, 12);
    ctx.fill();
    ctx.stroke();
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♫ AUDIO TRACK', pillX + 75, pillY + 12);
    ctx.restore();

    // 5.5 Bookmark Ribbon Icon (Far Right)
    ctx.save();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const bX = cardX + cardW - mediaPad - 16;
    const bY = actY + 16;
    ctx.beginPath();
    ctx.moveTo(bX - 10, bY - 14);
    ctx.lineTo(bX + 10, bY - 14);
    ctx.lineTo(bX + 10, bY + 14);
    ctx.lineTo(bX, bY + 6);
    ctx.lineTo(bX - 10, bY + 14);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 6. Dynamic Likes Counter
    const likesY = actY + 54;
    ctx.font = '800 23px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${formatNumber(currentLikes)} likes`, mediaX + 4, likesY);

    // 7. Expandable Caption
    const capY = likesY + 34;
    ctx.font = '700 20px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(username, mediaX + 4, capY);
    const uCapW = ctx.measureText(username).width;

    ctx.font = '400 19px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    // Truncate caption if too long for one line
    const maxCapW = mediaW - uCapW - 75;
    let dispCap = caption;
    if (ctx.measureText(dispCap).width > maxCapW) {
      while (dispCap.length > 10 && ctx.measureText(dispCap + '...').width > maxCapW) {
        dispCap = dispCap.slice(0, -1);
      }
      dispCap += '...';
    }
    ctx.fillText(dispCap, mediaX + 4 + uCapW + 12, capY);

    // Subtle 'more' link
    ctx.font = '600 18px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(' more', mediaX + 4 + uCapW + 12 + ctx.measureText(dispCap).width, capY);

    // 8. Location Tag & Comment count
    const metaY = capY + 32;
    ctx.font = '500 17px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(location, mediaX + 4, metaY);

    // 9. Timestamp
    const timeY = metaY + 28;
    ctx.font = '500 15px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(timestamp.toUpperCase(), mediaX + 4, timeY);

    ctx.restore(); // end card clip

    // 10. Outer 1px Specular Border Highlight
    ctx.save();
    ctx.strokeStyle = data.borderHighlight || 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
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
    ctx.stroke();

    // Top edge highlight bevel (extra specular reflection)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(cardX + r + 20, cardY + 1);
    ctx.lineTo(cardX + cardW - r - 20, cardY + 1);
    ctx.stroke();
    ctx.restore();

    return cardCanvas;
  }

  /**
   * 2. Draw Multi-Layered Atmospheric Studio Backdrop (Blurred Feed + Grid + Bokeh)
   */
  function drawBackdropTexture(data) {
    if (!bgCanvas || !bgCtx) {
      bgCanvas = document.createElement('canvas');
      bgCanvas.width = 1536;
      bgCanvas.height = 1024;
      bgCtx = bgCanvas.getContext('2d');
    }
    const ctx = bgCtx;
    const w = bgCanvas.width;
    const h = bgCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Deep dark vignette canvas
    const baseGrad = ctx.createRadialGradient(w / 2, h * 0.35, 100, w / 2, h / 2, w * 0.75);
    baseGrad.addColorStop(0, '#101626');
    baseGrad.addColorStop(0.5, '#070a12');
    baseGrad.addColorStop(1, '#020306');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 2.1 Blurred 3x3 Instagram Feed Grid
    const tileW = 280;
    const tileH = 340;
    const gap = 38;
    const cols = 5;
    const rows = 3;
    const startX = (w - (cols * tileW + (cols - 1) * gap)) / 2;
    const startY = (h - (rows * tileH + (rows - 1) * gap)) / 2;

    const bgTileImages = [
      getCachedImage('/boardroom_scene_hd.jpg'),
      getCachedImage('/hiker_background_inpainted.png'),
      getCachedImage('/tokyo_1987_cinematic.jpg'),
      getCachedImage('/clean_traveler_bg.png'),
      getCachedImage('/cinematic_cyber_neon.jpg'),
      getCachedImage('/clean_mountain_backdrop.png')
    ];

    ctx.save();
    ctx.filter = 'blur(14px) brightness(0.48) contrast(1.15)';
    ctx.globalAlpha = 0.55;

    let tileIdx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = startX + c * (tileW + gap);
        const ty = startY + r * (tileH + gap);
        const img = bgTileImages[tileIdx % bgTileImages.length];
        tileIdx++;

        if (img) {
          ctx.drawImage(img, tx, ty, tileW, tileH);
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(tx, ty, tileW, tileH);
        }

        // Dark card outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2;
        ctx.strokeRect(tx, ty, tileW, tileH);
      }
    }
    ctx.restore();

    // 2.2 Subtle Tactical Grid Overlay
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.lineWidth = 1;
    const step = 64;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Grid crosshairs & coordinate glyphs
    ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.font = '10px monospace';
    for (let i = 0; i < 14; i++) {
      const rx = (i * 211) % (w - 120) + 60;
      const ry = (i * 163) % (h - 120) + 60;
      ctx.fillText(`+ IG_SPATIAL_HUD // f/2.8 BOKEH // [SYS_0x${i.toString(16).toUpperCase()}]`, rx, ry);
    }
    ctx.restore();

    // 2.3 f/2.8 Bokeh pass (soft circular lens bokeh orbs)
    ctx.save();
    const bokehDiscs = [
      { x: w * 0.18, y: h * 0.25, r: 65, color: 'rgba(254, 240, 138, 0.07)' },
      { x: w * 0.82, y: h * 0.32, r: 85, color: 'rgba(56, 189, 248, 0.08)' },
      { x: w * 0.74, y: h * 0.78, r: 110, color: 'rgba(244, 114, 182, 0.06)' },
      { x: w * 0.12, y: h * 0.72, r: 90, color: 'rgba(56, 189, 248, 0.07)' },
      { x: w * 0.50, y: h * 0.15, r: 120, color: 'rgba(255, 245, 234, 0.09)' }
    ];
    bokehDiscs.forEach(b => {
      const bGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      bGrad.addColorStop(0, b.color);
      bGrad.addColorStop(0.7, b.color.replace(/[\d\.]+\)$/, '0.02)'));
      bGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    return bgCanvas;
  }

  /**
   * 3. Draw Contact Drop Shadow Texture
   */
  function createContactShadowTexture() {
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 256;
    const ctx = cv.getContext('2d');
    const rad = ctx.createRadialGradient(256, 128, 10, 256, 128, 220);
    rad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    rad.addColorStop(0.4, 'rgba(0, 0, 0, 0.55)');
    rad.addColorStop(0.8, 'rgba(0, 0, 0, 0.12)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.ellipse(256, 128, 230, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(cv);
  }

  /**
   * 4. Floating Particle Dust Motes in 3D Space
   */
  function createParticleSystem() {
    const count = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 650;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350 + 50;
      alphas[i] = 0.2 + Math.random() * 0.7;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle sprite canvas
    const pcv = document.createElement('canvas');
    pcv.width = 32;
    pcv.height = 32;
    const pctx = pcv.getContext('2d');
    const pgrad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pgrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pgrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.6)');
    pgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pctx.fillStyle = pgrad;
    pctx.beginPath();
    pctx.arc(16, 16, 16, 0, Math.PI * 2);
    pctx.fill();

    const pTexture = new THREE.CanvasTexture(pcv);

    const material = new THREE.PointsMaterial({
      size: 7,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    return new THREE.Points(geometry, material);
  }

  /**
   * Cleanup Three.js Scene
   */
  function cleanupInstagram3DScene() {
    if (igAnimFrame) {
      cancelAnimationFrame(igAnimFrame);
      igAnimFrame = null;
    }
    if (igControls) {
      igControls.dispose();
      igControls = null;
    }
    if (igRenderer) {
      igRenderer.dispose();
      if (igRenderer.domElement && igRenderer.domElement.parentNode) {
        igRenderer.domElement.parentNode.removeChild(igRenderer.domElement);
      }
      igRenderer = null;
    }
    igScene = null;
    igCamera = null;
    igCardGroup = null;
    cardMesh = null;
    cardTexture = null;
    bgMesh = null;
    bgTexture = null;
  }

  /**
   * 5. Initialize Full 3D Glassmorphic Instagram Scene
   */
  window.initInstagram3DScene = function(container, customData) {
    if (!container) return;
    cleanupInstagram3DScene();

    const data = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('instagram') : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    igScene = new THREE.Scene();
    igScene.background = new THREE.Color(0x06080d);
    igScene.fog = new THREE.FogExp2(0x06080d, 0.0015);

    igCamera = new THREE.PerspectiveCamera(34, width / height, 1, 3000);
    igCamera.position.set(0, 8, data.cameraDistance || 460);
    igCamera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    igRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    igRenderer.setSize(width, height);
    igRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    igRenderer.shadowMap.enabled = true;
    igRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    igRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    igRenderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(igRenderer.domElement);

    // 3. OrbitControls (Grab & Drag to tilt in 3D space, wheel to zoom)
    if (typeof THREE.OrbitControls !== 'undefined') {
      igControls = new THREE.OrbitControls(igCamera, igRenderer.domElement);
      igControls.enableDamping = true;
      igControls.dampingFactor = 0.06;
      igControls.maxDistance = 850;
      igControls.minDistance = 260;
      igControls.maxPolarAngle = Math.PI / 1.7;
      igControls.minPolarAngle = Math.PI / 3.5;
    }

    // 4. Lighting Rig
    ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    igScene.add(ambientLight);

    // Warm directional top-down key spotlight casting contact drop shadow
    keySpotLight = new THREE.DirectionalLight(data.keyLightColor || '#fff5ea', data.keyLightIntensity || 1.8);
    keySpotLight.position.set(20, 280, 220);
    keySpotLight.castShadow = true;
    keySpotLight.shadow.mapSize.width = 1024;
    keySpotLight.shadow.mapSize.height = 1024;
    keySpotLight.shadow.camera.near = 10;
    keySpotLight.shadow.camera.far = 800;
    igScene.add(keySpotLight);

    // Subtle cool edge rim light
    rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-240, 60, 120);
    igScene.add(rimLight);

    // 5. Multi-Layered Atmospheric Backdrop Mesh (Blurred Feed Grid + Bokeh)
    const bgCv = drawBackdropTexture(data);
    bgTexture = new THREE.CanvasTexture(bgCv);
    bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.magFilter = THREE.LinearFilter;

    const bgGeo = new THREE.PlaneGeometry(1050, 700);
    const bgMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      depthWrite: false
    });
    bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 0, -180);
    igScene.add(bgMesh);

    // 6. Floating Particle Dust Motes
    particlesMesh = createParticleSystem();
    igScene.add(particlesMesh);

    // 7. Contact Drop Shadow Plane Mesh
    const shadowGeo = new THREE.PlaneGeometry(280, 140);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2.3;
    shadowMesh.position.set(12, -125, -20);
    igScene.add(shadowMesh);

    // 8. 3D Glassmorphic Instagram Card Mesh
    igCardGroup = new THREE.Group();

    // Default dynamic 20°-30° spatial pitch and yaw tilt
    igCardGroup.rotation.x = THREE.MathUtils.degToRad(data.spatialPitch !== undefined ? data.spatialPitch : 20);
    igCardGroup.rotation.y = THREE.MathUtils.degToRad(data.spatialTilt !== undefined ? data.spatialTilt : 10);
    igCardGroup.rotation.z = THREE.MathUtils.degToRad(data.spatialRoll !== undefined ? data.spatialRoll : 2);

    const cardCv = drawInstagramCardTexture(data, 0);
    cardTexture = new THREE.CanvasTexture(cardCv);
    cardTexture.minFilter = THREE.LinearFilter;
    cardTexture.magFilter = THREE.LinearFilter;

    // Card dimensions covering 60%-70% of viewport
    const cardWidth = 215;
    const cardHeight = 277;
    const cardGeo = new THREE.PlaneGeometry(cardWidth, cardHeight, 16, 16);

    const cardMat = new THREE.MeshStandardMaterial({
      map: cardTexture,
      transparent: true,
      roughness: 0.18,
      metalness: 0.12,
      side: THREE.DoubleSide
    });

    cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    igCardGroup.add(cardMesh);

    igScene.add(igCardGroup);

    // 9. Animation Loop
    lastTimestamp = performance.now();
    animClock = 0;

    function renderLoop(now) {
      igAnimFrame = requestAnimationFrame(renderLoop);

      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock += delta;
      } else {
        animClock = manualT;
      }

      // Continuous texture update for animations (double-tap heart, like counter, glare sweep)
      drawInstagramCardTexture(data, animClock);
      if (cardTexture) cardTexture.needsUpdate = true;

      // Subtle atmospheric floating drift
      if (igCardGroup && !isManualScrub) {
        const basePitch = THREE.MathUtils.degToRad(data.spatialPitch !== undefined ? data.spatialPitch : 20);
        const baseTilt = THREE.MathUtils.degToRad(data.spatialTilt !== undefined ? data.spatialTilt : 10);
        igCardGroup.rotation.x = basePitch + Math.sin(animClock * 0.8) * 0.018;
        igCardGroup.rotation.y = baseTilt + Math.cos(animClock * 0.6) * 0.022;
        igCardGroup.position.y = Math.sin(animClock * 1.2) * 2.8;
      }

      // Particle floating drift
      if (particlesMesh && particlesMesh.geometry.attributes.position) {
        const pos = particlesMesh.geometry.attributes.position.array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += Math.sin(animClock + i) * 0.12;
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;
      }

      if (igControls) igControls.update();
      if (igRenderer && igScene && igCamera) {
        igRenderer.render(igScene, igCamera);
      }
    }

    igAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * 6. Mount Stage into the Top Template Customizer Modal
   */
  window.tplMountInstagram3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="instagram-3d-stage-container" style="position: absolute; inset: 0; overflow: hidden; background: #06080d;">
        <div id="instagram-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%;"></div>
        <!-- 3D HUD Reticle Overlays & Indicators -->
        <div style="position: absolute; top: 16px; left: 18px; display: flex; align-items: center; gap: 8px; pointer-events: none; z-index: 10;">
          <div style="background: rgba(8,12,24,0.85); border: 1px solid rgba(56,189,248,0.4); border-radius: 6px; padding: 5px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #38bdf8; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8; display: inline-block;"></span>
            <span>3D SPATIAL INSTAGRAM HUD // 60FPS</span>
          </div>
        </div>
        <div style="position: absolute; bottom: 16px; right: 18px; pointer-events: none; z-index: 10;">
          <div style="background: rgba(8,12,24,0.85); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 4px 10px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: #94a3b8;">
            DRAG TO ORBIT • SCROLL TO ZOOM
          </div>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#instagram-3d-viewport');
    function triggerInit() {
      if (typeof window.initInstagram3DScene === 'function') {
        window.initInstagram3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * 7. Stepper callback for hover preview loop & live customizer scrubbing
   */
  window.stepInstagramAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    const viewport = container.querySelector('#instagram-3d-viewport');
    if (!viewport && !igRenderer) {
      window.initInstagram3DScene(container, d);
    }
    drawInstagramCardTexture(d, t);
    if (cardTexture) cardTexture.needsUpdate = true;
  };

  /**
   * 8. Canvas Renderer for Timeline Playback & Video Export
   */
  window.renderInstagramCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    if (igRenderer && igRenderer.domElement) {
      drawInstagramCardTexture(d, t);
      if (cardTexture) cardTexture.needsUpdate = true;
      if (igScene && igCamera) {
        igRenderer.render(igScene, igCamera);
        ctx.drawImage(igRenderer.domElement, 0, 0, cw, ch);
        return;
      }
    }

    // High-resolution fallback blit
    const cv = drawInstagramCardTexture(d, t);
    ctx.drawImage(cv, 0, 0, cw, ch);
  };

  /**
   * 9. Build Contextual Inspector Panel ('Atmosphere & Cinema Depth')
   */
  window.tplBuildInstagramInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
        
        <!-- Section Title: Atmosphere & Cinema Depth -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <span style="font-size: 14px;">📷</span>
            <span style="font-size: 11px; font-weight: 800; color: #f8fafc; letter-spacing: 0.6px; text-transform: uppercase;">Atmosphere &amp; Cinema Depth</span>
          </div>
          <span style="font-size: 9.5px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.3);">3D HUD</span>
        </div>

        <!-- Frosted Filter Toggle -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Frosted Filter</label>
          <input type="checkbox" id="ig-inp-frosted" ${d.frostedFilter !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #38bdf8;" />
        </div>

        <!-- Blur Color -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Blur Color</label>
          <input type="color" id="ig-inp-blur-color" value="#121826" style="width: 38px; height: 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: transparent; cursor: pointer;" />
        </div>

        <!-- Key Light Color -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Key Light</label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="color" id="ig-inp-keylight" value="${d.keyLightColor || '#fff5ea'}" style="width: 38px; height: 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: transparent; cursor: pointer;" />
            <span style="font-size: 10px; font-family: monospace; color: #fcd34d;">Warm Cream</span>
          </div>
        </div>

        <!-- Contact Inkolt / Drop Color -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Contact Shadow</label>
          <input type="color" id="ig-inp-drop-color" value="#000000" style="width: 38px; height: 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: transparent; cursor: pointer;" />
        </div>

        <!-- Post Details: Username & Verified -->
        <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <label style="font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Creator Profile</label>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" id="ig-inp-username" value="${d.username || '@creator'}" placeholder="@creator" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: #f8fafc;" />
            <label style="display: flex; align-items: center; gap: 4px; font-size: 10px; color: #38bdf8; cursor: pointer;">
              <input type="checkbox" id="ig-inp-verified" ${d.verified !== false ? 'checked' : ''} style="accent-color: #38bdf8;" />
              Verified
            </label>
          </div>
        </div>

        <!-- Caption -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Caption Text</label>
          <textarea id="ig-inp-caption" rows="2" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: #f8fafc; resize: vertical;">${d.caption || ''}</textarea>
        </div>

        <!-- Location Tag -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Location Tag &amp; Comments</label>
          <input type="text" id="ig-inp-location" value="${d.location || '📍 Location, 💬 Comment'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: #f8fafc;" />
        </div>

        <!-- Likes Count Ticker -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Likes Count</label>
          <input type="number" id="ig-inp-likes" value="${d.likesCount || 1248900}" step="1000" style="width: 120px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; font-size: 11px; font-family: monospace; color: #f8fafc;" />
        </div>

        <!-- 3D Spatial Framing: Pitch & Tilt Sliders -->
        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Spatial Pitch</label>
            <span id="ig-val-pitch" style="font-size: 11px; font-family: monospace; font-weight: 700; color: #38bdf8;">${d.spatialPitch || 20}°</span>
          </div>
          <input type="range" id="ig-slider-pitch" min="-40" max="40" value="${d.spatialPitch || 20}" style="width: 100%; accent-color: #38bdf8;" />

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Spatial Tilt (Yaw)</label>
            <span id="ig-val-tilt" style="font-size: 11px; font-family: monospace; font-weight: 700; color: #38bdf8;">${d.spatialTilt || 10}°</span>
          </div>
          <input type="range" id="ig-slider-tilt" min="-40" max="40" value="${d.spatialTilt || 10}" style="width: 100%; accent-color: #38bdf8;" />
        </div>

        <!-- Atmosphere Backdrop Selector -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Atmosphere Backdrop</label>
          <select id="ig-sel-backdrop" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: #f8fafc;">
            <option value="feed_grid" ${d.backdropType === 'feed_grid' ? 'selected' : ''}>Instagram Feed Grid Blur (f/2.8 Bokeh)</option>
            <option value="tactical_grid" ${d.backdropType === 'tactical_grid' ? 'selected' : ''}>Dark Tactical Grid &amp; Telemetry</option>
            <option value="studio_spotlight" ${d.backdropType === 'studio_spotlight' ? 'selected' : ''}>Studio Key Spotlight</option>
          </select>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-ig-reset" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 10.5px; font-weight: 600; cursor: pointer; margin-top: 4px; transition: all 0.2s;">
          ↺ Reset to Cinematic 3D Defaults
        </button>
      </div>
    `;

    function updateData(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        const cur = window.tplGetContextualData(tplId) || {};
        const next = Object.assign({}, cur, patch);
        window.tplSetContextualData(tplId, next);
        window.tplUpdateStageWithContextualData(tplId, next);
      }
    }

    container.querySelector('#ig-inp-username')?.addEventListener('input', (e) => {
      updateData({ username: e.target.value });
    });

    container.querySelector('#ig-inp-verified')?.addEventListener('change', (e) => {
      updateData({ verified: e.target.checked });
    });

    container.querySelector('#ig-inp-caption')?.addEventListener('input', (e) => {
      updateData({ caption: e.target.value });
    });

    container.querySelector('#ig-inp-location')?.addEventListener('input', (e) => {
      updateData({ location: e.target.value });
    });

    container.querySelector('#ig-inp-likes')?.addEventListener('input', (e) => {
      updateData({ likesCount: parseInt(e.target.value, 10) || 1248900 });
    });

    container.querySelector('#ig-inp-keylight')?.addEventListener('input', (e) => {
      updateData({ keyLightColor: e.target.value });
    });

    container.querySelector('#ig-slider-pitch')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const valEl = container.querySelector('#ig-val-pitch');
      if (valEl) valEl.textContent = `${val}°`;
      updateData({ spatialPitch: val });
    });

    container.querySelector('#ig-slider-tilt')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const valEl = container.querySelector('#ig-val-tilt');
      if (valEl) valEl.textContent = `${val}°`;
      updateData({ spatialTilt: val });
    });

    container.querySelector('#ig-sel-backdrop')?.addEventListener('change', (e) => {
      updateData({ backdropType: e.target.value });
    });

    container.querySelector('#btn-ig-reset')?.addEventListener('click', () => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  window.INSTAGRAM_3D_CONFIG = DEFAULT_CONFIG;
  console.log('[Instagram 3D Engine] Initialized 3D Glassmorphic Social Artifact Engine');
})();
