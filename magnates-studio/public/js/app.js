// Magnates Studio Core Engine
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const audioPlayer = document.getElementById('audio-player');
const bgmPlayer = document.getElementById('bgm-player') || document.createElement('audio');

// State
let currentTime = 0;
let isPlaying = false;
let duration = 368.14; // Default project duration
let mediaFiles = [];
let particles = [];
let currentFilter = 'all';

// Zoom level (pixels per second)
let pps = 15; // default 15px per second
let activeTool = 'select'; // 'select', 'split', 'delete'
let selectedClip = null; // { clip, trackType }

// Timeline multi-layer structure
let timelineClips = {
  text: [
    {
      id: 'clip-text-1',
      start: 0,
      duration: 5,
      text: 'Did Google pump and dump?',
      highlight: 'pump and dump',
      fontFamily: "'Inter', sans-serif",
      fontSize: 64,
      textColor: '#ffffff',
      highlightColor: '#ff334b',
      anim: 'pop',
      sfx: 'whoosh',
      position: 'center',
      zIndex: 30,
      layerOrder: 'front'
    }
  ],
  image: [],
  video: [],
  voiceover: [],
  music: []
};

// ==================== UNDO / REDO HISTORY ENGINE ====================
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 40;

function recordState(actionName) {
  redoStack.length = 0;
  const snapshot = {
    action: actionName,
    timelineClips: JSON.parse(JSON.stringify(timelineClips)),
    currentTime,
    duration
  };
  undoStack.push(snapshot);
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  updateUndoRedoUI();
}

function undo() {
  if (undoStack.length === 0) return;
  const currentSnapshot = {
    action: 'current',
    timelineClips: JSON.parse(JSON.stringify(timelineClips)),
    currentTime,
    duration
  };
  redoStack.push(currentSnapshot);
  const prevState = undoStack.pop();
  timelineClips = JSON.parse(JSON.stringify(prevState.timelineClips));
  currentTime = prevState.currentTime;
  duration = prevState.duration;
  selectedClip = null;
  renderAllTimelineTracks();
  updateUI();
  updateUndoRedoUI();
}

function redo() {
  if (redoStack.length === 0) return;
  const currentSnapshot = {
    action: 'current',
    timelineClips: JSON.parse(JSON.stringify(timelineClips)),
    currentTime,
    duration
  };
  undoStack.push(currentSnapshot);
  const nextState = redoStack.pop();
  timelineClips = JSON.parse(JSON.stringify(nextState.timelineClips));
  currentTime = nextState.currentTime;
  duration = nextState.duration;
  selectedClip = null;
  renderAllTimelineTracks();
  updateUI();
  updateUndoRedoUI();
}

function updateUndoRedoUI() {
  const undoBtn = document.getElementById('tool-undo');
  const redoBtn = document.getElementById('tool-redo');
  if (undoBtn) {
    undoBtn.style.opacity = undoStack.length > 0 ? '1' : '0.4';
    undoBtn.style.pointerEvents = undoStack.length > 0 ? 'auto' : 'none';
  }
  if (redoBtn) {
    redoBtn.style.opacity = redoStack.length > 0 ? '1' : '0.4';
    redoBtn.style.pointerEvents = redoStack.length > 0 ? 'auto' : 'none';
  }
}

// ==================== PROCEDURAL SOUND EFFECTS (SFX) ENGINE ====================
let audioCtx = null;
let triggeredSFX = new Set();

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound Effects (SFX) Volume (0.0 to 1.0)
let sfxVolume = 0.8;

function playSFX(type, volumeOverride) {
  if (!type || type === 'none') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const volMult = volumeOverride !== undefined ? volumeOverride : sfxVolume;
  if (volMult <= 0.001) return; // Muted

  if (type === 'whoosh') {
    // Cinematic whoosh: bandpass filtered white noise with frequency & gain sweep
    const bufferSize = Math.floor(ctx.sampleRate * 0.42);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.8, now);
    filter.frequency.setValueAtTime(220, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.16);
    filter.frequency.exponentialRampToValueAtTime(140, now + 0.38);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * volMult, now);
    gain.gain.linearRampToValueAtTime(0.75 * volMult, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.42);
  } else if (type === 'bass_thud') {
    // Deep Bass Hit / Impact: pitch drop sine wave with fast impact punch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.35);

    gain.gain.setValueAtTime(0.9 * volMult, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'camera_click') {
    // Dual click shutter snap
    [0, 0.065].forEach((delay, idx) => {
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = idx === 0 ? 'triangle' : 'sine';
      clickOsc.frequency.setValueAtTime(1300 + (idx * 500), now + delay);
      clickOsc.frequency.exponentialRampToValueAtTime(220, now + delay + 0.03);

      clickGain.gain.setValueAtTime(0.65 * volMult, now + delay);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.038);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now + delay);
      clickOsc.stop(now + delay + 0.04);
    });
  } else if (type === 'glitch_burst') {
    // Digital Glitch: rapid square frequency modulation + noise crackle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.setValueAtTime(220, now + 0.04);
    osc.frequency.setValueAtTime(1600, now + 0.08);
    osc.frequency.setValueAtTime(300, now + 0.13);

    gain.gain.setValueAtTime(0.4 * volMult, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

// FX Settings
const fxState = {
  grid: { enabled: true, depth: 45, opacity: 0.25, vignette: 0.85 },
  particles: { enabled: true, count: 65, glow: 0.6, speed: 2 },
  silhouette: { enabled: false, color: 'white' }
};

// Initialize Particle System
function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 2 + 1),
      speedX: (Math.random() - 0.5) * 1.5,
      alpha: Math.random() * 0.8 + 0.2
    });
  }
}

// Draw 3D Curved Perspective Grid
function drawPerspectiveGrid() {
  if (!fxState.grid.enabled) return;

  const w = canvas.width;
  const h = canvas.height;
  const horizon = h * 0.45;

  ctx.save();
  ctx.strokeStyle = `rgba(200, 220, 255, ${fxState.grid.opacity})`;
  ctx.lineWidth = 1.5;

  // Vertical perspective lines converging upward
  const numVLines = 26;
  const vpX = w / 2;
  const vpY = horizon - (fxState.grid.depth * 4);

  for (let i = 0; i <= numVLines; i++) {
    const bottomX = (w / numVLines) * i;
    ctx.beginPath();
    ctx.moveTo(vpX + (bottomX - vpX) * 0.1, horizon);
    ctx.quadraticCurveTo(
      vpX + (bottomX - vpX) * 0.5,
      horizon + (h - horizon) * 0.4,
      bottomX,
      h
    );
    ctx.stroke();

    // Wall grid
    ctx.beginPath();
    ctx.moveTo(vpX + (bottomX - vpX) * 0.1, 0);
    ctx.lineTo(vpX + (bottomX - vpX) * 0.1, horizon);
    ctx.stroke();
  }

  // Horizontal floor lines
  const floorLineCount = 18;
  for (let i = 0; i < floorLineCount; i++) {
    const t = i / floorLineCount;
    const lineY = horizon + (h - horizon) * Math.pow(t, 2.2);
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(w, lineY);
    ctx.stroke();
  }

  // Horizontal wall lines
  for (let wy = horizon; wy >= 0; wy -= 45) {
    ctx.beginPath();
    ctx.moveTo(0, wy);
    ctx.lineTo(w, wy);
    ctx.stroke();
  }

  // Vignette
  const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.7);
  grad.addColorStop(0, 'rgba(10, 11, 15, 0)');
  grad.addColorStop(1, `rgba(5, 6, 8, ${fxState.grid.vignette})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

// Draw Fire & Ember Particles
function drawParticles() {
  if (!fxState.particles.enabled) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Bottom fire glow
  const fireGrad = ctx.createLinearGradient(0, h, 0, h - 300);
  fireGrad.addColorStop(0, `rgba(255, 65, 20, ${fxState.particles.glow})`);
  fireGrad.addColorStop(0.5, `rgba(255, 120, 30, ${fxState.particles.glow * 0.4})`);
  fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fireGrad;
  ctx.fillRect(0, h - 300, w, 300);

  // Floating sparks
  const count = fxState.particles.count;
  for (let i = 0; i < count; i++) {
    const p = particles[i];
    ctx.fillStyle = `rgba(255, 180, 70, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.speedY * fxState.particles.speed;
    p.x += p.speedX;

    if (p.y < 0) {
      p.y = h;
      p.x = Math.random() * w;
    }
  }

  ctx.restore();
}

// Draw Kinetic Typography with Full Customization Styles & Animations (Vox / Magnates Media)
function drawTextLayer(specificTextClip) {
  const activeText = specificTextClip || timelineClips.text.find(t => currentTime >= t.start && currentTime <= (t.start + t.duration));
  if (!activeText) return;

  ctx.save();
  const fontSize = activeText.fontSize || 64;
  const fontFamily = activeText.fontFamily || "'Inter', 'Oswald', sans-serif";
  ctx.font = `800 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Base starting positions, supporting custom dragged offsets (activeText.x, activeText.y)
  const defaultStartX = 220;
  let defaultStartY = canvas.height * 0.45;
  if (activeText.position === 'top') defaultStartY = canvas.height * 0.22;
  else if (activeText.position === 'bottom') defaultStartY = canvas.height * 0.72;

  const startX = activeText.x !== undefined ? activeText.x : defaultStartX;
  const startY = activeText.y !== undefined ? activeText.y : defaultStartY;

  const words = (activeText.text || '').split(' ');
  const highlightWords = (activeText.highlight || '').toLowerCase().split(' ');
  const textColor = activeText.textColor || '#ffffff';
  const highlightColor = activeText.highlightColor || '#ff334b';
  const animStyle = activeText.anim || 'pop';

  const elapsed = currentTime - activeText.start;
  const progress = Math.min(1, Math.max(0, elapsed / (activeText.duration || 5)));

  let currentX = startX;
  let currentY = startY;

  // Track rendered bounding box for selection and dragging
  let minBoxX = currentX;
  let maxBoxX = currentX;
  let minBoxY = currentY - (fontSize * 0.6);
  let maxBoxY = currentY + (fontSize * 0.6);

  // Global Animation Transformations
  let globalAlpha = 1.0;
  let animOffsetY = 0;
  let animScale = 1.0;

  if (animStyle === 'slide_up') {
    // Smooth bottom-to-top ease-out curve
    const t = Math.min(1, elapsed / 0.45);
    const ease = 1 - Math.pow(1 - t, 3);
    animOffsetY = (1 - ease) * 85;
    globalAlpha = Math.min(1, t * 1.6);
  } else if (animStyle === 'slide_down') {
    // Slide down from top to position (top-to-bottom ease)
    const t = Math.min(1, elapsed / 0.45);
    const ease = 1 - Math.pow(1 - t, 3);
    animOffsetY = -(1 - ease) * 85;
    globalAlpha = Math.min(1, t * 1.6);
  } else if (animStyle === 'slide_left') {
    // Fly in from right edge
    const t = Math.min(1, elapsed / 0.4);
    const ease = 1 - Math.pow(1 - t, 3);
    currentX += (1 - ease) * 400;
    globalAlpha = Math.min(1, t * 2.0);
  } else if (animStyle === 'slide_right') {
    // Fly in from left edge
    const t = Math.min(1, elapsed / 0.4);
    const ease = 1 - Math.pow(1 - t, 3);
    currentX -= (1 - ease) * 400;
    globalAlpha = Math.min(1, t * 2.0);
  } else if (animStyle === 'zoom_in') {
    // Scale from tiny to full size at center
    const t = Math.min(1, elapsed / 0.5);
    const ease = 1 - Math.pow(1 - t, 2.5);
    animScale = 0.1 + ease * 0.9;
    globalAlpha = Math.min(1, t * 2.5);
  } else if (animStyle === 'bounce') {
    // Overshoot spring bounce landing
    const t = Math.min(1, elapsed / 0.55);
    const spring = t < 0.6
      ? (1 - Math.pow(1 - t / 0.6, 2)) * 1.15
      : 1 + Math.sin((t - 0.6) * Math.PI / 0.4) * 0.08 * (1 - t);
    animScale = Math.max(0.05, spring);
    globalAlpha = Math.min(1, t * 3);
  } else if (animStyle === 'flip_in') {
    // 3D-like horizontal flip reveal using X scale
    const t = Math.min(1, elapsed / 0.4);
    animScale = t < 0.5 ? t * 2 : 1;
    globalAlpha = Math.min(1, t * 2.5);
  } else if (animStyle === 'wipe_right') {
    // Text wipes in from left, letter-by-letter reveal via clipping progress
    globalAlpha = 1;
  } else if (animStyle === 'stamp') {
    // Slam impact dropping from huge scale to solid lock
    const t = Math.min(1, elapsed / 0.32);
    animScale = 1.0 + Math.pow(1 - t, 2.5) * 0.85;
    globalAlpha = Math.min(1, t * 2.5);
  } else if (animStyle === 'materialize') {
    // Out of thin air: digital glitch, scan flicker, sudden emergence
    if (elapsed < 0.5) {
      const flickerSeed = Math.sin(elapsed * 50);
      globalAlpha = flickerSeed > 0.2 ? (0.4 + (flickerSeed * 0.6)) : 0.05;
      animOffsetY = (Math.random() - 0.5) * 6 * (1 - elapsed / 0.5);
    } else {
      globalAlpha = 1.0;
    }
  } else if (animStyle === 'fade') {
    globalAlpha = Math.min(1, elapsed / 0.6);
  }

  ctx.globalAlpha = globalAlpha;

  // If stamp animation, scale around the visual center
  if (animScale !== 1.0) {
    ctx.translate(canvas.width / 2, startY);
    ctx.scale(animScale, animScale);
    ctx.translate(-canvas.width / 2, -startY);
  }

  words.forEach((word, idx) => {
    // Typewriter effect
    if (animStyle === 'typewriter') {
      const wordsToShow = Math.floor(progress * words.length * 1.6);
      if (idx > wordsToShow) return;
    }
    // Wipe right: fast word-by-word reveal (quicker than typewriter)
    if (animStyle === 'wipe_right') {
      const wordsToShow = Math.floor(Math.min(1, elapsed / 0.5) * words.length * 1.4);
      if (idx > wordsToShow) return;
    }

    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const isHighlighted = highlightWords.includes(cleanWord);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = isHighlighted ? highlightColor : textColor;

    // Word pop effect
    if (animStyle === 'pop') {
      const wordStart = (idx / words.length) * 1.2;
      if (elapsed > wordStart && elapsed < wordStart + 0.35) {
        ctx.shadowBlur = 38;
        ctx.shadowColor = highlightColor;
      }
    }

    ctx.fillText(word, currentX, currentY + animOffsetY);
    ctx.restore();

    const metrics = ctx.measureText(word + ' ');
    const wordWidth = metrics.width;

    // Expand bounding box to encompass all words
    maxBoxX = Math.max(maxBoxX, currentX + wordWidth);
    minBoxX = Math.min(minBoxX, currentX);
    minBoxY = Math.min(minBoxY, currentY - (fontSize * 0.55));
    maxBoxY = Math.max(maxBoxY, currentY + (fontSize * 0.55));

    currentX += wordWidth;

    if (currentX > canvas.width - 250) {
      currentX = startX;
      currentY += (fontSize + 18);
    }
  });

  // Store interactive bounds for canvas hit-testing and dragging
  const padding = 16;
  const boxW = Math.max(80, (maxBoxX - minBoxX) + padding * 2);
  const boxH = Math.max(fontSize + 16, (maxBoxY - minBoxY) + padding * 2);
  const boxX = minBoxX - padding;
  const boxY = minBoxY - padding;
  activeText._renderBounds = { x: boxX, y: boxY, w: boxW, h: boxH };

  ctx.restore();

  // Draw transform handles if this text clip is currently selected
  if (selectedClip && selectedClip.clip.id === activeText.id && selectedClip.trackType === 'text') {
    drawTransformHandles(boxX, boxY, boxW, boxH);
  }
}

// Active media element cache
const mediaElementCache = new Map();

function getMediaElement(file) {
  if (mediaElementCache.has(file.url)) {
    return mediaElementCache.get(file.url);
  }
  let el;
  if (file.isVideo) {
    el = document.createElement('video');
    el.src = file.url;
    el.muted = true; // start muted for preview
    el.playsInline = true;
    el.preload = 'auto';
  } else if (file.isImage) {
    el = new Image();
    el.src = file.url;
  }
  if (el) mediaElementCache.set(file.url, el);
  return el;
}

let activePreviewMedia = null;

// Draw Active Video / Image in Canvas Center & Handle Video Audio
function drawMediaLayer(specificClip) {
  let targetClip = specificClip;
  if (!targetClip) {
    const activeVideoClip = timelineClips.video.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    const activeImageClip = timelineClips.image.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    targetClip = activeVideoClip || activeImageClip;
  }

  const targetFile = targetClip ? targetClip.file : activePreviewMedia;
  if (!targetFile) return;

  const el = getMediaElement(targetFile);
  if (!el) return;

  const w = canvas.width;
  const h = canvas.height;

  const maxW = 1280;
  const maxH = 720;

  let dw = 0;
  let dh = 0;

  if (targetFile.isVideo) {
    // Audio control on video
    if (targetClip) {
      el.muted = !targetClip.soundEnabled;
      el.volume = (targetClip.volume !== undefined ? targetClip.volume : 100) / 100;
    } else {
      el.muted = true;
    }

    if (isPlaying) {
      if (el.paused) el.play().catch(() => {});
      const startT = targetClip ? targetClip.start : 0;
      const clipTime = (currentTime - startT) % (el.duration || 10);
      if (Math.abs(el.currentTime - clipTime) > 0.25) {
        el.currentTime = Math.max(0, clipTime);
      }
    } else {
      if (!el.paused) el.pause();
      if (targetClip) {
        const clipTime = (currentTime - targetClip.start) % (el.duration || 10);
        if (Math.abs(el.currentTime - clipTime) > 0.1) {
          el.currentTime = Math.max(0, clipTime);
        }
      }
    }

    if (el.videoWidth && el.videoHeight) {
      const aspect = el.videoWidth / el.videoHeight;
      if (aspect > maxW / maxH) {
        dw = maxW;
        dh = maxW / aspect;
      } else {
        dh = maxH;
        dw = maxH * aspect;
      }
    } else {
      return;
    }
  } else if (targetFile.isImage) {
    if (!el.complete || !el.naturalWidth || !el.naturalHeight) {
      return;
    }
    const aspect = el.naturalWidth / el.naturalHeight;
    if (aspect > maxW / maxH) {
      dw = maxW;
      dh = maxW / aspect;
    } else {
      dh = maxH;
      dw = maxH * aspect;
    }
  }

  // Calculate base center coordinates plus custom transform offsets (stretch, scale, pan)
  const scale = (targetClip && targetClip.scale !== undefined) ? targetClip.scale : 1.0;
  const finalW = dw * scale;
  const finalH = dh * scale;
  const offsetX = (targetClip && targetClip.x !== undefined) ? targetClip.x : 0;
  const offsetY = (targetClip && targetClip.y !== undefined) ? targetClip.y : 0;
  const dx = ((w - finalW) / 2) + offsetX;
  const dy = ((h - finalH) / 2) + offsetY;

  // Cache rendered bounds for canvas mouse interaction
  if (targetClip) {
    targetClip._renderBounds = { x: dx, y: dy, w: finalW, h: finalH };
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 10;

  try {
    ctx.drawImage(el, dx, dy, finalW, finalH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, dy, finalW, finalH);
  } catch(e) {}

  ctx.restore();

  // If this clip is selected and is an image or video, draw interactive transform highlight & handles
  if (selectedClip && targetClip && selectedClip.clip.id === targetClip.id && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    drawTransformHandles(dx, dy, finalW, finalH);
  }
}

// Draw interactive bounding box & resize/drag corner handles
function drawTransformHandles(x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);

  // Corner and edge handles
  const handleSize = 12;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;

  const handles = [
    { x: x - handleSize / 2, y: y - handleSize / 2 }, // Top-Left
    { x: x + w - handleSize / 2, y: y - handleSize / 2 }, // Top-Right
    { x: x - handleSize / 2, y: y + h - handleSize / 2 }, // Bottom-Left
    { x: x + w - handleSize / 2, y: y + h - handleSize / 2 }, // Bottom-Right
    { x: x + w / 2 - handleSize / 2, y: y - handleSize / 2 }, // Top-Center
    { x: x + w / 2 - handleSize / 2, y: y + h - handleSize / 2 }, // Bottom-Center
    { x: x - handleSize / 2, y: y + h / 2 - handleSize / 2 }, // Middle-Left
    { x: x + w - handleSize / 2, y: y + h / 2 - handleSize / 2 } // Middle-Right
  ];

  handles.forEach(hnd => {
    ctx.fillRect(hnd.x, hnd.y, handleSize, handleSize);
    ctx.strokeRect(hnd.x, hnd.y, handleSize, handleSize);
  });

  ctx.restore();
}

// Draw All Visual Layers Sorted by Z-Index (Layer Order: Send to Back / Bring to Front)
function drawSortedVisualLayers() {
  const activeItems = [];

  // 1. Active Video Clips
  timelineClips.video.forEach(c => {
    if (currentTime >= c.start && currentTime <= (c.start + c.duration)) {
      activeItems.push({ type: 'video', clip: c, zIndex: c.zIndex !== undefined ? c.zIndex : 10 });
    }
  });

  // 2. Active Image Clips
  timelineClips.image.forEach(c => {
    if (currentTime >= c.start && currentTime <= (c.start + c.duration)) {
      activeItems.push({ type: 'image', clip: c, zIndex: c.zIndex !== undefined ? c.zIndex : 20 });
    }
  });

  // 3. Active Text Clips
  const activeTexts = timelineClips.text.filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  activeTexts.forEach(t => {
    activeItems.push({ type: 'text', clip: t, zIndex: t.zIndex !== undefined ? t.zIndex : 30 });
  });

  // Fallback: If no timeline visual clips are active, show preview media from library if chosen
  if (activeItems.length === 0 && activePreviewMedia) {
    activeItems.push({
      type: activePreviewMedia.isVideo ? 'video' : 'image',
      clip: { file: activePreviewMedia, start: 0, duration: duration, soundEnabled: true, volume: 100 },
      zIndex: 10
    });
  }

  // Sort ascending: lowest zIndex rendered first (in back), highest rendered last (in front)
  activeItems.sort((a, b) => a.zIndex - b.zIndex);

  activeItems.forEach(item => {
    if (item.type === 'video' || item.type === 'image') {
      drawMediaLayer(item.clip);
    } else if (item.type === 'text') {
      drawTextLayer(item.clip);
    }
  });
}

// Master Render Loop
let lastFrameTime = performance.now();

function render(now) {
  const delta = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if (isPlaying) {
    const speed = parseFloat(document.getElementById('playback-speed')?.value || '1');
    if (audioPlayer.src && !audioPlayer.paused) {
      currentTime = audioPlayer.currentTime;
    } else {
      currentTime += delta * speed;
      if (currentTime > duration) {
        currentTime = 0;
        isPlaying = false;
        triggeredSFX.clear();
        const playBtn = document.getElementById('btn-play');
        if (playBtn) {
          playBtn.innerHTML = `
            <svg class="ui-icon" id="play-icon" viewBox="0 0 24 24" style="width:12px; height:12px; fill:#fff;"><path d="M8 5v14l11-7z"/></svg>
            <span>Play</span>
          `;
        }
      }
    }
    syncAudioPlayback();

    // Trigger Procedural Sound Effects when playhead enters text animations
    timelineClips.text.forEach(t => {
      if (currentTime >= t.start && currentTime <= (t.start + 0.35)) {
        if (!triggeredSFX.has(t.id)) {
          if (t.sfx && t.sfx !== 'none') {
            playSFX(t.sfx, t.sfxVolume !== undefined ? t.sfxVolume : sfxVolume);
          }
          triggeredSFX.add(t.id);
        }
      }
    });
  }

  // Clear
  ctx.fillStyle = '#0a0b0e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 1. 3D Background Grid
  drawPerspectiveGrid();

  // 2. Layer-Ordered Visual Elements (Media & Kinetic Text arranged by z-index)
  drawSortedVisualLayers();

  // 3. Mystery Silhouette Cutout
  if (fxState.silhouette.enabled) {
    drawSilhouetteOverlay();
  }

  // 4. Fire Particles / Atmosphere
  drawParticles();

  updateUI();
  requestAnimationFrame(render);
}

function syncAudioPlayback() {
  // Voiceover track sync
  const activeVoice = timelineClips.voiceover.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeVoice) {
    if (audioPlayer.src !== activeVoice.file.url) {
      audioPlayer.src = activeVoice.file.url;
    }
    const offset = currentTime - activeVoice.start;
    if (audioPlayer.paused) audioPlayer.play().catch(() => {});
    if (Math.abs(audioPlayer.currentTime - offset) > 0.25) {
      audioPlayer.currentTime = offset;
    }
    audioPlayer.volume = (activeVoice.volume !== undefined ? activeVoice.volume : 100) / 100;
  } else if (audioPlayer.src && !timelineClips.voiceover.length) {
    // If audio is loaded as project background
  }

  // Background music track sync
  const activeMusic = timelineClips.music.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeMusic) {
    if (bgmPlayer.src !== activeMusic.file.url) {
      bgmPlayer.src = activeMusic.file.url;
    }
    const offset = (currentTime - activeMusic.start) % (bgmPlayer.duration || 60);
    if (bgmPlayer.paused) bgmPlayer.play().catch(() => {});
    if (Math.abs(bgmPlayer.currentTime - offset) > 0.25) {
      bgmPlayer.currentTime = offset;
    }
    bgmPlayer.volume = ((activeMusic.volume !== undefined ? activeMusic.volume : 40) / 100);
  } else {
    if (!bgmPlayer.paused) bgmPlayer.pause();
  }
}

function drawSilhouetteOverlay() {
  ctx.save();
  ctx.fillStyle = fxState.silhouette.color === 'white' ? 'rgba(230, 230, 235, 0.92)' : 'rgba(10, 10, 15, 0.95)';
  const rx = canvas.width - 280;
  const ry = canvas.height;
  ctx.beginPath();
  ctx.arc(rx, ry - 380, 50, 0, Math.PI * 2);
  ctx.ellipse(rx, ry - 180, 90, 160, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatTimecode(sec) {
  if (isNaN(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  const ms = Math.floor((sec % 1) * 100).toString().padStart(2, '0');
  return `${m}:${s}.${ms}`;
}

function parseTimecode(val) {
  if (typeof val === 'number') return Math.max(0, val);
  if (!val || typeof val !== 'string') return 0;
  const clean = val.trim();
  if (clean.includes(':')) {
    const parts = clean.split(':');
    if (parts.length === 2) {
      const min = parseFloat(parts[0]) || 0;
      const sec = parseFloat(parts[1]) || 0;
      return Math.max(0, (min * 60) + sec);
    } else if (parts.length === 3) {
      const hrs = parseFloat(parts[0]) || 0;
      const min = parseFloat(parts[1]) || 0;
      const sec = parseFloat(parts[2]) || 0;
      return Math.max(0, (hrs * 3600) + (min * 60) + sec);
    }
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

function updateUI() {
  document.getElementById('timecode').textContent = `${formatTime(currentTime)}.${Math.floor((currentTime % 1) * 100).toString().padStart(2, '0')}`;
  const playhead = document.getElementById('playhead');
  playhead.style.left = `${110 + (currentTime * pps)}px`;

  // Update card progression bar under indicated file
  if (activeMediaFile && duration > 0) {
    const progId = `prog-${encodeURIComponent(activeMediaFile.name).replace(/[^a-zA-Z0-9]/g, '_')}`;
    const progEl = document.getElementById(progId);
    if (progEl) {
      const pct = Math.min(100, Math.max(0, (currentTime / duration) * 100));
      progEl.style.width = `${pct}%`;
    }
  }
}

// Load Media from Backend
let activeMediaFile = null;

async function loadMediaLibrary() {
  const listEl = document.getElementById('media-list');
  try {
    const res = await fetch('/api/media');
    if (!res.ok) throw new Error('Failed to fetch media');
    const data = await res.json();
    mediaFiles = data.files || [];
    renderMediaList(currentFilter);
  } catch (err) {
    listEl.innerHTML = `<div style="padding:10px; color:#ff8888; font-size:12px;">Waiting for connection... Use Upload button above.</div>`;
  }
}

function renderMediaList(filter) {
  const list = document.getElementById('media-list');
  list.innerHTML = '';

  const filtered = mediaFiles.filter(item => {
    if (filter === 'audio') return item.isAudio;
    if (filter === 'video') return item.isVideo;
    if (filter === 'images') return item.isImage;
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div style="padding:14px; text-align:center; color:#888; font-size:12px;">No files found. Click "Upload Files" above to add audio, videos, or images!</div>`;
    return;
  }

  filtered.forEach(file => {
    const el = document.createElement('div');
    el.className = 'media-item';
    el.setAttribute('draggable', 'true');

    let thumbHtml = '';
    if (file.isImage) {
      thumbHtml = `<img src="${file.url}" class="media-thumb" alt="preview">`;
    } else if (file.isVideo) {
      thumbHtml = `<video src="${file.url}#t=0.5" class="media-thumb" muted preload="metadata"></video>`;
    } else {
      thumbHtml = `<div class="media-thumb audio-thumb">
        <span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>
      </div>`;
    }

    let actionBtnHtml = '';
    if (file.isAudio || file.isVideo) {
      actionBtnHtml = `<button class="preview-play-btn" title="Play">
        <svg class="ui-icon" viewBox="0 0 24 24" style="width:10px; height:10px; fill:currentColor;"><path d="M8 5v14l11-7z"/></svg>
      </button>`;
    }

    el.innerHTML = `
      ${thumbHtml}
      <div class="media-item-info">
        <div class="media-item-name" title="${file.name}">${file.name}</div>
        <div class="media-item-sub">${(file.size / (1024 * 1024)).toFixed(1)} MB</div>
      </div>
      ${actionBtnHtml}
      <div class="media-item-progress" id="prog-${encodeURIComponent(file.name).replace(/[^a-zA-Z0-9]/g, '_')}"></div>
    `;

    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('preview-play-btn')) return;
      activeMediaFile = file;
      document.querySelectorAll('.media-item').forEach(m => m.classList.remove('is-active'));
      el.classList.add('is-active');

      if (file.isImage || file.isVideo) {
        activePreviewMedia = file;
      }

      let targetTrack = 'image';
      if (file.isVideo) targetTrack = 'video';
      else if (file.isAudio) targetTrack = 'voiceover';

      addClipToTimeline(targetTrack, file, currentTime, file.duration || (file.isAudio ? 25 : 6));
    });

    const playBtn = el.querySelector('.preview-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (file.isAudio) {
          if (audioPlayer.src === file.url && !audioPlayer.paused) {
            audioPlayer.pause();
          } else {
            audioPlayer.src = file.url;
            audioPlayer.play().catch(() => {});
          }
        }
      });
    }

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('application/json', JSON.stringify(file));
      e.dataTransfer.setData('text/plain', file.name);
      e.dataTransfer.effectAllowed = 'copy';
    });

    list.appendChild(el);
  });
}

// Video Filmstrip Generator
const filmstripCache = new Map();

function generateFilmstrip(videoUrl, clipDuration, containerEl) {
  if (filmstripCache.has(videoUrl)) {
    renderFramesToContainer(filmstripCache.get(videoUrl), containerEl);
    return;
  }

  const v = document.createElement('video');
  v.src = videoUrl;
  v.muted = true;
  v.crossOrigin = 'anonymous';

  v.onloadedmetadata = async () => {
    const totalDuration = v.duration || clipDuration || 10;
    const numFrames = 12;
    const frames = [];

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 120;
    offscreenCanvas.height = 68;
    const octx = offscreenCanvas.getContext('2d');

    for (let i = 0; i < numFrames; i++) {
      const seekTime = Math.min(totalDuration - 0.05, (i / numFrames) * totalDuration + 0.05);
      v.currentTime = seekTime;
      await new Promise(res => {
        const onSeeked = () => {
          v.removeEventListener('seeked', onSeeked);
          octx.drawImage(v, 0, 0, 120, 68);
          frames.push(offscreenCanvas.toDataURL('image/jpeg', 0.5));
          res();
        };
        v.addEventListener('seeked', onSeeked);
      });
    }

    filmstripCache.set(videoUrl, frames);
    renderFramesToContainer(frames, containerEl);
  };
}

function renderFramesToContainer(frames, containerEl) {
  if (!containerEl || !frames || frames.length === 0) return;
  containerEl.innerHTML = '';
  // Repeat frames to ensure full filmstrip coverage across the entire clip length
  const repeatCount = Math.max(1, Math.ceil(containerEl.parentElement?.offsetWidth / (frames.length * 60)) || 2);
  for (let r = 0; r < repeatCount; r++) {
    frames.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'filmstrip-frame';
      img.draggable = false;
      containerEl.appendChild(img);
    });
  }
}

// Add Clip to specific Timeline Track
function addClipToTimeline(trackType, fileOrData, startSec, clipDuration = 6) {
  const clipId = `clip-${trackType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Default layer arrangement & zIndex
  let defaultZ = 10;
  let defaultLayer = 'back';
  if (trackType === 'text') {
    defaultZ = 30;
    defaultLayer = 'front';
  } else if (trackType === 'image') {
    defaultZ = 20;
    defaultLayer = 'back';
  }

  const clip = {
    id: clipId,
    track: trackType,
    start: Math.max(0, startSec),
    duration: Math.max(1, clipDuration),
    file: fileOrData,
    soundEnabled: true,
    volume: 100,
    text: fileOrData?.text,
    highlight: fileOrData?.highlight,
    fontFamily: fileOrData?.fontFamily || "'Inter', sans-serif",
    fontSize: fileOrData?.fontSize || 64,
    textColor: fileOrData?.textColor || '#ffffff',
    highlightColor: fileOrData?.highlightColor || '#ff334b',
    anim: fileOrData?.anim || 'pop',
    sfx: fileOrData?.sfx || 'whoosh',
    position: fileOrData?.position || 'center',
    zIndex: fileOrData?.zIndex !== undefined ? fileOrData.zIndex : defaultZ,
    layerOrder: fileOrData?.layerOrder || defaultLayer
  };

  if (!timelineClips[trackType]) {
    timelineClips[trackType] = [];
  }
  timelineClips[trackType].push(clip);

  if (trackType === 'voiceover') {
    audioPlayer.src = clip.file.url;
    audioPlayer.load();
    audioPlayer.onloadedmetadata = () => {
      duration = Math.max(duration, audioPlayer.duration || 60);
      clip.duration = audioPlayer.duration || clip.duration;
      renderAllTimelineTracks();
      document.getElementById('duration-badge').textContent = `00:00 / ${formatTime(duration)}`;
    };
  } else if (trackType === 'music') {
    bgmPlayer.src = clip.file.url;
    bgmPlayer.load();
  }

  selectClip(clip, trackType);
  renderAllTimelineTracks();
  if (trackType === 'text') renderAllTextsOverview();
  return clip;
}

// Render all clips onto timeline DOM
function renderAllTimelineTracks() {
  const trackMap = {
    text: document.getElementById('content-text'),
    image: document.getElementById('content-image'),
    video: document.getElementById('content-video'),
    voiceover: document.getElementById('content-audio'),
    music: document.getElementById('content-music')
  };

  Object.keys(trackMap).forEach(type => {
    const container = trackMap[type];
    if (!container) return;
    container.innerHTML = '';

    const clips = timelineClips[type] || [];
    clips.forEach(clip => {
      const block = document.createElement('div');
      block.className = `clip-block ${type}`;
      block.id = clip.id;
      if (selectedClip && selectedClip.clip.id === clip.id) block.classList.add('is-selected');

      const leftPx = clip.start * pps;
      const widthPx = clip.duration * pps;
      block.style.left = `${leftPx}px`;
      block.style.width = `${widthPx}px`;

      let iconSvg = '';
      if (type === 'image') {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
      } else if (type === 'video') {
        const audioBadge = clip.soundEnabled
          ? `<svg class="clip-icon" viewBox="0 0 24 24" style="width:10px;height:10px;margin-left:2px;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`
          : `<svg class="clip-icon" viewBox="0 0 24 24" style="width:10px;height:10px;margin-left:2px;opacity:0.6;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>${audioBadge}`;
      } else if (type === 'voiceover') {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>`;
      } else if (type === 'music') {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
      } else if (type === 'text') {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>`;
      }

      const label = clip.file?.name || clip.text || 'Clip';

      // Left & Right Resize Handles
      const handleLeft = document.createElement('div');
      handleLeft.className = 'clip-handle clip-handle-left';

      const handleRight = document.createElement('div');
      handleRight.className = 'clip-handle clip-handle-right';

      // Content wrapper
      const contentEl = document.createElement('div');
      contentEl.className = 'clip-block-content';
      contentEl.innerHTML = `${iconSvg} <span>${label}</span>`;

      // Video Filmstrip Background
      if (type === 'video' && clip.file?.url) {
        const filmstripEl = document.createElement('div');
        filmstripEl.className = 'clip-filmstrip';
        block.appendChild(filmstripEl);
        generateFilmstrip(clip.file.url, clip.duration, filmstripEl);
      }

      block.appendChild(handleLeft);
      block.appendChild(contentEl);
      block.appendChild(handleRight);

      // Clip Interactions
      attachClipInteractions(block, clip, type);

      container.appendChild(block);

      // Plus (+) Button right after this clip with clean spacing
      const addBtn = document.createElement('button');
      addBtn.className = 'timeline-add-clip-btn';
      addBtn.title = `Add another ${type === 'text' ? 'kinetic text' : type} here`;
      addBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
      const clipEndSec = clip.start + clip.duration;
      addBtn.style.left = `${clipEndSec * pps + 14}px`;
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleTimelineAddButtonClick(type, clipEndSec + 0.1, addBtn);
      });
      container.appendChild(addBtn);
    });
  });
}

// Global handler for tapping timeline (+) button
function handleTimelineAddButtonClick(trackType, atTimeSec, triggerEl) {
  if (trackType === 'text') {
    // Prompt or directly open text editor for new text clip at this exact time
    const newClip = createNewTextClipAtTime(atTimeSec);
    seekToTime(atTimeSec);
    showTextTimingAlert(`New kinetic text added at ${formatTimecode(atTimeSec)}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  } else {
    // Open quick media picker popover or prompt file upload
    openTrackMediaPicker(trackType, atTimeSec, triggerEl);
  }
}

// Helper to create and insert a distinct new text clip
function createNewTextClipAtTime(startSec, customText = 'New Kinetic Text', customHighlight = '') {
  const font = document.getElementById('text-font')?.value || "'Inter', sans-serif";
  const size = parseInt(document.getElementById('text-size')?.value) || 64;
  const color = document.getElementById('text-color')?.value || '#ffffff';
  const hlColor = document.getElementById('text-highlight-color')?.value || '#ff334b';
  const anim = document.getElementById('text-anim')?.value || 'pop';
  const sfx = document.getElementById('text-sfx')?.value || 'whoosh';
  const zIdx = textLayerOrder === 'front' ? 30 : 5;

  const newClip = addClipToTimeline('text', {
    text: customText,
    highlight: customHighlight,
    fontFamily: font,
    fontSize: size,
    textColor: color,
    highlightColor: hlColor,
    anim,
    sfx,
    position: textPos,
    zIndex: zIdx,
    layerOrder: textLayerOrder
  }, startSec, 4.0);

  recordState('Add New Text Clip');
  return newClip;
}

// Quick Media Picker Popover when clicking (+) on media tracks
function openTrackMediaPicker(trackType, atTimeSec, triggerEl) {
  // Remove existing popover if any
  document.querySelectorAll('.track-media-picker-popover').forEach(p => p.remove());

  const popover = document.createElement('div');
  popover.className = 'track-media-picker-popover';

  const filterFiles = mediaFiles.filter(item => {
    if (trackType === 'image') return item.isImage;
    if (trackType === 'video') return item.isVideo;
    if (trackType === 'voiceover' || trackType === 'music') return item.isAudio;
    return true;
  });

  const header = document.createElement('div');
  header.className = 'track-media-picker-header';
  header.innerHTML = `<span>Add to ${trackType}</span><span style="cursor:pointer; color:#ff6b7e; font-size:14px; line-height:1;" id="close-media-popover">&times;</span>`;
  popover.appendChild(header);

  const list = document.createElement('div');
  list.className = 'track-media-picker-list';

  if (filterFiles.length === 0) {
    list.innerHTML = `<div class="track-media-picker-empty">No ${trackType} files uploaded.<br><button class="btn btn-primary btn-sm" id="btn-picker-upload" style="margin-top:6px; font-size:11px; padding:3px 8px;">Upload Media</button></div>`;
  } else {
    filterFiles.forEach(file => {
      const itemEl = document.createElement('div');
      itemEl.className = 'track-media-picker-item';
      itemEl.innerHTML = `
        <svg class="ui-icon" viewBox="0 0 24 24" style="width:12px; height:12px; flex-shrink:0;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${file.name}</span>
      `;
      itemEl.addEventListener('click', () => {
        addClipToTimeline(trackType, file, atTimeSec, file.duration || (file.isAudio ? 25 : 6));
        seekToTime(atTimeSec);
        recordState(`Add ${trackType} Clip`);
        popover.remove();
      });
      list.appendChild(itemEl);
    });
  }

  popover.appendChild(list);
  document.body.appendChild(popover);

  // Position popover relative to trigger button
  const rect = triggerEl.getBoundingClientRect();
  popover.style.left = `${Math.min(window.innerWidth - 270, Math.max(10, rect.left - 40))}px`;
  popover.style.top = `${Math.max(10, rect.top - 120)}px`;

  // Close listeners
  popover.querySelector('#close-media-popover')?.addEventListener('click', () => popover.remove());
  popover.querySelector('#btn-picker-upload')?.addEventListener('click', () => {
    popover.remove();
    document.getElementById('file-input')?.click();
  });

  const onDocClick = (e) => {
    if (!popover.contains(e.target) && e.target !== triggerEl) {
      popover.remove();
      document.removeEventListener('click', onDocClick);
    }
  };
  setTimeout(() => document.addEventListener('click', onDocClick), 50);
}

// Select Clip and update Inspector and Text panels
function selectClip(clip, trackType) {
  selectedClip = { clip, trackType };
  document.querySelectorAll('.clip-block').forEach(b => b.classList.remove('is-selected'));
  const el = document.getElementById(clip.id);
  if (el) el.classList.add('is-selected');

  if (clip.file) activePreviewMedia = clip.file;

  const inspector = document.getElementById('card-clip-inspector');
  const videoAudioSection = document.getElementById('inspector-video-audio-section');
  const volumeRow = document.getElementById('inspector-volume-row');
  const layerSection = document.getElementById('inspector-layer-section');
  const layerBadge = document.getElementById('inspector-layer-badge');

  if (trackType === 'text') {
    // Populate text editor panel
    document.getElementById('text-input').value = clip.text || '';
    document.getElementById('text-highlight').value = clip.highlight || '';
    document.getElementById('text-font').value = clip.fontFamily || "'Inter', sans-serif";
    document.getElementById('text-size').value = clip.fontSize || 64;
    document.getElementById('text-size-val').textContent = `${clip.fontSize || 64}px`;
    document.getElementById('text-color').value = clip.textColor || '#ffffff';
    document.getElementById('text-highlight-color').value = clip.highlightColor || '#ff334b';
    document.getElementById('text-anim').value = clip.anim || 'pop';
    const sfxEl = document.getElementById('text-sfx');
    if (sfxEl) sfxEl.value = clip.sfx || 'whoosh';

    // Populate per-clip SFX volume slider
    const sfxVolSlider = document.getElementById('text-sfx-volume');
    const sfxVolLabel = document.getElementById('text-sfx-vol-val');
    const clipSfxVol = clip.sfxVolume !== undefined ? clip.sfxVolume : sfxVolume;
    if (sfxVolSlider) sfxVolSlider.value = Math.round(clipSfxVol * 100);
    if (sfxVolLabel) sfxVolLabel.textContent = `${Math.round(clipSfxVol * 100)}%`;

    // Manual start and duration time values for Text
    const textStartEl = document.getElementById('text-start-input');
    const textDurEl = document.getElementById('text-dur-input');
    if (textStartEl) textStartEl.value = formatTimecode(clip.start);
    if (textDurEl) textDurEl.value = formatTimecode(clip.duration);

    // Position buttons
    ['center', 'bottom', 'top'].forEach(p => {
      const btn = document.getElementById(`btn-text-pos-${p}`);
      if (btn) btn.classList.toggle('active', (clip.position || 'center') === p);
    });

    // Text Layer Order buttons
    const isFront = (clip.layerOrder || 'front') === 'front';
    document.getElementById('btn-text-layer-front')?.classList.toggle('active', isFront);
    document.getElementById('btn-text-layer-back')?.classList.toggle('active', !isFront);

    // Update All Texts overview active state
    renderAllTextsOverview();

    // Check if selected text clip has any timing conflicts with other text clips
    const conflicts = checkTextTimingConflict(clip.id, clip.start, clip.duration);
    if (conflicts.length > 0) {
      showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
    } else {
      showTextTimingAlert('');
    }

    document.getElementById('btn-update-text').style.display = 'block';
    document.getElementById('btn-delete-text').style.display = 'block';
    inspector.style.display = 'none';

    // Highlight text editor card and scroll it into view
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) {
      textEditorCard.style.display = 'block';
      textEditorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else {
    // Show clip inspector card
    inspector.style.display = 'block';
    document.getElementById('inspector-clip-type').textContent = trackType.toUpperCase();
    document.getElementById('inspector-clip-name').textContent = clip.file?.name || 'Clip';
    
    // Dynamic Mini Preview in Sidebar Inspector
    const miniThumb = document.getElementById('inspector-mini-thumb');
    const miniSub = document.getElementById('inspector-clip-sub');
    if (miniThumb) {
      if (trackType === 'image' && clip.file?.url) {
        miniThumb.innerHTML = `<img src="${clip.file.url}" style="width:100%; height:100%; object-fit:cover;">`;
        if (miniSub) miniSub.textContent = `Image • ${((clip.scale || 1) * 100).toFixed(0)}% zoom • Drag on canvas to edit`;
      } else if (trackType === 'video' && clip.file?.url) {
        miniThumb.innerHTML = `<video src="${clip.file.url}" style="width:100%; height:100%; object-fit:cover;" muted></video>`;
        if (miniSub) miniSub.textContent = `Video • ${clip.soundEnabled ? 'Audio On' : 'Muted'} • ${clip.duration.toFixed(1)}s`;
      } else if (trackType === 'voiceover' || trackType === 'music') {
        miniThumb.innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" style="width:20px;height:20px;fill:var(--accent-red);"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
        if (miniSub) miniSub.textContent = `${trackType.toUpperCase()} • ${clip.duration.toFixed(1)}s`;
      }
    }

    // Populate editable start and duration inputs
    const startInput = document.getElementById('inspector-start-input');
    const durInput = document.getElementById('inspector-dur-input');
    if (startInput) startInput.value = formatTimecode(clip.start);
    if (durInput) durInput.value = formatTimecode(clip.duration);

    if (trackType === 'video') {
      videoAudioSection.style.display = 'block';
      document.getElementById('inspector-video-sound').checked = clip.soundEnabled !== false;
    } else {
      videoAudioSection.style.display = 'none';
    }

    if (trackType === 'video' || trackType === 'voiceover' || trackType === 'music') {
      volumeRow.style.display = 'block';
      const vol = clip.volume !== undefined ? clip.volume : 100;
      document.getElementById('inspector-volume').value = vol;
      document.getElementById('inspector-volume-val').textContent = `${vol}%`;
    } else {
      volumeRow.style.display = 'none';
    }

    // Media Layer Order (Send to Back / Bring to Front)
    if (trackType === 'image' || trackType === 'video') {
      if (layerSection) layerSection.style.display = 'block';
      const isFront = (clip.layerOrder === 'front');
      if (layerBadge) {
        layerBadge.textContent = isFront ? 'In Front of Text' : 'Behind Text';
        layerBadge.style.color = isFront ? '#00f0ff' : 'var(--accent-red)';
      }
    } else {
      if (layerSection) layerSection.style.display = 'none';
    }

    document.getElementById('btn-update-text').style.display = 'none';
    document.getElementById('btn-delete-text').style.display = 'none';

    // Scroll inspector into view in sidebar
    inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Clip Mouse Interaction: Dragging to Move & Resizing Duration
function attachClipInteractions(blockEl, clip, trackType) {
  blockEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      recordState('Delete Clip');
      deleteClip(trackType, clip.id);
      return;
    }
    if (activeTool === 'split') {
      splitClipAtPlayhead(trackType, clip);
      return;
    }
    selectClip(clip, trackType);
    if (activeTool === 'select') {
      seekToTime(clip.start);
    }
  });

  // Move clip horizontally by dragging
  blockEl.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('clip-handle')) return;
    if (activeTool !== 'select') return;

    e.preventDefault();
    const startX = e.clientX;
    const initialStart = clip.start;
    blockEl.classList.add('is-dragging');

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSec = deltaX / pps;
      clip.start = Math.max(0, initialStart + deltaSec);
      blockEl.style.left = `${clip.start * pps}px`;
      // Update live timecode inputs if this clip is selected
      if (selectedClip && selectedClip.clip.id === clip.id) {
        const si = document.getElementById('inspector-start-input');
        const tsi = document.getElementById('text-start-input');
        if (si) si.value = formatTimecode(clip.start);
        if (tsi) tsi.value = formatTimecode(clip.start);
        if (trackType === 'text') {
          const conflicts = checkTextTimingConflict(clip.id, clip.start, clip.duration);
          if (conflicts.length > 0) {
            showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
          } else {
            showTextTimingAlert('');
          }
        }
      }
    };

    const onMouseUp = () => {
      blockEl.classList.remove('is-dragging');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      recordState('Move Clip');
      renderAllTimelineTracks();
      if (trackType === 'text') {
        renderAllTextsOverview();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // Resize Left Edge (trim start)
  const leftHandle = blockEl.querySelector('.clip-handle-left');
  leftHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const initialStart = clip.start;
    const initialDuration = clip.duration;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSec = deltaX / pps;
      const newStart = Math.max(0, initialStart + deltaSec);
      const newDuration = Math.max(0.5, initialDuration - (newStart - initialStart));
      clip.start = newStart;
      clip.duration = newDuration;
      blockEl.style.left = `${clip.start * pps}px`;
      blockEl.style.width = `${clip.duration * pps}px`;
      if (selectedClip && selectedClip.clip.id === clip.id) {
        const si = document.getElementById('inspector-start-input');
        const di = document.getElementById('inspector-dur-input');
        const tsi = document.getElementById('text-start-input');
        const tdi = document.getElementById('text-dur-input');
        if (si) si.value = formatTimecode(clip.start);
        if (di) di.value = formatTimecode(clip.duration);
        if (tsi) tsi.value = formatTimecode(clip.start);
        if (tdi) tdi.value = formatTimecode(clip.duration);
        if (trackType === 'text') {
          const conflicts = checkTextTimingConflict(clip.id, clip.start, clip.duration);
          if (conflicts.length > 0) {
            showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
          } else {
            showTextTimingAlert('');
          }
        }
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      recordState('Trim Clip Start');
      renderAllTimelineTracks();
      if (trackType === 'text') {
        renderAllTextsOverview();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // Resize Right Edge (trim end)
  const rightHandle = blockEl.querySelector('.clip-handle-right');
  rightHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const initialDuration = clip.duration;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSec = deltaX / pps;
      clip.duration = Math.max(0.5, initialDuration + deltaSec);
      blockEl.style.width = `${clip.duration * pps}px`;
      if (selectedClip && selectedClip.clip.id === clip.id) {
        const di = document.getElementById('inspector-dur-input');
        const tdi = document.getElementById('text-dur-input');
        if (di) di.value = formatTimecode(clip.duration);
        if (tdi) tdi.value = formatTimecode(clip.duration);
        if (trackType === 'text') {
          const conflicts = checkTextTimingConflict(clip.id, clip.start, clip.duration);
          if (conflicts.length > 0) {
            showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
          } else {
            showTextTimingAlert('');
          }
        }
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      recordState('Trim Clip End');
      renderAllTimelineTracks();
      if (trackType === 'text') {
        renderAllTextsOverview();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });
}

function deleteClip(trackType, clipId) {
  if (timelineClips[trackType]) {
    timelineClips[trackType] = timelineClips[trackType].filter(c => c.id !== clipId);
    if (selectedClip && selectedClip.clip.id === clipId) {
      selectedClip = null;
      document.getElementById('card-clip-inspector').style.display = 'none';
      document.getElementById('btn-update-text').style.display = 'none';
      document.getElementById('btn-delete-text').style.display = 'none';
    }
    renderAllTimelineTracks();
    if (trackType === 'text') renderAllTextsOverview();
  }
}

function splitClipAtPlayhead(trackType, clip) {
  if (currentTime > clip.start && currentTime < (clip.start + clip.duration)) {
    const originalEnd = clip.start + clip.duration;
    clip.duration = currentTime - clip.start;
    const secondHalf = {
      ...clip,
      id: `clip-${trackType}-${Date.now()}`,
      start: currentTime,
      duration: originalEnd - currentTime
    };
    timelineClips[trackType].push(secondHalf);
    renderAllTimelineTracks();
  }
}

// Setup Drag & Drop Listeners onto Track Rows
function initTimelineDragAndDrop() {
  const tracks = document.querySelectorAll('.timeline-tracks .track');
  tracks.forEach(trackEl => {
    trackEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      trackEl.classList.add('track-drag-over');
      e.dataTransfer.dropEffect = 'copy';
    });

    trackEl.addEventListener('dragleave', () => {
      trackEl.classList.remove('track-drag-over');
    });

    trackEl.addEventListener('drop', (e) => {
      e.preventDefault();
      trackEl.classList.remove('track-drag-over');
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;

      try {
        const file = JSON.parse(dataStr);
        const rect = trackEl.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const dropSec = Math.max(0, dropX / pps);

        let targetType = trackEl.dataset.trackType || 'video';
        if (targetType === 'image' && file.isVideo) targetType = 'video';
        if (targetType === 'video' && file.isImage) targetType = 'image';
        if ((targetType === 'voiceover' || targetType === 'music') && (file.isImage || file.isVideo)) {
          targetType = file.isVideo ? 'video' : 'image';
        }

        addClipToTimeline(targetType, file, dropSec, file.duration || (file.isAudio ? 25 : 6));
      } catch(err) {
        console.error('Drop error:', err);
      }
    });
  });
}

// Timeline Header Tools
document.querySelectorAll('.timeline-tools .btn-tool').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.timeline-tools .btn-tool').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.id === 'tool-select') activeTool = 'select';
    else if (btn.id === 'tool-split') activeTool = 'split';
    else if (btn.id === 'tool-delete') activeTool = 'delete';
  });
});

// ==================== VISUAL TIMELINE RULER (TICKS & TIMECODE LABELS) ====================
function drawTimeRuler() {
  const rulerCanvas = document.getElementById('ruler-canvas');
  const tracksContainer = document.getElementById('timeline-tracks');
  if (!rulerCanvas || !tracksContainer) return;

  const totalWidth = 5000;
  if (rulerCanvas.width !== totalWidth) {
    rulerCanvas.width = totalWidth;
  }
  const height = rulerCanvas.height || 24;
  const ctxR = rulerCanvas.getContext('2d');
  ctxR.clearRect(0, 0, totalWidth, height);

  // Determine major tick interval depending on zoom level (pps)
  let majorIntervalSec = 5;
  let minorTicksPerMajor = 5;
  if (pps >= 45) {
    majorIntervalSec = 1;
    minorTicksPerMajor = 4;
  } else if (pps >= 25) {
    majorIntervalSec = 2;
    minorTicksPerMajor = 4;
  } else if (pps >= 10) {
    majorIntervalSec = 5;
    minorTicksPerMajor = 5;
  } else {
    majorIntervalSec = 10;
    minorTicksPerMajor = 5;
  }

  const minorIntervalSec = majorIntervalSec / minorTicksPerMajor;
  const maxSec = totalWidth / pps;

  ctxR.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctxR.fillStyle = '#8e96aa';
  ctxR.strokeStyle = '#2d3345';
  ctxR.lineWidth = 1;

  for (let s = 0; s <= maxSec; s += minorIntervalSec) {
    const x = Math.round(s * pps);
    const isMajor = Math.abs(Math.round(s / majorIntervalSec) * majorIntervalSec - s) < 0.001;

    ctxR.beginPath();
    if (isMajor) {
      ctxR.strokeStyle = '#5a6480';
      ctxR.moveTo(x + 0.5, height - 10);
      ctxR.lineTo(x + 0.5, height);
      ctxR.stroke();

      const timeLabel = formatTime(s);
      ctxR.fillText(timeLabel, x + 3, 11);
    } else {
      ctxR.strokeStyle = '#32394c';
      ctxR.moveTo(x + 0.5, height - 5);
      ctxR.lineTo(x + 0.5, height);
      ctxR.stroke();
    }
  }
}

// Timeline Zoom Slider
const zoomSlider = document.getElementById('timeline-zoom');
if (zoomSlider) {
  zoomSlider.addEventListener('input', (e) => {
    const zoomVal = parseFloat(e.target.value);
    pps = 15 * zoomVal;
    drawTimeRuler();
    renderAllTimelineTracks();
    const playhead = document.getElementById('playhead');
    playhead.style.left = `${110 + (currentTime * pps)}px`;
  });
}

// ==================== INTERACTIVE TIMELINE SCRUBBING & SEEKING ====================
let isScrubbing = false;

function seekToTime(targetSec) {
  currentTime = Math.max(0, Math.min(duration, targetSec));
  triggeredSFX.clear();

  if (audioPlayer.src) {
    audioPlayer.currentTime = currentTime;
  }
  if (bgmPlayer.src) {
    bgmPlayer.currentTime = currentTime;
  }

  // Real-time video frame scrubbing
  const activeVideoClip = timelineClips.video.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeVideoClip && activeVideoClip.file) {
    const el = getMediaElement(activeVideoClip.file);
    if (el && el.duration) {
      el.currentTime = (currentTime - activeVideoClip.start) % el.duration;
    }
  }

  // Auto-sync text in sidebar if scrubbing across text clips and not currently editing a specific clip
  const activeText = timelineClips.text.find(t => currentTime >= t.start && currentTime <= (t.start + t.duration));
  if (activeText && (!selectedClip || selectedClip.trackType === 'text')) {
    const textStartEl = document.getElementById('text-start-input');
    const textDurEl = document.getElementById('text-dur-input');
    const textInputEl = document.getElementById('text-input');
    const highlightEl = document.getElementById('text-highlight');
    if (textStartEl && document.activeElement !== textStartEl) textStartEl.value = formatTimecode(activeText.start);
    if (textDurEl && document.activeElement !== textDurEl) textDurEl.value = formatTimecode(activeText.duration);
    if (textInputEl && document.activeElement !== textInputEl) textInputEl.value = activeText.text || '';
    if (highlightEl && document.activeElement !== highlightEl) highlightEl.value = activeText.highlight || '';
    const conflicts = checkTextTimingConflict(activeText.id, activeText.start, activeText.duration);
    if (conflicts.length > 0) {
      showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
    } else {
      showTextTimingAlert('');
    }
  }

  updateUI();
}

function initPlayheadScrubbing() {
  const playhead = document.getElementById('playhead');
  const tracksContainer = document.getElementById('timeline-tracks');
  if (!playhead || !tracksContainer) return;

  const onScrubMove = (e) => {
    if (!isScrubbing) return;
    const rect = tracksContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 110 + tracksContainer.scrollLeft;
    seekToTime(clickX / pps);
  };

  const onScrubUp = () => {
    if (isScrubbing) {
      isScrubbing = false;
      document.body.style.cursor = '';
      playhead.querySelector('.playhead-handle')?.classList.remove('is-scrubbing');
      window.removeEventListener('mousemove', onScrubMove);
      window.removeEventListener('mouseup', onScrubUp);
    }
  };

  // Dragging the playhead directly
  playhead.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isScrubbing = true;
    document.body.style.cursor = 'ew-resize';
    playhead.querySelector('.playhead-handle')?.classList.add('is-scrubbing');
    window.addEventListener('mousemove', onScrubMove);
    window.addEventListener('mouseup', onScrubUp);
  });

  // Clicking and dragging anywhere on the timeline tracks background
  tracksContainer.addEventListener('mousedown', (e) => {
    if (e.target.closest('.clip-block') || e.target.closest('.track-label')) return;
    isScrubbing = true;
    document.body.style.cursor = 'ew-resize';
    playhead.querySelector('.playhead-handle')?.classList.add('is-scrubbing');

    const rect = tracksContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 110 + tracksContainer.scrollLeft;
    if (clickX >= 0) {
      seekToTime(clickX / pps);
    }

    window.addEventListener('mousemove', onScrubMove);
    window.addEventListener('mouseup', onScrubUp);
  });

  // Clicking and dragging directly on the Time Ruler
  const rulerEl = document.getElementById('timeline-ruler');
  if (rulerEl) {
    const onRulerMove = (e) => {
      if (!isScrubbing) return;
      const rect = rulerEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left + tracksContainer.scrollLeft;
      seekToTime(clickX / pps);
    };

    const onRulerUp = () => {
      if (isScrubbing) {
        isScrubbing = false;
        document.body.style.cursor = '';
        playhead.querySelector('.playhead-handle')?.classList.remove('is-scrubbing');
        window.removeEventListener('mousemove', onRulerMove);
        window.removeEventListener('mouseup', onRulerUp);
      }
    };

    rulerEl.addEventListener('mousedown', (e) => {
      isScrubbing = true;
      document.body.style.cursor = 'ew-resize';
      playhead.querySelector('.playhead-handle')?.classList.add('is-scrubbing');
      const rect = rulerEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left + tracksContainer.scrollLeft;
      seekToTime(clickX / pps);
      window.addEventListener('mousemove', onRulerMove);
      window.addEventListener('mouseup', onRulerUp);
    });
  }

  // Synchronize horizontal scroll between timeline-tracks and ruler-canvas
  const rulerCanvas = document.getElementById('ruler-canvas');
  tracksContainer.addEventListener('scroll', () => {
    if (rulerCanvas) {
      rulerCanvas.style.transform = `translateX(-${tracksContainer.scrollLeft}px)`;
    }
  });
}

// Batch File Upload Handler
async function uploadFiles(files) {
  if (!files || files.length === 0) return;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const listEl = document.getElementById('media-list');
  listEl.innerHTML = `<div style="padding:14px; text-align:center; color:#ff9800; font-size:12px;">Uploading ${files.length} file(s)...</div>`;

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      await loadMediaLibrary();
    }
  } catch (err) {
    alert('Upload failed: ' + err.message);
    loadMediaLibrary();
  }
}

// Media Tab buttons
document.querySelectorAll('.media-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.media-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.tab;
    renderMediaList(currentFilter);
  });
});

// File input change handler
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    uploadFiles(e.target.files);
  }
});

// Drag and drop onto upload box
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    uploadFiles(e.dataTransfer.files);
  }
});

// Controls & Playback Listeners
document.getElementById('btn-play').addEventListener('click', () => {
  isPlaying = !isPlaying;
  const btn = document.getElementById('btn-play');
  if (isPlaying) {
    btn.innerHTML = `
      <svg class="ui-icon" viewBox="0 0 24 24" style="width:12px; height:12px; fill:#fff;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      <span>Pause</span>
    `;
    if (audioPlayer.src) {
      audioPlayer.currentTime = currentTime;
      audioPlayer.play().catch(() => {});
    }
  } else {
    btn.innerHTML = `
      <svg class="ui-icon" id="play-icon" viewBox="0 0 24 24" style="width:12px; height:12px; fill:#fff;"><path d="M8 5v14l11-7z"/></svg>
      <span>Play</span>
    `;
    if (audioPlayer.src) audioPlayer.pause();
    if (!bgmPlayer.paused) bgmPlayer.pause();
  }
});

document.getElementById('btn-stop')?.addEventListener('click', () => {
  isPlaying = false;
  currentTime = 0;
  const btn = document.getElementById('btn-play');
  if (btn) {
    btn.innerHTML = `
      <svg class="ui-icon" id="play-icon" viewBox="0 0 24 24" style="width:12px; height:12px; fill:#fff;"><path d="M8 5v14l11-7z"/></svg>
      <span>Play</span>
    `;
  }
  if (audioPlayer.src) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
  if (!bgmPlayer.paused) {
    bgmPlayer.pause();
    bgmPlayer.currentTime = 0;
  }
});

document.getElementById('playback-speed')?.addEventListener('change', (e) => {
  const speed = parseFloat(e.target.value);
  if (audioPlayer.src) audioPlayer.playbackRate = speed;
  if (bgmPlayer.src) bgmPlayer.playbackRate = speed;
});

document.getElementById('btn-rewind').addEventListener('click', () => {
  seekToTime(currentTime - 5);
});

document.getElementById('btn-forward').addEventListener('click', () => {
  seekToTime(currentTime + 5);
});

// FX Toggle Handlers
document.getElementById('fx-grid-enable').addEventListener('change', (e) => {
  fxState.grid.enabled = e.target.checked;
});
document.getElementById('fx-grid-depth').addEventListener('input', (e) => {
  fxState.grid.depth = parseInt(e.target.value);
});
document.getElementById('fx-grid-opacity').addEventListener('input', (e) => {
  fxState.grid.opacity = parseInt(e.target.value) / 100;
});
document.getElementById('fx-vignette').addEventListener('input', (e) => {
  fxState.grid.vignette = parseInt(e.target.value) / 100;
});

document.getElementById('fx-particles-enable').addEventListener('change', (e) => {
  fxState.particles.enabled = e.target.checked;
});
document.getElementById('fx-particles-count').addEventListener('input', (e) => {
  fxState.particles.count = parseInt(e.target.value);
});
document.getElementById('fx-fire-glow').addEventListener('input', (e) => {
  fxState.particles.glow = parseInt(e.target.value) / 100;
});

document.getElementById('fx-silhouette-enable').addEventListener('change', (e) => {
  fxState.silhouette.enabled = e.target.checked;
});
document.getElementById('btn-sil-white').addEventListener('click', (e) => {
  fxState.silhouette.color = 'white';
  e.target.classList.add('active');
  document.getElementById('btn-sil-black').classList.remove('active');
});
document.getElementById('btn-sil-black').addEventListener('click', (e) => {
  fxState.silhouette.color = 'black';
  e.target.classList.add('active');
  document.getElementById('btn-sil-white').classList.remove('active');
});

// ==================== LIVE MICROPHONE VOICEOVER RECORDING ====================
let mediaRecorder = null;
let recordedAudioChunks = [];
let recordStartTime = 0;
let isRecordingVoice = false;
let recordingStream = null;
let recordingTimerInterval = null;
let recordingElapsedSecs = 0;

function startRecordingTimer(btn) {
  recordingElapsedSecs = 0;
  recordingTimerInterval = setInterval(() => {
    recordingElapsedSecs++;
    const m = Math.floor(recordingElapsedSecs / 60).toString().padStart(2, '0');
    const s = (recordingElapsedSecs % 60).toString().padStart(2, '0');
    const labelEl = btn.querySelector('span');
    if (labelEl) labelEl.textContent = `Stop Recording  ${m}:${s}`;
  }, 1000);
}

function stopRecordingTimer() {
  if (recordingTimerInterval) {
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = null;
  }
}

const btnRecordVoice = document.getElementById('btn-record-voiceover');
if (btnRecordVoice) {
  btnRecordVoice.addEventListener('click', async () => {
    if (!isRecordingVoice) {
      try {
        recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(recordingStream);
        recordedAudioChunks = [];
        recordStartTime = currentTime;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedAudioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          stopRecordingTimer();
          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(recordedAudioChunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          const tempAudio = new Audio(audioUrl);

          tempAudio.onloadedmetadata = () => {
            const recordedDur = Math.max(1, tempAudio.duration || 5);
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '-');
            const recFile = {
              name: `Mic_Recording_${timeStr}.webm`,
              url: audioUrl,
              isAudio: true,
              size: audioBlob.size,
              duration: recordedDur
            };

            mediaFiles.unshift(recFile);
            renderMediaList(currentFilter);
            recordState('Add Recorded Voiceover');
            addClipToTimeline('voiceover', recFile, recordStartTime, recordedDur);
          };

          if (recordingStream) {
            recordingStream.getTracks().forEach(track => track.stop());
            recordingStream = null;
          }
        };

        mediaRecorder.start();
        isRecordingVoice = true;
        btnRecordVoice.classList.add('is-recording');
        btnRecordVoice.innerHTML = `
          <svg class="ui-icon" viewBox="0 0 24 24" style="fill:#ff334b;"><circle cx="12" cy="12" r="8"/></svg>
          <span>Stop Recording  00:00</span>
        `;
        startRecordingTimer(btnRecordVoice);
      } catch (err) {
        alert('Microphone access denied or unavailable: ' + err.message);
      }
    } else {
      stopRecordingTimer();
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      isRecordingVoice = false;
      btnRecordVoice.classList.remove('is-recording');
      btnRecordVoice.innerHTML = `
        <svg class="ui-icon" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
        <span>Record Voiceover</span>
      `;
    }
  });
}

// Auto load voiceover button
document.getElementById('btn-snap-audio').addEventListener('click', () => {
  const targetAudio = mediaFiles.find(f => f.name.includes('Android') && f.isAudio);
  if (targetAudio) {
    addClipToTimeline('voiceover', targetAudio, 0, 368);
  } else {
    alert('Audio file not found in library. Use the Upload Files button to select it!');
  }
});

// ==================== CLIP INSPECTOR & VIDEO AUDIO CONTROLS ====================

// Manual Exact Start & Duration Timing for Inspector Clips
document.getElementById('inspector-start-input')?.addEventListener('change', (e) => {
  if (selectedClip && selectedClip.clip) {
    const newStart = parseTimecode(e.target.value);
    selectedClip.clip.start = newStart;
    e.target.value = formatTimecode(newStart);
    renderAllTimelineTracks();
    recordState('Edit Clip Start Time');
  }
});

document.getElementById('inspector-dur-input')?.addEventListener('change', (e) => {
  if (selectedClip && selectedClip.clip) {
    const newDur = Math.max(0.5, parseTimecode(e.target.value));
    selectedClip.clip.duration = newDur;
    e.target.value = formatTimecode(newDur);
    renderAllTimelineTracks();
    recordState('Edit Clip Duration');
  }
});

// ==================== CLIP INSPECTOR & VIDEO AUDIO CONTROLS ====================

// Video Sound toggle
document.getElementById('inspector-video-sound')?.addEventListener('change', (e) => {
  if (selectedClip && selectedClip.trackType === 'video') {
    selectedClip.clip.soundEnabled = e.target.checked;
    renderAllTimelineTracks();
    recordState('Toggle Video Sound');
  }
});

// Use Video Audio as Main Voiceover
document.getElementById('btn-extract-voiceover')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip.file) {
    const videoFile = selectedClip.clip.file;
    addClipToTimeline('voiceover', videoFile, selectedClip.clip.start, selectedClip.clip.duration);
    alert(`Added audio track from "${videoFile.name}" to Voiceover track!`);
  }
});

// Clip Volume Slider
document.getElementById('inspector-volume')?.addEventListener('input', (e) => {
  const vol = parseInt(e.target.value);
  document.getElementById('inspector-volume-val').textContent = `${vol}%`;
  if (selectedClip) {
    selectedClip.clip.volume = vol;
  }
});
document.getElementById('inspector-volume')?.addEventListener('change', () => {
  recordState('Change Volume');
});

// Layer Ordering Controls (Send to Back / Bring to Front)
document.getElementById('btn-layer-back')?.addEventListener('click', () => {
  if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    selectedClip.clip.layerOrder = 'back';
    selectedClip.clip.zIndex = 10;
    const badge = document.getElementById('inspector-layer-badge');
    if (badge) {
      badge.textContent = 'Behind Text';
      badge.style.color = 'var(--accent-red)';
    }
    renderAllTimelineTracks();
    recordState('Send Clip to Back');
  }
});

document.getElementById('btn-layer-front')?.addEventListener('click', () => {
  if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    selectedClip.clip.layerOrder = 'front';
    selectedClip.clip.zIndex = 50;
    const badge = document.getElementById('inspector-layer-badge');
    if (badge) {
      badge.textContent = 'In Front of Text';
      badge.style.color = '#00f0ff';
    }
    renderAllTimelineTracks();
    recordState('Bring Clip to Front');
  }
});

// Reset Clip Properties to Default (Local Reset)
document.getElementById('btn-reset-inspector-clip')?.addEventListener('click', () => {
  if (selectedClip) {
    selectedClip.clip.volume = 100;
    selectedClip.clip.soundEnabled = true;
    selectedClip.clip.layerOrder = selectedClip.trackType === 'text' ? 'front' : 'back';
    selectedClip.clip.zIndex = selectedClip.trackType === 'text' ? 30 : 10;
    // Reset image / video canvas transform
    if (selectedClip.trackType === 'image' || selectedClip.trackType === 'video') {
      selectedClip.clip.x = 0;
      selectedClip.clip.y = 0;
      selectedClip.clip.scale = 1.0;
    }
    selectClip(selectedClip.clip, selectedClip.trackType);
    renderAllTimelineTracks();
    recordState('Reset Clip Defaults');
  }
});

// Delete Clip from Inspector
document.getElementById('btn-delete-inspector-clip')?.addEventListener('click', () => {
  if (selectedClip) {
    deleteClip(selectedClip.trackType, selectedClip.clip.id);
  }
});

// ==================== TEXT & TYPOGRAPHY STYLING ENGINE ====================

let textPos = 'center';
let textLayerOrder = 'front';
let isExplicitNewText = false;

function getActiveTextClip() {
  if (selectedClip && selectedClip.trackType === 'text') {
    return selectedClip.clip;
  }
  return null;
}

function updateActiveTextClip() {
  const active = getActiveTextClip();
  if (active) {
    active.text = document.getElementById('text-input').value;
    active.highlight = document.getElementById('text-highlight').value;
    active.fontFamily = document.getElementById('text-font').value;
    active.fontSize = parseInt(document.getElementById('text-size').value) || 64;
    active.textColor = document.getElementById('text-color').value;
    active.highlightColor = document.getElementById('text-highlight-color').value;
    active.anim = document.getElementById('text-anim').value;
    active.sfx = document.getElementById('text-sfx')?.value || 'whoosh';
    // Per-clip SFX volume
    const sfxSlider = document.getElementById('text-sfx-volume');
    if (sfxSlider) active.sfxVolume = parseInt(sfxSlider.value) / 100;
    active.position = textPos;
    active.layerOrder = textLayerOrder;
    active.zIndex = textLayerOrder === 'front' ? 30 : 5;
    renderAllTimelineTracks();
  }
}

// Live two-way text input updates
document.getElementById('text-input')?.addEventListener('input', () => {
  updateActiveTextClip();
});
document.getElementById('text-highlight')?.addEventListener('input', () => {
  updateActiveTextClip();
});

function checkTextTimingConflict(clipId, startSec, durationSec) {
  const endSec = startSec + durationSec;
  const otherTexts = (timelineClips.text || []).filter(t => t.id !== clipId);
  const conflicting = otherTexts.filter(t => {
    const tEnd = t.start + t.duration;
    return (startSec < tEnd && endSec > t.start);
  });
  return conflicting;
}

function showTextTimingAlert(msg, type = 'warning') {
  const alertEl = document.getElementById('text-timing-alert');
  if (!alertEl) return;
  if (!msg) {
    alertEl.style.display = 'none';
    alertEl.textContent = '';
    return;
  }
  alertEl.style.display = 'block';
  if (type === 'error' || type === 'warning') {
    alertEl.style.background = 'rgba(255, 51, 75, 0.15)';
    alertEl.style.border = '1px solid #ff334b';
    alertEl.style.color = '#ff6b7e';
  } else {
    alertEl.style.background = 'rgba(0, 230, 118, 0.15)';
    alertEl.style.border = '1px solid #00e676';
    alertEl.style.color = '#00e676';
  }
  alertEl.textContent = msg;
}

// Manual exact timing inputs for Text with live validation & bidirectional sync
document.getElementById('text-start-input')?.addEventListener('input', (e) => {
  const active = getActiveTextClip();
  if (active) {
    const newStart = parseTimecode(e.target.value);
    active.start = newStart;
    renderAllTimelineTracks();
    const conflicts = checkTextTimingConflict(active.id, active.start, active.duration);
    if (conflicts.length > 0) {
      showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
    } else {
      showTextTimingAlert('');
    }
  }
});

document.getElementById('text-start-input')?.addEventListener('change', (e) => {
  const active = getActiveTextClip();
  if (active) {
    const newStart = parseTimecode(e.target.value);
    active.start = newStart;
    e.target.value = formatTimecode(newStart);
    // Auto-seek preview playhead so the user immediately sees the text in canvas
    seekToTime(active.start);
    renderAllTimelineTracks();
    renderAllTextsOverview();
    recordState('Edit Text Start Time');
    const conflicts = checkTextTimingConflict(active.id, active.start, active.duration);
    if (conflicts.length > 0) {
      showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
    } else {
      showTextTimingAlert('');
    }
  }
});

document.getElementById('text-dur-input')?.addEventListener('input', (e) => {
  const active = getActiveTextClip();
  if (active) {
    const newDur = Math.max(0.5, parseTimecode(e.target.value));
    active.duration = newDur;
    renderAllTimelineTracks();
    const conflicts = checkTextTimingConflict(active.id, active.start, active.duration);
    if (conflicts.length > 0) {
      showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
    } else {
      showTextTimingAlert('');
    }
  }
});

document.getElementById('text-dur-input')?.addEventListener('change', (e) => {
  const active = getActiveTextClip();
  if (active) {
    const newDur = Math.max(0.5, parseTimecode(e.target.value));
    active.duration = newDur;
    e.target.value = formatTimecode(newDur);
    renderAllTimelineTracks();
    renderAllTextsOverview();
    recordState('Edit Text Duration');
    const conflicts = checkTextTimingConflict(active.id, active.start, active.duration);
    if (conflicts.length > 0) {
      showTextTimingAlert(`Time Conflict: Overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)})`, 'warning');
    } else {
      showTextTimingAlert('');
    }
  }
});

['center', 'bottom', 'top'].forEach(p => {
  const btn = document.getElementById(`btn-text-pos-${p}`);
  if (btn) {
    btn.addEventListener('click', () => {
      textPos = p;
      ['center', 'bottom', 'top'].forEach(b => document.getElementById(`btn-text-pos-${b}`)?.classList.remove('active'));
      btn.classList.add('active');
      const active = getActiveTextClip();
      if (active) {
        delete active.x;
        delete active.y;
      }
      updateActiveTextClip();
      recordState('Change Text Position');
    });
  }
});

document.getElementById('text-size')?.addEventListener('input', (e) => {
  document.getElementById('text-size-val').textContent = `${e.target.value}px`;
  updateActiveTextClip();
});
document.getElementById('text-size')?.addEventListener('change', () => {
  recordState('Change Text Size');
});

document.getElementById('text-font')?.addEventListener('change', () => {
  updateActiveTextClip();
  recordState('Change Font');
});

document.getElementById('text-color')?.addEventListener('input', () => {
  updateActiveTextClip();
});
document.getElementById('text-color')?.addEventListener('change', () => {
  recordState('Change Text Color');
});

document.getElementById('text-highlight-color')?.addEventListener('input', () => {
  updateActiveTextClip();
});
document.getElementById('text-highlight-color')?.addEventListener('change', () => {
  recordState('Change Highlight Color');
});

document.getElementById('text-anim')?.addEventListener('change', () => {
  updateActiveTextClip();
  recordState('Change Animation');
});

document.getElementById('text-sfx')?.addEventListener('change', () => {
  updateActiveTextClip();
  recordState('Change SFX');
});

// Text Layer Order (Send Behind Media vs In Front of Media)
document.getElementById('btn-text-layer-front')?.addEventListener('click', () => {
  textLayerOrder = 'front';
  document.getElementById('btn-text-layer-front')?.classList.add('active');
  document.getElementById('btn-text-layer-back')?.classList.remove('active');
  updateActiveTextClip();
  recordState('Bring Text to Front');
});

document.getElementById('btn-text-layer-back')?.addEventListener('click', () => {
  textLayerOrder = 'back';
  document.getElementById('btn-text-layer-back')?.classList.add('active');
  document.getElementById('btn-text-layer-front')?.classList.remove('active');
  updateActiveTextClip();
  recordState('Send Text to Back');
});

// ==================== COLOR PRESETS & SAVED TEMPLATES ====================

// Built-in Color Presets
document.querySelectorAll('#color-palette-presets .palette-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#color-palette-presets .palette-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const textColor = chip.dataset.text || '#ffffff';
    const hlColor = chip.dataset.hl || '#ff334b';

    document.getElementById('text-color').value = textColor;
    document.getElementById('text-highlight-color').value = hlColor;

    updateActiveTextClip();
    recordState('Apply Color Preset');
  });
});

// User Saved Templates (persisted in localStorage)
const STORAGE_KEY_TEMPLATES = 'magnates_color_templates';

function getSavedTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

function saveTemplatesToStorage(templates) {
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  } catch(e) {}
}

function renderSavedTemplates() {
  const container = document.getElementById('saved-templates-list');
  const wrapper = document.getElementById('saved-templates-wrapper');
  if (!container || !wrapper) return;

  const templates = getSavedTemplates();
  if (templates.length === 0) {
    wrapper.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  wrapper.style.display = 'block';
  container.innerHTML = '';

  templates.forEach(tpl => {
    const chip = document.createElement('div');
    chip.className = 'saved-template-chip';
    chip.innerHTML = `
      <span class="color-dot" style="background:${tpl.textColor};"></span>
      <span class="color-dot" style="background:${tpl.highlightColor};"></span>
      <span>${tpl.name}</span>
      <button class="btn-delete-template" title="Delete Template">&times;</button>
    `;

    chip.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete-template')) return;
      document.getElementById('text-color').value = tpl.textColor;
      document.getElementById('text-highlight-color').value = tpl.highlightColor;
      updateActiveTextClip();
      recordState('Apply Saved Template: ' + tpl.name);
    });

    const delBtn = chip.querySelector('.btn-delete-template');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const updated = getSavedTemplates().filter(t => t.id !== tpl.id);
      saveTemplatesToStorage(updated);
      renderSavedTemplates();
    });

    container.appendChild(chip);
  });
}

document.getElementById('btn-save-color-template')?.addEventListener('click', () => {
  const row = document.getElementById('template-name-row');
  const input = document.getElementById('template-name-input');
  if (!row) return;
  row.style.display = 'block';
  if (input) { input.value = ''; input.focus(); }
});

document.getElementById('btn-cancel-save-template')?.addEventListener('click', () => {
  const row = document.getElementById('template-name-row');
  if (row) row.style.display = 'none';
});

document.getElementById('btn-confirm-save-template')?.addEventListener('click', () => {
  const input = document.getElementById('template-name-input');
  const name = input?.value?.trim();
  if (!name) { if (input) input.focus(); return; }

  const textColor = document.getElementById('text-color').value;
  const highlightColor = document.getElementById('text-highlight-color').value;
  const templates = getSavedTemplates();
  templates.push({ id: Date.now(), name, textColor, highlightColor });
  saveTemplatesToStorage(templates);
  renderSavedTemplates();

  const row = document.getElementById('template-name-row');
  if (row) row.style.display = 'none';
  if (input) input.value = '';
});

// Also allow Enter key in the name input to confirm
document.getElementById('template-name-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-confirm-save-template')?.click();
  if (e.key === 'Escape') document.getElementById('btn-cancel-save-template')?.click();
});

// Local Reset: Reset Text Styles to Default
document.getElementById('btn-reset-text')?.addEventListener('click', () => {
  document.getElementById('text-input').value = 'Did Google pump and dump?';
  document.getElementById('text-highlight').value = 'pump and dump';
  document.getElementById('text-font').value = "'Inter', sans-serif";
  document.getElementById('text-size').value = 64;
  document.getElementById('text-size-val').textContent = '64px';
  document.getElementById('text-color').value = '#ffffff';
  document.getElementById('text-highlight-color').value = '#ff334b';
  document.getElementById('text-anim').value = 'pop';
  if (document.getElementById('text-sfx')) document.getElementById('text-sfx').value = 'whoosh';

  textPos = 'center';
  ['center', 'bottom', 'top'].forEach(p => {
    document.getElementById(`btn-text-pos-${p}`)?.classList.toggle('active', p === 'center');
  });

  textLayerOrder = 'front';
  document.getElementById('btn-text-layer-front')?.classList.add('active');
  document.getElementById('btn-text-layer-back')?.classList.remove('active');

  const active = getActiveTextClip();
  if (active) {
    delete active.x;
    delete active.y;
  }

  updateActiveTextClip();
  recordState('Reset Text Styles');
});

// Add New Text Clip to Timeline (always creates a new text clip)
document.getElementById('btn-add-text').addEventListener('click', () => {
  const activeExisting = timelineClips.text.find(t => currentTime >= t.start && currentTime <= (t.start + t.duration));
  isExplicitNewText = false;

  const text = document.getElementById('text-input').value;
  const highlight = document.getElementById('text-highlight').value;
  if (!text) {
    showTextTimingAlert('Please enter text content before adding.', 'error');
    return;
  }

  const font = document.getElementById('text-font').value;
  const size = parseInt(document.getElementById('text-size').value) || 64;
  const color = document.getElementById('text-color').value;
  const hlColor = document.getElementById('text-highlight-color').value;
  const anim = document.getElementById('text-anim').value;
  const sfx = document.getElementById('text-sfx')?.value || 'whoosh';
  const zIdx = textLayerOrder === 'front' ? 30 : 5;

  const rawStart = document.getElementById('text-start-input')?.value;
  const rawDur = document.getElementById('text-dur-input')?.value;
  let customStart = rawStart ? parseTimecode(rawStart) : currentTime;
  let customDur = rawDur ? Math.max(0.5, parseTimecode(rawDur)) : 5;

  let insertTime = customStart;
  if (!rawStart && activeExisting) {
    insertTime = activeExisting.start + activeExisting.duration;
  }

  const newClip = addClipToTimeline('text', {
    text,
    highlight,
    fontFamily: font,
    fontSize: size,
    textColor: color,
    highlightColor: hlColor,
    anim,
    sfx,
    position: textPos,
    zIndex: zIdx,
    layerOrder: textLayerOrder
  }, insertTime, customDur);

  // Jump playhead directly to start of text clip so it immediately renders in canvas
  seekToTime(insertTime);
  recordState('Add Text Clip');

  // Check for any timing conflicts with existing text clips
  const conflicts = checkTextTimingConflict(newClip.id, newClip.start, newClip.duration);
  if (conflicts.length > 0) {
    showTextTimingAlert(`Notice: Text overlaps with "${conflicts[0].text || 'another text'}" (${formatTimecode(conflicts[0].start)} - ${formatTimecode(conflicts[0].start + conflicts[0].duration)}).`, 'warning');
  } else {
    showTextTimingAlert(`Text added at ${formatTimecode(insertTime)}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  }
});

// Update Existing Selected Text Clip
document.getElementById('btn-update-text')?.addEventListener('click', () => {
  updateActiveTextClip();
  recordState('Update Text Clip');
});

// Delete Selected Text Clip
document.getElementById('btn-delete-text')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.trackType === 'text') {
    deleteClip('text', selectedClip.clip.id);
  }
});

// New Text Reset
document.getElementById('btn-new-text')?.addEventListener('click', () => {
  isExplicitNewText = true;
  selectedClip = null;
  document.querySelectorAll('.clip-block').forEach(b => b.classList.remove('is-selected'));
  document.getElementById('btn-update-text').style.display = 'none';
  document.getElementById('btn-delete-text').style.display = 'none';
  document.getElementById('text-input').value = 'New Title Text';
  document.getElementById('text-highlight').value = 'Title';
});

// ==================== GLOBAL UNDO / REDO & TIMELINE RESET LISTENERS ====================
document.getElementById('tool-undo')?.addEventListener('click', undo);
document.getElementById('tool-redo')?.addEventListener('click', redo);

document.getElementById('tool-reset-timeline')?.addEventListener('click', () => {
  if (confirm('Reset timeline to default starting state? This can be undone.')) {
    timelineClips = {
      text: [
        {
          id: 'clip-text-1',
          start: 0,
          duration: 5,
          text: 'Did Google pump and dump?',
          highlight: 'pump and dump',
          fontFamily: "'Inter', sans-serif",
          fontSize: 64,
          textColor: '#ffffff',
          highlightColor: '#ff334b',
          anim: 'pop',
          sfx: 'whoosh',
          position: 'center',
          zIndex: 30,
          layerOrder: 'front'
        }
      ],
      image: [],
      video: [],
      voiceover: [],
      music: []
    };
    currentTime = 0;
    selectedClip = null;
    renderAllTimelineTracks();
    updateUI();
    recordState('Reset Timeline');
  }
});

window.addEventListener('keydown', (e) => {
  const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) {
      e.preventDefault();
      redo();
    } else if (!isInput) {
      e.preventDefault();
      undo();
    }
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !isInput) {
    e.preventDefault();
    redo();
  }
});

// ==================== WORKSPACE EXPAND (HIDE SIDEBARS) ====================
let isWorkspaceExpanded = false;
const btnToggleExpand = document.getElementById('tool-toggle-expand');
if (btnToggleExpand) {
  btnToggleExpand.addEventListener('click', () => {
    isWorkspaceExpanded = !isWorkspaceExpanded;
    const workspace = document.querySelector('.workspace');
    if (workspace) {
      workspace.classList.toggle('is-expanded', isWorkspaceExpanded);
    }
    btnToggleExpand.classList.toggle('active', isWorkspaceExpanded);
    const expandText = document.getElementById('expand-btn-text');
    if (expandText) {
      expandText.textContent = isWorkspaceExpanded ? 'Show Panels' : 'Expand Full';
    }
  });
}

// ==================== SFX VOLUME SLIDER & PREVIEW BUTTON ====================
const sfxVolumeSlider = document.getElementById('text-sfx-volume');
const sfxVolumeVal = document.getElementById('text-sfx-vol-val');
const btnPreviewSFX = document.getElementById('btn-preview-sfx');

if (sfxVolumeSlider) {
  sfxVolumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    sfxVolume = val / 100;
    if (sfxVolumeVal) sfxVolumeVal.textContent = `${val}%`;
    // Also save to active clip immediately so it's per-clip
    const active = getActiveTextClip();
    if (active) active.sfxVolume = sfxVolume;
  });
}

if (btnPreviewSFX) {
  btnPreviewSFX.addEventListener('click', () => {
    const sfxType = document.getElementById('text-sfx')?.value || 'whoosh';
    playSFX(sfxType, sfxVolume);
  });
}

// ==================== ALL TEXTS OVERVIEW & EDIT DRAWER ====================
const btnToggleTextHistory = document.getElementById('btn-toggle-text-history');
const textHistoryDrawer = document.getElementById('text-history-drawer');

if (btnToggleTextHistory && textHistoryDrawer) {
  btnToggleTextHistory.addEventListener('click', () => {
    const isVisible = textHistoryDrawer.style.display !== 'none';
    textHistoryDrawer.style.display = isVisible ? 'none' : 'block';
    btnToggleTextHistory.classList.toggle('active', !isVisible);
    if (!isVisible) {
      renderAllTextsOverview();
    }
  });
}

function renderAllTextsOverview() {
  const listEl = document.getElementById('text-history-list');
  const countBadge = document.getElementById('text-count-badge');
  if (!listEl) return;

  const texts = timelineClips.text || [];
  if (countBadge) countBadge.textContent = texts.length;

  if (texts.length === 0) {
    listEl.innerHTML = `<div style="font-size:11px; color:var(--text-muted); text-align:center; padding:8px;">No text clips created yet.</div>`;
    return;
  }

  listEl.innerHTML = '';
  texts.forEach((txt, idx) => {
    const item = document.createElement('div');
    item.className = 'text-history-item';
    if (selectedClip && selectedClip.trackType === 'text' && selectedClip.clip.id === txt.id) {
      item.classList.add('is-active');
    }

    item.innerHTML = `
      <div class="text-history-main" style="flex:1; min-width:0; cursor:pointer;">
        <div class="text-history-snippet">#${idx + 1}: ${txt.text || 'Untitled Text'}</div>
        <div class="text-history-meta">${formatTimecode(txt.start)} - ${formatTimecode(txt.start + txt.duration)} (${txt.duration.toFixed(1)}s)</div>
      </div>
      <button class="btn-delete-text-history" title="Delete this text clip" style="flex-shrink:0; background:transparent; border:1px solid #ff334b; color:#ff334b; border-radius:4px; padding:2px 7px; font-size:10px; cursor:pointer; margin-left:6px;">Delete</button>
    `;

    // Clicking the main content area selects the clip for editing
    item.querySelector('.text-history-main').addEventListener('click', () => {
      seekToTime(txt.start);
      selectClip(txt, 'text');
    });

    // Clicking Delete removes the clip
    item.querySelector('.btn-delete-text-history').addEventListener('click', (e) => {
      e.stopPropagation();
      recordState('Delete Text Clip from History');
      deleteClip('text', txt.id);
    });

    listEl.appendChild(item);
  });
}

// ==================== CANVAS INTERACTIVE TRANSFORM CONTROLS (DRAG & RESIZE) ====================
let isTransforming = false;
let transformAction = null; // 'drag' or 'resize'
let transformStartPos = { x: 0, y: 0 };
let transformInitialClip = { x: 0, y: 0, scale: 1.0 };
let activeResizeHandle = null;

function getCanvasPointer(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function initCanvasTransformInteraction() {
  canvas.addEventListener('mousedown', (e) => {
    // If not in select tool mode, ignore
    if (activeTool !== 'select') return;

    const pt = getCanvasPointer(e);

    // 1. If a text clip is currently selected and visible, check if click hit handles or bounding box
    if (selectedClip && selectedClip.trackType === 'text') {
      const clip = selectedClip.clip;
      const b = clip._renderBounds;
      if (b) {
        const handleSize = 24;
        const corners = [
          { type: 'tl', x: b.x, y: b.y },
          { type: 'tr', x: b.x + b.w, y: b.y },
          { type: 'bl', x: b.x, y: b.y + b.h },
          { type: 'br', x: b.x + b.w, y: b.y + b.h }
        ];

        for (const c of corners) {
          if (Math.abs(pt.x - c.x) <= handleSize && Math.abs(pt.y - c.y) <= handleSize) {
            isTransforming = true;
            transformAction = 'resize';
            activeResizeHandle = c.type;
            transformStartPos = pt;
            transformInitialClip = {
              fontSize: clip.fontSize || 64,
              x: clip.x !== undefined ? clip.x : 220,
              y: clip.y !== undefined ? clip.y : (canvas.height * 0.45)
            };
            e.preventDefault();
            return;
          }
        }

        // Check if inside text bounding box to drag / reposition
        if (pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
          isTransforming = true;
          transformAction = 'drag';
          transformStartPos = pt;
          transformInitialClip = {
            fontSize: clip.fontSize || 64,
            x: clip.x !== undefined ? clip.x : 220,
            y: clip.y !== undefined ? clip.y : (canvas.height * 0.45)
          };
          e.preventDefault();
          return;
        }
      }
    }

    // 2. If an image/video clip is selected, check if click hit handles or bounding box
    if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
      const clip = selectedClip.clip;
      const b = clip._renderBounds;
      if (b) {
        const handleSize = 24; // hit area in canvas coords
        // Check corner handles: TL, TR, BL, BR
        const corners = [
          { type: 'tl', x: b.x, y: b.y },
          { type: 'tr', x: b.x + b.w, y: b.y },
          { type: 'bl', x: b.x, y: b.y + b.h },
          { type: 'br', x: b.x + b.w, y: b.y + b.h }
        ];

        for (const c of corners) {
          if (Math.abs(pt.x - c.x) <= handleSize && Math.abs(pt.y - c.y) <= handleSize) {
            isTransforming = true;
            transformAction = 'resize';
            activeResizeHandle = c.type;
            transformStartPos = pt;
            transformInitialClip = {
              scale: clip.scale !== undefined ? clip.scale : 1.0,
              x: clip.x || 0,
              y: clip.y || 0
            };
            e.preventDefault();
            return;
          }
        }

        // Check if inside image bounding box to drag / reposition
        if (pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
          isTransforming = true;
          transformAction = 'drag';
          transformStartPos = pt;
          transformInitialClip = {
            scale: clip.scale !== undefined ? clip.scale : 1.0,
            x: clip.x || 0,
            y: clip.y || 0
          };
          e.preventDefault();
          return;
        }
      }
    }

    // 3. Check if user clicked on any visible Text layer to select and drag it
    const activeTextClips = timelineClips.text.filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeTextClips.length - 1; i >= 0; i--) {
      const t = activeTextClips[i];
      const b = t._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(t, 'text');
        isTransforming = true;
        transformAction = 'drag';
        transformStartPos = pt;
        transformInitialClip = {
          fontSize: t.fontSize || 64,
          x: t.x !== undefined ? t.x : 220,
          y: t.y !== undefined ? t.y : (canvas.height * 0.45)
        };
        e.preventDefault();
        return;
      }
    }

    // 4. Check if user clicked on any visible image or video layer to select it
    const activeMediaClips = [...timelineClips.image, ...timelineClips.video].filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    // Check in reverse (topmost layer first)
    for (let i = activeMediaClips.length - 1; i >= 0; i--) {
      const c = activeMediaClips[i];
      const b = c._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        const trackType = timelineClips.image.includes(c) ? 'image' : 'video';
        selectClip(c, trackType);
        isTransforming = true;
        transformAction = 'drag';
        transformStartPos = pt;
        transformInitialClip = {
          scale: c.scale !== undefined ? c.scale : 1.0,
          x: c.x || 0,
          y: c.y || 0
        };
        e.preventDefault();
        return;
      }
    }
  });

  // Mouse wheel over canvas to zoom / scale selected text or media
  canvas.addEventListener('wheel', (e) => {
    if (!selectedClip) return;
    const pt = getCanvasPointer(e);
    const clip = selectedClip.clip;
    const b = clip._renderBounds;
    if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
      e.preventDefault();
      const zoomIn = e.deltaY < 0;
      if (selectedClip.trackType === 'text') {
        const currentSize = clip.fontSize || 64;
        const newSize = Math.max(16, Math.min(200, currentSize + (zoomIn ? 4 : -4)));
        clip.fontSize = newSize;
        const sizeInput = document.getElementById('text-size');
        const sizeVal = document.getElementById('text-size-val');
        if (sizeInput) sizeInput.value = newSize;
        if (sizeVal) sizeVal.textContent = `${newSize}px`;
      } else if (selectedClip.trackType === 'image' || selectedClip.trackType === 'video') {
        const currentScale = clip.scale !== undefined ? clip.scale : 1.0;
        const newScale = Math.max(0.2, Math.min(3.5, currentScale + (zoomIn ? 0.05 : -0.05)));
        clip.scale = newScale;
        const miniSub = document.getElementById('inspector-clip-sub');
        if (miniSub) miniSub.textContent = `Image • ${(clip.scale * 100).toFixed(0)}% zoom • Drag on canvas to edit`;
      }
    }
  }, { passive: false });

  window.addEventListener('mousemove', (e) => {
    if (!isTransforming || !selectedClip) return;
    const pt = getCanvasPointer(e);
    const clip = selectedClip.clip;

    if (selectedClip.trackType === 'text') {
      if (transformAction === 'drag') {
        const dx = pt.x - transformStartPos.x;
        const dy = pt.y - transformStartPos.y;
        clip.x = transformInitialClip.x + dx;
        clip.y = transformInitialClip.y + dy;
      } else if (transformAction === 'resize') {
        const dx = pt.x - transformStartPos.x;
        const dy = pt.y - transformStartPos.y;
        const delta = Math.max(Math.abs(dx), Math.abs(dy)) * (dx > 0 || dy > 0 ? 1 : -1);
        const newSize = Math.round(Math.max(18, Math.min(200, transformInitialClip.fontSize + (delta * 0.4))));
        clip.fontSize = newSize;
        const sizeInput = document.getElementById('text-size');
        const sizeVal = document.getElementById('text-size-val');
        if (sizeInput) sizeInput.value = newSize;
        if (sizeVal) sizeVal.textContent = `${newSize}px`;
      }
    } else {
      if (transformAction === 'drag') {
        const dx = pt.x - transformStartPos.x;
        const dy = pt.y - transformStartPos.y;
        clip.x = transformInitialClip.x + dx;
        clip.y = transformInitialClip.y + dy;
      } else if (transformAction === 'resize') {
        const dx = pt.x - transformStartPos.x;
        const dy = pt.y - transformStartPos.y;
        const delta = Math.max(Math.abs(dx), Math.abs(dy)) * (dx > 0 || dy > 0 ? 1 : -1);
        const scaleDelta = (delta / 400);
        clip.scale = Math.max(0.2, Math.min(3.5, transformInitialClip.scale + scaleDelta));
        const miniSub = document.getElementById('inspector-clip-sub');
        if (miniSub) miniSub.textContent = `Image • ${(clip.scale * 100).toFixed(0)}% zoom • Drag on canvas to edit`;
      }
    }
  });

  window.addEventListener('mouseup', () => {
    if (isTransforming) {
      const wasText = selectedClip && selectedClip.trackType === 'text';
      isTransforming = false;
      transformAction = null;
      activeResizeHandle = null;
      recordState(wasText ? 'Transform Text Element' : 'Transform Media Element');
    }
  });

  // Double click / Double tap directly on kinetic text on canvas to open on-screen editor
  let lastTextClickTime = 0;
  let lastClickedTextClipId = null;

  canvas.addEventListener('click', (e) => {
    const pt = getCanvasPointer(e);
    const activeTextClips = timelineClips.text.filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    let clickedText = null;

    for (let i = activeTextClips.length - 1; i >= 0; i--) {
      const t = activeTextClips[i];
      const b = t._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        clickedText = t;
        break;
      }
    }

    if (clickedText) {
      const now = Date.now();
      if (now - lastTextClickTime < 350 && lastClickedTextClipId === clickedText.id) {
        // Double clicked text! Open on-screen editor
        openScreenTextEditor(clickedText);
        lastTextClickTime = 0;
        lastClickedTextClipId = null;
      } else {
        lastTextClickTime = now;
        lastClickedTextClipId = clickedText.id;
      }
    }
  });
}

// ==================== FLOATING ON-SCREEN TEXT EDITOR CONTROLLER ====================
let activeScreenEditingClip = null;

function openScreenTextEditor(clip) {
  if (!clip) return;
  activeScreenEditingClip = clip;
  selectClip(clip, 'text');

  const editorContainer = document.getElementById('canvas-text-editor-container');
  const screenInput = document.getElementById('screen-text-input');
  const sizeDisplay = document.getElementById('stb-size-display');
  const colorPicker = document.getElementById('stb-text-color');
  const hlColorPicker = document.getElementById('stb-hl-color');

  if (!editorContainer || !screenInput) return;

  // Populate values
  screenInput.value = clip.text || '';
  if (sizeDisplay) sizeDisplay.textContent = `${clip.fontSize || 64}px`;
  if (colorPicker) colorPicker.value = clip.textColor || '#ffffff';
  if (hlColorPicker) hlColorPicker.value = clip.highlightColor || '#ff334b';

  // Apply styling match to textarea
  screenInput.style.fontFamily = clip.fontFamily || "'Inter', sans-serif";
  screenInput.style.color = clip.textColor || '#ffffff';

  // Position over the text bounding box or center of canvas
  const canvasRect = canvas.getBoundingClientRect();
  const wrapperRect = canvasWrapper.getBoundingClientRect();

  if (clip._renderBounds) {
    const scaleX = canvasRect.width / canvas.width;
    const scaleY = canvasRect.height / canvas.height;
    const centerX = canvasRect.left - wrapperRect.left + (clip._renderBounds.x + clip._renderBounds.w / 2) * scaleX;
    const centerY = canvasRect.top - wrapperRect.top + (clip._renderBounds.y + clip._renderBounds.h / 2) * scaleY;
    editorContainer.style.left = `${Math.max(160, Math.min(wrapperRect.width - 160, centerX))}px`;
    editorContainer.style.top = `${Math.max(70, Math.min(wrapperRect.height - 70, centerY))}px`;
  } else {
    editorContainer.style.left = '50%';
    editorContainer.style.top = '50%';
  }

  editorContainer.style.display = 'flex';
  screenInput.focus();
  screenInput.select();
}

function closeScreenTextEditor() {
  const editorContainer = document.getElementById('canvas-text-editor-container');
  if (editorContainer) {
    editorContainer.style.display = 'none';
  }
  if (activeScreenEditingClip) {
    recordState('Edit Screen Text');
    activeScreenEditingClip = null;
  }
}

function initScreenTextEditor() {
  const editorContainer = document.getElementById('canvas-text-editor-container');
  const screenInput = document.getElementById('screen-text-input');
  const doneBtn = document.getElementById('stb-done-btn');
  const accentBtn = document.getElementById('stb-accent-btn');
  const sizeDownBtn = document.getElementById('stb-size-down');
  const sizeUpBtn = document.getElementById('stb-size-up');
  const textColorPicker = document.getElementById('stb-text-color');
  const hlColorPicker = document.getElementById('stb-hl-color');
  const sizeDisplay = document.getElementById('stb-size-display');

  if (!editorContainer || !screenInput) return;

  // Live sync typing from on-screen textarea into clip and sidebar
  screenInput.addEventListener('input', () => {
    if (!activeScreenEditingClip) return;
    const val = screenInput.value;
    activeScreenEditingClip.text = val;
    const sidebarInput = document.getElementById('text-input');
    if (sidebarInput) sidebarInput.value = val;
    renderAllTimelineTracks();
    renderAllTextsOverview();
  });

  // ESC or Enter (with Ctrl/Cmd or Shift) to commit
  screenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeScreenTextEditor();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      closeScreenTextEditor();
    }
  });

  doneBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeScreenTextEditor();
  });

  // "Highlight Accent" button: sets selected text from textarea as accent highlight
  accentBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!activeScreenEditingClip || !screenInput) return;

    const start = screenInput.selectionStart;
    const end = screenInput.selectionEnd;
    const fullText = screenInput.value;
    let selectedPhrase = '';

    if (start !== end) {
      selectedPhrase = fullText.substring(start, end).trim();
    } else {
      // If nothing selected, highlight current word or entire text
      const cursor = start;
      const before = fullText.slice(0, cursor).search(/\S+$/);
      const after = fullText.slice(cursor).search(/\s/);
      if (before !== -1) {
        const wordEnd = after === -1 ? fullText.length : cursor + after;
        selectedPhrase = fullText.slice(before, wordEnd).trim();
      } else {
        selectedPhrase = fullText.trim();
      }
    }

    if (selectedPhrase) {
      activeScreenEditingClip.highlight = selectedPhrase;
      const sidebarHighlight = document.getElementById('text-highlight');
      if (sidebarHighlight) sidebarHighlight.value = selectedPhrase;
      renderAllTimelineTracks();
      renderAllTextsOverview();
      showTextTimingAlert(`Accent highlighted: "${selectedPhrase}"`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2500);
    }
  });

  // Font size down
  sizeDownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!activeScreenEditingClip) return;
    const current = activeScreenEditingClip.fontSize || 64;
    const updated = Math.max(16, current - 4);
    activeScreenEditingClip.fontSize = updated;
    if (sizeDisplay) sizeDisplay.textContent = `${updated}px`;
    const sideSize = document.getElementById('text-size');
    const sideSizeVal = document.getElementById('text-size-val');
    if (sideSize) sideSize.value = updated;
    if (sideSizeVal) sideSizeVal.textContent = `${updated}px`;
    renderAllTimelineTracks();
  });

  // Font size up
  sizeUpBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!activeScreenEditingClip) return;
    const current = activeScreenEditingClip.fontSize || 64;
    const updated = Math.min(200, current + 4);
    activeScreenEditingClip.fontSize = updated;
    if (sizeDisplay) sizeDisplay.textContent = `${updated}px`;
    const sideSize = document.getElementById('text-size');
    const sideSizeVal = document.getElementById('text-size-val');
    if (sideSize) sideSize.value = updated;
    if (sideSizeVal) sideSizeVal.textContent = `${updated}px`;
    renderAllTimelineTracks();
  });

  // Live text color change
  textColorPicker?.addEventListener('input', (e) => {
    if (!activeScreenEditingClip) return;
    activeScreenEditingClip.textColor = e.target.value;
    screenInput.style.color = e.target.value;
    const sideCol = document.getElementById('text-color');
    if (sideCol) sideCol.value = e.target.value;
    renderAllTimelineTracks();
  });

  // Live accent highlight color change
  hlColorPicker?.addEventListener('input', (e) => {
    if (!activeScreenEditingClip) return;
    activeScreenEditingClip.highlightColor = e.target.value;
    const sideHlCol = document.getElementById('text-highlight-color');
    if (sideHlCol) sideHlCol.value = e.target.value;
    renderAllTimelineTracks();
  });

  // Prevent clicking inside toolbar from closing editor or triggering fullscreen
  editorContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  editorContainer.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
}

// Initialize Studio
initParticles();
loadMediaLibrary();
initTimelineDragAndDrop();
initPlayheadScrubbing();
drawTimeRuler();
renderSavedTemplates();
renderAllTextsOverview();
initCanvasTransformInteraction();
initScreenTextEditor();

// Load saved project state on startup
loadProjectState();

renderAllTimelineTracks();
if (timelineClips.text.length > 0) {
  selectClip(timelineClips.text[0], 'text');
}
updateUndoRedoUI();
requestAnimationFrame(render);

// ==================== PROJECT SAVE / LOAD (Persist Text Clips & Layout) ====================
const STORAGE_KEY_PROJECT = 'magnates_project_state';

function getSerializableClips() {
  // Text clips are fully serializable (no blob URLs)
  const textClips = timelineClips.text.map(c => ({ ...c }));

  // For media clips, save position/timing/settings but strip blob URLs (session-only)
  function stripMedia(clips) {
    return clips.map(c => ({
      id: c.id,
      start: c.start,
      duration: c.duration,
      volume: c.volume,
      soundEnabled: c.soundEnabled,
      layerOrder: c.layerOrder,
      zIndex: c.zIndex,
      x: c.x,
      y: c.y,
      scale: c.scale,
      fileName: c.file?.name || ''
    }));
  }

  return {
    text: textClips,
    imageLayout: stripMedia(timelineClips.image),
    videoLayout: stripMedia(timelineClips.video),
    voiceoverLayout: stripMedia(timelineClips.voiceover),
    musicLayout: stripMedia(timelineClips.music),
    currentTime,
    duration,
    savedAt: Date.now()
  };
}

function saveProjectState(showConfirm = false) {
  try {
    const state = getSerializableClips();
    localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(state));
    if (showConfirm) {
      const saveBtn = document.getElementById('btn-save-project');
      if (saveBtn) {
        const orig = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.borderColor = '#00e676';
        saveBtn.style.color = '#00e676';
        setTimeout(() => {
          saveBtn.textContent = orig;
          saveBtn.style.borderColor = '';
          saveBtn.style.color = '';
        }, 1500);
      }
    }
  } catch(e) {}
}

function loadProjectState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECT);
    if (!raw) return;
    const state = JSON.parse(raw);

    // Restore text clips (fully portable)
    if (state.text && state.text.length > 0) {
      timelineClips.text = state.text;
    }

    // Restore media clip timing/layout (file references will be missing until re-uploaded)
    // We merge by fileName match if file was re-uploaded in this session
    function mergeLayoutIntoClips(savedLayouts, clips) {
      savedLayouts.forEach(layout => {
        const match = clips.find(c => c.file?.name === layout.fileName);
        if (match) {
          match.start = layout.start ?? match.start;
          match.duration = layout.duration ?? match.duration;
          match.volume = layout.volume ?? match.volume;
          match.soundEnabled = layout.soundEnabled ?? match.soundEnabled;
          match.layerOrder = layout.layerOrder ?? match.layerOrder;
          match.zIndex = layout.zIndex ?? match.zIndex;
          match.x = layout.x ?? match.x;
          match.y = layout.y ?? match.y;
          match.scale = layout.scale ?? match.scale;
        }
      });
    }

    if (state.imageLayout) mergeLayoutIntoClips(state.imageLayout, timelineClips.image);
    if (state.videoLayout) mergeLayoutIntoClips(state.videoLayout, timelineClips.video);
    if (state.voiceoverLayout) mergeLayoutIntoClips(state.voiceoverLayout, timelineClips.voiceover);
    if (state.musicLayout) mergeLayoutIntoClips(state.musicLayout, timelineClips.music);

    if (typeof state.duration === 'number') duration = state.duration;
  } catch(e) {}
}

// Manual save button
document.getElementById('btn-save-project')?.addEventListener('click', () => {
  saveProjectState(true);
});

// Auto-save every 30 seconds
setInterval(() => saveProjectState(false), 30000);

// ==================== SCREEN FULLSCREEN & DOUBLE-TAP IMMERSIVE MODE ====================
const canvasWrapper = document.querySelector('.canvas-wrapper');
const btnCanvasFullscreen = document.getElementById('btn-canvas-fullscreen');

function toggleCanvasFullscreen() {
  if (!canvasWrapper) return;

  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  } else if (canvasWrapper.classList.contains('is-immersive-fallback')) {
    canvasWrapper.classList.remove('is-immersive-fallback');
    updateFullscreenIcon(false);
  } else {
    // Request standard Fullscreen API on the canvas viewport
    if (canvasWrapper.requestFullscreen) {
      canvasWrapper.requestFullscreen().catch(() => {
        // Fallback to CSS immersive mode if blocked by browser policy
        canvasWrapper.classList.add('is-immersive-fallback');
        updateFullscreenIcon(true);
      });
    } else if (canvasWrapper.webkitRequestFullscreen) {
      canvasWrapper.webkitRequestFullscreen();
    } else {
      canvasWrapper.classList.add('is-immersive-fallback');
      updateFullscreenIcon(true);
    }
  }
}

function updateFullscreenIcon(isFullscreen) {
  const icon = document.getElementById('fullscreen-icon');
  if (!icon) return;
  if (isFullscreen) {
    // Contract icon
    icon.innerHTML = `<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>`;
  } else {
    // Expand icon
    icon.innerHTML = `<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>`;
  }
}

document.addEventListener('fullscreenchange', () => {
  const isFs = !!document.fullscreenElement;
  updateFullscreenIcon(isFs);
});

btnCanvasFullscreen?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCanvasFullscreen();
});

// Double click / Double tap anywhere that is not a button or interaction on the screen to enter immersive mode
let lastCanvasTouchTime = 0;
canvasWrapper?.addEventListener('click', (e) => {
  // If clicked directly on interactive controls, handles or input, ignore
  if (e.target.closest('.canvas-controls') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
    return;
  }

  const now = Date.now();
  if (now - lastCanvasTouchTime < 350) {
    // Double tap/click detected on viewport background or canvas
    toggleCanvasFullscreen();
    lastCanvasTouchTime = 0;
  } else {
    lastCanvasTouchTime = now;
  }
});

// ESC key to exit CSS fallback immersive mode
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (canvasWrapper?.classList.contains('is-immersive-fallback')) {
      canvasWrapper.classList.remove('is-immersive-fallback');
      updateFullscreenIcon(false);
    }
  }
});

// ==================== VIDEO EXPORT ENGINE (CLIENT-SIDE RENDERER & RECORDER) ====================
let isExporting = false;
let exportRecorder = null;
let exportChunks = [];

async function exportVideoProject() {
  if (isExporting) return;
  const btnExport = document.getElementById('btn-export');
  if (!btnExport) return;

  const originalBtnHTML = btnExport.innerHTML;
  isExporting = true;
  btnExport.disabled = true;
  btnExport.style.opacity = '0.7';

  // Pause regular live playback during render
  const wasPlaying = isPlaying;
  isPlaying = false;

  try {
    // 1. Setup Audio Mixing Stream for Export
    const audioContextClass = window.AudioContext || window.webkitAudioContext;
    const exportAudioCtx = audioContextClass ? new audioContextClass() : null;
    let audioStream = null;

    if (exportAudioCtx) {
      const audioDest = exportAudioCtx.createMediaStreamDestination();

      // Connect main voiceover audio if present
      if (audioPlayer && audioPlayer.src) {
        try {
          const voiceSource = exportAudioCtx.createMediaElementSource(audioPlayer);
          voiceSource.connect(audioDest);
          voiceSource.connect(exportAudioCtx.destination);
        } catch(e) {}
      }

      // Connect bgm audio if present
      if (bgmPlayer && bgmPlayer.src) {
        try {
          const bgmSource = exportAudioCtx.createMediaElementSource(bgmPlayer);
          bgmSource.connect(audioDest);
          bgmSource.connect(exportAudioCtx.destination);
        } catch(e) {}
      }

      audioStream = audioDest.stream;
    }

    // 2. Capture Canvas Stream (60 FPS high quality)
    const canvasStream = canvas.captureStream ? canvas.captureStream(60) : canvas.mozCaptureStream(60);
    const combinedTracks = [...canvasStream.getVideoTracks()];

    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combinedTracks.push(...audioStream.getAudioTracks());
    }

    const combinedStream = new MediaStream(combinedTracks);

    // Pick best supported MIME type
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }

    exportChunks = [];
    exportRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 8000000 // 8 Mbps high definition
    });

    exportRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        exportChunks.push(e.data);
      }
    };

    const totalExportDuration = Math.min(duration || 30, Math.max(5, getTimelineMaxEndTime()));

    exportRecorder.onstop = () => {
      const blob = new Blob(exportChunks, { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const projectName = (document.getElementById('current-project')?.textContent || 'Magnates_Project').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${projectName}_Export_${Date.now()}.${ext}`;

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      // Reset export state
      isExporting = false;
      btnExport.disabled = false;
      btnExport.style.opacity = '1';
      btnExport.innerHTML = originalBtnHTML;
      showTextTimingAlert(`Video exported successfully as "${filename}"!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 4000);

      // Seek back to start
      seekToTime(0);
    };

    // Calculate maximum timeline duration
    function getTimelineMaxEndTime() {
      let maxTime = 5;
      Object.keys(timelineClips).forEach(k => {
        (timelineClips[k] || []).forEach(c => {
          maxTime = Math.max(maxTime, c.start + c.duration);
        });
      });
      return maxTime;
    }

    // 3. Start Recording
    exportRecorder.start(100);

    // Render loop playback from time 0 to totalExportDuration
    seekToTime(0);
    isPlaying = true;
    if (audioPlayer.src) audioPlayer.play().catch(() => {});
    if (bgmPlayer.src) bgmPlayer.play().catch(() => {});

    const checkInterval = setInterval(() => {
      if (!isExporting) {
        clearInterval(checkInterval);
        return;
      }

      // Update export button progress text
      const pct = Math.min(100, Math.round((currentTime / totalExportDuration) * 100));
      btnExport.innerHTML = `
        <svg class="ui-icon" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
        Rendering ${pct}%...
      `;

      if (currentTime >= totalExportDuration) {
        clearInterval(checkInterval);
        isPlaying = false;
        if (audioPlayer) audioPlayer.pause();
        if (bgmPlayer) bgmPlayer.pause();
        if (exportRecorder && exportRecorder.state === 'recording') {
          exportRecorder.stop();
        }
      }
    }, 150);

  } catch (err) {
    console.error('Export Error:', err);
    alert(`Failed to export video: ${err.message}`);
    isExporting = false;
    btnExport.disabled = false;
    btnExport.style.opacity = '1';
    btnExport.innerHTML = originalBtnHTML;
  }
}

document.getElementById('btn-export')?.addEventListener('click', () => {
  exportVideoProject();
});
