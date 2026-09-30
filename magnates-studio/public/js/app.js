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
  chart: [],
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
  // Automatic persistence: save project state on any user action
  if (typeof saveProjectState === 'function') {
    saveProjectState(false);
  }
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
  } else if (type === 'snap_zoom') {
    // Logically Answered quick camera punch-in whoosh-snap
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);
    gain.gain.setValueAtTime(0.6 * volMult, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

// FX Settings
const fxState = {
  grid: {
    enabled: true,
    depth: 45,
    opacity: 0.25,
    vignette: 0.85,
    color: '#c8dcff',
    glowEnabled: false,
    glowIntensity: 0.6
  },
  stageBackground: { type: 'cyber_grid', color: '#0a0b0e' }, // 'cyber_grid', 'solid_black', 'color', 'vox_cream', 'chroma_green'
  particles: {
    enabled: true,
    count: 65,
    glow: 0.6,
    speed: 2,
    color: '#ff4114',
    glowEnabled: true
  },
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

// Helper to parse hex or named colors to RGB
function parseColorToRgb(colorStr, defaultRgb = { r: 200, g: 220, b: 255 }) {
  if (!colorStr) return defaultRgb;
  if (colorStr.startsWith('#')) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    if (!isNaN(num)) {
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
  }
  return defaultRgb;
}

// Draw 3D Curved Perspective Grid
function drawPerspectiveGrid() {
  if (!fxState.grid.enabled) return;

  const w = canvas.width;
  const h = canvas.height;
  const horizon = h * 0.45;
  const op = fxState.grid.opacity;

  // Resolve grid line color (default: soft blue/white #c8dcff)
  const rgb = parseColorToRgb(fxState.grid.color, { r: 200, g: 220, b: 255 });

  ctx.save();
  ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${op})`;
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

  // Optional: Cyber Glow & Horizon Bloom (ONLY rendered when user explicitly enables it)
  if (fxState.grid.glowEnabled) {
    const glowMult = fxState.grid.glowIntensity !== undefined ? fxState.grid.glowIntensity : 0.6;

    // Glowing lines pass
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(op * 1.6 * glowMult, 0.7)})`;
    ctx.lineWidth = 1.0;

    for (let i = 0; i < floorLineCount; i++) {
      const t = i / floorLineCount;
      const lineY = horizon + (h - horizon) * Math.pow(t, 2.2);
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(w, lineY);
      ctx.stroke();
    }
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
    }
    ctx.restore();

    // Horizon line bloom
    ctx.save();
    ctx.shadowBlur = 32;
    ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.0)`;
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(op * 2.2 * glowMult, 0.85)})`;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(w, horizon);
    ctx.stroke();
    ctx.restore();

    // Floor bloom gradient
    ctx.save();
    const floorGrad = ctx.createLinearGradient(0, horizon, 0, h);
    floorGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${op * 0.18 * glowMult})`);
    floorGrad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${op * 0.08 * glowMult})`);
    floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, horizon, w, h - horizon);
    ctx.restore();
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

  // Resolve particle and glow color (default: warm flame #ff4114)
  const rgb = parseColorToRgb(fxState.particles.color, { r: 255, g: 65, b: 20 });
  // Secondary lighter color for core bloom and sparks
  const sparkR = Math.min(255, rgb.r + 20);
  const sparkG = Math.min(255, rgb.g + 115);
  const sparkB = Math.min(255, rgb.b + 50);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Bottom fire glow (rendered only if glowEnabled is true, default: true)
  if (fxState.particles.glowEnabled !== false && fxState.particles.glow > 0) {
    const fireGrad = ctx.createLinearGradient(0, h, 0, h - 300);
    fireGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fxState.particles.glow})`);
    fireGrad.addColorStop(0.5, `rgba(${sparkR}, ${sparkG}, ${sparkB}, ${fxState.particles.glow * 0.4})`);
    fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = fireGrad;
    ctx.fillRect(0, h - 300, w, 300);
  }

  // Floating sparks
  const count = fxState.particles.count;
  for (let i = 0; i < count; i++) {
    const p = particles[i];
    ctx.fillStyle = `rgba(${sparkR}, ${sparkG}, ${sparkB}, ${p.alpha})`;
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
  if (!targetFile && !targetClip?.drawingStrokes) return;

  const el = targetFile ? getMediaElement(targetFile) : null;
  if (!el && !targetClip?.drawingStrokes) return;

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
    }
  } else if (targetClip && targetClip.chartConfig) {
    dw = 1080;
    dh = 580;
  } else if (targetClip && targetClip.drawingStrokes) {
    dw = 1280;
    dh = 720;
  } else if (targetFile.isImage) {
    if (!el || !el.complete || !el.naturalWidth || !el.naturalHeight) {
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

  // Determine source element to render (processed cutout canvas vs original image element)
  let renderSource = el;
  if (targetFile.isImage && targetClip && targetClip.cutoutCanvas) {
    renderSource = targetClip.cutoutCanvas;
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = targetClip?.vectorEffect ? 45 : 35;
  ctx.shadowOffsetY = targetClip?.vectorEffect ? 14 : 10;

  try {
    // If Vector / Graphic Paper Cutout FX is enabled, render multi-pass sticker contour outline
    if (targetClip && targetClip.vectorEffect) {
      // 1. Draw solid stroke contour outline around the subject
      const strokeSize = 6;
      ctx.save();
      ctx.shadowColor = 'transparent';
      // 8-directional offset silhouette for sharp sticker edge
      const offsets = [
        [-strokeSize, 0], [strokeSize, 0], [0, -strokeSize], [0, strokeSize],
        [-strokeSize*0.7, -strokeSize*0.7], [strokeSize*0.7, -strokeSize*0.7],
        [-strokeSize*0.7, strokeSize*0.7], [strokeSize*0.7, -strokeSize*0.7]
      ];
      offsets.forEach(([ox, oy]) => {
        ctx.drawImage(renderSource, dx + ox, dy + oy, finalW, finalH);
      });
      // Tint the outline layer white using composite
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = targetClip.vectorStrokeColor || '#ffffff';
      ctx.fillRect(dx - strokeSize * 2, dy - strokeSize * 2, finalW + strokeSize * 4, finalH + strokeSize * 4);
      ctx.restore();
    }

    // 2. Render primary image / cutout with Punch Zoom transformation
    const hasSnapZoom = targetClip && targetClip.zoomEffect === 'snap';
    const hasLoupe = targetClip && targetClip.zoomEffect === 'loupe';

    if (hasSnapZoom) {
      // Calculate animated camera punch zoom
      const zoomElapsed = currentTime - targetClip.start;
      const zoomInAt = targetClip.zoomStartTime !== undefined ? targetClip.zoomStartTime : 0.5;
      const targetScale = targetClip.zoomScale || 2.2;
      const targetOriginX = targetClip.zoomOriginX !== undefined ? targetClip.zoomOriginX : 0.5;
      const targetOriginY = targetClip.zoomOriginY !== undefined ? targetClip.zoomOriginY : 0.5;

      let currentPunch = 1.0;
      if (zoomElapsed >= zoomInAt) {
        // Fast snappy cubic easing into target zoom
        const t = Math.min(1, Math.max(0, (zoomElapsed - zoomInAt) / 0.42));
        const ease = 1 - Math.pow(1 - t, 3.5);
        currentPunch = 1.0 + (targetScale - 1.0) * ease;
      }

      ctx.save();
      // Translate to zoom origin on image, scale, then translate back
      const originPxX = dx + finalW * targetOriginX;
      const originPxY = dy + finalH * targetOriginY;
      ctx.translate(originPxX, originPxY);
      ctx.scale(currentPunch, currentPunch);
      ctx.translate(-originPxX, -originPxY);

      if (targetClip?.drawingStrokes && targetClip.drawingStrokes.length > 0 && targetClip.drawMode === 'live') {
        const elapsed = currentTime - targetClip.start;
        const drawProg = Math.min(1.0, Math.max(0.0, elapsed / Math.max(0.5, targetClip.duration * 0.85)));
        drawScreenInkOverlay(ctx, targetClip.drawingStrokes, targetClip.drawingFills, drawProg, targetClip.staggerParts);
      } else {
        ctx.drawImage(renderSource, dx, dy, finalW, finalH);
      }

      if (!targetClip?.vectorEffect && !targetClip?.cutoutCanvas) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, finalW, finalH);
      }
      ctx.restore();
    } else {
      if (targetClip?.chartConfig) {
        drawInfographicChart(ctx, targetClip, dx, dy, finalW, finalH);
      } else if (targetClip?.drawingStrokes && targetClip.drawingStrokes.length > 0 && targetClip.drawMode === 'live') {
        const elapsed = currentTime - targetClip.start;
        const drawProg = Math.min(1.0, Math.max(0.0, elapsed / Math.max(0.5, targetClip.duration * 0.85)));
        drawScreenInkOverlay(ctx, targetClip.drawingStrokes, targetClip.drawingFills, drawProg, targetClip.staggerParts);
      } else if (targetClip?.drawingStrokes && targetClip.drawingStrokes.length > 0) {
        drawScreenInkOverlay(ctx, targetClip.drawingStrokes, targetClip.drawingFills, 1.0, false);
      } else if (renderSource) {
        ctx.drawImage(renderSource, dx, dy, finalW, finalH);
      }

      // Subtle selection border if selected, or if vector effect is active
      if (!targetClip?.vectorEffect && !targetClip?.cutoutCanvas) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, finalW, finalH);
      }
    }

    // 3. Render Loupe / Magnifying Lens Callout (Logically Answered Circular Callout Effect)
    if (hasLoupe) {
      const loupeElapsed = currentTime - targetClip.start;
      const loupeInAt = targetClip.zoomStartTime !== undefined ? targetClip.zoomStartTime : 0.5;
      
      if (loupeElapsed >= loupeInAt) {
        const t = Math.min(1, Math.max(0, (loupeElapsed - loupeInAt) / 0.35));
        // Springy pop ease
        const ease = t < 1 ? Math.sin((t * Math.PI) / 2) * (1 + 0.1 * Math.sin(t * Math.PI)) : 1;
        
        const originNormX = targetClip.zoomOriginX !== undefined ? targetClip.zoomOriginX : 0.5;
        const originNormY = targetClip.zoomOriginY !== undefined ? targetClip.zoomOriginY : 0.5;
        const centerX = dx + finalW * originNormX;
        const centerY = dy + finalH * originNormY;
        const magScale = targetClip.zoomScale || 2.2;
        const shape = targetClip.loupeShape || 'circle';
        const isRect = shape === 'rect';

        // Size parameters (support custom marquee width/height or radius)
        const baseW = targetClip.loupeWidth || (targetClip.loupeRadius ? targetClip.loupeRadius * 2 : 240);
        const baseH = targetClip.loupeHeight || (targetClip.loupeRadius ? targetClip.loupeRadius * 1.3 : 160);
        const boxW = Math.max(20, baseW * ease);
        const boxH = Math.max(20, baseH * ease);
        const radius = Math.max(1, (targetClip.loupeRadius || 120) * ease);

        ctx.save();

        // Optional subtle darkening of background around image to make lens pop
        ctx.save();
        ctx.fillStyle = `rgba(5, 7, 12, ${0.45 * Math.min(1, t * 1.5)})`;
        ctx.fillRect(dx, dy, finalW, finalH);
        ctx.restore();

        // Helper path function
        const makePath = () => {
          ctx.beginPath();
          if (isRect) {
            const rx = centerX - boxW / 2;
            const ry = centerY - boxH / 2;
            const corner = Math.min(12, boxW / 4, boxH / 4);
            ctx.roundRect ? ctx.roundRect(rx, ry, boxW, boxH, corner) : ctx.rect(rx, ry, boxW, boxH);
          } else {
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          }
        };

        // 3a. Deep Shadow under Callout
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 14;
        makePath();
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.restore();

        // 3b. Magnified Clipped Content
        ctx.save();
        makePath();
        ctx.clip();

        // Scale up centered directly on (centerX, centerY)
        ctx.translate(centerX, centerY);
        ctx.scale(magScale, magScale);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(renderSource, dx, dy, finalW, finalH);
        ctx.restore();

        // 3c. Premium Border Ring / Bezel (White & Cyan Vox-style ring)
        ctx.save();
        makePath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tiny crosshair target reticle in center of callout
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY);
        ctx.lineTo(centerX + 8, centerY);
        ctx.moveTo(centerX, centerY - 8);
        ctx.lineTo(centerX, centerY + 8);
        ctx.stroke();

        ctx.restore();

        ctx.restore();
      }
    }
  } catch(e) {}

  ctx.restore();

  // If this clip is selected and is a chart, image, or video, draw interactive transform highlight & handles
  if (selectedClip && targetClip && selectedClip.clip.id === targetClip.id && (selectedClip.trackType === 'chart' || selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    drawTransformHandles(dx, dy, finalW, finalH);

    // If clip has zoom or loupe, also draw target crosshair indicator
    if (targetClip.zoomEffect && targetClip.zoomOriginX !== undefined) {
      drawZoomTargetIndicator(dx, dy, finalW, finalH, targetClip);
    }
  }
}

// Draw visual crosshair anchor point for punch/loupe zoom target
function drawZoomTargetIndicator(dx, dy, w, h, clip) {
  const cx = dx + w * clip.zoomOriginX;
  const cy = dy + h * clip.zoomOriginY;
  ctx.save();
  ctx.strokeStyle = clip.zoomEffect === 'loupe' ? '#00f0ff' : '#ff334b';
  ctx.fillStyle = clip.zoomEffect === 'loupe' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 51, 75, 0.2)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 20, cy);
  ctx.lineTo(cx + 20, cy);
  ctx.moveTo(cx, cy - 20);
  ctx.lineTo(cx, cy + 20);
  ctx.stroke();

  // Label tag
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 4;
  const label = clip.zoomEffect === 'loupe' ? 'Loupe Focus' : 'Punch Zoom Focus';
  ctx.fillText(label, cx + 18, cy + 4);
  ctx.restore();
}

// Draw live interactive marquee selection box while dragging on canvas
function drawMarqueeSelectionOverlay() {
  if (!isMarqueeDragging) return;
  const x = Math.min(marqueeStartPt.x, marqueeCurrentPt.x);
  const y = Math.min(marqueeStartPt.y, marqueeCurrentPt.y);
  const w = Math.abs(marqueeCurrentPt.x - marqueeStartPt.x);
  const h = Math.abs(marqueeCurrentPt.y - marqueeStartPt.y);

  if (w < 4 && h < 4) return;

  const isSnap = activeTool === 'snap-zoom';
  const color = isSnap ? '#ff334b' : '#00f0ff';
  const bgColor = isSnap ? 'rgba(255, 51, 75, 0.18)' : 'rgba(0, 240, 255, 0.18)';

  ctx.save();
  // Fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);

  // Animated marching ants outline
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const dashOffset = (performance.now() / 35) % 16;
  ctx.lineDashOffset = -dashOffset;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);

  // Corner markers
  const marker = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + marker); ctx.lineTo(x, y); ctx.lineTo(x + marker, y);
  // Top-right
  ctx.moveTo(x + w - marker, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + marker);
  // Bottom-left
  ctx.moveTo(x, y + h - marker); ctx.lineTo(x, y + h); ctx.lineTo(x + marker, y + h);
  // Bottom-right
  ctx.moveTo(x + w - marker, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - marker);
  ctx.stroke();

  // Floating dimension badge
  ctx.font = '600 11px Inter, sans-serif';
  const text = `${Math.round(w)} x ${Math.round(h)} px  (${isSnap ? 'Punch Area' : 'Loupe Area'})`;
  const textW = ctx.measureText(text).width;
  ctx.fillStyle = 'rgba(10, 14, 23, 0.88)';
  ctx.fillRect(x + w / 2 - textW / 2 - 8, y + h + 8, textW + 16, 20);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + w / 2 - textW / 2 - 8, y + h + 8, textW + 16, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x + w / 2 - textW / 2, y + h + 22);

  ctx.restore();
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

  // 2. Active Chart / Infographic Clips
  (timelineClips.chart || []).forEach(c => {
    if (currentTime >= c.start && currentTime <= (c.start + c.duration)) {
      activeItems.push({ type: 'chart', clip: c, zIndex: c.zIndex !== undefined ? c.zIndex : 25 });
    }
  });

  // 3. Active Image Clips
  timelineClips.image.forEach(c => {
    if (currentTime >= c.start && currentTime <= (c.start + c.duration)) {
      activeItems.push({ type: 'image', clip: c, zIndex: c.zIndex !== undefined ? c.zIndex : 20 });
    }
  });

  // 4. Active Text Clips
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
    if (item.type === 'video' || item.type === 'image' || item.type === 'chart') {
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

    // Trigger Punch / Loupe Zoom Sound Effect when playhead enters image zoom animation
    [...timelineClips.image, ...timelineClips.video].forEach(m => {
      if (m.zoomEffect) {
        const zoomTriggerTime = m.start + (m.zoomStartTime !== undefined ? m.zoomStartTime : 0.5);
        if (currentTime >= zoomTriggerTime && currentTime <= (zoomTriggerTime + 0.3)) {
          const sfxKey = `${m.id}-zoom`;
          if (!triggeredSFX.has(sfxKey)) {
            playSFX('snap_zoom', 0.6);
            triggeredSFX.add(sfxKey);
          }
        }
      }
    });
  }

  try {
    // Clear & Stage Background Layer
    const bgType = fxState.stageBackground?.type || 'cyber_grid';
    if (bgType === 'solid_black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'color') {
      ctx.fillStyle = fxState.stageBackground.color || '#0a0b0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'vox_cream') {
      ctx.fillStyle = '#f4eedb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'chroma_green') {
      ctx.fillStyle = '#00e676';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Default cyber grid / dark studio
      ctx.fillStyle = '#0a0b0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 1. 3D Background Grid (when enabled or preset is cyber_grid)
    if (bgType === 'cyber_grid' || fxState.grid.enabled) {
      drawPerspectiveGrid();
    }

    // 2. Layer-Ordered Visual Elements (Media & Kinetic Text arranged by z-index)
    drawSortedVisualLayers();

    // 3. Mystery Silhouette Cutout
    if (fxState.silhouette.enabled) {
      drawSilhouetteOverlay();
    }

    // 4. Fire Particles / Atmosphere
    drawParticles();

    // 5. Active Marquee Drag Selection Overlay (when dragging area for Zoom or Loupe)
    if (isMarqueeDragging) {
      drawMarqueeSelectionOverlay();
    }

    // 6. Freehand Drawing Ink Overlay (Multi-brush vector strokes)
    drawScreenInkOverlay(ctx);

    updateUI();
  } catch (err) {
    console.error('[Magnates Render Error]', err);
  }

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
    chart: document.getElementById('content-chart'),
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
      if (clip.chartConfig) {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24" style="color: #00f0ff;"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>`;
      } else if (clip.isIconSticker) {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24" style="color: #ffd000;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      } else if (clip.drawingStrokes) {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24" style="color: #ff334b;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
      } else if (type === 'image') {
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
  if (currentFilter === 'layers') {
    renderLayersPanel();
  }
}

// Global handler for tapping timeline (+) button
function handleTimelineAddButtonClick(trackType, atTimeSec, triggerEl) {
  if (trackType === 'text') {
    // Prompt or directly open text editor for new text clip at this exact time
    const newClip = createNewTextClipAtTime(atTimeSec);
    seekToTime(atTimeSec);
    showTextTimingAlert(`New kinetic text added at ${formatTimecode(atTimeSec)}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  } else if (trackType === 'chart') {
    openChartCreatorModal(atTimeSec);
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
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) chartInspector.style.display = 'none';
    inspector.style.display = 'none';

    // Highlight text editor card and scroll it into view
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) {
      textEditorCard.style.display = 'block';
      textEditorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else if (clip.chartConfig) {
    // Show chart inspector card
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) {
      chartInspector.style.display = 'block';
      chartInspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      populateChartInspector(clip);
    }
    inspector.style.display = 'none';
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) textEditorCard.style.display = 'none';
  } else {
    // Show standard clip inspector card
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) chartInspector.style.display = 'none';
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) textEditorCard.style.display = 'none';
    inspector.style.display = 'block';
    document.getElementById('inspector-clip-type').textContent = clip.drawingStrokes ? 'DRAWING' : (clip.isIconSticker ? 'ICON' : trackType.toUpperCase());
    document.getElementById('inspector-clip-name').textContent = clip.name || clip.file?.name || 'Clip';
    
    // Dynamic Mini Preview in Sidebar Inspector
    const miniThumb = document.getElementById('inspector-mini-thumb');
    const miniSub = document.getElementById('inspector-clip-sub');
    if (miniThumb) {
      if (clip.drawingStrokes) {
        miniThumb.innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" style="width:20px;height:20px;fill:#ff334b;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
        if (miniSub) miniSub.textContent = `Drawing • ${clip.drawMode === 'live' ? 'Speed-Draw Active' : 'Static'} • ${clip.staggerParts ? 'Staggered' : 'All Strokes'}`;
      } else if (trackType === 'image' && clip.file?.url) {
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

    // Image Cutout & Vector Effects section
    const imageFxSection = document.getElementById('inspector-image-fx-section');
    if (imageFxSection) {
      if (trackType === 'image') {
        imageFxSection.style.display = 'block';
        const hasCutout = !!clip.cutoutCanvas;
        const hasVector = !!clip.vectorEffect;

        const cutoutBtn = document.getElementById('btn-sidebar-cutout');
        const cutoutLbl = document.getElementById('label-sidebar-cutout');
        if (cutoutBtn && cutoutLbl) {
          cutoutLbl.textContent = hasCutout ? 'Restore BG' : 'Remove BG';
          cutoutBtn.style.borderColor = hasCutout ? 'var(--accent-red)' : '';
          cutoutBtn.style.color = hasCutout ? '#ff6b7e' : '';
        }

        const vectorBtn = document.getElementById('btn-sidebar-vector');
        const vectorLbl = document.getElementById('label-sidebar-vector');
        if (vectorBtn && vectorLbl) {
          vectorLbl.textContent = hasVector ? 'Vector (On)' : 'Vector FX';
          vectorBtn.style.borderColor = hasVector ? '#00f0ff' : '';
          vectorBtn.style.color = hasVector ? '#00f0ff' : '';
        }
      } else {
        imageFxSection.style.display = 'none';
      }
    }

    // Document Zoom & Loupe Inspector Section
    const zoomSection = document.getElementById('inspector-zoom-fx-section');
    if (zoomSection) {
      if (trackType === 'image' || trackType === 'video') {
        zoomSection.style.display = 'block';
        const zoomBadge = document.getElementById('inspector-zoom-fx-badge');
        const zoomBody = document.getElementById('inspector-zoom-controls-body');
        const snapBtn = document.getElementById('btn-inspector-snap-zoom');
        const loupeBtn = document.getElementById('btn-inspector-loupe-zoom');
        const rowLoupeRadius = document.getElementById('row-loupe-radius');

        const effect = clip.zoomEffect || null;
        if (zoomBadge) {
          zoomBadge.textContent = effect === 'snap' ? 'Punch Zoom' : (effect === 'loupe' ? 'Loupe Callout' : 'None');
          zoomBadge.style.color = effect ? '#00f0ff' : 'var(--text-muted)';
        }

        if (snapBtn) {
          snapBtn.style.borderColor = effect === 'snap' ? '#00f0ff' : '';
          snapBtn.style.color = effect === 'snap' ? '#00f0ff' : '';
        }
        if (loupeBtn) {
          loupeBtn.style.borderColor = effect === 'loupe' ? '#00f0ff' : '';
          loupeBtn.style.color = effect === 'loupe' ? '#00f0ff' : '';
        }

        if (effect && zoomBody) {
          zoomBody.style.display = 'block';
          const rowLoupeShape = document.getElementById('row-loupe-shape');
          if (rowLoupeShape) rowLoupeShape.style.display = effect === 'loupe' ? 'block' : 'none';
          if (rowLoupeRadius) rowLoupeRadius.style.display = effect === 'loupe' ? 'block' : 'none';

          const shape = clip.loupeShape || 'circle';
          const btnCircle = document.getElementById('btn-loupe-shape-circle');
          const btnRect = document.getElementById('btn-loupe-shape-rect');
          if (btnCircle) btnCircle.classList.toggle('active', shape === 'circle');
          if (btnRect) btnRect.classList.toggle('active', shape === 'rect');

          const scaleInput = document.getElementById('inspector-zoom-scale');
          const scaleVal = document.getElementById('inspector-zoom-scale-val');
          const curScale = clip.zoomScale || 2.2;
          if (scaleInput) scaleInput.value = Math.round(curScale * 10);
          if (scaleVal) scaleVal.textContent = `${curScale.toFixed(1)}x`;

          const radInput = document.getElementById('inspector-loupe-radius');
          const radVal = document.getElementById('inspector-loupe-radius-val');
          const curRad = clip.loupeRadius || 120;
          if (radInput) radInput.value = curRad;
          if (radVal) radVal.textContent = `${curRad}px`;

          const startInput = document.getElementById('inspector-zoom-start');
          const startVal = document.getElementById('inspector-zoom-start-val');
          const curStart = clip.zoomStartTime !== undefined ? clip.zoomStartTime : 0.5;
          if (startInput) startInput.value = Math.round(curStart * 10);
          if (startVal) startVal.textContent = `${curStart.toFixed(1)}s`;
        } else if (zoomBody) {
          zoomBody.style.display = 'none';
        }
      } else {
        zoomSection.style.display = 'none';
      }
    }

    document.getElementById('btn-update-text').style.display = 'none';
    document.getElementById('btn-delete-text').style.display = 'none';

    // Scroll inspector into view in sidebar
    inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Update Apple-style Fullscreen Floating HUD
  updateAppleFullscreenHud();
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

  // Right-click context menu on timeline block
  blockEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectClip(clip, trackType);
    showStudioContextMenu(e.clientX, e.clientY, clip, trackType);
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

        // Auto-routing & lane enforcement:
        // Automatically route media files to their respective dedicated tracks
        let targetType = 'image';
        if (file.isVideo) {
          targetType = 'video';
        } else if (file.isAudio) {
          targetType = 'voiceover';
        } else if (file.isImage) {
          targetType = 'image';
        } else if (file.text !== undefined) {
          targetType = 'text';
        }

        // Inform user if file automatically snapped to correct lane
        const droppedLaneType = trackEl.dataset.trackType || '';
        if (droppedLaneType && droppedLaneType !== targetType) {
          const laneNames = {
            image: 'Images',
            video: 'Video Clips',
            voiceover: 'Voiceover',
            text: 'Kinetic Text',
            music: 'BGM Music'
          };
          showTextTimingAlert(`Auto-routed "${file.name || 'clip'}" to ${laneNames[targetType] || targetType} track.`, 'success');
          setTimeout(() => showTextTimingAlert(''), 2500);
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
    // Exclude undo, redo, reset, expand from active tool toggle
    if (['tool-undo', 'tool-redo', 'tool-reset-timeline', 'tool-toggle-expand'].includes(btn.id)) return;

    document.querySelectorAll('.timeline-tools .btn-tool').forEach(b => {
      if (!['tool-undo', 'tool-redo', 'tool-reset-timeline', 'tool-toggle-expand'].includes(b.id)) {
        b.classList.remove('active');
      }
    });
    btn.classList.add('active');

    // Update canvas cursor styling based on active tool
    canvas.classList.remove('tool-snap-zoom', 'tool-loupe', 'tool-draw');

    if (btn.id === 'tool-select') {
      activeTool = 'select';
      toggleDrawingDock(false);
    }
    else if (btn.id === 'tool-split') {
      activeTool = 'split';
      toggleDrawingDock(false);
    }
    else if (btn.id === 'tool-delete') {
      activeTool = 'delete';
      toggleDrawingDock(false);
    }
    else if (btn.id === 'tool-snap-zoom') {
      activeTool = 'snap-zoom';
      canvas.classList.add('tool-snap-zoom');
      toggleDrawingDock(false);
    } else if (btn.id === 'tool-loupe') {
      activeTool = 'loupe';
      canvas.classList.add('tool-loupe');
      toggleDrawingDock(false);
    } else if (btn.id === 'tool-draw') {
      activeTool = 'draw';
      canvas.classList.add('tool-draw');
      toggleDrawingDock(true);
      showTextTimingAlert('Drawing Mode Active! Hold click anywhere on screen for Pen quick-menu.', 'success');
      setTimeout(() => showTextTimingAlert(''), 3000);
    }
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

// Media Tab buttons (including Layers tab)
document.querySelectorAll('.media-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.media-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    currentFilter = e.currentTarget.dataset.tab;

    const mediaListEl = document.getElementById('media-list');
    const layersPanelEl = document.getElementById('layers-panel-container');
    const chartsPanelEl = document.getElementById('charts-panel-container');
    const iconsPanelEl = document.getElementById('icons-panel-container');

    if (currentFilter === 'charts') {
      if (mediaListEl) mediaListEl.style.display = 'none';
      if (layersPanelEl) layersPanelEl.style.display = 'none';
      if (iconsPanelEl) iconsPanelEl.style.display = 'none';
      if (chartsPanelEl) {
        chartsPanelEl.style.display = 'flex';
        renderChartsTemplatesPanel();
      }
    } else if (currentFilter === 'icons') {
      if (mediaListEl) mediaListEl.style.display = 'none';
      if (layersPanelEl) layersPanelEl.style.display = 'none';
      if (chartsPanelEl) chartsPanelEl.style.display = 'none';
      if (iconsPanelEl) {
        iconsPanelEl.style.display = 'flex';
        renderIconsLibraryPanel();
      }
    } else if (currentFilter === 'layers') {
      if (mediaListEl) mediaListEl.style.display = 'none';
      if (chartsPanelEl) chartsPanelEl.style.display = 'none';
      if (iconsPanelEl) iconsPanelEl.style.display = 'none';
      if (layersPanelEl) {
        layersPanelEl.style.display = 'flex';
        renderLayersPanel();
      }
    } else {
      if (layersPanelEl) layersPanelEl.style.display = 'none';
      if (chartsPanelEl) chartsPanelEl.style.display = 'none';
      if (iconsPanelEl) iconsPanelEl.style.display = 'none';
      if (mediaListEl) {
        mediaListEl.style.display = 'flex';
        renderMediaList(currentFilter);
      }
    }
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

// Grid Line Color and Preset Handlers
const gridColorPicker = document.getElementById('fx-grid-color');
const btnGridDefault = document.getElementById('btn-grid-color-default');
const btnGridCyan = document.getElementById('btn-grid-color-cyan');
const btnGridRed = document.getElementById('btn-grid-color-red');

function setGridColor(hex) {
  fxState.grid.color = hex;
  if (gridColorPicker) gridColorPicker.value = hex;
  if (btnGridDefault) btnGridDefault.classList.toggle('active', hex.toLowerCase() === '#c8dcff');
  if (btnGridCyan) btnGridCyan.classList.toggle('active', hex.toLowerCase() === '#00f0ff');
  if (btnGridRed) btnGridRed.classList.toggle('active', hex.toLowerCase() === '#ff334b');
}

gridColorPicker?.addEventListener('input', (e) => {
  setGridColor(e.target.value);
});
btnGridDefault?.addEventListener('click', () => setGridColor('#c8dcff'));
btnGridCyan?.addEventListener('click', () => setGridColor('#00f0ff'));
btnGridRed?.addEventListener('click', () => setGridColor('#ff334b'));

// Grid Cyber Glow & Horizon Bloom Handlers
const gridGlowToggle = document.getElementById('fx-grid-glow-enable');
const gridGlowControls = document.getElementById('fx-grid-glow-controls');
const gridGlowSlider = document.getElementById('fx-grid-glow-intensity');
const gridGlowVal = document.getElementById('fx-grid-glow-val');

gridGlowToggle?.addEventListener('change', (e) => {
  fxState.grid.glowEnabled = e.target.checked;
  if (gridGlowControls) {
    gridGlowControls.style.display = e.target.checked ? 'block' : 'none';
  }
});

gridGlowSlider?.addEventListener('input', (e) => {
  const pct = parseInt(e.target.value, 10);
  fxState.grid.glowIntensity = pct / 100;
  if (gridGlowVal) gridGlowVal.textContent = `${pct}%`;
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

// Bottom Fire Glow Toggle Handler
const fireGlowToggle = document.getElementById('fx-fire-glow-enable');
const fireGlowControls = document.getElementById('fx-fire-glow-controls');
fireGlowToggle?.addEventListener('change', (e) => {
  fxState.particles.glowEnabled = e.target.checked;
  if (fireGlowControls) {
    fireGlowControls.style.display = e.target.checked ? 'block' : 'none';
  }
});

// Fire & Ember Color Handlers
const fireColorPicker = document.getElementById('fx-fire-color');
const btnFireDefault = document.getElementById('btn-fire-color-default');
const btnFireCyan = document.getElementById('btn-fire-color-cyan');
const btnFirePurple = document.getElementById('btn-fire-color-purple');
const btnFireGreen = document.getElementById('btn-fire-color-green');

function setFireColor(hex) {
  fxState.particles.color = hex;
  if (fireColorPicker) fireColorPicker.value = hex;
  if (btnFireDefault) btnFireDefault.classList.toggle('active', hex.toLowerCase() === '#ff4114');
  if (btnFireCyan) btnFireCyan.classList.toggle('active', hex.toLowerCase() === '#00f0ff');
  if (btnFirePurple) btnFirePurple.classList.toggle('active', hex.toLowerCase() === '#b55fe6');
  if (btnFireGreen) btnFireGreen.classList.toggle('active', hex.toLowerCase() === '#00e676');
}

fireColorPicker?.addEventListener('input', (e) => {
  setFireColor(e.target.value);
});
btnFireDefault?.addEventListener('click', () => setFireColor('#ff4114'));
btnFireCyan?.addEventListener('click', () => setFireColor('#00f0ff'));
btnFirePurple?.addEventListener('click', () => setFireColor('#b55fe6'));
btnFireGreen?.addEventListener('click', () => setFireColor('#00e676'));


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

// Sidebar Image Cutout & Vector FX Quick Toggles
document.getElementById('btn-sidebar-cutout')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.trackType === 'image') {
    toggleBackgroundRemoval(selectedClip.clip);
    selectClip(selectedClip.clip, 'image');
  }
});

document.getElementById('btn-sidebar-vector')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.trackType === 'image') {
    toggleMagnatesVectorEffect(selectedClip.clip);
    selectClip(selectedClip.clip, 'image');
  }
});

// Sidebar Zoom Effect Mode Toggles (Punch Zoom & Loupe)
document.getElementById('btn-inspector-snap-zoom')?.addEventListener('click', () => {
  if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    const clip = selectedClip.clip;
    clip.zoomEffect = clip.zoomEffect === 'snap' ? null : 'snap';
    if (!clip.zoomScale) clip.zoomScale = 2.2;
    if (clip.zoomStartTime === undefined) clip.zoomStartTime = 0.5;
    if (clip.zoomOriginX === undefined) clip.zoomOriginX = 0.5;
    if (clip.zoomOriginY === undefined) clip.zoomOriginY = 0.5;
    if (clip.zoomEffect === 'snap') playSFX('snap_zoom');
    selectClip(clip, selectedClip.trackType);
    recordState('Toggle Punch Zoom Effect');
  }
});

document.getElementById('btn-inspector-loupe-zoom')?.addEventListener('click', () => {
  if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    const clip = selectedClip.clip;
    clip.zoomEffect = clip.zoomEffect === 'loupe' ? null : 'loupe';
    if (!clip.zoomScale) clip.zoomScale = 2.2;
    if (!clip.loupeRadius) clip.loupeRadius = 120;
    if (clip.zoomStartTime === undefined) clip.zoomStartTime = 0.5;
    if (clip.zoomOriginX === undefined) clip.zoomOriginX = 0.5;
    if (clip.zoomOriginY === undefined) clip.zoomOriginY = 0.5;
    if (clip.zoomEffect === 'loupe') playSFX('snap_zoom');
    selectClip(clip, selectedClip.trackType);
    recordState('Toggle Loupe Callout Effect');
  }
});

document.getElementById('inspector-zoom-scale')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 10;
    selectedClip.clip.zoomScale = val;
    const lbl = document.getElementById('inspector-zoom-scale-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}x`;
  }
});
document.getElementById('inspector-zoom-scale')?.addEventListener('change', () => {
  recordState('Change Zoom Scale');
});

// Callout Shape Toggles (Circle Lens vs Rectangular Box)
document.getElementById('btn-loupe-shape-circle')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.loupeShape = 'circle';
    document.getElementById('btn-loupe-shape-circle')?.classList.add('active');
    document.getElementById('btn-loupe-shape-rect')?.classList.remove('active');
    const lbl = document.getElementById('label-loupe-size');
    if (lbl) lbl.textContent = 'Lens Radius';
    recordState('Set Loupe Shape: Circle');
  }
});

document.getElementById('btn-loupe-shape-rect')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.loupeShape = 'rect';
    document.getElementById('btn-loupe-shape-rect')?.classList.add('active');
    document.getElementById('btn-loupe-shape-circle')?.classList.remove('active');
    const lbl = document.getElementById('label-loupe-size');
    if (lbl) lbl.textContent = 'Box Size';
    recordState('Set Loupe Shape: Rectangle');
  }
});

document.getElementById('inspector-loupe-radius')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value);
    selectedClip.clip.loupeRadius = val;
    const lbl = document.getElementById('inspector-loupe-radius-val');
    if (lbl) lbl.textContent = `${val}px`;
  }
});
document.getElementById('inspector-loupe-radius')?.addEventListener('change', () => {
  recordState('Change Loupe Radius');
});

document.getElementById('inspector-zoom-start')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 10;
    selectedClip.clip.zoomStartTime = val;
    const lbl = document.getElementById('inspector-zoom-start-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}s`;
  }
});
document.getElementById('inspector-zoom-start')?.addEventListener('change', () => {
  recordState('Change Zoom Timing');
});

// Reset Clip Properties to Default (Local Reset)
document.getElementById('btn-reset-inspector-clip')?.addEventListener('click', () => {
  if (selectedClip) {
    selectedClip.clip.volume = 100;
    selectedClip.clip.soundEnabled = true;
    selectedClip.clip.layerOrder = selectedClip.trackType === 'text' ? 'front' : 'back';
    selectedClip.clip.zIndex = selectedClip.trackType === 'text' ? 30 : 10;
    // Reset image / video canvas transform & zoom
    if (selectedClip.trackType === 'image' || selectedClip.trackType === 'video') {
      selectedClip.clip.x = 0;
      selectedClip.clip.y = 0;
      selectedClip.clip.scale = 1.0;
      delete selectedClip.clip.zoomEffect;
      delete selectedClip.clip.zoomScale;
      delete selectedClip.clip.zoomStartTime;
      delete selectedClip.clip.zoomOriginX;
      delete selectedClip.clip.zoomOriginY;
      delete selectedClip.clip.loupeRadius;
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

    // Live sync into floating on-screen canvas text editor if open
    const screenInput = document.getElementById('screen-text-input');
    const editorContainer = document.getElementById('canvas-text-editor-container');
    if (editorContainer && editorContainer.style.display !== 'none' && screenInput) {
      if (screenInput.value !== active.text) {
        screenInput.value = active.text || '';
      }
      screenInput.style.fontFamily = active.fontFamily || "'Inter', sans-serif";
      screenInput.style.color = active.textColor || '#ffffff';
    }

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

// Marquee Box Selection for Custom Area Zoom & Loupe
let isMarqueeDragging = false;
let marqueeStartPt = { x: 0, y: 0 };
let marqueeCurrentPt = { x: 0, y: 0 };
let marqueeTargetClip = null;

function initCanvasTransformInteraction() {
  canvas.addEventListener('mousedown', (e) => {
    const pt = getCanvasPointer(e);

    // ==================== PUNCH ZOOM & LOUPE CALLOUT TOOL (CLICK OR MARQUEE DRAG) ====================
    if (activeTool === 'snap-zoom' || activeTool === 'loupe') {
      // Find top visible image or video layer clicked on
      const activeMedia = [...timelineClips.image, ...timelineClips.video].filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
      let targetMediaClip = null;
      for (let i = activeMedia.length - 1; i >= 0; i--) {
        const c = activeMedia[i];
        const b = c._renderBounds;
        if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
          targetMediaClip = c;
          break;
        }
      }

      if (targetMediaClip) {
        // Start marquee drag selection
        isMarqueeDragging = true;
        marqueeStartPt = pt;
        marqueeCurrentPt = pt;
        marqueeTargetClip = targetMediaClip;
        e.preventDefault();
        return;
      }
    }

    // If not in select tool mode, ignore transform actions
    if (activeTool !== 'select') return;

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

    // 2. If a chart or image/video clip is selected, check if click hit handles or bounding box
    if (selectedClip && (selectedClip.trackType === 'chart' || selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
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

        // Check if inside bounding box to drag / reposition
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

    // 3. Check if user clicked on any visible Chart layer to select it
    const activeChartClips = (timelineClips.chart || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeChartClips.length - 1; i >= 0; i--) {
      const c = activeChartClips[i];
      const b = c._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(c, 'chart');
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

    // 4. Check if user clicked on any visible Text layer to select and drag it
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

    // 5. Check if user clicked on any visible image or video layer to select it
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

  // Double-click on canvas: If double-clicking a Chart, open the Big Center Modal to visually edit it
  canvas.addEventListener('dblclick', (e) => {
    const pt = getCanvasPointer(e);
    const activeChartClips = (timelineClips.chart || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeChartClips.length - 1; i >= 0; i--) {
      const c = activeChartClips[i];
      const b = c._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(c, 'chart');
        openChartEditorModalForClip(c);
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
    // If currently dragging marquee selection for zoom or loupe
    if (isMarqueeDragging) {
      marqueeCurrentPt = getCanvasPointer(e);
      return;
    }

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

  window.addEventListener('mouseup', (e) => {
    // Finish Marquee Dragging for Zoom / Loupe Tool
    if (isMarqueeDragging && marqueeTargetClip) {
      isMarqueeDragging = false;
      const b = marqueeTargetClip._renderBounds;
      if (b) {
        const x1 = Math.min(marqueeStartPt.x, marqueeCurrentPt.x);
        const y1 = Math.min(marqueeStartPt.y, marqueeCurrentPt.y);
        const x2 = Math.max(marqueeStartPt.x, marqueeCurrentPt.x);
        const y2 = Math.max(marqueeStartPt.y, marqueeCurrentPt.y);
        const dragDist = Math.hypot(x2 - x1, y2 - y1);

        const effectType = activeTool === 'snap-zoom' ? 'snap' : 'loupe';
        marqueeTargetClip.zoomEffect = effectType;

        if (dragDist > 16) {
          // USER DRAGGED A CUSTOM AREA / RECTANGLE
          const selCenterCanvasX = (x1 + x2) / 2;
          const selCenterCanvasY = (y1 + y2) / 2;
          const selWidth = Math.max(30, x2 - x1);
          const selHeight = Math.max(20, y2 - y1);

          // Calculate normalized center origin on target image
          const normX = Math.max(0.02, Math.min(0.98, (selCenterCanvasX - b.x) / b.w));
          const normY = Math.max(0.02, Math.min(0.98, (selCenterCanvasY - b.y) / b.h));
          marqueeTargetClip.zoomOriginX = normX;
          marqueeTargetClip.zoomOriginY = normY;

          if (effectType === 'snap') {
            // Calculate optimal punch zoom magnification to fit selected area
            const scaleFactorX = b.w / selWidth;
            const scaleFactorY = b.h / selHeight;
            const optimalScale = Math.min(3.8, Math.max(1.4, Math.min(scaleFactorX, scaleFactorY)));
            marqueeTargetClip.zoomScale = parseFloat(optimalScale.toFixed(1));
          } else {
            // Loupe Callout: Set to Rect Box Shape matching the dragged proportion!
            marqueeTargetClip.loupeShape = 'rect';
            marqueeTargetClip.loupeWidth = Math.round(selWidth * 1.35);
            marqueeTargetClip.loupeHeight = Math.round(selHeight * 1.35);
            marqueeTargetClip.loupeRadius = Math.round(Math.max(selWidth, selHeight) / 2);
            marqueeTargetClip.zoomScale = 2.4;
          }

          const relTime = Math.max(0, currentTime - marqueeTargetClip.start);
          marqueeTargetClip.zoomStartTime = parseFloat(relTime.toFixed(1));

          playSFX('snap_zoom');
          const trackType = timelineClips.image.includes(marqueeTargetClip) ? 'image' : 'video';
          selectClip(marqueeTargetClip, trackType);
          recordState(`Set ${effectType === 'snap' ? 'Punch Zoom' : 'Rectangle Loupe'} Area (${Math.round(selWidth)}x${Math.round(selHeight)})`);
          showTextTimingAlert(`Zoom area selected! (${Math.round(selWidth)}x${Math.round(selHeight)})`, 'success');
          setTimeout(() => showTextTimingAlert(''), 2500);
        } else {
          // SIMPLE CLICK (NO DRAG)
          const normX = Math.max(0.05, Math.min(0.95, (marqueeStartPt.x - b.x) / b.w));
          const normY = Math.max(0.05, Math.min(0.95, (marqueeStartPt.y - b.y) / b.h));
          marqueeTargetClip.zoomOriginX = normX;
          marqueeTargetClip.zoomOriginY = normY;
          if (!marqueeTargetClip.zoomScale) marqueeTargetClip.zoomScale = 2.2;
          if (!marqueeTargetClip.loupeRadius) marqueeTargetClip.loupeRadius = 120;
          const relTime = Math.max(0, currentTime - marqueeTargetClip.start);
          marqueeTargetClip.zoomStartTime = parseFloat(relTime.toFixed(1));

          playSFX('snap_zoom');
          const trackType = timelineClips.image.includes(marqueeTargetClip) ? 'image' : 'video';
          selectClip(marqueeTargetClip, trackType);
          recordState(`Add ${effectType === 'snap' ? 'Punch Zoom' : 'Loupe Callout'} at (${Math.round(normX * 100)}%, ${Math.round(normY * 100)}%)`);
          showTextTimingAlert(`${effectType === 'snap' ? 'Punch Zoom' : 'Loupe Callout'} placed!`, 'success');
          setTimeout(() => showTextTimingAlert(''), 2500);
        }
      }
      marqueeTargetClip = null;
      return;
    }

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

  // Right-click on canvas to open image / clip context menu
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const pt = getCanvasPointer(e);

    // 1. Check if clicked on any active image or video layer (topmost first)
    const activeMediaClips = [...timelineClips.image, ...timelineClips.video].filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeMediaClips.length - 1; i >= 0; i--) {
      const c = activeMediaClips[i];
      const b = c._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        const trackType = timelineClips.image.includes(c) ? 'image' : 'video';
        selectClip(c, trackType);
        showStudioContextMenu(e.clientX, e.clientY, c, trackType);
        return;
      }
    }

    // 2. Check if clicked on active kinetic text
    const activeTextClips = timelineClips.text.filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeTextClips.length - 1; i >= 0; i--) {
      const t = activeTextClips[i];
      const b = t._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(t, 'text');
        showStudioContextMenu(e.clientX, e.clientY, t, 'text');
        return;
      }
    }

    // 3. Check if right-clicked on an active drawing stroke on screen
    if (drawingStrokes.length > 0) {
      for (let sIdx = drawingStrokes.length - 1; sIdx >= 0; sIdx--) {
        const s = drawingStrokes[sIdx];
        if (s.points && s.points.some(p => Math.hypot(p.x - pt.x, p.y - pt.y) <= Math.max(16, s.size * 2))) {
          // Find drawing clip or prompt context menu for current vector sketch
          const activeDrawClip = timelineClips.image.find(c => c.drawingStrokes && currentTime >= c.start && currentTime <= (c.start + c.duration));
          if (activeDrawClip) {
            selectClip(activeDrawClip, 'image');
            showStudioContextMenu(e.clientX, e.clientY, activeDrawClip, 'image');
            return;
          } else {
            // Auto-group strokes to temporary layer or open context menu for screen drawing
            const tempDrawingClip = {
              id: 'clip-screen-drawing',
              name: 'Screen Drawing',
              drawingStrokes: drawingStrokes,
              drawMode: 'live',
              staggerParts: false,
              start: currentTime,
              duration: 4.0,
              layerOrder: 'front',
              zIndex: 40
            };
            showStudioContextMenu(e.clientX, e.clientY, tempDrawingClip, 'image');
            return;
          }
        }
      }
    }

    // 4. Fallback: if a clip is currently selected, open menu for it
    if (selectedClip && selectedClip.clip) {
      showStudioContextMenu(e.clientX, e.clientY, selectedClip.clip, selectedClip.trackType);
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
  if (typeof updateAppleFullscreenHud === 'function') {
    updateAppleFullscreenHud();
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

// ==================== APPLE-STYLE FULLSCREEN FLOATING HUD CONTROLLER ====================
const fsAppleHudContainer = document.getElementById('fs-apple-hud-container');
const fsAppleDotPill = document.getElementById('fs-apple-dot-pill');
const fsApplePopover = document.getElementById('fs-apple-popover');
let isAppleHudOpen = false;

function isCanvasInFullscreen() {
  return !!document.fullscreenElement || !!canvasWrapper?.classList.contains('is-immersive-fallback');
}

function updateAppleFullscreenHud() {
  if (!fsAppleHudContainer) return;
  const inFs = isCanvasInFullscreen();
  
  if (!inFs) {
    fsAppleHudContainer.style.display = 'none';
    if (fsApplePopover) fsApplePopover.style.display = 'none';
    fsAppleHudContainer.classList.remove('is-open');
    isAppleHudOpen = false;
    return;
  }

  // We are in fullscreen
  fsAppleHudContainer.style.display = 'flex';

  const dotThumb = document.getElementById('fs-dot-thumb');
  const dotLabel = document.getElementById('fs-dot-label');
  const dotBadge = document.getElementById('fs-dot-badge');
  const popoverTitle = document.getElementById('fs-popover-title');
  const popoverTag = document.getElementById('fs-popover-tag');
  const valScale = document.getElementById('fs-val-scale');
  const inputScale = document.getElementById('fs-input-scale');
  const lblTiming = document.getElementById('fs-lbl-timing');

  const cur = selectedClip?.clip;
  const track = selectedClip?.trackType;

  if (cur) {
    const name = cur.name || cur.file?.name || cur.text || 'Selected Clip';
    const scalePct = Math.round((cur.scale || 1) * 100);

    if (dotLabel) dotLabel.textContent = name;
    if (dotBadge) dotBadge.textContent = `${scalePct}%`;
    if (popoverTitle) popoverTitle.textContent = name;
    if (popoverTag) popoverTag.textContent = cur.drawingStrokes ? 'DRAWING' : (track ? track.toUpperCase() : 'CLIP');

    if (valScale) valScale.textContent = `${scalePct}%`;
    if (inputScale) inputScale.value = scalePct;

    if (lblTiming) {
      lblTiming.textContent = `${formatTimecode(cur.start)} - ${formatTimecode(cur.start + cur.duration)}`;
    }

    // Set thumbnail
    if (dotThumb) {
      if (cur.drawingStrokes) {
        dotThumb.innerHTML = `<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:#ff334b;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>`;
      } else if (track === 'image' && cur.file?.url) {
        dotThumb.innerHTML = `<img src="${cur.file.url}" alt="">`;
      } else if (track === 'video' && cur.file?.url) {
        dotThumb.innerHTML = `<video src="${cur.file.url}" muted></video>`;
      } else {
        dotThumb.innerHTML = `<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:#ff334b;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
      }
    }

    // Update Action States
    const actCutout = document.getElementById('fs-act-cutout');
    const lblCutout = document.getElementById('fs-lbl-cutout');
    if (actCutout && lblCutout) {
      const hasCutout = !!cur.cutoutCanvas;
      actCutout.classList.toggle('is-active', hasCutout);
      lblCutout.textContent = hasCutout ? 'Restore BG' : 'Remove BG';
    }

    const actVector = document.getElementById('fs-act-vector');
    const lblVector = document.getElementById('fs-lbl-vector');
    if (actVector && lblVector) {
      const hasVector = !!cur.vectorEffect;
      actVector.classList.toggle('is-active-cyan', hasVector);
      lblVector.textContent = hasVector ? 'Vector (On)' : 'Vector FX';
    }

    const actZoom = document.getElementById('fs-act-zoom');
    const lblZoom = document.getElementById('fs-lbl-zoom');
    if (actZoom && lblZoom) {
      const hasZoom = !!cur.zoomEffect;
      actZoom.classList.toggle('is-active-cyan', hasZoom);
      lblZoom.textContent = hasZoom ? (cur.zoomEffect === 'snap' ? 'Punch (On)' : 'Loupe (On)') : 'Punch Zoom';
    }

    const actFront = document.getElementById('fs-act-front');
    const actBack = document.getElementById('fs-act-back');
    const isFront = (cur.layerOrder === 'front');
    if (actFront) actFront.classList.toggle('is-active', isFront);
    if (actBack) actBack.classList.toggle('is-active', !isFront);
  } else {
    // Ambient / Nothing explicitly selected
    if (dotLabel) dotLabel.textContent = 'Full Screen';
    if (dotBadge) dotBadge.textContent = 'Studio';
    if (popoverTitle) popoverTitle.textContent = 'Magnates Studio';
    if (popoverTag) popoverTag.textContent = 'VIEWPORT';
    const mainTimecode = document.getElementById('timecode');
    if (lblTiming) lblTiming.textContent = mainTimecode?.textContent || '00:00.00';
  }
}

// Toggle Popover HUD open/closed
function toggleAppleHud(forceState) {
  if (!fsApplePopover || !fsAppleHudContainer) return;
  isAppleHudOpen = forceState !== undefined ? forceState : !isAppleHudOpen;
  
  if (isAppleHudOpen) {
    updateAppleFullscreenHud();
    fsApplePopover.style.display = 'flex';
    fsAppleHudContainer.classList.add('is-open');
  } else {
    fsApplePopover.style.display = 'none';
    fsAppleHudContainer.classList.remove('is-open');
  }
}

fsAppleDotPill?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleAppleHud();
});

document.getElementById('fs-popover-close')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleAppleHud(false);
});

// Prevent clicking inside HUD from collapsing or firing canvas events
fsApplePopover?.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Quick Action Click Handlers inside HUD
document.getElementById('fs-act-cutout')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (selectedClip && selectedClip.clip) {
    toggleBackgroundRemoval(selectedClip.clip);
    updateAppleFullscreenHud();
  } else {
    showTextTimingAlert('Select an image clip to remove background.', 'warning');
  }
});

document.getElementById('fs-act-vector')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (selectedClip && selectedClip.clip) {
    toggleMagnatesVectorEffect(selectedClip.clip);
    updateAppleFullscreenHud();
  } else {
    showTextTimingAlert('Select an image clip for vector effect.', 'warning');
  }
});

document.getElementById('fs-act-silhouette')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const silToggle = document.getElementById('fx-silhouette-enable');
  if (silToggle) {
    silToggle.checked = !silToggle.checked;
    silToggle.dispatchEvent(new Event('change'));
    document.getElementById('fs-act-silhouette')?.classList.toggle('is-active', silToggle.checked);
    showTextTimingAlert(silToggle.checked ? 'Silhouette mode enabled' : 'Silhouette mode disabled', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

document.getElementById('fs-act-zoom')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const c = selectedClip?.clip;
  if (!c) {
    showTextTimingAlert('Select an image or video clip first.', 'warning');
    return;
  }
  c.zoomEffect = c.zoomEffect === 'snap' ? null : 'snap';
  if (!c.zoomScale) c.zoomScale = 2.2;
  if (c.zoomStartTime === undefined) c.zoomStartTime = 0.5;
  if (c.zoomOriginX === undefined) c.zoomOriginX = 0.5;
  if (c.zoomOriginY === undefined) c.zoomOriginY = 0.5;
  if (c.zoomEffect === 'snap') playSFX('snap_zoom');
  selectClip(c, selectedClip.trackType);
  updateAppleFullscreenHud();
  recordState('Toggle Punch Zoom Effect');
});

// Scale Slider in HUD
document.getElementById('fs-input-scale')?.addEventListener('input', (e) => {
  const c = selectedClip?.clip;
  if (!c) return;
  const pct = parseInt(e.target.value, 10);
  c.scale = pct / 100;
  const valScale = document.getElementById('fs-val-scale');
  const dotBadge = document.getElementById('fs-dot-badge');
  if (valScale) valScale.textContent = `${pct}%`;
  if (dotBadge) dotBadge.textContent = `${pct}%`;
  renderAllTimelineTracks();
});

// Layer Order in HUD
document.getElementById('fs-act-front')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const c = selectedClip?.clip;
  if (!c) return;
  c.layerOrder = 'front';
  c.zIndex = 50;
  updateAppleFullscreenHud();
  renderAllTimelineTracks();
  recordState('Bring Clip to Front');
});

document.getElementById('fs-act-back')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const c = selectedClip?.clip;
  if (!c) return;
  c.layerOrder = 'back';
  c.zIndex = 10;
  updateAppleFullscreenHud();
  renderAllTimelineTracks();
  recordState('Send Clip Behind Text');
});

document.getElementById('fs-act-center')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const c = selectedClip?.clip;
  if (!c) return;
  c.x = 0;
  c.y = 0;
  updateAppleFullscreenHud();
  renderAllTimelineTracks();
  recordState('Center Clip');
  showTextTimingAlert('Centered clip coordinates.', 'success');
  setTimeout(() => showTextTimingAlert(''), 2000);
});

document.getElementById('fs-act-del')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (selectedClip && selectedClip.clip) {
    const track = selectedClip.trackType;
    const id = selectedClip.clip.id;
    recordState('Delete Clip');
    deleteClip(track, id);
    selectedClip = null;
    toggleAppleHud(false);
  }
});

// More Options -> Opens the Studio Context Menu at HUD center
document.getElementById('fs-btn-more-options')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (selectedClip && selectedClip.clip) {
    const rect = fsAppleHudContainer.getBoundingClientRect();
    showStudioContextMenu(rect.left - 230, rect.top + 40, selectedClip.clip, selectedClip.trackType);
    toggleAppleHud(false);
  }
});

// Hook into fullscreenchange to show/hide HUD
function syncFullscreenHud() {
  updateAppleFullscreenHud();
}
document.addEventListener('fullscreenchange', syncFullscreenHud);

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

  // For media clips, serialize clip state and media file info (persisted across reloads)
  function serializeMediaClips(clips) {
    return clips.map(c => ({
      id: c.id,
      track: c.track,
      start: c.start,
      duration: c.duration,
      volume: c.volume,
      soundEnabled: c.soundEnabled,
      layerOrder: c.layerOrder,
      zIndex: c.zIndex,
      x: c.x,
      y: c.y,
      scale: c.scale,
      vectorEffect: c.vectorEffect,
      vectorStrokeColor: c.vectorStrokeColor,
      zoomEffect: c.zoomEffect,
      zoomScale: c.zoomScale,
      zoomStartTime: c.zoomStartTime,
      zoomOriginX: c.zoomOriginX,
      zoomOriginY: c.zoomOriginY,
      loupeRadius: c.loupeRadius,
      loupeShape: c.loupeShape,
      loupeWidth: c.loupeWidth,
      loupeHeight: c.loupeHeight,
      drawingStrokes: c.drawingStrokes ? JSON.parse(JSON.stringify(c.drawingStrokes)) : undefined,
      drawingFills: c.drawingFills ? JSON.parse(JSON.stringify(c.drawingFills)) : undefined,
      drawMode: c.drawMode,
      staggerParts: c.staggerParts,
      chartConfig: c.chartConfig ? JSON.parse(JSON.stringify(c.chartConfig)) : undefined,
      isIconSticker: c.isIconSticker,
      iconType: c.iconType,
      file: c.file ? {
        name: c.file.name,
        url: c.file.url,
        isAudio: c.file.isAudio,
        isVideo: c.file.isVideo,
        isImage: c.file.isImage,
        duration: c.file.duration
      } : null
    }));
  }

  return {
    text: textClips,
    chart: serializeMediaClips(timelineClips.chart || []),
    image: serializeMediaClips(timelineClips.image || []),
    video: serializeMediaClips(timelineClips.video || []),
    voiceover: serializeMediaClips(timelineClips.voiceover || []),
    music: serializeMediaClips(timelineClips.music || []),
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

    // Restore text clips
    if (state.text && state.text.length > 0) {
      timelineClips.text = state.text;
    }

    // Restore media and chart clips directly
    ['chart', 'image', 'video', 'voiceover', 'music'].forEach(trackType => {
      if (state[trackType] && state[trackType].length > 0) {
        timelineClips[trackType] = state[trackType];
      }
    });

    if (typeof state.duration === 'number') duration = state.duration;
  } catch(e) {}
}

// Manual save button
document.getElementById('btn-save-project')?.addEventListener('click', () => {
  saveProjectState(true);
});

// Periodic auto-save every 5 seconds
setInterval(() => saveProjectState(false), 5000);

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
    let audioStream = null;
    try {
      const audioContextClass = window.AudioContext || window.webkitAudioContext;
      if (audioContextClass) {
        const exportAudioCtx = new audioContextClass();
        if (exportAudioCtx.state === 'suspended') {
          await exportAudioCtx.resume();
        }
        const audioDest = exportAudioCtx.createMediaStreamDestination();
        let connectedAudio = false;

        // Connect main voiceover audio if present and ready
        if (audioPlayer && audioPlayer.src && audioPlayer.readyState >= 2) {
          try {
            const voiceSource = exportAudioCtx.createMediaElementSource(audioPlayer);
            voiceSource.connect(audioDest);
            voiceSource.connect(exportAudioCtx.destination);
            connectedAudio = true;
          } catch(e) {}
        }

        // Connect bgm audio if present and ready
        if (bgmPlayer && bgmPlayer.src && bgmPlayer.readyState >= 2) {
          try {
            const bgmSource = exportAudioCtx.createMediaElementSource(bgmPlayer);
            bgmSource.connect(audioDest);
            bgmSource.connect(exportAudioCtx.destination);
            connectedAudio = true;
          } catch(e) {}
        }

        if (connectedAudio && audioDest.stream.getAudioTracks().length > 0) {
          audioStream = audioDest.stream;
        }
      }
    } catch (aErr) {
      console.warn('Audio stream mixing bypassed:', aErr);
    }

    // 2. Capture Canvas Stream (30 FPS standard high compatibility)
    const canvasStream = canvas.captureStream ? canvas.captureStream(30) : canvas.mozCaptureStream(30);
    const combinedTracks = [...canvasStream.getVideoTracks()];

    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combinedTracks.push(...audioStream.getAudioTracks());
    }

    const combinedStream = new MediaStream(combinedTracks);

    // Pick best supported MIME type with broad player support (VLC, Chrome, Windows Media)
    let mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = '';
    }

    exportChunks = [];
    const recorderOptions = mimeType ? { mimeType, videoBitsPerSecond: 5000000 } : { videoBitsPerSecond: 5000000 };
    exportRecorder = new MediaRecorder(combinedStream, recorderOptions);

    exportRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        exportChunks.push(e.data);
      }
    };

    const totalExportDuration = Math.min(duration || 30, Math.max(3, getTimelineMaxEndTime()));

    exportRecorder.onstop = () => {
      const finalMime = mimeType || 'video/webm';
      const blob = new Blob(exportChunks, { type: finalMime });

      // Diagnostic check: Ensure export file is not 0 bytes
      if (blob.size === 0) {
        alert('Export warning: Captured 0 bytes. Trying direct canvas frame fallback.');
        isExporting = false;
        btnExport.disabled = false;
        btnExport.style.opacity = '1';
        btnExport.innerHTML = originalBtnHTML;
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const ext = finalMime.includes('mp4') ? 'mp4' : 'webm';
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
      }, 3000);

      // Reset export state
      isExporting = false;
      btnExport.disabled = false;
      btnExport.style.opacity = '1';
      btnExport.innerHTML = originalBtnHTML;
      showTextTimingAlert(`Video exported successfully (${(blob.size / (1024 * 1024)).toFixed(1)} MB)!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 4500);

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

    // 3. Start Recording with periodic timeslices
    exportRecorder.start(250);

    // Playback loop from 0
    seekToTime(0);
    isPlaying = true;
    if (audioPlayer.src) audioPlayer.play().catch(() => {});
    if (bgmPlayer.src) bgmPlayer.play().catch(() => {});

    // Ensure initial canvas frame is rendered immediately
    render(performance.now());

    const checkInterval = setInterval(() => {
      if (!isExporting) {
        clearInterval(checkInterval);
        return;
      }

      // Request data from recorder
      if (exportRecorder && exportRecorder.state === 'recording') {
        try {
          exportRecorder.requestData();
        } catch(e) {}
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
    }, 200);

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

// ==================== STUDIO CONTEXT MENU & MAGNATES VECTOR / CUTOUT ENGINE ====================
let activeStudioContextMenu = null;

function hideStudioContextMenu() {
  if (activeStudioContextMenu) {
    activeStudioContextMenu.remove();
    activeStudioContextMenu = null;
  }
}

document.addEventListener('click', () => hideStudioContextMenu());
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideStudioContextMenu();
});

function showStudioContextMenu(x, y, clip, trackType) {
  hideStudioContextMenu();
  if (!clip) return;

  const menu = document.createElement('div');
  menu.className = 'studio-context-menu';
  activeStudioContextMenu = menu;

  const clipLabel = clip.name || clip.file?.name || clip.text || (trackType.toUpperCase() + ' Clip');
  const isImage = trackType === 'image';
  const isDrawing = isImage && !!clip.drawingStrokes;
  const hasCutout = isImage && !!clip.cutoutCanvas;
  const hasVector = isImage && !!clip.vectorEffect;
  const isFront = (clip.layerOrder === 'front');

  let itemsHtml = `
    <div class="context-menu-header">
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;">${clipLabel}</span>
      <span class="context-badge">${isDrawing ? 'DRAWING' : trackType.toUpperCase()}</span>
    </div>
  `;

  if (isDrawing) {
    const isLive = clip.drawMode === 'live';
    const isStaggered = clip.staggerParts === true;
    itemsHtml += `
      <!-- Live Speed-Draw Animation (Whiteboard / Write-on) -->
      <div class="context-menu-item ${isLive ? 'active-fx' : ''}" id="ctx-action-draw-live">
        <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        <span>${isLive ? 'Live Speed-Draw (Active)' : 'Animate: Live Speed-Draw'}</span>
        <span class="context-badge">${isLive ? 'On' : 'Write-on'}</span>
      </div>

      <!-- Stroke-by-Stroke Timing / Staggered Part Reveal -->
      <div class="context-menu-item ${isStaggered ? 'active-fx' : ''}" id="ctx-action-draw-stagger">
        <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        <span>${isStaggered ? 'Stagger Parts: Head → Body' : 'Stagger Stroke Timing'}</span>
        <span class="context-badge">${isStaggered ? 'Sequential' : 'Instant'}</span>
      </div>

      <!-- Fill Hollow / Enclosed Shape -->
      <div class="context-menu-item" id="ctx-action-draw-fill">
        <svg viewBox="0 0 24 24"><path d="M19 11.5s-2-2.17-2-3.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 1.33-1 3.5-1 3.5zm-3.86-1.07l-6.57-6.57a.996.996 0 0 0-1.41 0L2.71 8.31a.996.996 0 0 0 0 1.41l7.07 7.07c.39.39 1.02.39 1.41 0l4.57-4.57c.39-.39.39-1.02-.02-1.41z"/></svg>
        <span>Fill Enclosed Shape (Color In)</span>
        <span class="context-badge" style="color: #ff334b;">Bucket</span>
      </div>

      <!-- Add Text Overlay -->
      <div class="context-menu-item" id="ctx-action-add-text">
        <svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>
        <span>Add Kinetic Caption</span>
        <span class="context-badge" style="color: #00f0ff;">Caption</span>
      </div>

      <div class="context-menu-divider"></div>
    `;
  } else if (isImage) {
    itemsHtml += `
      <!-- Add Text Overlay -->
      <div class="context-menu-item" id="ctx-action-add-text">
        <svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>
        <span>Add Text Overlay</span>
        <span class="context-badge" style="color: #ff334b;">Kinetic Text</span>
      </div>

      <!-- Remove Background -->
      <div class="context-menu-item ${hasCutout ? 'active-fx' : ''}" id="ctx-action-cutout">
        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm10-14l-1-1h-6l-1 1H4v2h16V5h-4zM9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z"/></svg>
        <span>${hasCutout ? 'Restore Background' : 'Remove Background'}</span>
        <span class="context-badge">${hasCutout ? 'Active' : 'AI Cutout'}</span>
      </div>

      <!-- Vector / Comic Paper Cutout Style -->
      <div class="context-menu-item ${hasVector ? 'active-fx' : ''}" id="ctx-action-vector">
        <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.27 19.53 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
        <span>${hasVector ? 'Remove Vector FX' : 'Magnates Vector / Paper Cutout'}</span>
        <span class="context-badge">${hasVector ? 'Active' : 'Sticker'}</span>
      </div>

      <!-- Snap / Punch Camera Zoom -->
      <div class="context-menu-item ${clip.zoomEffect === 'snap' ? 'active-fx' : ''}" id="ctx-action-snap-zoom">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>
        <span>${clip.zoomEffect === 'snap' ? 'Remove Punch Zoom' : 'Add Punch Zoom'}</span>
        <span class="context-badge">${clip.zoomEffect === 'snap' ? 'Active' : 'Vox Zoom'}</span>
      </div>

      <!-- Magnifying Loupe / Circular Callout -->
      <div class="context-menu-item ${clip.zoomEffect === 'loupe' ? 'active-fx' : ''}" id="ctx-action-loupe-zoom">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="11" cy="11" r="3.5" fill="currentColor"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        <span>${clip.zoomEffect === 'loupe' ? 'Remove Loupe Lens' : 'Add Loupe Callout'}</span>
        <span class="context-badge">${clip.zoomEffect === 'loupe' ? 'Active' : 'Lens'}</span>
      </div>

      <div class="context-menu-divider"></div>
    `;
  }

  // Layer Arrangement for visual elements
  if (trackType === 'image' || trackType === 'video' || trackType === 'text') {
    itemsHtml += `
      <div class="context-menu-item" id="ctx-action-bring-front">
        <svg viewBox="0 0 24 24"><path d="M8 2h14v14H8V2zM4 6H2v16h16v-2H4V6z"/></svg>
        <span>Bring to Front</span>
        <span class="context-badge">${isFront ? 'Current' : 'Top'}</span>
      </div>
      <div class="context-menu-item" id="ctx-action-send-back">
        <svg viewBox="0 0 24 24"><path d="M2 4h14v14H2V4zm16 4h4v14H8v-4h10V8z"/></svg>
        <span>Send to Back</span>
        <span class="context-badge">${!isFront ? 'Current' : 'Behind Text'}</span>
      </div>
      <div class="context-menu-divider"></div>
    `;
  }

  // Common Clip Utilities
  itemsHtml += `
    <div class="context-menu-item" id="ctx-action-duplicate">
      <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
      <span>Duplicate Clip</span>
    </div>
    <div class="context-menu-item" id="ctx-action-reset">
      <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
      <span>Reset Transform</span>
    </div>
    <div class="context-menu-item danger" id="ctx-action-delete">
      <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      <span>Delete Clip</span>
    </div>
  `;

  menu.innerHTML = itemsHtml;

  // If in fullscreen or immersive mode, append menu inside canvasWrapper so browser doesn't hide it behind top-layer
  const isFsActive = !!document.fullscreenElement || canvasWrapper?.classList.contains('is-immersive-fallback');
  const mountTarget = isFsActive && canvasWrapper ? canvasWrapper : document.body;
  mountTarget.appendChild(menu);

  // Position smartly within viewport bounds (or canvasWrapper bounds if in fullscreen)
  const menuWidth = 220;
  const menuHeight = menu.offsetHeight || 240;
  let posX = x;
  let posY = y;

  if (isFsActive && canvasWrapper) {
    const wrapRect = canvasWrapper.getBoundingClientRect();
    const relX = x - wrapRect.left;
    const relY = y - wrapRect.top;
    posX = Math.min(wrapRect.width - menuWidth - 14, Math.max(14, relX));
    posY = Math.min(wrapRect.height - menuHeight - 14, Math.max(14, relY));
  } else {
    posX = Math.min(window.innerWidth - menuWidth - 10, Math.max(10, x));
    posY = Math.min(window.innerHeight - menuHeight - 10, Math.max(10, y));
  }

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;

  // Attach Event Handlers
  menu.querySelector('#ctx-action-draw-live')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.drawMode = clip.drawMode === 'live' ? 'instant' : 'live';
    selectClip(clip, trackType);
    recordState('Toggle Live Speed-Draw Animation');
    showTextTimingAlert(clip.drawMode === 'live' ? 'Live Speed-Draw Animation Active! Strokes write-on timed to voiceover.' : 'Speed-Draw disabled (Instant reveal).', 'success');
    setTimeout(() => showTextTimingAlert(''), 3000);
  });

  menu.querySelector('#ctx-action-draw-stagger')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.staggerParts = !clip.staggerParts;
    selectClip(clip, trackType);
    recordState('Toggle Staggered Stroke Timing');
    showTextTimingAlert(clip.staggerParts ? 'Staggered Stroke Timing Enabled! Head, body, and legs appear sequentially.' : 'Staggered timing disabled.', 'success');
    setTimeout(() => showTextTimingAlert(''), 3000);
  });

  menu.querySelector('#ctx-action-draw-fill')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    fillClipEnclosedShape(clip);
  });

  menu.querySelector('#ctx-action-add-text')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    // Add text starting at current time or image start time
    const textStart = Math.max(0, clip.start);
    const newTextClip = createNewTextClipAtTime(textStart, 'Enter kinetic text...', '');
    seekToTime(textStart);
    selectClip(newTextClip, 'text');
    openScreenTextEditor(newTextClip);
    showTextTimingAlert(`Added Kinetic Text to overlay "${clipLabel}"!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  });

  menu.querySelector('#ctx-action-cutout')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    toggleBackgroundRemoval(clip);
  });

  menu.querySelector('#ctx-action-vector')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    toggleMagnatesVectorEffect(clip);
  });

  menu.querySelector('#ctx-action-snap-zoom')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.zoomEffect = clip.zoomEffect === 'snap' ? null : 'snap';
    if (!clip.zoomScale) clip.zoomScale = 2.2;
    if (clip.zoomStartTime === undefined) clip.zoomStartTime = 0.5;
    if (clip.zoomOriginX === undefined) clip.zoomOriginX = 0.5;
    if (clip.zoomOriginY === undefined) clip.zoomOriginY = 0.5;
    if (clip.zoomEffect === 'snap') playSFX('snap_zoom');
    selectClip(clip, trackType);
    recordState('Toggle Punch Zoom Effect');
  });

  menu.querySelector('#ctx-action-loupe-zoom')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.zoomEffect = clip.zoomEffect === 'loupe' ? null : 'loupe';
    if (!clip.zoomScale) clip.zoomScale = 2.2;
    if (!clip.loupeRadius) clip.loupeRadius = 120;
    if (clip.zoomStartTime === undefined) clip.zoomStartTime = 0.5;
    if (clip.zoomOriginX === undefined) clip.zoomOriginX = 0.5;
    if (clip.zoomOriginY === undefined) clip.zoomOriginY = 0.5;
    if (clip.zoomEffect === 'loupe') playSFX('snap_zoom');
    selectClip(clip, trackType);
    recordState('Toggle Loupe Callout Effect');
  });

  menu.querySelector('#ctx-action-bring-front')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.layerOrder = 'front';
    clip.zIndex = 50;
    const badge = document.getElementById('inspector-layer-badge');
    if (badge) {
      badge.textContent = 'In Front of Text';
      badge.style.color = '#00f0ff';
    }
    renderAllTimelineTracks();
    recordState('Bring Clip to Front');
  });

  menu.querySelector('#ctx-action-send-back')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.layerOrder = 'back';
    clip.zIndex = 10;
    const badge = document.getElementById('inspector-layer-badge');
    if (badge) {
      badge.textContent = 'Behind Text';
      badge.style.color = 'var(--accent-red)';
    }
    renderAllTimelineTracks();
    recordState('Send Clip Behind Text');
  });

  menu.querySelector('#ctx-action-duplicate')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    const newStart = clip.start + clip.duration + 0.2;
    const dup = addClipToTimeline(trackType, { ...clip.file, ...clip, id: undefined }, newStart, clip.duration);
    seekToTime(newStart);
    recordState('Duplicate Clip');
    showTextTimingAlert(`Duplicated ${clipLabel}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-reset')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.x = 0;
    clip.y = 0;
    clip.scale = 1.0;
    renderAllTimelineTracks();
    recordState('Reset Transform');
  });

  menu.querySelector('#ctx-action-delete')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    recordState('Delete Clip');
    deleteClip(trackType, clip.id);
  });
}

// ==================== BACKGROUND REMOVAL (CUTOUT) ALGORITHM ====================
// Fast high-precision flood-fill & boundary chroma color detection
function toggleBackgroundRemoval(clip) {
  if (!clip || !clip.file) return;

  if (clip.cutoutCanvas) {
    // Already has cutout -> toggle off and restore
    delete clip.cutoutCanvas;
    renderAllTimelineTracks();
    recordState('Restore Original Background');
    showTextTimingAlert('Restored original image background.', 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
    return;
  }

  showTextTimingAlert('Processing background removal cutout...', 'warning');

  const imgEl = getMediaElement(clip.file);
  if (!imgEl || !imgEl.complete || !imgEl.naturalWidth) {
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.src = clip.file.url;
    tempImg.onload = () => {
      processCutout(tempImg, clip);
    };
    return;
  }

  processCutout(imgEl, clip);
}

function processCutout(img, clip) {
  try {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(img, 0, 0, w, h);

    const imgData = offCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Sample border corners to determine key background colors
    const cornerSamples = [
      0, // top-left
      (w - 1) * 4, // top-right
      ((h - 1) * w) * 4, // bottom-left
      ((h - 1) * w + (w - 1)) * 4, // bottom-right
      Math.floor(w / 2) * 4, // top-mid
      ((h - 1) * w + Math.floor(w / 2)) * 4 // bottom-mid
    ];

    const bgColors = cornerSamples.map(idx => ({
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2]
    }));

    // Flood fill mask from the edges to ensure inner foreground with similar colors is preserved
    const visited = new Uint8Array(w * h);
    const queue = [];

    // Push all 4 border edge pixels into queue
    for (let x = 0; x < w; x++) {
      queue.push(x, 0); // top border
      visited[x] = 1;
      const bottomIdx = (h - 1) * w + x;
      queue.push(x, h - 1); // bottom border
      visited[bottomIdx] = 1;
    }
    for (let y = 0; y < h; y++) {
      const leftIdx = y * w;
      if (!visited[leftIdx]) {
        queue.push(0, y);
        visited[leftIdx] = 1;
      }
      const rightIdx = y * w + (w - 1);
      if (!visited[rightIdx]) {
        queue.push(w - 1, y);
        visited[rightIdx] = 1;
      }
    }

    // Color distance helper
    function colorDist(r1, g1, b1, r2, g2, b2) {
      return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    }

    // Check if pixel matches sampled background color profile
    function isBgPixel(r, g, b) {
      // Check distance against sampled corner background colors
      for (let i = 0; i < bgColors.length; i++) {
        if (colorDist(r, g, b, bgColors[i].r, bgColors[i].g, bgColors[i].b) < 42) {
          return true;
        }
      }
      // Also catch bright pure white or near-white background paper
      if (r > 240 && g > 240 && b > 240) return true;
      // Or pure chroma key greens/blues/dark backgrounds
      if (g > 160 && r < 90 && b < 90) return true; // Green screen
      return false;
    }

    let head = 0;
    while (head < queue.length) {
      const qx = queue[head++];
      const qy = queue[head++];
      const pIdx = (qy * w + qx) * 4;

      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];

      if (isBgPixel(r, g, b)) {
        // Set transparent
        data[pIdx + 3] = 0;

        // Check 4 neighbors
        const neighbors = [
          [qx + 1, qy],
          [qx - 1, qy],
          [qx, qy + 1],
          [qx, qy - 1]
        ];

        for (let n = 0; n < 4; n++) {
          const nx = neighbors[n][0];
          const ny = neighbors[n][1];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nIdx = ny * w + nx;
            if (!visited[nIdx]) {
              visited[nIdx] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    // Put image data back to offscreen canvas
    offCtx.putImageData(imgData, 0, 0);
    clip.cutoutCanvas = offCanvas;

    selectClip(clip, 'image');
    renderAllTimelineTracks();
    recordState('Background Cutout Created');
    showTextTimingAlert('Background removed successfully! Ready to layer.', 'success');
    setTimeout(() => showTextTimingAlert(''), 3000);
  } catch(err) {
    console.error('Cutout processing error:', err);
    showTextTimingAlert('Could not remove background: ' + err.message, 'warning');
    setTimeout(() => showTextTimingAlert(''), 3000);
  }
}

// ==================== MAGNATES VECTOR / STICKER EFFECT ====================
function toggleMagnatesVectorEffect(clip) {
  if (!clip) return;
  clip.vectorEffect = !clip.vectorEffect;
  clip.vectorStrokeColor = '#ffffff';

  selectClip(clip, 'image');
  renderAllTimelineTracks();
  recordState(clip.vectorEffect ? 'Apply Vector Paper Cutout' : 'Remove Vector Paper Cutout');
  showTextTimingAlert(clip.vectorEffect ? 'Magnates paper cutout vector style applied!' : 'Vector style disabled.', 'success');
  setTimeout(() => showTextTimingAlert(''), 2500);
}

// ==================== ON-SCREEN DRAWING, HOLD RADIAL MENU & VECTOR ENGINE ====================
let drawingStrokes = []; // Array of { id, penType, color, size, points: [{x, y, p}], opacity, fill, fillColor }
let drawingFills = []; // Array of { id, x, y, color, points } for flood fills / enclosed contours
let currentStroke = null;
let currentPenType = 'pen'; // 'pen', 'brush', 'highlighter', 'arrow', 'fill', 'eraser'
let currentDrawColor = '#ff334b';
let currentDrawSize = 6;
let drawingUndoStack = [];

// Hold / Long Press Timer state
let canvasHoldTimer = null;
let canvasHoldStartPt = null;
let isHoldingOnCanvas = false;
let radialMenuVisible = false;

// 1. Toggle Drawing Dock Visibility
function toggleDrawingDock(show) {
  const dock = document.getElementById('canvas-drawing-dock');
  const radial = document.getElementById('canvas-hold-radial-menu');
  if (dock) dock.style.display = show ? 'flex' : 'none';
  if (!show && radial) radial.style.display = 'none';
}

// 2. Ink Overlay Render Loop function (with Live Speed-Draw Animation & Staggered Part Timing)
function drawScreenInkOverlay(targetCtx, customStrokes = null, customFills = null, progress = 1.0, isStaggered = false) {
  const sourceStrokes = customStrokes || (currentStroke ? [...drawingStrokes, currentStroke] : drawingStrokes);
  const sourceFills = customFills || drawingFills;
  if (!sourceStrokes.length && !sourceFills.length && !currentStroke) return;

  targetCtx.save();

  // 1. Render Enclosed Shape Fills First (so stroke lines stay crisp on top)
  if (sourceFills && sourceFills.length > 0) {
    for (const fill of sourceFills) {
      if (progress < 0.25 && isStaggered) continue; // Reveal fill after contour starts
      targetCtx.save();
      targetCtx.fillStyle = fill.color || currentDrawColor;
      if (fill.contour && fill.contour.length > 2) {
        targetCtx.beginPath();
        targetCtx.moveTo(fill.contour[0].x, fill.contour[0].y);
        for (let i = 1; i < fill.contour.length; i++) {
          targetCtx.lineTo(fill.contour[i].x, fill.contour[i].y);
        }
        targetCtx.closePath();
        targetCtx.globalAlpha = fill.opacity !== undefined ? fill.opacity : 0.88;
        targetCtx.fill();
      } else if (fill.imgCanvas) {
        targetCtx.drawImage(fill.imgCanvas, 0, 0);
      }
      targetCtx.restore();
    }
  }

  // 2. Render Strokes (Progressively drawn if speed-draw mode is active)
  const totalStrokes = sourceStrokes.length;
  if (totalStrokes === 0) {
    targetCtx.restore();
    return;
  }

  const effectiveProgress = Math.min(1.0, Math.max(0.0, progress));

  for (let sIdx = 0; sIdx < totalStrokes; sIdx++) {
    const stroke = sourceStrokes[sIdx];
    if (!stroke.points || stroke.points.length === 0) continue;

    // Calculate how much of this stroke is visible based on overall clip progress
    let strokeFraction = 1.0;
    if (effectiveProgress < 1.0) {
      if (isStaggered) {
        // Staggered sequential stroke reveal: stroke 0 is Head, stroke 1 is Torso, stroke 2 is Leg, etc.
        const strokeWindow = 1.0 / totalStrokes;
        const strokeStart = sIdx * strokeWindow;
        const strokeEnd = strokeStart + strokeWindow;
        if (effectiveProgress < strokeStart) {
          continue; // Part has not started yet
        } else if (effectiveProgress >= strokeEnd) {
          strokeFraction = 1.0; // Fully drawn
        } else {
          strokeFraction = (effectiveProgress - strokeStart) / strokeWindow;
        }
      } else {
        // Continuous smooth drawing across entire sketch
        const strokeWindow = 1.0 / totalStrokes;
        const strokeStart = sIdx * strokeWindow;
        const strokeEnd = strokeStart + strokeWindow;
        if (effectiveProgress < strokeStart) {
          continue;
        } else if (effectiveProgress >= strokeEnd) {
          strokeFraction = 1.0;
        } else {
          strokeFraction = (effectiveProgress - strokeStart) / strokeWindow;
        }
      }
    }

    const availablePointsCount = Math.max(1, Math.round(stroke.points.length * strokeFraction));
    const pts = stroke.points.slice(0, availablePointsCount);
    if (!pts.length) continue;

    if (pts.length < 2) {
      // Draw dot
      const p = pts[0];
      targetCtx.fillStyle = stroke.color;
      targetCtx.beginPath();
      targetCtx.arc(p.x, p.y, stroke.size / 2, 0, Math.PI * 2);
      targetCtx.fill();
      continue;
    }

    targetCtx.strokeStyle = stroke.color;
    targetCtx.lineWidth = stroke.size;
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';

    if (stroke.penType === 'highlighter') {
      targetCtx.globalAlpha = 0.42;
      targetCtx.lineWidth = stroke.size * 2.2;
      targetCtx.lineCap = 'square';
    } else if (stroke.penType === 'brush') {
      targetCtx.globalAlpha = 0.95;
    } else if (stroke.penType === 'eraser') {
      targetCtx.strokeStyle = '#0a0b0e';
      targetCtx.lineWidth = stroke.size * 2;
    } else {
      targetCtx.globalAlpha = 1.0;
    }

    if (stroke.penType === 'arrow') {
      const p1 = pts[0];
      const p2 = pts[pts.length - 1];
      drawVectorArrow(targetCtx, p1.x, p1.y, p2.x, p2.y, stroke.color, stroke.size);
    } else if (stroke.penType === 'brush') {
      drawCalligraphyStroke(targetCtx, { ...stroke, points: pts });
    } else {
      // Smooth Bezier Curve Path
      targetCtx.beginPath();
      targetCtx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        targetCtx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      const last = pts[pts.length - 1];
      targetCtx.lineTo(last.x, last.y);
      targetCtx.stroke();
    }
  }

  targetCtx.restore();
}

// Flood Fill / Enclosed Shape Detection & Filling
function floodFillCanvasAtPoint(pt, fillColor) {
  const w = canvas.width;
  const h = canvas.height;
  const targetX = Math.round(pt.x);
  const targetY = Math.round(pt.y);

  if (targetX < 0 || targetX >= w || targetY < 0 || targetY >= h) return;

  // 1. Try smart vector closed loop detection first (highest quality lossless fill)
  const closedContour = findEnclosingStrokeContour(pt);
  if (closedContour && closedContour.length > 2) {
    const fillItem = {
      id: `fill-${Date.now()}`,
      color: fillColor,
      contour: closedContour,
      opacity: 0.9
    };
    drawingFills.push(fillItem);
    drawingUndoStack.push({ type: 'fill', item: fillItem });
    playUiSound('action');
    showTextTimingAlert('Enclosed contour filled perfectly!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
    return;
  }

  // 2. High-speed raster flood fill on canvas pixel data
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const startIdx = (targetY * w + targetX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];

    // Parse fill color hex to RGB
    const fillRGB = hexToRgb(fillColor) || { r: 255, g: 51, b: 75 };

    if (Math.abs(targetR - fillRGB.r) < 15 && Math.abs(targetG - fillRGB.g) < 15 && Math.abs(targetB - fillRGB.b) < 15) {
      return; // Already this color
    }

    const fillCanvas = document.createElement('canvas');
    fillCanvas.width = w;
    fillCanvas.height = h;
    const fCtx = fillCanvas.getContext('2d');
    const fImgData = fCtx.createImageData(w, h);
    const fData = fImgData.data;

    const visited = new Uint8Array(w * h);
    const queue = [targetX, targetY];
    visited[targetY * w + targetX] = 1;

    let head = 0;
    const maxPixels = 900000;
    let filledCount = 0;

    while (head < queue.length && filledCount < maxPixels) {
      const qx = queue[head++];
      const qy = queue[head++];
      const pIdx = (qy * w + qx) * 4;

      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];

      // Stop at dark boundaries or stroke colors
      const colorDist = Math.hypot(r - targetR, g - targetG, b - targetB);
      if (colorDist < 48) {
        fData[pIdx] = fillRGB.r;
        fData[pIdx + 1] = fillRGB.g;
        fData[pIdx + 2] = fillRGB.b;
        fData[pIdx + 3] = 230; // crisp opaque fill
        filledCount++;

        const neighbors = [
          [qx + 1, qy],
          [qx - 1, qy],
          [qx, qy + 1],
          [qx, qy - 1]
        ];

        for (let n = 0; n < 4; n++) {
          const nx = neighbors[n][0];
          const ny = neighbors[n][1];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nIdx = ny * w + nx;
            if (!visited[nIdx]) {
              visited[nIdx] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    fCtx.putImageData(fImgData, 0, 0);
    const fillItem = {
      id: `fill-raster-${Date.now()}`,
      color: fillColor,
      imgCanvas: fillCanvas
    };
    drawingFills.push(fillItem);
    drawingUndoStack.push({ type: 'fill', item: fillItem });
    playUiSound('action');
    showTextTimingAlert('Hollow shape filled with color!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  } catch(e) {
    console.error('Fill error:', e);
  }
}

// Find enclosing vector stroke contour around click point
function findEnclosingStrokeContour(pt) {
  // If user drew a closed shape (e.g. circle / loop where start and end points are near each other)
  for (let i = drawingStrokes.length - 1; i >= 0; i--) {
    const s = drawingStrokes[i];
    if (s.points && s.points.length >= 6) {
      const pFirst = s.points[0];
      const pLast = s.points[s.points.length - 1];
      const loopDist = Math.hypot(pFirst.x - pLast.x, pFirst.y - pLast.y);

      // If loop is closed within 48px, check if point is inside polygon
      if (loopDist < 48 || isPointInPolygon(pt, s.points)) {
        return s.points;
      }
    }
  }
  return null;
}

function isPointInPolygon(pt, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function hexToRgb(hex) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? {
    r: parseInt(res[1], 16),
    g: parseInt(res[2], 16),
    b: parseInt(res[3], 16)
  } : null;
}

// Right-click fill option for a drawing clip
function fillClipEnclosedShape(clip) {
  if (!clip) return;
  const targetColor = currentDrawColor || '#ff334b';
  if (clip.drawingStrokes && clip.drawingStrokes.length > 0) {
    const allPts = [];
    clip.drawingStrokes.forEach(s => {
      if (s.points) allPts.push(...s.points);
    });

    if (allPts.length > 2) {
      if (!clip.drawingFills) clip.drawingFills = [];
      clip.drawingFills.push({
        id: `fill-clip-${Date.now()}`,
        color: targetColor,
        contour: allPts,
        opacity: 0.88
      });
      renderAllTimelineTracks();
      recordState('Fill Drawing Shape');
      showTextTimingAlert(`Drawing filled with ${targetColor}!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2500);
      return;
    }
  }
  showTextTimingAlert('No enclosed shape found to fill.', 'warning');
  setTimeout(() => showTextTimingAlert(''), 2500);
}

function drawVectorArrow(ctx, fromX, fromY, toX, toY, color, size) {
  const headlen = Math.max(16, size * 2.8);
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrow Head
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawCalligraphyStroke(ctx, stroke) {
  const pts = stroke.points;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const speed = Math.min(20, Math.max(1, dist));
    const width = Math.max(2, stroke.size * (1.6 - (speed / 20)));

    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

// 3. Setup Hold-to-Open Radial Menu & Canvas Pointer Events
function initScreenDrawingEngine() {
  const radialMenu = document.getElementById('canvas-hold-radial-menu');
  const colorPicker = document.getElementById('draw-color-picker');
  const sizeSlider = document.getElementById('draw-size-slider');
  const sizeLabel = document.getElementById('draw-size-label');

  // Pen type buttons in floating dock
  const penButtons = document.querySelectorAll('.dock-btn[data-pen]');
  penButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      penButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPenType = btn.dataset.pen;
    });
  });

  // Radial items
  const radialItems = document.querySelectorAll('.radial-item[data-pen]');
  radialItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const p = item.dataset.pen;
      currentPenType = p;
      penButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.pen === p);
      });
      closeRadialMenu();
      playUiSound('action');
    });
  });

  const radialVectorBtn = document.getElementById('radial-item-vector');
  if (radialVectorBtn) {
    radialVectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeRadialMenu();
      vectorizeAndShowModal();
    });
  }

  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      currentDrawColor = e.target.value;
    });
  }

  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      currentDrawSize = parseInt(e.target.value);
      if (sizeLabel) sizeLabel.textContent = `${currentDrawSize}px`;
    });
  }

  // Undo button
  const btnUndo = document.getElementById('btn-draw-undo');
  if (btnUndo) {
    btnUndo.addEventListener('click', () => {
      if (drawingUndoStack.length) {
        const lastAction = drawingUndoStack.pop();
        if (lastAction.type === 'fill') {
          drawingFills = drawingFills.filter(f => f.id !== lastAction.item.id);
        } else if (lastAction.points) {
          drawingStrokes = drawingStrokes.filter(s => s.id !== lastAction.id);
        }
        playUiSound('snap');
      } else if (drawingFills.length) {
        drawingFills.pop();
        playUiSound('snap');
      } else if (drawingStrokes.length) {
        drawingStrokes.pop();
        playUiSound('snap');
      }
    });
  }

  // Clear button
  const btnClear = document.getElementById('btn-draw-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (drawingStrokes.length || drawingFills.length) {
        drawingUndoStack = [...drawingStrokes];
        drawingStrokes = [];
        drawingFills = [];
        playUiSound('action');
      }
    });
  }

  // Close dock / exit drawing
  const btnClose = document.getElementById('btn-draw-close');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      const selectBtn = document.getElementById('tool-select');
      if (selectBtn) selectBtn.click();
    });
  }

  // Vectorize & Export SVG button
  const btnVectorize = document.getElementById('btn-draw-vectorize');
  if (btnVectorize) {
    btnVectorize.addEventListener('click', () => {
      vectorizeAndShowModal();
    });
  }

  // Canvas Mouse / Pointer Listeners for Drawing & Long-Press Radial Hold
  canvas.addEventListener('pointerdown', (e) => {
    if (activeTool !== 'draw') return;
    const pt = getCanvasPointer(e);

    // Close radial menu if already open
    if (radialMenuVisible) {
      closeRadialMenu();
      return;
    }

    // Start Hold Timer (340ms long-press summons radial toolbar at pointer)
    isHoldingOnCanvas = false;
    canvasHoldStartPt = { clientX: e.clientX, clientY: e.clientY, pt };

    clearTimeout(canvasHoldTimer);
    canvasHoldTimer = setTimeout(() => {
      // Long press detected! Open Radial Menu
      isHoldingOnCanvas = true;
      openRadialMenu(canvasHoldStartPt.clientX, canvasHoldStartPt.clientY);
      playUiSound('camera_click');
    }, 320);

    // If active tool is fill / paint bucket, flood fill shape immediately on click
    if (currentPenType === 'fill') {
      floodFillCanvasAtPoint(pt, currentDrawColor);
      return;
    }

    // Initialize stroke candidate
    currentStroke = {
      id: `stroke-${Date.now()}`,
      penType: currentPenType,
      color: currentDrawColor,
      size: currentDrawSize,
      points: [pt]
    };
  });

  window.addEventListener('pointermove', (e) => {
    if (activeTool !== 'draw' || !currentStroke) return;
    const pt = getCanvasPointer(e);

    // If moved more than 7px before timer triggers, cancel hold menu and draw instead
    if (canvasHoldStartPt && !isHoldingOnCanvas) {
      const dist = Math.hypot(e.clientX - canvasHoldStartPt.clientX, e.clientY - canvasHoldStartPt.clientY);
      if (dist > 7) {
        clearTimeout(canvasHoldTimer);
        canvasHoldTimer = null;
      }
    }

    if (isHoldingOnCanvas) return; // Don't draw while radial menu is engaged

    if (currentStroke.penType === 'eraser') {
      // Erase strokes intersecting with eraser point
      eraseStrokesAtPoint(pt, currentStroke.size * 2);
    } else {
      currentStroke.points.push(pt);
    }
  });

  window.addEventListener('pointerup', () => {
    clearTimeout(canvasHoldTimer);
    canvasHoldTimer = null;

    if (isHoldingOnCanvas) {
      isHoldingOnCanvas = false;
      currentStroke = null;
      return;
    }

    if (currentStroke) {
      if (currentStroke.points.length > 0 && currentStroke.penType !== 'eraser') {
        drawingStrokes.push(currentStroke);
      }
      currentStroke = null;
    }
  });

  function openRadialMenu(clientX, clientY) {
    if (!radialMenu) return;
    const wrapper = document.querySelector('.canvas-wrapper');
    const rect = wrapper.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    radialMenu.style.left = `${x}px`;
    radialMenu.style.top = `${y}px`;
    radialMenu.style.display = 'block';
    radialMenuVisible = true;
  }

  function closeRadialMenu() {
    if (!radialMenu) return;
    radialMenu.style.display = 'none';
    radialMenuVisible = false;
  }

  function eraseStrokesAtPoint(pt, radius) {
    drawingStrokes = drawingStrokes.filter(stroke => {
      // If any point in stroke is within radius of eraser, remove it
      for (const p of stroke.points) {
        if (Math.hypot(p.x - pt.x, p.y - pt.y) <= radius) {
          return false;
        }
      }
      return true;
    });
  }

  initVectorModalControls();
}

// 4. Vectorization Pipeline: Generates Lossless W3C SVG Paths directly from Strokes
function generateVectorSVG() {
  const w = canvas.width || 1920;
  const h = canvas.height || 1080;

  let svgPaths = '';
  let pathCount = 0;

  // 1. Vector fills in SVG
  for (const f of drawingFills) {
    if (f.contour && f.contour.length > 2) {
      pathCount++;
      let d = `M ${f.contour[0].x.toFixed(1)} ${f.contour[0].y.toFixed(1)}`;
      for (let i = 1; i < f.contour.length; i++) {
        d += ` L ${f.contour[i].x.toFixed(1)} ${f.contour[i].y.toFixed(1)}`;
      }
      d += ' Z';
      svgPaths += `  <path d="${d}" fill="${f.color}" opacity="${f.opacity !== undefined ? f.opacity : 0.88}" stroke="none" />\n`;
    }
  }

  // 2. Vector strokes in SVG
  for (const s of drawingStrokes) {
    if (!s.points || s.points.length === 0) continue;
    pathCount++;

    if (s.penType === 'arrow') {
      const p1 = s.points[0];
      const p2 = s.points[s.points.length - 1];
      const headlen = Math.max(16, s.size * 2.8);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const a1x = p2.x - headlen * Math.cos(angle - Math.PI / 6);
      const a1y = p2.y - headlen * Math.sin(angle - Math.PI / 6);
      const a2x = p2.x - headlen * Math.cos(angle + Math.PI / 6);
      const a2y = p2.y - headlen * Math.sin(angle + Math.PI / 6);

      svgPaths += `  <line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${s.color}" stroke-width="${s.size}" stroke-linecap="round" />\n`;
      svgPaths += `  <polygon points="${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${a1x.toFixed(1)},${a1y.toFixed(1)} ${a2x.toFixed(1)},${a2y.toFixed(1)}" fill="${s.color}" />\n`;
    } else {
      // Build smooth SVG Quadratic Curve path data
      let d = `M ${s.points[0].x.toFixed(1)} ${s.points[0].y.toFixed(1)}`;
      for (let i = 1; i < s.points.length - 1; i++) {
        const xc = ((s.points[i].x + s.points[i + 1].x) / 2).toFixed(1);
        const yc = ((s.points[i].y + s.points[i + 1].y) / 2).toFixed(1);
        d += ` Q ${s.points[i].x.toFixed(1)} ${s.points[i].y.toFixed(1)}, ${xc} ${yc}`;
      }
      if (s.points.length > 1) {
        const last = s.points[s.points.length - 1];
        d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
      }

      const opacity = s.penType === 'highlighter' ? '0.45' : '1.0';
      const strokeWidth = s.penType === 'highlighter' ? (s.size * 2.2).toFixed(1) : s.size;
      const lineCap = s.penType === 'highlighter' ? 'square' : 'round';

      svgPaths += `  <path d="${d}" fill="none" stroke="${s.color}" stroke-width="${strokeWidth}" stroke-linecap="${lineCap}" stroke-linejoin="round" opacity="${opacity}" />\n`;
    }
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${svgPaths}</svg>`;

  return { svgContent, pathCount };
}

function vectorizeAndShowModal() {
  if (!drawingStrokes.length) {
    showTextTimingAlert('Please draw something on the screen first before vectorizing!', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2500);
    return;
  }

  const { svgContent, pathCount } = generateVectorSVG();
  const modal = document.getElementById('vector-export-modal');
  const container = document.getElementById('vector-preview-svg-container');
  const pathsCountEl = document.getElementById('svg-paths-count');
  const bytesCountEl = document.getElementById('svg-bytes-count');

  if (container) container.innerHTML = svgContent;
  if (pathsCountEl) pathsCountEl.textContent = pathCount;
  if (bytesCountEl) bytesCountEl.textContent = `${(svgContent.length / 1024).toFixed(1)} KB`;
  if (modal) modal.style.display = 'flex';
  playUiSound('snap_zoom');
}

function initVectorModalControls() {
  const modal = document.getElementById('vector-export-modal');
  const btnClose = document.getElementById('btn-close-vector-modal');
  const btnDownload = document.getElementById('btn-download-svg');
  const btnCopy = document.getElementById('btn-copy-svg-code');
  const btnAddLayer = document.getElementById('btn-add-svg-layer');

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const { svgContent } = generateVectorSVG();
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `magnates-vector-drawing-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      showTextTimingAlert('Vector SVG downloaded successfully!', 'success');
      setTimeout(() => showTextTimingAlert(''), 2500);
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const { svgContent } = generateVectorSVG();
      navigator.clipboard.writeText(svgContent).then(() => {
        showTextTimingAlert('Vector SVG Code copied to clipboard!', 'success');
        setTimeout(() => showTextTimingAlert(''), 2500);
      });
    });
  }

  if (btnAddLayer) {
    btnAddLayer.addEventListener('click', () => {
      const { svgContent } = generateVectorSVG();
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const newClip = {
          id: `clip-vector-${Date.now()}`,
          name: 'Vector Drawing Sticker',
          start: currentTime,
          duration: 4.0,
          scale: 1.0,
          x: 0,
          y: 0,
          img: img,
          drawingStrokes: JSON.parse(JSON.stringify(drawingStrokes)),
          drawingFills: JSON.parse(JSON.stringify(drawingFills)),
          drawMode: 'live',
          staggerParts: false,
          file: { name: 'vector-drawing.svg', url }
        };
        timelineClips.image.push(newClip);
        renderAllTimelineTracks();
        selectClip(newClip, 'image');
        recordState('Add Vector Drawing Layer');
        if (modal) modal.style.display = 'none';
        showTextTimingAlert('Drawing added as animated layer! Right-click anytime for Live Speed-Draw & Timing.', 'success');
        setTimeout(() => showTextTimingAlert(''), 3500);
      };
      img.src = url;
    });
  }
}

// ==================== LAYERS PANEL & STAGE MANAGEMENT ====================
function renderLayersPanel() {
  const container = document.getElementById('active-layers-list');
  if (!container) return;
  container.innerHTML = '';

  const layers = [];

  // 1. Screen Ink Freehand Drawing Layer (if any active ink exists)
  if (drawingStrokes.length > 0 || drawingFills.length > 0) {
    layers.push({
      id: 'layer-ink-canvas',
      name: `Freehand Ink (${drawingStrokes.length} strokes)`,
      desc: 'Screen Drawing Layer',
      type: 'drawing',
      icon: `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>`,
      active: activeTool === 'draw',
      onSelect: () => {
        const btn = document.getElementById('tool-draw');
        if (btn) btn.click();
      },
      onDelete: () => {
        drawingStrokes = [];
        drawingFills = [];
        drawingUndoStack = [];
        renderLayersPanel();
      }
    });
  }

  // 2. Text Clips (Kinetic Typography)
  timelineClips.text.forEach((tClip, idx) => {
    layers.push({
      id: tClip.id,
      name: tClip.text ? `"${tClip.text.slice(0, 18)}..."` : `Text #${idx + 1}`,
      desc: `${tClip.animStyle || 'pop'} · ${tClip.duration}s`,
      type: 'text',
      clip: tClip,
      icon: `<svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>`,
      active: selectedClip === tClip,
      onSelect: () => {
        selectClip(tClip, 'text');
        seekToTime(tClip.start);
      },
      onDelete: () => {
        deleteClip(tClip, 'text');
        renderLayersPanel();
      }
    });
  });

  // 3. Image / Sticker / Vector Drawing Clips
  timelineClips.image.forEach((imgClip, idx) => {
    let layerDesc = 'Media Layer';
    let layerIcon = `<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
    if (imgClip.chartConfig) {
      layerDesc = `Infographic · ${imgClip.chartConfig.type === 'pyramid' ? 'Liquid Funnel' : (imgClip.chartConfig.type === 'bar' ? 'Staggered Bar' : 'Area Spread')}`;
      layerIcon = `<svg viewBox="0 0 24 24" style="color:#00f0ff;"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>`;
    } else if (imgClip.isIconSticker) {
      layerDesc = 'Vector Icon Sticker';
      layerIcon = `<svg viewBox="0 0 24 24" style="color:#ffd000;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else if (imgClip.drawingStrokes) {
      layerDesc = 'Vector Animated Drawing';
    } else if (imgClip.cutoutCanvas) {
      layerDesc = 'Cutout Subject';
    }

    layers.push({
      id: imgClip.id,
      name: imgClip.name || imgClip.file?.name || `Image #${idx + 1}`,
      desc: layerDesc,
      type: 'image',
      clip: imgClip,
      icon: layerIcon,
      active: selectedClip?.clip === imgClip,
      onSelect: () => {
        selectClip(imgClip, 'image');
        seekToTime(imgClip.start);
      },
      onDelete: () => {
        deleteClip(imgClip, 'image');
        renderLayersPanel();
      }
    });
  });

  // 4. Video Clips
  timelineClips.video.forEach((vClip, idx) => {
    layers.push({
      id: vClip.id,
      name: vClip.file?.name || `Video #${idx + 1}`,
      desc: `${vClip.duration}s video clip`,
      type: 'video',
      clip: vClip,
      icon: `<svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
      active: selectedClip === vClip,
      onSelect: () => {
        selectClip(vClip, 'video');
        seekToTime(vClip.start);
      },
      onDelete: () => {
        deleteClip(vClip, 'video');
        renderLayersPanel();
      }
    });
  });

  // 5. Stage & Background Grid Layer (Always at base)
  const bgType = fxState.stageBackground?.type || 'cyber_grid';
  let bgName = '3D Cyber Perspective Grid';
  let bgDesc = 'Default Cyber Stage';
  let bgIconColor = '#00f0ff';
  if (bgType === 'solid_black') {
    bgName = 'Solid Black Studio';
    bgDesc = 'Pure Black Background';
    bgIconColor = '#ffffff';
  } else if (bgType === 'color') {
    bgName = `Custom Color (${fxState.stageBackground.color})`;
    bgDesc = 'Solid Color Stage';
    bgIconColor = fxState.stageBackground.color;
  } else if (bgType === 'vox_cream') {
    bgName = 'Vox Cream Paper';
    bgDesc = 'Vintage Newsprint Stage';
    bgIconColor = '#f4eedb';
  } else if (bgType === 'chroma_green') {
    bgName = 'Chroma Green Studio';
    bgDesc = 'Keyable Green Screen Stage';
    bgIconColor = '#00e676';
  }

  layers.push({
    id: 'layer-stage-background',
    name: bgName,
    desc: bgDesc,
    type: 'stage',
    icon: `<svg viewBox="0 0 24 24" style="fill: ${bgIconColor};"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    active: false,
    isStage: true,
    onSelect: () => {
      // Toggle dropdown or highlight FX card
      const drop = document.getElementById('add-layer-dropdown');
      if (drop) drop.style.display = drop.style.display === 'none' ? 'flex' : 'none';
    }
  });

  // Render cards
  layers.forEach(item => {
    const card = document.createElement('div');
    card.className = `layer-item-card ${item.active ? 'active' : ''}`;
    card.innerHTML = `
      <div class="layer-badge-icon">${item.icon}</div>
      <div class="layer-info">
        <div class="layer-name" title="${item.name}">${item.name}</div>
        <div class="layer-type-desc">${item.desc}</div>
      </div>
      ${!item.isStage ? `
        <button class="layer-action-btn" title="Delete Layer" data-del="true">
          <svg class="ui-icon" viewBox="0 0 24 24" style="width:12px; height:12px; fill:currentColor;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      ` : `
        <button class="layer-action-btn" title="Change Background Style" data-change-stage="true">
          <svg class="ui-icon" viewBox="0 0 24 24" style="width:12px; height:12px; fill:currentColor;"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      `}
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-del]')) {
        e.stopPropagation();
        if (item.onDelete) item.onDelete();
        return;
      }
      if (item.onSelect) item.onSelect();
      renderLayersPanel();
    });

    container.appendChild(card);
  });
}

function initLayersPanelControls() {
  const triggerBtn = document.getElementById('btn-add-layer-trigger');
  const dropdown = document.getElementById('add-layer-dropdown');

  if (triggerBtn && dropdown) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
      playUiSound('action');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== triggerBtn) {
        dropdown.style.display = 'none';
      }
    });

    // Preset Background Selection
    dropdown.querySelectorAll('[data-layer-preset]').forEach(el => {
      el.addEventListener('click', () => {
        const preset = el.dataset.layerPreset;
        dropdown.style.display = 'none';

        if (preset === 'cyber_grid') {
          fxState.stageBackground = { type: 'cyber_grid', color: '#0a0b0e' };
          fxState.grid.enabled = true;
          const gridBox = document.getElementById('fx-grid-enable');
          if (gridBox) gridBox.checked = true;
          showTextTimingAlert('Stage set to 3D Cyber Perspective Grid!', 'success');
        } else if (preset === 'solid_black') {
          fxState.stageBackground = { type: 'solid_black', color: '#000000' };
          fxState.grid.enabled = false;
          const gridBox = document.getElementById('fx-grid-enable');
          if (gridBox) gridBox.checked = false;
          showTextTimingAlert('Stage set to Solid Black Studio!', 'success');
        } else if (preset === 'dark_slate') {
          fxState.stageBackground = { type: 'color', color: '#0d111a' };
          fxState.grid.enabled = false;
          showTextTimingAlert('Stage set to Dark Slate Cinematic!', 'success');
        } else if (preset === 'vox_cream') {
          fxState.stageBackground = { type: 'vox_cream', color: '#f4eedb' };
          fxState.grid.enabled = false;
          showTextTimingAlert('Stage set to Vox Newspaper Cream!', 'success');
        } else if (preset === 'neon_red') {
          fxState.stageBackground = { type: 'color', color: '#1a060a' };
          fxState.grid.enabled = true;
          showTextTimingAlert('Stage set to Magnates Accent Red stage!', 'success');
        } else if (preset === 'chroma_green') {
          fxState.stageBackground = { type: 'chroma_green', color: '#00e676' };
          fxState.grid.enabled = false;
          showTextTimingAlert('Stage set to Chroma Studio Green!', 'success');
        }

        renderLayersPanel();
        recordState('Change Stage Background');
        setTimeout(() => showTextTimingAlert(''), 2500);
      });
    });

    // Custom Color Input
    const colorInput = document.getElementById('input-layer-color');
    if (colorInput) {
      colorInput.addEventListener('input', (e) => {
        fxState.stageBackground = { type: 'color', color: e.target.value };
        fxState.grid.enabled = false;
        renderLayersPanel();
      });
    }

    // Overlay Actions: Add text or Draw ink
    dropdown.querySelectorAll('[data-layer-action]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.layerAction;
        dropdown.style.display = 'none';

        if (action === 'add_chart') {
          openChartCreatorModal();
        } else if (action === 'add_text') {
          const btnAddText = document.getElementById('btn-add-text');
          if (btnAddText) btnAddText.click();
          renderLayersPanel();
        } else if (action === 'add_drawing') {
          const btnDraw = document.getElementById('tool-draw');
          if (btnDraw) btnDraw.click();
          renderLayersPanel();
        }
      });
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initScreenDrawingEngine();
  initLayersPanelControls();

  // If running inside Electron desktop wrapper, listen for global shortcut
  if (window.electronAPI && typeof window.electronAPI.onToggleDrawingMode === 'function') {
    window.electronAPI.onToggleDrawingMode(() => {
      const drawBtn = document.getElementById('tool-draw');
      if (drawBtn) drawBtn.click();
    });
  }

  // Initialize Animated Charts and Vector Icons Engines
  initChartsAndInfographicsEngine();
  initVectorIconsEngine();
});

// ====================================================================================
// 📊 MOTION GRAPHIC INFOGRAPHICS & ANIMATED CHARTS ENGINE (Alex Hormozi / Vox Style)
// ====================================================================================

const PREBUILT_CHART_TEMPLATES = [
  {
    id: 'tpl-cost-per-lead',
    type: 'area',
    name: 'Dual-Line & Area Spread',
    badge: 'Cost Per Lead',
    desc: 'Traces progressive write-on curve, pops data nodes, and dynamically reveals volume difference gap between two metrics.',
    config: {
      type: 'area',
      title: 'COST PER LEAD',
      isDual: true,
      series1: [42, 60, 50, 78, 62, 51, 68, 48, 70, 52, 64, 40, 68, 25, 18],
      series2: [30, 48, 32, 64, 40, 22, 38, 32, 45, 18, 34, 15, 42, 10, 8],
      color: '#ffffff',
      color2: '#9aa5b8',
      drawDuration: 1.8,
      glow: true,
      fillOpacity: 0.32
    }
  },
  {
    id: 'tpl-cost-per-click',
    type: 'area',
    name: 'Steep Cliff Drop Curve',
    badge: 'Cost Per Click',
    desc: 'High-contrast downward trend curve that writes on from left to right, dramatizing steep acquisition drops and cliff falls.',
    config: {
      type: 'area',
      title: 'COST PER CLICK',
      isDual: false,
      series1: [48, 40, 44, 28, 32, 22, 28, 18, 14, 8, 7, 5, 4, 3, 2],
      color: '#ffffff',
      drawDuration: 1.6,
      glow: true,
      fillOpacity: 0.38
    }
  },
  {
    id: 'tpl-conversion-rate',
    type: 'bar',
    name: 'Staggered Metric Bar Reveal',
    badge: 'Conversion Rate',
    desc: 'Neon columns emerge sequentially from the baseline with a staggered spring pop, culminating in a glowing peak highlight.',
    config: {
      type: 'bar',
      title: 'CONVERSION RATE',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [12, 28, 24, 30, 62, 64, 38, 64, 70, 84, 55, 36],
      color: '#76ff03',
      staggerDelay: 0.07,
      drawDuration: 1.8,
      glow: true,
      peakIndex: 9
    }
  },
  {
    id: 'tpl-buying-now-pyramid',
    type: 'pyramid',
    name: 'Liquid Wave & Glowing Pyramid Tier',
    badge: '3% Buying Now',
    desc: 'Geometric audience hierarchy funnel where the active apex fills with an organic fluid wave slosh and neon rim glow.',
    config: {
      type: 'pyramid',
      title: 'BUYER HIERARCHY',
      tierIndex: 0,
      tierText: '3% BUYING NOW',
      color: '#b4ff00',
      drawDuration: 1.8,
      waveAgitation: 18,
      glow: true
    }
  }
];

// Master Chart Drawing Function invoked within drawMediaLayer
function drawInfographicChart(ctx, clip, dx, dy, w, h) {
  const cfg = clip.chartConfig;
  if (!cfg) return;

  const elapsed = Math.max(0, currentTime - clip.start);
  const animDuration = cfg.drawDuration || 1.8;
  const progress = Math.min(1.0, elapsed / animDuration);

  // Smooth cubic ease out curve
  const easeOut = 1 - Math.pow(1 - progress, 3);

  ctx.save();

  // Bounding background card container
  ctx.fillStyle = 'rgba(10, 12, 18, 0.94)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  
  // Rounded rect container
  const radius = 12;
  ctx.beginPath();
  ctx.roundRect(dx, dy, w, h, radius);
  ctx.fill();
  ctx.stroke();

  if (cfg.glow) {
    ctx.shadowColor = cfg.color || '#00f0ff';
    ctx.shadowBlur = 18;
  }

  // Draw chart header title
  ctx.save();
  ctx.font = '900 24px "Inter", "Oswald", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(cfg.title || 'INFOGRAPHIC METRIC', dx + 28, dy + 42);

  // Decorative divider line under title
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(dx + 28, dy + 54);
  ctx.lineTo(dx + w - 28, dy + 54);
  ctx.stroke();
  ctx.restore();

  // Route to specific chart renderer
  if (cfg.type === 'bar') {
    drawStaggeredBarChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress);
  } else if (cfg.type === 'pyramid') {
    drawLiquidPyramidChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 90, elapsed, progress);
  } else {
    // Default: area / line chart
    drawDynamicAreaChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress, easeOut);
  }

  ctx.restore();
}

// 1. Dynamic Area & Dual-Line Spread Renderer
function drawDynamicAreaChart(ctx, cfg, x, y, w, h, elapsed, progress, easeOut) {
  const series1 = cfg.series1 || [40, 60, 50, 75, 60, 50, 65, 45, 70, 55, 60, 38, 65, 25, 18];
  const series2 = cfg.series2 || [30, 48, 32, 64, 40, 22, 38, 32, 45, 18, 34, 15, 42, 10, 8];
  const isDual = cfg.isDual !== false;
  const col1 = cfg.color || '#ffffff';
  const col2 = cfg.color2 || '#8ea1b8';

  const maxVal = Math.max(...series1, ...(isDual ? series2 : [0])) * 1.15 || 100;
  const n = series1.length;
  const stepX = w / (n - 1);
  const baselineY = y + h - 15;
  const chartHeight = h - 25;

  // Background Grid Lines
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  const gridRows = 5;
  for (let r = 0; r <= gridRows; r++) {
    const gy = baselineY - (chartHeight * (r / gridRows));
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
    ctx.stroke();
  }
  ctx.restore();

  // Helper to map index & value to canvas coords
  const getPt = (idx, val) => ({
    x: x + idx * stepX,
    y: baselineY - (val / maxVal) * chartHeight
  });

  // Calculate write-on reveal point
  const currentDrawIdx = Math.min(n - 1, (n - 1) * easeOut);
  const fullPointsCount = Math.floor(currentDrawIdx);
  const frac = currentDrawIdx - fullPointsCount;

  // Function to build curve path up to current animated progress
  function buildCurvePath(series) {
    const pts = [];
    for (let i = 0; i <= fullPointsCount; i++) {
      pts.push(getPt(i, series[i]));
    }
    if (fullPointsCount < n - 1 && frac > 0) {
      const pA = getPt(fullPointsCount, series[fullPointsCount]);
      const pB = getPt(fullPointsCount + 1, series[fullPointsCount + 1]);
      pts.push({
        x: pA.x + (pB.x - pA.x) * frac,
        y: pA.y + (pB.y - pA.y) * frac
      });
    }
    return pts;
  }

  const pts1 = buildCurvePath(series1);
  const pts2 = isDual ? buildCurvePath(series2) : [];

  if (pts1.length < 2) return;

  // A. Render Shaded Area Fill
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts1[0].x, baselineY);
  pts1.forEach(pt => ctx.lineTo(pt.x, pt.y));
  ctx.lineTo(pts1[pts1.length - 1].x, baselineY);
  ctx.closePath();

  const areaGrad = ctx.createLinearGradient(0, y, 0, baselineY);
  areaGrad.addColorStop(0, hexToRgba(col1, cfg.fillOpacity || 0.35));
  areaGrad.addColorStop(1, hexToRgba(col1, 0.02));
  ctx.fillStyle = areaGrad;
  ctx.fill();
  ctx.restore();

  // B. Render Secondary Benchmark Curve (if dual mode)
  if (isDual && pts2.length >= 2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts2[0].x, baselineY);
    pts2.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(pts2[pts2.length - 1].x, baselineY);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(col2, 0.18);
    ctx.fill();

    // Line 2 Stroke
    ctx.strokeStyle = col2;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    pts2.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
    ctx.stroke();

    // Secondary line node dots
    ctx.fillStyle = col2;
    pts2.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // C. Render Primary White Curve Stroke
  ctx.save();
  ctx.strokeStyle = col1;
  ctx.lineWidth = 3.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  pts1.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
  ctx.stroke();

  // D. Animated Node Points / Data Dots
  pts1.forEach((pt, i) => {
    // Pop in dot
    const dotProgress = Math.min(1, Math.max(0, (easeOut * (n - 1) - i) + 1));
    if (dotProgress > 0) {
      ctx.save();
      const dotRadius = 4.5 * dotProgress;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = col1;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  // Leading edge glow pulse
  const leadPt = pts1[pts1.length - 1];
  if (leadPt && progress < 1) {
    ctx.save();
    ctx.fillStyle = col1;
    ctx.shadowColor = col1;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(leadPt.x, leadPt.y, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Bottom Axis Tick Marks
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, baselineY);
  ctx.lineTo(x + w, baselineY);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < n; i++) {
    const tx = x + i * stepX;
    ctx.fillText(`${i + 1}`, tx, baselineY + 12);
  }
  ctx.restore();
}

// 2. Staggered Metric Bar Pop-Up Renderer
function drawStaggeredBarChart(ctx, cfg, x, y, w, h, elapsed, progress) {
  const labels = cfg.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const values = cfg.values || [12, 28, 25, 32, 60, 62, 40, 63, 72, 85, 52, 35];
  const barColor = cfg.color || '#76ff03';
  const peakIdx = cfg.peakIndex !== undefined ? cfg.peakIndex : values.indexOf(Math.max(...values));

  const maxVal = Math.max(...values) * 1.15 || 100;
  const n = values.length;
  const barSlotWidth = w / n;
  const barWidth = Math.max(14, barSlotWidth * 0.65);
  const baselineY = y + h - 20;
  const maxHeight = h - 35;

  // Baseline line
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, baselineY);
  ctx.lineTo(x + w, baselineY);
  ctx.stroke();
  ctx.restore();

  const stagger = cfg.staggerDelay || 0.08;

  values.forEach((val, idx) => {
    const barStart = idx * stagger;
    const barElapsed = Math.max(0, elapsed - barStart);
    const barNormTime = Math.min(1.0, barElapsed / 0.45);

    // Snappy spring overshoot ease: rises to 105% then settles to 100%
    let barEase = 0;
    if (barNormTime > 0) {
      barEase = 1 + 2.7 * Math.pow(barNormTime - 1, 3) + 1.7 * Math.pow(barNormTime - 1, 2);
    }
    barEase = Math.min(1.06, Math.max(0, barEase));

    const finalBarHeight = (val / maxVal) * maxHeight;
    const currentHeight = finalBarHeight * barEase;
    const barX = x + idx * barSlotWidth + (barSlotWidth - barWidth) / 2;
    const barY = baselineY - currentHeight;

    if (currentHeight > 1) {
      ctx.save();
      const isPeak = idx === peakIdx;

      // Glow on peak bar or when glowing is enabled
      if (isPeak || cfg.glow) {
        ctx.shadowColor = barColor;
        ctx.shadowBlur = isPeak ? 22 : 8;
      }

      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barWidth, currentHeight, [3, 3, 0, 0]);
      ctx.fill();

      // Top highlight cap
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.45;
      ctx.fillRect(barX, barY, barWidth, 3);
      ctx.restore();
    }

    // Month Label
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 10px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[idx] || `${idx + 1}`, barX + barWidth / 2, baselineY + 14);
    ctx.restore();
  });
}

// 3. Liquid Wave & Glowing Pyramid Tier Renderer
function drawLiquidPyramidChart(ctx, cfg, x, y, w, h, elapsed, progress) {
  const accentColor = cfg.color || '#b4ff00';
  const tierIndex = cfg.tierIndex || 0; // 0 = Apex (Top)
  const tierText = cfg.tierText || '3% BUYING NOW';

  const centerX = x + w / 2;
  const topY = y + 10;
  const bottomY = y + h - 10;
  const halfBase = Math.min(w * 0.42, (bottomY - topY) * 0.75);

  const apexPt = { x: centerX, y: topY };
  const baseLeft = { x: centerX - halfBase, y: bottomY };
  const baseRight = { x: centerX + halfBase, y: bottomY };

  // Total 4 Tiers ratios from top: 0.28, 0.52, 0.76, 1.0
  const tierCutRatios = [0.32, 0.55, 0.78, 1.0];

  // Draw pyramid tiers in dark slate
  const numTiers = 4;
  for (let t = numTiers - 1; t >= 0; t--) {
    const topR = t === 0 ? 0 : tierCutRatios[t - 1];
    const botR = tierCutRatios[t];

    const yT = topY + (bottomY - topY) * topR;
    const yB = topY + (bottomY - topY) * botR;
    const xTL = centerX - halfBase * topR;
    const xTR = centerX + halfBase * topR;
    const xBL = centerX - halfBase * botR;
    const xBR = centerX + halfBase * botR;

    ctx.save();
    ctx.beginPath();
    if (t === 0) {
      ctx.moveTo(apexPt.x, apexPt.y);
      ctx.lineTo(xBR, yB);
      ctx.lineTo(xBL, yB);
    } else {
      ctx.moveTo(xTL, yT);
      ctx.lineTo(xTR, yT);
      ctx.lineTo(xBR, yB);
      ctx.lineTo(xBL, yB);
    }
    ctx.closePath();

    // Dark tiered shading
    const shade = 35 + t * 8;
    ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 6})`;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // Active Tier Organic Wave Fill (Clip inside the Apex Triangle)
  const activeBotY = topY + (bottomY - topY) * tierCutRatios[tierIndex];
  const activeLeft = centerX - halfBase * tierCutRatios[tierIndex];
  const activeRight = centerX + halfBase * tierCutRatios[tierIndex];

  ctx.save();
  // Clip strictly to Apex segment
  ctx.beginPath();
  ctx.moveTo(apexPt.x, apexPt.y);
  ctx.lineTo(activeRight, activeBotY);
  ctx.lineTo(activeLeft, activeBotY);
  ctx.closePath();
  ctx.clip();

  // Wave calculation: liquid rises upward from bottom to top
  const riseProg = Math.min(1.0, elapsed / 1.5);
  const waveTargetY = activeBotY - (activeBotY - topY) * riseProg;
  const waveAmp = (1 - riseProg * 0.4) * (cfg.waveAgitation || 14);
  const waveFreq = 0.045;
  const wavePhase = elapsed * 5.0;

  // Build organic fluid wave path
  ctx.beginPath();
  ctx.moveTo(activeLeft - 20, activeBotY + 10);
  for (let px = activeLeft - 20; px <= activeRight + 20; px += 4) {
    const waveY = waveTargetY + Math.sin(px * waveFreq + wavePhase) * waveAmp;
    ctx.lineTo(px, waveY);
  }
  ctx.lineTo(activeRight + 20, activeBotY + 10);
  ctx.closePath();

  ctx.fillStyle = accentColor;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = cfg.glow ? 24 : 0;
  ctx.fill();

  ctx.restore();

  // Neon Rim Accent Stroke around apex tier
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(apexPt.x, apexPt.y);
  ctx.lineTo(activeRight, activeBotY);
  ctx.lineTo(activeLeft, activeBotY);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Tier Headline Typography ("3% BUYING NOW")
  ctx.save();
  const textY = topY + (activeBotY - topY) * 0.65;
  ctx.font = '900 21px "Inter", "Oswald", sans-serif';
  ctx.fillStyle = '#111317';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = tierText.split('\n');
  if (lines.length === 1 && tierText.includes(' ')) {
    const parts = tierText.split(' ');
    const line1 = parts[0];
    const line2 = parts.slice(1).join(' ');
    ctx.fillText(line1, centerX, textY - 11);
    ctx.fillText(line2, centerX, textY + 12);
  } else {
    ctx.fillText(tierText, centerX, textY);
  }
  ctx.restore();
}

// Helper: Hex color to RGBA string
function hexToRgba(hex, alpha) {
  if (!hex || hex[0] !== '#') return `rgba(255, 255, 255, ${alpha})`;
  let r = 255, g = 255, b = 255;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Render Charts & Infographics Templates Library Panel
function renderChartsTemplatesPanel() {
  const container = document.getElementById('charts-templates-list');
  if (!container) return;
  container.innerHTML = '';

  PREBUILT_CHART_TEMPLATES.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'chart-template-card';

    let miniPreviewSvg = '';
    if (tpl.type === 'area') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <polygon points="5,42 20,22 35,30 55,12 70,26 95,8 95,45 5,45" fill="rgba(0, 240, 255, 0.25)" />
          <polyline points="5,42 20,22 35,30 55,12 70,26 95,8" fill="none" stroke="#00f0ff" stroke-width="2.5" />
          <circle cx="95" cy="8" r="3" fill="#fff" />
        </svg>
      `;
    } else if (tpl.type === 'bar') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <rect x="8" y="32" width="9" height="13" fill="#76ff03" rx="1"/>
          <rect x="22" y="22" width="9" height="23" fill="#76ff03" rx="1"/>
          <rect x="36" y="26" width="9" height="19" fill="#76ff03" rx="1"/>
          <rect x="50" y="12" width="9" height="33" fill="#76ff03" rx="1"/>
          <rect x="64" y="6" width="9" height="39" fill="#76ff03" rx="1" filter="drop-shadow(0 0 4px #76ff03)"/>
          <rect x="78" y="18" width="9" height="27" fill="#76ff03" rx="1"/>
        </svg>
      `;
    } else if (tpl.type === 'pyramid') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <polygon points="50,4 28,46 72,46" fill="#242833" />
          <path d="M50,4 L39,24 Q45,21 50,24 T61,24 Z" fill="#b4ff00" filter="drop-shadow(0 0 6px #b4ff00)" />
        </svg>
      `;
    }

    card.innerHTML = `
      <div class="chart-template-preview">
        ${miniPreviewSvg}
        <span class="badge" style="position: absolute; top: 6px; right: 6px; font-size: 9px; color: #00f0ff; border-color: rgba(0, 240, 255, 0.4);">${tpl.badge}</span>
      </div>
      <div class="chart-template-meta">
        <div class="chart-template-title">
          <span>${tpl.name}</span>
          <span style="font-size: 10px; color: #00f0ff;">+ Add</span>
        </div>
        <div class="chart-template-desc">${tpl.desc}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      addChartClipToTimeline(tpl.config, currentTime, 6.0);
    });

    container.appendChild(card);
  });
}

// Add an Animated Chart as an interactive Timeline Clip
function addChartClipToTimeline(chartConfig, startSec = currentTime, durationSec = 6.0) {
  if (!timelineClips.chart) timelineClips.chart = [];

  const newClip = {
    id: `clip-chart-${Date.now()}`,
    track: 'chart',
    name: chartConfig.title || 'Animated Infographic',
    start: Math.max(0, startSec),
    duration: Math.max(2, durationSec),
    scale: 1.0,
    x: 0,
    y: 0,
    zIndex: 25,
    layerOrder: 'front',
    chartConfig: JSON.parse(JSON.stringify(chartConfig)),
    file: {
      name: `${chartConfig.title || 'Chart'}.chart`,
      isImage: true,
      url: ''
    }
  };

  timelineClips.chart.push(newClip);
  renderAllTimelineTracks();
  selectClip(newClip, 'chart');
  seekToTime(newClip.start);
  recordState('Add Animated Chart Layer');
  playSFX('whoosh', 0.6);
  showTextTimingAlert(`Added "${newClip.name}" chart to timeline! Scrub playhead to watch animation.`, 'success');
  setTimeout(() => showTextTimingAlert(''), 3500);
  return newClip;
}

// Populate Right Inspector fields when a chart clip is selected
function populateChartInspector(clip) {
  const cfg = clip.chartConfig;
  if (!cfg) return;

  const titleEl = document.getElementById('chart-inspector-title');
  const typeBadge = document.getElementById('chart-type-badge');
  const colorEl = document.getElementById('chart-inspector-color');
  const durSlider = document.getElementById('chart-inspector-duration');
  const durVal = document.getElementById('chart-inspector-dur-val');
  const glowCheck = document.getElementById('chart-inspector-glow');
  const startEl = document.getElementById('chart-start-input');
  const durEl = document.getElementById('chart-dur-input');

  if (titleEl) titleEl.value = cfg.title || '';
  if (typeBadge) typeBadge.textContent = cfg.type === 'pyramid' ? 'Liquid Pyramid' : (cfg.type === 'bar' ? 'Staggered Bar' : 'Area Spread');
  if (colorEl) colorEl.value = cfg.color || '#00f0ff';
  if (durSlider) durSlider.value = Math.round((cfg.drawDuration || 1.8) * 10);
  if (durVal) durVal.textContent = `${(cfg.drawDuration || 1.8).toFixed(1)}s`;
  if (glowCheck) glowCheck.checked = cfg.glow !== false;
  if (startEl) startEl.value = formatTimecode(clip.start);
  if (durEl) durEl.value = formatTimecode(clip.duration);

  // Toggle specific field visibility
  const areaFields = document.getElementById('chart-inspector-area-fields');
  const barFields = document.getElementById('chart-inspector-bar-fields');
  const pyramidFields = document.getElementById('chart-inspector-pyramid-fields');

  if (areaFields) areaFields.style.display = cfg.type === 'area' ? 'block' : 'none';
  if (barFields) barFields.style.display = cfg.type === 'bar' ? 'block' : 'none';
  if (pyramidFields) pyramidFields.style.display = cfg.type === 'pyramid' ? 'block' : 'none';

  if (cfg.type === 'area') {
    const s1El = document.getElementById('chart-inspector-series1');
    const s2El = document.getElementById('chart-inspector-series2');
    const rowS2 = document.getElementById('row-chart-inspector-series2');
    if (s1El) s1El.value = (cfg.series1 || []).join(', ');
    if (s2El) s2El.value = (cfg.series2 || []).join(', ');
    if (rowS2) rowS2.style.display = cfg.isDual !== false ? 'block' : 'none';
    document.getElementById('btn-chart-dual-true')?.classList.toggle('active', cfg.isDual !== false);
    document.getElementById('btn-chart-dual-false')?.classList.toggle('active', cfg.isDual === false);
  } else if (cfg.type === 'bar') {
    const lblEl = document.getElementById('chart-inspector-bar-labels');
    const valEl = document.getElementById('chart-inspector-bar-values');
    if (lblEl) lblEl.value = (cfg.labels || []).join(', ');
    if (valEl) valEl.value = (cfg.values || []).join(', ');
  } else if (cfg.type === 'pyramid') {
    const tierSel = document.getElementById('chart-inspector-pyramid-tier');
    const textEl = document.getElementById('chart-inspector-pyramid-text');
    if (tierSel) tierSel.value = cfg.tierIndex || 0;
    if (textEl) textEl.value = cfg.tierText || '3% BUYING NOW';
  }
}

// Chart Creator / Editor Modal Logic
let modalEditingClip = null;
let modalPreviewAnimFrame = null;
let modalPreviewStartTime = 0;

function openChartCreatorModal() {
  modalEditingClip = null;
  const modal = document.getElementById('chart-creator-modal');
  const titleText = document.getElementById('chart-modal-title-text');
  const confirmBtnText = document.getElementById('btn-confirm-add-chart-text');

  if (titleText) titleText.textContent = 'Create Motion Graphic Chart & Infographic';
  if (confirmBtnText) confirmBtnText.textContent = 'Add Animated Chart to Timeline';

  if (modal) modal.style.display = 'flex';
  startModalPreviewLoop();
}

function openChartEditorModalForClip(clip) {
  if (!clip || !clip.chartConfig) return;
  modalEditingClip = clip;
  const cfg = clip.chartConfig;
  const modal = document.getElementById('chart-creator-modal');
  const titleText = document.getElementById('chart-modal-title-text');
  const confirmBtnText = document.getElementById('btn-confirm-add-chart-text');

  if (titleText) titleText.textContent = `Edit Chart: ${cfg.title || 'Infographic'}`;
  if (confirmBtnText) confirmBtnText.textContent = 'Update Chart on Screen';

  // Set active chart type card
  selectedModalType = cfg.type || 'area';
  document.querySelectorAll('.chart-type-card').forEach(c => {
    c.classList.toggle('active', c.dataset.chartType === selectedModalType);
  });

  // Populate inputs with clip's active configuration
  const titleInput = document.getElementById('modal-chart-title');
  const colorInput = document.getElementById('modal-chart-color');
  const colorLabel = document.getElementById('modal-chart-color-label');
  const durSlider = document.getElementById('modal-chart-duration');
  const durVal = document.getElementById('modal-chart-duration-val');
  const dataInput = document.getElementById('modal-chart-data');
  const dataLabel = document.getElementById('modal-chart-data-label');

  if (titleInput) titleInput.value = cfg.title || '';
  if (colorInput) {
    colorInput.value = cfg.color || '#00f0ff';
    if (colorLabel) colorLabel.textContent = cfg.color || '#00f0ff';
  }
  if (durSlider) {
    durSlider.value = Math.round((cfg.drawDuration || 1.8) * 10);
    if (durVal) durVal.textContent = `${(cfg.drawDuration || 1.8).toFixed(1)}s`;
  }

  if (cfg.type === 'pyramid') {
    if (dataLabel) dataLabel.textContent = 'Apex Tier Headline Text';
    if (dataInput) dataInput.value = cfg.tierText || '3% BUYING NOW';
  } else if (cfg.type === 'bar') {
    if (dataLabel) dataLabel.textContent = 'Bar Values (CSV)';
    if (dataInput) dataInput.value = (cfg.values || []).join(', ');
  } else {
    if (dataLabel) dataLabel.textContent = 'Data Values (CSV)';
    if (dataInput) dataInput.value = (cfg.series1 || []).join(', ');
  }

  if (modal) modal.style.display = 'flex';
  startModalPreviewLoop();
}

function closeChartCreatorModal() {
  const modal = document.getElementById('chart-creator-modal');
  if (modal) modal.style.display = 'none';
  modalEditingClip = null;
  if (modalPreviewAnimFrame) {
    cancelAnimationFrame(modalPreviewAnimFrame);
    modalPreviewAnimFrame = null;
  }
}

// Live interactive modal preview rendering loop
function startModalPreviewLoop() {
  if (modalPreviewAnimFrame) {
    cancelAnimationFrame(modalPreviewAnimFrame);
  }
  modalPreviewStartTime = performance.now();

  function renderModalPreview() {
    const previewCanvas = document.getElementById('modal-chart-preview-canvas');
    if (!previewCanvas || previewCanvas.offsetParent === null) {
      modalPreviewAnimFrame = null;
      return;
    }

    const pCtx = previewCanvas.getContext('2d');
    const pw = previewCanvas.width;
    const ph = previewCanvas.height;

    // Clear canvas
    pCtx.clearRect(0, 0, pw, ph);

    // Read current form values for real-time live preview
    const title = document.getElementById('modal-chart-title')?.value || 'CHART';
    const color = document.getElementById('modal-chart-color')?.value || '#00f0ff';
    const durSec = (parseInt(document.getElementById('modal-chart-duration')?.value || '18') / 10);
    const rawData = document.getElementById('modal-chart-data')?.value || '';

    const previewCfg = {
      type: selectedModalType,
      title,
      color,
      drawDuration: durSec,
      glow: true
    };

    if (selectedModalType === 'pyramid') {
      previewCfg.tierText = rawData.trim() || '3% BUYING NOW';
      previewCfg.tierIndex = 0;
    } else if (selectedModalType === 'bar') {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      previewCfg.values = vals.length > 0 ? vals : [10, 25, 40, 75, 50, 65, 80];
      previewCfg.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, previewCfg.values.length);
    } else {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      previewCfg.series1 = vals.length > 0 ? vals : [20, 50, 40, 80, 60, 30, 15];
      previewCfg.isDual = true;
      previewCfg.series2 = previewCfg.series1.map(v => Math.max(5, Math.round(v * 0.65)));
    }

    const now = performance.now();
    const cycleDurationMs = (durSec + 1.2) * 1000;
    const elapsedSec = ((now - modalPreviewStartTime) % cycleDurationMs) / 1000;
    const progress = Math.min(1.0, elapsedSec / durSec);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    // Draw container card
    pCtx.save();
    pCtx.fillStyle = 'rgba(12, 14, 20, 0.96)';
    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    pCtx.lineWidth = 1.5;
    pCtx.beginPath();
    pCtx.roundRect(12, 10, pw - 24, ph - 20, 8);
    pCtx.fill();
    pCtx.stroke();

    // Title
    pCtx.font = '800 16px "Inter", "Oswald", sans-serif';
    pCtx.fillStyle = '#ffffff';
    pCtx.fillText(previewCfg.title || 'PREVIEW', 26, 32);

    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.moveTo(26, 40);
    pCtx.lineTo(pw - 26, 40);
    pCtx.stroke();
    pCtx.restore();

    // Render chart graphics
    const chartX = 26;
    const chartY = 50;
    const chartW = pw - 52;
    const chartH = ph - 68;

    if (previewCfg.type === 'bar') {
      drawStaggeredBarChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else if (previewCfg.type === 'pyramid') {
      drawLiquidPyramidChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else {
      drawDynamicAreaChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress, easeOut);
    }

    modalPreviewAnimFrame = requestAnimationFrame(renderModalPreview);
  }

  modalPreviewAnimFrame = requestAnimationFrame(renderModalPreview);
}

// Initialize Charts & Infographics UI & event listeners
let selectedModalType = 'area';

function initChartsAndInfographicsEngine() {
  // Timeline Toolbar button
  const btnTimelineChart = document.getElementById('tool-add-chart');
  if (btnTimelineChart) {
    btnTimelineChart.addEventListener('click', () => {
      openChartCreatorModal();
    });
  }

  // Sidebar Panel "New Chart" button
  const btnCreateTrigger = document.getElementById('btn-create-chart-trigger');
  if (btnCreateTrigger) {
    btnCreateTrigger.addEventListener('click', () => {
      openChartCreatorModal();
    });
  }

  // Inspector "Edit in Pop-up Modal" button
  document.getElementById('btn-chart-open-modal')?.addEventListener('click', () => {
    if (selectedClip?.clip?.chartConfig) {
      openChartEditorModalForClip(selectedClip.clip);
    }
  });

  // Modal Replay Animation button
  document.getElementById('btn-chart-modal-replay')?.addEventListener('click', () => {
    modalPreviewStartTime = performance.now();
  });

  // Close modal listeners
  document.getElementById('btn-close-chart-modal')?.addEventListener('click', closeChartCreatorModal);
  document.getElementById('btn-cancel-chart-modal')?.addEventListener('click', closeChartCreatorModal);

  // Modal Chart Type Cards
  document.querySelectorAll('.chart-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.chart-type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedModalType = card.dataset.chartType;

      const titleInput = document.getElementById('modal-chart-title');
      const dataInput = document.getElementById('modal-chart-data');
      const dataLabel = document.getElementById('modal-chart-data-label');
      if (selectedModalType === 'area') {
        if (dataLabel) dataLabel.textContent = 'Data Values (CSV)';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'COST PER LEAD';
        if (dataInput && !modalEditingClip) dataInput.value = '42, 60, 50, 78, 62, 51, 68, 48, 70, 52, 64, 40, 68, 25, 18';
      } else if (selectedModalType === 'bar') {
        if (dataLabel) dataLabel.textContent = 'Bar Values (CSV)';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'CONVERSION RATE';
        if (dataInput && !modalEditingClip) dataInput.value = '12, 28, 25, 32, 60, 62, 40, 63, 72, 85, 52, 35';
      } else if (selectedModalType === 'pyramid') {
        if (dataLabel) dataLabel.textContent = 'Apex Tier Headline Text';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'BUYER HIERARCHY';
        if (dataInput && !modalEditingClip) dataInput.value = '3% BUYING NOW';
      }
      modalPreviewStartTime = performance.now();
    });
  });

  // Modal Presets Quick Select
  document.querySelectorAll('#modal-chart-presets-wrap button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#modal-chart-presets-wrap button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      const tpl = PREBUILT_CHART_TEMPLATES.find(t => t.id.includes(presetKey.replace(/_/g, '-')));
      if (tpl) {
        selectedModalType = tpl.type;
        document.querySelectorAll('.chart-type-card').forEach(c => {
          c.classList.toggle('active', c.dataset.chartType === selectedModalType);
        });
        const titleInput = document.getElementById('modal-chart-title');
        const colorInput = document.getElementById('modal-chart-color');
        const colorLabel = document.getElementById('modal-chart-color-label');
        const dataInput = document.getElementById('modal-chart-data');
        const dataLabel = document.getElementById('modal-chart-data-label');
        if (titleInput) titleInput.value = tpl.config.title;
        if (colorInput) {
          colorInput.value = tpl.config.color;
          if (colorLabel) colorLabel.textContent = tpl.config.color;
        }
        if (dataInput) {
          if (tpl.type === 'pyramid') {
            if (dataLabel) dataLabel.textContent = 'Apex Tier Headline Text';
            dataInput.value = tpl.config.tierText;
          } else if (tpl.type === 'bar') {
            if (dataLabel) dataLabel.textContent = 'Bar Values (CSV)';
            dataInput.value = tpl.config.values.join(', ');
          } else {
            if (dataLabel) dataLabel.textContent = 'Data Values (CSV)';
            dataInput.value = tpl.config.series1.join(', ');
          }
        }
        modalPreviewStartTime = performance.now();
      }
    });
  });

  // Color Picker in Modal
  document.getElementById('modal-chart-color')?.addEventListener('input', (e) => {
    const lbl = document.getElementById('modal-chart-color-label');
    if (lbl) lbl.textContent = e.target.value;
  });

  // Duration Slider in Modal
  const modalDur = document.getElementById('modal-chart-duration');
  const modalDurVal = document.getElementById('modal-chart-duration-val');
  if (modalDur && modalDurVal) {
    modalDur.addEventListener('input', (e) => {
      modalDurVal.textContent = `${(parseInt(e.target.value) / 10).toFixed(1)}s`;
    });
  }

  // Confirm Add or Update Chart Button in Modal
  document.getElementById('btn-confirm-add-chart')?.addEventListener('click', () => {
    const title = document.getElementById('modal-chart-title')?.value || 'CHART';
    const color = document.getElementById('modal-chart-color')?.value || '#00f0ff';
    const durationSec = (parseInt(modalDur?.value || '18') / 10);
    const rawData = document.getElementById('modal-chart-data')?.value || '';

    let config = {
      type: selectedModalType,
      title,
      color,
      drawDuration: durationSec,
      glow: true
    };

    if (selectedModalType === 'pyramid') {
      config.tierText = rawData.trim() || '3% BUYING NOW';
      config.tierIndex = modalEditingClip?.chartConfig?.tierIndex || 0;
    } else if (selectedModalType === 'bar') {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      config.values = vals.length > 0 ? vals : [10, 25, 40, 75, 50];
      config.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, config.values.length);
    } else {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      config.series1 = vals.length > 0 ? vals : [20, 50, 40, 80, 60, 30, 15];
      config.isDual = true;
      config.series2 = config.series1.map(v => Math.max(5, Math.round(v * 0.65)));
    }

    if (modalEditingClip) {
      // Mutate existing clip in place
      modalEditingClip.chartConfig = config;
      modalEditingClip.name = config.title || 'Infographic';
      renderAllTimelineTracks();
      populateChartInspector(modalEditingClip);
      recordState('Update Animated Chart');
      showTextTimingAlert(`Updated "${modalEditingClip.name}" chart!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2500);
    } else {
      // Add new clip
      addChartClipToTimeline(config, currentTime, 6.0);
    }

    closeChartCreatorModal();
  });

  // Right Inspector Live Updates for Selected Chart
  document.getElementById('chart-inspector-title')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.title = e.target.value;
      selectedClip.clip.name = e.target.value || 'Infographic';
      renderAllTimelineTracks();
    }
  });

  document.getElementById('chart-inspector-color')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.color = e.target.value;
    }
  });

  document.getElementById('chart-inspector-duration')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      const sec = parseInt(e.target.value) / 10;
      selectedClip.clip.chartConfig.drawDuration = sec;
      const lbl = document.getElementById('chart-inspector-dur-val');
      if (lbl) lbl.textContent = `${sec.toFixed(1)}s`;
    }
  });

  document.getElementById('chart-inspector-glow')?.addEventListener('change', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.glow = e.target.checked;
    }
  });

  document.getElementById('btn-chart-dual-true')?.addEventListener('click', () => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.isDual = true;
      document.getElementById('btn-chart-dual-true')?.classList.add('active');
      document.getElementById('btn-chart-dual-false')?.classList.remove('active');
      const rowS2 = document.getElementById('row-chart-inspector-series2');
      if (rowS2) rowS2.style.display = 'block';
      recordState('Toggle Chart Dual Mode');
    }
  });

  document.getElementById('btn-chart-dual-false')?.addEventListener('click', () => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.isDual = false;
      document.getElementById('btn-chart-dual-false')?.classList.add('active');
      document.getElementById('btn-chart-dual-true')?.classList.remove('active');
      const rowS2 = document.getElementById('row-chart-inspector-series2');
      if (rowS2) rowS2.style.display = 'none';
      recordState('Toggle Chart Single Mode');
    }
  });

  document.getElementById('chart-inspector-series1')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      const vals = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (vals.length > 0) selectedClip.clip.chartConfig.series1 = vals;
    }
  });

  document.getElementById('chart-inspector-series2')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      const vals = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (vals.length > 0) selectedClip.clip.chartConfig.series2 = vals;
    }
  });

  document.getElementById('chart-inspector-bar-labels')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.labels = e.target.value.split(',').map(s => s.trim());
    }
  });

  document.getElementById('chart-inspector-bar-values')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      const vals = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (vals.length > 0) selectedClip.clip.chartConfig.values = vals;
    }
  });

  document.getElementById('chart-inspector-pyramid-tier')?.addEventListener('change', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.tierIndex = parseInt(e.target.value);
      recordState('Change Pyramid Tier');
    }
  });

  document.getElementById('chart-inspector-pyramid-text')?.addEventListener('input', (e) => {
    if (selectedClip?.clip?.chartConfig) {
      selectedClip.clip.chartConfig.tierText = e.target.value;
    }
  });

  document.getElementById('btn-delete-chart')?.addEventListener('click', () => {
    if (selectedClip?.clip) {
      deleteClip('chart', selectedClip.clip.id);
    }
  });
}

// ====================================================================================
// ⭐ VECTOR ICONS & BADGES ENGINE
// ====================================================================================

const VECTOR_ICONS_LIBRARY = [
  { id: 'icon-dollar', name: 'Dollar / Cash', color: '#00e676', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
  { id: 'icon-trending-up', name: 'Trending Growth', color: '#00f0ff', path: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' },
  { id: 'icon-trending-down', name: 'Crash / Decline', color: '#ff334b', path: 'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z' },
  { id: 'icon-target', name: 'Bullseye Target', color: '#ffd000', path: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z' },
  { id: 'icon-star', name: 'Premium Star', color: '#ffd000', path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
  { id: 'icon-fire', name: 'Viral / Hot', color: '#ff6b35', path: 'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z' },
  { id: 'icon-alert', name: 'Warning Alert', color: '#ff334b', path: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' },
  { id: 'icon-verified', name: 'Verified Badge', color: '#00f0ff', path: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
  { id: 'icon-lightning', name: 'Flash / Punch', color: '#ffd000', path: 'M7 2v11h3v9l7-12h-4l4-8z' },
  { id: 'icon-chart-bar', name: 'Bar Metric', color: '#76ff03', path: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z' },
  { id: 'icon-document', name: 'Forensic Proof', color: '#ffffff', path: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  { id: 'icon-skull', name: 'Scam / Danger', color: '#ff334b', path: 'M12 2C7.58 2 4 5.58 4 10c0 2.21.9 4.21 2.34 5.66L6 20h3v-2h2v2h2v-2h2v2h3l-.34-4.34C19.1 14.21 20 12.21 20 10c0-4.42-3.58-8-8-8zm-3 9c-.83 0-1.5-.67-1.5-1.5S8.17 8 9 8s1.5.67 1.5 1.5S9.83 11 9 11zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 8 15 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' }
];

function renderIconsLibraryPanel(filterText = '') {
  const container = document.getElementById('icons-grid-container');
  if (!container) return;
  container.innerHTML = '';

  const filtered = VECTOR_ICONS_LIBRARY.filter(i => {
    if (!filterText) return true;
    return i.name.toLowerCase().includes(filterText.toLowerCase()) || i.id.toLowerCase().includes(filterText.toLowerCase());
  });

  filtered.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'icon-badge-card';
    card.innerHTML = `
      <div class="icon-badge-svg" style="color: ${icon.color};">
        <svg viewBox="0 0 24 24"><path d="${icon.path}"/></svg>
      </div>
      <div class="icon-badge-name" title="${icon.name}">${icon.name}</div>
    `;

    card.addEventListener('click', () => {
      addIconStickerToTimeline(icon);
    });

    container.appendChild(card);
  });
}

function addIconStickerToTimeline(iconDef) {
  // Generate clean SVG Data URI
  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="240" height="240" fill="${iconDef.color}"><path d="${iconDef.path}"/></svg>`;
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const newClip = {
      id: `clip-icon-${Date.now()}`,
      name: `${iconDef.name} Icon`,
      start: currentTime,
      duration: 5.0,
      scale: 0.65,
      x: 0,
      y: 0,
      zIndex: 22,
      layerOrder: 'front',
      isIconSticker: true,
      iconType: iconDef.id,
      img: img,
      file: { name: `${iconDef.name}.svg`, url, isImage: true }
    };

    timelineClips.image.push(newClip);
    renderAllTimelineTracks();
    selectClip(newClip, 'image');
    recordState('Add Icon Sticker');
    playSFX('whoosh', 0.5);
    showTextTimingAlert(`Added "${iconDef.name}" sticker to canvas! Drag on screen to position or scale.`, 'success');
    setTimeout(() => showTextTimingAlert(''), 3000);
  };
  img.src = url;
}

function initVectorIconsEngine() {
  const searchInput = document.getElementById('icon-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderIconsLibraryPanel(e.target.value.trim());
    });
  }

  const btnTimelineIcon = document.getElementById('tool-add-icon');
  if (btnTimelineIcon) {
    btnTimelineIcon.addEventListener('click', () => {
      const tabIcons = document.getElementById('tab-btn-icons');
      if (tabIcons) tabIcons.click();
    });
  }
}

