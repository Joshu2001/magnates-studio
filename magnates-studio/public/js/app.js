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
let selectedEffectId = null; // { clipId, trackType, effectType, effectIndex }
let selectedTransitionId = null; // { clipId, trackType }
let timelineViewMode = 'multi'; // 'multi' (discrete lanes) or 'consolidated' (single unified storyline)

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
  quote: [],
  image: [],
  video: [],
  voiceover: [],
  music: [],
  background: [
    {
      id: 'clip-bg-default',
      start: 0,
      duration: 60,
      bgType: 'cyber_grid',
      bgColor: '#0a0b0e'
    }
  ]
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
  selectedEffectId = null;
  selectedTransitionId = null;
  renderAllTimelineTracks();
  updateUI();
  updateUndoRedoUI();
  if (typeof saveProjectState === 'function') {
    saveProjectState(false);
  }
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
  selectedEffectId = null;
  selectedTransitionId = null;
  renderAllTimelineTracks();
  updateUI();
  updateUndoRedoUI();
  if (typeof saveProjectState === 'function') {
    saveProjectState(false);
  }
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
  } else if (type === 'pencil_circle' || type === 'pencil' || type === 'pencil_scribble') {
    // YouTuber signature pencil scratch / circle highlight SFX (textured multi-burst friction)
    const strokeCount = (type === 'pencil_scribble') ? 6 : 4;
    for (let s = 0; s < strokeCount; s++) {
      const delay = s * 0.07 + (Math.random() * 0.02);
      const strokeDur = 0.065;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * strokeDur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < data.length; j++) {
        // High-frequency graphite paper grain friction
        data[j] = (Math.random() * 2 - 1) * Math.sin(j / 3.5);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2200 + (s * 350) + (Math.random() * 400), now + delay);
      bp.Q.setValueAtTime(4.5, now + delay);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.01 * volMult, now + delay);
      g.gain.linearRampToValueAtTime(0.7 * volMult, now + delay + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + strokeDur);

      noise.connect(bp);
      bp.connect(g);
      g.connect(ctx.destination);
      noise.start(now + delay);
      noise.stop(now + delay + strokeDur);
    }
  } else if (type === 'marker_swipe') {
    // Mike Shake / Vox squeaky felt-tip marker swipe
    const dur = 0.28;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.linearRampToValueAtTime(1400, now + 0.1);
    osc.frequency.linearRampToValueAtTime(820, now + dur);

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1200, now);
    bp.Q.setValueAtTime(6.0, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.01 * volMult, now);
    g.gain.linearRampToValueAtTime(0.45 * volMult, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  } else if (type === 'paper_tear' || type === 'paper' || type === 'tear') {
    // Multi-stage realistic paper rip / torn sheet sound
    const ripDur = 0.42;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * ripDur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let j = 0; j < data.length; j++) {
      // Crunchy cellulose fiber rip noise
      const envelope = Math.sin((j / data.length) * Math.PI);
      const crackle = (Math.random() > 0.88) ? (Math.random() * 2 - 1) * 1.8 : 0;
      data[j] = ((Math.random() * 2 - 1) * 0.7 + crackle) * envelope;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.setValueAtTime(900, now);
    hp.frequency.exponentialRampToValueAtTime(3200, now + 0.18);
    hp.frequency.exponentialRampToValueAtTime(1100, now + ripDur);
    hp.Q.setValueAtTime(1.8, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05 * volMult, now);
    g.gain.linearRampToValueAtTime(0.85 * volMult, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, now + ripDur);

    noise.connect(hp);
    hp.connect(g);
    g.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + ripDur);
  } else if (type === 'pop_cork') {
    // Snappy hollow pop / bubble punch
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(1150, now + 0.035);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
    g.gain.setValueAtTime(0.75 * volMult, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'gentle_wind' || type === 'wind' || type === 'breeze') {
    // Gentle blowing wind / ambient transition gust (Magnates Media style)
    // Pinkish soft noise swept through a smooth resonant lowpass/bandpass filter
    const dur = 1.35;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 3-pole pinking filter approximation for warm airy wind texture without harsh treble
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.22;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Resonant bandpass filter that swells and gently recedes like an atmospheric breath/wind
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.8, now);
    filter.frequency.setValueAtTime(260, now);
    filter.frequency.exponentialRampToValueAtTime(820, now + 0.45);
    filter.frequency.exponentialRampToValueAtTime(380, now + 0.95);
    filter.frequency.exponentialRampToValueAtTime(180, now + dur);

    // Subtle lowpass companion for warmth
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(1400, now);
    lpFilter.frequency.exponentialRampToValueAtTime(2200, now + 0.45);
    lpFilter.frequency.exponentialRampToValueAtTime(700, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001 * volMult, now);
    gain.gain.linearRampToValueAtTime(0.72 * volMult, now + 0.42);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noiseSource.connect(filter);
    filter.connect(lpFilter);
    lpFilter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + dur);
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

  // Suppress fiery bottom glow and ember sparks when focusing on documents, articles, or highlights
  const activeDoc = [...timelineClips.image, ...timelineClips.video].find(c =>
    currentTime >= c.start && currentTime <= (c.start + c.duration) && (c.docFocus || (c.highlights && c.highlights.length > 0))
  );
  if (activeDoc) return;

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

  // Dynamic Number Counter (Rolling Count-Up Animation: e.g. 10 -> 33 or 10 -> 1,014%)
  if (animStyle === 'counter') {
    let startVal = activeText.counterStart !== undefined ? activeText.counterStart : 0;
    let endVal = activeText.counterEnd !== undefined ? activeText.counterEnd : null;
    let suffix = activeText.counterSuffix !== undefined ? activeText.counterSuffix : null;
    let prefix = activeText.counterPrefix !== undefined ? activeText.counterPrefix : '';
    const countDuration = activeText.counterDuration || Math.min(2.0, activeText.duration || 2.0);

    // Auto-parse numeric target, prefix, and suffix from clip text if not explicitly configured
    if (endVal === null) {
      const raw = activeText.text || '100';
      const match = raw.match(/^([^0-9.-]*)([0-9.,]+)(.*)$/);
      if (match) {
        if (prefix === '') prefix = match[1] || '';
        const numStr = match[2].replace(/,/g, '');
        endVal = parseFloat(numStr) || 100;
        if (suffix === null) suffix = match[3] || '';
      } else {
        endVal = parseFloat(raw.replace(/[^0-9.-]/g, '')) || 100;
        if (suffix === null) suffix = '';
      }
    }
    if (suffix === null) suffix = '';

    // Smooth cubic ease-out count-up progression
    const countProg = Math.min(1.0, Math.max(0, elapsed / countDuration));
    const easeOut = 1 - Math.pow(1 - countProg, 3);
    const currentVal = Math.round(startVal + (endVal - startVal) * easeOut);
    const formattedVal = `${prefix}${currentVal.toLocaleString()}${suffix}`;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = textColor;

    // Pulse highlight glow as counter decelerates into lock
    if (countProg > 0.85) {
      ctx.shadowColor = highlightColor;
      ctx.shadowBlur = 35;
    }

    ctx.fillText(formattedVal, currentX, currentY + animOffsetY);
    ctx.restore();

    const metrics = ctx.measureText(formattedVal);
    const textWidth = metrics.width;
    maxBoxX = currentX + textWidth;
    minBoxX = currentX;
    minBoxY = currentY - (fontSize * 0.55);
    maxBoxY = currentY + (fontSize * 0.55);

    // Store bounding box for interaction
    const padding = 16;
    const boxW = Math.max(80, (maxBoxX - minBoxX) + padding * 2);
    const boxH = Math.max(fontSize + 16, (maxBoxY - minBoxY) + padding * 2);
    const boxX = minBoxX - padding;
    const boxY = minBoxY - padding;
    activeText._renderBounds = { x: boxX, y: boxY, w: boxW, h: boxH };

    ctx.restore();

    if (selectedClip && selectedClip.clip.id === activeText.id && selectedClip.trackType === 'text') {
      drawTransformHandles(boxX, boxY, boxW, boxH);
    }
    return;
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

    // Falling / Cascade Drop animation
    let wordOffsetY = animOffsetY;
    let wordAlpha = 1.0;
    if (animStyle === 'falling') {
      const staggerDelay = 0.08 * idx;
      const wordElapsed = Math.max(0, elapsed - staggerDelay);
      const fallDur = 0.45;
      const t = Math.min(1.0, wordElapsed / fallDur);
      if (t <= 0) {
        ctx.restore();
        return;
      }
      // Elastic / bounce settle landing curve
      const p = t < 0.7 ? Math.pow(t / 0.7, 2) : 1 + Math.sin((t - 0.7) * Math.PI / 0.3) * 0.08 * (1 - t);
      wordOffsetY += (1 - p) * -90;
      wordAlpha = Math.min(1.0, t * 2.5);
      ctx.globalAlpha = (ctx.globalAlpha || 1.0) * wordAlpha;
    }

    ctx.fillText(word, currentX, currentY + wordOffsetY);
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

// ==================== SMART BACKGROUND PROXY & CACHE ENGINE ====================
let isProxyModeEnabled = localStorage.getItem('magnates_proxy_mode') !== 'false'; // Default ON for zero-lag scrubbing
const proxyUrlCache = new Map();

function fetchVideoProxyIfNeeded(file) {
  if (!file || !file.isVideo || file.proxyUrl || proxyUrlCache.has(file.name)) return;
  fetch(`/api/proxy/status?filename=${encodeURIComponent(file.name)}`)
    .then(r => r.json())
    .then(data => {
      if (data.ready) {
        file.proxyUrl = data.url;
        proxyUrlCache.set(file.name, data.url);
      } else {
        fetch('/api/proxy/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, path: file.path })
        })
          .then(r => r.json())
          .then(genData => {
            if (genData.success && genData.url) {
              file.proxyUrl = genData.url;
              proxyUrlCache.set(file.name, genData.url);
            }
          })
          .catch(() => {});
      }
    })
    .catch(() => {});
}

// ==================== COLOR PIPELINE & COMPOSITING MATH ====================
function getCanvasBlendMode(mode) {
  switch (mode) {
    case 'screen': return 'screen';
    case 'multiply': return 'multiply';
    case 'overlay': return 'overlay';
    case 'lighter':
    case 'add': return 'lighter';
    case 'color-dodge': return 'color-dodge';
    case 'soft-light': return 'soft-light';
    case 'hard-light': return 'hard-light';
    default: return 'source-over';
  }
}

function buildClipColorFilter(clip) {
  if (!clip) return 'none';
  const filters = [];
  const lift = clip.lift || 0;
  const gamma = clip.gamma || 0;
  const gain = clip.gain || 0;
  const sat = clip.saturation !== undefined ? clip.saturation : 100;
  const temp = clip.temperature || 0;
  
  const brightness = 100 + lift * 0.8 + gain * 0.6;
  const contrast = 100 + gamma * 1.2;
  
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (sat !== 100) filters.push(`saturate(${sat}%)`);
  if (temp !== 0) {
    if (temp > 0) {
      filters.push(`sepia(${temp * 0.4}%)`);
      filters.push(`hue-rotate(-${temp * 0.3}deg)`);
    } else {
      filters.push(`hue-rotate(${Math.abs(temp) * 0.6}deg)`);
    }
  }

  if (clip.lut === 'teal_orange') {
    filters.push('contrast(125%) saturate(130%) hue-rotate(-12deg)');
  } else if (clip.lut === 'warm_kodak') {
    filters.push('sepia(25%) contrast(108%) saturate(115%)');
  } else if (clip.lut === 'bleach_bypass') {
    filters.push('contrast(160%) saturate(55%) brightness(105%)');
  } else if (clip.lut === 'technicolor') {
    filters.push('contrast(135%) saturate(160%) hue-rotate(5deg)');
  } else if (clip.lut === 'noir') {
    filters.push('grayscale(100%) contrast(150%) brightness(95%)');
  }

  return filters.length > 0 ? filters.join(' ') : 'none';
}

// ==================== TEMPORAL KEYFRAMING ENGINE ====================
function getClipInterpolatedProp(clip, propName, offsetTime, defaultVal) {
  if (!clip || !clip.keyframes || !clip.keyframes[propName] || clip.keyframes[propName].length === 0) {
    return (clip && clip[propName] !== undefined) ? clip[propName] : defaultVal;
  }
  const kfs = clip.keyframes[propName].slice().sort((a, b) => a.time - b.time);
  if (offsetTime <= kfs[0].time) return kfs[0].value;
  if (offsetTime >= kfs[kfs.length - 1].time) return kfs[kfs.length - 1].value;

  for (let i = 0; i < kfs.length - 1; i++) {
    const k1 = kfs[i];
    const k2 = kfs[i + 1];
    if (offsetTime >= k1.time && offsetTime <= k2.time) {
      const span = k2.time - k1.time;
      if (span <= 0.0001) return k2.value;
      const progress = (offsetTime - k1.time) / span;
      let ease = progress;
      const easingType = k2.easing || clip.kfEasing || 'ease';
      if (easingType === 'ease' || easingType === 'easeInOutCubic') {
        ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      } else if (easingType === 'spring') {
        ease = Math.sin(progress * Math.PI * 2) * (1 - progress) + progress;
      } else if (easingType === 'easeOutBack') {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        ease = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
      }
      return k1.value + (k2.value - k1.value) * ease;
    }
  }
  return defaultVal;
}

// Active media element cache
const mediaElementCache = new Map();

function getMediaElement(file) {
  if (!file) return null;
  if (file.isVideo) fetchVideoProxyIfNeeded(file);

  const effectiveUrl = (isProxyModeEnabled && file.isVideo && (file.proxyUrl || proxyUrlCache.get(file.name)))
    ? (file.proxyUrl || proxyUrlCache.get(file.name))
    : file.url;

  if (mediaElementCache.has(effectiveUrl)) {
    return mediaElementCache.get(effectiveUrl);
  }
  let el;
  if (file.isVideo) {
    el = document.createElement('video');
    el.src = effectiveUrl;
    el.muted = true; // start muted for preview
    el.playsInline = true;
    el.preload = 'auto';
  } else if (file.isImage) {
    el = new Image();
    el.src = effectiveUrl;
  }
  if (el) mediaElementCache.set(effectiveUrl, el);
  return el;
}

let activePreviewMedia = null;

let _docMaskCanvas = null;
function getDocMaskCanvas(w, h) {
  if (!_docMaskCanvas) {
    _docMaskCanvas = document.createElement('canvas');
  }
  const targetW = Math.max(64, Math.min(3840, Math.round(w)));
  const targetH = Math.max(64, Math.min(2160, Math.round(h)));
  if (_docMaskCanvas.width !== targetW || _docMaskCanvas.height !== targetH) {
    _docMaskCanvas.width = targetW;
    _docMaskCanvas.height = targetH;
  }
  return _docMaskCanvas;
}

let _docHlCanvas = null;
function getDocHlCanvas(w, h) {
  if (!_docHlCanvas) {
    _docHlCanvas = document.createElement('canvas');
  }
  const targetW = Math.max(64, Math.min(3840, Math.round(w)));
  const targetH = Math.max(64, Math.min(2160, Math.round(h)));
  if (_docHlCanvas.width !== targetW || _docHlCanvas.height !== targetH) {
    _docHlCanvas.width = targetW;
    _docHlCanvas.height = targetH;
  }
  return _docHlCanvas;
}

function getClipDocumentScrollOffset(clip, time, baseW, baseH) {
  if (!clip || !clip.docScroll || !clip.docScrollMode) {
    return { x: 0, y: 0 };
  }
  const elapsed = time - clip.start;
  const linger = clip.docScrollLinger !== undefined ? clip.docScrollLinger : 1.0;
  if (elapsed <= linger) {
    return { x: 0, y: 0 };
  }

  const travelDur = clip.docScrollSpeed !== undefined ? clip.docScrollSpeed : 3.0;
  const scrollT = Math.min(1.0, Math.max(0.0, (elapsed - linger) / Math.max(0.5, travelDur)));
  // Smooth cubic easeInOut for fluid cinematic reading motion
  const ease = scrollT < 0.5 ? 4 * scrollT * scrollT * scrollT : 1 - Math.pow(-2 * scrollT + 2, 3) / 2;
  const dist = clip.docScrollDistance || 280;

  if (clip.docScrollMode === 'down') {
    // Camera pans downwards into document -> document moves upward
    return { x: 0, y: -dist * ease };
  } else if (clip.docScrollMode === 'across') {
    // Camera pans across to the right -> document moves left
    return { x: -dist * ease, y: 0 };
  } else if (clip.docScrollMode === 'zigzag') {
    // Highlight Flow: Glides smoothly from first highlight to subsequent highlights
    if (clip.highlights && clip.highlights.length >= 2) {
      const h1 = clip.highlights[0];
      const h2 = clip.highlights[clip.highlights.length - 1];
      const deltaPxX = (h2.x - h1.x) * baseW;
      const deltaPxY = (h2.y - h1.y) * baseH;
      return { x: -deltaPxX * ease, y: -deltaPxY * ease };
    } else {
      // Default diagonal/zigzag flow down-right
      return { x: -(dist * 0.4) * ease, y: -dist * ease };
    }
  }
  return { x: 0, y: 0 };
}

// Motion Blur Crowds & Commuter Swarms - Fast-moving high-angle time lapse pan & person-to-person drift
function getClipMotionBlurCrowdTransform(clip, time, baseW, baseH) {
  if (!clip || !clip.motionBlurCrowd) return null;
  const elapsed = Math.max(0, time - clip.start);
  const dur = Math.max(0.5, clip.duration || 6);
  const t = Math.min(1.0, elapsed / dur);

  // If user encircled custom numbered waypoints (1, 2, 3...)
  const waypoints = clip.crowdWaypoints;
  if (waypoints && waypoints.length >= 1) {
    if (waypoints.length === 1) {
      // Single encircled person: smoothly zoom into that exact person
      const wp = waypoints[0];
      const targetPanX = -(wp.x - 0.5) * baseW;
      const targetPanY = -(wp.y - 0.5) * baseH;
      const targetZoom = wp.zoomScale || 1.35;
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
      const panX = targetPanX * ease;
      const panY = targetPanY * ease;
      const zoomScale = 1.0 + (targetZoom - 1.0) * ease;
      return { panX, panY, zoomScale };
    }

    // Multiple waypoints (e.g. 1 -> 2 -> 3 -> 4 -> 5): travel sequentially through each circled person
    const segments = waypoints.length - 1;
    const scaledT = t * segments;
    const segIdx = Math.min(segments - 1, Math.floor(scaledT));
    const localT = scaledT - segIdx;
    
    // Smooth S-curve easing between points
    const ease = 0.5 - 0.5 * Math.cos(localT * Math.PI);

    const wpA = waypoints[segIdx];
    const wpB = waypoints[segIdx + 1];

    const panAX = -(wpA.x - 0.5) * baseW;
    const panAY = -(wpA.y - 0.5) * baseH;
    const panBX = -(wpB.x - 0.5) * baseW;
    const panBY = -(wpB.y - 0.5) * baseH;

    const panX = panAX + (panBX - panAX) * ease;
    const panY = panAY + (panBY - panAY) * ease;

    // Dynamic zoom close in / zoom out between people
    const zoomA = wpA.zoomScale || (clip.crowdZoomMode === 'wide' ? 1.08 : 1.32);
    const zoomB = wpB.zoomScale || (clip.crowdZoomMode === 'wide' ? 1.08 : 1.32);
    
    // Dip or push in midpoint for natural camera breathing between crowd members
    const midPulse = Math.sin(localT * Math.PI) * (clip.crowdZoomMode === 'wide' ? 0.05 : -0.12);
    const zoomScale = (zoomA + (zoomB - zoomA) * ease) + midPulse;

    return { panX, panY, zoomScale };
  }

  // Default automatic 5-point crowd weave when no manual lasso circles exist yet
  // Smooth cinematic S-curve glide
  const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
  
  // Person-to-person parallax drift: drifts along crowd movement vector with subtle micro-sway and zoom
  const panDistanceX = baseW * 0.16;
  const panDistanceY = baseH * 0.08;
  const sway = Math.sin(t * Math.PI * 2) * (baseH * 0.015);
  
  const panX = -panDistanceX * (ease - 0.5);
  const panY = -panDistanceY * (ease - 0.5) + sway;
  
  // High-momentum perspective scale surge
  const zoomScale = (clip.crowdZoomMode === 'wide' ? 1.06 : 1.25) + 0.09 * Math.sin(t * Math.PI);

  return { panX, panY, zoomScale };
}

function computeEasingValue(t, curve = 'easeOutCubic') {
  const clamped = Math.min(1.0, Math.max(0.0, t));
  switch (curve) {
    case 'linear':
      return clamped;
    case 'easeInOutQuad':
      return clamped < 0.5 ? 2 * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
    case 'spring':
      return clamped < 1 ? Math.sin((clamped * Math.PI) / 2) * (1 + 0.12 * Math.sin(clamped * Math.PI)) : 1;
    case 'easeOutCubic':
    default:
      return 1 - Math.pow(1 - clamped, 3.5);
  }
}

function getClipPunchZoom(clip, time, baseDx, baseDy, baseW, baseH) {
  if (!clip || clip.zoomEffect !== 'snap') {
    return { scale: 1.0, originX: baseDx + baseW * 0.5, originY: baseDy + baseH * 0.5 };
  }
  const zoomElapsed = time - clip.start;
  const zoomInAt = clip.zoomStartTime !== undefined ? clip.zoomStartTime : 0.5;
  const zoomDur = clip.zoomDuration || 0.42;
  const targetScale = clip.zoomScale || 2.2;
  const targetOriginX = clip.zoomOriginX !== undefined ? clip.zoomOriginX : 0.5;
  const targetOriginY = clip.zoomOriginY !== undefined ? clip.zoomOriginY : 0.5;

  let currentPunch = 1.0;
  if (zoomElapsed >= zoomInAt) {
    const t = (zoomElapsed - zoomInAt) / Math.max(0.05, zoomDur);
    const ease = computeEasingValue(t, clip.zoomEasing || 'easeOutCubic');
    currentPunch = 1.0 + (targetScale - 1.0) * ease;
  }
  const originPxX = baseDx + baseW * targetOriginX;
  const originPxY = baseDy + baseH * targetOriginY;
  return { scale: currentPunch, originX: originPxX, originY: originPxY };
}

function renderDocFocusAndHighlights(ctx, targetClip, currentTime, dx, dy, finalW, finalH) {
  const docElapsed = currentTime - targetClip.start;
  const punch = getClipPunchZoom(targetClip, currentTime, dx, dy, finalW, finalH);
  const pScale = punch ? punch.scale : 1.0;

  // Normalise spotlights: targetClip.spotlights array OR legacy targetClip.docFocus
  const spotlights = [];
  if (Array.isArray(targetClip.spotlights) && targetClip.spotlights.length > 0) {
    spotlights.push(...targetClip.spotlights);
  } else if (targetClip.docFocus && targetClip.docFocusRect) {
    spotlights.push({
      rect: targetClip.docFocusRect,
      style: targetClip.docStyle || 'dark',
      dimOpacity: targetClip.docDimOpacity !== undefined ? targetClip.docDimOpacity : 0.65,
      feather: targetClip.docFeather !== undefined ? targetClip.docFeather : (targetClip.docStyle === 'white' ? 18 : 16),
      startTime: targetClip.docFocusStartTime !== undefined ? targetClip.docFocusStartTime : 0.4,
      duration: targetClip.docFocusDuration || 0
    });
  }

  // 1. Render Spotlights (Whiteout or Dark Dim)
  spotlights.forEach((spot, sIdx) => {
    const isWhiteout = spot.style === 'white';
    const sStart = spot.startTime !== undefined ? spot.startTime : 0.4;
    let focusActiveEase = 1.0;
    if (spot.duration && spot.duration > 0) {
      const fadeOutStart = sStart + spot.duration;
      const fadeOutDur = 0.5;
      if (docElapsed > fadeOutStart) {
        const outProg = Math.min(1.0, Math.max(0.0, (docElapsed - fadeOutStart) / fadeOutDur));
        focusActiveEase = 1.0 - (1 - Math.pow(1 - outProg, 3));
      }
    }

    const r = spot.rect || { x: 0.1, y: 0.2, w: 0.8, h: 0.25 };
    const fx = dx + finalW * r.x;
    const fy = dy + finalH * r.y;
    const fw = Math.max(10, finalW * r.w);
    const fh = Math.max(10, finalH * r.h);

    const t = Math.min(1.0, Math.max(0.0, (docElapsed - sStart) / 0.4));
    const ease = (1 - Math.pow(1 - t, 3)) * focusActiveEase;
    const maxDim = (spot.dimOpacity !== undefined ? spot.dimOpacity : 0.65) * ease;

    if (maxDim > 0.01) {
      const feather = spot.feather !== undefined ? spot.feather : (isWhiteout ? 18 : 16);
      const maskW = Math.max(64, Math.round(finalW));
      const maskH = Math.max(64, Math.round(finalH));
      const maskCanvas = getDocMaskCanvas(maskW, maskH);
      const maskCtx = maskCanvas.getContext('2d');
      maskCtx.clearRect(0, 0, maskW, maskH);

      if (isWhiteout) {
        maskCtx.fillStyle = `rgba(255, 255, 255, ${maxDim})`;
      } else {
        maskCtx.fillStyle = `rgba(10, 12, 16, ${maxDim})`;
      }
      maskCtx.fillRect(0, 0, maskW, maskH);

      // Cutout spotlight
      maskCtx.save();
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.filter = `blur(${feather}px)`;
      maskCtx.fillStyle = '#000000';
      const pad = isWhiteout ? 6 : 4;
      const lx = maskW * r.x;
      const ly = maskH * r.y;
      const lw = Math.max(10, maskW * r.w);
      const lh = Math.max(10, maskH * r.h);
      maskCtx.fillRect(lx - pad, ly - pad, lw + pad * 2, lh + pad * 2);
      maskCtx.restore();

      ctx.drawImage(maskCanvas, dx, dy, finalW, finalH);

      const screenFx = pScale > 1.001 ? punch.originX + (fx - punch.originX) * pScale : fx;
      const screenFy = pScale > 1.001 ? punch.originY + (fy - punch.originY) * pScale : fy;
      const screenFw = fw * pScale;
      const screenFh = fh * pScale;

      spot._screenBounds = {
        x: screenFx,
        y: screenFy,
        w: screenFw,
        h: screenFh,
        dx, dy, finalW, finalH,
        punchScale: pScale,
        spotIndex: sIdx
      };

      if (sIdx === 0) {
        targetClip._docFocusBounds = spot._screenBounds;
      }

      // Editor-only visual indicators (STRICTLY HIDDEN during video playback and export)
      if (!isExporting && !isPlaying) {
        ctx.save();
        ctx.globalAlpha = Math.max(0.0, Math.min(1.0, ease));
        const borderColor = isWhiteout ? '#38bdf8' : '#a855f7';
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(fx, fy, fw, fh);

        // Apple-style minimalist corner brackets
        const cLen = Math.min(14, Math.min(fw, fh) * 0.3);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(fx, fy + cLen); ctx.lineTo(fx, fy); ctx.lineTo(fx + cLen, fy);
        ctx.moveTo(fx + fw - cLen, fy); ctx.lineTo(fx + fw, fy); ctx.lineTo(fx + fw, fy + cLen);
        ctx.moveTo(fx, fy + fh - cLen); ctx.lineTo(fx, fy + fh); ctx.lineTo(fx + cLen, fy + fh);
        ctx.moveTo(fx + fw - cLen, fy + fh); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx + fw, fy + fh - cLen);
        ctx.stroke();

        // Minimalist badge with sequence number (1, 2, 3...)
        const spotNumber = sIdx + 1;
        const tagText = `${spotNumber} Spotlight`;
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const tagW = ctx.measureText(tagText).width;
        const pillW = tagW + 16;
        const pillH = 20;
        const pillX = fx + 6;
        const pillY = Math.max(dy + 4, fy - 24);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        else ctx.rect(pillX, pillY, pillW, pillH);
        ctx.fill();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagText, pillX + 8, pillY + pillH / 2);
        ctx.restore();
      }
    }
  });

  // 2. Animated Highlighter Bars
  if (targetClip.highlights && targetClip.highlights.length > 0) {
    const hlW = Math.max(64, Math.round(finalW));
    const hlH = Math.max(64, Math.round(finalH));
    const hlCanvas = getDocHlCanvas(hlW, hlH);
    const hlCtx = hlCanvas.getContext('2d');
    hlCtx.clearRect(0, 0, hlW, hlH);

    let hasActiveHl = false;

    targetClip.highlights.forEach((hl, idx) => {
      const defaultSweepSpeed = targetClip.docSweepSpeed || 0.6;
      const hlStart = hl.startTime !== undefined ? hl.startTime : (0.4 + 0.3 + idx * (defaultSweepSpeed * 0.8));
      const hlDur = hl.duration || defaultSweepSpeed;
      const hlElapsed = docElapsed - hlStart;
      if (hlElapsed <= 0) return;

      const progress = Math.min(1.0, Math.max(0.0, hlElapsed / hlDur));
      const wipeEase = progress < 1 ? 1 - Math.pow(1 - progress, 2.2) : 1;

      const lx = hlW * hl.x;
      const ly = hlH * hl.y;
      const lw = Math.max(4, hlW * hl.w);
      const lh = Math.max(4, hlH * hl.h);

      let hlColor = hl.color || '#ffff00';
      if (hlColor.toLowerCase() === '#facc15' || hlColor.toLowerCase() === '#ffe600') hlColor = '#ffff00';

      hlCtx.save();
      hlCtx.globalCompositeOperation = 'source-over';
      hlCtx.fillStyle = hlColor;

      const curW = lw * wipeEase;
      const corner = Math.min(4, lh / 3.5);
      hlCtx.beginPath();
      if (hlCtx.roundRect) {
        hlCtx.roundRect(lx, ly, curW, lh, corner);
      } else {
        hlCtx.rect(lx, ly, curW, lh);
      }
      hlCtx.fill();
      hlCtx.restore();

      // Screen bounds for highlight interaction under punch zoom
      const hScreenX = pScale > 1.001 ? punch.originX + ((dx + finalW * hl.x) - punch.originX) * pScale : (dx + finalW * hl.x);
      const hScreenY = pScale > 1.001 ? punch.originY + ((dy + finalH * hl.y) - punch.originY) * pScale : (dy + finalH * hl.y);
      const hScreenW = lw * (finalW / Math.max(1, hlW)) * pScale;
      const hScreenH = lh * (finalH / Math.max(1, hlH)) * pScale;
      hl._screenBounds = { x: hScreenX, y: hScreenY, w: hScreenW, h: hScreenH, punchScale: pScale, index: idx };

      hasActiveHl = true;
    });

    if (hasActiveHl) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.45;
      ctx.drawImage(hlCanvas, dx, dy, finalW, finalH);
      ctx.restore();
    }

    // Editor-only visual indicators for Highlights (STRICTLY HIDDEN during video playback and export)
    if (!isExporting && !isPlaying && targetClip.highlights && targetClip.highlights.length > 0) {
      targetClip.highlights.forEach((hl, idx) => {
        const isSel = (window._selectedHighlightIndex === idx);
        const isHov = (window._hoveredHighlightIndex === idx);
        const shouldShow = isSel || isHov || (!targetClip.docFocus && window._selectedHighlightIndex === undefined);
        if (!shouldShow) return;

        const hx = dx + finalW * hl.x;
        const hy = dy + finalH * hl.y;
        const hw = Math.max(4, finalW * hl.w);
        const hh = Math.max(4, finalH * hl.h);

        ctx.save();
        ctx.strokeStyle = isSel ? '#00f0ff' : 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = isSel ? 1.8 : 1.0;
        if (!isSel) ctx.setLineDash([4, 3]);
        ctx.strokeRect(hx, hy, hw, hh);
        ctx.setLineDash([]);

        // Interactive handles
        const hSz = isSel ? 5 : 4;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.2;
        [[hx, hy], [hx + hw, hy], [hx, hy + hh], [hx + hw, hy + hh], [hx + hw, hy + hh / 2], [hx, hy + hh / 2]].forEach(([cx, cy]) => {
          ctx.fillRect(cx - hSz / 2, cy - hSz / 2, hSz, hSz);
          ctx.strokeRect(cx - hSz / 2, cy - hSz / 2, hSz, hSz);
        });

        // Apple-style clean numbered badge
        const hlNumber = (spotlights.length) + idx + 1;
        const tag = `${hlNumber} Highlight`;
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const tw = ctx.measureText(tag).width;
        const pillW = tw + 14;
        const pillH = 18;
        const pillX = hx + 4;
        const pillY = Math.max(dy + 4, hy - 20);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, 5);
        else ctx.rect(pillX, pillY, pillW, pillH);
        ctx.fill();

        ctx.strokeStyle = isSel ? '#00f0ff' : 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(tag, pillX + 7, pillY + pillH / 2);
        ctx.restore();
      });
    }

    // Pen tip glow while drawing
    targetClip.highlights.forEach((hl, idx) => {
      const defaultSweepSpeed = targetClip.docSweepSpeed || 0.6;
      const hlStart = hl.startTime !== undefined ? hl.startTime : (0.4 + 0.3 + idx * (defaultSweepSpeed * 0.8));
      const hlDur = hl.duration || defaultSweepSpeed;
      const hlElapsed = docElapsed - hlStart;
      if (hlElapsed <= 0) return;

      const progress = Math.min(1.0, Math.max(0.0, hlElapsed / hlDur));
      if (progress > 0 && progress < 1.0) {
        const wipeEase = 1 - Math.pow(1 - progress, 2.2);
        const hx = dx + finalW * hl.x;
        const hy = dy + finalH * hl.y;
        const hw = Math.max(4, finalW * hl.w);
        const hh = Math.max(4, finalH * hl.h);
        const curW = hw * wipeEase;

        let hlColor = hl.color || '#ffff00';
        if (hlColor.toLowerCase() === '#facc15' || hlColor.toLowerCase() === '#ffe600') hlColor = '#ffff00';

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = hlColor;
        ctx.shadowColor = hlColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(hx + curW - 2, hy, 3, hh);
        ctx.restore();
      }
    });
  }
}

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
      const slipOff = targetClip?.mediaOffset || 0;
      const clipTime = Math.max(0, (currentTime - startT + slipOff) % (el.duration || 10));
      if (Math.abs(el.currentTime - clipTime) > 0.25) {
        el.currentTime = Math.max(0, clipTime);
      }
    } else {
      if (!el.paused) el.pause();
      if (targetClip) {
        const slipOff = targetClip?.mediaOffset || 0;
        const clipTime = Math.max(0, (currentTime - targetClip.start + slipOff) % (el.duration || 10));
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

  // Calculate base center coordinates plus custom transform offsets (evaluated dynamically via Keyframing Engine)
  const clipElapsed = targetClip ? Math.max(0, currentTime - targetClip.start) : 0;
  const kfScale = getClipInterpolatedProp(targetClip, 'scale', clipElapsed, (targetClip && targetClip.scale !== undefined) ? targetClip.scale : 1.0);
  const kfRot = getClipInterpolatedProp(targetClip, 'rotation', clipElapsed, (targetClip && targetClip.rotation !== undefined) ? targetClip.rotation : 0);
  const kfPosX = getClipInterpolatedProp(targetClip, 'x', clipElapsed, (targetClip && targetClip.x !== undefined) ? targetClip.x : 0);
  const kfPosY = getClipInterpolatedProp(targetClip, 'y', clipElapsed, (targetClip && targetClip.y !== undefined) ? targetClip.y : 0);
  const kfOpacity = getClipInterpolatedProp(targetClip, 'opacity', clipElapsed, (targetClip && targetClip.opacity !== undefined) ? targetClip.opacity : 1.0);

  const finalW = dw * kfScale;
  const finalH = dh * kfScale;
  const scrollOffset = getClipDocumentScrollOffset(targetClip, currentTime, finalW, finalH);
  const crowdTransform = getClipMotionBlurCrowdTransform(targetClip, currentTime, finalW, finalH);
  const crowdPanX = crowdTransform ? crowdTransform.panX : 0;
  const crowdPanY = crowdTransform ? crowdTransform.panY : 0;
  const offsetX = kfPosX + scrollOffset.x + crowdPanX;
  const offsetY = kfPosY + scrollOffset.y + crowdPanY;
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
  if (targetClip) {
    ctx.globalCompositeOperation = getCanvasBlendMode(targetClip.blendMode || 'source-over');
    ctx.filter = buildClipColorFilter(targetClip);
    ctx.globalAlpha = Math.max(0, Math.min(1, kfOpacity));
  }
  if (kfRot !== 0) {
    const cx = dx + finalW / 2;
    const cy = dy + finalH / 2;
    ctx.translate(cx, cy);
    ctx.rotate((kfRot * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }
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
        const zoomDur = targetClip.zoomDuration || 0.42;
        const t = (zoomElapsed - zoomInAt) / Math.max(0.05, zoomDur);
        const ease = computeEasingValue(t, targetClip.zoomEasing || 'easeOutCubic');
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

      // Render Document Focus & Animated Highlights inside the camera punch-zoom space!
      if (targetClip && (targetClip.docFocus || (targetClip.highlights && targetClip.highlights.length > 0))) {
        renderDocFocusAndHighlights(ctx, targetClip, currentTime, dx, dy, finalW, finalH);
      }

      ctx.restore();
    } else {
      ctx.save();
      if (crowdTransform && crowdTransform.zoomScale) {
        const cx = dx + finalW / 2;
        const cy = dy + finalH / 2;
        ctx.translate(cx, cy);
        ctx.scale(crowdTransform.zoomScale, crowdTransform.zoomScale);
        ctx.translate(-cx, -cy);
      }

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

      // Render Document Focus & Animated Highlights on normal (unpunched) image
      if (targetClip && (targetClip.docFocus || (targetClip.highlights && targetClip.highlights.length > 0))) {
        renderDocFocusAndHighlights(ctx, targetClip, currentTime, dx, dy, finalW, finalH);
      }

      ctx.restore();
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
    // Hide giant full-image dashed transform border when document focus is active to keep text clean
    if (!targetClip.docFocus && (!targetClip.zoomEffect || activeTool === 'snap-zoom' || activeTool === 'loupe')) {
      drawTransformHandles(dx, dy, finalW, finalH);
    }

    // Only draw target crosshair indicator if actively placing zoom with snap-zoom or loupe tools
    if (targetClip.zoomEffect && targetClip.zoomOriginX !== undefined && (activeTool === 'snap-zoom' || activeTool === 'loupe')) {
      drawZoomTargetIndicator(dx, dy, finalW, finalH, targetClip);
    }
  }

  // Draw Motion Blur Crowds Numbered Encircled Waypoints & Journey Path
  if (!isExporting && targetClip && targetClip.motionBlurCrowd && !crowdOverlaysHidden) {
    drawCrowdWaypointsOverlay(ctx, dx, dy, finalW, finalH, targetClip);
  }
}

// Global flag for 1-tap hide/show of crowd waypoints and toolbar
let crowdOverlaysHidden = false;
let crowdLassoPoints = [];
let isCrowdLassoDrawing = false;

function drawCrowdWaypointsOverlay(ctx, dx, dy, w, h, clip) {
  const waypoints = clip.crowdWaypoints || [];
  if (waypoints.length === 0 && (!isCrowdLassoDrawing || crowdLassoPoints.length === 0)) return;

  ctx.save();

  // 1. Draw connecting motion flight path between waypoints
  if (waypoints.length >= 2) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    waypoints.forEach((wp, idx) => {
      const cx = dx + wp.x * w;
      const cy = dy + wp.y * h;
      if (idx === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 2. Draw each circled person / zone with number badge (1, 2, 3...)
  waypoints.forEach((wp, idx) => {
    const cx = dx + wp.x * w;
    const cy = dy + wp.y * h;
    const rx = Math.max(30, (wp.radiusX || 0.08) * w);
    const ry = Math.max(36, (wp.radiusY || 0.12) * h);

    // Neon glow loop encircle
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';

    // If custom freehand loop points exist, draw exact lasso contour
    if (wp.contour && wp.contour.length >= 3) {
      ctx.beginPath();
      wp.contour.forEach((pt, pIdx) => {
        const px = dx + pt.x * w;
        const py = dy + pt.y * h;
        if (pIdx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Elliptical encircle around person
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // 3. Number Badge (1, 2, 3...)
    const badgeR = 18;
    const badgeX = cx - rx * 0.7;
    const badgeY = cy - ry * 0.85;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#0a0d14';
    ctx.font = '900 18px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${idx + 1}`, badgeX, badgeY + 1);

    // Sub-label for surface area
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px "Inter", sans-serif';
    ctx.fillText(`Target ${idx + 1}`, cx, cy + ry + 16);
    ctx.restore();
  });

  // 4. Live drawing in-progress lasso
  if (isCrowdLassoDrawing && crowdLassoPoints.length >= 2) {
    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    crowdLassoPoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// Draw visual crosshair anchor point for punch/loupe zoom target
function drawZoomTargetIndicator(dx, dy, w, h, clip) {
  if (isExporting) return;
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
  const isDocFocus = activeTool === 'doc-focus';
  const isDocHl = activeTool === 'doc-highlight';

  let color = '#00f0ff';
  let bgColor = 'rgba(0, 240, 255, 0.18)';
  let toolLabel = 'Loupe Area';

  if (isSnap) {
    color = '#ff334b';
    bgColor = 'rgba(255, 51, 75, 0.18)';
    toolLabel = 'Punch Zoom Area';
  } else if (isDocFocus) {
    const isDark = (window._activeDocStyle === 'dark');
    color = isDark ? '#a855f7' : '#38bdf8';
    bgColor = isDark ? 'rgba(168, 85, 247, 0.22)' : 'rgba(56, 189, 248, 0.22)';
    toolLabel = isDark ? 'Dark Spotlight (Dim rest)' : 'Whiteout Focus (Fade to white)';
  } else if (isDocHl) {
    const hlColor = document.getElementById('inspector-doc-hl-color')?.value || '#38bdf8';
    color = hlColor;
    bgColor = hlColor + '44';
    toolLabel = 'Animated Highlight Sweep';
  }

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
  const text = `${Math.round(w)} x ${Math.round(h)} px  (${toolLabel})`;
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
  if (isExporting) return;
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

  // 2b. Active Statement / Quote Card Clips
  (timelineClips.quote || []).forEach(c => {
    if (currentTime >= c.start && currentTime <= (c.start + c.duration)) {
      activeItems.push({ type: 'quote', clip: c, zIndex: c.zIndex !== undefined ? c.zIndex : 28 });
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
    } else if (item.type === 'quote') {
      drawQuoteCardLayer(item.clip);
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
      if (audioPlayer.src) audioPlayer.pause();
      if (!bgmPlayer.paused) bgmPlayer.pause();
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
      // Trigger Clip Transition Sound Effect precisely when entering transition boundary
      if (m.transition && m.transition !== 'none' && m.transitionSfx && m.transitionSfx !== 'none') {
        const tStart = m.start;
        if (currentTime >= tStart && currentTime <= (tStart + 0.35)) {
          const sfxKey = `${m.id}-transition`;
          if (!triggeredSFX.has(sfxKey)) {
            if (typeof playTransitionSfx === 'function') {
              playTransitionSfx(m.transitionSfx);
            }
            triggeredSFX.add(sfxKey);
          }
        }
      }
    });
  }

  try {
    // Clear & Stage Background Layer (evaluate background track clips at currentTime if present)
    const activeBgClip = (timelineClips.background || []).find(c => currentTime >= c.start && currentTime < (c.start + c.duration));
    const bgType = activeBgClip ? (activeBgClip.bgType || 'cyber_grid') : (fxState.stageBackground?.type || 'cyber_grid');
    const bgColor = activeBgClip ? (activeBgClip.bgColor || '#0a0b0e') : (fxState.stageBackground?.color || '#0a0b0e');

    if (bgType === 'none') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'solid_black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'color') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'vox_cream') {
      ctx.fillStyle = '#f4eedb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'chroma_green') {
      ctx.fillStyle = '#00e676';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Default cyber grid / dark studio
      ctx.fillStyle = bgColor || '#0a0b0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 1. 3D Background Grid (when enabled and preset is cyber_grid)
    if (bgType === 'cyber_grid' && fxState.grid.enabled !== false) {
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

    // 7. Transition Effect Overlay
    if (typeof applyTransitionEffect === 'function') {
      const allClips = [...(timelineClips.image || []), ...(timelineClips.video || [])].sort((a,b) => a.start - b.start);
      for (const clip of allClips) {
        if (!clip.transition || clip.transition === 'none') continue;
        const tDur = clip.transitionDuration || 0.5;
        const tStart = clip.start;
        const tEnd = tStart + tDur;
        if (currentTime >= tStart && currentTime <= tEnd) {
          const progress = (currentTime - tStart) / tDur;
          applyTransitionEffect(ctx, canvas.width, canvas.height, clip.transition, progress, clip);
          break;
        }
      }
    }

    updateUI();
    // Keep the on-canvas quote editor positioned/visible every frame (also when paused)
    if (typeof syncQuoteCardCanvasOverlay === 'function') syncQuoteCardCanvasOverlay();
  } catch (err) {
    console.error('[Magnates Render Error]', err);
  }

  requestAnimationFrame(render);
}


function syncAudioPlayback() {
  // Voiceover track sync
  const activeVoice = timelineClips.voiceover.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeVoice) {
    if (audioPlayer.dataset.currentUrl !== activeVoice.file.url) {
      audioPlayer.dataset.currentUrl = activeVoice.file.url;
      audioPlayer.src = activeVoice.file.url;
    }
    const clipOffset = activeVoice.audioOffset || 0;
    const offset = (currentTime - activeVoice.start) + clipOffset;
    if (audioPlayer.paused) audioPlayer.play().catch(() => {});
    if (Math.abs(audioPlayer.currentTime - offset) > 0.25) {
      audioPlayer.currentTime = offset;
    }
    audioPlayer.volume = (activeVoice.volume !== undefined ? activeVoice.volume : 100) / 100;
  } else {
    if (audioPlayer.src && !audioPlayer.paused) {
      audioPlayer.pause();
    }
  }

  // Background music track sync
  const activeMusic = timelineClips.music.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeMusic) {
    if (bgmPlayer.dataset.currentUrl !== activeMusic.file.url) {
      bgmPlayer.dataset.currentUrl = activeMusic.file.url;
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

  // Sync on-canvas interactive quote overlay if quote card is active
  if (typeof syncQuoteCardCanvasOverlay === 'function') {
    syncQuoteCardCanvasOverlay();
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
  playhead.style.left = `${currentTime * pps}px`;

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
          if (audioPlayer.dataset.currentUrl === file.url && !audioPlayer.paused) {
            audioPlayer.pause();
          } else {
            audioPlayer.dataset.currentUrl = file.url;
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
const chartFilmstripCache = new Map();

function generateChartFilmstrip(clip, containerEl) {
  const cacheKey = `${clip.id}_${clip.duration}_${JSON.stringify(clip.chartConfig)}`;
  if (chartFilmstripCache.has(cacheKey)) {
    renderFramesToContainer(chartFilmstripCache.get(cacheKey), containerEl);
    return;
  }

  const numFrames = 18;
  const frames = [];
  const offCanvas = document.createElement('canvas');
  offCanvas.width = 160;
  offCanvas.height = 90;
  const offCtx = offCanvas.getContext('2d');

  const totalDur = clip.duration || 6;
  const animDur = clip.chartConfig?.drawDuration || 1.8;

  // Render authentic chronological animation frames for the chart filmstrip
  for (let i = 0; i < numFrames; i++) {
    const frameT = (i / (numFrames - 1 || 1)) * totalDur;
    offCtx.clearRect(0, 0, 160, 90);

    // Save current time and mock currentTime for preview extraction
    const originalTime = currentTime;
    currentTime = clip.start + frameT;

    // Draw authentic infographic chart onto frame thumbnail
    drawInfographicChart(offCtx, clip, 0, 0, 160, 90);

    currentTime = originalTime;
    frames.push(offCanvas.toDataURL('image/jpeg', 0.8));
  }

  chartFilmstripCache.set(cacheKey, frames);
  renderFramesToContainer(frames, containerEl);
}

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
    const numFrames = 24;
    const frames = [];

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 160;
    offscreenCanvas.height = 90;
    const octx = offscreenCanvas.getContext('2d');

    for (let i = 0; i < numFrames; i++) {
      const seekTime = Math.min(totalDuration - 0.05, (i / (numFrames - 1 || 1)) * totalDuration);
      v.currentTime = seekTime;
      await new Promise(res => {
        const onSeeked = () => {
          v.removeEventListener('seeked', onSeeked);
          octx.drawImage(v, 0, 0, 160, 90);
          frames.push(offscreenCanvas.toDataURL('image/jpeg', 0.6));
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
  // Repeat frames proportionally to clip length to create continuous filmstrip
  const clipWidth = containerEl.parentElement?.offsetWidth || (frames.length * 60);
  const frameWidthPx = 60;
  const totalFramesNeeded = Math.max(frames.length, Math.ceil(clipWidth / frameWidthPx));
  for (let i = 0; i < totalFramesNeeded; i++) {
    const frameIndex = i % frames.length;
    const img = document.createElement('img');
    img.src = frames[frameIndex];
    img.className = 'filmstrip-frame';
    img.draggable = false;
    containerEl.appendChild(img);
  }
}

// Audio Waveform Generator and Cache
const audioBufferCache = new Map();
const waveformPointsCache = new Map();

async function getAudioBufferForUrl(url) {
  if (audioBufferCache.has(url)) {
    return audioBufferCache.get(url);
  }
  try {
    const res = await fetch(url);
    const arrayBuf = await res.arrayBuffer();
    const ctx = getAudioContext() || new (window.AudioContext || window.webkitAudioContext)();
    const audioBuf = await ctx.decodeAudioData(arrayBuf);
    audioBufferCache.set(url, audioBuf);
    return audioBuf;
  } catch (err) {
    console.warn('[Magnates Audio] Could not decode audio buffer:', err);
    return null;
  }
}

async function renderAudioClipWaveform(clip, canvasEl) {
  if (!canvasEl || !clip || !clip.file?.url) return;
  const audioBuf = await getAudioBufferForUrl(clip.file.url);
  if (!audioBuf) return;

  const w = canvasEl.offsetWidth || 150;
  const h = canvasEl.offsetHeight || 38;
  canvasEl.width = w * window.devicePixelRatio;
  canvasEl.height = h * window.devicePixelRatio;

  const ctx = canvasEl.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.clearRect(0, 0, w, h);

  const rawData = audioBuf.getChannelData(0);
  const totalDuration = audioBuf.duration || clip.duration;
  const offset = clip.audioOffset || 0;
  const startSample = Math.floor((offset / totalDuration) * rawData.length);
  const endSample = Math.min(rawData.length, Math.floor(((offset + clip.duration) / totalDuration) * rawData.length));
  const clipSamples = endSample - startSample;
  if (clipSamples <= 0) return;

  const bars = Math.max(10, Math.floor(w / 3));
  const step = Math.floor(clipSamples / bars);

  ctx.fillStyle = clip.track === 'voiceover' ? 'rgba(42, 222, 137, 0.7)' : 'rgba(255, 208, 0, 0.7)';
  const centerY = h / 2;

  for (let i = 0; i < bars; i++) {
    const s = startSample + (i * step);
    let max = 0;
    for (let j = 0; j < step && (s + j) < endSample; j += Math.max(1, Math.floor(step / 10))) {
      const val = Math.abs(rawData[s + j]);
      if (val > max) max = val;
    }
    const barHeight = Math.max(2, max * (h - 6));
    const x = (i / bars) * w;
    ctx.fillRect(x, centerY - barHeight / 2, 2, barHeight);
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

// Effect Selection & Inspector Synchronization
function selectEffect(clip, trackType, effectType, effectIndex = 0) {
  selectedEffectId = { clipId: clip.id, trackType, effectType, effectIndex };
  selectedClip = { clip, trackType };

  // Make sure inspector sidebar is opened
  if (typeof isRightSidebarOpen !== 'undefined' && !isRightSidebarOpen) {
    toggleRightSidebar(true);
  }

  // Deselect generic clip blocks
  document.querySelectorAll('.clip-block').forEach(b => b.classList.remove('is-selected'));
  const clipEl = document.getElementById(clip.id);
  if (clipEl) clipEl.classList.add('is-selected');

  // Highlight active effect bar
  document.querySelectorAll('.clip-fx-bar').forEach(b => b.classList.remove('is-selected-fx'));
  const activeFxBar = clipEl?.querySelector(`.clip-fx-bar[data-fx-type="${effectType}"][data-fx-index="${effectIndex}"]`) ||
                      clipEl?.querySelector(`.clip-fx-bar.${effectType}`);
  if (activeFxBar) activeFxBar.classList.add('is-selected-fx');

  // Hide generic clip inspector & text editor; show effect inspector
  const clipInspector = document.getElementById('card-clip-inspector');
  const textEditor = document.getElementById('card-text-editor');
  const chartInspector = document.getElementById('card-chart-inspector');
  const fxInspector = document.getElementById('card-effect-inspector');

  if (clipInspector) clipInspector.style.display = 'none';
  if (textEditor) textEditor.style.display = 'none';
  if (chartInspector) chartInspector.style.display = 'none';

  if (fxInspector) {
    fxInspector.style.display = 'block';
    fxInspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  syncEffectInspectorControls();
}

function applyEffectTimingChange(clip, fxType, fxIndex, newOffset, newDur) {
  const safeOffset = Math.max(0, Math.min(clip.duration - 0.2, newOffset));
  const safeDur = Math.max(0.1, Math.min(clip.duration - safeOffset, newDur));

  if (fxType === 'zoom') {
    clip.zoomStartTime = safeOffset;
    clip.zoomDuration = safeDur;
  } else if (fxType === 'docFocus') {
    clip.docFocusStartTime = safeOffset;
    clip.docFocusDuration = safeDur;
    if (Array.isArray(clip.spotlights) && clip.spotlights.length > 0) {
      const sp = clip.spotlights[fxIndex] || clip.spotlights[0];
      if (sp) {
        sp.startTime = safeOffset;
        sp.duration = safeDur;
      }
    }
  } else if (fxType === 'highlight') {
    if (clip.highlights && clip.highlights.length > 0) {
      const hl = clip.highlights[fxIndex] || clip.highlights[0];
      if (hl) {
        hl.startTime = safeOffset;
        hl.duration = safeDur;
      }
    }
  } else if (fxType === 'scroll') {
    clip.docScrollLinger = safeOffset;
    clip.docScrollSpeed = safeDur;
  }
}

function syncEffectInspectorControls() {
  if (!selectedEffectId || !selectedClip || !selectedClip.clip) return;
  const clip = selectedClip.clip;
  const { effectType, effectIndex } = selectedEffectId;

  // Parent clip indicator
  const parentNameEl = document.getElementById('effect-parent-clip-name');
  if (parentNameEl) {
    parentNameEl.textContent = clip.name || clip.file?.name || 'Clip';
  }

  // Badge label
  const badgeEl = document.getElementById('effect-inspector-badge');
  const zoomControls = document.getElementById('effect-zoom-specific-controls');

  let currentOffset = 0;
  let currentDuration = 1.0;
  let labelText = 'Effect';

  if (effectType === 'zoom') {
    currentOffset = clip.zoomStartTime !== undefined ? clip.zoomStartTime : 0.5;
    currentDuration = clip.zoomDuration || Math.max(0.4, clip.duration - currentOffset);
    labelText = clip.zoomEffect === 'snap' ? 'Punch Zoom' : 'Loupe Callout';
    if (zoomControls) zoomControls.style.display = 'block';

    const scaleSlider = document.getElementById('effect-zoom-scale-slider');
    const scaleVal = document.getElementById('effect-zoom-scale-val');
    const curScale = clip.zoomScale || 2.2;
    if (scaleSlider) scaleSlider.value = Math.round(curScale * 10);
    if (scaleVal) scaleVal.textContent = `${curScale.toFixed(1)}x`;
  } else {
    if (zoomControls) zoomControls.style.display = 'none';

    if (effectType === 'docFocus') {
      currentOffset = clip.docFocusStartTime !== undefined ? clip.docFocusStartTime : 0.4;
      currentDuration = (clip.docFocusDuration && clip.docFocusDuration > 0) ? clip.docFocusDuration : Math.max(0.2, clip.duration - currentOffset);
      labelText = clip.docStyle !== 'dark' ? 'Whiteout Focus' : 'Spotlight Focus';
    } else if (effectType === 'highlight') {
      const hl = (clip.highlights && clip.highlights[effectIndex]) ? clip.highlights[effectIndex] : (clip.highlights?.[0]);
      currentOffset = hl?.startTime !== undefined ? hl.startTime : 0.7;
      currentDuration = hl?.duration || 0.6;
      labelText = `Highlight #${effectIndex + 1}`;
    } else if (effectType === 'scroll') {
      currentOffset = clip.docScrollLinger !== undefined ? clip.docScrollLinger : 1.0;
      currentDuration = clip.docScrollSpeed !== undefined ? clip.docScrollSpeed : 3.0;
      labelText = 'Camera Scroll';
    } else if (effectType === 'motionBlur') {
      currentOffset = 0;
      currentDuration = clip.duration;
      labelText = 'Motion Blur';
    }
  }

  if (badgeEl) badgeEl.textContent = labelText;

  // Sliders and Stepper Values
  const startSlider = document.getElementById('effect-start-slider');
  const startVal = document.getElementById('effect-start-val');
  if (startSlider) {
    startSlider.max = Math.max(10, Math.round(clip.duration * 10));
    startSlider.value = Math.round(currentOffset * 10);
  }
  if (startVal) startVal.textContent = `${currentOffset.toFixed(2)}s`;

  const durSlider = document.getElementById('effect-dur-slider');
  const durVal = document.getElementById('effect-dur-val');
  if (durSlider) {
    durSlider.max = Math.max(10, Math.round(clip.duration * 10));
    durSlider.value = Math.round(currentDuration * 10);
  }
  if (durVal) durVal.textContent = `${currentDuration.toFixed(2)}s`;

  // Easing curve selector
  const easingSelect = document.getElementById('effect-easing-select');
  if (easingSelect) {
    easingSelect.value = clip.zoomEasing || 'easeOutCubic';
  }
}

// Render all clips onto timeline DOM
function renderAllTimelineTracks() {
  const trackMap = {
    text: document.getElementById('content-text'),
    chart: document.getElementById('content-chart'),
    image: document.getElementById('content-image'),
    video: document.getElementById('content-video'),
    voiceover: document.getElementById('content-audio'),
    music: document.getElementById('content-music'),
    background: document.getElementById('content-background')
  };

  // Synchronize timeline body mode class and label text
  const timelineBodyEl = document.getElementById('timeline-body');
  if (timelineBodyEl) {
    timelineBodyEl.classList.toggle('consolidated-storyline-mode', timelineViewMode === 'consolidated');
  }
  const mainTrackLabelText = document.querySelector('.timeline-label-col .track-label[data-track-type="image"] .track-title-wrap');
  if (mainTrackLabelText) {
    if (timelineViewMode === 'consolidated') {
      mainTrackLabelText.innerHTML = `
        <svg class="ui-icon" viewBox="0 0 24 24" style="color: #00f0ff;"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z"/></svg>
        <span>Storyline</span>
      `;
    } else {
      mainTrackLabelText.innerHTML = `
        <svg class="ui-icon" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        <span>Images</span>
      `;
    }
  }

  Object.keys(trackMap).forEach(type => {
    const container = trackMap[type];
    if (!container) return;
    container.innerHTML = '';

    // In consolidated mode, visual clips (charts, quotes, images, videos) are unified on the primary storyline track ('image')
    let clips = [];
    if (timelineViewMode === 'consolidated') {
      if (type === 'image') {
        clips = [
          ...(timelineClips.image || []),
          ...(timelineClips.video || []),
          ...(timelineClips.chart || []),
          ...(timelineClips.quote || [])
        ];
      } else if (type === 'chart' || type === 'video') {
        clips = []; // Hidden; unified on primary storyline track above
      } else {
        clips = timelineClips[type] || [];
      }
    } else {
      clips = (type === 'chart' ? [...(timelineClips.chart || []), ...(timelineClips.quote || [])] : (timelineClips[type] || []));
    }
    clips.forEach(clip => {
      const actualTrackType = clip.isQuoteCard ? 'quote' : (clip.chartConfig ? 'chart' : (clip.file?.isVideo ? 'video' : type));
      const block = document.createElement('div');
      block.className = `clip-block ${actualTrackType}`;
      block.id = clip.id;
      if (selectedClip && selectedClip.clip.id === clip.id) block.classList.add('is-selected');

      const leftPx = clip.start * pps;
      const widthPx = clip.duration * pps;
      block.style.left = `${leftPx}px`;
      block.style.width = `${widthPx}px`;

      let iconSvg = '';
      if (clip.isQuoteCard || type === 'quote') {
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24" style="color: #ff334b;"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`;
      } else if (clip.chartConfig) {
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
      } else if (type === 'background') {
        const bgLabels = { cyber_grid: 'Cyber Grid', solid_black: 'Solid Black', none: 'Transparent', color: 'Solid Tint', vox_cream: 'Vox Cream' };
        const bgLabel = bgLabels[clip.bgType] || clip.bgType || 'Background';
        iconSvg = `<svg class="clip-icon" viewBox="0 0 24 24" style="color:#7c6fff;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>`;
        // Apply bg-type-specific inline style for the block (set below)
        block.dataset.bgType = clip.bgType || 'cyber_grid';
      }

      const label = type === 'background'
        ? (() => { const m = { cyber_grid: 'Cyber Grid', solid_black: 'Solid Black', none: 'Transparent', color: 'Solid Tint', vox_cream: 'Vox Cream' }; return m[clip.bgType] || clip.bgType || 'Background'; })()
        : (clip.speakerTitle ? `"${clip.quoteText?.slice(0, 18) || 'Quote'}..." - ${clip.speakerTitle}` : (clip.file?.name || clip.text || 'Clip'));

      // Thumbnail, repeating filmstrip and scrim overlay
      if (type === 'image' && clip.file?.url) {
        const filmstripEl = document.createElement('div');
        filmstripEl.className = 'clip-image-filmstrip';
        filmstripEl.style.backgroundImage = `url("${clip.file.url}")`;
        filmstripEl.style.backgroundRepeat = 'repeat-x';
        filmstripEl.style.backgroundSize = 'auto 100%';
        block.appendChild(filmstripEl);

        const scrimEl = document.createElement('div');
        scrimEl.className = 'clip-scrim-overlay';
        block.appendChild(scrimEl);
      } else if (type === 'video' && clip.file?.url) {
        const filmstripEl = document.createElement('div');
        filmstripEl.className = 'clip-filmstrip';
        // Set fallback thumbnail or poster if available
        if (clip.file?.thumbnail || clip.file?.url) {
          filmstripEl.style.backgroundImage = `url("${clip.file.thumbnail || clip.file.url}")`;
          filmstripEl.style.backgroundRepeat = 'repeat-x';
          filmstripEl.style.backgroundSize = 'auto 100%';
        }
        block.appendChild(filmstripEl);
        generateFilmstrip(clip.file.url, clip.duration, filmstripEl);

        const scrimEl = document.createElement('div');
        scrimEl.className = 'clip-scrim-overlay';
        block.appendChild(scrimEl);
      } else if (clip.chartConfig || type === 'chart') {
        // Continuous Frame-by-Frame Filmstrip matching exact on-screen animation & effects
        const filmstripEl = document.createElement('div');
        filmstripEl.className = 'clip-filmstrip';
        block.appendChild(filmstripEl);
        generateChartFilmstrip(clip, filmstripEl);

        const scrimEl = document.createElement('div');
        scrimEl.className = 'clip-scrim-overlay';
        block.appendChild(scrimEl);
      }

      // Thumbnail badge on left edge (only for non-filmstrip visual blocks if any)
      let thumbBadgeHtml = '';

      // Left & Right Resize Handles for the clip
      const handleLeft = document.createElement('div');
      handleLeft.className = 'clip-handle clip-handle-left';

      const handleRight = document.createElement('div');
      handleRight.className = 'clip-handle clip-handle-right';

      // Title row content wrapper (separated from effect subtrack)
      const contentEl = document.createElement('div');
      contentEl.className = 'clip-block-content';

      // For pure visual filmstrip clips (image/video/charts), keep visual strip completely clean with no blocking text
      const isFilmstripClip = (type === 'image' || type === 'video') && clip.file?.url;
      const isChartClip = !!(clip.chartConfig || type === 'chart');

      // Responsive density: if width < 80px, show compact representation
      const isCompact = widthPx < 80;
      if (isFilmstripClip || isChartClip) {
        // Pristine filmstrip: title text is completely removed from on top of the filmstrip frames
        contentEl.innerHTML = '';
      } else if (isCompact) {
        let miniBadges = '';
        if (clip.zoomEffect) miniBadges += '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;vertical-align:-1px;margin-right:2px;"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>';
        if (clip.docFocus) miniBadges += '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:-1px;margin-right:2px;"><circle cx="12" cy="12" r="9"/></svg>';
        if (clip.highlights?.length) miniBadges += '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;vertical-align:-1px;margin-right:2px;"><path d="M16.5 4.5l3 3L7.5 19.5 4 20l.5-3.5L16.5 4.5z"/></svg>';
        if (clip.docScroll) miniBadges += '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;vertical-align:-1px;margin-right:2px;"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
        contentEl.innerHTML = `${iconSvg} <span style="font-size:9px; font-weight:700; display:inline-flex; align-items:center;">${miniBadges || label.slice(0, 5)}</span>`;
      } else {
        contentEl.innerHTML = `${iconSvg} <span style="overflow: hidden; text-overflow: ellipsis; flex: 1;">${label}</span>`;
      }

      // Effect subtrack overlay container (positioned over actual temporal span)
      const fxTracksEl = document.createElement('div');
      fxTracksEl.className = 'clip-fx-tracks';

      // Helper to add interactive effect bar with drag-handles & responsive density
      const addEffectBar = (fxType, fxIndex, fxLabel, fxIcon, startOffset, fxDuration, cssClass) => {
        const bar = document.createElement('div');
        bar.className = `clip-fx-bar ${cssClass}`;
        bar.dataset.fxType = fxType;
        bar.dataset.fxIndex = fxIndex;
        const isFxSelected = selectedEffectId && selectedEffectId.clipId === clip.id && selectedEffectId.effectType === fxType && selectedEffectId.effectIndex === fxIndex;
        if (isFxSelected) bar.classList.add('is-selected-fx');

        const leftPct = Math.min(100, Math.max(0, (startOffset / clip.duration) * 100));
        const widthPct = Math.min(100 - leftPct, Math.max(8, (fxDuration / clip.duration) * 100));
        bar.style.left = `${leftPct}%`;
        bar.style.width = `${widthPct}%`;

        // Responsive density: if clip < 80px or bar width < 38px, collapse label to icon
        const showIconOnly = isCompact || (widthPct / 100 * widthPx) < 45;
        bar.innerHTML = `
          <div class="clip-fx-handle clip-fx-handle-left" title="Drag to adjust effect start"></div>
          <span class="clip-fx-bar-label" style="display:inline-flex; align-items:center; gap:3px;">${fxIcon} <span>${showIconOnly ? '' : fxLabel}</span></span>
          <div class="clip-fx-handle clip-fx-handle-right" title="Drag to adjust effect duration"></div>
        `;

        // Click effect bar -> select effect & open Effect Settings panel
        bar.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEffect(clip, type, fxType, fxIndex);
        });

        // Left Drag Handle (trim effect start offset)
        const leftHandle = bar.querySelector('.clip-fx-handle-left');
        leftHandle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          selectEffect(clip, type, fxType, fxIndex);
          const startX = e.clientX;
          const initialOffset = startOffset;
          const initialDur = fxDuration;

          const onMove = (moveEvt) => {
            const deltaSec = (moveEvt.clientX - startX) / pps;
            let newOffset = Math.max(0, Math.min(clip.duration - 0.2, initialOffset + deltaSec));
            let newDur = Math.max(0.2, initialDur - (newOffset - initialOffset));
            if (newOffset + newDur > clip.duration) newDur = clip.duration - newOffset;

            applyEffectTimingChange(clip, fxType, fxIndex, newOffset, newDur);
            renderAllTimelineTracks();
            syncEffectInspectorControls();
          };

          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            recordState(`Adjust ${fxLabel} Duration`);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        });

        // Right Drag Handle (adjust effect duration)
        const rightHandle = bar.querySelector('.clip-fx-handle-right');
        rightHandle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          selectEffect(clip, type, fxType, fxIndex);
          const startX = e.clientX;
          const initialDur = fxDuration;

          const onMove = (moveEvt) => {
            const deltaSec = (moveEvt.clientX - startX) / pps;
            let newDur = Math.max(0.2, Math.min(clip.duration - startOffset, initialDur + deltaSec));

            applyEffectTimingChange(clip, fxType, fxIndex, startOffset, newDur);
            renderAllTimelineTracks();
            syncEffectInspectorControls();
          };

          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            recordState(`Adjust ${fxLabel} Duration`);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        });

        fxTracksEl.appendChild(bar);
      };

      // 1. Zoom effect sub-bar
      if (clip.zoomEffect) {
        const zmStart = clip.zoomStartTime !== undefined ? clip.zoomStartTime : 0.5;
        const zmDur = clip.zoomDuration || Math.max(0.4, clip.duration - zmStart);
        const zmLabel = clip.zoomEffect === 'snap' ? 'Punch Zoom' : 'Loupe';
        const zmIcon = '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
        addEffectBar('zoom', 0, zmLabel, zmIcon, zmStart, zmDur, 'zoom');
      }

      // 2. Whiteout / Spotlight sub-bar
      if (clip.docFocus) {
        const fIn = clip.docFocusStartTime !== undefined ? clip.docFocusStartTime : 0.4;
        const fDur = (clip.docFocusDuration && clip.docFocusDuration > 0) ? clip.docFocusDuration : Math.max(0.2, clip.duration - fIn);
        const fLabel = clip.docStyle !== 'dark' ? 'Whiteout' : 'Spotlight';
        const fIcon = clip.docStyle !== 'dark'
          ? '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:none;stroke:currentColor;stroke-width:2;"><circle cx="12" cy="12" r="9"/></svg>'
          : '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;"><circle cx="12" cy="12" r="9"/></svg>';
        addEffectBar('docFocus', 0, fLabel, fIcon, fIn, fDur, clip.docStyle !== 'dark' ? 'whiteout' : 'spotlight');
      }

      // 3. Highlight sub-bar
      if (clip.highlights && clip.highlights.length > 0) {
        const hlStart = clip.highlights[0].startTime !== undefined ? clip.highlights[0].startTime : 0.7;
        const hlDur = clip.highlights.reduce((acc, h) => acc + (h.duration || 0.6), 0);
        const hlIcon = '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;"><path d="M16.5 4.5l3 3L7.5 19.5 4 20l.5-3.5L16.5 4.5z"/></svg>';
        addEffectBar('highlight', 0, `${clip.highlights.length} HL`, hlIcon, hlStart, hlDur, 'highlight');
      }

      // 4. Scroll sub-bar
      if (clip.docScroll) {
        const scLinger = clip.docScrollLinger !== undefined ? clip.docScrollLinger : 1.0;
        const scSpeed = clip.docScrollSpeed !== undefined ? clip.docScrollSpeed : 3.0;
        const scIcon = '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
        addEffectBar('scroll', 0, 'Scroll', scIcon, scLinger, scSpeed, 'scroll');
      }

      // 5. Motion blur sub-bar
      if (clip.motionBlurCrowd) {
        const mbIcon = '<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor;"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
        addEffectBar('motionBlur', 0, 'Motion Blur', mbIcon, 0, clip.duration, 'motion-blur');
      }

      // Delete clip button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'clip-hover-delete';
      deleteBtn.title = 'Remove clip';
      deleteBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        recordState('Delete Clip');
        deleteClip(actualTrackType, clip.id);
      });

      // Audio Waveform Background
      if ((type === 'voiceover' || type === 'music') && clip.file?.url) {
        const waveCanvas = document.createElement('canvas');
        waveCanvas.className = 'clip-waveform-canvas';
        block.appendChild(waveCanvas);
        renderAudioClipWaveform(clip, waveCanvas);
      }

      // Hover Scrub Needle & Preview Tooltip for precision cutting (Videos, Images, and Charts)
      const canScrub = ((type === 'video' || type === 'image') && clip.file?.url) || (type === 'chart' || clip.chartConfig);
      if (canScrub) {
        const needle = document.createElement('div');
        needle.className = 'clip-scrub-needle';
        block.appendChild(needle);

        let tooltipEl = document.getElementById('timeline-scrub-tooltip');
        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'timeline-scrub-tooltip';
          tooltipEl.className = 'timeline-scrub-tooltip';
          tooltipEl.innerHTML = `
            <img class="timeline-scrub-tooltip-img" src="" alt="preview" />
            <div class="timeline-scrub-tooltip-time">00:00.00</div>
          `;
          document.body.appendChild(tooltipEl);
        }

        block.addEventListener('mousemove', (e) => {
          if (block.classList.contains('is-dragging')) return;
          const rect = block.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, offsetX / rect.width));
          const hoverTime = clip.start + (ratio * clip.duration);

          needle.style.display = 'block';
          needle.style.left = `${offsetX}px`;

          const tooltipImg = tooltipEl.querySelector('.timeline-scrub-tooltip-img');
          const tooltipTime = tooltipEl.querySelector('.timeline-scrub-tooltip-time');

          if (tooltipImg) {
            if (type === 'chart' || clip.chartConfig) {
              const cacheKey = `${clip.id}_${clip.duration}_${JSON.stringify(clip.chartConfig)}`;
              if (chartFilmstripCache.has(cacheKey)) {
                const frames = chartFilmstripCache.get(cacheKey);
                const frameIdx = Math.min(frames.length - 1, Math.floor(ratio * frames.length));
                tooltipImg.src = frames[frameIdx];
              }
            } else if (type === 'image') {
              tooltipImg.src = clip.file.url;
            } else if (type === 'video' && filmstripCache.has(clip.file.url)) {
              const frames = filmstripCache.get(clip.file.url);
              const frameIdx = Math.min(frames.length - 1, Math.floor(ratio * frames.length));
              tooltipImg.src = frames[frameIdx];
            } else {
              tooltipImg.src = clip.file?.thumbnail || clip.file?.url || '';
            }
          }

          if (tooltipTime) {
            tooltipTime.textContent = formatTimecode(hoverTime);
          }

          tooltipEl.style.left = `${e.clientX}px`;
          tooltipEl.style.top = `${rect.top}px`;
          tooltipEl.classList.add('is-visible');
        });

        block.addEventListener('mouseleave', () => {
          needle.style.display = 'none';
          const t = document.getElementById('timeline-scrub-tooltip');
          if (t) t.classList.remove('is-visible');
        });
      }

      block.appendChild(handleLeft);
      block.appendChild(contentEl);
      if (fxTracksEl.children.length > 0) block.appendChild(fxTracksEl);
      block.appendChild(deleteBtn);
      block.appendChild(handleRight);

      // Add Keyframe Lane & Diamond Markers on Clip Block
      if (clip.keyframes) {
        const kfLane = document.createElement('div');
        kfLane.className = 'clip-kf-lane';
        const allKfTimes = new Set();
        Object.values(clip.keyframes).forEach(arr => {
          if (Array.isArray(arr)) arr.forEach(k => allKfTimes.add(k.time));
        });
        allKfTimes.forEach(t => {
          const marker = document.createElement('div');
          marker.className = 'clip-kf-marker';
          const pct = Math.max(0, Math.min(100, (t / clip.duration) * 100));
          marker.style.left = `${pct}%`;
          marker.title = `Keyframe at +${t.toFixed(2)}s`;
          marker.addEventListener('click', (e) => {
            e.stopPropagation();
            seekToTime(clip.start + t);
          });
          kfLane.appendChild(marker);
        });
        if (allKfTimes.size > 0) block.appendChild(kfLane);
      }

      // Clip Interactions
      attachClipInteractions(block, clip, actualTrackType);

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
  // Inject transition chips between clips
  setTimeout(() => {
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
  }, 0);
}

// Global handler for tapping timeline (+) button
function handleTimelineAddButtonClick(trackType, atTimeSec, triggerEl) {
  if (trackType === 'text') {
    const newClip = createNewTextClipAtTime(atTimeSec);
    seekToTime(atTimeSec);
    showTextTimingAlert(`New kinetic text added at ${formatTimecode(atTimeSec)}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  } else if (trackType === 'chart') {
    openChartCreatorModal(atTimeSec);
  } else if (trackType === 'background') {
    openBackgroundSegmentPicker(atTimeSec, triggerEl);
  } else if (trackType === 'image') {
    // Exact same modal as clicking the image track picker button
    openTrackImagePickerModal(atTimeSec);
  } else {
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

  // Apple Intelligence: If inspector sidebar was collapsed, automatically glide it open to reveal clip settings
  if (typeof isRightSidebarOpen !== 'undefined' && !isRightSidebarOpen) {
    toggleRightSidebar(true);
  }

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

    // Toggle and populate Rolling Counter controls if anim is 'counter'
    const counterBox = document.getElementById('text-counter-controls');
    if (counterBox) {
      counterBox.style.display = clip.anim === 'counter' ? 'block' : 'none';
      const cStart = document.getElementById('text-counter-start');
      const cEnd = document.getElementById('text-counter-end');
      const cDur = document.getElementById('text-counter-dur');
      const cSuffix = document.getElementById('text-counter-suffix');
      if (cStart) cStart.value = clip.counterStart !== undefined ? clip.counterStart : 0;
      if (cEnd) cEnd.value = clip.counterEnd !== undefined ? clip.counterEnd : (parseFloat(String(clip.text || '').replace(/[^0-9.-]/g, '')) || 33);
      if (cDur) cDur.value = clip.counterDuration !== undefined ? clip.counterDuration : 1.5;
      if (cSuffix) cSuffix.value = clip.counterSuffix !== undefined ? clip.counterSuffix : '%';
    }

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
    const quoteInspector = document.getElementById('card-quote-inspector');
    if (quoteInspector) quoteInspector.style.display = 'none';
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) chartInspector.style.display = 'none';
    const effectInspector = document.getElementById('card-effect-inspector');
    if (effectInspector) effectInspector.style.display = 'none';
    inspector.style.display = 'none';

    // Highlight text editor card and scroll it into view
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) {
      textEditorCard.style.display = 'block';
      textEditorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else if (clip.isQuoteCard || trackType === 'quote') {
    // Show quote card inspector card
    const quoteInspector = document.getElementById('card-quote-inspector');
    if (quoteInspector) {
      quoteInspector.style.display = 'block';
      quoteInspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      populateQuoteCardInspector(clip);
    }
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) chartInspector.style.display = 'none';
    const effectInspector = document.getElementById('card-effect-inspector');
    if (effectInspector) effectInspector.style.display = 'none';
    inspector.style.display = 'none';
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) textEditorCard.style.display = 'none';
  } else if (clip.chartConfig) {
    // Show chart inspector card
    const quoteInspector = document.getElementById('card-quote-inspector');
    if (quoteInspector) quoteInspector.style.display = 'none';
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) {
      chartInspector.style.display = 'block';
      chartInspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      populateChartInspector(clip);
    }
    const effectInspector = document.getElementById('card-effect-inspector');
    if (effectInspector) effectInspector.style.display = 'none';
    inspector.style.display = 'none';
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) textEditorCard.style.display = 'none';
  } else {
    // Show standard clip inspector card
    const quoteInspector = document.getElementById('card-quote-inspector');
    if (quoteInspector) quoteInspector.style.display = 'none';
    const chartInspector = document.getElementById('card-chart-inspector');
    if (chartInspector) chartInspector.style.display = 'none';
    const effectInspector = document.getElementById('card-effect-inspector');
    if (effectInspector) effectInspector.style.display = 'none';
    const textEditorCard = document.getElementById('card-text-editor');
    if (textEditorCard) textEditorCard.style.display = 'none';
    inspector.style.display = 'block';
    const typeLabel = clip.drawingStrokes ? 'DRAWING' : (clip.isIconSticker ? 'ICON' : trackType.toUpperCase());
    const clipTitle = clip.name || clip.file?.name || 'Clip';
    document.getElementById('inspector-clip-type').textContent = typeLabel;
    document.getElementById('inspector-clip-name').textContent = clipTitle;
    
    const inspHeadTitle = document.getElementById('inspector-heading-title');
    const inspHeadSub = document.getElementById('inspector-heading-sub');
    if (inspHeadTitle) inspHeadTitle.textContent = typeLabel;
    if (inspHeadSub) inspHeadSub.textContent = clipTitle;
    
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

    // Populate Transform & Temporal Keyframing Section
    const transformSec = document.getElementById('inspector-transform-section');
    if (transformSec) {
      if (['image', 'video', 'chart'].includes(trackType)) {
        transformSec.style.display = 'block';
        const curScale = Math.round((clip.scale !== undefined ? clip.scale : 1.0) * 100);
        const curRot = clip.rotation || 0;
        const curX = clip.x || 0;
        const curY = clip.y || 0;
        const curOp = Math.round((clip.opacity !== undefined ? clip.opacity : 1.0) * 100);

        const scaleSlider = document.getElementById('inspector-scale-slider');
        const scaleVal = document.getElementById('inspector-scale-val');
        if (scaleSlider) scaleSlider.value = curScale;
        if (scaleVal) scaleVal.textContent = `${curScale}%`;

        const rotSlider = document.getElementById('inspector-rotate-slider');
        const rotVal = document.getElementById('inspector-rotate-val');
        if (rotSlider) rotSlider.value = curRot;
        if (rotVal) rotVal.textContent = `${curRot}°`;

        const xSlider = document.getElementById('inspector-posx-slider');
        const xVal = document.getElementById('inspector-posx-val');
        if (xSlider) xSlider.value = curX;
        if (xVal) xVal.textContent = `${curX}`;

        const ySlider = document.getElementById('inspector-posy-slider');
        const yVal = document.getElementById('inspector-posy-val');
        if (ySlider) ySlider.value = curY;
        if (yVal) yVal.textContent = `${curY}`;

        const opSlider = document.getElementById('inspector-opacity-slider');
        const opVal = document.getElementById('inspector-opacity-val');
        if (opSlider) opSlider.value = curOp;
        if (opVal) opVal.textContent = `${curOp}%`;

        const easingSelect = document.getElementById('inspector-kf-easing');
        if (easingSelect) easingSelect.value = clip.kfEasing || 'ease';

        if (typeof updateInspectorKeyframeDiamonds === 'function') {
          updateInspectorKeyframeDiamonds(clip);
        }
      } else {
        transformSec.style.display = 'none';
      }
    }

    // Populate Color Pipeline & Compositing Math Section
    const colorSec = document.getElementById('inspector-color-section');
    if (colorSec) {
      if (['image', 'video', 'chart'].includes(trackType)) {
        colorSec.style.display = 'block';
        const lutSelect = document.getElementById('inspector-lut-select');
        if (lutSelect) lutSelect.value = clip.lut || 'none';

        const blendSelect = document.getElementById('inspector-blend-mode');
        if (blendSelect) blendSelect.value = clip.blendMode || 'normal';

        const liftSlider = document.getElementById('inspector-lift-slider');
        const liftVal = document.getElementById('inspector-lift-val');
        if (liftSlider) liftSlider.value = clip.lift || 0;
        if (liftVal) liftVal.textContent = `${clip.lift || 0}`;

        const gammaSlider = document.getElementById('inspector-gamma-slider');
        const gammaVal = document.getElementById('inspector-gamma-val');
        if (gammaSlider) gammaSlider.value = clip.gamma || 0;
        if (gammaVal) gammaVal.textContent = `${clip.gamma || 0}`;

        const gainSlider = document.getElementById('inspector-gain-slider');
        const gainVal = document.getElementById('inspector-gain-val');
        if (gainSlider) gainSlider.value = clip.gain || 0;
        if (gainVal) gainVal.textContent = `${clip.gain || 0}`;

        const tempSlider = document.getElementById('inspector-temp-slider');
        const tempVal = document.getElementById('inspector-temp-val');
        if (tempSlider) tempSlider.value = clip.temperature || 0;
        if (tempVal) tempVal.textContent = `${clip.temperature || 0}`;

        const satSlider = document.getElementById('inspector-sat-slider');
        const satVal = document.getElementById('inspector-sat-val');
        const curSat = clip.saturation !== undefined ? clip.saturation : 100;
        if (satSlider) satSlider.value = curSat;
        if (satVal) satVal.textContent = `${curSat}%`;
      } else {
        colorSec.style.display = 'none';
      }
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

    // Clip Transition & Overlap Motion section sync
    const transSection = document.getElementById('inspector-transition-section');
    if (transSection) {
      if (trackType === 'image' || trackType === 'video') {
        transSection.style.display = 'block';
        const transTypeSelect = document.getElementById('inspector-trans-type-select');
        const transBadge = document.getElementById('inspector-transition-badge');
        const transDurSlider = document.getElementById('inspector-trans-dur-slider');
        const transDurInput = document.getElementById('inspector-trans-dur-input');
        const transDurVal = document.getElementById('inspector-trans-dur-val');
        const transDirBadge = document.getElementById('inspector-trans-dir-badge');
        const transDirBox = document.getElementById('inspector-trans-direction-box');
        const transSpeedBox = document.getElementById('inspector-trans-speed-box');
        const transModeBox = document.getElementById('inspector-trans-mode-box');
        const customDirPanel = document.getElementById('inspector-trans-custom-dir-panel');
        const angleSlider = document.getElementById('inspector-trans-angle-slider');
        const angleVal = document.getElementById('inspector-trans-angle-val');
        const durDropdown = document.getElementById('inspector-trans-dur-dropdown');

        const curTrans = clip.transition || 'none';
        const curDur = clip.transitionDuration !== undefined ? clip.transitionDuration : 0.7;
        const curDir = clip.transitionDirection || (curTrans === 'fly_through' ? 'center' : 'left');
        const curAngle = clip.transitionAngle !== undefined ? clip.transitionAngle : 45;
        const curMode = clip.transitionMode || 'underneath';

        if (transTypeSelect) transTypeSelect.value = curTrans;
        if (transBadge) {
          transBadge.textContent = curTrans !== 'none' ? (TRANSITION_TYPES[curTrans]?.label || curTrans) : 'None';
          transBadge.style.color = curTrans !== 'none' ? '#a855f7' : 'var(--text-muted)';
        }

        if (transDurSlider) transDurSlider.value = Math.round(curDur * 10);
        if (transDurVal) transDurVal.textContent = curDur.toFixed(2) + 's';
        if (transDurInput) transDurInput.value = curDur.toFixed(2);
        if (transDirBadge) transDirBadge.textContent = curDir === 'custom' ? `CUSTOM (${curAngle}°)` : curDir.toUpperCase();

        if (customDirPanel) customDirPanel.style.display = curDir === 'custom' ? 'block' : 'none';
        if (angleSlider) angleSlider.value = curAngle;
        if (angleVal) angleVal.textContent = `${curAngle}°`;
        if (durDropdown) durDropdown.value = '';

        // Toggle direction buttons
        document.querySelectorAll('.trans-dir-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.dir === curDir);
        });

        // Toggle mode buttons
        document.getElementById('btn-trans-mode-under')?.classList.toggle('active', curMode === 'underneath');
        document.getElementById('btn-trans-mode-over')?.classList.toggle('active', curMode === 'over');

        const hasTrans = curTrans !== 'none';
        if (transDirBox) transDirBox.style.display = hasTrans ? 'block' : 'none';
        if (transSpeedBox) transSpeedBox.style.display = hasTrans ? 'block' : 'none';
        if (transModeBox) transModeBox.style.display = hasTrans ? 'flex' : 'none';
      } else {
        transSection.style.display = 'none';
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

    // Article Focus (Spotlight Dimming) & Highlight Inspector Section
    const docFocusSection = document.getElementById('inspector-doc-focus-section');
    if (docFocusSection) {
      if (trackType === 'image' || trackType === 'video') {
        docFocusSection.style.display = 'block';
        const docBadge = document.getElementById('inspector-doc-focus-badge');
        const docBody = document.getElementById('inspector-doc-focus-controls-body');
        const btnDocFocus = document.getElementById('btn-inspector-doc-focus');
        const btnDocHl = document.getElementById('btn-inspector-doc-highlight');

        // Normalize spotlights array for UI
        if (!Array.isArray(clip.spotlights) && clip.docFocus && clip.docFocusRect) {
          clip.spotlights = [{
            rect: clip.docFocusRect,
            style: clip.docStyle || 'dark',
            dimOpacity: clip.docDimOpacity !== undefined ? clip.docDimOpacity : 0.65,
            feather: clip.docFeather !== undefined ? clip.docFeather : (clip.docStyle === 'white' ? 18 : 16),
            startTime: clip.docFocusStartTime !== undefined ? clip.docFocusStartTime : 0.4,
            duration: clip.docFocusDuration || 2.5
          }];
        }

        const spotCount = Array.isArray(clip.spotlights) ? clip.spotlights.length : (clip.docFocus ? 1 : 0);
        const hasFocus = spotCount > 0;
        const hlCount = clip.highlights ? clip.highlights.length : 0;
        const hasScroll = !!clip.docScroll;
        const totalEffects = spotCount + hlCount + (hasScroll ? 1 : 0);

        if (docBadge) {
          docBadge.textContent = totalEffects > 0 ? `${totalEffects} Effects` : 'Off';
          docBadge.style.color = totalEffects > 0 ? '#38bdf8' : 'var(--text-muted)';
        }

        // Render Apple-style minimalist effect sequence chips
        const seqContainer = document.getElementById('inspector-fx-sequence-container');
        const chipsList = document.getElementById('inspector-fx-chips-list');
        const totalCountLbl = document.getElementById('inspector-fx-total-count');

        if (seqContainer && chipsList) {
          if (totalEffects > 0) {
            seqContainer.style.display = 'block';
            if (totalCountLbl) totalCountLbl.textContent = `${totalEffects} effect${totalEffects > 1 ? 's' : ''}`;
            chipsList.innerHTML = '';

            let currentEffectNum = 1;

            // Spotlights chips
            if (Array.isArray(clip.spotlights)) {
              clip.spotlights.forEach((sp, idx) => {
                const num = currentEffectNum++;
                const chip = document.createElement('button');
                chip.type = 'button';
                const isSelected = window._activeFxEdit?.type === 'spotlight' && window._activeFxEdit?.index === idx;
                chip.style.cssText = `
                  display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px;
                  font-size: 10.5px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
                  background: ${isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.06)'};
                  color: ${isSelected ? '#38bdf8' : '#e2e8f0'};
                  border: 1px solid ${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.12)'};
                `;
                chip.innerHTML = `<span style="font-weight:700; color:#38bdf8;">${num}</span> Spotlight (${(sp.duration || 2.5).toFixed(1)}s)`;
                chip.addEventListener('click', () => {
                  window._activeFxEdit = { type: 'spotlight', index: idx };
                  currentTime = clip.start + (sp.startTime !== undefined ? sp.startTime : 0.4);
                  renderCanvas();
                  renderAllTimelineTracks();
                  updateUI();
                });
                chipsList.appendChild(chip);
              });
            }

            // Camera scroll chip if active
            if (hasScroll) {
              const num = currentEffectNum++;
              const chip = document.createElement('button');
              chip.type = 'button';
              const isSelected = window._activeFxEdit?.type === 'scroll';
              chip.style.cssText = `
                display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px;
                font-size: 10.5px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
                background: ${isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)'};
                color: ${isSelected ? '#10b981' : '#e2e8f0'};
                border: 1px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.12)'};
              `;
              chip.innerHTML = `<span style="font-weight:700; color:#10b981;">${num}</span> Scroll (${(clip.docScrollSpeed || 3.0).toFixed(1)}s)`;
              chip.addEventListener('click', () => {
                window._activeFxEdit = { type: 'scroll' };
                currentTime = clip.start + (clip.docScrollLinger || 1.0);
                renderCanvas();
                renderAllTimelineTracks();
                updateUI();
              });
              chipsList.appendChild(chip);
            }

            // Highlight chips
            if (clip.highlights) {
              clip.highlights.forEach((hl, idx) => {
                const num = currentEffectNum++;
                const chip = document.createElement('button');
                chip.type = 'button';
                const isSelected = window._activeFxEdit?.type === 'highlight' && window._activeFxEdit?.index === idx;
                chip.style.cssText = `
                  display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px;
                  font-size: 10.5px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
                  background: ${isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255,255,255,0.06)'};
                  color: ${isSelected ? '#00f0ff' : '#e2e8f0'};
                  border: 1px solid ${isSelected ? '#00f0ff' : 'rgba(255,255,255,0.12)'};
                `;
                chip.innerHTML = `<span style="font-weight:700; color:#00f0ff;">${num}</span> Highlight (${(hl.duration || 0.6).toFixed(1)}s)`;
                chip.addEventListener('click', () => {
                  window._activeFxEdit = { type: 'highlight', index: idx };
                  window._selectedHighlightIndex = idx;
                  currentTime = clip.start + (hl.startTime !== undefined ? hl.startTime : 0.4);
                  renderCanvas();
                  renderAllTimelineTracks();
                  updateUI();
                });
                chipsList.appendChild(chip);
              });
            }

            // Active effect inline duration editor
            const activeEditBox = document.getElementById('inspector-fx-active-edit');
            const activeTitle = document.getElementById('inspector-fx-active-title');
            const activeDurVal = document.getElementById('inspector-fx-active-dur-val');
            const activeDurInput = document.getElementById('inspector-fx-active-dur');

            if (activeEditBox && window._activeFxEdit) {
              activeEditBox.style.display = 'block';
              if (window._activeFxEdit.type === 'spotlight' && Array.isArray(clip.spotlights)) {
                const sp = clip.spotlights[window._activeFxEdit.index] || clip.spotlights[0];
                if (sp) {
                  const d = sp.duration || 2.5;
                  if (activeTitle) activeTitle.textContent = `Spotlight #${window._activeFxEdit.index + 1} Duration`;
                  if (activeDurVal) activeDurVal.textContent = `${d.toFixed(1)}s`;
                  if (activeDurInput) activeDurInput.value = Math.round(d * 10);
                }
              } else if (window._activeFxEdit.type === 'highlight' && clip.highlights) {
                const hl = clip.highlights[window._activeFxEdit.index] || clip.highlights[0];
                if (hl) {
                  const d = hl.duration || 0.6;
                  if (activeTitle) activeTitle.textContent = `Highlight #${window._activeFxEdit.index + 1} Duration`;
                  if (activeDurVal) activeDurVal.textContent = `${d.toFixed(1)}s`;
                  if (activeDurInput) activeDurInput.value = Math.round(d * 10);
                }
              } else if (window._activeFxEdit.type === 'scroll') {
                const d = clip.docScrollSpeed || 3.0;
                if (activeTitle) activeTitle.textContent = 'Camera Scroll Duration';
                if (activeDurVal) activeDurVal.textContent = `${d.toFixed(1)}s`;
                if (activeDurInput) activeDurInput.value = Math.round(d * 10);
              }
            } else if (activeEditBox) {
              activeEditBox.style.display = 'none';
            }
          } else {
            seqContainer.style.display = 'none';
          }
        }

        const btnDocWhite = document.getElementById('btn-inspector-doc-white');
        const btnDocDark = document.getElementById('btn-inspector-doc-dark');

        const hasWhiteFocus = hasFocus && (clip.docStyle !== 'dark');
        const hasDarkFocus = hasFocus && (clip.docStyle === 'dark');

        if (btnDocWhite) {
          btnDocWhite.style.borderColor = hasWhiteFocus ? '#38bdf8' : '';
          btnDocWhite.style.color = hasWhiteFocus ? '#38bdf8' : '';
        }
        if (btnDocDark) {
          btnDocDark.style.borderColor = hasDarkFocus ? '#a855f7' : '';
          btnDocDark.style.color = hasDarkFocus ? '#a855f7' : '';
        }
        if (btnDocHl) {
          btnDocHl.style.borderColor = hlCount > 0 ? '#38bdf8' : '';
          btnDocHl.style.color = hlCount > 0 ? '#38bdf8' : '';
        }

        if ((hasFocus || hlCount > 0) && docBody) {
          docBody.style.display = 'block';
          const isWhite = (clip.docStyle !== 'dark');
          const btnWhite = document.getElementById('btn-doc-style-white');
          const btnDark = document.getElementById('btn-doc-style-dark');
          if (btnWhite) btnWhite.classList.toggle('active', isWhite);
          if (btnDark) btnDark.classList.toggle('active', !isWhite);

          const lblDim = document.getElementById('label-doc-dim');
          if (lblDim) lblDim.textContent = isWhite ? 'Whiteout Fade Level' : 'Dark Dim Level';

          const dimInput = document.getElementById('inspector-doc-dim');
          const dimVal = document.getElementById('inspector-doc-dim-val');
          const curDim = Math.round((clip.docDimOpacity !== undefined ? clip.docDimOpacity : 0.65) * 100);
          if (dimInput) dimInput.value = curDim;
          if (dimVal) dimVal.textContent = `${curDim}%`;

          const featherInput = document.getElementById('inspector-doc-feather');
          const featherVal = document.getElementById('inspector-doc-feather-val');
          const curFeather = clip.docFeather !== undefined ? clip.docFeather : (isWhite ? 18 : 16);
          if (featherInput) featherInput.value = curFeather;
          if (featherVal) featherVal.textContent = `${curFeather}px`;

          const speedInput = document.getElementById('inspector-doc-speed');
          const speedVal = document.getElementById('inspector-doc-speed-val');
          const curSpeed = clip.docSweepSpeed !== undefined ? clip.docSweepSpeed : 0.6;
          if (speedInput) speedInput.value = Math.round(curSpeed * 10);
          if (speedVal) speedVal.textContent = `${curSpeed.toFixed(1)}s / line`;

          // Sync Un-whiteout / Timed Auto-Restore settings
          const btnUnwhiteout = document.getElementById('btn-toggle-unwhiteout');
          const rowUnwhiteoutSlider = document.getElementById('row-unwhiteout-slider');
          const durInput = document.getElementById('inspector-doc-focus-dur');
          const durVal = document.getElementById('inspector-doc-focus-dur-val');
          const hasTimedFocus = (clip.docFocusDuration && clip.docFocusDuration > 0);
          if (btnUnwhiteout) {
            btnUnwhiteout.textContent = hasTimedFocus ? 'Timed (Auto-Restore)' : 'Hold Whole Clip';
            btnUnwhiteout.style.color = hasTimedFocus ? '#38bdf8' : 'var(--text-muted)';
            btnUnwhiteout.style.borderColor = hasTimedFocus ? '#38bdf8' : '';
          }
          if (rowUnwhiteoutSlider) rowUnwhiteoutSlider.style.display = hasTimedFocus ? 'block' : 'none';
          if (durInput && hasTimedFocus) durInput.value = Math.round(clip.docFocusDuration * 10);
          if (durVal && hasTimedFocus) durVal.textContent = `${clip.docFocusDuration.toFixed(1)}s`;

          // Sync highlighter color picker & presets
          const colorInput = document.getElementById('inspector-doc-hl-color');
          const activeColor = clip.docHlColor || (clip.highlights && clip.highlights.length > 0 ? clip.highlights[clip.highlights.length - 1].color : '#38bdf8');
          if (colorInput) colorInput.value = activeColor;
          document.querySelectorAll('.hl-preset-btn').forEach(btn => {
            const c = btn.getAttribute('data-color');
            const isActive = c && activeColor && c.toLowerCase() === activeColor.toLowerCase();
            btn.style.boxShadow = isActive ? '0 0 0 2px #ffffff' : 'none';
            btn.style.fontWeight = isActive ? 'bold' : 'normal';
          });
        } else if (docBody) {
          docBody.style.display = 'none';
        }
      } else {
        docFocusSection.style.display = 'none';
      }
    }

    // Document Camera Scroll / Flow Inspector Section
    const docScrollSection = document.getElementById('inspector-doc-scroll-section');
    if (docScrollSection) {
      if (trackType === 'image' || trackType === 'video') {
        docScrollSection.style.display = 'block';
        const scrollBadge = document.getElementById('inspector-doc-scroll-badge');
        const scrollBody = document.getElementById('inspector-doc-scroll-controls-body');
        const hasScroll = !!clip.docScroll;
        if (scrollBadge) {
          scrollBadge.textContent = hasScroll ? (clip.docScrollMode === 'across' ? 'Horizontal' : clip.docScrollMode === 'zigzag' ? 'Highlight Flow' : 'Top to Bottom') : 'Off';
          scrollBadge.style.color = hasScroll ? '#10b981' : 'var(--text-muted)';
        }
        if (scrollBody) scrollBody.style.display = hasScroll ? 'block' : 'none';

        document.querySelectorAll('.doc-scroll-preset-btn').forEach(btn => {
          const mode = btn.getAttribute('data-mode');
          btn.classList.toggle('active', hasScroll && clip.docScrollMode === mode);
        });

        const distInput = document.getElementById('inspector-doc-scroll-dist');
        const distVal = document.getElementById('inspector-doc-scroll-dist-val');
        const curDist = clip.docScrollDistance || 280;
        if (distInput) distInput.value = curDist;
        if (distVal) distVal.textContent = `${curDist}px`;

        const lingerInput = document.getElementById('inspector-doc-scroll-linger');
        const lingerVal = document.getElementById('inspector-doc-scroll-linger-val');
        const curLinger = clip.docScrollLinger !== undefined ? clip.docScrollLinger : 1.0;
        if (lingerInput) lingerInput.value = Math.round(curLinger * 10);
        if (lingerVal) lingerVal.textContent = `${curLinger.toFixed(1)}s`;

        const speedInput = document.getElementById('inspector-doc-scroll-speed');
        const speedVal = document.getElementById('inspector-doc-scroll-speed-val');
        const curSpeed = clip.docScrollSpeed !== undefined ? clip.docScrollSpeed : 3.0;
        if (speedInput) speedInput.value = Math.round(curSpeed * 10);
        if (speedVal) speedVal.textContent = `${curSpeed.toFixed(1)}s`;
      } else {
        docScrollSection.style.display = 'none';
      }
    }

    // Motion Blur Crowds Inspector Section
    const crowdSection = document.getElementById('inspector-crowd-motion-section');
    if (crowdSection) {
      if (trackType === 'image' || trackType === 'video') {
        crowdSection.style.display = 'block';
        const badge = document.getElementById('inspector-crowd-motion-badge');
        const body = document.getElementById('inspector-crowd-motion-controls-body');
        const hasCrowd = !!clip.motionBlurCrowd;
        const wps = clip.crowdWaypoints || [];
        if (badge) {
          badge.textContent = hasCrowd ? (wps.length > 0 ? `${wps.length} Points` : 'Active') : 'Off';
          badge.style.color = hasCrowd ? '#00f0ff' : 'var(--text-muted)';
        }
        if (body) body.style.display = hasCrowd ? 'block' : 'none';

        const modeLabel = document.getElementById('inspector-crowd-mode-label');
        const isWide = clip.crowdZoomMode === 'wide';
        if (modeLabel) modeLabel.textContent = isWide ? 'Zoom-Out Wide' : 'Close-In Push';
        const btnClose = document.getElementById('btn-inspector-crowd-mode-close');
        const btnWide = document.getElementById('btn-inspector-crowd-mode-wide');
        if (btnClose) btnClose.classList.toggle('active', !isWide);
        if (btnWide) btnWide.classList.toggle('active', isWide);

        const countEl = document.getElementById('inspector-crowd-waypoints-count');
        if (countEl) countEl.textContent = `${wps.length} Persons`;
      } else {
        crowdSection.style.display = 'none';
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
  // Right-click context menu on timeline block
  blockEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectClip(clip, trackType);
    showStudioContextMenu(e.clientX, e.clientY, clip, trackType);
  });

  // Fluid Mouse Dragging & Gesture Handling
  blockEl.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('clip-handle') || e.target.closest('.clip-hover-delete')) return;
    if (e.button !== 0) return; // Only left click

    // Check if track is locked
    if (typeof isTrackLocked === 'function' && isTrackLocked(trackType)) {
      showTextTimingAlert('Track is locked. Unlock to edit.', 'warning');
      setTimeout(() => showTextTimingAlert(''), 2000);
      return;
    }

    if (activeTool === 'delete') {
      e.stopPropagation();
      recordState('Delete Clip');
      deleteClip(trackType, clip.id);
      return;
    }

    if (activeTool === 'split') {
      e.stopPropagation();
      const rect = block.getBoundingClientRect();
      const clickRatio = Math.max(0.01, Math.min(0.99, (e.clientX - rect.left) / rect.width));
      const clickTime = clip.start + (clickRatio * clip.duration);
      currentTime = clickTime;
      updatePlayheadUI();
      if (splitClipAtTime(trackType, clip, clickTime)) {
        showTextTimingAlert('Split clip at ' + formatTimecode(clickTime), 'success');
        setTimeout(() => showTextTimingAlert(''), 1500);
      }
      return;
    }

    // SLIP TOOL INTERACTION (Y): Shift internal media offset without moving clip position
    if (activeTool === 'slip') {
      const initialOffset = clip.mediaOffset || 0;
      let hasSlipped = false;
      const onSlipMove = (moveEv) => {
        const deltaX = moveEv.clientX - startX;
        if (!hasSlipped && Math.abs(deltaX) > 4) {
          hasSlipped = true;
          document.body.style.cursor = 'ew-resize';
        }
        if (hasSlipped) {
          const deltaSec = deltaX / pps;
          clip.mediaOffset = Math.max(0, initialOffset - deltaSec);
          showTextTimingAlert(`Slip: ${(deltaSec >= 0 ? '+' : '') + deltaSec.toFixed(2)}s | In-Point: ${formatTimecode(clip.mediaOffset)}`, 'info');
          renderCanvas();
        }
      };
      const onSlipUp = () => {
        window.removeEventListener('mousemove', onSlipMove);
        window.removeEventListener('mouseup', onSlipUp);
        document.body.style.cursor = '';
        if (hasSlipped) {
          recordState('Slip Clip Content');
          showTextTimingAlert(`Slipped clip content to ${formatTimecode(clip.mediaOffset || 0)}`, 'success');
          setTimeout(() => showTextTimingAlert(''), 1800);
        }
      };
      window.addEventListener('mousemove', onSlipMove);
      window.addEventListener('mouseup', onSlipUp);
      return;
    }

    // SLIDE TOOL INTERACTION (U): Slide clip between neighbors while preserving sequence timing
    if (activeTool === 'slide') {
      let hasSlid = false;
      const trackClips = (timelineClips[trackType] || []).slice().sort((a,b) => a.start - b.start);
      const clipIdx = trackClips.findIndex(c => c.id === clip.id);
      const prevClip = clipIdx > 0 ? trackClips[clipIdx - 1] : null;
      const nextClip = clipIdx < trackClips.length - 1 ? trackClips[clipIdx + 1] : null;
      const origStart = clip.start;
      const origPrevDur = prevClip ? prevClip.duration : 0;
      const origNextStart = nextClip ? nextClip.start : 0;
      const origNextDur = nextClip ? nextClip.duration : 0;

      const onSlideMove = (moveEv) => {
        const deltaX = moveEv.clientX - startX;
        if (!hasSlid && Math.abs(deltaX) > 4) {
          hasSlid = true;
          document.body.style.cursor = 'col-resize';
        }
        if (hasSlid) {
          const deltaSec = deltaX / pps;
          let clampedDelta = deltaSec;
          if (prevClip) clampedDelta = Math.max(-(origPrevDur - 0.3), clampedDelta);
          if (nextClip) clampedDelta = Math.min((origNextDur - 0.3), clampedDelta);

          clip.start = Math.max(0, origStart + clampedDelta);
          if (prevClip) prevClip.duration = origPrevDur + clampedDelta;
          if (nextClip) {
            nextClip.start = origNextStart + clampedDelta;
            nextClip.duration = origNextDur - clampedDelta;
          }
          blockEl.style.left = `${clip.start * pps}px`;
          renderAllTimelineTracks();
          renderCanvas();
          showTextTimingAlert(`Slide: ${(clampedDelta >= 0 ? '+' : '') + clampedDelta.toFixed(2)}s`, 'info');
        }
      };
      const onSlideUp = () => {
        window.removeEventListener('mousemove', onSlideMove);
        window.removeEventListener('mouseup', onSlideUp);
        document.body.style.cursor = '';
        if (hasSlid) {
          recordState('Slide Clip Along Track');
          renderAllTimelineTracks();
          showTextTimingAlert('Slide edit complete.', 'success');
          setTimeout(() => showTextTimingAlert(''), 1800);
        }
      };
      window.addEventListener('mousemove', onSlideMove);
      window.addEventListener('mouseup', onSlideUp);
      return;
    }

    // Always select the clip immediately on mousedown
    selectClip(clip, trackType);

    const startX = e.clientX;
    const initialStart = clip.start;
    let hasDragged = false;
    const DRAG_THRESHOLD_PX = 10;
    const SNAP_THRESHOLD_SEC = 0.25;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      if (!hasDragged && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        hasDragged = true;
        blockEl.classList.add('is-dragging');
        blockEl.classList.add('is-drag-preview');
        document.body.style.cursor = 'grabbing';
      }

      if (hasDragged) {
        const deltaSec = deltaX / pps;
        let newStart = Math.max(0, initialStart + deltaSec);

        // Snap to playhead
        if (Math.abs(newStart - currentTime) <= SNAP_THRESHOLD_SEC) {
          newStart = currentTime;
          blockEl.classList.add('is-snapped');
        } else {
          blockEl.classList.remove('is-snapped');
        }

        // Snap to neighbor clip boundaries
        const otherClips = (timelineClips[trackType] || []).filter(c => c.id !== clip.id);
        for (const other of otherClips) {
          const otherEnd = other.start + other.duration;
          if (Math.abs(newStart - otherEnd) <= SNAP_THRESHOLD_SEC) {
            newStart = otherEnd;
            blockEl.classList.add('is-snapped');
            break;
          }
          if (Math.abs((newStart + clip.duration) - other.start) <= SNAP_THRESHOLD_SEC) {
            newStart = Math.max(0, other.start - clip.duration);
            blockEl.classList.add('is-snapped');
            break;
          }
        }

        clip.start = newStart;
        blockEl.style.left = `${clip.start * pps}px`;

        // Update live timecode inputs
        const si = document.getElementById('inspector-start-input');
        const tsi = document.getElementById('text-start-input');
        if (si) si.value = formatTimecode(clip.start);
        if (tsi) tsi.value = formatTimecode(clip.start);
      }
    };

    const onMouseUp = (upEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';

      if (hasDragged) {
        blockEl.classList.remove('is-dragging');
        blockEl.classList.remove('is-drag-preview');
        blockEl.classList.remove('is-snapped');

        // Automatic exchange/reorder: sort clips chronologically
        timelineClips[trackType].sort((a, b) => a.start - b.start);
        recordState('Move Clip');
        renderAllTimelineTracks();
        if (trackType === 'text') renderAllTextsOverview();
        showTextTimingAlert('Clip moved to ' + formatTimecode(clip.start), 'info');
        setTimeout(() => showTextTimingAlert(''), 1500);
      } else {
        // Simple click without drag -> seek playhead to the exact clicked point in the clip
        const tracksContainer = document.getElementById('timeline-tracks');
        if (tracksContainer) {
          const rect = tracksContainer.getBoundingClientRect();
          const clickX = (upEvent ? upEvent.clientX : startX) - rect.left + tracksContainer.scrollLeft;
          seekToTime(Math.max(0, clickX / pps));
        } else {
          seekToTime(clip.start);
        }
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

function splitClipAtTime(trackType, clip, splitTime) {
  if (!clip || !trackType) return false;
  if (isTrackLocked(trackType)) {
    showTextTimingAlert('Track is locked.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }
  if (splitTime <= clip.start || splitTime >= (clip.start + clip.duration)) {
    return false;
  }
  const originalEnd = clip.start + clip.duration;
  const firstDuration = splitTime - clip.start;
  const secondDuration = originalEnd - splitTime;

  // Update first half duration
  clip.duration = firstDuration;

  // Create second half with cloned properties and unique ID
  const secondHalf = JSON.parse(JSON.stringify(clip));
  secondHalf.id = `clip-${trackType}-${Date.now()}`;
  secondHalf.start = splitTime;
  secondHalf.duration = secondDuration;

  // If video clip has inPoint, offset it
  if (secondHalf.file && typeof secondHalf.file.inPoint === 'number') {
    secondHalf.file.inPoint += firstDuration;
  }

  if (!timelineClips[trackType]) timelineClips[trackType] = [];
  timelineClips[trackType].push(secondHalf);
  timelineClips[trackType].sort((a, b) => a.start - b.start);

  recordState('Split Clip');
  renderAllTimelineTracks();
  selectClip(secondHalf, trackType);
  return true;
}

function splitClipAtPlayhead(trackType, clip) {
  return splitClipAtTime(trackType, clip, currentTime);
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

        // Special handling for Chart template drag & drop
        if (file.isChart && file.chartConfig) {
          addChartClipToTimeline(file.chartConfig, dropSec, 6.0);
          showTextTimingAlert(`Added "${file.name || 'Chart'}" to timeline at ${formatTime(dropSec)}`, 'success');
          setTimeout(() => showTextTimingAlert(''), 2500);
          return;
        }

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

// Centralized Studio Tool Switcher
function setStudioTool(toolName, docStyle = null) {
  activeTool = toolName;
  canvas.classList.remove('tool-snap-zoom', 'tool-loupe', 'tool-draw', 'tool-doc-focus', 'tool-doc-highlight');
  document.querySelectorAll('.timeline-tools .btn-tool, .apple-toolbar-group .btn-apple-tool').forEach(b => {
    if (!['tool-undo', 'tool-redo', 'tool-reset-timeline', 'tool-toggle-expand', 'tool-cut', 'tool-trim-left', 'tool-trim-right'].includes(b.id)) {
      b.classList.remove('active');
    }
  });

  document.body.classList.remove('tool-slip-active', 'tool-slide-active');

  if (toolName === 'select') {
    document.getElementById('tool-select')?.classList.add('active');
    toggleDrawingDock(false);
  } else if (toolName === 'split') {
    document.getElementById('tool-split')?.classList.add('active');
    toggleDrawingDock(false);
  } else if (toolName === 'slip') {
    document.getElementById('tool-slip')?.classList.add('active');
    document.body.classList.add('tool-slip-active');
    toggleDrawingDock(false);
  } else if (toolName === 'slide') {
    document.getElementById('tool-slide')?.classList.add('active');
    document.body.classList.add('tool-slide-active');
    toggleDrawingDock(false);
  } else if (toolName === 'delete') {
    document.getElementById('tool-delete')?.classList.add('active');
    toggleDrawingDock(false);
  } else if (toolName === 'snap-zoom') {
    canvas.classList.add('tool-snap-zoom');
    toggleDrawingDock(false);
    document.getElementById('btn-dropdown-fx')?.classList.add('active');
  } else if (toolName === 'loupe') {
    canvas.classList.add('tool-loupe');
    toggleDrawingDock(false);
    document.getElementById('btn-dropdown-fx')?.classList.add('active');
  } else if (toolName === 'doc-focus') {
    if (docStyle) window._activeDocStyle = docStyle;
    canvas.classList.add('tool-doc-focus');
    toggleDrawingDock(false);
    document.getElementById('btn-dropdown-fx')?.classList.add('active');
  } else if (toolName === 'doc-highlight') {
    canvas.classList.add('tool-doc-highlight');
    toggleDrawingDock(false);
    document.getElementById('btn-dropdown-fx')?.classList.add('active');
  } else if (toolName === 'draw') {
    canvas.classList.add('tool-draw');
    toggleDrawingDock(true);
    document.getElementById('btn-dropdown-fx')?.classList.add('active');
  }
}

// Timeline Header Tools
document.querySelectorAll('.timeline-tools .btn-tool, .apple-toolbar-group .btn-apple-tool').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Exclude undo, redo, reset, expand, and trim/cut/mode buttons from active tool toggle
    if (['tool-undo', 'tool-redo', 'tool-reset-timeline', 'tool-toggle-expand', 'btn-mode-multi', 'btn-mode-consolidated', 'tool-cut', 'tool-trim-left', 'tool-trim-right'].includes(btn.id)) return;

    if (btn.id === 'tool-select') {
      setStudioTool('select');
    } else if (btn.id === 'tool-split') {
      if (typeof executeStudioSplit === 'function') {
        executeStudioSplit();
      } else {
        setStudioTool('split');
      }
    } else if (btn.id === 'tool-slip') {
      setStudioTool('slip');
      showTextTimingAlert('Slip Tool Active (Y): Drag inside clip to slip media content', 'info');
      setTimeout(() => showTextTimingAlert(''), 2200);
    } else if (btn.id === 'tool-slide') {
      setStudioTool('slide');
      showTextTimingAlert('Slide Tool Active (U): Drag clip along timeline rolling cuts', 'info');
      setTimeout(() => showTextTimingAlert(''), 2200);
    } else if (btn.id === 'tool-delete') {
      if (typeof executeStudioDelete === 'function') {
        executeStudioDelete();
      } else {
        setStudioTool('delete');
      }
    }
  });
});

// Setup Mode Switcher: Multi-Track Pro vs Consolidated Storyline
document.getElementById('btn-mode-multi')?.addEventListener('click', () => {
  timelineViewMode = 'multi';
  document.getElementById('btn-mode-multi')?.classList.add('active');
  document.getElementById('btn-mode-consolidated')?.classList.remove('active');
  renderAllTimelineTracks();
  showTextTimingAlert('Switched to Multi-Track Pro View (Independent Lanes)', 'info');
  setTimeout(() => showTextTimingAlert(''), 2200);
});

document.getElementById('btn-mode-consolidated')?.addEventListener('click', () => {
  timelineViewMode = 'consolidated';
  document.getElementById('btn-mode-consolidated')?.classList.add('active');
  document.getElementById('btn-mode-multi')?.classList.remove('active');
  renderAllTimelineTracks();
  showTextTimingAlert('Switched to Consolidated Storyline (Unified Ribbon)', 'success');
  setTimeout(() => showTextTimingAlert(''), 2200);
});

// Dropdown Toggles for FX & Elements in Toolbar
function setupToolbarDropdown(triggerId, menuId) {
  const trigger = document.getElementById(triggerId);
  const menu = document.getElementById(menuId);
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShowing = menu.classList.contains('show');
    document.querySelectorAll('.tool-dropdown-menu').forEach(m => m.classList.remove('show'));
    if (!isShowing) {
      menu.classList.add('show');
    }
  });
}

setupToolbarDropdown('btn-dropdown-fx', 'menu-tool-fx');
setupToolbarDropdown('btn-dropdown-elements', 'menu-tool-elements');

window.addEventListener('click', () => {
  document.querySelectorAll('.tool-dropdown-menu').forEach(m => m.classList.remove('show'));
});

// Tool menu items inside FX & Elements dropdowns
document.querySelectorAll('.tool-menu-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.tool-dropdown-menu').forEach(m => m.classList.remove('show'));

    if (item.id === 'tool-snap-zoom') {
      setStudioTool('snap-zoom');
    } else if (item.id === 'tool-loupe') {
      setStudioTool('loupe');
    } else if (item.id === 'tool-doc-focus') {
      setStudioTool('doc-focus', 'white');
      showTextTimingAlert('Whiteout Fade Active: Drag a rectangle over the paragraph to fade surrounding text to white.', 'info');
      setTimeout(() => showTextTimingAlert(''), 3500);
    } else if (item.id === 'tool-doc-focus-dark') {
      setStudioTool('doc-focus', 'dark');
      showTextTimingAlert('Dark Spotlight Active: Drag a rectangle over the target area to dim surroundings.', 'info');
      setTimeout(() => showTextTimingAlert(''), 3500);
    } else if (item.id === 'tool-doc-highlight') {
      setStudioTool('doc-highlight');
      showTextTimingAlert('Highlighter Active: Drag across words or lines to create an animated drawing sweep.', 'info');
      setTimeout(() => showTextTimingAlert(''), 3500);
    } else if (item.id === 'tool-draw') {
      setStudioTool('draw');
      showTextTimingAlert('Drawing Mode Active! Hold click anywhere on screen for Pen quick-menu.', 'success');
      setTimeout(() => showTextTimingAlert(''), 3000);
    } else if (item.id === 'tool-add-chart') {
      openChartCreatorModal();
    } else if (item.id === 'tool-add-icon') {
      switchMediaCategory('icons');
    }
  });
});

// ==================== VISUAL TIMELINE RULER (TICKS & TIMECODE LABELS) ====================
function drawTimeRuler() {
  const rulerCanvas = document.getElementById('ruler-canvas');
  const tracksContainer = document.getElementById('timeline-tracks');
  if (!rulerCanvas || !tracksContainer) return;

  const totalWidth = 5000;
  const height = 28;
  const dpr = window.devicePixelRatio || 1;

  if (rulerCanvas.width !== totalWidth * dpr || rulerCanvas.height !== height * dpr) {
    rulerCanvas.width = totalWidth * dpr;
    rulerCanvas.height = height * dpr;
    rulerCanvas.style.width = totalWidth + 'px';
    rulerCanvas.style.height = height + 'px';
  }

  const ctxR = rulerCanvas.getContext('2d');
  ctxR.setTransform(1, 0, 0, 1, 0, 0);
  ctxR.clearRect(0, 0, rulerCanvas.width, rulerCanvas.height);
  ctxR.scale(dpr, dpr);

  // Subtle bottom baseline
  ctxR.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctxR.lineWidth = 1;
  ctxR.beginPath();
  ctxR.moveTo(0, height - 0.5);
  ctxR.lineTo(totalWidth, height - 0.5);
  ctxR.stroke();

  // Multi-tier granular intervals based on zoom (pps)
  let majorIntervalSec;
  let mediumIntervalSec;
  let minorIntervalSec;

  if (pps >= 60) {
    majorIntervalSec = 1;      // e.g. 00:01, 00:02
    mediumIntervalSec = 0.5;   // half seconds
    minorIntervalSec = 0.1;    // tenths of a second micro-ticks
  } else if (pps >= 35) {
    majorIntervalSec = 1;      // every 1s
    mediumIntervalSec = 0.5;   // half seconds
    minorIntervalSec = 0.25;   // quarter seconds
  } else if (pps >= 20) {
    majorIntervalSec = 2;      // 00:00, 00:02, 00:04...
    mediumIntervalSec = 1;     // 1 second ticks
    minorIntervalSec = 0.5;    // half second micro ticks
  } else if (pps >= 12) {
    majorIntervalSec = 5;      // 00:00, 00:05, 00:10...
    mediumIntervalSec = 1;     // every 1 second
    minorIntervalSec = 0.5;    // every 0.5 second
  } else {
    majorIntervalSec = 10;
    mediumIntervalSec = 2;
    minorIntervalSec = 1;
  }

  const maxSec = totalWidth / pps;

  for (let s = 0; s <= maxSec; s = +(s + minorIntervalSec).toFixed(4)) {
    const x = Math.round(s * pps);
    const isMajor = Math.abs(Math.round(s / majorIntervalSec) * majorIntervalSec - s) < 0.001;
    const isMedium = !isMajor && Math.abs(Math.round(s / mediumIntervalSec) * mediumIntervalSec - s) < 0.001;

    ctxR.beginPath();
    if (isMajor) {
      // Bold major tick
      ctxR.strokeStyle = '#64748b';
      ctxR.lineWidth = 1.2;
      ctxR.moveTo(x + 0.5, height - 12);
      ctxR.lineTo(x + 0.5, height - 1);
      ctxR.stroke();

      // Bold, bigger, crisp timecode label
      ctxR.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, monospace';
      ctxR.fillStyle = '#f1f5f9';
      ctxR.fillText(formatTime(s), x + 4, 13);
    } else if (isMedium) {
      // Medium tick
      ctxR.strokeStyle = '#475569';
      ctxR.lineWidth = 1;
      ctxR.moveTo(x + 0.5, height - 7);
      ctxR.lineTo(x + 0.5, height - 1);
      ctxR.stroke();
    } else {
      // Micro granular sub-tick
      ctxR.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctxR.lineWidth = 1;
      ctxR.moveTo(x + 0.5, height - 4);
      ctxR.lineTo(x + 0.5, height - 1);
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
    playhead.style.left = `${currentTime * pps}px`;
  });
}

// ==================== INTERACTIVE TIMELINE SCRUBBING & SEEKING ====================
let isScrubbing = false;

function seekToTime(targetSec) {
  currentTime = Math.max(0, Math.min(duration, targetSec));
  triggeredSFX.clear();

  const activeVoice = (timelineClips.voiceover || []).find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeVoice) {
    if (audioPlayer.dataset.currentUrl !== activeVoice.file.url) {
      audioPlayer.dataset.currentUrl = activeVoice.file.url;
      audioPlayer.src = activeVoice.file.url;
    }
    const clipOffset = activeVoice.audioOffset || 0;
    audioPlayer.currentTime = (currentTime - activeVoice.start) + clipOffset;
  } else {
    if (audioPlayer.src && !audioPlayer.paused) {
      audioPlayer.pause();
    }
  }

  const activeMusic = (timelineClips.music || []).find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeMusic) {
    if (bgmPlayer.dataset.currentUrl !== activeMusic.file.url) {
      bgmPlayer.dataset.currentUrl = activeMusic.file.url;
      bgmPlayer.src = activeMusic.file.url;
    }
    bgmPlayer.currentTime = (currentTime - activeMusic.start) % (bgmPlayer.duration || 60);
  } else {
    if (bgmPlayer.src && !bgmPlayer.paused) {
      bgmPlayer.pause();
    }
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
    const clickX = e.clientX - rect.left + tracksContainer.scrollLeft;
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
    const clickX = e.clientX - rect.left + tracksContainer.scrollLeft;
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
  const labelCol = document.getElementById('timeline-label-col');
  tracksContainer.addEventListener('scroll', () => {
    if (rulerCanvas) {
      rulerCanvas.style.transform = `translateX(-${tracksContainer.scrollLeft}px)`;
    }
    // Sync vertical scroll: keep label column aligned with tracks
    if (labelCol) {
      labelCol.scrollTop = tracksContainer.scrollTop;
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

function switchMediaCategory(targetCategory) {
  currentFilter = targetCategory;

  // Sync dropdown
  const dropdown = document.getElementById('media-category-dropdown');
  if (dropdown && dropdown.value !== targetCategory) {
    dropdown.value = targetCategory;
  }

  // Sync pills
  document.querySelectorAll('.media-pill-btn').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.pill === targetCategory);
  });

  const mediaListEl = document.getElementById('media-list');
  const layersPanelEl = document.getElementById('layers-panel-container');
  const chartsPanelEl = document.getElementById('charts-panel-container');
  const iconsPanelEl = document.getElementById('icons-panel-container');
  const projectsPanelEl = document.getElementById('projects-panel-container');
  const templatesPanelEl = document.getElementById('templates-panel-container');

  if (projectsPanelEl) projectsPanelEl.style.display = 'none';
  if (templatesPanelEl) templatesPanelEl.style.display = 'none';

  if (currentFilter === 'templates') {
    if (mediaListEl) mediaListEl.style.display = 'none';
    if (layersPanelEl) layersPanelEl.style.display = 'none';
    if (chartsPanelEl) chartsPanelEl.style.display = 'none';
    if (iconsPanelEl) iconsPanelEl.style.display = 'none';
    if (projectsPanelEl) projectsPanelEl.style.display = 'none';
    if (templatesPanelEl) {
      templatesPanelEl.style.display = 'flex';
      renderTemplatesHub();
    }
  } else if (currentFilter === 'projects') {
    if (mediaListEl) mediaListEl.style.display = 'none';
    if (layersPanelEl) layersPanelEl.style.display = 'none';
    if (chartsPanelEl) chartsPanelEl.style.display = 'none';
    if (iconsPanelEl) iconsPanelEl.style.display = 'none';
    if (templatesPanelEl) templatesPanelEl.style.display = 'none';
    if (projectsPanelEl) {
      projectsPanelEl.style.display = 'flex';
      renderProjectsPanel();
    }
  } else if (currentFilter === 'charts') {
    if (mediaListEl) mediaListEl.style.display = 'none';
    if (layersPanelEl) layersPanelEl.style.display = 'none';
    if (iconsPanelEl) iconsPanelEl.style.display = 'none';
    if (templatesPanelEl) templatesPanelEl.style.display = 'none';
    if (chartsPanelEl) {
      chartsPanelEl.style.display = 'flex';
      renderChartsTemplatesPanel();
    }
  } else if (currentFilter === 'icons') {
    if (mediaListEl) mediaListEl.style.display = 'none';
    if (layersPanelEl) layersPanelEl.style.display = 'none';
    if (chartsPanelEl) chartsPanelEl.style.display = 'none';
    if (templatesPanelEl) templatesPanelEl.style.display = 'none';
    if (iconsPanelEl) {
      iconsPanelEl.style.display = 'flex';
      renderIconsLibraryPanel();
    }
  } else if (currentFilter === 'layers') {
    if (mediaListEl) mediaListEl.style.display = 'none';
    if (chartsPanelEl) chartsPanelEl.style.display = 'none';
    if (iconsPanelEl) iconsPanelEl.style.display = 'none';
    if (templatesPanelEl) templatesPanelEl.style.display = 'none';
    if (layersPanelEl) {
      layersPanelEl.style.display = 'flex';
      renderLayersPanel();
    }
  } else {
    if (layersPanelEl) layersPanelEl.style.display = 'none';
    if (chartsPanelEl) chartsPanelEl.style.display = 'none';
    if (iconsPanelEl) iconsPanelEl.style.display = 'none';
    if (templatesPanelEl) templatesPanelEl.style.display = 'none';
    if (mediaListEl) {
      mediaListEl.style.display = 'flex';
      renderMediaList(currentFilter);
    }
  }
}

// Media Category Dropdown listener
document.getElementById('media-category-dropdown')?.addEventListener('change', (e) => {
  switchMediaCategory(e.target.value);
});

// Media Category Quick Pill buttons
document.querySelectorAll('.media-pill-btn').forEach(pill => {
  pill.addEventListener('click', (e) => {
    switchMediaCategory(e.currentTarget.dataset.pill);
  });
});

// Legacy tab-btn support if invoked
document.querySelectorAll('.media-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    switchMediaCategory(e.currentTarget.dataset.tab);
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
    syncAudioPlayback();
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

// ==================== STAGE BACKDROP MODE ====================
const bgModeSelect = document.getElementById('stage-bg-mode-select');
const bgColorPicker = document.getElementById('stage-bg-color-picker');
const bgColorPickerRow = document.getElementById('row-bg-color-picker');
const bgColorVal = document.getElementById('stage-bg-color-val');
const bgModeBadge = document.getElementById('badge-bg-mode');

const BG_MODE_LABELS = {
  cyber_grid: 'Cyber Set',
  solid_black: 'Solid Black',
  none: 'Transparent',
  color: 'Solid Tint',
  vox_cream: 'Vox Cream'
};

function applyBackdropMode(type, color) {
  fxState.stageBackground = { type, color: color || '#0a0b0e' };
  if (bgModeBadge) bgModeBadge.textContent = BG_MODE_LABELS[type] || type;
  if (bgColorPickerRow) bgColorPickerRow.style.display = (type === 'color') ? 'block' : 'none';
  // Disable 3D grid toggle visual if not cyber_grid
  const gridEnable = document.getElementById('fx-grid-enable');
  if (gridEnable) gridEnable.closest('.fx-card').style.opacity = (type === 'cyber_grid') ? '1' : '0.45';
  // Sync the active background clip at current playhead position
  const bgClips = timelineClips.background || [];
  const activeClip = bgClips.find(c => currentTime >= c.start && currentTime < c.start + c.duration);
  if (activeClip) {
    activeClip.bgType = type;
    activeClip.bgColor = color || '#0a0b0e';
    renderAllTimelineTracks();
  }
}

// Background segment picker popover — lets user pick a bg style for a new segment
function openBackgroundSegmentPicker(atTimeSec, triggerEl) {
  document.querySelectorAll('.bg-segment-picker-popover').forEach(p => p.remove());

  const popover = document.createElement('div');
  popover.className = 'track-media-picker-popover bg-segment-picker-popover';

  const header = document.createElement('div');
  header.className = 'track-media-picker-header';
  header.innerHTML = `<span>Add Background Segment</span><span style="cursor:pointer;color:#ff6b7e;font-size:14px;line-height:1;" id="close-bg-picker">&times;</span>`;
  popover.appendChild(header);

  const bgOptions = [
    { value: 'cyber_grid',  label: 'Cyber Grid',    color: '#1a1f35' },
    { value: 'solid_black', label: 'Solid Black',   color: '#111111' },
    { value: 'none',        label: 'Transparent',   color: '#2a2a2a' },
    { value: 'color',       label: 'Solid Tint',    color: '#1a3a2a' },
    { value: 'vox_cream',   label: 'Vox Cream',     color: '#3a3020' }
  ];

  const list = document.createElement('div');
  list.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:8px 0;';

  bgOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 12px;background:${opt.color};border:1px solid rgba(255,255,255,0.12);border-radius:6px;color:#fff;font-size:12px;cursor:pointer;text-align:left;width:100%;`;
    btn.innerHTML = `<span style="width:12px;height:12px;border-radius:3px;background:${opt.color};border:1px solid rgba(255,255,255,0.3);flex-shrink:0;"></span>${opt.label}`;
    btn.addEventListener('click', () => {
      const newClip = {
        id: `clip-bg-${Date.now()}`,
        start: atTimeSec,
        duration: 10,
        bgType: opt.value,
        bgColor: opt.color
      };
      if (!timelineClips.background) timelineClips.background = [];
      timelineClips.background.push(newClip);
      recordState('Add Background Segment');
      renderAllTimelineTracks();
      popover.remove();
    });
    list.appendChild(btn);
  });

  popover.appendChild(list);

  // Position near trigger
  if (triggerEl) {
    const r = triggerEl.getBoundingClientRect();
    popover.style.cssText = `position:fixed;top:${r.bottom + 6}px;left:${r.left}px;z-index:9999;width:200px;`;
  }
  document.body.appendChild(popover);

  document.getElementById('close-bg-picker')?.addEventListener('click', () => popover.remove());
  setTimeout(() => {
    const outsideClick = (e) => { if (!popover.contains(e.target)) { popover.remove(); document.removeEventListener('click', outsideClick); } };
    document.addEventListener('click', outsideClick);
  }, 0);
}


bgModeSelect?.addEventListener('change', (e) => {
  applyBackdropMode(e.target.value, bgColorPicker?.value);
  recordState('Change Stage Backdrop');
});

bgColorPicker?.addEventListener('input', (e) => {
  if (bgColorVal) bgColorVal.textContent = e.target.value;
  if (fxState.stageBackground?.type === 'color') {
    fxState.stageBackground.color = e.target.value;
  }
});

// Initialize badge state on load
applyBackdropMode(fxState.stageBackground?.type || 'cyber_grid', fxState.stageBackground?.color || '#0a0b0e');

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

// ==================== TEMPORAL KEYFRAMING & TRANSFORM CONTROLS ====================
function updateInspectorKeyframeDiamonds(clip) {
  if (!clip) return;
  const clipTime = Math.max(0, currentTime - clip.start);
  const TOLERANCE = 0.08;
  const props = ['scale', 'rotation', 'x', 'y', 'opacity'];
  props.forEach(p => {
    const btn = document.querySelector(`.kf-prop-diamond[data-prop="${p}"]`);
    if (!btn) return;
    const hasKf = clip.keyframes && clip.keyframes[p] && clip.keyframes[p].some(k => Math.abs(k.time - clipTime) <= TOLERANCE);
    btn.classList.toggle('active', !!hasKf);
  });
  const playheadKfBtn = document.getElementById('btn-kf-add-playhead');
  if (playheadKfBtn) {
    const hasAnyKf = clip.keyframes && Object.values(clip.keyframes).some(arr => Array.isArray(arr) && arr.some(k => Math.abs(k.time - clipTime) <= TOLERANCE));
    playheadKfBtn.classList.toggle('active', !!hasAnyKf);
    playheadKfBtn.textContent = hasAnyKf ? '◆ Delete Keyframe' : '◆ Add Keyframe';
  }
}

function toggleClipPropertyKeyframe(clip, propName, currentVal) {
  if (!clip) return;
  clip.keyframes = clip.keyframes || {};
  clip.keyframes[propName] = clip.keyframes[propName] || [];
  const clipTime = Math.max(0, currentTime - clip.start);
  const TOLERANCE = 0.08;
  const existingIdx = clip.keyframes[propName].findIndex(k => Math.abs(k.time - clipTime) <= TOLERANCE);

  if (existingIdx >= 0) {
    clip.keyframes[propName].splice(existingIdx, 1);
    showTextTimingAlert(`Removed ${propName} keyframe at ${formatTimecode(currentTime)}`, 'info');
  } else {
    clip.keyframes[propName].push({
      time: clipTime,
      value: currentVal,
      easing: clip.kfEasing || 'ease'
    });
    clip.keyframes[propName].sort((a, b) => a.time - b.time);
    showTextTimingAlert(`Added ${propName} keyframe at ${formatTimecode(currentTime)}`, 'success');
  }
  updateInspectorKeyframeDiamonds(clip);
  renderAllTimelineTracks();
  renderCanvas();
  recordState(`Toggle ${propName} Keyframe`);
}

// Transform Sliders
document.getElementById('inspector-scale-slider')?.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  document.getElementById('inspector-scale-val').textContent = `${val}%`;
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.scale = val / 100;
    renderCanvas();
  }
});

document.getElementById('inspector-rotate-slider')?.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  document.getElementById('inspector-rotate-val').textContent = `${val}°`;
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.rotation = val;
    renderCanvas();
  }
});

document.getElementById('inspector-posx-slider')?.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  document.getElementById('inspector-posx-val').textContent = `${val}`;
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.x = val;
    renderCanvas();
  }
});

document.getElementById('inspector-posy-slider')?.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  document.getElementById('inspector-posy-val').textContent = `${val}`;
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.y = val;
    renderCanvas();
  }
});

document.getElementById('inspector-opacity-slider')?.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  document.getElementById('inspector-opacity-val').textContent = `${val}%`;
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.opacity = val / 100;
    renderCanvas();
  }
});

document.querySelectorAll('.kf-prop-diamond').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!selectedClip || !selectedClip.clip) return;
    const prop = btn.dataset.prop;
    const clip = selectedClip.clip;
    let val = clip[prop];
    if (prop === 'scale' && val === undefined) val = 1.0;
    if (prop === 'opacity' && val === undefined) val = 1.0;
    if (prop === 'rotation' && val === undefined) val = 0;
    if (prop === 'x' && val === undefined) val = 0;
    if (prop === 'y' && val === undefined) val = 0;
    toggleClipPropertyKeyframe(clip, prop, val);
  });
});

document.getElementById('btn-kf-add-playhead')?.addEventListener('click', () => {
  if (!selectedClip || !selectedClip.clip) return;
  const clip = selectedClip.clip;
  const props = ['scale', 'rotation', 'x', 'y', 'opacity'];
  props.forEach(p => {
    let val = clip[p];
    if (p === 'scale' && val === undefined) val = 1.0;
    if (p === 'opacity' && val === undefined) val = 1.0;
    if (p === 'rotation' && val === undefined) val = 0;
    if (p === 'x' && val === undefined) val = 0;
    if (p === 'y' && val === undefined) val = 0;
    toggleClipPropertyKeyframe(clip, p, val);
  });
});

document.getElementById('btn-kf-jump-prev')?.addEventListener('click', () => {
  if (!selectedClip || !selectedClip.clip || !selectedClip.clip.keyframes) return;
  const clip = selectedClip.clip;
  const curOffset = Math.max(0, currentTime - clip.start);
  const times = [];
  Object.values(clip.keyframes).forEach(arr => {
    if (Array.isArray(arr)) arr.forEach(k => times.push(k.time));
  });
  const prevTimes = times.filter(t => t < curOffset - 0.05).sort((a,b) => b - a);
  if (prevTimes.length > 0) {
    seekToTime(clip.start + prevTimes[0]);
  }
});

document.getElementById('btn-kf-jump-next')?.addEventListener('click', () => {
  if (!selectedClip || !selectedClip.clip || !selectedClip.clip.keyframes) return;
  const clip = selectedClip.clip;
  const curOffset = Math.max(0, currentTime - clip.start);
  const times = [];
  Object.values(clip.keyframes).forEach(arr => {
    if (Array.isArray(arr)) arr.forEach(k => times.push(k.time));
  });
  const nextTimes = times.filter(t => t > curOffset + 0.05).sort((a,b) => a - b);
  if (nextTimes.length > 0) {
    seekToTime(clip.start + nextTimes[0]);
  }
});

document.getElementById('inspector-kf-easing')?.addEventListener('change', (e) => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.kfEasing = e.target.value;
    recordState(`Set Keyframe Easing to ${e.target.value}`);
    renderCanvas();
  }
});

// ==================== COLOR PIPELINE & COMPOSITING MATH ====================
document.getElementById('inspector-lut-select')?.addEventListener('change', (e) => {
  if (!selectedClip || !selectedClip.clip) return;
  if (e.target.value === 'custom') {
    document.getElementById('input-custom-cube-lut')?.click();
    return;
  }
  selectedClip.clip.lut = e.target.value;
  recordState('Set 3D Film LUT Preset');
  renderCanvas();
});

document.getElementById('input-custom-cube-lut')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file || !selectedClip || !selectedClip.clip) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    selectedClip.clip.lut = 'custom';
    selectedClip.clip.customLutData = evt.target.result;
    showTextTimingAlert(`Loaded 3D LUT "${file.name}"`, 'success');
    renderCanvas();
  };
  reader.readAsText(file);
});

document.getElementById('inspector-blend-mode')?.addEventListener('change', (e) => {
  if (!selectedClip || !selectedClip.clip) return;
  selectedClip.clip.blendMode = e.target.value;
  recordState('Set Blend Mode');
  renderCanvas();
});

['lift', 'gamma', 'gain', 'temp', 'sat'].forEach(param => {
  const slider = document.getElementById(`inspector-${param}-slider`);
  const valLabel = document.getElementById(`inspector-${param}-val`);
  slider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (valLabel) valLabel.textContent = param === 'sat' ? `${val}%` : `${val}`;
    if (!selectedClip || !selectedClip.clip) return;
    if (param === 'lift') selectedClip.clip.lift = val;
    if (param === 'gamma') selectedClip.clip.gamma = val;
    if (param === 'gain') selectedClip.clip.gain = val;
    if (param === 'temp') selectedClip.clip.temperature = val;
    if (param === 'sat') selectedClip.clip.saturation = val;
    renderCanvas();
  });
});

document.getElementById('btn-reset-clip-color')?.addEventListener('click', () => {
  if (!selectedClip || !selectedClip.clip) return;
  const clip = selectedClip.clip;
  clip.lift = 0;
  clip.gamma = 0;
  clip.gain = 0;
  clip.temperature = 0;
  clip.saturation = 100;
  clip.lut = 'none';
  clip.blendMode = 'normal';
  selectClip(clip, selectedClip.trackType);
  renderCanvas();
  showTextTimingAlert('Reset color grading to Rec.709 neutral', 'info');
});

// ==================== PROXY MODE TOGGLE ====================
const btnToggleProxy = document.getElementById('btn-toggle-proxy');
const labelProxyStatus = document.getElementById('label-proxy-status');

if (btnToggleProxy) {
  const updateProxyBtnUI = () => {
    btnToggleProxy.classList.toggle('active', isProxyModeEnabled);
    if (labelProxyStatus) {
      labelProxyStatus.textContent = isProxyModeEnabled ? 'Proxy 540p' : 'Full-Res';
    }
  };
  updateProxyBtnUI();

  btnToggleProxy.addEventListener('click', () => {
    isProxyModeEnabled = !isProxyModeEnabled;
    localStorage.setItem('magnates_proxy_mode', isProxyModeEnabled);
    updateProxyBtnUI();
    mediaElementCache.clear(); // Clear so elements re-instantiate with proxy or original
    renderCanvas();
    showTextTimingAlert(isProxyModeEnabled ? '⚡ Smart Proxy Mode: ON (Zero-Lag Scrubbing)' : 'Full-Resolution Master Playback Active', 'info');
    setTimeout(() => showTextTimingAlert(''), 2200);
  });
}

// ==================== NLE PRESET SHORTCUTS MANAGER ====================
let activeNlePreset = localStorage.getItem('magnates_nle_preset') || 'magnates';

const NLE_PRESETS = {
  magnates: {
    name: 'Regaarder Studio (Default)',
    shortcuts: [
      { action: 'Play / Pause', key: 'Space' },
      { action: 'Selection Arrow Tool', key: 'V' },
      { action: 'Razor Split at Playhead', key: 'S' },
      { action: 'Slip Tool (Slide In/Out Offsets)', key: 'Y' },
      { action: 'Slide Tool (Move Clip Rolling Cuts)', key: 'U' },
      { action: 'Ripple Trim Head to Playhead', key: 'Q' },
      { action: 'Ripple Trim Tail to Playhead', key: 'W' },
      { action: 'Shuttle Reverse / Pause / Forward', key: 'J / K / L' },
      { action: 'Frame-Accurate Stepping', key: '← / → (Shift: 10 frames)' },
      { action: 'Cut / Copy / Paste Clip', key: 'Cmd/Ctrl + X / C / V' },
      { action: 'Undo / Redo Atomic State', key: 'Cmd/Ctrl + Z / Y' },
      { action: 'Delete Selected Clip', key: 'Del / Backspace' },
      { action: 'Toggle Smart Proxy Mode', key: 'P' },
      { action: 'Add / Remove Keyframe', key: 'K' }
    ]
  },
  premiere: {
    name: 'Adobe Premiere Pro',
    shortcuts: [
      { action: 'Play / Pause', key: 'Space' },
      { action: 'Selection Tool', key: 'V' },
      { action: 'Razor Tool (Split)', key: 'C' },
      { action: 'Add Edit (Split Clip)', key: 'Cmd/Ctrl + K' },
      { action: 'Slip Tool', key: 'Y' },
      { action: 'Slide Tool', key: 'U' },
      { action: 'Ripple Trim Previous Edit', key: 'Q' },
      { action: 'Ripple Trim Next Edit', key: 'W' },
      { action: 'Shuttle Reverse / Stop / Forward', key: 'J / K / L' },
      { action: 'Step 1 Frame', key: '← / →' },
      { action: 'Ripple Delete', key: 'Shift + Del' }
    ]
  },
  fcpx: {
    name: 'Final Cut Pro',
    shortcuts: [
      { action: 'Play / Pause', key: 'Space' },
      { action: 'Select Tool', key: 'A' },
      { action: 'Blade Tool (Split)', key: 'B' },
      { action: 'Trim / Slip Tool', key: 'T' },
      { action: 'Trim Start to Playhead', key: 'Option + [' },
      { action: 'Trim End to Playhead', key: 'Option + ]' },
      { action: 'Shuttle Left / Stop / Right', key: 'J / K / L' },
      { action: 'Step 1 Frame', key: '← / →' }
    ]
  },
  davinci: {
    name: 'DaVinci Resolve',
    shortcuts: [
      { action: 'Play / Pause', key: 'Space' },
      { action: 'Normal Edit / Selection', key: 'A' },
      { action: 'Blade Edit Mode', key: 'B' },
      { action: 'Split Clip at Playhead', key: 'Cmd/Ctrl + B' },
      { action: 'Slip / Slide Mode', key: 'T' },
      { action: 'Ripple Start to Playhead', key: 'Shift + [' },
      { action: 'Ripple End to Playhead', key: 'Shift + ]' },
      { action: 'Shuttle Controls', key: 'J / K / L' }
    ]
  }
};

function renderHotkeysTable(presetKey) {
  const tableBody = document.getElementById('hotkeys-table-body');
  if (!tableBody) return;
  const preset = NLE_PRESETS[presetKey] || NLE_PRESETS.magnates;
  tableBody.innerHTML = '';
  preset.shortcuts.forEach(s => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    tr.innerHTML = `
      <td style="padding: 9px 12px; font-weight: 500;">${s.action}</td>
      <td style="padding: 9px 12px; text-align: right;"><kbd>${s.key}</kbd></td>
    `;
    tableBody.appendChild(tr);
  });
}

function openHotkeysModal() {
  const modal = document.getElementById('modal-hotkeys');
  if (!modal) return;
  modal.style.display = 'flex';
  document.querySelectorAll('.nle-preset-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.preset === activeNlePreset);
  });
  renderHotkeysTable(activeNlePreset);
}

document.getElementById('btn-open-hotkeys')?.addEventListener('click', openHotkeysModal);
document.getElementById('btn-close-hotkeys-modal')?.addEventListener('click', () => {
  document.getElementById('modal-hotkeys').style.display = 'none';
});

document.querySelectorAll('.nle-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nle-preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeNlePreset = btn.dataset.preset;
    renderHotkeysTable(activeNlePreset);
  });
});

document.getElementById('btn-save-hotkeys-preset')?.addEventListener('click', () => {
  localStorage.setItem('magnates_nle_preset', activeNlePreset);
  document.getElementById('modal-hotkeys').style.display = 'none';
  showTextTimingAlert(`Applied ${NLE_PRESETS[activeNlePreset]?.name || activeNlePreset} layout!`, 'success');
  setTimeout(() => showTextTimingAlert(''), 2200);
});

// ==================== CURVE / GRAPH EDITOR MODAL ====================
let activeCurvePreset = 'easeInOutCubic';
let activeCurveTension = 0.5;

function drawCurveGraphCanvas() {
  const c = document.getElementById('curve-graph-canvas');
  if (!c) return;
  const ctx2 = c.getContext('2d');
  const w = c.width;
  const h = c.height;

  ctx2.clearRect(0, 0, w, h);

  // Background Grid Lines
  ctx2.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx2.lineWidth = 1;
  for (let x = 40; x < w; x += 40) {
    ctx2.beginPath();
    ctx2.moveTo(x, 0);
    ctx2.lineTo(x, h);
    ctx2.stroke();
  }
  for (let y = 30; y < h; y += 30) {
    ctx2.beginPath();
    ctx2.moveTo(0, y);
    ctx2.lineTo(w, y);
    ctx2.stroke();
  }

  // Draw Interpolation Curve
  ctx2.strokeStyle = '#00f0ff';
  ctx2.lineWidth = 3;
  ctx2.shadowColor = 'rgba(0, 240, 255, 0.6)';
  ctx2.shadowBlur = 8;
  ctx2.beginPath();

  const padX = 30;
  const padY = 30;
  const graphW = w - padX * 2;
  const graphH = h - padY * 2;

  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    let val = t;
    if (activeCurvePreset === 'easeInOutCubic') {
      val = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    } else if (activeCurvePreset === 'spring') {
      val = Math.sin(t * Math.PI * 2) * (1 - t) + t;
    } else if (activeCurvePreset === 'easeOutBack') {
      const c1 = 1.70158 * activeCurveTension * 2;
      const c3 = c1 + 1;
      val = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    const px = padX + t * graphW;
    const py = padY + graphH - val * graphH;
    if (i === 0) ctx2.moveTo(px, py);
    else ctx2.lineTo(px, py);
  }
  ctx2.stroke();

  // Draw End Points (Diamonds)
  ctx2.fillStyle = '#ffd000';
  ctx2.shadowColor = '#ffd000';
  ctx2.shadowBlur = 10;
  const pts = [
    { x: padX, y: padY + graphH },
    { x: padX + graphW, y: padY }
  ];
  pts.forEach(pt => {
    ctx2.beginPath();
    ctx2.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx2.fill();
  });
}

function openCurveEditorModal() {
  const modal = document.getElementById('modal-curve-editor');
  if (!modal) return;
  modal.style.display = 'flex';
  drawCurveGraphCanvas();
}

document.getElementById('btn-open-curve-editor')?.addEventListener('click', openCurveEditorModal);
document.getElementById('btn-close-curve-modal')?.addEventListener('click', () => {
  document.getElementById('modal-curve-editor').style.display = 'none';
});
document.getElementById('btn-cancel-curve-modal')?.addEventListener('click', () => {
  document.getElementById('modal-curve-editor').style.display = 'none';
});

document.querySelectorAll('.curve-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.curve-preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCurvePreset = btn.dataset.curve;
    drawCurveGraphCanvas();
  });
});

document.getElementById('curve-tension-slider')?.addEventListener('input', (e) => {
  activeCurveTension = parseInt(e.target.value) / 100;
  document.getElementById('curve-tension-val').textContent = activeCurveTension.toFixed(2);
  drawCurveGraphCanvas();
});

document.getElementById('btn-apply-curve-modal')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.kfEasing = activeCurvePreset;
    const select = document.getElementById('inspector-kf-easing');
    if (select) select.value = activeCurvePreset === 'easeInOutCubic' ? 'ease' : (activeCurvePreset === 'spring' ? 'spring' : 'bezier');
    renderCanvas();
    showTextTimingAlert(`Applied ${activeCurvePreset} curve interpolation!`, 'success');
  }
  document.getElementById('modal-curve-editor').style.display = 'none';
});

// ==================== SIDEBAR INSPECTOR: TRANSITIONS & MOTION ====================
document.getElementById('inspector-trans-type-select')?.addEventListener('change', (e) => {
  if (!selectedClip || !selectedClip.clip) return;
  const clip = selectedClip.clip;
  const val = e.target.value;
  clip.transition = val;
  if (val !== 'none') {
    if (!clip.transitionDuration) clip.transitionDuration = TRANSITION_TYPES[val]?.duration || 0.7;
    if (!clip.transitionDirection) clip.transitionDirection = (val === 'fly_through' ? 'center' : 'left');
    if (!clip.transitionMode) clip.transitionMode = 'underneath';
    if (!clip.transitionSfx) clip.transitionSfx = TRANSITION_TYPES[val]?.sfx || 'whoosh';
    playSFX('whoosh');
  }
  selectClip(clip, selectedClip.trackType);
  if (typeof injectTransitionChips === 'function') injectTransitionChips();
  renderAllTimelineTracks();
  recordState('Change Transition Type');
  saveProjectState(false);
  showTextTimingAlert(`Transition set: ${TRANSITION_TYPES[val]?.label || val}`, 'success');
  setTimeout(() => showTextTimingAlert(''), 1800);
});

document.querySelectorAll('.trans-dir-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!selectedClip || !selectedClip.clip) return;
    const clip = selectedClip.clip;
    const dir = btn.dataset.dir;
    clip.transitionDirection = dir;
    if (!clip.transition || clip.transition === 'none') {
      clip.transition = dir === 'center' ? 'fly_through' : 'directional_push';
      clip.transitionDuration = 0.7;
      clip.transitionSfx = 'whoosh';
    }
    selectClip(clip, selectedClip.trackType);
    playSFX('whoosh');
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
    recordState('Set Transition Direction');
    saveProjectState(false);
    showTextTimingAlert(`Direction: ${dir.toUpperCase()}`, 'info');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });
});

document.getElementById('btn-trans-mode-under')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!selectedClip || !selectedClip.clip) return;
  selectedClip.clip.transitionMode = 'underneath';
  selectClip(selectedClip.clip, selectedClip.trackType);
  recordState('Set Overlap Mode Underneath');
  saveProjectState(false);
  showTextTimingAlert('Overlap: Incoming emerges UNDERNEATH', 'info');
  setTimeout(() => showTextTimingAlert(''), 1500);
});

document.getElementById('btn-trans-mode-over')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!selectedClip || !selectedClip.clip) return;
  selectedClip.clip.transitionMode = 'over';
  selectClip(selectedClip.clip, selectedClip.trackType);
  recordState('Set Overlap Mode Over Top');
  saveProjectState(false);
  showTextTimingAlert('Overlap: Incoming pushes OVER TOP', 'info');
  setTimeout(() => showTextTimingAlert(''), 1500);
});

document.getElementById('inspector-trans-dur-slider')?.addEventListener('input', (e) => {
  if (!selectedClip || !selectedClip.clip) return;
  const val = parseInt(e.target.value) / 10;
  selectedClip.clip.transitionDuration = val;
  const durVal = document.getElementById('inspector-trans-dur-val');
  const durInput = document.getElementById('inspector-trans-dur-input');
  if (durVal) durVal.textContent = val.toFixed(2) + 's';
  if (durInput) durInput.value = val.toFixed(2);
  if (typeof injectTransitionChips === 'function') injectTransitionChips();
});

document.getElementById('inspector-trans-dur-slider')?.addEventListener('change', () => {
  recordState('Change Transition Duration');
  saveProjectState(false);
});

// Manual numeric duration input
const transDurInputEl = document.getElementById('inspector-trans-dur-input');
if (transDurInputEl) {
  transDurInputEl.addEventListener('input', (e) => {
    if (!selectedClip || !selectedClip.clip) return;
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      selectedClip.clip.transitionDuration = val;
      const slider = document.getElementById('inspector-trans-dur-slider');
      if (slider) slider.value = Math.min(30, Math.max(2, Math.round(val * 10)));
      if (typeof injectTransitionChips === 'function') injectTransitionChips();
    }
  });
  transDurInputEl.addEventListener('change', (e) => {
    if (!selectedClip || !selectedClip.clip) return;
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val <= 0.05) val = 0.1;
    selectedClip.clip.transitionDuration = val;
    e.target.value = val.toFixed(2);
    recordState('Set Custom Duration');
    saveProjectState(false);
  });
}

// Duration preset dropdown
document.getElementById('inspector-trans-dur-dropdown')?.addEventListener('change', (e) => {
  if (!selectedClip || !selectedClip.clip) return;
  const val = e.target.value;
  if (!val) return;
  if (val === 'custom') {
    transDurInputEl?.focus();
    transDurInputEl?.select();
    return;
  }
  const dur = parseFloat(val);
  if (!isNaN(dur) && dur > 0) {
    selectedClip.clip.transitionDuration = dur;
    selectClip(selectedClip.clip, selectedClip.trackType);
    recordState('Set Duration Dropdown');
    saveProjectState(false);
    showTextTimingAlert(`Duration: ${dur.toFixed(2)}s`, 'success');
    setTimeout(() => showTextTimingAlert(''), 1500);
  }
});

// Custom Angle Slider
const transAngleSlider = document.getElementById('inspector-trans-angle-slider');
const transAngleVal = document.getElementById('inspector-trans-angle-val');
if (transAngleSlider) {
  transAngleSlider.addEventListener('input', (e) => {
    if (!selectedClip || !selectedClip.clip) return;
    const angle = parseInt(e.target.value, 10);
    selectedClip.clip.transitionAngle = angle;
    selectedClip.clip.transitionDirection = 'custom';
    if (transAngleVal) transAngleVal.textContent = `${angle}°`;
    const badge = document.getElementById('inspector-trans-dir-badge');
    if (badge) badge.textContent = `CUSTOM (${angle}°)`;
  });
  transAngleSlider.addEventListener('change', () => {
    recordState('Set Custom Angle');
    saveProjectState(false);
  });
}

// Custom quick angle buttons
document.querySelectorAll('.trans-quick-angle-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!selectedClip || !selectedClip.clip) return;
    const angle = parseInt(btn.dataset.angle, 10);
    selectedClip.clip.transitionDirection = 'custom';
    selectedClip.clip.transitionAngle = angle;
    if (transAngleSlider) transAngleSlider.value = angle;
    if (transAngleVal) transAngleVal.textContent = `${angle}°`;
    const badge = document.getElementById('inspector-trans-dir-badge');
    if (badge) badge.textContent = `CUSTOM (${angle}°)`;
    recordState('Set Quick Angle');
    saveProjectState(false);
    showTextTimingAlert(`Direction: ${angle}°`, 'info');
    setTimeout(() => showTextTimingAlert(''), 1200);
  });
});

document.querySelectorAll('.btn-trans-quick-speed').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!selectedClip || !selectedClip.clip) return;
    const dur = parseFloat(btn.dataset.dur) || 0.7;
    selectedClip.clip.transitionDuration = dur;
    if (!selectedClip.clip.transition || selectedClip.clip.transition === 'none') {
      selectedClip.clip.transition = 'fly_through';
      selectedClip.clip.transitionDirection = 'center';
      selectedClip.clip.transitionSfx = 'whoosh';
    }
    selectClip(selectedClip.clip, selectedClip.trackType);
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
    recordState('Set Transition Speed Preset');
    saveProjectState(false);
    showTextTimingAlert(`Speed set to ${dur.toFixed(1)}s`, 'success');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });
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

// Helper to get selected media clip or auto-select top visible media clip at currentTime
function getOrSelectActiveMediaClip() {
  if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
    return selectedClip;
  }
  const activeMedia = [...timelineClips.image, ...timelineClips.video].filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
  if (activeMedia.length > 0) {
    const topClip = activeMedia[activeMedia.length - 1];
    const trackType = timelineClips.image.includes(topClip) ? 'image' : 'video';
    selectClip(topClip, trackType);
    return selectedClip;
  }
  return null;
}

// 1-Click Article Focus & Highlight Bundle Template (Vox / Documentary Presentation)
function applyDocFocusBundle(sel) {
  if (!sel || !sel.clip) return;
  const clip = sel.clip;

  // 1. Cinematic Punch Zoom (2.2x zoom focused on headline)
  clip.zoomEffect = 'snap';
  clip.zoomScale = 2.2;
  clip.zoomStartTime = 0.3;

  // 2. Whiteout Focus Fade
  clip.docFocus = true;
  clip.docStyle = 'white';
  clip.docDimOpacity = 0.65;
  clip.docFeather = 18;
  clip.docSweepSpeed = 0.6;
  clip.docHlColor = '#ffff00';

  // 3. Focus box positioned over headline area
  if (!clip.docFocusRect) {
    clip.docFocusRect = { x: 0.10, y: 0.18, w: 0.80, h: 0.22 };
  }
  clip.zoomOriginX = clip.docFocusRect.x + clip.docFocusRect.w / 2;
  clip.zoomOriginY = clip.docFocusRect.y + clip.docFocusRect.h / 2;

  // 4. Pure fluorescent yellow highlight bar across the headline
  clip.highlights = [{
    x: clip.docFocusRect.x,
    y: clip.docFocusRect.y,
    w: clip.docFocusRect.w,
    h: clip.docFocusRect.h,
    color: '#ffff00',
    opacity: 0.95,
    startTime: 0.5,
    duration: 0.7
  }];

  selectClip(clip, sel.trackType);
  const docBody = document.getElementById('inspector-doc-focus-controls-body');
  if (docBody) docBody.style.display = 'block';

  recordState('Apply Article Focus & Highlight Bundle');
  playSFX('pop');
  showTextTimingAlert('Template Applied: 2.2x Zoom + Whiteout Fade + Pure Yellow Highlight! Drag the box on canvas to reposition.', 'success');
  setTimeout(() => showTextTimingAlert(''), 4500);
}

document.getElementById('btn-inspector-doc-bundle')?.addEventListener('click', () => {
  const sel = getOrSelectActiveMediaClip();
  if (sel) {
    applyDocFocusBundle(sel);
  } else {
    showTextTimingAlert('Please add or position playhead over an article image first.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 3000);
  }
});

// Helper: Auto-detect bounding rectangle of existing highlights so Whiteout/Dark Spotlight does not overwrite them
function autoDetectFocusRectFromHighlights(clip) {
  if (clip.highlights && clip.highlights.length > 0) {
    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    clip.highlights.forEach(h => {
      minX = Math.min(minX, h.x);
      minY = Math.min(minY, h.y);
      maxX = Math.max(maxX, h.x + h.w);
      maxY = Math.max(maxY, h.y + h.h);
    });
    const padX = 0.02;
    const padY = 0.02;
    const x = Math.max(0.01, minX - padX);
    const y = Math.max(0.01, minY - padY);
    const w = Math.min(0.98 - x, (maxX - minX) + padX * 2);
    const h = Math.min(0.98 - y, (maxY - minY) + padY * 2);
    return { x, y, w, h };
  }
  return clip.docFocusRect || { x: 0.12, y: 0.28, w: 0.76, h: 0.24 };
}

// Article Focus & Highlight Inspector Event Listeners (Independent & Modular)
document.getElementById('btn-inspector-doc-white')?.addEventListener('click', () => {
  const sel = getOrSelectActiveMediaClip();
  if (sel) {
    window._activeDocStyle = 'white';
    setStudioTool('doc-focus', 'white');
    selectClip(sel.clip, sel.trackType);
    const docBody = document.getElementById('inspector-doc-focus-controls-body');
    if (docBody) docBody.style.display = 'block';
    showTextTimingAlert('Whiteout Focus Active: Drag a rectangle across the document on canvas to place your spotlight.', 'info');
    setTimeout(() => showTextTimingAlert(''), 3500);
  } else {
    showTextTimingAlert('Please add or position playhead over an image first.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 3000);
  }
});

document.getElementById('btn-inspector-doc-dark')?.addEventListener('click', () => {
  const sel = getOrSelectActiveMediaClip();
  if (sel) {
    window._activeDocStyle = 'dark';
    setStudioTool('doc-focus', 'dark');
    selectClip(sel.clip, sel.trackType);
    const docBody = document.getElementById('inspector-doc-focus-controls-body');
    if (docBody) docBody.style.display = 'block';
    showTextTimingAlert('Dark Spotlight Active: Drag a rectangle across the document on canvas to place your spotlight.', 'info');
    setTimeout(() => showTextTimingAlert(''), 3500);
  } else {
    showTextTimingAlert('Please add or position playhead over an image first.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 3000);
  }
});

document.getElementById('btn-inspector-doc-guide')?.addEventListener('click', () => {
  openDocFocusGuideModal();
});

document.getElementById('btn-inspector-doc-highlight')?.addEventListener('click', () => {
  const sel = getOrSelectActiveMediaClip();
  if (sel) {
    setStudioTool('doc-highlight');
    const docBody = document.getElementById('inspector-doc-focus-controls-body');
    if (docBody) docBody.style.display = 'block';
    showTextTimingAlert('Highlighter Active: Drag across words or lines on the canvas to add sweeping highlight bars.', 'info');
    setTimeout(() => showTextTimingAlert(''), 3500);
  } else {
    showTextTimingAlert('Please add or position playhead over an image first.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 3000);
  }
});

// Color Presets (Cyan, Yellow, Green)
document.querySelectorAll('.hl-preset-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const color = btn.getAttribute('data-color') || '#38bdf8';
    const colorInput = document.getElementById('inspector-doc-hl-color');
    if (colorInput) colorInput.value = color;

    document.querySelectorAll('.hl-preset-btn').forEach(b => {
      b.style.boxShadow = 'none';
      b.style.fontWeight = 'normal';
    });
    btn.style.boxShadow = '0 0 0 2px #ffffff';
    btn.style.fontWeight = 'bold';

    if (selectedClip && selectedClip.clip) {
      if (selectedClip.clip.highlights && selectedClip.clip.highlights.length > 0) {
        selectedClip.clip.highlights.forEach(h => h.color = color);
      }
      selectedClip.clip.docHlColor = color;
      recordState('Change Highlighter Color Preset');
    }
    showTextTimingAlert(`Highlighter color: ${btn.textContent.trim()}`, 'info');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });
});

// Custom Color Picker input
document.getElementById('inspector-doc-hl-color')?.addEventListener('input', (e) => {
  const color = e.target.value;
  if (selectedClip && selectedClip.clip) {
    if (selectedClip.clip.highlights && selectedClip.clip.highlights.length > 0) {
      selectedClip.clip.highlights.forEach(h => h.color = color);
    }
    selectedClip.clip.docHlColor = color;
  }
  document.querySelectorAll('.hl-preset-btn').forEach(b => {
    const c = b.getAttribute('data-color');
    const isActive = c && c.toLowerCase() === color.toLowerCase();
    b.style.boxShadow = isActive ? '0 0 0 2px #ffffff' : 'none';
    b.style.fontWeight = isActive ? 'bold' : 'normal';
  });
});
document.getElementById('inspector-doc-hl-color')?.addEventListener('change', () => {
  recordState('Change Custom Highlighter Color');
});

document.getElementById('inspector-doc-dim')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 100;
    selectedClip.clip.docDimOpacity = val;
    const lbl = document.getElementById('inspector-doc-dim-val');
    if (lbl) lbl.textContent = `${Math.round(val * 100)}%`;
  }
});
document.getElementById('inspector-doc-dim')?.addEventListener('change', () => {
  recordState('Change Article Focus Dimming');
});

document.getElementById('inspector-doc-feather')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value);
    selectedClip.clip.docFeather = val;
    const lbl = document.getElementById('inspector-doc-feather-val');
    if (lbl) lbl.textContent = `${val}px`;
  }
});
document.getElementById('inspector-doc-feather')?.addEventListener('change', () => {
  recordState('Change Spotlight Edge Feather');
});

// Focus Backdrop Style Toggles (Whiteout Fade vs Dark Spotlight)
document.getElementById('btn-doc-style-white')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.docStyle = 'white';
    selectedClip.clip.docDimOpacity = 0.65;
    selectedClip.clip.docFeather = 18;
    selectClip(selectedClip.clip, selectedClip.trackType);
    recordState('Set Focus Style: Whiteout Fade');
  }
});

document.getElementById('btn-doc-style-dark')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.docStyle = 'dark';
    selectedClip.clip.docDimOpacity = 0.65;
    selectedClip.clip.docFeather = 16;
    selectClip(selectedClip.clip, selectedClip.trackType);
    recordState('Set Focus Style: Dark Dim');
  }
});

document.getElementById('inspector-doc-speed')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 10;
    selectedClip.clip.docSweepSpeed = val;
    const lbl = document.getElementById('inspector-doc-speed-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}s / line`;
    if (selectedClip.clip.highlights) {
      selectedClip.clip.highlights.forEach(h => h.duration = val);
    }
  }
});
document.getElementById('inspector-doc-speed')?.addEventListener('change', () => {
  recordState('Change Highlight Sweep Speed');
});

// Article Focus & Highlighter Interactive Guide Modal
function openDocFocusGuideModal() {
  const modal = document.getElementById('doc-focus-guide-modal');
  if (!modal) return;
  modal.style.display = 'flex';
}

function closeDocFocusGuideModal() {
  const modal = document.getElementById('doc-focus-guide-modal');
  if (modal) modal.style.display = 'none';
}

document.getElementById('btn-close-doc-guide-modal')?.addEventListener('click', closeDocFocusGuideModal);
document.getElementById('btn-cancel-doc-guide')?.addEventListener('click', closeDocFocusGuideModal);
document.getElementById('doc-focus-guide-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'doc-focus-guide-modal') closeDocFocusGuideModal();
});

// Modal Style Card Selection: Whiteout vs Dark
document.getElementById('btn-modal-select-whiteout')?.addEventListener('click', () => {
  closeDocFocusGuideModal();
  const sel = getOrSelectActiveMediaClip();
  if (sel) {
    sel.clip.docFocus = true;
    sel.clip.docStyle = 'white';
    if (sel.clip.docDimOpacity === undefined) sel.clip.docDimOpacity = 0.65;
    if (!sel.clip.docFocusRect) {
      sel.clip.docFocusRect = { x: 0.12, y: 0.28, w: 0.76, h: 0.24 };
    }
    selectClip(sel.clip, sel.trackType);
  }
  setStudioTool('doc-focus', 'white');
  showTextTimingAlert('Whiteout Focus Active: Drag a rectangle over the paragraph to fade surrounding text to white.', 'info');
  setTimeout(() => showTextTimingAlert(''), 4000);
});

document.getElementById('btn-modal-select-dark')?.addEventListener('click', () => {
  closeDocFocusGuideModal();
  const sel = getOrSelectActiveMediaClip();
  if (sel) {
    sel.clip.docFocus = true;
    sel.clip.docStyle = 'dark';
    if (sel.clip.docDimOpacity === undefined) sel.clip.docDimOpacity = 0.65;
    if (!sel.clip.docFocusRect) {
      sel.clip.docFocusRect = { x: 0.12, y: 0.28, w: 0.76, h: 0.24 };
    }
    selectClip(sel.clip, sel.trackType);
  }
  setStudioTool('doc-focus', 'dark');
  showTextTimingAlert('Dark Spotlight Active: Drag a rectangle over the paragraph to dim surroundings into theater mode.', 'info');
  setTimeout(() => showTextTimingAlert(''), 4000);
});

// Also allow clicking directly on the preview cards in the modal
document.getElementById('modal-card-whiteout')?.addEventListener('click', (e) => {
  if (e.target.id === 'btn-modal-select-whiteout') return;
  document.getElementById('btn-modal-select-whiteout')?.click();
});

document.getElementById('modal-card-dark')?.addEventListener('click', (e) => {
  if (e.target.id === 'btn-modal-select-dark') return;
  document.getElementById('btn-modal-select-dark')?.click();
});

// Un-whiteout / Timed Focus Controls
document.getElementById('btn-toggle-unwhiteout')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    const clip = selectedClip.clip;
    if (clip.docFocusDuration && clip.docFocusDuration > 0) {
      delete clip.docFocusDuration;
      showTextTimingAlert('Focus stays for the entire clip', 'info');
    } else {
      clip.docFocusDuration = 2.0;
      showTextTimingAlert('Timed focus active: Will smoothly un-whiteout after 2.0s', 'success');
    }
    selectClip(clip, selectedClip.trackType);
    renderAllTimelineTracks();
    recordState('Toggle Timed Focus (Auto-Restore)');
    setTimeout(() => showTextTimingAlert(''), 2500);
  }
});

document.getElementById('inspector-doc-focus-dur')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 10;
    selectedClip.clip.docFocusDuration = val;
    const lbl = document.getElementById('inspector-doc-focus-dur-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}s`;
    renderAllTimelineTracks();
  }
});
document.getElementById('inspector-doc-focus-dur')?.addEventListener('change', () => {
  recordState('Change Focus Hold Duration');
});

// Apple-Style Effect Sequence: Duration Slider & Delete Button Handlers
document.getElementById('inspector-fx-active-dur')?.addEventListener('input', (e) => {
  if (!selectedClip || !selectedClip.clip || !window._activeFxEdit) return;
  const clip = selectedClip.clip;
  const val = parseInt(e.target.value) / 10;
  const lbl = document.getElementById('inspector-fx-active-dur-val');
  if (lbl) lbl.textContent = `${val.toFixed(1)}s`;

  if (window._activeFxEdit.type === 'spotlight' && Array.isArray(clip.spotlights)) {
    const sp = clip.spotlights[window._activeFxEdit.index];
    if (sp) sp.duration = val;
    clip.docFocusDuration = val;
  } else if (window._activeFxEdit.type === 'highlight' && clip.highlights) {
    const hl = clip.highlights[window._activeFxEdit.index];
    if (hl) hl.duration = val;
  } else if (window._activeFxEdit.type === 'scroll') {
    clip.docScrollSpeed = val;
  }
  renderAllTimelineTracks();
});

document.getElementById('inspector-fx-active-dur')?.addEventListener('change', () => {
  recordState('Change Effect Duration');
  updateUI();
});

document.getElementById('btn-fx-delete-active')?.addEventListener('click', () => {
  if (!selectedClip || !selectedClip.clip || !window._activeFxEdit) return;
  const clip = selectedClip.clip;

  if (window._activeFxEdit.type === 'spotlight' && Array.isArray(clip.spotlights)) {
    clip.spotlights.splice(window._activeFxEdit.index, 1);
    if (clip.spotlights.length === 0) {
      delete clip.docFocus;
      delete clip.docFocusRect;
    } else {
      clip.docFocusRect = clip.spotlights[0].rect;
    }
    showTextTimingAlert('Spotlight removed', 'info');
  } else if (window._activeFxEdit.type === 'highlight' && clip.highlights) {
    clip.highlights.splice(window._activeFxEdit.index, 1);
    window._selectedHighlightIndex = undefined;
    showTextTimingAlert('Highlight removed', 'info');
  } else if (window._activeFxEdit.type === 'scroll') {
    delete clip.docScroll;
    delete clip.docScrollMode;
    showTextTimingAlert('Camera scroll removed', 'info');
  }

  window._activeFxEdit = null;
  recordState('Delete Effect');
  selectClip(clip, selectedClip.trackType);
  renderCanvas();
  renderAllTimelineTracks();
  updateUI();
});

// 1-Click Instant Un-whiteout button
document.getElementById('btn-unwhiteout-now')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    delete selectedClip.clip.docFocus;
    delete selectedClip.clip.docFocusDuration;
    selectClip(selectedClip.clip, selectedClip.trackType);
    renderAllTimelineTracks();
    recordState('Un-whiteout Document');
    showTextTimingAlert('Un-whiteout: Document restored!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  }
});

// Document Camera Scroll Preset Buttons (Top to bottom, Horizontal, Highlight Flow)
document.querySelectorAll('.doc-scroll-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (selectedClip && selectedClip.clip) {
      const mode = btn.getAttribute('data-mode');
      const clip = selectedClip.clip;
      clip.docScroll = true;
      clip.docScrollMode = mode;
      if (!clip.docScrollDistance) clip.docScrollDistance = 280;
      if (clip.docScrollLinger === undefined) clip.docScrollLinger = 1.0;
      if (!clip.docScrollSpeed) clip.docScrollSpeed = 3.0;
      selectClip(clip, selectedClip.trackType);
      renderAllTimelineTracks();
      recordState(`Enable Document Camera Scroll: ${mode}`);
      const modeLabels = { down: 'Top to bottom', across: 'Horizontal glide', zigzag: 'Highlight Flow' };
      showTextTimingAlert(`Camera Scroll: ${modeLabels[mode] || mode} active!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2500);
    }
  });
});

document.getElementById('inspector-doc-scroll-dist')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value);
    selectedClip.clip.docScrollDistance = val;
    const lbl = document.getElementById('inspector-doc-scroll-dist-val');
    if (lbl) lbl.textContent = `${val}px`;
    renderAllTimelineTracks();
  }
});
document.getElementById('inspector-doc-scroll-dist')?.addEventListener('change', () => {
  recordState('Change Document Scroll Distance');
});

document.getElementById('inspector-doc-scroll-linger')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 10;
    selectedClip.clip.docScrollLinger = val;
    const lbl = document.getElementById('inspector-doc-scroll-linger-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}s`;
    renderAllTimelineTracks();
  }
});
document.getElementById('inspector-doc-scroll-linger')?.addEventListener('change', () => {
  recordState('Change Document Scroll Linger Time');
});

document.getElementById('inspector-doc-scroll-speed')?.addEventListener('input', (e) => {
  if (selectedClip && selectedClip.clip) {
    const val = parseInt(e.target.value) / 10;
    selectedClip.clip.docScrollSpeed = val;
    const lbl = document.getElementById('inspector-doc-scroll-speed-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}s`;
    renderAllTimelineTracks();
  }
});
document.getElementById('inspector-doc-scroll-speed')?.addEventListener('change', () => {
  recordState('Change Document Scroll Speed');
});

document.getElementById('btn-disable-doc-scroll')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    delete selectedClip.clip.docScroll;
    delete selectedClip.clip.docScrollMode;
    selectClip(selectedClip.clip, selectedClip.trackType);
    renderAllTimelineTracks();
    recordState('Disable Document Camera Scroll');
    showTextTimingAlert('Document Camera Scroll disabled', 'info');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

document.getElementById('btn-clear-highlights')?.addEventListener('click', () => {
  const sel = getOrSelectActiveMediaClip();
  if (sel && sel.clip) {
    sel.clip.highlights = [];
    delete sel.clip.docFocus;
    delete sel.clip.docFocusRect;
    selectClip(sel.clip, sel.trackType);
    renderAllTimelineTracks();
    recordState('Clear Article Focus & Highlights');
    showTextTimingAlert('Article focus & highlights cleared', 'info');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
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
      delete selectedClip.clip.docFocus;
      delete selectedClip.clip.docFocusRect;
      delete selectedClip.clip.docDimOpacity;
      delete selectedClip.clip.docFeather;
      delete selectedClip.clip.highlights;
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

    // Rolling counter properties
    if (active.anim === 'counter') {
      const cStart = document.getElementById('text-counter-start');
      const cEnd = document.getElementById('text-counter-end');
      const cDur = document.getElementById('text-counter-dur');
      const cSuffix = document.getElementById('text-counter-suffix');
      if (cStart) active.counterStart = parseFloat(cStart.value) || 0;
      if (cEnd) active.counterEnd = parseFloat(cEnd.value) || 33;
      if (cDur) active.counterDuration = parseFloat(cDur.value) || 1.5;
      if (cSuffix) active.counterSuffix = cSuffix.value !== undefined ? cSuffix.value : '%';
    }

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
  const isCounter = document.getElementById('text-anim')?.value === 'counter';
  const counterBox = document.getElementById('text-counter-controls');
  if (counterBox) counterBox.style.display = isCounter ? 'block' : 'none';

  // If user selected counter and text has a number, pre-populate
  if (isCounter) {
    const active = getActiveTextClip();
    const txt = active ? active.text : (document.getElementById('text-input')?.value || '33%');
    const match = txt.match(/^([^0-9.-]*)([0-9.,]+)(.*)$/);
    if (match) {
      const num = parseFloat(match[2].replace(/,/g, '')) || 33;
      const endEl = document.getElementById('text-counter-end');
      const suffixEl = document.getElementById('text-counter-suffix');
      if (endEl && !endEl.value) endEl.value = num;
      if (suffixEl && !suffixEl.value) suffixEl.value = match[3] || '%';
    }
  }

  updateActiveTextClip();
  recordState('Change Animation');
});

// Live update on counter input changes
['text-counter-start', 'text-counter-end', 'text-counter-dur', 'text-counter-suffix'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    updateActiveTextClip();
  });
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
    layerOrder: textLayerOrder,
    counterStart: parseFloat(document.getElementById('text-counter-start')?.value) || 0,
    counterEnd: parseFloat(document.getElementById('text-counter-end')?.value) || 33,
    counterDuration: parseFloat(document.getElementById('text-counter-dur')?.value) || 1.5,
    counterSuffix: document.getElementById('text-counter-suffix')?.value !== undefined ? document.getElementById('text-counter-suffix')?.value : '%'
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
      chart: [],
      quote: [],
      image: [],
      video: [],
      voiceover: [],
      music: [],
      background: [
        {
          id: 'clip-bg-default',
          start: 0,
          duration: 60,
          bgType: 'cyber_grid',
          bgColor: '#0a0b0e'
        }
      ]
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
  } else if (e.key === 'Escape') {
    if (activeTool !== 'select') {
      setStudioTool('select');
      isMarqueeDragging = false;
      marqueeTargetClip = null;
      showTextTimingAlert('Switched to Selection Tool', 'info');
      setTimeout(() => showTextTimingAlert(''), 1500);
    }
  } else if (!isInput && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'v') {
    setStudioTool('select');
  }
});

// ==================== WORKSPACE EXPAND & APPLE-STYLE SIDEBAR CONTROLS ====================
let isWorkspaceExpanded = false;
let isLeftSidebarOpen = true;
let isRightSidebarOpen = true;

function updateSidebarStateUI() {
  const workspace = document.querySelector('.workspace');
  if (!workspace) return;

  workspace.classList.toggle('hide-left', !isLeftSidebarOpen);
  workspace.classList.toggle('hide-right', !isRightSidebarOpen);
  workspace.classList.toggle('is-expanded', isWorkspaceExpanded);

  const btnLeft = document.getElementById('btn-toggle-left-sidebar');
  const btnRight = document.getElementById('btn-toggle-right-sidebar');
  if (btnLeft) btnLeft.classList.toggle('active', isLeftSidebarOpen && !isWorkspaceExpanded);
  if (btnRight) btnRight.classList.toggle('active', isRightSidebarOpen && !isWorkspaceExpanded);

  const btnToggleExpand = document.getElementById('tool-toggle-expand');
  const expandText = document.getElementById('expand-btn-text');
  if (btnToggleExpand) btnToggleExpand.classList.toggle('active', isWorkspaceExpanded);
  if (expandText) expandText.textContent = isWorkspaceExpanded ? 'Show Panels' : 'Expand';

  // Force canvas and track rendering to adapt to new dimensions smoothly
  setTimeout(() => {
    if (typeof resizeCanvas === 'function') resizeCanvas();
  }, 100);
}

function toggleLeftSidebar(explicitState) {
  isLeftSidebarOpen = explicitState !== undefined ? explicitState : !isLeftSidebarOpen;
  if (isWorkspaceExpanded && isLeftSidebarOpen) isWorkspaceExpanded = false;
  updateSidebarStateUI();
}

function toggleRightSidebar(explicitState) {
  isRightSidebarOpen = explicitState !== undefined ? explicitState : !isRightSidebarOpen;
  if (isWorkspaceExpanded && isRightSidebarOpen) isWorkspaceExpanded = false;
  updateSidebarStateUI();
}

// Event Listeners for Apple Sidebar Buttons
document.getElementById('btn-toggle-left-sidebar')?.addEventListener('click', () => toggleLeftSidebar());
document.getElementById('btn-collapse-left-sidebar')?.addEventListener('click', () => toggleLeftSidebar(false));

document.getElementById('btn-toggle-right-sidebar')?.addEventListener('click', () => toggleRightSidebar());
document.getElementById('btn-collapse-right-sidebar')?.addEventListener('click', () => toggleRightSidebar(false));

const btnToggleExpand = document.getElementById('tool-toggle-expand');
if (btnToggleExpand) {
  btnToggleExpand.addEventListener('click', () => {
    isWorkspaceExpanded = !isWorkspaceExpanded;
    updateSidebarStateUI();
  });
}

// macOS / Pro NLE Keyboard Shortcuts: Cmd/Ctrl + 1 (Media), Cmd/Ctrl + 2 (Inspector)
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const isCmdOrCtrl = e.metaKey || e.ctrlKey;
  if (isCmdOrCtrl && e.key === '1') {
    e.preventDefault();
    toggleLeftSidebar();
  } else if (isCmdOrCtrl && e.key === '2') {
    e.preventDefault();
    toggleRightSidebar();
  }
});

// ==================== SFX VOLUME SLIDER & PREVIEW BUTTON ====================
const sfxVolumeSlider = document.getElementById('text-sfx-volume');
const sfxVolumeVal = document.getElementById('text-sfx-vol-val');
const btnPreviewSFX = document.getElementById('btn-preview-text-sfx');

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
let transformAction = null; // 'drag', 'resize', 'doc-focus-drag', 'doc-focus-resize'
let transformStartPos = { x: 0, y: 0 };
let transformInitialClip = { x: 0, y: 0, scale: 1.0 };
let transformInitialFocusRect = null;
let transformInitialHighlights = null;
let transformInitialZoomOrigin = null;
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

    // 0. Check if click hits any interactive Document Spotlight Box & Handles
    if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
      const clip = selectedClip.clip;
      const spots = Array.isArray(clip.spotlights) && clip.spotlights.length > 0 ? clip.spotlights : (clip.docFocus && clip._docFocusBounds ? [{ _screenBounds: clip._docFocusBounds, rect: clip.docFocusRect }] : []);
      
      let hitSpotIdx = -1;
      let hitSpotAction = null;
      let hitSpotHandle = null;

      for (let s = spots.length - 1; s >= 0; s--) {
        const sp = spots[s];
        const fb = sp._screenBounds;
        if (!fb) continue;

        const handleSize = 22;
        const corners = [
          { type: 'tl', x: fb.x, y: fb.y },
          { type: 'tr', x: fb.x + fb.w, y: fb.y },
          { type: 'bl', x: fb.x, y: fb.y + fb.h },
          { type: 'br', x: fb.x + fb.w, y: fb.y + fb.h }
        ];

        for (const c of corners) {
          if (Math.abs(pt.x - c.x) <= handleSize && Math.abs(pt.y - c.y) <= handleSize) {
            hitSpotIdx = s; hitSpotAction = 'doc-focus-resize'; hitSpotHandle = c.type; break;
          }
        }
        if (hitSpotIdx >= 0) break;

        if (Math.abs(pt.x - (fb.x + fb.w)) <= 14 && pt.y >= fb.y && pt.y <= (fb.y + fb.h)) {
          hitSpotIdx = s; hitSpotAction = 'doc-focus-resize'; hitSpotHandle = 'r'; break;
        }
        if (Math.abs(pt.y - (fb.y + fb.h)) <= 14 && pt.x >= fb.x && pt.x <= (fb.x + fb.w)) {
          hitSpotIdx = s; hitSpotAction = 'doc-focus-resize'; hitSpotHandle = 'b'; break;
        }
        if (Math.abs(pt.x - fb.x) <= 14 && pt.y >= fb.y && pt.y <= (fb.y + fb.h)) {
          hitSpotIdx = s; hitSpotAction = 'doc-focus-resize'; hitSpotHandle = 'l'; break;
        }
        if (Math.abs(pt.y - fb.y) <= 14 && pt.x >= fb.x && pt.x <= (fb.x + fb.w)) {
          hitSpotIdx = s; hitSpotAction = 'doc-focus-resize'; hitSpotHandle = 't'; break;
        }

        if (pt.x >= (fb.x - 8) && pt.x <= (fb.x + fb.w + 8) && pt.y >= (fb.y - 28) && pt.y <= (fb.y + fb.h + 8)) {
          hitSpotIdx = s; hitSpotAction = 'doc-focus-drag'; hitSpotHandle = 'drag'; break;
        }
      }

      if (hitSpotIdx >= 0) {
        window._selectedSpotlightIndex = hitSpotIdx;
        const targetSpot = spots[hitSpotIdx];
        isTransforming = true;
        transformAction = hitSpotAction;
        activeResizeHandle = hitSpotHandle;
        transformStartPos = pt;
        transformInitialFocusRect = { ...(targetSpot.rect || clip.docFocusRect) };
        transformInitialHighlights = (clip.highlights || []).map(h => ({ ...h }));
        transformInitialZoomOrigin = { x: clip.zoomOriginX, y: clip.zoomOriginY };
        e.preventDefault();
        return;
      }
    }

    // 0b. Check if click hits an individual Highlight bar or its resize handles (to drag, jog, or adjust words)
    if (selectedClip && (selectedClip.trackType === 'image' || selectedClip.trackType === 'video') && selectedClip.clip.highlights && selectedClip.clip.highlights.length > 0) {
      let hitHlIdx = -1;
      let hitHlAction = null;
      let hitHlHandle = null;

      for (let i = selectedClip.clip.highlights.length - 1; i >= 0; i--) {
        const hl = selectedClip.clip.highlights[i];
        const hb = hl._screenBounds;
        if (!hb) continue;

        const hSize = 16;
        // Check resize handles: br, tl, r, l
        if (Math.abs(pt.x - (hb.x + hb.w)) <= hSize && Math.abs(pt.y - (hb.y + hb.h)) <= hSize) {
          hitHlIdx = i; hitHlAction = 'hl-resize'; hitHlHandle = 'br'; break;
        } else if (Math.abs(pt.x - hb.x) <= hSize && Math.abs(pt.y - hb.y) <= hSize) {
          hitHlIdx = i; hitHlAction = 'hl-resize'; hitHlHandle = 'tl'; break;
        } else if (Math.abs(pt.x - (hb.x + hb.w)) <= hSize && pt.y >= (hb.y - 6) && pt.y <= (hb.y + hb.h + 6)) {
          hitHlIdx = i; hitHlAction = 'hl-resize'; hitHlHandle = 'r'; break;
        } else if (Math.abs(pt.x - hb.x) <= hSize && pt.y >= (hb.y - 6) && pt.y <= (hb.y + hb.h + 6)) {
          hitHlIdx = i; hitHlAction = 'hl-resize'; hitHlHandle = 'l'; break;
        } else if (pt.x >= (hb.x - 4) && pt.x <= (hb.x + hb.w + 4) && pt.y >= (hb.y - 18) && pt.y <= (hb.y + hb.h + 4)) {
          hitHlIdx = i; hitHlAction = 'hl-drag'; hitHlHandle = 'drag'; break;
        }
      }

      if (hitHlIdx >= 0) {
        window._selectedHighlightIndex = hitHlIdx;
        isTransforming = true;
        transformAction = hitHlAction;
        activeResizeHandle = hitHlHandle;
        transformStartPos = pt;
        transformInitialClip = { ...selectedClip.clip.highlights[hitHlIdx] };
        e.preventDefault();
        return;
      }
    }

    // ==================== MOTION BLUR CROWD ENCIRCLE & LASSO TOOL ====================
    if (activeTool === 'crowd-lasso') {
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
        isCrowdLassoDrawing = true;
        crowdLassoPoints = [pt];
        window._crowdLassoTargetClip = targetMediaClip;
        e.preventDefault();
        return;
      }
    }

    // ==================== PUNCH ZOOM, LOUPE, DOC FOCUS & HIGHLIGHTER TOOLS ====================
    if (activeTool === 'snap-zoom' || activeTool === 'loupe' || activeTool === 'doc-focus' || activeTool === 'doc-highlight') {
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

    // 2. If a chart, quote or image/video clip is selected, check if click hit handles or bounding box
    if (selectedClip && (selectedClip.trackType === 'chart' || selectedClip.trackType === 'quote' || selectedClip.trackType === 'image' || selectedClip.trackType === 'video')) {
      const clip = selectedClip.clip;
      const b = clip._renderBounds;
      if (b) {
        // Generous grab tolerance in canvas coords (scaled for display zoom)
        const rect = canvas.getBoundingClientRect();
        const displayScale = Math.max(1, canvas.width / (rect.width || 1));
        const handleHitSize = Math.max(48, 18 * displayScale);

        // Check 8 handles: TL, TR, BL, BR, T, B, L, R
        const handles = [
          { type: 'tl', x: b.x, y: b.y },
          { type: 'tr', x: b.x + b.w, y: b.y },
          { type: 'bl', x: b.x, y: b.y + b.h },
          { type: 'br', x: b.x + b.w, y: b.y + b.h },
          { type: 'tc', x: b.x + b.w / 2, y: b.y },
          { type: 'bc', x: b.x + b.w / 2, y: b.y + b.h },
          { type: 'ml', x: b.x, y: b.y + b.h / 2 },
          { type: 'mr', x: b.x + b.w, y: b.y + b.h / 2 }
        ];

        for (const c of handles) {
          if (Math.abs(pt.x - c.x) <= handleHitSize && Math.abs(pt.y - c.y) <= handleHitSize) {
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
            e.stopImmediatePropagation?.();
            return;
          }
        }

        // Check if inside bounding box (plus generous padding) to drag / reposition
        const dragPadding = handleHitSize * 0.5;
        if (pt.x >= (b.x - dragPadding) && pt.x <= (b.x + b.w + dragPadding) &&
            pt.y >= (b.y - dragPadding) && pt.y <= (b.y + b.h + dragPadding)) {
          isTransforming = true;
          transformAction = 'drag';
          transformStartPos = pt;
          transformInitialClip = {
            scale: clip.scale !== undefined ? clip.scale : 1.0,
            x: clip.x || 0,
            y: clip.y || 0
          };
          e.preventDefault();
          e.stopImmediatePropagation?.();
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

    // 3b. Check if user clicked on any visible Statement / Quote Card layer to select it
    const activeQuoteClips = (timelineClips.quote || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeQuoteClips.length - 1; i >= 0; i--) {
      const q = activeQuoteClips[i];
      const b = q._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(q, 'quote');
        isTransforming = true;
        transformAction = 'drag';
        transformStartPos = pt;
        transformInitialClip = {
          scale: q.scale !== undefined ? q.scale : 1.0,
          x: q.x || 0,
          y: q.y || 0
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
        e.stopImmediatePropagation?.();
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
    const pt = getCanvasPointer(e);

    // If drawing crowd encircle lasso
    if (isCrowdLassoDrawing) {
      crowdLassoPoints.push(pt);
      return;
    }

    // If currently dragging marquee selection for zoom or loupe
    if (isMarqueeDragging) {
      marqueeCurrentPt = pt;
      return;
    }

    // Mouse hover cursor hints when over focus box or highlights
    if (!isTransforming && !isMarqueeDragging) {
      // Check hover over all spotlights
      if (selectedClip && selectedClip.clip) {
        const spots = Array.isArray(selectedClip.clip.spotlights) && selectedClip.clip.spotlights.length > 0 ? selectedClip.clip.spotlights : (selectedClip.clip.docFocus && selectedClip.clip._docFocusBounds ? [{ _screenBounds: selectedClip.clip._docFocusBounds }] : []);
        for (let s = spots.length - 1; s >= 0; s--) {
          const fb = spots[s]._screenBounds;
          if (!fb) continue;
          const corners = [
            { type: 'tl', x: fb.x, y: fb.y, cursor: 'nwse-resize' },
            { type: 'tr', x: fb.x + fb.w, y: fb.y, cursor: 'nesw-resize' },
            { type: 'bl', x: fb.x, y: fb.y + fb.h, cursor: 'nesw-resize' },
            { type: 'br', x: fb.x + fb.w, y: fb.y + fb.h, cursor: 'nwse-resize' }
          ];
          const hoverCorner = corners.find(c => Math.abs(pt.x - c.x) <= 20 && Math.abs(pt.y - c.y) <= 20);
          if (hoverCorner) {
            canvas.style.cursor = hoverCorner.cursor;
            return;
          }
          if (Math.abs(pt.x - (fb.x + fb.w)) <= 12 && pt.y >= fb.y && pt.y <= (fb.y + fb.h)) {
            canvas.style.cursor = 'ew-resize';
            return;
          }
          if (Math.abs(pt.x - fb.x) <= 12 && pt.y >= fb.y && pt.y <= (fb.y + fb.h)) {
            canvas.style.cursor = 'ew-resize';
            return;
          }
          if (Math.abs(pt.y - (fb.y + fb.h)) <= 12 && pt.x >= fb.x && pt.x <= (fb.x + fb.w)) {
            canvas.style.cursor = 'ns-resize';
            return;
          }
          if (Math.abs(pt.y - fb.y) <= 12 && pt.x >= fb.x && pt.x <= (fb.x + fb.w)) {
            canvas.style.cursor = 'ns-resize';
            return;
          }
          if (pt.x >= (fb.x - 8) && pt.x <= (fb.x + fb.w + 8) && pt.y >= (fb.y - 28) && pt.y <= (fb.y + fb.h + 8)) {
            canvas.style.cursor = 'move';
            return;
          }
        }
      }

      // Check hover over individual highlights
      if (selectedClip && selectedClip.clip && selectedClip.clip.highlights) {
        for (let i = selectedClip.clip.highlights.length - 1; i >= 0; i--) {
          const hl = selectedClip.clip.highlights[i];
          const hb = hl._screenBounds;
          if (hb && pt.x >= (hb.x - 4) && pt.x <= (hb.x + hb.w + 4) && pt.y >= (hb.y - 18) && pt.y <= (hb.y + hb.h + 4)) {
            canvas.style.cursor = 'move';
            window._hoveredHighlightIndex = i;
            return;
          }
        }
        window._hoveredHighlightIndex = undefined;
      }

      canvas.style.cursor = 'default';
    }

    if (!isTransforming || !selectedClip) return;
    const clip = selectedClip.clip;

    if (transformAction === 'hl-drag') {
      const hl = clip.highlights && window._selectedHighlightIndex !== undefined ? clip.highlights[window._selectedHighlightIndex] : null;
      if (hl && transformInitialClip) {
        const pScale = hl._screenBounds?.punchScale || 1.0;
        const b = clip._renderBounds;
        const fw = (b ? b.w : canvas.width) * pScale;
        const fh = (b ? b.h : canvas.height) * pScale;
        const dx = (pt.x - transformStartPos.x) / Math.max(1, fw);
        const dy = (pt.y - transformStartPos.y) / Math.max(1, fh);
        hl.x = Math.max(0.01, Math.min(0.98 - hl.w, transformInitialClip.x + dx));
        hl.y = Math.max(0.01, Math.min(0.98 - hl.h, transformInitialClip.y + dy));
      }
    } else if (transformAction === 'hl-resize') {
      const hl = clip.highlights && window._selectedHighlightIndex !== undefined ? clip.highlights[window._selectedHighlightIndex] : null;
      if (hl && transformInitialClip) {
        const pScale = hl._screenBounds?.punchScale || 1.0;
        const b = clip._renderBounds;
        const fw = (b ? b.w : canvas.width) * pScale;
        const fh = (b ? b.h : canvas.height) * pScale;
        const dx = (pt.x - transformStartPos.x) / Math.max(1, fw);
        const dy = (pt.y - transformStartPos.y) / Math.max(1, fh);
        const init = transformInitialClip;
        if (activeResizeHandle === 'r' || activeResizeHandle === 'br') {
          hl.w = Math.max(0.015, Math.min(1.0 - init.x, init.w + dx));
          if (activeResizeHandle === 'br') hl.h = Math.max(0.01, Math.min(1.0 - init.y, init.h + dy));
        } else if (activeResizeHandle === 'l' || activeResizeHandle === 'tl') {
          hl.x = Math.max(0.01, Math.min(init.x + init.w - 0.015, init.x + dx));
          hl.w = Math.max(0.015, init.w - dx);
          if (activeResizeHandle === 'tl') {
            hl.y = Math.max(0.01, Math.min(init.y + init.h - 0.01, init.y + dy));
            hl.h = Math.max(0.01, init.h - dy);
          }
        }
      }
    } else if (transformAction === 'doc-focus-drag') {
      const dx = pt.x - transformStartPos.x;
      const dy = pt.y - transformStartPos.y;
      const pScale = clip._docFocusBounds?.punchScale || 1.0;
      const fw = (clip._docFocusBounds ? clip._docFocusBounds.finalW : canvas.width) * pScale;
      const fh = (clip._docFocusBounds ? clip._docFocusBounds.finalH : canvas.height) * pScale;
      const deltaNormX = dx / Math.max(1, fw);
      const deltaNormY = dy / Math.max(1, fh);

      const targetSpot = (Array.isArray(clip.spotlights) && window._selectedSpotlightIndex !== undefined) ? clip.spotlights[window._selectedSpotlightIndex] : null;
      const rectObj = targetSpot ? targetSpot.rect : clip.docFocusRect;

      if (rectObj && transformInitialFocusRect) {
        rectObj.x = Math.max(0.01, Math.min(0.98 - rectObj.w, transformInitialFocusRect.x + deltaNormX));
        rectObj.y = Math.max(0.01, Math.min(0.98 - rectObj.h, transformInitialFocusRect.y + deltaNormY));
        if (targetSpot) clip.docFocusRect = targetSpot.rect;
      }
      // Move all linked animated highlights together with the focus box!
      if (clip.highlights && transformInitialHighlights) {
        clip.highlights.forEach((h, idx) => {
          const initH = transformInitialHighlights[idx];
          if (initH) {
            h.x = Math.max(0.01, Math.min(0.98, initH.x + deltaNormX));
            h.y = Math.max(0.01, Math.min(0.98, initH.y + deltaNormY));
          }
        });
      }
      // Also shift zoom center to follow the dragged focus box
      if (clip.zoomOriginX !== undefined && transformInitialZoomOrigin && transformInitialZoomOrigin.x !== undefined) {
        clip.zoomOriginX = Math.max(0.05, Math.min(0.95, transformInitialZoomOrigin.x + deltaNormX));
        clip.zoomOriginY = Math.max(0.05, Math.min(0.95, transformInitialZoomOrigin.y + deltaNormY));
      }
    } else if (transformAction === 'doc-focus-resize') {
      const dx = pt.x - transformStartPos.x;
      const dy = pt.y - transformStartPos.y;
      const pScale = clip._docFocusBounds?.punchScale || 1.0;
      const fw = (clip._docFocusBounds ? clip._docFocusBounds.finalW : canvas.width) * pScale;
      const fh = (clip._docFocusBounds ? clip._docFocusBounds.finalH : canvas.height) * pScale;
      const deltaNormX = dx / Math.max(1, fw);
      const deltaNormY = dy / Math.max(1, fh);
      const init = transformInitialFocusRect;

      const targetSpot = (Array.isArray(clip.spotlights) && window._selectedSpotlightIndex !== undefined) ? clip.spotlights[window._selectedSpotlightIndex] : null;
      const rectObj = targetSpot ? targetSpot.rect : clip.docFocusRect;

      if (rectObj && init) {
        if (activeResizeHandle === 'br') {
          rectObj.w = Math.max(0.04, Math.min(1.0 - init.x, init.w + deltaNormX));
          rectObj.h = Math.max(0.02, Math.min(1.0 - init.y, init.h + deltaNormY));
        } else if (activeResizeHandle === 'tr') {
          rectObj.y = Math.max(0.01, Math.min(init.y + init.h - 0.02, init.y + deltaNormY));
          rectObj.h = Math.max(0.02, init.h - deltaNormY);
          rectObj.w = Math.max(0.04, Math.min(1.0 - init.x, init.w + deltaNormX));
        } else if (activeResizeHandle === 'bl') {
          rectObj.x = Math.max(0.01, Math.min(init.x + init.w - 0.04, init.x + deltaNormX));
          rectObj.w = Math.max(0.04, init.w - deltaNormX);
          rectObj.h = Math.max(0.02, Math.min(1.0 - init.y, init.h + deltaNormY));
        } else if (activeResizeHandle === 'tl') {
          rectObj.x = Math.max(0.01, Math.min(init.x + init.w - 0.04, init.x + deltaNormX));
          rectObj.y = Math.max(0.01, Math.min(init.y + init.h - 0.02, init.y + deltaNormY));
          rectObj.w = Math.max(0.04, init.w - deltaNormX);
          rectObj.h = Math.max(0.02, init.h - deltaNormY);
        } else if (activeResizeHandle === 'r') {
          rectObj.w = Math.max(0.04, Math.min(1.0 - init.x, init.w + deltaNormX));
        } else if (activeResizeHandle === 'b') {
          rectObj.h = Math.max(0.02, Math.min(1.0 - init.y, init.h + deltaNormY));
        } else if (activeResizeHandle === 'l') {
          rectObj.x = Math.max(0.01, Math.min(init.x + init.w - 0.04, init.x + deltaNormX));
          rectObj.w = Math.max(0.04, init.w - deltaNormX);
        } else if (activeResizeHandle === 't') {
          rectObj.y = Math.max(0.01, Math.min(init.y + init.h - 0.02, init.y + deltaNormY));
          rectObj.h = Math.max(0.02, init.h - deltaNormY);
        }
        if (targetSpot) clip.docFocusRect = targetSpot.rect;
      }
    } else if (selectedClip.trackType === 'text') {
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
        let delta = 0;
        if (activeResizeHandle === 'br') {
          delta = (dx + dy) / 2;
        } else if (activeResizeHandle === 'tl') {
          delta = (-dx - dy) / 2;
        } else if (activeResizeHandle === 'tr') {
          delta = (dx - dy) / 2;
        } else if (activeResizeHandle === 'bl') {
          delta = (-dx + dy) / 2;
        } else if (activeResizeHandle === 'mr') {
          delta = dx;
        } else if (activeResizeHandle === 'ml') {
          delta = -dx;
        } else if (activeResizeHandle === 'bc') {
          delta = dy;
        } else if (activeResizeHandle === 'tc') {
          delta = -dy;
        } else {
          delta = Math.max(Math.abs(dx), Math.abs(dy)) * (dx > 0 || dy > 0 ? 1 : -1);
        }
        const scaleDelta = (delta / 400);
        clip.scale = Math.max(0.2, Math.min(3.5, transformInitialClip.scale + scaleDelta));
        const miniSub = document.getElementById('inspector-clip-sub');
        if (miniSub) miniSub.textContent = `Image • ${(clip.scale * 100).toFixed(0)}% zoom • Drag on canvas to edit`;
      }
    }
  });

  window.addEventListener('mouseup', (e) => {
    // Finish Motion Blur Crowd Encircle Lasso
    if (isCrowdLassoDrawing && window._crowdLassoTargetClip) {
      isCrowdLassoDrawing = false;
      const targetClip = window._crowdLassoTargetClip;
      const b = targetClip._renderBounds;
      if (b && crowdLassoPoints.length >= 4) {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        crowdLassoPoints.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });

        const lassoWidth = maxX - minX;
        const lassoHeight = maxY - minY;
        if (lassoWidth > 18 || lassoHeight > 18) {
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          const normX = Math.max(0.02, Math.min(0.98, (centerX - b.x) / b.w));
          const normY = Math.max(0.02, Math.min(0.98, (centerY - b.y) / b.h));
          const normRx = (lassoWidth / 2) / b.w;
          const normRy = (lassoHeight / 2) / b.h;

          // Normalized contour points for custom lasso shape
          const contour = crowdLassoPoints.filter((_, i) => i % 3 === 0).map(p => ({
            x: (p.x - b.x) / b.w,
            y: (p.y - b.y) / b.h
          }));

          if (!targetClip.crowdWaypoints) targetClip.crowdWaypoints = [];
          const wpIdx = targetClip.crowdWaypoints.length + 1;
          const isWide = targetClip.crowdZoomMode === 'wide';
          const defaultZoom = isWide ? 1.08 : 1.32;

          targetClip.crowdWaypoints.push({
            id: `wp-${Date.now()}-${wpIdx}`,
            number: wpIdx,
            x: normX,
            y: normY,
            radiusX: normRx,
            radiusY: normRy,
            contour: contour,
            zoomScale: defaultZoom
          });

          targetClip.motionBlurCrowd = true;
          playSFX('camera_click');
          renderAllTimelineTracks();
          recordState(`Encircled Crowd Person #${wpIdx}`);
          showTextTimingAlert(`Person #${wpIdx} circled and numbered!`, 'success');
          setTimeout(() => showTextTimingAlert(''), 2500);
        }
      }
      crowdLassoPoints = [];
      window._crowdLassoTargetClip = null;
      return;
    }

    if (transformAction === 'hl-drag' || transformAction === 'hl-resize') {
      recordState('Adjust Highlight Box');
      isTransforming = false;
      transformAction = null;
      return;
    }
    if (transformAction === 'doc-focus-drag' || transformAction === 'doc-focus-resize') {
      recordState('Adjust Focus Box & Highlights');
      isTransforming = false;
      transformAction = null;
      return;
    }
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

        // Account for active camera punch zoom so coordinates land accurately on underlying text
        const punch = getClipPunchZoom(marqueeTargetClip, currentTime, b.x, b.y, b.w, b.h);
        const pScale = punch.scale;
        const localX1 = pScale > 1.001 ? punch.originX + (x1 - punch.originX) / pScale : x1;
        const localY1 = pScale > 1.001 ? punch.originY + (y1 - punch.originY) / pScale : y1;
        const localX2 = pScale > 1.001 ? punch.originX + (x2 - punch.originX) / pScale : x2;
        const localY2 = pScale > 1.001 ? punch.originY + (y2 - punch.originY) / pScale : y2;

        const selLeft = Math.min(localX1, localX2);
        const selTop = Math.min(localY1, localY2);
        const selW = Math.max(20, Math.abs(localX2 - localX1));
        const selH = Math.max(12, Math.abs(localY2 - localY1));

        if (activeTool === 'doc-focus') {
          // USER SELECTED ARTICLE FOCUS (DIM SURROUNDINGS & SPOTLIGHT TARGET)
          const normX = Math.max(0.01, Math.min(0.95, (selLeft - b.x) / b.w));
          const normY = Math.max(0.01, Math.min(0.95, (selTop - b.y) / b.h));
          const normW = Math.min(1.0 - normX, Math.max(0.05, selW / b.w));
          const normH = Math.min(1.0 - normY, Math.max(0.04, selH / b.h));

          const chosenStyle = window._activeDocStyle || (marqueeTargetClip.docStyle || 'dark');
          const relTime = Math.max(0, currentTime - marqueeTargetClip.start);

          if (!Array.isArray(marqueeTargetClip.spotlights)) {
            marqueeTargetClip.spotlights = [];
            if (marqueeTargetClip.docFocus && marqueeTargetClip.docFocusRect) {
              marqueeTargetClip.spotlights.push({
                rect: marqueeTargetClip.docFocusRect,
                style: marqueeTargetClip.docStyle || 'dark',
                dimOpacity: marqueeTargetClip.docDimOpacity !== undefined ? marqueeTargetClip.docDimOpacity : 0.65,
                feather: marqueeTargetClip.docFeather !== undefined ? marqueeTargetClip.docFeather : 16,
                startTime: marqueeTargetClip.docFocusStartTime !== undefined ? marqueeTargetClip.docFocusStartTime : 0.4,
                duration: marqueeTargetClip.docFocusDuration || 2.5
              });
            }
          }

          const newSpot = {
            rect: { x: normX, y: normY, w: normW, h: normH },
            style: chosenStyle,
            dimOpacity: marqueeTargetClip.docDimOpacity !== undefined ? marqueeTargetClip.docDimOpacity : 0.65,
            feather: chosenStyle === 'white' ? 18 : 16,
            startTime: parseFloat(relTime.toFixed(1)),
            duration: marqueeTargetClip.docFocusDuration || 2.5
          };
          marqueeTargetClip.spotlights.push(newSpot);

          marqueeTargetClip.docStyle = chosenStyle;
          marqueeTargetClip.docFocus = true;
          marqueeTargetClip.docFocusRect = { x: normX, y: normY, w: normW, h: normH };
          if (marqueeTargetClip.docDimOpacity === undefined) marqueeTargetClip.docDimOpacity = 0.65;
          if (marqueeTargetClip.docFeather === undefined) marqueeTargetClip.docFeather = chosenStyle === 'white' ? 18 : 16;
          
          marqueeTargetClip.zoomEffect = 'snap';
          marqueeTargetClip.zoomOriginX = normX + normW / 2;
          marqueeTargetClip.zoomOriginY = normY + normH / 2;
          const scaleFactorX = b.w / selW;
          const scaleFactorY = b.h / selH;
          const optimalScale = Math.min(2.8, Math.max(1.3, Math.min(scaleFactorX, scaleFactorY) * 0.85));
          marqueeTargetClip.zoomScale = parseFloat(optimalScale.toFixed(1));
          
          marqueeTargetClip.zoomStartTime = parseFloat(relTime.toFixed(1));
          marqueeTargetClip.docFocusStartTime = parseFloat(relTime.toFixed(1));

          playSFX('snap_zoom');
          const trackType = timelineClips.image.includes(marqueeTargetClip) ? 'image' : 'video';
          selectClip(marqueeTargetClip, trackType);
          recordState(`Add Spotlight #${marqueeTargetClip.spotlights.length}`);
          showTextTimingAlert(`Added Spotlight #${marqueeTargetClip.spotlights.length}! Drag on canvas anytime to adjust.`, 'success');
          setTimeout(() => showTextTimingAlert(''), 3000);
          setStudioTool('select');
        } else if (activeTool === 'doc-highlight') {
          // USER HIGHLIGHTED A LINE OR SENTENCE (ANIMATED LIVE SWEEP)
          const normX = Math.max(0.01, Math.min(0.95, (selLeft - b.x) / b.w));
          const normY = Math.max(0.01, Math.min(0.95, (selTop - b.y) / b.h));
          const normW = Math.min(1.0 - normX, Math.max(0.015, selW / b.w));
          const normH = Math.min(1.0 - normY, Math.max(0.01, selH / b.h));

          if (!marqueeTargetClip.highlights) marqueeTargetClip.highlights = [];
          const relTime = Math.max(0, currentTime - marqueeTargetClip.start);
          let hlColor = document.getElementById('inspector-doc-hl-color')?.value || '#ffff00';
          if (hlColor.toLowerCase() === '#facc15' || hlColor.toLowerCase() === '#ffe600') hlColor = '#ffff00';
          const sweepSpeedInput = document.getElementById('inspector-doc-speed');
          const speedSec = sweepSpeedInput ? (parseInt(sweepSpeedInput.value) / 10) : 0.6;

          // Stagger subsequent lines seamlessly so each line draws right after the previous
          const prevHl = marqueeTargetClip.highlights[marqueeTargetClip.highlights.length - 1];
          let startSec = parseFloat((relTime + 0.05).toFixed(2));
          if (prevHl && (startSec < (prevHl.startTime + prevHl.duration))) {
            startSec = parseFloat((prevHl.startTime + prevHl.duration * 0.75).toFixed(2));
          }

          marqueeTargetClip.highlights.push({
            x: normX,
            y: normY,
            w: normW,
            h: normH,
            color: hlColor,
            opacity: 0.95,
            startTime: startSec,
            duration: speedSec
          });

          playSFX('pop');
          const trackType = timelineClips.image.includes(marqueeTargetClip) ? 'image' : 'video';
          selectClip(marqueeTargetClip, trackType);
          recordState('Add Animated Text Highlight Bar');
          showTextTimingAlert(`Added animated highlight sweep (${marqueeTargetClip.highlights.length} total)`, 'success');
          setTimeout(() => showTextTimingAlert(''), 2500);
          setStudioTool('select');
        } else {
          // PUNCH ZOOM OR LOUPE
          const effectType = activeTool === 'snap-zoom' ? 'snap' : 'loupe';
          marqueeTargetClip.zoomEffect = effectType;

          if (dragDist > 16) {
            // USER DRAGGED A CUSTOM AREA / RECTANGLE
            const selCenterCanvasX = selLeft + selW / 2;
            const selCenterCanvasY = selTop + selH / 2;
            const selWidth = selW;
            const selHeight = selH;

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
          setStudioTool('select');
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
      return;
    }

    // 2b. Check if clicked directly on an active quote card
    const activeQuoteClips = (timelineClips.quote || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeQuoteClips.length - 1; i >= 0; i--) {
      const q = activeQuoteClips[i];
      const b = q._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(q, 'quote');
        return;
      }
    }

    // Single-Tap on canvas: Toggle hide/show of Motion Blur Crowd circled waypoints & dock toolbar!
    const activeMediaWithCrowd = [...timelineClips.image, ...timelineClips.video].find(c =>
      currentTime >= c.start && currentTime <= (c.start + c.duration) && c.motionBlurCrowd
    );
    if (activeMediaWithCrowd) {
      crowdOverlaysHidden = !crowdOverlaysHidden;
      const dock = document.getElementById('canvas-crowd-dock');
      if (dock) {
        dock.style.display = crowdOverlaysHidden ? 'none' : 'flex';
      }
      const lbl = document.getElementById('lbl-crowd-toggle-hud');
      if (lbl) {
        lbl.textContent = crowdOverlaysHidden ? 'Show (1-Tap)' : 'Hide (1-Tap)';
      }
      showTextTimingAlert(crowdOverlaysHidden ? 'Overlays Hidden (Tap to show)' : 'Overlays Visible', 'info');
      setTimeout(() => showTextTimingAlert(''), 2000);
      return;
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

    // 2b. Check if clicked on active quote card
    const activeQuoteClips = (timelineClips.quote || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    for (let i = activeQuoteClips.length - 1; i >= 0; i--) {
      const q = activeQuoteClips[i];
      const b = q._renderBounds;
      if (b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h)) {
        selectClip(q, 'quote');
        showStudioContextMenu(e.clientX, e.clientY, q, 'quote');
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

    // 4. Fallback: If a clip is selected, open menu for it
    if (selectedClip && selectedClip.clip) {
      showStudioContextMenu(e.clientX, e.clientY, selectedClip.clip, selectedClip.trackType);
      return;
    }

    // 5. Canvas Stage Background / Blank Screen Context Menu (When clicked on empty canvas)
    showCanvasBackgroundContextMenu(e.clientX, e.clientY);
  });

  // Keyboard shortcut listener for selected highlight (Jogging / Nudging with arrows, Delete/Backspace to remove)
  window.addEventListener('keydown', (e) => {
    if (window._selectedHighlightIndex === undefined || window._selectedHighlightIndex === null) return;
    if (!selectedClip || !selectedClip.clip || !selectedClip.clip.highlights) return;
    const hl = selectedClip.clip.highlights[window._selectedHighlightIndex];
    if (!hl) return;

    // Do not trigger if typing in an input or textarea
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) return;

    const step = e.shiftKey ? 0.01 : 0.002;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      hl.x = Math.max(0, hl.x - step);
      recordState('Nudge Highlight Left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      hl.x = Math.min(1 - hl.w, hl.x + step);
      recordState('Nudge Highlight Right');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      hl.y = Math.max(0, hl.y - step);
      recordState('Nudge Highlight Up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hl.y = Math.min(1 - hl.h, hl.y + step);
      recordState('Nudge Highlight Down');
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      selectedClip.clip.highlights.splice(window._selectedHighlightIndex, 1);
      window._selectedHighlightIndex = undefined;
      recordState('Delete Highlight');
      showTextTimingAlert('Highlight deleted', 'info');
      setTimeout(() => showTextTimingAlert(''), 2000);
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
const btnAppFullscreen = document.getElementById('btn-app-fullscreen');

// 1. Stage Preview Fullscreen (Center monitor only)
function toggleCanvasFullscreen() {
  if (!canvasWrapper) return;

  if (document.fullscreenElement === canvasWrapper) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  } else if (canvasWrapper.classList.contains('is-immersive-fallback')) {
    canvasWrapper.classList.remove('is-immersive-fallback');
    updateFullscreenIcon(false);
  } else {
    // If another element (or entire doc) is in fullscreen, exit it first
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    // Request standard Fullscreen API specifically on the canvas viewport
    if (canvasWrapper.requestFullscreen) {
      canvasWrapper.requestFullscreen().catch(() => {
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

// 2. Entire Workspace Fullscreen (Whole application)
function toggleAppFullscreen() {
  const rootEl = document.documentElement;
  if (document.fullscreenElement === rootEl || (document.fullscreenElement && document.fullscreenElement !== canvasWrapper)) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if (rootEl.requestFullscreen) {
      rootEl.requestFullscreen().catch(() => {});
    } else if (rootEl.webkitRequestFullscreen) {
      rootEl.webkitRequestFullscreen();
    }
  }
}

function updateFullscreenIcon(isFullscreen) {
  const icon = document.getElementById('fullscreen-icon');
  if (icon) {
    if (isFullscreen) {
      icon.innerHTML = `<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>`;
    } else {
      icon.innerHTML = `<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>`;
    }
  }

  const appIcon = document.getElementById('app-fullscreen-icon');
  const isAppFs = document.fullscreenElement === document.documentElement;
  if (appIcon) {
    if (isAppFs) {
      appIcon.innerHTML = `<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>`;
    } else {
      appIcon.innerHTML = `<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>`;
    }
  }

  if (typeof updateAppleFullscreenHud === 'function') {
    updateAppleFullscreenHud();
  }
}

document.addEventListener('fullscreenchange', () => {
  const isFs = document.fullscreenElement === canvasWrapper;
  updateFullscreenIcon(isFs);
});

btnCanvasFullscreen?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCanvasFullscreen();
});

btnAppFullscreen?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleAppFullscreen();
});

// Double click specifically on the canvas viewport: enter STAGE fullscreen
let lastCanvasTouchTime = 0;
canvas?.addEventListener('click', (e) => {
  const now = Date.now();
  if (now - lastCanvasTouchTime < 350) {
    // If double clicking directly on an active text or chart element, let their dedicated editors handle it
    const pt = getCanvasPointer(e);
    const activeChartClips = (timelineClips.chart || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    const hitChart = activeChartClips.some(c => {
      const b = c._renderBounds;
      return b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h);
    });
    const activeTexts = (timelineClips.text || []).filter(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    const hitText = activeTexts.some(c => {
      const b = c._renderBounds;
      return b && pt.x >= b.x && pt.x <= (b.x + b.w) && pt.y >= b.y && pt.y <= (b.y + b.h);
    });

    if (!hitChart && !hitText) {
      toggleCanvasFullscreen();
    }
    lastCanvasTouchTime = 0;
  } else {
    lastCanvasTouchTime = now;
  }
});

// Double click anywhere outside the center canvas (e.g. top-nav, timeline background, blank space): Fullscreen ENTIRE APP
let lastAppTouchTime = 0;
document.addEventListener('click', (e) => {
  // If clicked inside interactive controls, canvas monitor itself, inputs, modals, or buttons, ignore
  if (e.target.closest('canvas') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('.vector-export-modal') || e.target.closest('.timeline-clip') || e.target.closest('.clip')) {
    return;
  }

  const now = Date.now();
  if (now - lastAppTouchTime < 350) {
    toggleAppFullscreen();
    lastAppTouchTime = 0;
  } else {
    lastAppTouchTime = now;
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
    if (popoverTitle) popoverTitle.textContent = 'Regaarder Studio';
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
      zoomDuration: c.zoomDuration,
      zoomEasing: c.zoomEasing,
      highlights: c.highlights ? JSON.parse(JSON.stringify(c.highlights)) : undefined,
      spotlights: c.spotlights ? JSON.parse(JSON.stringify(c.spotlights)) : undefined,
      docSweepSpeed: c.docSweepSpeed,
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
      transition: c.transition,
      transitionSfx: c.transitionSfx,
      transitionDuration: c.transitionDuration,
      transitionDirection: c.transitionDirection,
      transitionAngle: c.transitionAngle,
      transitionMode: c.transitionMode,
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
    quote: (timelineClips.quote || []).map(c => ({
      ...c,
      avatarFile: c.avatarFile ? { name: c.avatarFile.name, url: c.avatarFile.url } : null,
      bgImageFile: c.bgImageFile ? { name: c.bgImageFile.name, url: c.bgImageFile.url } : null
    })),
    image: serializeMediaClips(timelineClips.image || []),
    video: serializeMediaClips(timelineClips.video || []),
    voiceover: serializeMediaClips(timelineClips.voiceover || []),
    music: serializeMediaClips(timelineClips.music || []),
    background: (timelineClips.background || []).map(c => ({ ...c })),
    currentTime,
    duration,
    savedAt: Date.now()
  };
}

function saveProjectState(showConfirm = false) {
  try {
    const state = getSerializableClips();
    const projName = getCurrentProjectName();
    state.projectName = projName;
    if (_currentProjectId) {
      state.projectId = _currentProjectId;
      try { localStorage.setItem('magnates_active_project_id', _currentProjectId); } catch(e) {}
    }
    try { localStorage.setItem('magnates_active_project_name', projName); } catch(e) {}
    localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(state));

    // Also sync and persist to the "Saved Projects" list in the Projects tab
    if (typeof saveCurrentProjectToLibrary === 'function') {
      saveCurrentProjectToLibrary(projName, false);
    }

    // Persist to backend server so reload never serves stale state
    try {
      fetch('/api/project/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      }).catch(() => {});
    } catch(err) {}

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
      showTextTimingAlert?.(`Project "${projName}" saved to My Projects!`, 'success');
      setTimeout(() => showTextTimingAlert?.(''), 2000);
    }
  } catch(e) {}
}

function applyProjectState(state) {
  if (!state) return;
  // Restore text clips
  if (state.text && Array.isArray(state.text)) {
    timelineClips.text = state.text;
  }
  // Restore media, chart and quote clips directly
  ['chart', 'quote', 'image', 'video', 'voiceover', 'music'].forEach(trackType => {
    if (state[trackType] && Array.isArray(state[trackType])) {
      timelineClips[trackType] = state[trackType];
    }
  });
  if (state.background && Array.isArray(state.background)) {
    timelineClips.background = state.background;
  }
  if (typeof state.duration === 'number') {
    duration = state.duration;
    const durBadge = document.getElementById('duration-badge');
    if (durBadge) durBadge.textContent = `00:00 / ${formatTime(duration)}`;
  }

  // Restore voiceover audio element if present
  if (timelineClips.voiceover && timelineClips.voiceover.length > 0) {
    const voClip = timelineClips.voiceover[0];
    if (voClip?.file?.url) {
      audioPlayer.src = voClip.file.url;
      audioPlayer.load();
    }
  }

  // Restore project name & project ID
  const savedName = state.projectName || localStorage.getItem('magnates_active_project_name');
  if (savedName) {
    const nameEl = document.getElementById('current-project');
    if (nameEl) nameEl.textContent = savedName;
  }
  if (state.projectId) {
    _currentProjectId = state.projectId;
  } else {
    const savedId = localStorage.getItem('magnates_active_project_id');
    if (savedId) _currentProjectId = savedId;
  }

  renderAllTimelineTracks();
  if (timelineClips.text.length > 0) {
    selectClip(timelineClips.text[0], 'text');
  }
}

async function loadProjectState() {
  try {
    const rawLocal = localStorage.getItem(STORAGE_KEY_PROJECT);
    let localState = null;
    if (rawLocal) {
      try { localState = JSON.parse(rawLocal); } catch(e) {}
    }

    // 1. Check if backend has a project state
    try {
      const res = await fetch('/api/project/state');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          // Compare savedAt timestamps to never let an older backend file overwrite newer user edits
          const backendTime = data.state.savedAt || 0;
          const localTime = localState?.savedAt || 0;
          if (localState && localTime > backendTime) {
            applyProjectState(localState);
            // Push newer local state to backend
            fetch('/api/project/state', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(localState)
            }).catch(() => {});
            return;
          }
          applyProjectState(data.state);
          localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(data.state));
          return;
        }
      }
    } catch(err) {
      console.warn('Backend project state fetch failed, falling back to localStorage', err);
    }

    // 2. Fallback to localStorage
    if (localState) {
      applyProjectState(localState);
    }
  } catch(e) {}
}

// Manual save button - saves state and guarantees presence in Saved Projects
document.getElementById('btn-save-project')?.addEventListener('click', () => {
  saveProjectState(true);
});

// Periodic auto-save every 3 seconds
setInterval(() => saveProjectState(false), 3000);

// ==================== APPLE-GRADE EXPORT STUDIO ENGINE & MODAL ====================
let isExporting = false;
let exportRecorder = null;
let exportChunks = [];
let exportCancelRequested = false;

const exportStudioConfig = {
  aspectRatio: '16:9',
  resolution: 1080,
  fps: 30,
  bitrate: 15,
  format: 'mp4'
};

function getTimelineMaxEndTime() {
  let maxTime = 5;
  Object.keys(timelineClips).forEach(k => {
    (timelineClips[k] || []).forEach(c => {
      maxTime = Math.max(maxTime, c.start + c.duration);
    });
  });
  return maxTime;
}

function getExportDimensions(ratio, res) {
  res = parseInt(res, 10) || 1080;
  if (ratio === '16:9') {
    if (res === 720) return { width: 1280, height: 720 };
    if (res === 1080) return { width: 1920, height: 1080 };
    if (res === 1440) return { width: 2560, height: 1440 };
    if (res === 2160) return { width: 3840, height: 2160 };
    return { width: 1920, height: 1080 };
  } else if (ratio === '9:16') {
    if (res === 720) return { width: 720, height: 1280 };
    if (res === 1080) return { width: 1080, height: 1920 };
    if (res === 1440) return { width: 1440, height: 2560 };
    if (res === 2160) return { width: 2160, height: 3840 };
    return { width: 1080, height: 1920 };
  } else if (ratio === '1:1') {
    if (res === 720) return { width: 720, height: 720 };
    if (res === 1080) return { width: 1080, height: 1080 };
    if (res === 1440) return { width: 1440, height: 1440 };
    if (res === 2160) return { width: 2160, height: 2160 };
    return { width: 1080, height: 1080 };
  }
  return { width: 1920, height: 1080 };
}

function updateExportTelemetry() {
  const { width, height } = getExportDimensions(exportStudioConfig.aspectRatio, exportStudioConfig.resolution);
  const dimEl = document.getElementById('summary-dim');
  if (dimEl) dimEl.textContent = `${width} × ${height}`;

  const totalDur = Math.min(duration || 30, Math.max(3, getTimelineMaxEndTime()));
  const durEl = document.getElementById('summary-dur');
  if (durEl) durEl.textContent = formatTime(totalDur);

  // Bitrate to MB: (Mbps * 1000000 / 8 * seconds) / (1024 * 1024)
  const estMB = ((exportStudioConfig.bitrate * 1000000 / 8) * totalDur) / (1024 * 1024);
  const sizeEl = document.getElementById('summary-size');
  if (sizeEl) sizeEl.textContent = `~${estMB.toFixed(1)} MB`;

  const readoutEl = document.getElementById('export-bitrate-readout');
  if (readoutEl) {
    let qualityTier = 'Standard';
    if (exportStudioConfig.bitrate <= 8) qualityTier = 'Draft';
    else if (exportStudioConfig.bitrate <= 16) qualityTier = 'High Quality';
    else if (exportStudioConfig.bitrate <= 35) qualityTier = 'Pro Master';
    else qualityTier = '4K UHD Ultra';
    readoutEl.textContent = `${exportStudioConfig.bitrate} Mbps (${qualityTier})`;
  }
}

function openExportStudioModal(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const modal = document.getElementById('export-studio-modal');
  if (!modal) {
    console.error('export-studio-modal not found');
    return;
  }
  modal.style.display = 'flex';
  modal.style.zIndex = '999999';
  try {
    updateExportTelemetry();
  } catch(err) {
    console.warn('Telemetry update error:', err);
  }
}

function closeExportStudioModal() {
  const modal = document.getElementById('export-studio-modal');
  if (!modal) return;
  modal.style.display = 'none';
  const progressBox = document.getElementById('export-progress-container');
  if (progressBox) progressBox.style.display = 'none';
  const btnStart = document.getElementById('btn-export-start');
  if (btnStart) {
    btnStart.disabled = false;
    btnStart.innerHTML = `
      <svg viewBox="0 0 24 24" class="render-icon"><path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"/></svg>
      <span>Start Export</span>
    `;
  }
}

// Wire Modal Interactive Controls
function initExportStudioUI() {
  // Open / Close
  document.getElementById('btn-export')?.addEventListener('click', openExportStudioModal);
  document.getElementById('btn-export-close')?.addEventListener('click', () => {
    if (isExporting) exportCancelRequested = true;
    closeExportStudioModal();
  });
  document.getElementById('btn-export-modal-cancel')?.addEventListener('click', () => {
    if (isExporting) exportCancelRequested = true;
    closeExportStudioModal();
  });

  // Aspect Ratio Cards
  document.querySelectorAll('.export-card-option').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.export-card-option').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      exportStudioConfig.aspectRatio = card.dataset.ratio || '16:9';
      updateExportTelemetry();
    });
  });

  // Resolution Chips
  document.querySelectorAll('#export-resolution-chips .export-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#export-resolution-chips .export-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      exportStudioConfig.resolution = parseInt(chip.dataset.res, 10) || 1080;
      updateExportTelemetry();
    });
  });

  // Framerate Chips
  document.querySelectorAll('#export-fps-chips .export-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#export-fps-chips .export-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      exportStudioConfig.fps = parseInt(chip.dataset.fps, 10) || 30;
      updateExportTelemetry();
    });
  });

  // Bitrate Slider & Presets
  const slider = document.getElementById('export-bitrate-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      exportStudioConfig.bitrate = parseInt(e.target.value, 10);
      document.querySelectorAll('.btn-micro-preset').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.bitrate, 10) === exportStudioConfig.bitrate);
      });
      updateExportTelemetry();
    });
  }

  document.querySelectorAll('.btn-micro-preset').forEach(preset => {
    preset.addEventListener('click', () => {
      document.querySelectorAll('.btn-micro-preset').forEach(p => p.classList.remove('active'));
      preset.classList.add('active');
      const val = parseInt(preset.dataset.bitrate, 10);
      exportStudioConfig.bitrate = val;
      if (slider) slider.value = val;
      updateExportTelemetry();
    });
  });

  // Format Pills
  const pillMp4 = document.getElementById('lbl-format-mp4');
  const pillWebm = document.getElementById('lbl-format-webm');
  pillMp4?.addEventListener('click', () => {
    pillMp4.classList.add('active');
    pillWebm?.classList.remove('active');
    exportStudioConfig.format = 'mp4';
  });
  pillWebm?.addEventListener('click', () => {
    pillWebm.classList.add('active');
    pillMp4?.classList.remove('active');
    exportStudioConfig.format = 'webm';
  });

  // Start Export Trigger
  document.getElementById('btn-export-start')?.addEventListener('click', startStudioExport);
}

// Master Render Pipeline with FFmpeg Hardware Transcode
async function startStudioExport() {
  if (isExporting) return;

  const btnStart = document.getElementById('btn-export-start');
  const progressBox = document.getElementById('export-progress-container');
  const statusEl = document.getElementById('export-progress-status');
  const pctEl = document.getElementById('export-progress-pct');
  const barEl = document.getElementById('export-progress-bar');
  const elapsedEl = document.getElementById('export-time-elapsed');
  const etaEl = document.getElementById('export-time-eta');

  isExporting = true;
  exportCancelRequested = false;
  if (btnStart) btnStart.disabled = true;
  if (progressBox) progressBox.style.display = 'flex';

  const prevSelectedClip = selectedClip;
  selectedClip = null;
  toggleAppleHud(false);

  const wasPlaying = isPlaying;
  isPlaying = false;

  const { width: targetW, height: targetH } = getExportDimensions(exportStudioConfig.aspectRatio, exportStudioConfig.resolution);
  const origW = canvas.width;
  const origH = canvas.height;

  // Temporarily adapt canvas dimensions for render
  canvas.width = targetW;
  canvas.height = targetH;

  const totalExportDuration = Math.min(duration || 30, Math.max(3, getTimelineMaxEndTime()));
  const startTimeMs = performance.now();

  try {
    // 1. Audio mixing stream
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

        if (audioPlayer && audioPlayer.src && audioPlayer.readyState >= 2) {
          try {
            const voiceSource = exportAudioCtx.createMediaElementSource(audioPlayer);
            voiceSource.connect(audioDest);
            voiceSource.connect(exportAudioCtx.destination);
            connectedAudio = true;
          } catch(e) {}
        }

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
      console.warn('Audio mixing skipped:', aErr);
    }

    // 2. Video Stream with target FPS
    const canvasStream = canvas.captureStream ? canvas.captureStream(exportStudioConfig.fps) : canvas.mozCaptureStream(exportStudioConfig.fps);
    const combinedTracks = [...canvasStream.getVideoTracks()];
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combinedTracks.push(...audioStream.getAudioTracks());
    }
    const combinedStream = new MediaStream(combinedTracks);

    // Pick client capture codec
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

    exportChunks = [];
    const bitsPerSec = exportStudioConfig.bitrate * 1000000;
    exportRecorder = new MediaRecorder(combinedStream, mimeType ? { mimeType, videoBitsPerSecond: bitsPerSec } : { videoBitsPerSecond: bitsPerSec });

    exportRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        exportChunks.push(e.data);
      }
    };

    // 3. Playback timeline capture
    exportRecorder.start(250);
    seekToTime(0);
    isPlaying = true;
    if (audioPlayer.src) audioPlayer.play().catch(() => {});
    if (bgmPlayer.src) bgmPlayer.play().catch(() => {});
    render(performance.now());

    await new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (exportCancelRequested) {
          clearInterval(checkInterval);
          if (exportRecorder && exportRecorder.state === 'recording') exportRecorder.stop();
          isPlaying = false;
          if (audioPlayer) audioPlayer.pause();
          if (bgmPlayer) bgmPlayer.pause();
          reject(new Error('Export canceled by user.'));
          return;
        }

        if (exportRecorder && exportRecorder.state === 'recording') {
          try { exportRecorder.requestData(); } catch(e) {}
        }

        const elapsedSec = Math.max(1, (performance.now() - startTimeMs) / 1000);
        const progressRatio = Math.min(1.0, currentTime / totalExportDuration);
        const pct = Math.round(progressRatio * 100);

        if (statusEl) statusEl.textContent = `Capturing frames (${exportStudioConfig.aspectRatio} ${targetW}x${targetH})...`;
        if (pctEl) pctEl.textContent = `${pct}%`;
        if (barEl) barEl.style.width = `${pct}%`;
        if (elapsedEl) elapsedEl.textContent = `Elapsed: ${Math.round(elapsedSec)}s`;

        const totalEstSec = elapsedSec / Math.max(0.05, progressRatio);
        const remainingSec = Math.max(0, Math.round(totalEstSec - elapsedSec));
        if (etaEl) etaEl.textContent = `ETA: ~${remainingSec}s`;

        if (currentTime >= totalExportDuration) {
          clearInterval(checkInterval);
          isPlaying = false;
          if (audioPlayer) audioPlayer.pause();
          if (bgmPlayer) bgmPlayer.pause();

          exportRecorder.onstop = () => resolve();
          if (exportRecorder && exportRecorder.state === 'recording') {
            exportRecorder.stop();
          } else {
            resolve();
          }
        }
      }, 150);
    });

    // 4. Server-Side Universal FFmpeg Transcode or Direct Browser Fallback
    if (statusEl) statusEl.textContent = `Encoding ${exportStudioConfig.format.toUpperCase()} via FFmpeg...`;
    if (barEl) barEl.style.width = '100%';

    const capturedBlob = new Blob(exportChunks, { type: mimeType || 'video/webm' });
    const projectName = (document.getElementById('current-project')?.textContent || 'Magnates_Project').replace(/[^a-zA-Z0-9_-]/g, '_');

    let finalDownloadUrl = null;
    let finalFilename = `${projectName}_${exportStudioConfig.aspectRatio.replace(':', 'x')}_${targetW}x${targetH}_${Date.now()}.${exportStudioConfig.format}`;

    try {
      const formData = new FormData();
      formData.append('video', capturedBlob, 'captured.webm');
      formData.append('aspectRatio', exportStudioConfig.aspectRatio);
      formData.append('width', targetW);
      formData.append('height', targetH);
      formData.append('fps', exportStudioConfig.fps);
      formData.append('bitrate', `${exportStudioConfig.bitrate}M`);
      formData.append('format', exportStudioConfig.format);
      formData.append('projectName', projectName);

      const resp = await fetch('/api/export/transcode', {
        method: 'POST',
        body: formData
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.url) {
          finalDownloadUrl = data.url;
          finalFilename = data.filename;
        }
      }
    } catch (serverErr) {
      console.warn('Backend FFmpeg route unavailable, using direct browser fallback:', serverErr);
    }

    // Direct fallback if server transcode wasn't used
    if (!finalDownloadUrl) {
      finalDownloadUrl = URL.createObjectURL(capturedBlob);
      finalFilename = `${projectName}_${exportStudioConfig.aspectRatio.replace(':', 'x')}_${targetW}x${targetH}.${capturedBlob.type.includes('mp4') ? 'mp4' : 'webm'}`;
    }

    // Trigger Browser Download
    const a = document.createElement('a');
    a.href = finalDownloadUrl;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      if (finalDownloadUrl.startsWith('blob:')) URL.revokeObjectURL(finalDownloadUrl);
    }, 4000);

    showTextTimingAlert(`Video exported successfully: ${finalFilename}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 4500);

  } catch (err) {
    if (!exportCancelRequested) {
      console.error('Export Error:', err);
      alert(`Export Failed: ${err.message}`);
    } else {
      showTextTimingAlert('Export cancelled.', 'info');
      setTimeout(() => showTextTimingAlert(''), 2000);
    }
  } finally {
    // Restore Canvas Dimensions & UI
    canvas.width = origW;
    canvas.height = origH;
    isExporting = false;
    selectedClip = prevSelectedClip;
    closeExportStudioModal();
    seekToTime(0);
    render(performance.now());
  }
}

// Initialize Export Studio UI on load
setTimeout(() => initExportStudioUI(), 200);

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

  let itemsHtml = '';

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
      <!-- Remove Background -->
      <div class="context-menu-item ${hasCutout ? 'active-fx' : ''}" id="ctx-action-cutout">
        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm10-14l-1-1h-6l-1 1H4v2h16V5h-4zM9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z"/></svg>
        <span>${hasCutout ? 'Restore Background' : 'Remove Background'}</span>
        <span class="context-badge">${hasCutout ? 'Active' : 'AI'}</span>
      </div>

      <!-- Vector / Comic Paper Cutout Style -->
      <div class="context-menu-item ${hasVector ? 'active-fx' : ''}" id="ctx-action-vector">
        <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.27 19.53 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
        <span>${hasVector ? 'Remove Vector Outline' : 'Convert to Vector / Cutout'}</span>
        <span class="context-badge">${hasVector ? 'Active' : 'Vector'}</span>
      </div>

      <!-- Add Text Overlay -->
      <div class="context-menu-item" id="ctx-action-add-text">
        <svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>
        <span>Add Text Overlay</span>
      </div>

      <!-- Executive Quote / Statement Screen -->
      <div class="context-menu-item" id="ctx-action-convert-quote">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        <span>Convert to Quote Screen</span>
      </div>

      <!-- Transitions Group (Magnates Continuous Overlap) -->
      <div class="context-menu-divider"></div>
      <div style="font-size: 10px; font-weight: 600; color: var(--text-muted); padding: 4px 10px 2px 10px; text-transform: uppercase; letter-spacing: 0.5px;">Transitions</div>

      <!-- 1. 3D Camera Fly-Through -->
      <div class="context-menu-item ${clip.transition === 'fly_through' ? 'active-fx' : ''}" id="ctx-action-fly-through">
        <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4V4m2 4v8l4-4-4-4m6 0v8l4-4-4-4" fill="currentColor"/></svg>
        <span>${clip.transition === 'fly_through' ? 'Remove 3D Fly-Through' : '3D Fly-Through'}</span>
      </div>

      <!-- 2. Directional Push / Slide Under -->
      <div class="context-menu-item ${clip.transition === 'directional_push' ? 'active-fx' : ''}" id="ctx-action-directional-push">
        <svg viewBox="0 0 24 24"><path d="M6 17.59L7.41 19 12 14.42 16.59 19 18 17.59l-6-6zM6 11l1.41 1.41L12 7.83l4.59 4.58L18 11l-6-6z" transform="rotate(90 12 12)" fill="currentColor"/></svg>
        <span>${clip.transition === 'directional_push' ? `Remove Slide (${clip.transitionDirection || 'left'})` : 'Directional Push'}</span>
      </div>

      <!-- 3. Morph Cut -->
      <div class="context-menu-item ${clip.transition === 'morph_cut' ? 'active-fx' : ''}" id="ctx-action-morph-cut">
        <svg viewBox="0 0 24 24" style="color: #06b6d4;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor"/></svg>
        <span>${clip.transition === 'morph_cut' ? 'Remove Morph Cut' : 'Morph Cut (Seamless Blend)'}</span>
        <span class="context-badge" style="color: #06b6d4;">${clip.transition === 'morph_cut' ? 'Active' : 'Morph'}</span>
      </div>

      <!-- 4. Foreground Reveal Wipe -->
      <div class="context-menu-item ${clip.transition === 'mask_reveal' ? 'active-fx' : ''}" id="ctx-action-mask-reveal">
        <svg viewBox="0 0 24 24" style="color: #10b981;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
        <span>${clip.transition === 'mask_reveal' ? 'Remove Reveal' : 'Foreground Reveal (Split Wipe)'}</span>
        <span class="context-badge" style="color: #10b981;">${clip.transition === 'mask_reveal' ? 'Active' : 'Reveal'}</span>
      </div>

      <!-- 5. Transition Speed & Direction Controls -->
      <div class="context-menu-item" id="ctx-action-trans-settings">
        <svg viewBox="0 0 24 24" style="color: #eab308;"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/></svg>
        <span>Speed &amp; Direction Controls...</span>
        <span class="context-badge" style="color: #eab308;">Settings</span>
      </div>
      <div class="context-menu-divider"></div>

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

      <!-- 1. Dark Document Spotlight (Original Dim) -->
      <div class="context-menu-item" id="ctx-action-doc-dark">
        <svg viewBox="0 0 24 24" style="color: #a855f7;"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>
        <span>Add Dark Spotlight</span>
        <span class="context-badge" style="color: #a855f7;">${clip.spotlights && clip.spotlights.length > 0 ? `${clip.spotlights.length} Active` : (clip.docFocus && clip.docStyle === 'dark' ? '1 Active' : 'Spotlight')}</span>
      </div>

      <!-- 2. Article Whiteout Fade -->
      <div class="context-menu-item" id="ctx-action-doc-white">
        <svg viewBox="0 0 24 24" style="color: #38bdf8;"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <span>Add Whiteout Fade</span>
        <span class="context-badge" style="color: #38bdf8;">${clip.spotlights && clip.spotlights.some(s=>s.style==='white') ? 'Active' : (clip.docFocus && clip.docStyle !== 'dark' ? '1 Active' : 'Whiteout')}</span>
      </div>

      <!-- 3. Animated Highlighter -->
      <div class="context-menu-item" id="ctx-action-doc-hl">
        <svg viewBox="0 0 24 24" style="color: #38bdf8;"><path d="M16.5 4.5l3 3L7.5 19.5 4 20l.5-3.5L16.5 4.5z"/></svg>
        <span>Add Animated Highlighter</span>
        <span class="context-badge" style="color: #38bdf8;">${clip.highlights && clip.highlights.length > 0 ? `${clip.highlights.length} HL` : 'Sweep'}</span>
      </div>

      <!-- Motion Blur Crowds & Commuter Swarms -->
      <div class="context-menu-item ${clip.motionBlurCrowd ? 'active-fx' : ''}" id="ctx-action-motion-blur-crowd">
        <svg viewBox="0 0 24 24" style="color: #00f0ff;"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span>Motion Blur Crowds</span>
        <span class="context-badge" style="color: #00f0ff;">${clip.motionBlurCrowd ? 'Active' : 'Motion Blur'}</span>
      </div>

      <!-- 4. Document Camera Scroll / Flow (Right-Click Fast Option) -->
      <div class="context-menu-item ${clip.docScroll ? 'active-fx' : ''}" id="ctx-action-doc-scroll">
        <svg viewBox="0 0 24 24" style="color: #10b981;"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        <span>${clip.docScroll ? 'Remove Camera Scroll' : 'Document Camera Scroll (Down)'}</span>
        <span class="context-badge" style="color: #10b981;">${clip.docScroll ? (clip.docScrollMode || 'Active') : 'Flow'}</span>
      </div>

      <!-- 5. Article FX Guide & Setup Modal -->
      <div class="context-menu-item" id="ctx-action-doc-guide">
        <svg viewBox="0 0 24 24" style="color: #00f0ff;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10-4.48-10-10-10zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
        <span>Article FX Guide & Setup...</span>
        <span class="context-badge" style="color: #00f0ff;">Tutorial</span>
      </div>

      <div class="context-menu-divider"></div>
    `;
  } else if (clip.isQuoteCard || trackType === 'quote') {
    itemsHtml += `
      <!-- Replay Quote Animation -->
      <div class="context-menu-item" id="ctx-action-quote-replay">
        <svg viewBox="0 0 24 24" style="color: #ff334b;"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
        <span>Replay Effect (${clip.quoteEffect || 'Typewriter'})</span>
        <span class="context-badge" style="color: #ff334b;">Preview</span>
      </div>

      <!-- Change Text Effect (Typewriter <-> Falling) -->
      <div class="context-menu-item" id="ctx-action-quote-toggle-fx">
        <svg viewBox="0 0 24 24" style="color: #00f0ff;"><path fill="currentColor" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>
        <span>Switch to ${clip.quoteEffect === 'falling' ? 'Typewriter' : 'Falling'}</span>
        <span class="context-badge" style="color: #00f0ff;">Toggle FX</span>
      </div>

      <!-- Pick Avatar Headshot -->
      <div class="context-menu-item" id="ctx-action-quote-avatar">
        <svg viewBox="0 0 24 24" style="color: #ffd000;"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Change Avatar Picture...</span>
        <span class="context-badge">Shape</span>
      </div>

      <!-- Configure Screen Background & Glass -->
      <div class="context-menu-item" id="ctx-action-quote-bg">
        <svg viewBox="0 0 24 24" style="color: #a855f7;"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
        <span>Background & Glassmorphism...</span>
        <span class="context-badge" style="color: #a855f7;">${clip.bgMode || 'Gradient'}</span>
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
    <!-- Transition Picker Option -->
    <div class="context-menu-item" id="ctx-action-transition">
      <svg viewBox="0 0 24 24" style="color: #a855f7;"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/></svg>
      <span>Transitions & Sound FX...</span>
      <span class="context-badge" style="color: #a855f7;">${clip.transition && clip.transition !== 'none' ? clip.transition : 'Add'}</span>
    </div>

    <!-- Media Library Image / Clip Picker Option -->
    <div class="context-menu-item" id="ctx-action-choose-media">
      <svg viewBox="0 0 24 24" style="color: #38bdf8;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
      <span>Select Images & Clips...</span>
      <span class="context-badge" style="color: #38bdf8;">Library</span>
    </div>

    ${(trackType === 'voiceover' || trackType === 'music') ? `
    <!-- Precision Audio Cut / Trim Option -->
    <div class="context-menu-item" id="ctx-action-audio-trim">
      <svg viewBox="0 0 24 24" style="color: #00f0ff;"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
      <span>Audio Precision Cut...</span>
      <span class="context-badge" style="color: #00f0ff;">Trim</span>
    </div>
    ` : ''}

    <!-- Split at Playhead Option -->
    <div class="context-menu-item" id="ctx-action-split-playhead">
      <svg viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z"/></svg>
      <span>Split at Playhead (S)</span>
      <span class="context-badge">Cut</span>
    </div>

    <div class="context-menu-divider"></div>

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

  menu.innerHTML = `
    <div class="context-menu-header">
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;">${clipLabel}</span>
      <span class="context-badge">${isDrawing ? 'DRAWING' : trackType.toUpperCase()}</span>
    </div>
    <div class="context-menu-search-wrapper">
      <svg class="context-menu-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" class="context-menu-search-input" id="ctx-search-input" placeholder="Search actions (e.g. zoom, cut)..." autocomplete="off" spellcheck="false" />
      <span class="context-menu-search-clear" id="ctx-search-clear" title="Clear search">&times;</span>
    </div>
    <div class="context-menu-items-scroll" id="ctx-scroll-container">
      ${itemsHtml}
    </div>
  `;

  // Search filter functionality
  const searchInput = menu.querySelector('#ctx-search-input');
  const searchClear = menu.querySelector('#ctx-search-clear');
  const scrollContainer = menu.querySelector('#ctx-scroll-container');

  if (searchInput) {
    // Prevent clicking or typing in search from bubbling and dismissing menu
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        hideStudioContextMenu();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (searchClear) searchClear.style.display = q ? 'block' : 'none';

      const items = scrollContainer.querySelectorAll('.context-menu-item');
      items.forEach(item => {
        const text = (item.textContent || '').toLowerCase();
        const matches = !q || text.includes(q);
        item.style.display = matches ? 'flex' : 'none';
      });

      // Also hide dividers if adjacent items are hidden or when searching
      const dividers = scrollContainer.querySelectorAll('.context-menu-divider');
      dividers.forEach(d => {
        d.style.display = q ? 'none' : 'block';
      });
    });

    if (searchClear) {
      searchClear.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });
    }

    // Auto-focus search input after mount
    setTimeout(() => {
      if (searchInput && document.body.contains(searchInput)) {
        searchInput.focus();
      }
    }, 60);
  }

  // If in fullscreen or immersive mode, append menu inside canvasWrapper so browser doesn't hide it behind top-layer
  const isFsActive = !!document.fullscreenElement || canvasWrapper?.classList.contains('is-immersive-fallback');
  const mountTarget = isFsActive && canvasWrapper ? canvasWrapper : document.body;
  mountTarget.appendChild(menu);

  // Position smartly within viewport bounds (or canvasWrapper bounds if in fullscreen)
  const menuWidth = 250;
  const menuHeight = menu.offsetHeight || 380;
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

  menu.querySelector('#ctx-action-convert-quote')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    const newQ = createNewQuoteCardAtTime(currentTime);
    if (clip && clip.file) {
      newQ.avatarFile = { name: clip.file.name, url: clip.file.url };
    }
    selectClip(newQ, 'quote');
    renderAllTimelineTracks();
    recordState('Add Statement / Quote Card');
    showTextTimingAlert('Statement / Quote Screen FX Activated!', 'success');
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

  menu.querySelector('#ctx-action-fly-through')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    if (clip.transition === 'fly_through') {
      clip.transition = 'none';
      showTextTimingAlert('Removed 3D Fly-Through transition', 'info');
    } else {
      clip.transition = 'fly_through';
      clip.transitionDuration = clip.transitionDuration || 0.7;
      clip.transitionDirection = 'center';
      clip.transitionSfx = 'whoosh';
      playSFX('whoosh');
      showTextTimingAlert('1-Click 3D Fly-Through Applied (Depth Zoom)', 'success');
    }
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
    selectClip(clip, trackType);
    recordState('Toggle 3D Fly-Through Transition');
    saveProjectState(false);
    setTimeout(() => showTextTimingAlert(''), 2200);
  });

  menu.querySelector('#ctx-action-directional-push')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    if (clip.transition === 'directional_push') {
      // Toggle / cycle directions: left -> right -> up -> down -> none
      const currentDir = clip.transitionDirection || 'left';
      if (currentDir === 'left') clip.transitionDirection = 'right';
      else if (currentDir === 'right') clip.transitionDirection = 'up';
      else if (currentDir === 'up') clip.transitionDirection = 'down';
      else { clip.transition = 'none'; showTextTimingAlert('Removed Slide transition', 'info'); }
      if (clip.transition !== 'none') showTextTimingAlert(`Slide direction: ${clip.transitionDirection.toUpperCase()}`, 'success');
    } else {
      clip.transition = 'directional_push';
      clip.transitionDuration = clip.transitionDuration || 0.7;
      clip.transitionDirection = 'left';
      clip.transitionMode = 'underneath';
      clip.transitionSfx = 'whoosh';
      playSFX('whoosh');
      showTextTimingAlert('1-Click Directional Slide Under Applied (From Left)', 'success');
    }
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
    selectClip(clip, trackType);
    recordState('Toggle Directional Push Transition');
    saveProjectState(false);
    setTimeout(() => showTextTimingAlert(''), 2200);
  });

  menu.querySelector('#ctx-action-morph-cut')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    if (clip.transition === 'morph_cut') {
      clip.transition = 'none';
      showTextTimingAlert('Removed Morph Cut', 'info');
    } else {
      clip.transition = 'morph_cut';
      clip.transitionDuration = clip.transitionDuration || 0.6;
      clip.transitionSfx = 'whoosh';
      playSFX('whoosh');
      showTextTimingAlert('1-Click Morph Cut Applied (Seamless Optical Blend)', 'success');
    }
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
    selectClip(clip, trackType);
    recordState('Toggle Morph Cut Transition');
    saveProjectState(false);
    setTimeout(() => showTextTimingAlert(''), 2200);
  });

  menu.querySelector('#ctx-action-mask-reveal')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    if (clip.transition === 'mask_reveal') {
      clip.transition = 'none';
      showTextTimingAlert('Removed Foreground Reveal', 'info');
    } else {
      clip.transition = 'mask_reveal';
      clip.transitionDuration = clip.transitionDuration || 0.6;
      clip.transitionDirection = clip.transitionDirection || 'left';
      clip.transitionSfx = 'whoosh';
      playSFX('whoosh');
      showTextTimingAlert('1-Click Foreground Reveal Applied (Split Wipe)', 'success');
    }
    if (typeof injectTransitionChips === 'function') injectTransitionChips();
    selectClip(clip, trackType);
    recordState('Toggle Mask Reveal Transition');
    saveProjectState(false);
    setTimeout(() => showTextTimingAlert(''), 2200);
  });

  menu.querySelector('#ctx-action-trans-settings')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, trackType);
    const transSec = document.getElementById('inspector-transition-section');
    if (transSec) {
      transSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      transSec.style.outline = '2px solid #a855f7';
      transSec.style.borderRadius = '6px';
      setTimeout(() => { transSec.style.outline = 'none'; }, 2000);
    }
    showTextTimingAlert('Configure transition speed & direction in Inspector', 'info');
    setTimeout(() => showTextTimingAlert(''), 2000);
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

  menu.querySelector('#ctx-action-doc-dark')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, trackType);
    window._activeDocStyle = 'dark';
    setStudioTool('doc-focus', 'dark');
    showTextTimingAlert('Dark Spotlight Active: Drag a rectangle across the document on canvas to place your spotlight.', 'info');
    setTimeout(() => showTextTimingAlert(''), 3500);
  });

  menu.querySelector('#ctx-action-doc-white')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, trackType);
    window._activeDocStyle = 'white';
    setStudioTool('doc-focus', 'white');
    showTextTimingAlert('Whiteout Focus Active: Drag a rectangle across the document on canvas to place whiteout fade.', 'info');
    setTimeout(() => showTextTimingAlert(''), 3500);
  });

  menu.querySelector('#ctx-action-doc-hl')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, trackType);
    setStudioTool('doc-highlight');
    showTextTimingAlert('Highlighter Active: Drag across words or lines to add sweeping highlight bars.', 'info');
    setTimeout(() => showTextTimingAlert(''), 3500);
  });

  menu.querySelector('#ctx-action-motion-blur-crowd')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    if (clip.motionBlurCrowd) {
      delete clip.motionBlurCrowd;
      closeCrowdDock();
      recordState('Remove Motion Blur Crowds Effect');
      showTextTimingAlert('Motion Blur Crowds effect removed.', 'info');
    } else {
      clip.motionBlurCrowd = true;
      if (!clip.crowdZoomMode) clip.crowdZoomMode = 'close';
      recordState('Enable Motion Blur Crowds Effect');
      openCrowdDock(clip);
      showTextTimingAlert('Motion Blur Crowds Active! Use Lasso to circle person 1, 2, 3...', 'success');
      playSFX('whoosh');
    }
    selectClip(clip, trackType);
    renderAllTimelineTracks();
    setTimeout(() => showTextTimingAlert(''), 3500);
  });

  menu.querySelector('#ctx-action-doc-scroll')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    if (clip.docScroll) {
      delete clip.docScroll;
      delete clip.docScrollMode;
      recordState('Remove Document Camera Scroll');
      showTextTimingAlert('Document Camera Scroll removed.', 'info');
    } else {
      clip.docScroll = true;
      clip.docScrollMode = 'down';
      if (!clip.docScrollDistance) clip.docScrollDistance = 280;
      if (clip.docScrollLinger === undefined) clip.docScrollLinger = 1.0;
      if (!clip.docScrollSpeed) clip.docScrollSpeed = 3.0;
      recordState('Enable Document Camera Scroll');
      showTextTimingAlert('Document Camera Scroll (Top-to-Bottom) Active!', 'success');
    }
    selectClip(clip, trackType);
    renderAllTimelineTracks();
    setTimeout(() => showTextTimingAlert(''), 3000);
  });

  menu.querySelector('#ctx-action-doc-guide')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, trackType);
    openDocFocusGuideModal();
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

  // Quote Card Context Menu Actions
  menu.querySelector('#ctx-action-quote-replay')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, 'quote');
    seekToTime(clip.start);
    isPlaying = true;
    showTextTimingAlert(`Replaying "${clip.speakerTitle || 'Quote'}" (${clip.quoteEffect || 'Typewriter'})...`, 'info');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-quote-toggle-fx')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    clip.quoteEffect = (clip.quoteEffect === 'falling') ? 'typewriter' : 'falling';
    selectClip(clip, 'quote');
    const effectSel = document.getElementById('quote-text-effect');
    if (effectSel) effectSel.value = clip.quoteEffect;
    recordState('Toggle Quote Text Effect');
    showTextTimingAlert(`Quote effect set to ${clip.quoteEffect === 'falling' ? 'Falling Characters' : 'Typewriter'}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2200);
  });

  menu.querySelector('#ctx-action-quote-avatar')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, 'quote');
    const fileInp = document.getElementById('quote-avatar-file');
    if (fileInp) fileInp.click();
  });

  menu.querySelector('#ctx-action-quote-bg')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    selectClip(clip, 'quote');
    const bgSel = document.getElementById('quote-bg-mode');
    if (bgSel) {
      bgSel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      bgSel.focus();
    }
  });

  menu.querySelector('#ctx-action-transition')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    openTransitionModal(clip, trackType);
  });

  menu.querySelector('#ctx-action-choose-media')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    openTrackImagePickerModal(clip.start);
  });

  menu.querySelector('#ctx-action-audio-trim')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    openAudioTrimModal(clip, trackType);
  });

  menu.querySelector('#ctx-action-split-playhead')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    splitClipAtPlayhead(trackType, clip);
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

// ==================== MOTION BLUR CROWD ENCIRCLE & WAYPOINT ENGINE ====================
let activeCrowdEditingClip = null;

function openCrowdDock(clip) {
  activeCrowdEditingClip = clip;
  crowdOverlaysHidden = false;
  const dock = document.getElementById('canvas-crowd-dock');
  if (dock) {
    dock.style.display = 'flex';
  }
  setStudioTool('crowd-lasso');
  updateCrowdDockUI(clip);
}

function closeCrowdDock() {
  activeCrowdEditingClip = null;
  const dock = document.getElementById('canvas-crowd-dock');
  if (dock) {
    dock.style.display = 'none';
  }
  if (activeTool === 'crowd-lasso') {
    setStudioTool('select');
  }
}

function updateCrowdDockUI(clip) {
  const isWide = clip && clip.crowdZoomMode === 'wide';
  const btnClose = document.getElementById('btn-crowd-zoom-in');
  const btnWide = document.getElementById('btn-crowd-zoom-out');
  if (btnClose) btnClose.classList.toggle('active', !isWide);
  if (btnWide) btnWide.classList.toggle('active', isWide);
}

// Attach Crowd Dock Toolbar Buttons
document.getElementById('btn-crowd-lasso')?.addEventListener('click', () => {
  setStudioTool('crowd-lasso');
  showTextTimingAlert('Lasso Tool Active: Draw circle around person on screen', 'info');
  setTimeout(() => showTextTimingAlert(''), 2500);
});

document.getElementById('btn-crowd-zoom-in')?.addEventListener('click', () => {
  if (activeCrowdEditingClip) {
    activeCrowdEditingClip.crowdZoomMode = 'close';
    updateCrowdDockUI(activeCrowdEditingClip);
    recordState('Set Crowd Zoom Mode: Close-In');
    showTextTimingAlert('Camera mode: Close-in push between circled people', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

document.getElementById('btn-crowd-zoom-out')?.addEventListener('click', () => {
  if (activeCrowdEditingClip) {
    activeCrowdEditingClip.crowdZoomMode = 'wide';
    updateCrowdDockUI(activeCrowdEditingClip);
    recordState('Set Crowd Zoom Mode: Wide-Out');
    showTextTimingAlert('Camera mode: Zoom-out wide overview flow', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

document.getElementById('btn-crowd-toggle-hud')?.addEventListener('click', () => {
  crowdOverlaysHidden = !crowdOverlaysHidden;
  const lbl = document.getElementById('lbl-crowd-toggle-hud');
  if (lbl) lbl.textContent = crowdOverlaysHidden ? 'Show (1-Tap)' : 'Hide (1-Tap)';
  showTextTimingAlert(crowdOverlaysHidden ? 'Overlays Hidden (Tap screen to show)' : 'Overlays Visible', 'info');
  setTimeout(() => showTextTimingAlert(''), 2000);
});

document.getElementById('btn-crowd-clear')?.addEventListener('click', () => {
  if (activeCrowdEditingClip) {
    activeCrowdEditingClip.crowdWaypoints = [];
    recordState('Clear Crowd Waypoints');
    renderAllTimelineTracks();
    showTextTimingAlert('Cleared all circled waypoints.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

document.getElementById('btn-crowd-close')?.addEventListener('click', () => {
  closeCrowdDock();
  showTextTimingAlert('Crowd Journey Saved & Active!', 'success');
  setTimeout(() => showTextTimingAlert(''), 2000);
});

// Sidebar Inspector buttons for Motion Blur Crowds
document.getElementById('btn-inspector-crowd-toggle')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    const clip = selectedClip.clip;
    clip.motionBlurCrowd = !clip.motionBlurCrowd;
    if (clip.motionBlurCrowd) {
      if (!clip.crowdZoomMode) clip.crowdZoomMode = 'close';
      openCrowdDock(clip);
      showTextTimingAlert('Motion Blur Crowds Active! Use Lasso to circle person 1, 2, 3...', 'success');
    } else {
      closeCrowdDock();
      showTextTimingAlert('Motion Blur Crowds disabled.', 'info');
    }
    selectClip(clip, selectedClip.trackType);
    renderAllTimelineTracks();
    recordState('Toggle Motion Blur Crowds from Inspector');
  }
});

document.getElementById('btn-inspector-crowd-toolbar')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.motionBlurCrowd = true;
    openCrowdDock(selectedClip.clip);
    selectClip(selectedClip.clip, selectedClip.trackType);
    renderAllTimelineTracks();
  }
});

document.getElementById('btn-inspector-crowd-mode-close')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.crowdZoomMode = 'close';
    selectClip(selectedClip.clip, selectedClip.trackType);
    updateCrowdDockUI(selectedClip.clip);
    recordState('Set Crowd Mode: Close-In');
  }
});

document.getElementById('btn-inspector-crowd-mode-wide')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.crowdZoomMode = 'wide';
    selectClip(selectedClip.clip, selectedClip.trackType);
    updateCrowdDockUI(selectedClip.clip);
    recordState('Set Crowd Mode: Zoom-Out Wide');
  }
});

document.getElementById('btn-clear-crowd-waypoints')?.addEventListener('click', () => {
  if (selectedClip && selectedClip.clip) {
    selectedClip.clip.crowdWaypoints = [];
    selectClip(selectedClip.clip, selectedClip.trackType);
    renderAllTimelineTracks();
    recordState('Clear Crowd Waypoints');
    showTextTimingAlert('Cleared all circled waypoints.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

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
    if (currentPenType !== 'eraser' && currentPenType !== 'fill') {
      playSFX(currentPenType === 'highlighter' ? 'marker_swipe' : 'pencil_circle', 0.55);
    }
  });

  let _lastDrawSoundTime = 0;
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
      // Continuous scratch texture as user circles or scribbles
      const now = performance.now();
      if (now - _lastDrawSoundTime > 260) {
        _lastDrawSoundTime = now;
        playSFX(currentStroke.penType === 'highlighter' ? 'marker_swipe' : 'pencil_circle', 0.4);
      }
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

  // 2b. Statement / Quote Cards
  (timelineClips.quote || []).forEach((qClip, idx) => {
    layers.push({
      id: qClip.id,
      name: qClip.speakerTitle ? `Quote: ${qClip.speakerTitle}` : `Quote Card #${idx + 1}`,
      desc: `${qClip.quoteEffect || 'Typewriter'} · ${qClip.duration}s`,
      type: 'quote',
      clip: qClip,
      icon: `<svg viewBox="0 0 24 24" style="color: #ff334b;"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`,
      active: selectedClip?.clip === qClip,
      onSelect: () => {
        selectClip(qClip, 'quote');
        seekToTime(qClip.start);
      },
      onDelete: () => {
        deleteClip('quote', qClip.id);
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

        if (action === 'add_quote') {
          createNewQuoteCardAtTime(currentTime);
          renderLayersPanel();
        } else if (action === 'add_chart') {
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
  },
  {
    id: 'tpl-rolling-counter',
    type: 'counter',
    name: 'Dynamic Rolling Number Counter',
    badge: '1,014% Metric',
    desc: 'Kinetic Vox & Magnates high-impact count-up animation that ticks rapidly from start to target metric with easing.',
    config: {
      type: 'counter',
      title: 'AUDIENCE SURGE',
      startVal: 10,
      endVal: 1014,
      prefix: '',
      suffix: '%',
      sublabel: 'Exponential engagement velocity',
      color: '#00f0ff',
      drawDuration: 1.6,
      glow: true
    }
  },
  {
    id: 'tpl-market-share-donut',
    type: 'donut',
    name: 'Radial Pie & Donut Sweep',
    badge: '78% Dominance',
    desc: 'Vox-style circular ring gauge with dynamic sweep reveal, glowing counter and contextual market share statistics.',
    config: {
      type: 'donut',
      title: 'MARKET DOMINANCE',
      percent: 78,
      metricLabel: 'GLOBAL SEARCH SHARE',
      metricSublabel: 'Consolidated category revenue share',
      color: '#00f0ff',
      drawDuration: 1.6,
      glow: true
    }
  },
  {
    id: 'tpl-leaderboard-ranking',
    type: 'leaderboard',
    name: 'Ranked Channel Leaderboard',
    badge: 'Channel ROI',
    desc: 'Horizontal comparative bar race comparing performance across advertising and traffic channels with score counters.',
    config: {
      type: 'leaderboard',
      title: 'ACQUISITION CHANNELS',
      color: '#00f0ff',
      drawDuration: 1.8,
      glow: true,
      items: [
        { name: 'Google Search Ads', val: 92, color: '#00f0ff' },
        { name: 'Meta Instagram Ads', val: 74, color: '#76ff03' },
        { name: 'TikTok Paid Reach', val: 58, color: '#ffd000' },
        { name: 'YouTube TrueView', val: 42, color: '#ff334b' }
      ]
    }
  },
  {
    id: 'tpl-conversion-funnel',
    type: 'funnel',
    name: 'Conversion Stage Funnel',
    badge: 'Sales Pipeline',
    desc: 'Alex Hormozi style conversion dropoff funnel with segmented tiers dramatizing attrition at each stage.',
    config: {
      type: 'funnel',
      title: 'CUSTOMER PIPELINE',
      color: '#00f0ff',
      drawDuration: 1.8,
      glow: true,
      stages: [
        { label: 'Impressions', count: '100,000', drop: '100%' },
        { label: 'Clicks', count: '12,400', drop: '12.4%' },
        { label: 'Opt-Ins', count: '3,800', drop: '3.8%' },
        { label: 'Customers', count: '940', drop: '0.94%' }
      ]
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
  if (ctx.roundRect) {
    ctx.roundRect(dx, dy, w, h, radius);
  } else {
    ctx.rect(dx, dy, w, h);
  }
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
  if (cfg.type === 'counter') {
    drawStatCounterChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress);
  } else if (cfg.type === 'bar') {
    drawStaggeredBarChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress);
  } else if (cfg.type === 'pyramid') {
    drawLiquidPyramidChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 90, elapsed, progress);
  } else if (cfg.type === 'donut') {
    drawRadialDonutChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress);
  } else if (cfg.type === 'leaderboard') {
    drawLeaderboardChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress);
  } else if (cfg.type === 'funnel') {
    drawConversionFunnelChart(ctx, cfg, dx + 30, dy + 70, w - 60, h - 95, elapsed, progress);
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

  // Calculate write-on reveal point: ensure at least full static preview if paused or resting at start
  const activeProg = isPlaying ? easeOut : (progress > 0 ? easeOut : 1.0);
  const currentDrawIdx = Math.max(0.001, Math.min(n - 1, (n - 1) * activeProg));
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
    if (pts.length === 1 && n > 1) {
      pts.push(getPt(1, series[1]));
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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  const customLabels = cfg.labels || [];
  for (let i = 0; i < n; i++) {
    const lbl = customLabels[i] !== undefined ? customLabels[i] : `${i + 1}`;
    if (lbl && lbl.trim() !== '') {
      const tx = x + i * stepX;
      ctx.fillText(lbl, tx, baselineY + 12);
    }
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
    // If paused and at rest, show full preview (1.0)
    const activeBarNorm = isPlaying ? Math.min(1.0, barElapsed / 0.45) : (progress > 0 ? Math.min(1.0, barElapsed / 0.45) : 1.0);

    // Snappy spring overshoot ease: rises to 105% then settles to 100%
    let barEase = 0;
    if (activeBarNorm > 0) {
      barEase = 1 + 2.7 * Math.pow(activeBarNorm - 1, 3) + 1.7 * Math.pow(activeBarNorm - 1, 2);
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
  const activeRise = isPlaying ? Math.min(1.0, elapsed / 1.5) : (elapsed > 0 ? Math.min(1.0, elapsed / 1.5) : 1.0);
  const riseProg = activeRise;
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

// 4. Vox / Magnates Style Radial Donut & Pie Segment Chart
function drawRadialDonutChart(ctx, cfg, x, y, w, h, elapsed, progress) {
  const activeProg = isPlaying ? progress : (progress > 0 ? progress : 1.0);
  const percent = cfg.percent !== undefined ? cfg.percent : 78;
  const primaryColor = cfg.color || '#00f0ff';
  const label = cfg.metricLabel || 'MARKET DOMINANCE';
  const sublabel = cfg.metricSublabel || 'Share of total category revenue';

  const centerX = x + w * 0.32;
  const centerY = y + h * 0.5;
  const radius = Math.min(w * 0.22, h * 0.38);
  const strokeW = Math.max(16, radius * 0.24);

  // Background track ring
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = strokeW;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Animated sweep arc
  const startAngle = -Math.PI / 2;
  const currentPercent = percent * activeProg;
  const endAngle = startAngle + (Math.PI * 2 * (currentPercent / 100));

  ctx.strokeStyle = primaryColor;
  if (cfg.glow) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 20;
  }
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke();

  // Center percentage counter text
  ctx.restore();
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 44px "Inter", "Oswald", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${Math.round(currentPercent)}%`, centerX, centerY - 4);

  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('CONFIRMED', centerX, centerY + 28);

  // Right info panel / legend
  const infoX = x + w * 0.58;
  const infoY = y + h * 0.34;
  ctx.textAlign = 'left';
  ctx.font = '900 24px "Inter", "Oswald", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, infoX, infoY);

  ctx.font = '500 15px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText(sublabel, infoX, infoY + 30);

  // Legend pill
  ctx.fillStyle = hexToRgba(primaryColor, 0.16);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1.5;
  if (ctx.roundRect) ctx.roundRect(infoX, infoY + 60, 160, 36, 6);
  else ctx.rect(infoX, infoY + 60, 160, 36);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 14px "Inter", sans-serif';
  ctx.fillText(`+${Math.round(currentPercent * 1.4)}% vs Prev Year`, infoX + 14, infoY + 83);
  ctx.restore();
}

// 5. Leaderboard / Horizontal Bar Comparison (Vox Ranking Style)
function drawLeaderboardChart(ctx, cfg, x, y, w, h, elapsed, progress) {
  const activeProg = isPlaying ? progress : (progress > 0 ? progress : 1.0);
  const items = cfg.items || [
    { name: 'Google Search Ads', val: 92, color: '#00f0ff' },
    { name: 'Meta Instagram Ads', val: 74, color: '#76ff03' },
    { name: 'TikTok Paid Reach', val: 58, color: '#ffd000' },
    { name: 'YouTube TrueView', val: 42, color: '#ff334b' }
  ];

  const maxVal = Math.max(...items.map(i => i.val)) * 1.1 || 100;
  const rowCount = items.length;
  const rowH = Math.min(48, (h - 20) / rowCount);
  const barMaxW = w - 260;

  items.forEach((item, idx) => {
    const rowY = y + 15 + idx * (rowH + 12);
    const staggerProg = isPlaying ? Math.min(1.0, Math.max(0, (elapsed - idx * 0.1) / 0.5)) : activeProg;
    const currentW = (item.val / maxVal) * barMaxW * (1 - Math.pow(1 - staggerProg, 3));

    ctx.save();
    // Name Label
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '700 15px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${idx + 1}. ${item.name}`, x + 10, rowY + rowH / 2);

    // Track Background
    const barStartX = x + 200;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    if (ctx.roundRect) ctx.roundRect(barStartX, rowY + 4, barMaxW, rowH - 8, 4);
    else ctx.rect(barStartX, rowY + 4, barMaxW, rowH - 8);
    ctx.fill();

    // Filled Bar
    if (currentW > 2) {
      ctx.fillStyle = item.color || cfg.color || '#00f0ff';
      if (cfg.glow) {
        ctx.shadowColor = item.color || cfg.color || '#00f0ff';
        ctx.shadowBlur = 12;
      }
      if (ctx.roundRect) ctx.roundRect(barStartX, rowY + 4, currentW, rowH - 8, 4);
      else ctx.rect(barStartX, rowY + 4, currentW, rowH - 8);
      ctx.fill();
    }

    // Number score pill
    ctx.textAlign = 'left';
    ctx.font = '800 15px "Inter", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.fillText(`${Math.round(item.val * staggerProg)}%`, barStartX + currentW + 12, rowY + rowH / 2);
    ctx.restore();
  });
}

// 6. Conversion Funnel Chart (Alex Hormozi / Marketing Stage Dropoff)
function drawConversionFunnelChart(ctx, cfg, x, y, w, h, elapsed, progress) {
  const activeProg = isPlaying ? progress : (progress > 0 ? progress : 1.0);
  const stages = cfg.stages || [
    { label: 'Impressions', count: '100,000', drop: '100%' },
    { label: 'Clicks', count: '12,400', drop: '12.4%' },
    { label: 'Opt-Ins', count: '3,800', drop: '3.8%' },
    { label: 'Customers', count: '940', drop: '0.94%' }
  ];

  const n = stages.length;
  const stageH = (h - 20) / n;
  const topW = w * 0.85;
  const botW = w * 0.28;
  const primaryColor = cfg.color || '#00f0ff';

  stages.forEach((st, idx) => {
    const stageElapsed = isPlaying ? Math.min(1.0, Math.max(0, (elapsed - idx * 0.12) / 0.45)) : activeProg;
    const ease = 1 - Math.pow(1 - stageElapsed, 3);
    const rT = idx / n;
    const rB = (idx + 1) / n;

    const currentW1 = topW - (topW - botW) * rT;
    const currentW2 = topW - (topW - botW) * rB;

    const cX = x + w / 2;
    const y1 = y + 10 + idx * stageH;
    const y2 = y1 + stageH - 4;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cX - (currentW1 / 2) * ease, y1);
    ctx.lineTo(cX + (currentW1 / 2) * ease, y1);
    ctx.lineTo(cX + (currentW2 / 2) * ease, y2);
    ctx.lineTo(cX - (currentW2 / 2) * ease, y2);
    ctx.closePath();

    const alpha = 0.25 + (idx / n) * 0.65;
    ctx.fillStyle = hexToRgba(primaryColor, alpha * ease);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    if (cfg.glow && idx === n - 1) {
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 18;
    }
    ctx.fill();
    ctx.stroke();

    if (ease > 0.5) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${st.label}: ${st.count} (${st.drop})`, cX, (y1 + y2) / 2);
    }
    ctx.restore();
  });
}

// 7. Dynamic Rolling Number Counter Infographic (Vox & Magnates Metric Impact)
function drawStatCounterChart(ctx, cfg, x, y, w, h, elapsed, progress) {
  const primaryColor = cfg.color || '#00f0ff';
  const startVal = cfg.startVal !== undefined ? cfg.startVal : 0;
  const endVal = cfg.endVal !== undefined ? cfg.endVal : 1014;
  const prefix = cfg.prefix || '';
  const suffix = cfg.suffix !== undefined ? cfg.suffix : '%';
  const sublabel = cfg.sublabel || 'Exponential growth surge';
  const drawDur = cfg.drawDuration || 1.6;

  const countProg = Math.min(1.0, Math.max(0, elapsed / drawDur));
  const easeOut = 1 - Math.pow(1 - countProg, 3);
  const currentVal = Math.round(startVal + (endVal - startVal) * easeOut);

  const centerX = x + w / 2;
  const centerY = y + h * 0.46;

  ctx.save();

  // Background subtle glow radar / radial halo
  if (cfg.glow) {
    const radialGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.min(w, h) * 0.52);
    radialGrad.addColorStop(0, hexToRgba(primaryColor, 0.18 * easeOut));
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.min(w, h) * 0.52, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ticking progress ring around counter (scaled nicely inside bounds)
  const radius = Math.min(w * 0.32, h * 0.36);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Progress arc
  if (countProg > 0) {
    ctx.strokeStyle = primaryColor;
    if (cfg.glow) {
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 16;
    }
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * easeOut));
    ctx.stroke();
  }

  // Format large numbers with locale commas (e.g. 1,014)
  const displayNum = `${prefix}${currentVal.toLocaleString()}${suffix}`;

  // Auto-fit font size dynamically to guarantee number fits comfortably inside the ring
  const maxAvailableTextW = radius * 1.62;
  let numFontSize = Math.min(54, Math.max(22, Math.floor(radius * 0.48)));
  ctx.font = `900 ${numFontSize}px "Inter", "Oswald", sans-serif`;
  let measuredW = ctx.measureText(displayNum).width;
  while (measuredW > maxAvailableTextW && numFontSize > 18) {
    numFontSize -= 2;
    ctx.font = `900 ${numFontSize}px "Inter", "Oswald", sans-serif`;
    measuredW = ctx.measureText(displayNum).width;
  }

  // Big Impact Number
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  if (cfg.glow) {
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 24;
  }
  ctx.fillText(displayNum, centerX, centerY - 6);

  // Sublabel / context badge (scaled to fit)
  ctx.shadowBlur = 0;
  const sublabelFontSize = Math.max(9, Math.min(12, Math.floor(radius * 0.12)));
  ctx.font = `700 ${sublabelFontSize}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillText(sublabel.toUpperCase(), centerX, centerY + numFontSize * 0.58 + 2);

  // Bottom velocity indicator
  const deltaVal = endVal - startVal;
  const isPositive = deltaVal >= 0;
  const deltaText = `${isPositive ? '+' : ''}${Math.round(deltaVal * easeOut).toLocaleString()}${suffix} DELTA`;
  ctx.font = `800 ${Math.max(9, Math.min(11, sublabelFontSize - 1))}px "Inter", monospace`;
  ctx.fillStyle = primaryColor;
  ctx.fillText(deltaText, centerX, centerY + numFontSize * 0.58 + sublabelFontSize + 8);

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

    card.draggable = true;

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
    } else if (tpl.type === 'counter') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <text x="50" y="27" fill="#00f0ff" font-size="16" font-weight="900" text-anchor="middle" font-family="'Inter', sans-serif" filter="drop-shadow(0 0 5px #00f0ff)">1,014%</text>
          <text x="50" y="42" fill="rgba(255,255,255,0.7)" font-size="8" font-weight="700" text-anchor="middle" letter-spacing="1">SURGE</text>
        </svg>
      `;
    } else if (tpl.type === 'donut') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <circle cx="50" cy="25" r="18" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="6"/>
          <circle cx="50" cy="25" r="18" fill="none" stroke="#00f0ff" stroke-width="6" stroke-dasharray="113" stroke-dashoffset="26" stroke-linecap="round" transform="rotate(-90 50 25)"/>
          <text x="50" y="29" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">78%</text>
        </svg>
      `;
    } else if (tpl.type === 'leaderboard') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <rect x="15" y="8" width="70" height="6" rx="2" fill="#00f0ff"/>
          <rect x="15" y="18" width="54" height="6" rx="2" fill="#ffd000"/>
          <rect x="15" y="28" width="40" height="6" rx="2" fill="#ff334b"/>
          <rect x="15" y="38" width="28" height="6" rx="2" fill="rgba(255,255,255,0.4)"/>
        </svg>
      `;
    } else if (tpl.type === 'funnel') {
      miniPreviewSvg = `
        <svg viewBox="0 0 100 50" style="width: 85%; height: 100%;">
          <polygon points="12,6 88,6 74,16 26,16" fill="rgba(0, 240, 255, 0.4)"/>
          <polygon points="26,18 74,18 63,28 37,28" fill="rgba(0, 240, 255, 0.6)"/>
          <polygon points="37,30 63,30 55,40 45,40" fill="rgba(0, 240, 255, 0.8)"/>
          <polygon points="45,42 55,42 52,48 48,48" fill="#00f0ff"/>
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

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('application/json', JSON.stringify({
        isChart: true,
        name: tpl.name,
        chartConfig: tpl.config
      }));
    });

    card.addEventListener('click', () => {
      addChartClipToTimeline(tpl.config, currentTime, 6.0);
    });

    container.appendChild(card);
  });
}

// Add an Animated Chart as an interactive Timeline Clip
function addChartClipToTimeline(chartConfig, startSec = currentTime, durationSec = 6.0) {
  if (!timelineClips.chart) timelineClips.chart = [];

  // 1. Auto-pause playback so user doesn't lose position
  if (isPlaying) {
    pausePlayback();
  }

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

  // 2. Pulse "Edit in Pop-up Modal" button in sidebar
  const editBtn = document.getElementById('btn-chart-open-modal');
  if (editBtn) {
    editBtn.classList.remove('btn-pulse-glow');
    void editBtn.offsetWidth; // trigger reflow
    editBtn.classList.add('btn-pulse-glow');
  }

  // 3. Show sleek floating cue toast directly on viewport
  showChartConfigureCue(newClip);

  showTextTimingAlert(`Added "${newClip.name}" chart! Edit in modal to configure.`, 'success');
  setTimeout(() => showTextTimingAlert(''), 3500);
  return newClip;
}

// Show a friendly on-canvas cue banner prompting user to configure or edit
function showChartConfigureCue(clip) {
  const existingCue = document.getElementById('chart-configure-cue');
  if (existingCue) existingCue.remove();

  const cue = document.createElement('div');
  cue.id = 'chart-configure-cue';
  cue.className = 'chart-cue-toast';
  cue.innerHTML = `
    <svg class="ui-icon" viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #00f0ff;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
    <span>Chart placed! Customize title, colors & numbers:</span>
    <button type="button" id="btn-cue-open-editor">Open Editor</button>
    <button type="button" id="btn-cue-dismiss" style="background: transparent; color: #8892b0; font-size: 14px; padding: 2px 6px; margin-left: -4px;">&times;</button>
  `;

  canvasWrapper?.appendChild(cue);

  cue.querySelector('#btn-cue-open-editor')?.addEventListener('click', (e) => {
    e.stopPropagation();
    cue.remove();
    openChartEditorModalForClip(clip);
  });

  cue.querySelector('#btn-cue-dismiss')?.addEventListener('click', (e) => {
    e.stopPropagation();
    cue.remove();
  });

  setTimeout(() => {
    if (cue.parentNode) cue.remove();
  }, 7000);
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
  modalCustomLabels = null;
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
  modalCustomLabels = cfg.labels ? [...cfg.labels] : null;
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

  const titleInput = document.getElementById('modal-chart-title');
  const quickTitleInput = document.getElementById('modal-chart-quick-title');
  const colorInput = document.getElementById('modal-chart-color');
  const colorLabel = document.getElementById('modal-chart-color-label');
  const durSlider = document.getElementById('modal-chart-duration');
  const durVal = document.getElementById('modal-chart-duration-val');
  const dataInput = document.getElementById('modal-chart-data');
  const dataLabel = document.getElementById('modal-chart-data-label');

  if (titleInput) titleInput.value = cfg.title || '';
  if (quickTitleInput) quickTitleInput.value = cfg.title || '';
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

// Live interactive modal preview rendering loop & interactive node editing
let isModalExpanded = false;
let modalInteractiveNodes = []; // [{ x, y, r, idx, val, series: 1|2 }]
let modalInteractiveTargets = []; // [{ type: 'title'|'axis-label', x, y, w, h, text, idx }]
let modalCustomLabels = null;
let draggingModalNodeIndex = -1;
let draggingModalNodeSeries = 1;

function setupModalDirectCanvasInteraction() {
  const canvas = document.getElementById('modal-chart-preview-canvas');
  const tooltip = document.getElementById('chart-drag-tooltip');
  if (!canvas || canvas.dataset.hasInteractListeners) return;
  canvas.dataset.hasInteractListeners = 'true';

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      clientX: e.clientX,
      clientY: e.clientY
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    const coords = getCanvasCoords(e);
    // Find closest node within radius + 10
    const hit = modalInteractiveNodes.find(node => {
      const dx = node.x - coords.x;
      const dy = node.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= (node.r + 12);
    });

    if (hit) {
      draggingModalNodeIndex = hit.idx;
      draggingModalNodeSeries = hit.series || 1;
      if (tooltip) {
        tooltip.style.display = 'block';
        tooltip.textContent = `Node ${hit.idx + 1}: ${Math.round(hit.val)}`;
        const rect = canvas.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        tooltip.style.top = `${e.clientY - rect.top - 25}px`;
      }
      return;
    }

    // Check if user tapped directly on title or axis label
    const targetHit = modalInteractiveTargets.find(t => {
      return coords.x >= t.x && coords.x <= (t.x + t.w) && coords.y >= t.y && coords.y <= (t.y + t.h);
    });

    if (targetHit) {
      if (targetHit.type === 'title') {
        const titleInput = document.getElementById('modal-chart-title');
        const quickInput = document.getElementById('modal-chart-quick-title');
        const currentTitle = titleInput ? titleInput.value : (targetHit.text || '');
        const newTitle = prompt('Edit Chart Title:', currentTitle);
        if (newTitle !== null) {
          if (titleInput) titleInput.value = newTitle;
          if (quickInput) quickInput.value = newTitle;
          modalPreviewStartTime = performance.now() - 5000;
        }
      } else if (targetHit.type === 'axis-label') {
        const currentLabel = targetHit.text || `${targetHit.idx + 1}`;
        const newLabel = prompt(`Edit Axis Label #${targetHit.idx + 1} (leave blank to delete):`, currentLabel);
        if (newLabel !== null) {
          const rawData = document.getElementById('modal-chart-data')?.value || '';
          const ptsCount = rawData.split(',').filter(s => !isNaN(parseFloat(s.trim()))).length || 15;
          if (!modalCustomLabels) {
            modalCustomLabels = Array.from({ length: ptsCount }, (_, i) => `${i + 1}`);
          }
          while (modalCustomLabels.length < ptsCount) {
            modalCustomLabels.push(`${modalCustomLabels.length + 1}`);
          }
          modalCustomLabels[targetHit.idx] = newLabel.trim();
          modalPreviewStartTime = performance.now() - 5000;
        }
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (draggingModalNodeIndex < 0) {
      // Hover feedback
      if (canvas.offsetParent !== null) {
        const coords = getCanvasCoords(e);
        const hit = modalInteractiveNodes.find(node => {
          const dx = node.x - coords.x;
          const dy = node.y - coords.y;
          return Math.sqrt(dx * dx + dy * dy) <= (node.r + 12);
        });
        const targetHit = modalInteractiveTargets.find(t => {
          return coords.x >= t.x && coords.x <= (t.x + t.w) && coords.y >= t.y && coords.y <= (t.y + t.h);
        });
        canvas.style.cursor = hit ? 'ns-resize' : (targetHit ? 'pointer' : 'crosshair');
      }
      return;
    }

    const coords = getCanvasCoords(e);
    const dataInput = document.getElementById('modal-chart-data');
    if (!dataInput) return;

    // Map y coordinate back to value
    const lastNode = modalInteractiveNodes.find(n => n.idx === draggingModalNodeIndex && (n.series || 1) === draggingModalNodeSeries);
    if (!lastNode || !lastNode.baselineY || !lastNode.chartHeight || !lastNode.maxVal) return;

    const relY = Math.max(0, Math.min(lastNode.chartHeight, lastNode.baselineY - coords.y));
    const newVal = Math.max(1, Math.round((relY / lastNode.chartHeight) * lastNode.maxVal));

    if (selectedModalType === 'bar' || selectedModalType === 'area') {
      const vals = dataInput.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (vals[draggingModalNodeIndex] !== undefined) {
        vals[draggingModalNodeIndex] = newVal;
        dataInput.value = vals.join(', ');
      }
    }

    if (tooltip) {
      const rect = canvas.getBoundingClientRect();
      tooltip.style.display = 'block';
      tooltip.textContent = `Val: ${newVal}`;
      tooltip.style.left = `${e.clientX - rect.left + 12}px`;
      tooltip.style.top = `${e.clientY - rect.top - 25}px`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (draggingModalNodeIndex >= 0) {
      draggingModalNodeIndex = -1;
      if (tooltip) tooltip.style.display = 'none';
      modalPreviewStartTime = performance.now() - 5000; // Keep curve fully drawn
    }
  });

  // Double click node to prompt exact numeric edit
  canvas.addEventListener('dblclick', (e) => {
    const coords = getCanvasCoords(e);
    const hit = modalInteractiveNodes.find(node => {
      const dx = node.x - coords.x;
      const dy = node.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= (node.r + 14);
    });

    if (hit) {
      const promptVal = prompt(`Edit value for Point #${hit.idx + 1}:`, Math.round(hit.val));
      if (promptVal !== null) {
        const num = parseFloat(promptVal);
        if (!isNaN(num)) {
          const dataInput = document.getElementById('modal-chart-data');
          if (dataInput) {
            const vals = dataInput.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            if (vals[hit.idx] !== undefined) {
              vals[hit.idx] = Math.max(0, Math.round(num));
              dataInput.value = vals.join(', ');
              modalPreviewStartTime = performance.now() - 5000;
            }
          }
        }
      }
    }
  });
}

function startModalPreviewLoop() {
  if (modalPreviewAnimFrame) {
    cancelAnimationFrame(modalPreviewAnimFrame);
  }
  setupModalDirectCanvasInteraction();
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

    if (modalCustomLabels && Array.isArray(modalCustomLabels)) {
      previewCfg.labels = [...modalCustomLabels];
    }

    if (selectedModalType === 'counter') {
      const parts = rawData.split(':').map(s => s.trim());
      previewCfg.startVal = parseFloat(parts[0]) || 0;
      previewCfg.endVal = parseFloat(parts[1]) || 1014;
      previewCfg.suffix = parts[2] !== undefined ? parts[2] : '%';
      previewCfg.sublabel = parts[3] || 'Exponential audience surge';
    } else if (selectedModalType === 'pyramid') {
      previewCfg.tierText = rawData.trim() || '3% BUYING NOW';
      previewCfg.tierIndex = 0;
    } else if (selectedModalType === 'bar') {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      previewCfg.values = vals.length > 0 ? vals : [10, 25, 40, 75, 50, 65, 80];
      if (!previewCfg.labels) {
        previewCfg.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, previewCfg.values.length);
      }
    } else {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      previewCfg.series1 = vals.length > 0 ? vals : [20, 50, 40, 80, 60, 30, 15];
      previewCfg.isDual = true;
      previewCfg.series2 = previewCfg.series1.map(v => Math.max(5, Math.round(v * 0.65)));
      if (!previewCfg.labels) {
        previewCfg.labels = Array.from({ length: previewCfg.series1.length }, (_, i) => `${i + 1}`);
      }
    }

    const now = performance.now();
    const cycleDurationMs = (durSec + 1.2) * 1000;
    const elapsedSec = ((now - modalPreviewStartTime) % cycleDurationMs) / 1000;
    const progress = Math.min(1.0, elapsedSec / durSec);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    // Draw container card with generous aesthetic bounds
    pCtx.save();
    pCtx.fillStyle = '#080a10';
    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    pCtx.lineWidth = 1.5;
    pCtx.beginPath();
    pCtx.roundRect(8, 6, pw - 16, ph - 12, 10);
    pCtx.fill();
    pCtx.stroke();

    // Chart Title Header (cleanly formatted, scales with expansion)
    const titleFontSize = isModalExpanded ? 20 : 16;
    pCtx.font = `800 ${titleFontSize}px "Inter", "Oswald", sans-serif`;
    pCtx.fillStyle = '#ffffff';
    const displayTitle = previewCfg.title || 'PREVIEW';
    const titleY = isModalExpanded ? 34 : 28;
    pCtx.fillText(displayTitle, 24, titleY);
    const titleWidth = pCtx.measureText(displayTitle).width;

    // Register title as interactive tap target with generous clickable area
    modalInteractiveTargets = [];
    modalInteractiveTargets.push({
      type: 'title',
      x: 16,
      y: 6,
      w: Math.max(120, titleWidth + 30),
      h: titleY + 12,
      text: previewCfg.title
    });

    // Subtle editable indicator badge next to title
    pCtx.save();
    pCtx.font = '600 10px "Inter", sans-serif';
    pCtx.fillStyle = 'rgba(0, 240, 255, 0.65)';
    pCtx.fillText('✎ edit', 24 + titleWidth + 8, titleY - 1);
    pCtx.restore();

    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.moveTo(24, titleY + 8);
    pCtx.lineTo(pw - 24, titleY + 8);
    pCtx.stroke();
    pCtx.restore();

    // Render chart graphics with padded boundaries so bottom axis & top peak never clip
    const chartX = 32;
    const chartY = 52;
    const chartW = pw - 64;
    const chartH = ph - 80;

    modalInteractiveNodes = []; // Reset node detection for this frame

    if (previewCfg.type === 'counter') {
      drawStatCounterChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else if (previewCfg.type === 'bar') {
      drawStaggeredBarChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
      // Track bar interactive drag zones and bottom axis label targets
      const vals = previewCfg.values || [];
      const maxVal = Math.max(...vals) * 1.15 || 100;
      const stepX = chartW / vals.length;
      vals.forEach((v, idx) => {
        const bx = chartX + idx * stepX + stepX * 0.15;
        const bw = stepX * 0.7;
        const bh = (v / maxVal) * (chartH - 25);
        const by = chartY + chartH - 20 - bh;
        modalInteractiveNodes.push({
          x: bx + bw / 2,
          y: by,
          r: 9,
          idx,
          val: v,
          baselineY: chartY + chartH - 20,
          chartHeight: chartH - 25,
          maxVal
        });

        // Register axis label target for bar
        const lbl = (previewCfg.labels && previewCfg.labels[idx] !== undefined) ? previewCfg.labels[idx] : `${idx + 1}`;
        modalInteractiveTargets.push({
          type: 'axis-label',
          idx,
          x: bx + bw / 2 - 18,
          y: chartY + chartH - 12,
          w: 36,
          h: 24,
          text: lbl
        });
      });
    } else if (previewCfg.type === 'pyramid') {
      drawLiquidPyramidChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else if (previewCfg.type === 'donut') {
      drawRadialDonutChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else if (previewCfg.type === 'leaderboard') {
      drawLeaderboardChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else if (previewCfg.type === 'funnel') {
      drawConversionFunnelChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress);
    } else {
      drawDynamicAreaChart(pCtx, previewCfg, chartX, chartY, chartW, chartH, elapsedSec, progress, easeOut);
      // Track curve node points for direct dragging & double-click edits
      const series1 = previewCfg.series1 || [];
      const maxVal = Math.max(...series1, ...(previewCfg.isDual ? previewCfg.series2 : [0])) * 1.15 || 100;
      const n = series1.length;
      const stepX = chartW / (n - 1);
      const baselineY = chartY + chartH - 20;
      const chartHeight = chartH - 28;

      series1.forEach((val, idx) => {
        const nx = chartX + idx * stepX;
        const ny = baselineY - (val / maxVal) * chartHeight;
        modalInteractiveNodes.push({
          x: nx,
          y: ny,
          r: 8,
          idx,
          val,
          series: 1,
          baselineY,
          chartHeight,
          maxVal
        });

        // Register axis label target for area chart point
        const lbl = (previewCfg.labels && previewCfg.labels[idx] !== undefined) ? previewCfg.labels[idx] : `${idx + 1}`;
        modalInteractiveTargets.push({
          type: 'axis-label',
          idx,
          x: nx - 16,
          y: baselineY + 2,
          w: 32,
          h: 24,
          text: lbl
        });

        // Draw interactive ring on node when hovered or dragged
        if (draggingModalNodeIndex === idx) {
          pCtx.save();
          pCtx.strokeStyle = '#00f0ff';
          pCtx.lineWidth = 2.5;
          pCtx.beginPath();
          pCtx.arc(nx, ny, 11, 0, Math.PI * 2);
          pCtx.stroke();
          pCtx.restore();
        }
      });
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

  // Modal Expand / Full Screen Toggle button
  const btnModalExpand = document.getElementById('btn-chart-modal-expand');
  const modalBox = document.querySelector('#chart-creator-modal .vector-modal-box');
  const previewBox = document.getElementById('chart-preview-container-box');
  const expandText = document.getElementById('chart-modal-expand-text');
  const previewCanvas = document.getElementById('modal-chart-preview-canvas');

  if (btnModalExpand && modalBox) {
    btnModalExpand.addEventListener('click', () => {
      isModalExpanded = !isModalExpanded;
      modalBox.classList.toggle('chart-modal-expanded', isModalExpanded);
      previewBox?.classList.toggle('is-expanded', isModalExpanded);

      if (isModalExpanded) {
        expandText.textContent = 'Exit Full Screen';
        btnModalExpand.classList.remove('btn-chart-expand-pulse');
        if (previewCanvas) {
          previewCanvas.width = 1200;
          previewCanvas.height = 420;
        }
      } else {
        expandText.textContent = 'Expand / Full Screen';
        btnModalExpand.classList.add('btn-chart-expand-pulse');
        if (previewCanvas) {
          previewCanvas.width = 800;
          previewCanvas.height = 340;
        }
      }
      modalPreviewStartTime = performance.now();
    });
  }

  // Close modal listeners
  document.getElementById('btn-close-chart-modal')?.addEventListener('click', () => {
    if (isModalExpanded) btnModalExpand?.click();
    closeChartCreatorModal();
  });
  document.getElementById('btn-cancel-chart-modal')?.addEventListener('click', () => {
    if (isModalExpanded) btnModalExpand?.click();
    closeChartCreatorModal();
  });

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
      } else if (selectedModalType === 'donut') {
        if (dataLabel) dataLabel.textContent = 'Percentage Value (0-100)';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'MARKET DOMINANCE';
        if (dataInput && !modalEditingClip) dataInput.value = '78';
      } else if (selectedModalType === 'leaderboard') {
        if (dataLabel) dataLabel.textContent = 'Leaderboard Items (Format: Name:Value:Delta, comma separated)';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'GLOBAL RANKINGS';
        if (dataInput && !modalEditingClip) dataInput.value = 'Veritasium:28M:+4.2%, Vox:18M:+1.8%, Magnates:12M:+6.5%, Kurzgesagt:24M:+2.1%';
      } else if (selectedModalType === 'counter') {
        if (dataLabel) dataLabel.textContent = 'Counter Data (Format: Start:End:Suffix:Sublabel)';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'AUDIENCE SURGE';
        if (dataInput && !modalEditingClip) dataInput.value = '10:1014:%:Exponential growth surge';
      } else if (selectedModalType === 'funnel') {
        if (dataLabel) dataLabel.textContent = 'Funnel Stages (Format: Stage:Count:Drop%, comma separated)';
        if (titleInput && (!modalEditingClip || !titleInput.value)) titleInput.value = 'CONVERSION PIPELINE';
        if (dataInput && !modalEditingClip) dataInput.value = 'Impressions:100K:100%, Clicks:12.4K:12.4%, Opt-Ins:3.8K:3.8%, Customers:940:0.94%';
      }
      const quickTitle = document.getElementById('modal-chart-quick-title');
      if (quickTitle && titleInput) quickTitle.value = titleInput.value;
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
        const quickTitleInput = document.getElementById('modal-chart-quick-title');
        const colorInput = document.getElementById('modal-chart-color');
        const colorLabel = document.getElementById('modal-chart-color-label');
        const dataInput = document.getElementById('modal-chart-data');
        const dataLabel = document.getElementById('modal-chart-data-label');
        if (titleInput) titleInput.value = tpl.config.title;
        if (quickTitleInput) quickTitleInput.value = tpl.config.title;
        if (colorInput) {
          colorInput.value = tpl.config.color;
          if (colorLabel) colorLabel.textContent = tpl.config.color;
        }
        if (dataInput) {
          if (tpl.type === 'counter') {
            if (dataLabel) dataLabel.textContent = 'Counter Data (Format: Start:End:Suffix:Sublabel)';
            dataInput.value = `${tpl.config.startVal}:${tpl.config.endVal}:${tpl.config.suffix}:${tpl.config.sublabel}`;
          } else if (tpl.type === 'pyramid') {
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

  // Two-way synchronization between modal-chart-title and modal-chart-quick-title
  const mainTitleInput = document.getElementById('modal-chart-title');
  const quickTitleInput = document.getElementById('modal-chart-quick-title');

  mainTitleInput?.addEventListener('input', (e) => {
    if (quickTitleInput) quickTitleInput.value = e.target.value;
  });
  quickTitleInput?.addEventListener('input', (e) => {
    if (mainTitleInput) mainTitleInput.value = e.target.value;
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

    if (selectedModalType === 'counter') {
      const parts = rawData.split(':').map(s => s.trim());
      config.startVal = parseFloat(parts[0]) || 0;
      config.endVal = parseFloat(parts[1]) || 1014;
      config.suffix = parts[2] !== undefined ? parts[2] : '%';
      config.sublabel = parts[3] || 'Exponential audience surge';
    } else if (selectedModalType === 'pyramid') {
      config.tierText = rawData.trim() || '3% BUYING NOW';
      config.tierIndex = modalEditingClip?.chartConfig?.tierIndex || 0;
    } else if (selectedModalType === 'bar') {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      config.values = vals.length > 0 ? vals : [10, 25, 40, 75, 50];
      config.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, config.values.length);
    } else if (selectedModalType === 'donut') {
      const p = parseFloat(rawData.trim());
      config.percent = !isNaN(p) ? Math.min(100, Math.max(0, p)) : 78;
      config.metricLabel = title;
      config.metricSublabel = 'Share of total category revenue';
    } else if (selectedModalType === 'leaderboard') {
      // Parse format Name:Value:Delta
      const parts = rawData.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 0 && parts[0].includes(':')) {
        config.channels = parts.map((str, idx) => {
          const segs = str.split(':');
          const channelColors = ['#00f0ff', '#ffd000', '#ff334b', '#76ff03', '#ffffff'];
          return {
            name: segs[0]?.trim() || `Channel ${idx + 1}`,
            value: segs[1]?.trim() || '10M',
            delta: segs[2]?.trim() || '+5%',
            color: channelColors[idx % channelColors.length]
          };
        });
      } else {
        config.channels = [
          { name: 'Veritasium', value: '28M Subs', delta: '+4.2% YoY', color: '#00f0ff' },
          { name: 'Vox', value: '18M Subs', delta: '+1.8% YoY', color: '#ffd000' },
          { name: 'Magnates Media', value: '12M Subs', delta: '+6.5% YoY', color: '#ff334b' }
        ];
      }
    } else if (selectedModalType === 'funnel') {
      const parts = rawData.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 0 && parts[0].includes(':')) {
        config.stages = parts.map(str => {
          const segs = str.split(':');
          return {
            label: segs[0]?.trim() || 'Stage',
            count: segs[1]?.trim() || '1,000',
            drop: segs[2]?.trim() || '10%'
          };
        });
      } else {
        config.stages = [
          { label: 'Impressions', count: '100,000', drop: '100%' },
          { label: 'Clicks', count: '12,400', drop: '12.4%' },
          { label: 'Opt-Ins', count: '3,800', drop: '3.8%' },
          { label: 'Customers', count: '940', drop: '0.94%' }
        ];
      }
    } else {
      const vals = rawData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      config.series1 = vals.length > 0 ? vals : [20, 50, 40, 80, 60, 30, 15];
      config.isDual = true;
      config.series2 = config.series1.map(v => Math.max(5, Math.round(v * 0.65)));
    }

    if (modalCustomLabels && Array.isArray(modalCustomLabels)) {
      config.labels = [...modalCustomLabels];
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



// ==================== NATIVE APPLE-STYLE DIALOG HELPERS (NO BROWSER POPUPS) ====================
function showNativeDialog({ title = 'Notice', message = '', iconType = 'info', showInput = false, inputValue = '', confirmText = 'Confirm', confirmColor = '#00f0ff', cancelText = 'Cancel' }) {
  return new Promise((resolve) => {
    const modal = document.getElementById('native-dialog-modal');
    if (!modal) {
      resolve(showInput ? null : false);
      return;
    }

    const titleEl = document.getElementById('native-dialog-title');
    const msgEl = document.getElementById('native-dialog-message');
    const iconContainer = document.getElementById('native-dialog-icon-container');
    const inputContainer = document.getElementById('native-dialog-input-container');
    const inputEl = document.getElementById('native-dialog-input');
    const btnCancel = document.getElementById('btn-native-dialog-cancel');
    const btnConfirm = document.getElementById('btn-native-dialog-confirm');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    // Icon & theme styling
    if (iconContainer) {
      if (iconType === 'danger') {
        iconContainer.style.background = 'rgba(255, 51, 75, 0.15)';
        iconContainer.style.color = '#ff334b';
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:currentColor;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
      } else if (iconType === 'input' || iconType === 'project') {
        iconContainer.style.background = 'rgba(0, 240, 255, 0.15)';
        iconContainer.style.color = '#00f0ff';
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:currentColor;"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-8-2h8v-2h-8v2zm0-3h8V9h-8v2zm0-3h8V6h-8v2z"/></svg>';
      } else {
        iconContainer.style.background = 'rgba(56, 189, 248, 0.15)';
        iconContainer.style.color = '#38bdf8';
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:currentColor;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
      }
    }

    if (inputContainer && inputEl) {
      if (showInput) {
        inputContainer.style.display = 'block';
        inputEl.value = inputValue || '';
        setTimeout(() => {
          inputEl.focus();
          inputEl.select();
        }, 50);
      } else {
        inputContainer.style.display = 'none';
      }
    }

    if (btnConfirm) {
      btnConfirm.textContent = confirmText;
      btnConfirm.style.color = confirmColor;
    }
    if (btnCancel) {
      btnCancel.textContent = cancelText;
    }

    const cleanup = () => {
      modal.style.display = 'none';
      modal.classList.remove('is-open');
      btnConfirm?.removeEventListener('click', onConfirm);
      btnCancel?.removeEventListener('click', onCancel);
      inputEl?.removeEventListener('keydown', onKeyDown);
    };

    const onConfirm = (ev) => {
      if (ev) ev.stopPropagation();
      cleanup();
      resolve(showInput ? (inputEl?.value || '') : true);
    };

    const onCancel = (ev) => {
      if (ev) ev.stopPropagation();
      cleanup();
      resolve(showInput ? null : false);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Enter') onConfirm(e);
      else if (e.key === 'Escape') onCancel(e);
    };

    btnConfirm?.addEventListener('click', onConfirm);
    btnCancel?.addEventListener('click', onCancel);
    inputEl?.addEventListener('keydown', onKeyDown);

    modal.style.setProperty('display', 'flex', 'important');
    modal.classList.add('is-open');
  });
}

function nativeConfirm(title, message, iconType = 'danger', confirmText = 'Delete', confirmColor = '#ff334b') {
  return showNativeDialog({ title, message, iconType, showInput: false, confirmText, confirmColor });
}

function nativePrompt(title, message, defaultValue = '', confirmText = 'Create') {
  return showNativeDialog({ title, message, iconType: 'project', showInput: true, inputValue: defaultValue, confirmText, confirmColor: '#00f0ff' });
}

// ==================== FEATURE 1: MULTI-PROJECT SAVE / LOAD SYSTEM ====================
const STORAGE_KEY_PROJECTS_LIST = 'magnates_projects_list';
let _currentProjectId = null;

function getAllProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS_LIST);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function saveAllProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS_LIST, JSON.stringify(projects));
  } catch(e) {}
}

function getCurrentProjectName() {
  return document.getElementById('current-project')?.textContent?.trim() || 'Untitled Project';
}

function saveCurrentProjectToLibrary(name, alertUser = false) {
  const projects = getAllProjects();
  const state = getSerializableClips();
  const projName = name || getCurrentProjectName();
  state.projectName = projName;
  state.savedAt = Date.now();

  if (_currentProjectId) {
    const idx = projects.findIndex(p => p.id === _currentProjectId);
    if (idx >= 0) {
      projects[idx] = { ...projects[idx], ...state };
      saveAllProjects(projects);
      try {
        localStorage.setItem('magnates_active_project_id', _currentProjectId);
        localStorage.setItem('magnates_active_project_name', projName);
      } catch(e) {}
      renderProjectsPanel();
      if (alertUser) {
        showTextTimingAlert?.(`Saved "${projName}"!`, 'success');
        setTimeout(() => showTextTimingAlert?.(''), 2000);
      }
      return;
    }
  }
  const id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  _currentProjectId = id;
  try {
    localStorage.setItem('magnates_active_project_id', id);
    localStorage.setItem('magnates_active_project_name', projName);
  } catch(e) {}
  projects.unshift({ id, ...state });
  saveAllProjects(projects);
  renderProjectsPanel();
  if (alertUser) {
    showTextTimingAlert?.(`Project "${projName}" saved to My Projects!`, 'success');
    setTimeout(() => showTextTimingAlert?.(''), 2000);
  }
}

// Explicit New Project creation: Creates fresh workspace and distinct library entry
function createNewProjectInLibrary(projectName) {
  const projects = getAllProjects();
  const id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const name = projectName?.trim() || 'Untitled Project';

  // Fresh initial clips state
  const freshClips = {
    text: [
      {
        id: 'clip-text-1',
        start: 0,
        duration: 5,
        text: 'Title of ' + name,
        highlight: name,
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
    quote: [],
    image: [],
    video: [],
    voiceover: [],
    music: [],
    background: [
      {
        id: 'clip-bg-default',
        start: 0,
        duration: 60,
        bgType: 'cyber_grid',
        bgColor: '#0a0b0e'
      }
    ]
  };

  const newProj = {
    id,
    projectName: name,
    savedAt: Date.now(),
    duration: 60,
    currentTime: 0,
    ...freshClips
  };

  // Add to projects list
  projects.unshift(newProj);
  saveAllProjects(projects);

  // Activate and load in editor
  _currentProjectId = id;
  timelineClips = freshClips;
  duration = 60;
  currentTime = 0;

  const nameEl = document.getElementById('current-project');
  if (nameEl) nameEl.textContent = name;
  const durBadge = document.getElementById('duration-badge');
  if (durBadge) durBadge.textContent = `00:00 / ${formatTime(duration)}`;

  renderAllTimelineTracks();
  renderProjectsPanel();
  saveProjectState(false);
  playSFX('whoosh', 0.6);
  showTextTimingAlert(`Created new project: "${name}"`, 'success');
  setTimeout(() => showTextTimingAlert(''), 2500);
}

function loadProjectFromLibrary(projectId) {
  const projects = getAllProjects();
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  _currentProjectId = proj.id;

  // Restore clips
  if (proj.text && proj.text.length > 0) timelineClips.text = JSON.parse(JSON.stringify(proj.text));
  else timelineClips.text = [];

  ['chart', 'image', 'video', 'voiceover', 'music'].forEach(t => {
    if (proj[t] && proj[t].length > 0) {
      timelineClips[t] = JSON.parse(JSON.stringify(proj[t]));
    } else {
      timelineClips[t] = [];
    }
  });

  if (typeof proj.duration === 'number') duration = proj.duration;
  if (typeof proj.currentTime === 'number') currentTime = proj.currentTime;

  const nameEl = document.getElementById('current-project');
  if (nameEl) nameEl.textContent = proj.projectName || 'Untitled Project';

  renderAllTimelineTracks();
  renderProjectsPanel();
  saveProjectState(false);
  playSFX('whoosh', 0.6);
  showTextTimingAlert(`Loaded project: "${proj.projectName}"`, 'success');
  setTimeout(() => showTextTimingAlert(''), 2500);
}

async function deleteProjectFromLibrary(projectId) {
  const projects = getAllProjects();
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  const confirmed = await nativeConfirm(
    'Delete Project',
    `Are you sure you want to delete "${proj.projectName}"? This action cannot be undone.`,
    'danger',
    'Delete Project',
    '#ff334b'
  );
  if (!confirmed) return;

  const remaining = projects.filter(p => p.id !== projectId);
  saveAllProjects(remaining);
  if (_currentProjectId === projectId) {
    _currentProjectId = null;
  }
  renderProjectsPanel();
  showTextTimingAlert(`Deleted project "${proj.projectName}"`, 'success');
  setTimeout(() => showTextTimingAlert(''), 2000);
}

function reuseProjectAsTemplate(projectId) {
  const projects = getAllProjects();
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  // Create clean duplicate state without modifying the original template
  const newId = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const clonedData = JSON.parse(JSON.stringify(proj));
  delete clonedData.id;

  const baseName = proj.projectName.replace(/\s*\(Copy.*?\)$/, '');
  const newName = `${baseName} (Copy)`;
  clonedData.projectName = newName;
  clonedData.savedAt = Date.now();

  // Insert as new project in library
  projects.unshift({ id: newId, ...clonedData });
  saveAllProjects(projects);

  // Load into active workspace as current project
  _currentProjectId = newId;
  if (clonedData.text && clonedData.text.length > 0) timelineClips.text = clonedData.text;
  ['chart', 'image', 'video', 'voiceover', 'music'].forEach(t => {
    if (clonedData[t] && clonedData[t].length > 0) timelineClips[t] = clonedData[t];
  });
  if (typeof clonedData.duration === 'number') duration = clonedData.duration;

  const nameEl = document.getElementById('current-project');
  if (nameEl) nameEl.textContent = newName;

  renderAllTimelineTracks();
  renderProjectsPanel();
  saveProjectState(false);
  playSFX('pop_cork', 0.8);
  showTextTimingAlert(`Template Reused! Opened new copy: "${newName}" (Original preserved)`, 'success');
  setTimeout(() => showTextTimingAlert(''), 3000);
}

function exportProjectToFile(projectId) {
  const projects = getAllProjects();
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  try {
    const exportData = {
      app: 'MagnatesStudio',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      project: proj
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const safeName = (proj.projectName || 'project').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();

    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    playSFX('camera_click', 0.7);
    showTextTimingAlert(`Saved "${proj.projectName}" to device as JSON!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2500);
  } catch (err) {
    console.error('Export failed', err);
    alert('Failed to export project: ' + err.message);
  }
}

async function renameProjectInLibrary(projectId) {
  const projects = getAllProjects();
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;
  const newName = await nativePrompt('Rename Project', 'Enter a new title for this project:', proj.projectName, 'Rename');
  if (!newName || !newName.trim()) return;

  proj.projectName = newName.trim();
  saveAllProjects(projects);
  if (_currentProjectId === projectId) {
    const nameEl = document.getElementById('current-project');
    if (nameEl) nameEl.textContent = proj.projectName;
    try { localStorage.setItem('magnates_active_project_name', proj.projectName); } catch(e) {}
    saveProjectState(false);
  }
  renderProjectsPanel();
  showTextTimingAlert('Renamed to "' + proj.projectName + '"', 'success');
  setTimeout(() => showTextTimingAlert(''), 2000);
}

function importProjectFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const proj = data.project || data;
      if (!proj || (!proj.text && !proj.image && !proj.video && !proj.projectName)) {
        alert('Invalid project file format.');
        return;
      }
      const newId = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const importedName = (proj.projectName || 'Imported Template') + ' (Imported)';
      const projects = getAllProjects();
      const newProj = {
        ...proj,
        id: newId,
        projectName: importedName,
        savedAt: Date.now()
      };
      projects.unshift(newProj);
      saveAllProjects(projects);
      renderProjectsPanel();
      playSFX('pop_cork', 0.85);
      showTextTimingAlert(`Imported "${importedName}"!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2500);
    } catch (err) {
      console.error('Import error', err);
      alert('Could not parse project file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// Global active project context menu
let _activeProjectDropdown = null;
function closeActiveProjectMenu() {
  if (_activeProjectDropdown) {
    _activeProjectDropdown.remove();
    _activeProjectDropdown = null;
  }
}
document.addEventListener('click', closeActiveProjectMenu);
document.addEventListener('contextmenu', (e) => {
  if (!e.target.closest('.project-card')) {
    closeActiveProjectMenu();
  }
});

function showProjectContextMenu(e, proj, cardEl) {
  e.preventDefault();
  e.stopPropagation();
  closeActiveProjectMenu();

  const dropdown = document.createElement('div');
  dropdown.className = 'project-menu-dropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.zIndex = '999999';

  dropdown.innerHTML = `
    <button class="project-menu-item highlight" data-act="reuse">
      <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      <span>Reuse as Template (Copy)</span>
    </button>
    <button class="project-menu-item" data-act="load">
      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      <span>Load Project</span>
    </button>
    <button class="project-menu-item" data-act="export">
      <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
      <span>Save to Device (.json)</span>
    </button>
    <button class="project-menu-item" data-act="rename">
      <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
      <span>Rename</span>
    </button>
    <div class="project-menu-divider"></div>
    <button class="project-menu-item danger" data-act="delete">
      <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      <span>Delete</span>
    </button>
  `;

  dropdown.querySelectorAll('.project-menu-item').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const act = btn.dataset.act;
      closeActiveProjectMenu();
      if (act === 'reuse') {
        reuseProjectAsTemplate(proj.id);
      } else if (act === 'load') {
        loadProjectFromLibrary(proj.id);
      } else if (act === 'export') {
        exportProjectToFile(proj.id);
      } else if (act === 'rename') {
        renameProjectInLibrary(proj.id);
      } else if (act === 'delete') {
        deleteProjectFromLibrary(proj.id);
      }
    });
  });

  document.body.appendChild(dropdown);
  _activeProjectDropdown = dropdown;

  // Calculate coordinates relative to viewport
  const triggerEl = e.currentTarget || e.target;
  let targetRect = null;
  if (triggerEl && typeof triggerEl.getBoundingClientRect === 'function') {
    targetRect = triggerEl.getBoundingClientRect();
  } else if (cardEl && typeof cardEl.getBoundingClientRect === 'function') {
    targetRect = cardEl.getBoundingClientRect();
  }

  const dropdownWidth = 185;
  let posX = (targetRect ? targetRect.right - dropdownWidth : e.clientX);
  let posY = (targetRect ? targetRect.bottom + 4 : e.clientY + 4);

  // Keep within viewport bounds
  if (posX + dropdownWidth > window.innerWidth - 10) {
    posX = window.innerWidth - dropdownWidth - 10;
  }
  if (posX < 10) posX = 10;
  if (posY + 220 > window.innerHeight) {
    posY = (targetRect ? targetRect.top - 225 : e.clientY - 225);
  }
  if (posY < 10) posY = 10;

  dropdown.style.left = `${posX}px`;
  dropdown.style.top = `${posY}px`;
}

function renderProjectsPanel() {
  const listEl = document.getElementById('projects-list');
  if (!listEl) return;
  const projects = getAllProjects();

  if (projects.length === 0) {
    listEl.innerHTML = '<div class="loading-spinner" style="font-size:11px;">No saved projects yet.<br>Click <b>New</b> to save current project as a reusable template.</div>';
    return;
  }

  listEl.innerHTML = '';
  projects.forEach(proj => {
    const isCurrent = proj.id === _currentProjectId;
    const savedDate = proj.savedAt ? new Date(proj.savedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const clipCount = (proj.image?.length || 0) + (proj.video?.length || 0) + (proj.text?.length || 0) + (proj.chart?.length || 0);

    const card = document.createElement('div');
    card.className = 'project-card apple-project-card' + (isCurrent ? ' is-current' : '');
    card.innerHTML = `
      <div class="apple-proj-left">
        <div class="apple-proj-icon-box">
          <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-8-2h8v-2h-8v2zm0-3h8V9h-8v2zm0-3h8V6h-8v2z"/></svg>
        </div>
        <div class="apple-proj-details">
          <div class="apple-proj-title-row">
            <span class="apple-proj-name" title="${proj.projectName}">${proj.projectName}</span>
            ${isCurrent ? '<span class="apple-proj-active-pill"><span class="apple-proj-dot"></span>Active</span>' : ''}
          </div>
          <div class="apple-proj-meta">
            <span>${savedDate}</span>
            <span class="apple-proj-dot-sep">•</span>
            <span>${clipCount} item${clipCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      <div class="apple-proj-actions">
        ${!isCurrent ? `
        <button class="apple-proj-icon-btn project-card-load-btn" title="Open Project">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>` : ''}
        <button class="apple-proj-icon-btn reuse-btn project-card-reuse-btn" title="Duplicate as Template">
          <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
        <button class="apple-proj-icon-btn delete-btn project-card-delete-btn" title="Delete / Remove Project">
          <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
        <button class="apple-proj-icon-btn menu-trigger-btn project-card-menu-btn" title="More Options">
          <svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>
    `;

    // Fast-access action buttons
    card.querySelector('.project-card-reuse-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      reuseProjectAsTemplate(proj.id);
    });
    card.querySelector('.project-card-load-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      loadProjectFromLibrary(proj.id);
    });
    card.querySelector('.project-card-delete-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteProjectFromLibrary(proj.id);
    });
    const menuBtn = card.querySelector('.project-card-menu-btn');
    menuBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showProjectContextMenu(e, proj, card);
    });

    // Clicking anywhere on card loads it
    card.addEventListener('click', () => {
      if (!isCurrent) {
        loadProjectFromLibrary(proj.id);
      }
    });

    // Right-click context menu support
    card.addEventListener('contextmenu', (e) => {
      showProjectContextMenu(e, proj, card);
    });

    listEl.appendChild(card);
  });
}

document.getElementById('btn-new-project')?.addEventListener('click', async () => {
  const name = await nativePrompt('Create New Project', 'Enter project title:', 'Untitled Project', 'Create Project');
  if (name && name.trim()) {
    createNewProjectInLibrary(name.trim());
  }
});

// Import Project File from Device listener
document.getElementById('btn-import-project')?.addEventListener('click', () => {
  document.getElementById('file-import-project')?.click();
});
document.getElementById('file-import-project')?.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    importProjectFromFile(e.target.files[0]);
    e.target.value = '';
  }
});

// Auto-save to project library periodically if a project ID is active
setInterval(() => {
  if (_currentProjectId) {
    saveCurrentProjectToLibrary(getCurrentProjectName());
  }
}, 5000);

// Initialize project library on start
(function initProjectLibraryStartup() {
  const projects = getAllProjects();

  // Helper: restore all clip tracks from a project entry into the live editor
  function restoreProjectClips(proj) {
    if (!proj) return;
    const nameEl = document.getElementById('current-project');
    if (nameEl && proj.projectName) nameEl.textContent = proj.projectName;
    if (proj.text && proj.text.length > 0) timelineClips.text = JSON.parse(JSON.stringify(proj.text));
    ['chart', 'image', 'video', 'voiceover', 'music', 'background'].forEach(t => {
      if (proj[t] && proj[t].length > 0) {
        timelineClips[t] = JSON.parse(JSON.stringify(proj[t]));
      } else if (t !== 'background') {
        timelineClips[t] = [];
      }
    });
    if (typeof proj.duration === 'number') {
      duration = proj.duration;
      const durBadge = document.getElementById('duration-badge');
      if (durBadge) durBadge.textContent = `00:00 / ${formatTime(duration)}`;
    }
  }

  if (projects.length === 0) {
    // If no project has been explicitly saved yet, seed current project into library so it appears in Projects
    saveCurrentProjectToLibrary(getCurrentProjectName(), false);
  } else {
    // If _currentProjectId was restored from localStorage, verify it exists in the library
    const matched = _currentProjectId ? projects.find(p => p.id === _currentProjectId) : null;
    if (matched) {
      // Only restore from project library if it has clips and we don't already have more recent clips loaded
      const hasExistingClips = (timelineClips.image && timelineClips.image.length > 0) || (timelineClips.text && timelineClips.text.length > 0);
      if (!hasExistingClips) {
        restoreProjectClips(matched);
        renderAllTimelineTracks();
      } else {
        // Update library entry with our current newer clips
        saveCurrentProjectToLibrary(getCurrentProjectName(), false);
      }
    } else {
      const savedId = localStorage.getItem('magnates_active_project_id');
      const foundSaved = savedId ? projects.find(p => p.id === savedId) : null;
      if (foundSaved) {
        _currentProjectId = foundSaved.id;
        restoreProjectClips(foundSaved);
        renderAllTimelineTracks();
      } else {
        // Fall back to the most recent project
        _currentProjectId = projects[0]?.id || null;
        if (projects[0]) {
          restoreProjectClips(projects[0]);
          renderAllTimelineTracks();
        }
      }
    }
  }
  renderProjectsPanel();

  // Allow clicking the project title in the top bar to rename it directly with instant auto-save
  const currentProjectEl = document.getElementById('current-project');
  if (currentProjectEl && !currentProjectEl.dataset.editableBound) {
    currentProjectEl.dataset.editableBound = 'true';
    currentProjectEl.style.cursor = 'pointer';
    currentProjectEl.title = 'Click to rename project';
    currentProjectEl.addEventListener('click', async () => {
      const cur = currentProjectEl.textContent.trim();
      const updated = await nativePrompt('Rename Project', 'Enter project name:', cur, 'Save');
      if (updated && updated.trim() && updated.trim() !== cur) {
        currentProjectEl.textContent = updated.trim();
        saveProjectState(false);
        renderProjectsPanel();
      }
    });
  }
})();

// ==================== FEATURE 2: IMAGE TRACK PICKER MODAL ====================
let _trackImageSelectedFiles = new Set();

function openTrackImagePickerModal() {
  const modal = document.getElementById('track-image-picker-modal');
  const grid = document.getElementById('track-image-library-grid');
  if (!modal || !grid) return;

  _trackImageSelectedFiles.clear();
  updateTrackImageSelectedCount();

  const imageFiles = (mediaFiles || []).filter(f => f.isImage);
  if (imageFiles.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; padding:20px; text-align:center; color:var(--text-muted); font-size:11px;">No images in media library yet. Upload using the button above!</div>';
  } else {
    grid.innerHTML = '';
    imageFiles.forEach(img => {
      const card = document.createElement('div');
      card.className = 'track-image-pick-card';
      card.innerHTML = `
        <div style="height:64px; overflow:hidden; background:#000; display:flex; align-items:center; justify-content:center;">
          <img src="${img.url}" alt="${img.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:4px 6px; font-size:9.5px; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:center;">${img.name}</div>
        <div class="check-badge">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
        </div>
      `;
      card.addEventListener('click', () => {
        card.classList.toggle('selected');
        if (card.classList.contains('selected')) {
          _trackImageSelectedFiles.add(img);
        } else {
          _trackImageSelectedFiles.delete(img);
        }
        updateTrackImageSelectedCount();
      });
      grid.appendChild(card);
    });
  }
  modal.style.display = 'flex';
}

function updateTrackImageSelectedCount() {
  const el = document.getElementById('track-image-selected-count');
  if (el) el.textContent = `${_trackImageSelectedFiles.size} selected`;
}

document.getElementById('btn-images-track-pick')?.addEventListener('click', (e) => {
  e.stopPropagation();
  openTrackImagePickerModal();
});

document.getElementById('btn-close-track-image-modal')?.addEventListener('click', () => {
  document.getElementById('track-image-picker-modal').style.display = 'none';
});
document.getElementById('btn-cancel-track-image-modal')?.addEventListener('click', () => {
  document.getElementById('track-image-picker-modal').style.display = 'none';
});

document.getElementById('btn-upload-track-image')?.addEventListener('click', () => {
  document.getElementById('input-track-image-upload')?.click();
});
document.getElementById('input-track-image-upload')?.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    uploadFiles(e.target.files);
    document.getElementById('track-image-picker-modal').style.display = 'none';
    showTextTimingAlert('Uploading images...', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  }
});

document.getElementById('btn-add-selected-images')?.addEventListener('click', () => {
  if (_trackImageSelectedFiles.size === 0) {
    showTextTimingAlert('Please select at least one image.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
    return;
  }

  // Determine starting insertion point:
  // If track already has clips, insert at the end of the existing clips or at currentTime, whichever makes sense
  const existingImages = timelineClips.image || [];
  let insertTime = currentTime;

  // If currentTime is far beyond or behind, or if inserting from track header, place right after existing image clips if any, or at currentTime
  if (existingImages.length > 0 && Math.abs(insertTime - 0) < 0.05) {
    const lastClipEnd = Math.max(...existingImages.map(c => c.start + c.duration));
    insertTime = lastClipEnd > 0 ? lastClipEnd + 0.1 : 0;
  }

  const initialInsertTime = insertTime;
  const clipDuration = 6.0;
  let firstAddedClip = null;

  _trackImageSelectedFiles.forEach(file => {
    const clip = addClipToTimeline('image', file, insertTime, clipDuration);
    if (!firstAddedClip) firstAddedClip = clip;
    insertTime += clipDuration;
  });

  // Ensure total project duration accommodates all new clips
  const neededDuration = insertTime + 10;
  if (neededDuration > duration) {
    duration = Math.max(duration, Math.ceil(neededDuration));
    const durBadge = document.getElementById('duration-badge');
    if (durBadge) durBadge.textContent = `00:00 / ${formatTime(duration)}`;
    if (typeof drawTimeRuler === 'function') drawTimeRuler();
  }

  // Re-render tracks and transitions
  renderAllTimelineTracks();
  if (typeof injectTransitionChips === 'function') injectTransitionChips();

  // Select first added clip and focus preview
  if (firstAddedClip) {
    selectClip(firstAddedClip, 'image');
    seekToTime(initialInsertTime);

    // Scroll timeline to make the new clips immediately visible
    const tracksContainer = document.getElementById('timeline-tracks');
    if (tracksContainer) {
      const targetScroll = Math.max(0, (initialInsertTime * pps) - 40);
      tracksContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }

  recordState('Add Images from Picker');
  document.getElementById('track-image-picker-modal').style.display = 'none';
  showTextTimingAlert('Added ' + _trackImageSelectedFiles.size + ' image(s) to timeline!', 'success');
  setTimeout(() => showTextTimingAlert(''), 2500);
});

// ==================== FEATURE 3: TRANSITIONS BETWEEN CLIPS ====================
const TRANSITION_TYPES = {
  none:             { label: 'None (Cut)',                duration: 0 },
  fly_through:      { label: '3D Fly-Through',          duration: 0.7, sfx: 'whoosh' },
  directional_push: { label: 'Directional Push / Under', duration: 0.7, sfx: 'whoosh' },
  morph_cut:        { label: 'Morph Cut',              duration: 0.6, sfx: 'whoosh' },
  mask_reveal:      { label: 'Foreground Reveal',      duration: 0.6, sfx: 'whoosh' },
  fade:             { label: 'Fade',                      duration: 0.5 },
  slide_left:       { label: 'Slide Left',                duration: 0.5 },
  slide_right:      { label: 'Slide Right',               duration: 0.5 },
  zoom_in:          { label: 'Zoom In',                   duration: 0.5 },
  zoom_out:         { label: 'Zoom Out',                  duration: 0.5 },
  wipe_left:        { label: 'Wipe Left',                 duration: 0.5 },
  dissolve:         { label: 'Dissolve',                  duration: 0.6 },
  flash:            { label: 'Flash Cut',                 duration: 0.25 },
  dip_black:        { label: 'Dip to Black',              duration: 0.6 },
  paper_drop:       { label: 'Paper Drop',                duration: 0.7, sfx: 'paper' }
};

let _transitionEditContext = null;

function injectTransitionChips() {
  document.querySelectorAll('.transition-chip').forEach(c => c.remove());

  const tracksToProcess = [
    { type: 'video', container: document.getElementById('content-video') },
    { type: 'image', container: document.getElementById('content-image') }
  ];

  tracksToProcess.forEach(({ type, container }) => {
    if (!container) return;
    const clips = (timelineClips[type] || []).slice().sort((a, b) => a.start - b.start);
    if (clips.length < 2) return;

    for (let i = 0; i < clips.length - 1; i++) {
      const clipA = clips[i];
      const clipB = clips[i + 1];
      const cutTimeA = clipA.start + clipA.duration;
      const cutTimeB = clipB.start;

      // Check if clips are adjacent or nearly adjacent (gap < 0.45s)
      if (Math.abs(cutTimeA - cutTimeB) < 0.45) {
        const boundaryTime = cutTimeB;
        const chip = document.createElement('div');
        chip.className = 'transition-chip';
        const hasTrans = clipB.transition && clipB.transition !== 'none';
        if (hasTrans) chip.classList.add('has-transition');

        const isSelected = selectedTransitionId && selectedTransitionId.clipId === clipB.id && selectedTransitionId.trackType === type;
        if (isSelected) chip.classList.add('is-selected-transition');

        chip.style.left = `${boundaryTime * pps}px`;

        const transConfig = TRANSITION_TYPES[clipB.transition] || null;
        const labelText = hasTrans ? `${transConfig?.label || clipB.transition} ${(clipB.transitionDuration || 0.5).toFixed(1)}s` : 'Add Transition';

        chip.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span class="transition-chip-label">${labelText}</span>
        `;

        chip.title = hasTrans ? `Transition: ${transConfig?.label || clipB.transition} (Click to edit)` : 'Click to add cut transition';

        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedTransitionId = { clipId: clipB.id, trackType: type };
          document.querySelectorAll('.transition-chip').forEach(c => c.classList.remove('is-selected-transition'));
          chip.classList.add('is-selected-transition');
          openTransitionModal(clipB, type);
        });

        container.appendChild(chip);
      }
    }
  });
}

function openTransitionModal(clip, trackType) {
  _transitionEditContext = { clip, trackType, originalStart: clip.start };

  const modal = document.getElementById('transition-picker-modal');
  if (!modal) return;

  const currentTransition = clip.transition || 'none';
  document.querySelectorAll('.transition-card').forEach(c => {
    c.classList.toggle('active', c.dataset.transition === currentTransition);
  });

  const currentSfx = clip.transitionSfx || 'none';
  document.querySelectorAll('.sfx-card').forEach(c => {
    c.classList.toggle('active', c.dataset.sfx === currentSfx);
  });

  const currentDuration = clip.transitionDuration || 0.5;
  const slider = document.getElementById('transition-duration-slider');
  if (slider) slider.value = Math.round(currentDuration * 10);
  const durVal = document.getElementById('transition-duration-val');
  if (durVal) durVal.textContent = currentDuration.toFixed(1) + 's';

  // Timeline Placement (Trigger Point) synchronization
  const timeSlider = document.getElementById('transition-time-slider');
  const timeInput = document.getElementById('transition-time-input');
  const timeLabel = document.getElementById('transition-time-preview-label');
  const maxTimeline = Math.max(10, duration || 30);
  if (timeSlider) {
    timeSlider.max = Math.round(maxTimeline * 10);
    timeSlider.value = Math.round(clip.start * 10);
  }
  if (timeInput) timeInput.value = formatTimecode(clip.start);
  if (timeLabel) timeLabel.textContent = clip.start.toFixed(1) + 's';

  // Seek playhead to this transition point so user can immediately view/scrub it
  seekToTime(clip.start);
  updateTransitionModalThumbnails(clip.start);

  modal.style.display = 'flex';
}

// Render Outgoing (Clip A) and Incoming (Clip B) visual frames in the transition modal
function updateTransitionModalThumbnails(sec) {
  const canvasA = document.getElementById('trans-canvas-a');
  const canvasB = document.getElementById('trans-canvas-b');
  const labelA = document.getElementById('trans-label-a');
  const labelB = document.getElementById('trans-label-b');
  const timeA = document.getElementById('trans-preview-a-time');
  const timeB = document.getElementById('trans-preview-b-time');

  if (!canvasA || !canvasB) return;
  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');

  const w = canvasA.width;
  const h = canvasA.height;

  // Clear previews
  ctxA.fillStyle = '#0f1118';
  ctxA.fillRect(0, 0, w, h);
  ctxB.fillStyle = '#0f1118';
  ctxB.fillRect(0, 0, w, h);

  // Time labels
  const timeA_sec = Math.max(0, sec - 0.05);
  const timeB_sec = sec + 0.05;
  if (timeA) timeA.textContent = formatTimecode(timeA_sec);
  if (timeB) timeB.textContent = formatTimecode(timeB_sec);

  // Find visual clips for Clip A (outgoing, just before/at transition point)
  // and Clip B (incoming, at/just after transition point)
  const visualClips = [
    ...(timelineClips.video || []).map(c => ({ ...c, kind: 'video' })),
    ...(timelineClips.image || []).map(c => ({ ...c, kind: 'image' }))
  ].sort((a, b) => a.start - b.start);

  // Outgoing clip: clip that covers or ends right before this point
  let clipA = visualClips.filter(c => c.start <= sec && (c.start + c.duration) >= sec - 0.001).pop();
  if (!clipA) {
    clipA = visualClips.filter(c => (c.start + c.duration) <= sec).pop();
  }

  // Incoming clip: clip that covers or starts right at/after this point
  let clipB = visualClips.find(c => c.start >= sec - 0.001);
  if (!clipB) {
    clipB = visualClips.find(c => c.start <= sec && (c.start + c.duration) > sec);
  }

  // Draw Clip A
  if (clipA && clipA.file) {
    const elA = getMediaElement(clipA.file);
    if (elA) {
      try {
        if (clipA.kind === 'video' && elA.duration) {
          const frameTime = Math.max(0, Math.min(elA.duration, (sec - clipA.start)));
          elA.currentTime = frameTime;
        }
        ctxA.drawImage(elA, 0, 0, w, h);
      } catch (e) {}
    }
    if (labelA) labelA.textContent = clipA.file.name || 'Clip A';
  } else {
    // Draw placeholder
    ctxA.fillStyle = '#1e2230';
    ctxA.fillRect(0, 0, w, h);
    ctxA.fillStyle = '#64748b';
    ctxA.font = '10px Inter, sans-serif';
    ctxA.textAlign = 'center';
    ctxA.fillText('No preceding clip', w / 2, h / 2 + 3);
    if (labelA) labelA.textContent = 'None';
  }

  // Draw Clip B
  if (clipB && clipB.file) {
    const elB = getMediaElement(clipB.file);
    if (elB) {
      try {
        if (clipB.kind === 'video' && elB.duration) {
          const frameTime = Math.max(0, Math.min(elB.duration, (Math.max(0, sec - clipB.start))));
          elB.currentTime = frameTime;
        }
        ctxB.drawImage(elB, 0, 0, w, h);
      } catch (e) {}
    }
    if (labelB) labelB.textContent = clipB.file.name || 'Clip B';
  } else {
    // Draw placeholder
    ctxB.fillStyle = '#1e2230';
    ctxB.fillRect(0, 0, w, h);
    ctxB.fillStyle = '#64748b';
    ctxB.font = '10px Inter, sans-serif';
    ctxB.textAlign = 'center';
    ctxB.fillText('No following clip', w / 2, h / 2 + 3);
    if (labelB) labelB.textContent = 'None';
  }
}

document.querySelectorAll('.transition-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.transition-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const tr = card.dataset.transition;
    if (tr && TRANSITION_TYPES[tr]) {
      const defDur = TRANSITION_TYPES[tr].duration;
      const defSfx = TRANSITION_TYPES[tr].sfx;
      const durationSlider = document.getElementById('transition-duration-slider');
      const durVal = document.getElementById('transition-duration-val');
      if (durationSlider && defDur !== undefined && defDur > 0) {
        durationSlider.value = Math.round(defDur * 10);
        if (durVal) durVal.textContent = defDur.toFixed(1) + 's';
      }
      if (defSfx) {
        document.querySelectorAll('.sfx-card').forEach(s => {
          s.classList.toggle('active', s.dataset.sfx === defSfx);
        });
      }
    }
  });
});

document.querySelectorAll('.sfx-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.sfx-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const sfx = card.dataset.sfx || 'none';
    if (sfx !== 'none') {
      playTransitionSfx(sfx);
    }
  });
});

document.getElementById('transition-duration-slider')?.addEventListener('input', (e) => {
  const val = parseInt(e.target.value) / 10;
  const el = document.getElementById('transition-duration-val');
  if (el) el.textContent = val.toFixed(1) + 's';
});

// Interactive Timeline Seek and Placement within Transition Modal
document.getElementById('transition-time-slider')?.addEventListener('input', (e) => {
  const sec = parseInt(e.target.value) / 10;
  const inputEl = document.getElementById('transition-time-input');
  const labelEl = document.getElementById('transition-time-preview-label');
  if (inputEl) inputEl.value = formatTimecode(sec);
  if (labelEl) labelEl.textContent = sec.toFixed(1) + 's';
  seekToTime(sec);
  updateTransitionModalThumbnails(sec);
  if (_transitionEditContext && _transitionEditContext.clip) {
    _transitionEditContext.clip.start = sec;
    renderAllTimelineTracks();
  }
});

document.getElementById('transition-time-input')?.addEventListener('change', (e) => {
  const parts = e.target.value.split(':');
  let sec = 0;
  if (parts.length === 2) {
    sec = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  } else {
    sec = parseFloat(e.target.value) || 0;
  }
  sec = Math.max(0, Math.min(duration, sec));
  const sliderEl = document.getElementById('transition-time-slider');
  const labelEl = document.getElementById('transition-time-preview-label');
  if (sliderEl) sliderEl.value = Math.round(sec * 10);
  if (labelEl) labelEl.textContent = sec.toFixed(1) + 's';
  e.target.value = formatTimecode(sec);
  seekToTime(sec);
  updateTransitionModalThumbnails(sec);
  if (_transitionEditContext && _transitionEditContext.clip) {
    _transitionEditContext.clip.start = sec;
    renderAllTimelineTracks();
  }
});

document.getElementById('btn-transition-seek-playhead')?.addEventListener('click', () => {
  const sec = parseFloat(currentTime.toFixed(1));
  const sliderEl = document.getElementById('transition-time-slider');
  const inputEl = document.getElementById('transition-time-input');
  const labelEl = document.getElementById('transition-time-preview-label');
  if (sliderEl) sliderEl.value = Math.round(sec * 10);
  if (inputEl) inputEl.value = formatTimecode(sec);
  if (labelEl) labelEl.textContent = sec.toFixed(1) + 's';
  seekToTime(sec);
  updateTransitionModalThumbnails(sec);
  if (_transitionEditContext && _transitionEditContext.clip) {
    _transitionEditContext.clip.start = sec;
    renderAllTimelineTracks();
    showTextTimingAlert('Transition snapped to playhead (' + formatTimecode(sec) + ')', 'info');
    setTimeout(() => showTextTimingAlert(''), 1500);
  }
});

// Snap to Nearest Cut Button (Pareto Feature: Snaps exactly to clip boundary)
document.getElementById('btn-transition-snap-cut')?.addEventListener('click', () => {
  const allClips = [
    ...(timelineClips.video || []),
    ...(timelineClips.image || [])
  ];

  if (allClips.length === 0) return;

  // Cut points are start times and end times of all clips
  const cutPoints = [];
  allClips.forEach(c => {
    cutPoints.push(c.start);
    cutPoints.push(c.start + c.duration);
  });

  const target = _transitionEditContext?.clip?.start ?? currentTime;
  // Find nearest cut point
  let nearest = cutPoints[0];
  let minDiff = Math.abs(target - nearest);
  for (const pt of cutPoints) {
    const diff = Math.abs(target - pt);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = pt;
    }
  }

  const sec = parseFloat(nearest.toFixed(1));
  const sliderEl = document.getElementById('transition-time-slider');
  const inputEl = document.getElementById('transition-time-input');
  const labelEl = document.getElementById('transition-time-preview-label');
  if (sliderEl) sliderEl.value = Math.round(sec * 10);
  if (inputEl) inputEl.value = formatTimecode(sec);
  if (labelEl) labelEl.textContent = sec.toFixed(1) + 's';

  seekToTime(sec);
  updateTransitionModalThumbnails(sec);

  if (_transitionEditContext && _transitionEditContext.clip) {
    _transitionEditContext.clip.start = sec;
    renderAllTimelineTracks();
    showTextTimingAlert('Snapped to nearest clip cutpoint (' + formatTimecode(sec) + ')', 'success');
    setTimeout(() => showTextTimingAlert(''), 1500);
  }
});

document.getElementById('btn-apply-transition')?.addEventListener('click', () => {
  if (!_transitionEditContext) return;
  const { clip, trackType } = _transitionEditContext;

  const activeCard = document.querySelector('.transition-card.active');
  const activeSfx = document.querySelector('.sfx-card.active');
  const durationSlider = document.getElementById('transition-duration-slider');
  const timeSlider = document.getElementById('transition-time-slider');

  clip.transition = activeCard?.dataset.transition || 'none';
  clip.transitionSfx = activeSfx?.dataset.sfx || 'none';
  clip.transitionDuration = durationSlider ? parseInt(durationSlider.value) / 10 : 0.5;
  if (timeSlider) {
    clip.start = parseInt(timeSlider.value) / 10;
  }

  // Play SFX immediately on apply so user gets acoustic confirmation
  if (clip.transitionSfx && clip.transitionSfx !== 'none') {
    playTransitionSfx(clip.transitionSfx);
  }

  document.getElementById('transition-picker-modal').style.display = 'none';
  timelineClips[trackType]?.sort((a, b) => a.start - b.start);
  renderAllTimelineTracks();
  recordState('Set Transition');
  saveProjectState(false);
  showTextTimingAlert('Transition applied: ' + (TRANSITION_TYPES[clip.transition]?.label || clip.transition), 'success');
  setTimeout(() => showTextTimingAlert(''), 2000);
});

document.getElementById('btn-close-transition-modal')?.addEventListener('click', () => {
  document.getElementById('transition-picker-modal').style.display = 'none';
});
document.getElementById('btn-cancel-transition-modal')?.addEventListener('click', () => {
  if (_transitionEditContext && _transitionEditContext.originalStart !== undefined) {
    _transitionEditContext.clip.start = _transitionEditContext.originalStart;
    renderAllTimelineTracks();
  }
  document.getElementById('transition-picker-modal').style.display = 'none';
});

// Sound effects synthesizer via Web Audio API using shared AudioContext
function playTransitionSfx(sfxType) {
  if (!sfxType || sfxType === 'none') return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  // Route through master playSFX if supported or specialized synthesized FX
  if (sfxType === 'whoosh') {
    playSFX('whoosh', 0.85);
    return;
  }
  if (sfxType === 'camera') {
    playSFX('camera_click', 0.85);
    return;
  }
  if (sfxType === 'paper' || sfxType === 'tear') {
    playPaperTearSfx(ctx);
    return;
  }

  switch (sfxType) {
    case 'typewriter':
      playTypewriterSfx(ctx);
      break;
    case 'click':
      playUiClickSfx(ctx);
      break;
    case 'film_reel':
      playFilmReelSfx(ctx);
      break;
    default:
      playSFX(sfxType, 0.8);
      break;
  }
}

function playPaperTearSfx(ctx) {
  const now = ctx.currentTime;
  const dur = 0.5;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let j = 0; j < data.length; j++) {
    // Textured friction noise
    data[j] = (Math.random() * 2 - 1) * Math.sin(j / 20) * Math.exp(-j / (ctx.sampleRate * 0.35));
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(800, now);
  f.frequency.linearRampToValueAtTime(3200, now + 0.25);
  f.frequency.linearRampToValueAtTime(1200, now + dur);
  f.Q.value = 2.0;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.01, now);
  g.gain.linearRampToValueAtTime(0.7, now + 0.12);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);

  src.connect(f);
  f.connect(g);
  g.connect(ctx.destination);
  src.start(now);
}

function playTypewriterSfx(ctx) {
  const clicks = 8;
  for (let i = 0; i < clicks; i++) {
    setTimeout(() => {
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < data.length; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.01));
      }
      const source = ctx.createBufferSource();
      source.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800 + Math.random() * 400;
      filter.Q.value = 2;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    }, i * 55 + Math.random() * 20);
  }
}

function playCameraClickSfx(ctx) {
  const now = ctx.currentTime;
  const buf1 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.1), ctx.sampleRate);
  const data1 = buf1.getChannelData(0);
  for (let j = 0; j < data1.length; j++) {
    data1[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.025));
  }
  const src1 = ctx.createBufferSource();
  src1.buffer = buf1;
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.5, now);
  const f1 = ctx.createBiquadFilter();
  f1.type = 'lowpass';
  f1.frequency.value = 300;
  src1.connect(f1); f1.connect(g1); g1.connect(ctx.destination);
  src1.start(now);

  const buf2 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
  const data2 = buf2.getChannelData(0);
  for (let j = 0; j < data2.length; j++) {
    data2[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.008));
  }
  const src2 = ctx.createBufferSource();
  src2.buffer = buf2;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.4, now + 0.03);
  const f2 = ctx.createBiquadFilter();
  f2.type = 'bandpass';
  f2.frequency.value = 4000;
  f2.Q.value = 1;
  src2.connect(f2); f2.connect(g2); g2.connect(ctx.destination);
  src2.start(now + 0.03);
}

function playWhooshSfx(ctx) {
  const now = ctx.currentTime;
  const dur = 0.4;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let j = 0; j < data.length; j++) {
    data[j] = (Math.random() * 2 - 1);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(3000, now + dur * 0.7);
  filter.frequency.exponentialRampToValueAtTime(200, now + dur);
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.5, now + dur * 0.3);
  gain.gain.linearRampToValueAtTime(0, now + dur);
  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.start(now);
}

function playUiClickSfx(ctx) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.08);
}

function playFilmReelSfx(ctx) {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < data.length; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.006));
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.35, ctx.currentTime);
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 1200;
      src.connect(f); f.connect(g); g.connect(ctx.destination);
      src.start();
    }, i * 80);
  }
}

document.getElementById('btn-preview-sfx')?.addEventListener('click', () => {
  const active = document.querySelector('.sfx-card.active');
  const sfx = active?.dataset.sfx || 'none';
  if (sfx === 'none') {
    const lbl = document.getElementById('sfx-preview-label');
    if (lbl) lbl.textContent = 'No sound selected';
  } else {
    playTransitionSfx(sfx);
    const lbl = document.getElementById('sfx-preview-label');
    if (lbl) lbl.textContent = 'Playing...';
    setTimeout(() => {
      if (lbl) lbl.textContent = 'Click to hear selected sound';
    }, 1500);
  }
});

function applyTransitionEffect(ctx, w, h, transitionType, progress, nextClip) {
  if (!transitionType || transitionType === 'none' || progress <= 0 || progress >= 1) return;

  // Resolve preceding clip (Clip A) and incoming clip (Clip B)
  let prevClip = null;
  if (nextClip) {
    const allClips = [...(timelineClips.video || []), ...(timelineClips.image || [])].sort((a, b) => a.start - b.start);
    const idx = allClips.findIndex(c => c.id === nextClip.id);
    if (idx > 0) {
      prevClip = allClips[idx - 1];
    }
  }

  const drawClipMedia = (clip, scale = 1, alpha = 1, offX = 0, offY = 0) => {
    if (!clip || !clip.file) return;
    const el = getMediaElement(clip.file);
    if (!el) return;
    const nw = el.naturalWidth || el.videoWidth || w;
    const nh = el.naturalHeight || el.videoHeight || h;
    if (!nw || !nh) return;
    const s = Math.max(w / nw, h / nh) * scale;
    const dw = nw * s;
    const dh = nh * s;
    const dx = (w - dw) / 2 + offX;
    const dy = (h - dh) / 2 + offY;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.drawImage(el, dx, dy, dw, dh);
    ctx.restore();
  };

  ctx.save();
  switch(transitionType) {
    case 'fly_through': {
      // 3D Camera Fly-Through / Seamless Zoom-Through (Magnates Media signature transition)
      // Outgoing image zooms forward towards viewer; incoming image emerges from depth before outgoing vanishes
      const p = progress;
      const dir = nextClip?.transitionDirection || 'center';

      const scaleA = 1.0 + Math.pow(p, 1.6) * 1.5;
      const alphaA = p < 0.35 ? 1 : Math.max(0, 1 - (p - 0.35) / 0.45);

      const easeOutB = 1 - Math.pow(1 - p, 2.2);
      const scaleB = 0.45 + 0.55 * easeOutB;
      const alphaB = p < 0.15 ? 0 : Math.min(1, (p - 0.15) / 0.5);

      // Angled directional depth drift if direction is set
      let offX_B = 0, offY_B = 0;
      if (dir === 'left') offX_B = -w * 0.25 * (1 - easeOutB);
      else if (dir === 'right') offX_B = w * 0.25 * (1 - easeOutB);
      else if (dir === 'up') offY_B = -h * 0.25 * (1 - easeOutB);
      else if (dir === 'down') offY_B = h * 0.25 * (1 - easeOutB);

      if (prevClip) {
        drawClipMedia(prevClip, scaleA, alphaA);
      }
      if (nextClip) {
        drawClipMedia(nextClip, scaleB, alphaB, offX_B, offY_B);
      }

      // Radial speed blur lines & dynamic lens bloom at peak transition
      const peak = Math.sin(p * Math.PI);
      if (peak > 0.05) {
        ctx.save();
        const radGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.7);
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${0.2 * peak})`);
        radGrad.addColorStop(0.35, 'transparent');
        radGrad.addColorStop(1, `rgba(0, 0, 0, ${0.45 * peak})`);
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * peak})`;
        ctx.lineWidth = 1.5;
        const cx = w / 2;
        const cy = h / 2;
        for (let a = 0; a < 12; a++) {
          const angle = (a / 12) * Math.PI * 2;
          const r1 = Math.min(w, h) * 0.22;
          const r2 = Math.max(w, h) * 0.65;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.stroke();
        }
        ctx.restore();
      }
      break;
    }
    case 'directional_push':
    case 'slide_left':
    case 'slide_right': {
      // Directional Slide & Underneath Layer Overlap (Magnates YouTuber style)
      // The user can choose the incoming direction (left, right, up, down)
      // and whether Image 2 appears right UNDER Image 1 while Image 1 moves, or pushes over top!
      const p = progress;
      const dir = nextClip?.transitionDirection || (transitionType === 'slide_left' ? 'left' : (transitionType === 'slide_right' ? 'right' : 'left'));
      const mode = nextClip?.transitionMode || 'underneath';

      const easeOut = 1 - Math.pow(1 - p, 2.5);
      const easeIn = Math.pow(p, 1.8);

      let offX_A = 0, offY_A = 0;
      let offX_B = 0, offY_B = 0;

      if (dir === 'left') {
        offX_B = -w * (1 - easeOut);
        offX_A = easeIn * (w * 0.38);
      } else if (dir === 'right') {
        offX_B = w * (1 - easeOut);
        offX_A = -easeIn * (w * 0.38);
      } else if (dir === 'up') {
        offY_B = -h * (1 - easeOut);
        offY_A = easeIn * (h * 0.38);
      } else if (dir === 'down') {
        offY_B = h * (1 - easeOut);
        offY_A = -easeIn * (h * 0.38);
      } else if (dir === 'custom') {
        const rad = ((nextClip?.transitionAngle !== undefined ? nextClip.transitionAngle : 45) * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        offX_B = cos * w * (1 - easeOut);
        offY_B = sin * h * (1 - easeOut);
        offX_A = -cos * easeIn * (w * 0.38);
        offY_A = -sin * easeIn * (h * 0.38);
      } else {
        // Center / Depth Push
        const scaleA = 1.0 + easeIn * 0.6;
        const scaleB = 0.55 + 0.45 * easeOut;
        if (prevClip) drawClipMedia(prevClip, scaleA, Math.max(0, 1 - p * 1.3));
        if (nextClip) drawClipMedia(nextClip, scaleB, Math.min(1, p * 1.5));
        break;
      }

      // Outgoing Clip A fades out after Clip B is already visible underneath!
      const alphaA = p < 0.35 ? 1 : Math.max(0, 1 - (p - 0.35) / 0.55);
      const alphaB = Math.min(1, p / 0.15);

      if (mode === 'underneath') {
        // Clip B is rendered UNDERNEATH Clip A
        if (nextClip) {
          drawClipMedia(nextClip, 1, alphaB, offX_B, offY_B);
        }
        if (prevClip) {
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 32;
          drawClipMedia(prevClip, 1, alphaA, offX_A, offY_A);
          ctx.restore();
        }
      } else {
        // Clip B pushes OVER TOP of Clip A
        if (prevClip) {
          drawClipMedia(prevClip, 1, alphaA, offX_A, offY_A);
        }
        if (nextClip) {
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 32;
          drawClipMedia(nextClip, 1, alphaB, offX_B, offY_B);
          ctx.restore();
        }
      }

      // Dynamic directional motion blur streak in transition center
      const midPeak = Math.sin(p * Math.PI);
      if (midPeak > 0.08) {
        ctx.save();
        ctx.globalAlpha = midPeak * 0.12;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
      break;
    }
    case 'morph_cut': {
      // Morph Cut / Seamless Cut: Optical flow cross-blend with micro directional warp
      const p = progress;
      const scaleA = 1.0 + p * 0.06;
      const scaleB = 0.94 + p * 0.06;
      const alphaA = 1 - p;
      const alphaB = p;

      if (prevClip) {
        drawClipMedia(prevClip, scaleA, alphaA);
      }
      if (nextClip) {
        drawClipMedia(nextClip, scaleB, alphaB);
      }

      const smear = Math.sin(p * Math.PI) * 0.22;
      if (smear > 0.01) {
        ctx.save();
        ctx.globalAlpha = smear;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
      break;
    }
    case 'mask_reveal': {
      // Foreground / Split Reveal Wipe with 3D drop shadow and direction support
      const p = 1 - Math.pow(1 - progress, 2.4);
      const dir = nextClip?.transitionDirection || 'left';

      if (prevClip) {
        drawClipMedia(prevClip, 1, 1);
      }
      if (nextClip) {
        ctx.save();
        ctx.beginPath();
        if (dir === 'right') {
          const splitX = w * (1 - p);
          ctx.rect(splitX, 0, w - splitX, h);
          ctx.clip();
          drawClipMedia(nextClip, 1, 1);
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetX = -6;
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, h);
          ctx.stroke();
        } else if (dir === 'up') {
          const splitY = h * p;
          ctx.rect(0, 0, w, splitY);
          ctx.clip();
          drawClipMedia(nextClip, 1, 1);
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 6;
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, splitY);
          ctx.lineTo(w, splitY);
          ctx.stroke();
        } else if (dir === 'down') {
          const splitY = h * (1 - p);
          ctx.rect(0, splitY, w, h - splitY);
          ctx.clip();
          drawClipMedia(nextClip, 1, 1);
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = -6;
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, splitY);
          ctx.lineTo(w, splitY);
          ctx.stroke();
        } else {
          // Default: from left
          const splitX = w * p;
          ctx.rect(0, 0, splitX, h);
          ctx.clip();
          drawClipMedia(nextClip, 1, 1);
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetX = 6;
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, h);
          ctx.stroke();
        }
        ctx.restore();
      }
      break;
    }
    case 'fade':
      ctx.globalAlpha = Math.sin(progress * Math.PI);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      break;
    case 'flash':
      ctx.globalAlpha = Math.sin(progress * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      break;
    case 'dip_black':
      if (progress < 0.5) {
        ctx.globalAlpha = progress * 2;
      } else {
        ctx.globalAlpha = (1 - progress) * 2;
      }
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      break;
    case 'wipe_left': {
      const wipeX = w * (1 - progress);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, wipeX, h);
      break;
    }
    case 'dissolve':
      ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.6;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      break;
    case 'paper_drop': {
      // Realistic Ripped Paper Sheet / Poster Wrap Dropdown Transition (YouTuber style)
      // Fast drop with elastic settle at the end
      const easeProgress = 1 - Math.pow(1 - progress, 2.8);
      const dropY = (h + 160) * easeProgress - 80;

      // 1. Build the jagged ripped torn edge path
      const steps = 48;
      const stepW = w / steps;
      const tornPoints = [];
      for (let i = 0; i <= steps; i++) {
        const px = i * stepW;
        // Natural jagged paper tear harmonics
        const tearOffset = Math.sin(i * 1.85) * 16 + Math.cos(i * 3.4) * 10 + Math.sin(i * 7.1) * 6 + Math.cos(i * 11.2) * 3;
        tornPoints.push({ x: px, y: dropY + tearOffset });
      }

      // 2. Draw deep heavy drop shadow beneath the torn sheet onto previous scene
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.88)';
      ctx.shadowBlur = 38;
      ctx.shadowOffsetY = 18;
      ctx.beginPath();
      ctx.moveTo(-20, -20);
      ctx.lineTo(w + 20, -20);
      ctx.lineTo(w + 20, dropY + 20);
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(tornPoints[i].x, tornPoints[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = '#080808';
      ctx.fill();
      ctx.restore();

      // 3. Draw outer white torn paper fiber border (the rough ripped margin)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, dropY + 8);
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(tornPoints[i].x, tornPoints[i].y + 8);
      }
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // 4. Draw main paper body & content reveal mask
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, dropY);
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(tornPoints[i].x, tornPoints[i].y);
      }
      ctx.closePath();
      ctx.clip(); // Mask everything inside the dropped paper sheet!

      // Base paper texture: vintage cream parchment with subtle paper grain & gradient fold
      const paperGrad = ctx.createLinearGradient(0, 0, 0, dropY);
      paperGrad.addColorStop(0, '#f9f6ef');
      paperGrad.addColorStop(0.85, '#f3ede0');
      paperGrad.addColorStop(1, '#e4dbc7');
      ctx.fillStyle = paperGrad;
      ctx.fillRect(0, 0, w, h);

      // Crumpled paper fold shading / creases
      ctx.save();
      ctx.globalAlpha = 0.09;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      for (let cr = 0; cr < 8; cr++) {
        const cx1 = (w * 0.12) * cr;
        const cy1 = 0;
        const cx2 = cx1 + Math.sin(cr * 2.3) * 60;
        const cy2 = dropY;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.stroke();
      }
      ctx.restore();

      // If nextClip has image/media or graphic, render it inside the torn paper mask!
      if (nextClip && nextClip.file) {
        const mediaEl = getMediaElement(nextClip.file);
        if (mediaEl && (mediaEl.naturalWidth || mediaEl.videoWidth)) {
          ctx.save();
          // Draw media scaled to fit canvas within the torn paper
          const mw = mediaEl.naturalWidth || mediaEl.videoWidth || w;
          const mh = mediaEl.naturalHeight || mediaEl.videoHeight || h;
          const s = Math.max(w / mw, h / mh);
          const dw = mw * s;
          const dh = mh * s;
          const dx = (w - dw) / 2;
          const dy = (h - dh) / 2;
          ctx.drawImage(mediaEl, dx, dy, dw, dh);
          ctx.restore();
        }
      }

      // Inner torn paper border stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function checkAndPlayTransitionSfx(clip) {
  if (!clip || !clip.transitionSfx || clip.transitionSfx === 'none') return;
  if (clip._sfxPlayed) return;
  clip._sfxPlayed = true;
  playTransitionSfx(clip.transitionSfx);
  setTimeout(() => { if (clip) clip._sfxPlayed = false; }, 3000);
}

let _lastCheckTime = -1;
function watchTransitionTriggers() {
  if (typeof isPlaying === 'undefined' || !isPlaying) { _lastCheckTime = -1; return; }
  ['image', 'video'].forEach(trackType => {
    const clips = [...(timelineClips[trackType] || [])].sort((a,b) => a.start - b.start);
    clips.forEach((clip, i) => {
      if (i === 0) return;
      const boundary = clip.start;
      if (_lastCheckTime < boundary && currentTime >= boundary) {
        checkAndPlayTransitionSfx(clip);
      }
    });
  });
  _lastCheckTime = currentTime;
}

setInterval(() => {
  if (typeof isPlaying !== 'undefined' && isPlaying) {
    watchTransitionTriggers();
  }
}, 100);


// ==================== TRACK LOCK & MUTE SYSTEM ====================
const _lockedTracks = new Set();
const _mutedTracks = new Set();

function isTrackLocked(trackType) {
  return _lockedTracks.has(trackType);
}

function isTrackMuted(trackType) {
  return _mutedTracks.has(trackType);
}

document.querySelectorAll('.track-btn-lock').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const track = btn.dataset.track;
    const isLocked = _lockedTracks.has(track);
    if (isLocked) {
      _lockedTracks.delete(track);
      btn.classList.remove('active');
      document.getElementById('track-' + track)?.classList.remove('is-track-locked');
      showTextTimingAlert('Track unlocked: ' + track, 'info');
    } else {
      _lockedTracks.add(track);
      btn.classList.add('active');
      document.getElementById('track-' + track)?.classList.add('is-track-locked');
      showTextTimingAlert('Track locked: ' + track, 'warning');
    }
    setTimeout(() => showTextTimingAlert(''), 1500);
  });
});

document.querySelectorAll('.track-btn-mute').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const track = btn.dataset.track;
    const isMuted = _mutedTracks.has(track);
    if (isMuted) {
      _mutedTracks.delete(track);
      btn.classList.remove('active');
      showTextTimingAlert('Track unmuted: ' + track, 'info');
    } else {
      _mutedTracks.add(track);
      btn.classList.add('active');
      showTextTimingAlert('Track muted: ' + track, 'warning');
    }
    setTimeout(() => showTextTimingAlert(''), 1500);
  });
});

// ==================== EDIT TOOLS: CUT, SPLIT, TRIM START/END, DELETE, CLIPBOARD ====================
window._studioClipboard = null;

function findClipUnderPlayhead() {
  const trackPriority = ['video', 'image', 'chart', 'text', 'voiceover', 'music'];
  for (const track of trackPriority) {
    if (isTrackLocked(track)) continue;
    const clips = timelineClips[track] || [];
    const hit = clips.find(c => currentTime >= c.start && currentTime < (c.start + c.duration));
    if (hit) return { trackType: track, clip: hit };
  }
  return null;
}

function executeStudioSplit(atTime = currentTime) {
  if (selectedClip && selectedClip.clip) {
    const { trackType, clip } = selectedClip;
    if (isTrackLocked(trackType)) {
      showTextTimingAlert('Track is locked.', 'warning');
      setTimeout(() => showTextTimingAlert(''), 1500);
      return false;
    }
    if (atTime > clip.start && atTime < (clip.start + clip.duration)) {
      if (splitClipAtTime(trackType, clip, atTime)) {
        showTextTimingAlert('Split clip at ' + formatTimecode(atTime), 'success');
        setTimeout(() => showTextTimingAlert(''), 1500);
        return true;
      }
    }
  }

  const hit = findClipUnderPlayhead();
  if (hit) {
    if (atTime > hit.clip.start && atTime < (hit.clip.start + hit.clip.duration)) {
      if (splitClipAtTime(hit.trackType, hit.clip, atTime)) {
        showTextTimingAlert(`Split ${hit.trackType} clip at ` + formatTimecode(atTime), 'success');
        setTimeout(() => showTextTimingAlert(''), 1500);
        return true;
      }
    }
  }

  setStudioTool('split');
  showTextTimingAlert('Razor Blade active. Click any clip to cut.', 'info');
  setTimeout(() => showTextTimingAlert(''), 2000);
  return false;
}

function executeStudioTrimStart() {
  let target = selectedClip;
  if (!target || !target.clip || currentTime <= target.clip.start || currentTime >= (target.clip.start + target.clip.duration)) {
    target = findClipUnderPlayhead();
  }

  if (!target || !target.clip) {
    showTextTimingAlert('Place playhead inside a clip to trim start.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
    return false;
  }

  const { trackType, clip } = target;
  if (isTrackLocked(trackType)) {
    showTextTimingAlert('Track is locked.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  if (currentTime <= clip.start || currentTime >= (clip.start + clip.duration)) {
    showTextTimingAlert('Playhead must be inside the clip to trim.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  const originalEnd = clip.start + clip.duration;
  const trimmedAmount = currentTime - clip.start;
  clip.start = currentTime;
  clip.duration = originalEnd - currentTime;

  if (clip.file && typeof clip.file.inPoint === 'number') {
    clip.file.inPoint += trimmedAmount;
  }

  timelineClips[trackType].sort((a, b) => a.start - b.start);
  recordState('Trim Start to Playhead');
  renderAllTimelineTracks();
  selectClip(clip, trackType);
  showTextTimingAlert('Trimmed start to ' + formatTimecode(currentTime), 'success');
  setTimeout(() => showTextTimingAlert(''), 1500);
  return true;
}

function executeStudioTrimEnd() {
  let target = selectedClip;
  if (!target || !target.clip || currentTime <= target.clip.start || currentTime >= (target.clip.start + target.clip.duration)) {
    target = findClipUnderPlayhead();
  }

  if (!target || !target.clip) {
    showTextTimingAlert('Place playhead inside a clip to trim end.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
    return false;
  }

  const { trackType, clip } = target;
  if (isTrackLocked(trackType)) {
    showTextTimingAlert('Track is locked.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  if (currentTime <= clip.start || currentTime >= (clip.start + clip.duration)) {
    showTextTimingAlert('Playhead must be inside the clip to trim.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  clip.duration = currentTime - clip.start;
  timelineClips[trackType].sort((a, b) => a.start - b.start);
  recordState('Trim End to Playhead');
  renderAllTimelineTracks();
  selectClip(clip, trackType);
  showTextTimingAlert('Trimmed end to ' + formatTimecode(currentTime), 'success');
  setTimeout(() => showTextTimingAlert(''), 1500);
  return true;
}

function executeStudioCut() {
  let target = selectedClip;
  if (!target || !target.clip) {
    target = findClipUnderPlayhead();
  }

  if (!target || !target.clip) {
    showTextTimingAlert('Select a clip to cut.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
    return false;
  }

  const { trackType, clip } = target;
  if (isTrackLocked(trackType)) {
    showTextTimingAlert('Track is locked.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  window._studioClipboard = {
    trackType,
    clip: JSON.parse(JSON.stringify(clip))
  };

  recordState('Cut Clip');
  deleteClip(trackType, clip.id);
  showTextTimingAlert('Clip cut to clipboard (Ctrl+V to paste).', 'success');
  setTimeout(() => showTextTimingAlert(''), 2000);
  return true;
}

function executeStudioDelete() {
  let target = selectedClip;
  if (!target || !target.clip) {
    target = findClipUnderPlayhead();
  }

  if (!target || !target.clip) {
    showTextTimingAlert('Select a clip to delete.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 2000);
    return false;
  }

  const { trackType, clip } = target;
  if (isTrackLocked(trackType)) {
    showTextTimingAlert('Track is locked.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  recordState('Delete Clip');
  deleteClip(trackType, clip.id);
  showTextTimingAlert('Clip deleted.', 'info');
  setTimeout(() => showTextTimingAlert(''), 1500);
  return true;
}

function executeStudioPaste() {
  if (!window._studioClipboard || !window._studioClipboard.clip) {
    return false;
  }

  const { trackType, clip } = window._studioClipboard;
  if (isTrackLocked(trackType)) {
    showTextTimingAlert('Track is locked.', 'warning');
    setTimeout(() => showTextTimingAlert(''), 1500);
    return false;
  }

  const pastedClip = JSON.parse(JSON.stringify(clip));
  pastedClip.id = `clip-${trackType}-${Date.now()}`;
  pastedClip.start = currentTime;

  if (!timelineClips[trackType]) timelineClips[trackType] = [];
  timelineClips[trackType].push(pastedClip);
  timelineClips[trackType].sort((a, b) => a.start - b.start);

  recordState('Paste Clip');
  renderAllTimelineTracks();
  selectClip(pastedClip, trackType);
  showTextTimingAlert('Pasted clip at ' + formatTimecode(currentTime), 'success');
  setTimeout(() => showTextTimingAlert(''), 1500);
  return true;
}

// Bind Button Clicks
document.getElementById('tool-split')?.addEventListener('click', () => executeStudioSplit());
document.getElementById('tool-trim-left')?.addEventListener('click', () => executeStudioTrimStart());
document.getElementById('tool-trim-right')?.addEventListener('click', () => executeStudioTrimEnd());
document.getElementById('tool-cut')?.addEventListener('click', () => executeStudioCut());
document.getElementById('tool-delete')?.addEventListener('click', () => executeStudioDelete());

// Professional NLE Keyboard Shortcuts Engine
window.addEventListener('keydown', (e) => {
  const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if (isInput) return;

  const key = e.key.toLowerCase();
  const isCmdOrCtrl = e.ctrlKey || e.metaKey;

  // Open Hotkeys modal (Cmd + /)
  if (isCmdOrCtrl && e.key === '/') {
    e.preventDefault();
    openHotkeysModal();
    return;
  }

  // Toggle Proxy mode (P)
  if (!isCmdOrCtrl && key === 'p') {
    e.preventDefault();
    document.getElementById('btn-toggle-proxy')?.click();
    return;
  }

  // Play / Pause (Space)
  if (e.code === 'Space') {
    e.preventDefault();
    document.getElementById('btn-play')?.click();
    return;
  }

  // Frame-accurate step backward / forward (ArrowLeft / ArrowRight)
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const step = e.shiftKey ? (10 / 30) : (1 / 30);
    seekToTime(Math.max(0, currentTime - step));
    return;
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    const step = e.shiftKey ? (10 / 30) : (1 / 30);
    seekToTime(Math.min(duration, currentTime + step));
    return;
  }

  // J-K-L Shuttle Navigation
  if (!isCmdOrCtrl) {
    if (key === 'j') {
      e.preventDefault();
      seekToTime(Math.max(0, currentTime - 0.5));
      showTextTimingAlert('Shuttle: Reverse (J)', 'info');
      return;
    }
    if (key === 'k') {
      e.preventDefault();
      if (isPlaying) document.getElementById('btn-play')?.click();
      showTextTimingAlert('Shuttle: Pause (K)', 'info');
      return;
    }
    if (key === 'l') {
      e.preventDefault();
      if (!isPlaying) {
        document.getElementById('btn-play')?.click();
      } else {
        seekToTime(Math.min(duration, currentTime + 0.5));
      }
      showTextTimingAlert('Shuttle: Forward (L)', 'info');
      return;
    }
  }

  // Clipboard
  if (isCmdOrCtrl && key === 'x') {
    e.preventDefault();
    executeStudioCut();
    return;
  } else if (isCmdOrCtrl && key === 'c') {
    if (selectedClip && selectedClip.clip) {
      window._studioClipboard = {
        trackType: selectedClip.trackType,
        clip: JSON.parse(JSON.stringify(selectedClip.clip))
      };
      showTextTimingAlert('Clip copied to clipboard.', 'info');
      setTimeout(() => showTextTimingAlert(''), 1500);
    }
    return;
  } else if (isCmdOrCtrl && key === 'v') {
    e.preventDefault();
    executeStudioPaste();
    return;
  }

  // Tools & Actions based on active NLE layout:
  // 1. Slip Tool (Y or T in FCPX/DaVinci)
  if (key === 'y' || (['fcpx', 'davinci'].includes(activeNlePreset) && key === 't')) {
    setStudioTool('slip');
    showTextTimingAlert('Slip Tool Active: Drag inside clip to slip content', 'info');
    return;
  }

  // 2. Slide Tool (U)
  if (key === 'u') {
    setStudioTool('slide');
    showTextTimingAlert('Slide Tool Active: Drag clip along timeline', 'info');
    return;
  }

  // 3. Razor / Split Tool & Add Edit
  const isSplitKey = key === 's' ||
    (activeNlePreset === 'premiere' && (key === 'c' || (isCmdOrCtrl && key === 'k'))) ||
    (['fcpx', 'davinci'].includes(activeNlePreset) && (key === 'b' || (isCmdOrCtrl && key === 'b')));

  if (isSplitKey) {
    e.preventDefault();
    executeStudioSplit();
    return;
  }

  // 4. Select Tool
  const isSelectKey = key === 'v' || (['fcpx', 'davinci'].includes(activeNlePreset) && key === 'a');
  if (isSelectKey) {
    setStudioTool('select');
    return;
  }

  // 5. Ripple Trims
  if (key === 'q' || (e.altKey && e.key === '[')) {
    executeStudioTrimStart();
    return;
  }
  if (key === 'w' || (e.altKey && e.key === ']')) {
    executeStudioTrimEnd();
    return;
  }

  // 6. Delete
  if (e.key === 'Delete' || e.key === 'Backspace') {
    executeStudioDelete();
    return;
  }
});

// ==================== MEDIA LIBRARY SEARCH BAR ====================
let _mediaSearchQuery = '';

function setupMediaLibrarySearch() {
  const searchInput = document.getElementById('media-library-search');
  const clearBtn = document.getElementById('media-library-search-clear');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    _mediaSearchQuery = e.target.value.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = _mediaSearchQuery ? 'block' : 'none';
    renderMediaListWithSearch();
  });

  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    _mediaSearchQuery = '';
    clearBtn.style.display = 'none';
    renderMediaListWithSearch();
    searchInput.focus();
  });
}

function renderMediaListWithSearch() {
  if (typeof currentFilter !== 'undefined') {
    renderMediaList(currentFilter);
  }
}

// Wrap renderMediaList to filter by _mediaSearchQuery
const _baseRenderMediaList = renderMediaList;
renderMediaList = function(filter) {
  if (!_mediaSearchQuery) {
    return _baseRenderMediaList(filter);
  }
  const list = document.getElementById('media-list');
  if (!list) return;
  list.innerHTML = '';

  const filtered = mediaFiles.filter(item => {
    const matchesFilter = (filter === 'audio') ? item.isAudio
      : (filter === 'video') ? item.isVideo
      : (filter === 'images') ? item.isImage
      : true;
    const matchesSearch = item.name.toLowerCase().includes(_mediaSearchQuery);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<div style="padding:14px; text-align:center; color:#888; font-size:12px;">No files matching "' + _mediaSearchQuery + '"</div>';
    return;
  }

  filtered.forEach(file => {
    const el = document.createElement('div');
    el.className = 'media-item';
    el.setAttribute('draggable', 'true');

    let thumbHtml = '';
    if (file.isImage) {
      thumbHtml = '<img src="' + file.url + '" class="media-thumb" alt="preview">';
    } else if (file.isVideo) {
      thumbHtml = '<video src="' + file.url + '#t=0.5" class="media-thumb" muted preload="metadata"></video>';
    } else {
      thumbHtml = '<div class="media-thumb audio-thumb"><svg class="ui-icon" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>';
    }

    el.innerHTML = `
      ${thumbHtml}
      <div class="media-info">
        <span class="media-name" title="${file.name}">${file.name}</span>
        <span class="media-size">${(file.size / (1024 * 1024)).toFixed(1)} MB</span>
      </div>
    `;

    el.addEventListener('click', () => {
      previewMediaItem(file);
    });

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('application/json', JSON.stringify(file));
      e.dataTransfer.effectAllowed = 'copy';
    });

    list.appendChild(el);
  });
};

setupMediaLibrarySearch();

// Update openTrackImagePickerModal to accept optional insertion time
const _origOpenTrackImagePicker = openTrackImagePickerModal;
openTrackImagePickerModal = function(atTimeSec) {
  if (atTimeSec !== undefined) {
    currentTime = atTimeSec;
  }
  _origOpenTrackImagePicker();
};

// ==================== PRECISION AUDIO CUT & TRIM MODAL SYSTEM ====================
let _audioTrimClip = null;
let _audioTrimTrackType = null;
let _audioTrimAudioBuf = null;
let _audioTrimInSec = 0;
let _audioTrimOutSec = 0;
let _audioTrimTotalDur = 0;
let _audioTrimPreviewAudio = null;
let _audioTrimIsDragging = null;

async function openAudioTrimModal(clip, trackType) {
  if (!clip || !clip.file?.url) {
    showTextTimingAlert('No audio file found in selected clip.', 'warning');
    return;
  }

  _audioTrimClip = clip;
  _audioTrimTrackType = trackType;

  const modal = document.getElementById('audio-trim-modal');
  if (!modal) return;

  const titleEl = document.getElementById('audio-trim-title');
  if (titleEl) {
    titleEl.textContent = `Cut & Trim: ${clip.file.name || 'Audio Clip'}`;
  }

  modal.style.setProperty('display', 'flex', 'important');
  modal.classList.add('is-open');

  showTextTimingAlert('Loading audio waveform...', 'info');
  const audioBuf = await getAudioBufferForUrl(clip.file.url);
  _audioTrimAudioBuf = audioBuf;

  const fileDur = audioBuf ? audioBuf.duration : (clip.duration || 60);
  _audioTrimTotalDur = fileDur;

  const currentOffset = clip.audioOffset || 0;
  _audioTrimInSec = Math.max(0, Math.min(fileDur - 0.2, currentOffset));
  _audioTrimOutSec = Math.min(fileDur, Math.max(_audioTrimInSec + 0.2, currentOffset + clip.duration));

  drawAudioTrimWaveform();
  updateAudioTrimUI();
  setupAudioTrimInteractions();
}

function closeAudioTrimModal() {
  const modal = document.getElementById('audio-trim-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('is-open');
  }
  if (_audioTrimPreviewAudio) {
    _audioTrimPreviewAudio.pause();
    _audioTrimPreviewAudio = null;
  }
  const previewBtn = document.getElementById('btn-audio-trim-preview');
  if (previewBtn) {
    previewBtn.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg>
      <span>Preview Selection</span>
    `;
  }
  _audioTrimClip = null;
}

function updateAudioTrimUI() {
  const inInput = document.getElementById('audio-trim-in-input');
  const outInput = document.getElementById('audio-trim-out-input');
  const durLabel = document.getElementById('audio-trim-dur-label');
  const dimLeft = document.getElementById('audio-trim-dim-left');
  const dimRight = document.getElementById('audio-trim-dim-right');
  const handleIn = document.getElementById('audio-trim-handle-in');
  const handleOut = document.getElementById('audio-trim-handle-out');

  const dur = Math.max(0, _audioTrimOutSec - _audioTrimInSec);
  if (inInput) inInput.value = formatTimecode(_audioTrimInSec);
  if (outInput) outInput.value = formatTimecode(_audioTrimOutSec);
  if (durLabel) durLabel.textContent = `${formatTimecode(_audioTrimInSec)} - ${formatTimecode(_audioTrimOutSec)} (Dur: ${formatTimecode(dur)})`;

  if (_audioTrimTotalDur > 0) {
    const inPct = (_audioTrimInSec / _audioTrimTotalDur) * 100;
    const outPct = (_audioTrimOutSec / _audioTrimTotalDur) * 100;

    if (dimLeft) dimLeft.style.width = `${inPct}%`;
    if (dimRight) dimRight.style.width = `${100 - outPct}%`;
    if (handleIn) handleIn.style.left = `${inPct}%`;
    if (handleOut) handleOut.style.left = `${outPct}%`;
  }
}

function drawAudioTrimWaveform() {
  const canvas = document.getElementById('audio-trim-waveform-canvas');
  if (!canvas || !_audioTrimAudioBuf) return;

  const wrap = document.getElementById('audio-trim-canvas-wrap');
  const w = wrap ? wrap.clientWidth : 640;
  const h = wrap ? wrap.clientHeight : 110;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = h * window.devicePixelRatio;

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.clearRect(0, 0, w, h);

  const rawData = _audioTrimAudioBuf.getChannelData(0);
  const bars = Math.max(30, Math.floor(w / 3));
  const step = Math.floor(rawData.length / bars);
  const centerY = h / 2;

  ctx.fillStyle = '#00f0ff';

  for (let i = 0; i < bars; i++) {
    const s = i * step;
    let max = 0;
    for (let j = 0; j < step && (s + j) < rawData.length; j += Math.max(1, Math.floor(step / 10))) {
      const val = Math.abs(rawData[s + j]);
      if (val > max) max = val;
    }
    const barHeight = Math.max(3, max * (h - 16));
    const x = (i / bars) * w;
    ctx.fillRect(x, centerY - barHeight / 2, 2, barHeight);
  }
}

let _audioTrimListenersAttached = false;
function setupAudioTrimInteractions() {
  if (_audioTrimListenersAttached) return;
  _audioTrimListenersAttached = true;

  const wrap = document.getElementById('audio-trim-canvas-wrap');
  const handleIn = document.getElementById('audio-trim-handle-in');
  const handleOut = document.getElementById('audio-trim-handle-out');
  const btnClose = document.getElementById('btn-audio-trim-close');
  const btnCancel = document.getElementById('btn-audio-trim-cancel');
  const btnApply = document.getElementById('btn-audio-trim-apply');
  const btnPreview = document.getElementById('btn-audio-trim-preview');
  const inInput = document.getElementById('audio-trim-in-input');
  const outInput = document.getElementById('audio-trim-out-input');

  btnClose?.addEventListener('click', closeAudioTrimModal);
  btnCancel?.addEventListener('click', closeAudioTrimModal);

  // Timecode manual input parsing
  function parseTimecodeInput(val) {
    if (!val) return 0;
    const parts = val.trim().split(':');
    if (parts.length === 2) {
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    } else if (parts.length === 3) {
      return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    }
    return parseFloat(val) || 0;
  }

  inInput?.addEventListener('change', () => {
    const t = Math.max(0, Math.min(_audioTrimOutSec - 0.2, parseTimecodeInput(inInput.value)));
    _audioTrimInSec = t;
    updateAudioTrimUI();
  });

  outInput?.addEventListener('change', () => {
    const t = Math.min(_audioTrimTotalDur, Math.max(_audioTrimInSec + 0.2, parseTimecodeInput(outInput.value)));
    _audioTrimOutSec = t;
    updateAudioTrimUI();
  });

  // Handle Dragging
  handleIn?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    _audioTrimIsDragging = 'in';
  });

  handleOut?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    _audioTrimIsDragging = 'out';
  });

  // Clicking on canvas moves closest handle
  wrap?.addEventListener('mousedown', (e) => {
    if (e.target === handleIn || e.target === handleOut) return;
    const rect = wrap.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickSec = Math.max(0, Math.min(_audioTrimTotalDur, (clickX / rect.width) * _audioTrimTotalDur));

    const distIn = Math.abs(clickSec - _audioTrimInSec);
    const distOut = Math.abs(clickSec - _audioTrimOutSec);

    if (distIn < distOut) {
      _audioTrimInSec = Math.min(_audioTrimOutSec - 0.2, clickSec);
      _audioTrimIsDragging = 'in';
    } else {
      _audioTrimOutSec = Math.max(_audioTrimInSec + 0.2, clickSec);
      _audioTrimIsDragging = 'out';
    }
    updateAudioTrimUI();
  });

  window.addEventListener('mousemove', (e) => {
    if (!_audioTrimIsDragging || !_audioTrimClip) return;
    const rect = wrap.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const moveSec = Math.max(0, Math.min(_audioTrimTotalDur, (moveX / rect.width) * _audioTrimTotalDur));

    if (_audioTrimIsDragging === 'in') {
      _audioTrimInSec = Math.min(_audioTrimOutSec - 0.2, moveSec);
    } else if (_audioTrimIsDragging === 'out') {
      _audioTrimOutSec = Math.max(_audioTrimInSec + 0.2, moveSec);
    }
    updateAudioTrimUI();
  });

  window.addEventListener('mouseup', () => {
    _audioTrimIsDragging = null;
  });

  // Preview Button Play/Pause
  btnPreview?.addEventListener('click', () => {
    if (!_audioTrimClip || !_audioTrimClip.file?.url) return;

    if (_audioTrimPreviewAudio && !_audioTrimPreviewAudio.paused) {
      _audioTrimPreviewAudio.pause();
      btnPreview.innerHTML = `
        <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg>
        <span>Preview Selection</span>
      `;
      return;
    }

    if (!_audioTrimPreviewAudio) {
      _audioTrimPreviewAudio = new Audio(_audioTrimClip.file.url);
    }
    _audioTrimPreviewAudio.currentTime = _audioTrimInSec;
    _audioTrimPreviewAudio.play().catch(() => {});
    btnPreview.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      <span>Pause Preview</span>
    `;

    const checkStop = () => {
      if (_audioTrimPreviewAudio && _audioTrimPreviewAudio.currentTime >= _audioTrimOutSec) {
        _audioTrimPreviewAudio.pause();
        btnPreview.innerHTML = `
          <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg>
          <span>Preview Selection</span>
        `;
      } else if (_audioTrimPreviewAudio && !_audioTrimPreviewAudio.paused) {
        requestAnimationFrame(checkStop);
      }
    };
    requestAnimationFrame(checkStop);
  });

  // Apply Trim Button
  btnApply?.addEventListener('click', () => {
    if (!_audioTrimClip) return;
    const dur = Math.max(0.2, _audioTrimOutSec - _audioTrimInSec);
    recordState('Precision Cut Audio Clip');

    _audioTrimClip.audioOffset = _audioTrimInSec;
    _audioTrimClip.duration = dur;

    // Update inspector inputs if selected
    const di = document.getElementById('inspector-dur-input');
    if (di) di.value = formatTimecode(_audioTrimClip.duration);

    renderAllTimelineTracks();
    closeAudioTrimModal();
    showTextTimingAlert(`Trimmed audio: ${formatTimecode(_audioTrimInSec)} - ${formatTimecode(_audioTrimOutSec)} (${dur.toFixed(2)}s)`, 'success');
  });
}

// ==================== EFFECT INSPECTOR CONTROLS WIRE-UP ====================
function initEffectInspectorListeners() {
  const startSlider = document.getElementById('effect-start-slider');
  const durSlider = document.getElementById('effect-dur-slider');
  const btnStartDec = document.getElementById('btn-effect-start-dec');
  const btnStartInc = document.getElementById('btn-effect-start-inc');
  const btnDurDec = document.getElementById('btn-effect-dur-dec');
  const btnDurInc = document.getElementById('btn-effect-dur-inc');
  const easingSelect = document.getElementById('effect-easing-select');
  const zoomScaleSlider = document.getElementById('effect-zoom-scale-slider');
  const btnBackToClip = document.getElementById('btn-back-to-clip-settings');
  const btnDeleteEffect = document.getElementById('btn-delete-active-effect');

  // Start Offset Slider
  startSlider?.addEventListener('input', (e) => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const offset = parseInt(e.target.value) / 10;
    const dur = durSlider ? parseInt(durSlider.value) / 10 : 1.0;
    applyEffectTimingChange(selectedClip.clip, selectedEffectId.effectType, selectedEffectId.effectIndex, offset, dur);
    renderAllTimelineTracks();
    syncEffectInspectorControls();
    renderCanvas();
  });
  startSlider?.addEventListener('change', () => {
    recordState('Adjust Effect Start Offset');
  });

  // Start Stepper (-)
  btnStartDec?.addEventListener('click', () => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const curVal = startSlider ? parseInt(startSlider.value) / 10 : 0;
    const newVal = Math.max(0, parseFloat((curVal - 0.1).toFixed(2)));
    const dur = durSlider ? parseInt(durSlider.value) / 10 : 1.0;
    applyEffectTimingChange(selectedClip.clip, selectedEffectId.effectType, selectedEffectId.effectIndex, newVal, dur);
    renderAllTimelineTracks();
    syncEffectInspectorControls();
    renderCanvas();
    recordState('Nudge Effect Start Earlier');
  });

  // Start Stepper (+)
  btnStartInc?.addEventListener('click', () => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const curVal = startSlider ? parseInt(startSlider.value) / 10 : 0;
    const newVal = Math.min(selectedClip.clip.duration - 0.1, parseFloat((curVal + 0.1).toFixed(2)));
    const dur = durSlider ? parseInt(durSlider.value) / 10 : 1.0;
    applyEffectTimingChange(selectedClip.clip, selectedEffectId.effectType, selectedEffectId.effectIndex, newVal, dur);
    renderAllTimelineTracks();
    syncEffectInspectorControls();
    renderCanvas();
    recordState('Nudge Effect Start Later');
  });

  // Duration Slider
  durSlider?.addEventListener('input', (e) => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const dur = Math.max(0.1, parseInt(e.target.value) / 10);
    const offset = startSlider ? parseInt(startSlider.value) / 10 : 0;
    applyEffectTimingChange(selectedClip.clip, selectedEffectId.effectType, selectedEffectId.effectIndex, offset, dur);
    renderAllTimelineTracks();
    syncEffectInspectorControls();
    renderCanvas();
  });
  durSlider?.addEventListener('change', () => {
    recordState('Adjust Effect Duration');
  });

  // Duration Stepper (-)
  btnDurDec?.addEventListener('click', () => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const curVal = durSlider ? parseInt(durSlider.value) / 10 : 1;
    const newVal = Math.max(0.1, parseFloat((curVal - 0.1).toFixed(2)));
    const offset = startSlider ? parseInt(startSlider.value) / 10 : 0;
    applyEffectTimingChange(selectedClip.clip, selectedEffectId.effectType, selectedEffectId.effectIndex, offset, newVal);
    renderAllTimelineTracks();
    syncEffectInspectorControls();
    renderCanvas();
    recordState('Shorten Effect Duration');
  });

  // Duration Stepper (+)
  btnDurInc?.addEventListener('click', () => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const curVal = durSlider ? parseInt(durSlider.value) / 10 : 1;
    const offset = startSlider ? parseInt(startSlider.value) / 10 : 0;
    const newVal = Math.min(selectedClip.clip.duration - offset, parseFloat((curVal + 0.1).toFixed(2)));
    applyEffectTimingChange(selectedClip.clip, selectedEffectId.effectType, selectedEffectId.effectIndex, offset, newVal);
    renderAllTimelineTracks();
    syncEffectInspectorControls();
    renderCanvas();
    recordState('Lengthen Effect Duration');
  });

  // Easing Selector
  easingSelect?.addEventListener('change', (e) => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    selectedClip.clip.zoomEasing = e.target.value;
    renderCanvas();
    recordState(`Set Effect Easing to ${e.target.value}`);
  });

  // Zoom Scale Slider
  zoomScaleSlider?.addEventListener('input', (e) => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const scale = parseInt(e.target.value) / 10;
    selectedClip.clip.zoomScale = scale;
    const scaleVal = document.getElementById('effect-zoom-scale-val');
    if (scaleVal) scaleVal.textContent = `${scale.toFixed(1)}x`;
    renderCanvas();
  });
  zoomScaleSlider?.addEventListener('change', () => {
    recordState('Adjust Zoom Scale');
  });

  // Back to generic clip settings
  btnBackToClip?.addEventListener('click', () => {
    if (selectedClip?.clip && selectedClip?.trackType) {
      selectedEffectId = null;
      selectClip(selectedClip.clip, selectedClip.trackType);
    }
  });

  // Delete Effect Button
  btnDeleteEffect?.addEventListener('click', () => {
    if (!selectedEffectId || !selectedClip?.clip) return;
    const clip = selectedClip.clip;
    const { effectType, effectIndex } = selectedEffectId;

    if (effectType === 'zoom') {
      delete clip.zoomEffect;
      delete clip.zoomScale;
      delete clip.zoomStartTime;
      delete clip.zoomDuration;
    } else if (effectType === 'docFocus') {
      delete clip.docFocus;
      delete clip.docFocusStartTime;
      delete clip.docFocusDuration;
      clip.spotlights = [];
    } else if (effectType === 'highlight') {
      if (Array.isArray(clip.highlights)) {
        clip.highlights.splice(effectIndex, 1);
        if (clip.highlights.length === 0) delete clip.highlights;
      }
    } else if (effectType === 'scroll') {
      delete clip.docScroll;
      delete clip.docScrollMode;
      delete clip.docScrollSpeed;
      delete clip.docScrollLinger;
    } else if (effectType === 'motionBlur') {
      delete clip.motionBlurCrowd;
    }

    recordState(`Delete ${effectType} Effect`);
    selectedEffectId = null;
    renderAllTimelineTracks();
    renderCanvas();
    selectClip(clip, selectedClip.trackType);
    showTextTimingAlert('Effect removed from clip', 'info');
    setTimeout(() => showTextTimingAlert(''), 1800);
  });
}

// Initialize on DOM ready or immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEffectInspectorListeners);
} else {
  initEffectInspectorListeners();
}

// ============================================================================
// ==================== STATEMENT & QUOTE CARD SYSTEM ENGINE ==================
// ============================================================================

// Cache for avatar & background images loaded for quote cards
const quoteImageCache = new Map();

function getCachedQuoteImage(url) {
  if (!url) return null;
  if (quoteImageCache.has(url)) return quoteImageCache.get(url);
  const img = new Image();
  img.src = url;
  quoteImageCache.set(url, img);
  return img;
}

// 1. Create a new Statement / Quote Card Clip
function createNewQuoteCardAtTime(startSec) {
  const atTime = typeof startSec === 'number' ? Math.max(0, startSec) : currentTime;
  const quoteId = `clip-quote-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Default quote clip matching user reference image (Micha Kaufman, Fiverr CEO)
  const quoteClip = {
    id: quoteId,
    track: 'quote',
    isQuoteCard: true,
    name: 'Executive Statement Card',
    start: atTime,
    duration: 7.0,
    zIndex: 28,
    layerOrder: 'front',
    x: 0,
    y: 0,
    scale: 1.0,

    // Speaker / Avatar Shape Frame
    speakerTitle: 'Enter Name Here',
    speakerSubtitle: 'Enter Title / Subtitle...',
    avatarShape: 'circle', // 'circle', 'rounded', 'hexagon', 'square'
    avatarSize: 110,
    avatarBorderColor: '#ffffff',
    avatarBorderWidth: 3,
    avatarFile: null, // { name, url }

    // Statement / Body Quote Text
    quoteText: 'Enter your text here...',
    quoteEffect: 'typewriter', // 'typewriter', 'falling', 'pop', 'fade', 'slide_up', 'none'
    effectSpeed: 1.0,
    fontSize: 34,
    fontFamily: "'Inter', sans-serif",
    textColor: '#ffffff',
    subtitleColor: '#94a3b8',

    // Screen Background & Glassmorphism Plate
    bgMode: 'gradient', // 'gradient', 'solid', 'glass', 'image', 'stage'
    bgColor1: '#262933', // center / inner highlight
    bgColor2: '#0b0c10', // outer dark vignette
    glassEnabled: true,
    glassBlur: 16,
    glassOpacity: 65,
    bgImageFile: null, // { name, url }
    bgDim: 45 // 0-100%
  };

  if (!timelineClips.quote) timelineClips.quote = [];
  timelineClips.quote.push(quoteClip);

  // Sync to timeline & select
  seekToTime(atTime);
  selectClip(quoteClip, 'quote');
  renderAllTimelineTracks();
  recordState('Add Statement / Quote Card');
  saveProjectState(false);

  showTextTimingAlert('Statement / Quote Card added at ' + formatTimecode(atTime) + '!', 'success');
  setTimeout(() => showTextTimingAlert(''), 2500);
  return quoteClip;
}

// 2. Draw Statement / Quote Card on Canvas Layer
function drawQuoteCardLayer(clip) {
  if (!clip) return;
  const elapsed = currentTime - clip.start;
  if (elapsed < 0 || elapsed > clip.duration) return;

  const w = canvas.width;  // 1920
  const h = canvas.height; // 1080

  ctx.save();

  // Apply clip transform (pan / zoom)
  const scale = clip.scale !== undefined ? clip.scale : 1.0;
  const posX = clip.x || 0;
  const posY = clip.y || 0;

  if (scale !== 1.0 || posX !== 0 || posY !== 0) {
    ctx.translate(w / 2 + posX, h / 2 + posY);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);
  }

  // --- Background Layer Rendering ---
  const bgMode = clip.bgMode || 'gradient';
  if (bgMode === 'gradient') {
    // Cinematic Vignette Radial Gradient
    const radGrad = ctx.createRadialGradient(w * 0.45, h * 0.42, 100, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    radGrad.addColorStop(0, clip.bgColor1 || '#262933');
    radGrad.addColorStop(1, clip.bgColor2 || '#090a0d');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (bgMode === 'solid') {
    ctx.fillStyle = clip.bgColor1 || '#111319';
    ctx.fillRect(0, 0, w, h);
  } else if (bgMode === 'image' && clip.bgImageFile?.url) {
    const bgImg = getCachedQuoteImage(clip.bgImageFile.url);
    if (bgImg && bgImg.complete && bgImg.naturalWidth) {
      // Cover full canvas keeping aspect ratio
      const aspectImg = bgImg.naturalWidth / bgImg.naturalHeight;
      const aspectCanvas = w / h;
      let sw = bgImg.naturalWidth;
      let sh = bgImg.naturalHeight;
      let sx = 0;
      let sy = 0;
      if (aspectImg > aspectCanvas) {
        sw = bgImg.naturalHeight * aspectCanvas;
        sx = (bgImg.naturalWidth - sw) / 2;
      } else {
        sh = bgImg.naturalWidth / aspectCanvas;
        sy = (bgImg.naturalHeight - sh) / 2;
      }
      ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#0f1015';
      ctx.fillRect(0, 0, w, h);
    }

    // Apply Dimming Vignette over background image so statement text remains crisp & readable
    const dimAlpha = (clip.bgDim !== undefined ? clip.bgDim : 45) / 100;
    if (dimAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dimAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // --- Dedicated Authentic iMessage / SMS Chat Bubble Renderer ---
  // (Handled within main card plate below)

  // --- Glassmorphism Plate Card Container (Like documentary graphics / iOS HUD) ---
  const cardPadX = 140;
  const cardW = 1640;
  const cardH = 760;
  const cardX = (w - cardW) / 2;
  const cardY = (h - cardH) / 2;

  const glassOn = clip.glassEnabled !== false && (bgMode === 'glass' || bgMode === 'image' || clip.glassEnabled);
  if (glassOn) {
    ctx.save();
    const opVal = (clip.glassOpacity !== undefined ? clip.glassOpacity : 60) / 100;

    // Draw frosted glass plate with rounded corners
    const cr = 28;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cr);

    // If card style is Chat Bubble, attach speech bubble pointer tail
    if (clip.cardStyle === 'chat_bubble') {
      const tailX = cardX + 160;
      const tailY = cardY + cardH;
      ctx.moveTo(tailX - 25, tailY);
      ctx.lineTo(tailX - 45, tailY + 35);
      ctx.lineTo(tailX + 15, tailY);
    }

    // Subtle dark translucent background with specular top-edge sheen
    ctx.fillStyle = `rgba(18, 22, 33, ${opVal})`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 15;
    ctx.fill();

    // Luminescent border stroke
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
    borderGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.strokeStyle = borderGrad;
    ctx.stroke();

    // Top subtle white glass glare line
    ctx.beginPath();
    ctx.moveTo(cardX + cr, cardY + 1.5);
    ctx.lineTo(cardX + cardW - cr, cardY + 1.5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // --- Speaker Avatar Shape Frame & Image ---
  const avatarRadius = (clip.avatarSize || 110) / 2;
  const avatarCenterX = cardX + 160;
  const avatarCenterY = cardY + 170;
  const shape = clip.avatarShape || 'circle';

  ctx.save();

  // Shadow / Glow behind shape
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 8;

  // Clip Path for the shape
  ctx.beginPath();
  if (shape === 'rounded') {
    const sSize = avatarRadius * 2;
    ctx.roundRect(avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, sSize, sSize, 22);
  } else if (shape === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 6;
      const hx = avatarCenterX + avatarRadius * Math.cos(angle);
      const hy = avatarCenterY + avatarRadius * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  } else if (shape === 'square') {
    const sSize = avatarRadius * 2;
    ctx.rect(avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, sSize, sSize);
  } else {
    // Circle default
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
  }
  ctx.fillStyle = '#1c2130';
  ctx.fill();

  ctx.save();
  ctx.clip();

  // Draw Avatar Picture if uploaded or chosen
  let avatarDrawn = false;
  if (clip.avatarFile?.url) {
    const avImg = getCachedQuoteImage(clip.avatarFile.url);
    if (avImg && avImg.complete && avImg.naturalWidth) {
      const s = avatarRadius * 2;
      ctx.drawImage(avImg, avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, s, s);
      avatarDrawn = true;
    }
  }

  // Default avatar icon placeholder if no picture attached
  if (!avatarDrawn) {
    // Elegant silhouette speaker placeholder
    ctx.fillStyle = '#2b334a';
    ctx.fillRect(avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY - avatarRadius * 0.15, avatarRadius * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY + avatarRadius * 0.85, avatarRadius * 0.72, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // end clip

  // Frame Outline Border & Outer Ring Glow
  const bWidth = clip.avatarBorderWidth !== undefined ? clip.avatarBorderWidth : 3;
  if (bWidth > 0) {
    ctx.lineWidth = bWidth;
    ctx.strokeStyle = clip.avatarBorderColor || '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 14;
    ctx.stroke();
  }

  ctx.restore();

  // --- Speaker Name Title & Role Subtitle (per-field styling) ---
  const qs = (f, d) => ({
    font: clip[f + 'Font'] || clip.fontFamily || "'Inter', sans-serif",
    size: clip[f + 'Size'] || d.size,
    color: clip[f + 'Color'] || d.color,
    bold: clip[f + 'Bold'] !== undefined ? clip[f + 'Bold'] : d.bold,
    italic: !!clip[f + 'Italic']
  });
  const nameSt = qs('name', { size: 60, color: clip.textColor || '#ffffff', bold: true });
  const roleSt = qs('role', { size: 38, color: clip.subtitleColor || '#94a3b8', bold: false });
  const quoteSt = qs('quote', { size: clip.fontSize || 34, color: '#f1f1f1', bold: false });
  const fontStr = (s, light) => `${s.italic ? 'italic ' : ''}${s.bold ? 700 : (light ? 300 : 400)} ${s.size}px ${s.font}`;
  clip._fmt = { name: nameSt, role: roleSt, quote: quoteSt };

  const headerTextX = avatarCenterX + avatarRadius + 50;
  const nameY = avatarCenterY - roleSt.size * 0.45;
  const roleY = nameY + nameSt.size * 0.55 + roleSt.size * 0.7;
  const nameText = clip.speakerTitle || 'Alex Vance';
  const roleText = clip.speakerSubtitle || 'Founder & CEO, Apex Global';

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 10;
  ctx.font = fontStr(nameSt);
  const nameW = ctx.measureText(nameText).width;
  if (clip._editingField !== 'name') {
    ctx.fillStyle = nameSt.color;
    ctx.fillText(nameText, headerTextX, nameY);
  }
  ctx.font = fontStr(roleSt, true);
  const roleW = ctx.measureText(roleText).width;
  if (clip._editingField !== 'role') {
    ctx.fillStyle = roleSt.color;
    ctx.fillText(roleText, headerTextX, roleY);
  }
  ctx.restore();

  // --- Body Statement / Quote Text With Dynamic Effects ---
  const quoteFontSize = quoteSt.size;
  const quoteFontFamily = quoteSt.font;
  const quoteStartY = avatarCenterY + avatarRadius + 70;
  const quoteStartX = avatarCenterX - avatarRadius;
  const quoteMaxW = cardW - 2 * (quoteStartX - cardX);
  const lineSpacing = quoteFontSize * 1.5;
  const quoteColor = quoteSt.color;

  ctx.save();
  ctx.font = fontStr(quoteSt, true);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const userQuote = (clip.quoteText || '').trim();
  const editingQuote = clip._editingField === 'quote';

  // Customizable quotation marks color & visibility OR Chat Bubble container
  const isChatBubble = clip.cardStyle === 'chat_bubble';
  const showQuoteMarks = clip.quoteMarksVisible !== false && !isChatBubble;
  const markColor = clip.quoteMarkColor || '#ff334b';

  const rawQuote = userQuote || 'Type a message...';

  const textOffsetLeft = (showQuoteMarks ? 45 : (isChatBubble ? 20 : 0));
  const actualQuoteX = quoteStartX + textOffsetLeft;
  const actualQuoteMaxW = quoteMaxW - (textOffsetLeft * 2);

  // Word wrap calculation on full text to keep speech bubble size fixed during typewriter / animation playback
  const words = rawQuote.split(' ');
  const lines = [];
  let curLine = '';

  words.forEach(w => {
    const testLine = curLine ? `${curLine} ${w}` : w;
    const testW = ctx.measureText(testLine).width;
    if (testW > actualQuoteMaxW && curLine) {
      lines.push(curLine);
      curLine = w;
    } else {
      curLine = testLine;
    }
  });
  if (curLine) lines.push(curLine);
  if (lines.length === 0) lines.push('Type a message...');

  // Calculate actual text dimensions for dynamic chat bubble sizing based on FULL text
  let maxLineWidth = 120;
  lines.forEach(l => {
    const lw = ctx.measureText(l).width;
    if (lw > maxLineWidth) maxLineWidth = lw;
  });

  const isReceived = clip.chatDirection !== 'sent';
  const bubbleBg = isReceived ? '#e9e9eb' : '#007aff';
  const bubbleTextColor = isReceived ? '#1c1c1e' : '#ffffff';
  const actualQuoteColor = isChatBubble ? bubbleTextColor : quoteColor;

  if (showQuoteMarks) {
    // Opening quotation mark before text
    ctx.save();
    ctx.font = '700 64px Georgia, serif';
    ctx.fillStyle = markColor;
    ctx.shadowColor = markColor;
    ctx.shadowBlur = 12;
    ctx.fillText('“', quoteStartX, quoteStartY - 10);
    ctx.restore();
  } else if (isChatBubble) {
    // Dynamic Bubble Sizing based on text content width & lines count
    const bubbleW = Math.min(quoteMaxW, maxLineWidth + 60);
    const bubbleH = lines.length * lineSpacing + 28;
    const bx = quoteStartX;
    const by = quoteStartY - 8;
    const br = 20;

    ctx.save();
    ctx.fillStyle = bubbleBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 5;

    // Unified continuous vector path for speech bubble with seamless integrated tail
    const r = 18; // Corner radius
    ctx.beginPath();
    
    // Top-left corner
    ctx.moveTo(bx + r, by);
    // Top side & top-right corner
    ctx.lineTo(bx + bubbleW - r, by);
    ctx.quadraticCurveTo(bx + bubbleW, by, bx + bubbleW, by + r);

    if (!isReceived) {
      // Sent (Right tail integrated into bottom-right)
      ctx.lineTo(bx + bubbleW, by + bubbleH - r);
      ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - 4, by + bubbleH);
      ctx.quadraticCurveTo(bx + bubbleW + 12, by + bubbleH + 10, bx + bubbleW + 14, by + bubbleH + 12);
      ctx.quadraticCurveTo(bx + bubbleW + 4, by + bubbleH - 2, bx + bubbleW - 14, by + bubbleH);
      ctx.lineTo(bx + r, by + bubbleH);
      ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
    } else {
      // Received (Left tail integrated into bottom-left)
      ctx.lineTo(bx + bubbleW, by + bubbleH - r);
      ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - r, by + bubbleH);
      ctx.lineTo(bx + 14, by + bubbleH);
      ctx.quadraticCurveTo(bx - 4, by + bubbleH - 2, bx - 14, by + bubbleH + 12);
      ctx.quadraticCurveTo(bx - 12, by + bubbleH + 10, bx - 4, by + bubbleH);
      ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Total character count across all lines
  const totalChars = rawQuote.length;

  // When actively editing inline, hide canvas text to prevent duplicate overlapping text
  if (!editingQuote) {
    if (!isPlaying || effect === 'none') {
      ctx.fillStyle = actualQuoteColor;
      ctx.shadowColor = isChatBubble ? 'transparent' : 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = isChatBubble ? 0 : 14;
      lines.forEach((line, lIdx) => {
        ctx.fillText(line, actualQuoteX, quoteStartY + lIdx * lineSpacing);
      });
    } else if (effect === 'typewriter') {
    // Typewriter: Keystroke by keystroke reveal with speed control
    const charsPerSec = 35 * speedMult;
    const charsToShow = Math.floor(elapsed * charsPerSec);

    let charCursor = 0;
    lines.forEach((line, lIdx) => {
      const lineY = quoteStartY + lIdx * lineSpacing;
      if (charCursor >= charsToShow) return;

      const remainingAllowed = charsToShow - charCursor;
      const subLine = line.slice(0, remainingAllowed);

      ctx.fillStyle = actualQuoteColor;
      ctx.shadowColor = isChatBubble ? 'transparent' : 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = isChatBubble ? 0 : 14;
      ctx.fillText(subLine, actualQuoteX, lineY);

      // Blinking typing block cursor at current typing position
      if (remainingAllowed <= line.length && charsToShow < totalChars) {
        const subW = ctx.measureText(subLine).width;
        const blink = Math.sin(currentTime * 10) > 0;
        if (blink) {
          ctx.fillStyle = '#ff334b';
          ctx.fillRect(quoteStartX + subW + 4, lineY + 4, 3, quoteFontSize * 0.9);
        }
      }

      charCursor += line.length + 1; // +1 for space/newline
    });
  } else if (effect === 'falling') {
    // Falling: Characters cascade in from above with gravity & bounce settling
    const fallStagger = 0.025 / speedMult;
    const fallDur = 0.42;

    let charGlobalIdx = 0;
    lines.forEach((line, lIdx) => {
      const lineY = quoteStartY + lIdx * lineSpacing;
      let lineX = quoteStartX;

      for (let cIdx = 0; cIdx < line.length; cIdx++) {
        const char = line[cIdx];
        const charStart = charGlobalIdx * fallStagger;
        const charElapsed = Math.max(0, elapsed - charStart);
        charGlobalIdx++;

        if (charElapsed <= 0) continue; // hasn't started falling yet

        const t = Math.min(1.0, charElapsed / fallDur);
        // Spring bounce settling curve
        const p = t < 0.75
          ? Math.pow(t / 0.75, 2)
          : 1 + Math.sin((t - 0.75) * Math.PI / 0.25) * 0.12 * (1 - t);

        const dropY = (1 - p) * -85;
        const alpha = Math.min(1.0, t * 2.8);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = quoteColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 14;
        ctx.fillText(char, lineX, lineY + dropY);
        ctx.restore();

        lineX += ctx.measureText(char).width;
      }
    });
  } else if (effect === 'pop') {
    // Kinetic Word Pop
    let wordCursor = 0;
    lines.forEach((line, lIdx) => {
      const lineY = quoteStartY + lIdx * lineSpacing;
      let lineX = quoteStartX;
      const lineWords = line.split(' ');

      lineWords.forEach(w => {
        const wordStart = (wordCursor / Math.max(1, words.length)) * (2.5 / speedMult);
        wordCursor++;

        if (elapsed < wordStart) return;

        ctx.save();
        ctx.fillStyle = quoteColor;
        if (elapsed >= wordStart && elapsed <= wordStart + 0.35) {
          ctx.shadowColor = '#ff334b';
          ctx.shadowBlur = 32;
        } else {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = 12;
        }
        ctx.fillText(w, lineX, lineY);
        ctx.restore();

        lineX += ctx.measureText(w + ' ').width;
      });
    });
  } else if (effect === 'fade') {
    // Cinematic Fade
    const fadeProg = Math.min(1.0, elapsed / (1.2 / speedMult));
    ctx.globalAlpha = fadeProg;
    ctx.fillStyle = quoteColor;
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, quoteStartX, quoteStartY + lIdx * lineSpacing);
    });
  } else if (effect === 'slide_up') {
    // Slide Up Ease
    const t = Math.min(1.0, elapsed / (0.8 / speedMult));
    const ease = 1 - Math.pow(1 - t, 3);
    const offset = (1 - ease) * 60;
    ctx.globalAlpha = Math.min(1.0, t * 2.0);
    ctx.fillStyle = quoteColor;
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, quoteStartX, quoteStartY + lIdx * lineSpacing + offset);
    });
  } else {
    // Static / Instant
    ctx.fillStyle = quoteColor;
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, actualQuoteX, quoteStartY + lIdx * lineSpacing);
    });
  }
}

  // Draw Closing Quotation Mark after text end
  if (showQuoteMarks && lines.length > 0 && !editingQuote) {
    const lastLineIdx = lines.length - 1;
    const lastLineText = lines[lastLineIdx];
    const lastLineY = quoteStartY + lastLineIdx * lineSpacing;
    const lastLineW = ctx.measureText(lastLineText).width;
    const closingX = Math.min(quoteStartX + quoteMaxW - 30, actualQuoteX + lastLineW + 10);

    ctx.save();
    ctx.font = '700 64px Georgia, serif';
    ctx.fillStyle = markColor;
    ctx.shadowColor = markColor;
    ctx.shadowBlur = 12;
    ctx.fillText('”', closingX, lastLineY - 10);
    ctx.restore();
  }


  ctx.restore();

  // Store interactive render bounds for selection, dragging & transform
  clip._renderBounds = {
    x: cardX,
    y: cardY,
    w: cardW,
    h: cardH
  };

  const headerMaxW = cardX + cardW - headerTextX - 60;

  clip._subBounds = {
    avatar: { x: avatarCenterX - avatarRadius, y: avatarCenterY - avatarRadius, w: avatarRadius * 2, h: avatarRadius * 2 },
    name: { x: headerTextX, y: nameY - nameSt.size * 0.65, w: headerMaxW, h: nameSt.size * 1.3 },
    role: { x: headerTextX, y: roleY - roleSt.size * 0.65, w: headerMaxW, h: roleSt.size * 1.3 },
    quoteBody: {
      x: isChatBubble ? (quoteStartX + 12) : actualQuoteX,
      y: quoteStartY - (isChatBubble ? 4 : 6),
      w: isChatBubble ? Math.min(quoteMaxW - 24, Math.max(140, maxLineWidth + 24)) : actualQuoteMaxW,
      h: isChatBubble ? (lines.length * lineSpacing + 16) : Math.max(lineSpacing * 2, Math.max(1, lines.length) * lineSpacing + 12)
    },
    card: { x: cardX, y: cardY, w: cardW, h: cardH }
  };

  // Draw transform bounding box and corner handles if this quote clip is currently selected (unless currently editing text inline)
  if (selectedClip && selectedClip.clip.id === clip.id && (selectedClip.trackType === 'quote' || clip.isQuoteCard) && !clip._editingField) {
    drawTransformHandles(cardX, cardY, cardW, cardH);
  }

  ctx.restore();
}

// 3. Populate Quote Card Inspector Sidebar Controls
function populateQuoteCardInspector(clip) {
  if (!clip) return;

  const titleInp = document.getElementById('quote-title');
  const subInp = document.getElementById('quote-subtitle');
  const bodyInp = document.getElementById('quote-body-text');
  const effectSel = document.getElementById('quote-text-effect');
  const speedSlider = document.getElementById('quote-effect-speed');
  const speedLabel = document.getElementById('quote-effect-speed-label');
  const fontSizeSlider = document.getElementById('quote-font-size');
  const fontSizeVal = document.getElementById('quote-font-size-val');
  const fontFamSel = document.getElementById('quote-font-family');
  const bgModeSel = document.getElementById('quote-bg-mode');
  const col1Inp = document.getElementById('quote-bg-color1');
  const col1Val = document.getElementById('quote-bg-color1-val');
  const col2Inp = document.getElementById('quote-bg-color2');
  const col2Val = document.getElementById('quote-bg-color2-val');
  const col2Wrap = document.getElementById('col-quote-bg-color2');
  const rowColors = document.getElementById('row-quote-bg-colors');
  const glassRow = document.getElementById('row-quote-glass-controls');
  const glassBox = document.getElementById('quote-glass-enable');
  const glassBlur = document.getElementById('quote-glass-blur');
  const glassOp = document.getElementById('quote-glass-opacity');
  const rowBgImg = document.getElementById('row-quote-bg-image');
  const bgDim = document.getElementById('quote-bg-dim');
  const borderCol = document.getElementById('quote-avatar-border-color');
  const borderW = document.getElementById('quote-avatar-border-width');
  const avSize = document.getElementById('quote-avatar-size');

  if (titleInp) titleInp.value = clip.speakerTitle || '';
  if (subInp) subInp.value = clip.speakerSubtitle || '';
  if (bodyInp) bodyInp.value = clip.quoteText || '';
  if (effectSel) effectSel.value = clip.quoteEffect || 'typewriter';
  if (speedSlider) speedSlider.value = clip.effectSpeed || 1.0;
  if (speedLabel) speedLabel.textContent = `${(clip.effectSpeed || 1.0).toFixed(1)}x`;
  if (fontSizeSlider) fontSizeSlider.value = clip.fontSize || 34;
  if (fontSizeVal) fontSizeVal.textContent = `${clip.fontSize || 34}px`;
  if (fontFamSel) fontFamSel.value = clip.fontFamily || "'Inter', sans-serif";
  if (bgModeSel) bgModeSel.value = clip.bgMode || 'gradient';
  if (col1Inp) col1Inp.value = clip.bgColor1 || '#262933';
  if (col1Val) col1Val.textContent = clip.bgColor1 || '#262933';
  if (col2Inp) col2Inp.value = clip.bgColor2 || '#090a0d';
  if (col2Val) col2Val.textContent = clip.bgColor2 || '#090a0d';
  if (glassBox) glassBox.checked = clip.glassEnabled !== false;
  if (glassBlur) glassBlur.value = clip.glassBlur !== undefined ? clip.glassBlur : 16;
  if (glassOp) glassOp.value = clip.glassOpacity !== undefined ? clip.glassOpacity : 65;
  if (bgDim) bgDim.value = clip.bgDim !== undefined ? clip.bgDim : 45;
  if (borderCol) borderCol.value = clip.avatarBorderColor || '#ffffff';
  if (borderW) borderW.value = clip.avatarBorderWidth !== undefined ? clip.avatarBorderWidth : 3;
  if (avSize) avSize.value = clip.avatarSize || 110;

  // Shape button active styling
  const activeShape = clip.avatarShape || 'circle';
  document.querySelectorAll('#quote-shape-group .btn-sm').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.shape === activeShape);
  });

  // Toggle visibility of gradient / solid / image / glass rows based on bgMode
  const mode = clip.bgMode || 'gradient';
  if (rowColors) rowColors.style.display = (mode === 'gradient' || mode === 'solid') ? 'block' : 'none';
  if (col2Wrap) col2Wrap.style.display = (mode === 'gradient') ? 'block' : 'none';
  if (rowBgImg) rowBgImg.style.display = (mode === 'image') ? 'block' : 'none';
}

// 4. Initialize Quote Card Inspector Listeners & Controls
function initQuoteCardListeners() {
  const titleInp = document.getElementById('quote-title');
  const subInp = document.getElementById('quote-subtitle');
  const bodyInp = document.getElementById('quote-body-text');
  const effectSel = document.getElementById('quote-text-effect');
  const speedSlider = document.getElementById('quote-effect-speed');
  const speedLabel = document.getElementById('quote-effect-speed-label');
  const fontSizeSlider = document.getElementById('quote-font-size');
  const fontSizeVal = document.getElementById('quote-font-size-val');
  const fontFamSel = document.getElementById('quote-font-family');
  const bgModeSel = document.getElementById('quote-bg-mode');
  const col1Inp = document.getElementById('quote-bg-color1');
  const col1Val = document.getElementById('quote-bg-color1-val');
  const col2Inp = document.getElementById('quote-bg-color2');
  const col2Val = document.getElementById('quote-bg-color2-val');
  const glassBox = document.getElementById('quote-glass-enable');
  const glassBlur = document.getElementById('quote-glass-blur');
  const glassOp = document.getElementById('quote-glass-opacity');
  const bgDim = document.getElementById('quote-bg-dim');
  const borderCol = document.getElementById('quote-avatar-border-color');
  const borderW = document.getElementById('quote-avatar-border-width');
  const avSize = document.getElementById('quote-avatar-size');
  const avFileInp = document.getElementById('quote-avatar-file');
  const avPickMediaBtn = document.getElementById('btn-quote-pick-media');
  const avRemoveBtn = document.getElementById('btn-quote-remove-avatar');
  const bgImgFileInp = document.getElementById('quote-bg-image-file');
  const bgPickMediaBtn = document.getElementById('btn-quote-pick-bg-media');
  const replayBtn = document.getElementById('btn-replay-quote-anim');
  const deleteBtn = document.getElementById('btn-delete-quote-card');
  const dupBtn = document.getElementById('btn-duplicate-quote');

  const getActiveQuote = () => {
    if (selectedClip?.clip && (selectedClip.trackType === 'quote' || selectedClip.clip.isQuoteCard)) {
      return selectedClip.clip;
    }
    return (timelineClips.quote && timelineClips.quote.length > 0) ? timelineClips.quote[0] : null;
  };

  titleInp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.speakerTitle = e.target.value;
    renderAllTimelineTracks();
  });
  titleInp?.addEventListener('change', () => recordState('Edit Speaker Title'));

  subInp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.speakerSubtitle = e.target.value;
  });
  subInp?.addEventListener('change', () => recordState('Edit Speaker Subtitle'));

  bodyInp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.quoteText = e.target.value;
    renderAllTimelineTracks();
  });
  bodyInp?.addEventListener('change', () => recordState('Edit Quote Text'));

  effectSel?.addEventListener('change', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.quoteEffect = e.target.value;
    recordState('Change Quote Effect');
    showTextTimingAlert(`Effect changed to ${e.target.options[e.target.selectedIndex].text}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  speedSlider?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    const val = parseFloat(e.target.value);
    q.effectSpeed = val;
    if (speedLabel) speedLabel.textContent = `${val.toFixed(1)}x`;
  });
  speedSlider?.addEventListener('change', () => recordState('Change Quote Speed'));

  fontSizeSlider?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.fontSize = parseInt(e.target.value);
    if (fontSizeVal) fontSizeVal.textContent = `${q.fontSize}px`;
  });
  fontSizeSlider?.addEventListener('change', () => recordState('Change Quote Font Size'));

  fontFamSel?.addEventListener('change', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.fontFamily = e.target.value;
    recordState('Change Quote Font');
  });

  bgModeSel?.addEventListener('change', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.bgMode = e.target.value;
    populateQuoteCardInspector(q);
    recordState('Change Quote Background Mode');
  });

  col1Inp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.bgColor1 = e.target.value;
    if (col1Val) col1Val.textContent = e.target.value;
  });
  col1Inp?.addEventListener('change', () => recordState('Change Quote Inner Color'));

  col2Inp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.bgColor2 = e.target.value;
    if (col2Val) col2Val.textContent = e.target.value;
  });
  col2Inp?.addEventListener('change', () => recordState('Change Quote Outer Color'));

  glassBox?.addEventListener('change', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.glassEnabled = e.target.checked;
    recordState('Toggle Glassmorphism');
  });

  glassBlur?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.glassBlur = parseInt(e.target.value);
  });
  glassBlur?.addEventListener('change', () => recordState('Change Glass Blur'));

  glassOp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.glassOpacity = parseInt(e.target.value);
  });
  glassOp?.addEventListener('change', () => recordState('Change Glass Opacity'));

  bgDim?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.bgDim = parseInt(e.target.value);
  });
  bgDim?.addEventListener('change', () => recordState('Change Background Wallpaper Dim'));

  borderCol?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.avatarBorderColor = e.target.value;
  });
  borderCol?.addEventListener('change', () => recordState('Change Frame Border Color'));

  borderW?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.avatarBorderWidth = parseInt(e.target.value);
  });
  borderW?.addEventListener('change', () => recordState('Change Frame Border Width'));

  avSize?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.avatarSize = parseInt(e.target.value);
  });
  avSize?.addEventListener('change', () => recordState('Change Avatar Size'));

  // Shape Selector Buttons (Circle, Rounded, Hexagon, Square)
  document.querySelectorAll('#quote-shape-group .btn-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = getActiveQuote();
      if (!q) return;
      document.querySelectorAll('#quote-shape-group .btn-sm').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      q.avatarShape = btn.dataset.shape || 'circle';
      recordState('Change Avatar Shape');
    });
  });

  // Avatar Image Upload
  avFileInp?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const q = getActiveQuote();
    if (!q) return;
    const reader = new FileReader();
    reader.onload = (re) => {
      q.avatarFile = { name: file.name, url: re.target.result };
      recordState('Upload Speaker Avatar');
      showTextTimingAlert('Speaker photo uploaded!', 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    };
    reader.readAsDataURL(file);
  });

  // Pick Avatar from Media Library
  avPickMediaBtn?.addEventListener('click', () => {
    const q = getActiveQuote();
    if (!q) return;
    openQuoteImagePickerModal((chosenFile) => {
      q.avatarFile = { name: chosenFile.name, url: chosenFile.url };
      recordState('Select Avatar from Library');
      showTextTimingAlert(`Selected avatar: "${chosenFile.name}"`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    });
  });

  // Remove Avatar Picture
  avRemoveBtn?.addEventListener('click', () => {
    const q = getActiveQuote();
    if (!q) return;
    q.avatarFile = null;
    recordState('Remove Avatar Picture');
    showTextTimingAlert('Removed avatar photo (Using silhouette frame)', 'info');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  // Background Image Upload
  bgImgFileInp?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const q = getActiveQuote();
    if (!q) return;
    const reader = new FileReader();
    reader.onload = (re) => {
      q.bgImageFile = { name: file.name, url: re.target.result };
      q.bgMode = 'image';
      populateQuoteCardInspector(q);
      recordState('Upload Background Image');
      showTextTimingAlert('Custom background wallpaper set!', 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    };
    reader.readAsDataURL(file);
  });

  // Pick Background Image from Media Library
  bgPickMediaBtn?.addEventListener('click', () => {
    const q = getActiveQuote();
    if (!q) return;
    openQuoteImagePickerModal((chosenFile) => {
      q.bgImageFile = { name: chosenFile.name, url: chosenFile.url };
      q.bgMode = 'image';
      populateQuoteCardInspector(q);
      recordState('Select Background from Library');
      showTextTimingAlert(`Wallpaper set: "${chosenFile.name}"`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    });
  });

  // Replay Animation
  replayBtn?.addEventListener('click', () => {
    const q = getActiveQuote();
    if (!q) return;
    seekToTime(q.start);
    isPlaying = true;
    showTextTimingAlert('Replaying animation...', 'info');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });

  // Duplicate Card
  dupBtn?.addEventListener('click', () => {
    const q = getActiveQuote();
    if (!q) return;
    const newStart = q.start + q.duration + 0.5;
    const cloned = JSON.parse(JSON.stringify(q));
    cloned.id = `clip-quote-${Date.now()}`;
    cloned.start = newStart;
    if (!timelineClips.quote) timelineClips.quote = [];
    timelineClips.quote.push(cloned);
    seekToTime(newStart);
    selectClip(cloned, 'quote');
    renderAllTimelineTracks();
    recordState('Duplicate Statement Card');
    showTextTimingAlert('Statement Card duplicated!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  // Delete Card
  deleteBtn?.addEventListener('click', () => {
    const q = getActiveQuote();
    if (!q) return;
    deleteClip('quote', q.id);
    recordState('Delete Statement Card');
    showTextTimingAlert('Statement Card removed', 'info');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  // Wire up Top Toolbar / Dropdown / Canvas Overlay Buttons
  document.getElementById('tool-add-quote')?.addEventListener('click', () => {
    const q = createNewQuoteCardAtTime(currentTime);
    q.cardStyle = 'executive';
    selectClip(q, 'quote');
  });
  document.getElementById('tool-add-chat-quote')?.addEventListener('click', () => {
    const q = createNewQuoteCardAtTime(currentTime);
    q.cardStyle = 'chat_bubble';
    q.speakerTitle = 'Enter Name Here';
    q.speakerSubtitle = 'Online';
    selectClip(q, 'quote');
    showTextTimingAlert('Chat Bubble Quote Card Created!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });
  document.querySelectorAll('[data-layer-action="add_chat_quote"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const q = createNewQuoteCardAtTime(currentTime);
      q.cardStyle = 'chat_bubble';
      q.speakerTitle = 'Enter Name Here';
      q.speakerSubtitle = 'Online';
      selectClip(q, 'quote');
      showTextTimingAlert('Chat Bubble Quote Card Created!', 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    });
  });

  document.getElementById('btn-canvas-quote-card')?.addEventListener('click', () => {
    createNewQuoteCardAtTime(currentTime);
  });

  // ==================== ON-CANVAS DIRECT OVERLAY LISTENERS ====================
  // Shape buttons in on-canvas HUD
  document.querySelectorAll('#quote-overlay-avatar-hud .quote-hud-shape-btns .quote-hud-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const q = getActiveQuote();
      if (!q) return;
      q.avatarShape = btn.dataset.shape;
      populateQuoteCardInspector(q);
      recordState('Change Avatar Shape');
      showTextTimingAlert(`Avatar shape changed to ${btn.dataset.shape}!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 1500);
    });
  });

  // Upload Headshot from canvas HUD
  const overlayFileInput = document.getElementById('quote-overlay-file-input');
  overlayFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const q = getActiveQuote();
    if (!q) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      q.avatarFile = { name: file.name, url: evt.target.result };
      populateQuoteCardInspector(q);
      recordState('Upload Avatar Headshot');
      showTextTimingAlert(`Headshot updated: "${file.name}"`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    };
    reader.readAsDataURL(file);
  });

  // Pick Avatar from Library from canvas HUD
  document.getElementById('quote-overlay-pick-media')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q) return;
    openQuoteImagePickerModal((chosenFile) => {
      q.avatarFile = { name: chosenFile.name, url: chosenFile.url };
      populateQuoteCardInspector(q);
      recordState('Pick Avatar from Library');
      showTextTimingAlert(`Avatar set to "${chosenFile.name}"!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    });
  });

  // Inline Speaker Name
  const overlayNameInp = document.getElementById('quote-overlay-name-input');
  overlayNameInp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.speakerTitle = e.target.value;
    const sideTitle = document.getElementById('quote-title');
    if (sideTitle) sideTitle.value = e.target.value;
    renderAllTimelineTracks();
  });
  overlayNameInp?.addEventListener('change', () => recordState('Edit Speaker Title'));

  // Inline Speaker Subtitle
  const overlayRoleInp = document.getElementById('quote-overlay-role-input');
  overlayRoleInp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.speakerSubtitle = e.target.value;
    const sideSub = document.getElementById('quote-subtitle');
    if (sideSub) sideSub.value = e.target.value;
  });
  overlayRoleInp?.addEventListener('change', () => recordState('Edit Speaker Subtitle'));

  // Inline Body Quote Textarea
  const overlayTextInp = document.getElementById('quote-overlay-text-input');
  overlayTextInp?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.quoteText = e.target.value;
    const sideBody = document.getElementById('quote-body-text');
    if (sideBody) sideBody.value = e.target.value;
    renderAllTimelineTracks();
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });
  overlayTextInp?.addEventListener('change', () => recordState('Edit Quote Text'));

  // Apple-grade Effect Selector Dropdown & Popover
  const effectTrigger = document.getElementById('quote-effect-trigger');
  const effectPopover = document.getElementById('quote-effect-popover');
  const effectDropdownWrap = document.getElementById('quote-effect-dropdown-wrap');
  const effectTriggerLabel = document.getElementById('quote-effect-trigger-label');

  const effectLabels = {
    typewriter: 'Typewriter (Live Typing)',
    falling: 'Falling Characters',
    pop: 'Kinetic Pop',
    fade: 'Cinematic Fade',
    slide_up: 'Slide Up',
    none: 'Static / Instant'
  };

  const closeEffectPopover = () => {
    if (effectPopover) effectPopover.style.display = 'none';
    effectDropdownWrap?.classList.remove('is-open');
  };

  effectTrigger?.addEventListener('mousedown', (e) => e.stopPropagation());
  effectTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!effectPopover) return;
    const isVisible = effectPopover.style.display !== 'none';
    if (isVisible) {
      closeEffectPopover();
    } else {
      effectPopover.style.display = 'flex';
      effectDropdownWrap?.classList.add('is-open');
      const q = getActiveQuote();
      const curEff = (q && q.quoteEffect) || 'typewriter';
      document.querySelectorAll('.apple-hud-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.effect === curEff);
      });
    }
  });

  // Effect Menu Item Click Handlers
  document.querySelectorAll('.apple-hud-menu-item').forEach(item => {
    item.addEventListener('mousedown', (e) => e.stopPropagation());
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const chosenEffect = item.dataset.effect;
      const q = getActiveQuote();
      if (!q) return;

      q.quoteEffect = chosenEffect;
      const sideEff = document.getElementById('quote-text-effect');
      if (sideEff) sideEff.value = chosenEffect;
      const hiddenSel = document.getElementById('quote-overlay-effect-select');
      if (hiddenSel) hiddenSel.value = chosenEffect;

      if (effectTriggerLabel) {
        effectTriggerLabel.textContent = effectLabels[chosenEffect] || chosenEffect;
      }

      document.querySelectorAll('.apple-hud-menu-item').forEach(it => {
        it.classList.toggle('active', it.dataset.effect === chosenEffect);
      });

      closeEffectPopover();
      recordState(`Change Quote Effect to ${chosenEffect}`);
      renderCanvas();
      syncQuoteCardCanvasOverlay();
      showTextTimingAlert(`Effect changed to ${effectLabels[chosenEffect] || chosenEffect}!`, 'success');
      setTimeout(() => showTextTimingAlert(''), 1500);
    });
  });

  // Close popover when clicking anywhere else
  document.addEventListener('click', (e) => {
    if (effectDropdownWrap && !effectDropdownWrap.contains(e.target)) {
      closeEffectPopover();
    }
  });

  // Hidden native select listener (for two-way sync)
  const overlayEffSel = document.getElementById('quote-overlay-effect-select');
  overlayEffSel?.addEventListener('mousedown', (e) => e.stopPropagation());
  overlayEffSel?.addEventListener('change', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.quoteEffect = e.target.value;
    const sideEff = document.getElementById('quote-text-effect');
    if (sideEff) sideEff.value = e.target.value;
    if (effectTriggerLabel) {
      effectTriggerLabel.textContent = effectLabels[e.target.value] || e.target.value;
    }
    recordState('Change Quote Effect');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
    showTextTimingAlert(`Effect changed to ${effectLabels[e.target.value] || e.target.value}!`, 'success');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });

  // Stop mousedown propagation on effect HUD container
  document.getElementById('quote-overlay-effect-hud')?.addEventListener('mousedown', (e) => e.stopPropagation());

  // On-canvas Speed controls
  document.getElementById('quote-overlay-speed-down')?.addEventListener('mousedown', (e) => e.stopPropagation());
  document.getElementById('quote-overlay-speed-down')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q) return;
    q.effectSpeed = Math.max(0.3, parseFloat(((q.effectSpeed || 1.0) - 0.2).toFixed(1)));
    populateQuoteCardInspector(q);
    recordState('Decrease Quote Speed');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  document.getElementById('quote-overlay-speed-up')?.addEventListener('mousedown', (e) => e.stopPropagation());
  document.getElementById('quote-overlay-speed-up')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q) return;
    q.effectSpeed = Math.min(3.0, parseFloat(((q.effectSpeed || 1.0) + 0.2).toFixed(1)));
    populateQuoteCardInspector(q);
    recordState('Increase Quote Speed');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  // On-canvas Replay button
  document.getElementById('quote-overlay-replay')?.addEventListener('mousedown', (e) => e.stopPropagation());
  document.getElementById('quote-overlay-replay')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q) return;
    seekToTime(q.start);
    isPlaying = true;
    showTextTimingAlert('Replaying animation...', 'info');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });

  // Avatar direct tap click handler -> open image picker modal directly
  document.getElementById('quote-hit-avatar')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q) return;
    openQuoteImagePickerModal((chosenFile) => {
      q.avatarFile = { name: chosenFile.name, url: chosenFile.url };
      populateQuoteCardInspector(q);
      recordState('Select Avatar from Library');
      showTextTimingAlert(`Selected avatar: "${chosenFile.name}"`, 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
      renderCanvas();
      syncQuoteCardCanvasOverlay();
    });
  });

  // 1. Hit targets click handlers (open in-place field editor & format bar)
  document.querySelectorAll('.quote-hit[data-field]').forEach(hit => {
    hit.addEventListener('click', (e) => {
      e.stopPropagation();
      const q = getActiveQuote();
      if (!q) return;
      const field = hit.dataset.field; // 'name', 'role', or 'quote'
      q._editingField = field;
      renderCanvas();
      syncQuoteCardCanvasOverlay();
      const inputEl = document.getElementById(field === 'quote' ? 'quote-overlay-text-input' : `quote-overlay-${field}-input`);
      if (inputEl) {
        inputEl.focus();
        if (typeof inputEl.select === 'function') inputEl.select();
      }
    });
  });

  // 2. Inline edit field blur & escape key handlers
  document.querySelectorAll('.quote-edit-field').forEach(input => {
    input.addEventListener('blur', () => {
      setTimeout(() => {
        const activeEl = document.activeElement;
        const overlay = document.getElementById('canvas-quote-overlay');
        if (overlay && overlay.contains(activeEl)) return;
        const q = getActiveQuote();
        if (q && q._editingField) {
          q._editingField = null;
          recordState('Edit Quote Card Text');
          renderCanvas();
          syncQuoteCardCanvasOverlay();
        }
      }, 150);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || (e.key === 'Enter' && input.tagName === 'INPUT')) {
        input.blur();
      }
    });
  });

  // 3. Word-Style Format Bar Control Handlers
  document.getElementById('qfmt-font')?.addEventListener('change', (e) => {
    const q = getActiveQuote();
    if (!q || !q._editingField) return;
    q[q._editingField + 'Font'] = e.target.value;
    recordState('Change Font');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  document.getElementById('qfmt-smaller')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q || !q._editingField) return;
    const f = q._editingField;
    const curSize = q[f + 'Size'] || (f === 'name' ? 60 : (f === 'role' ? 38 : (q.fontSize || 34)));
    q[f + 'Size'] = Math.max(12, curSize - 2);
    recordState('Decrease Font Size');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  document.getElementById('qfmt-bigger')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q || !q._editingField) return;
    const f = q._editingField;
    const curSize = q[f + 'Size'] || (f === 'name' ? 60 : (f === 'role' ? 38 : (q.fontSize || 34)));
    q[f + 'Size'] = Math.min(140, curSize + 2);
    recordState('Increase Font Size');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  document.getElementById('qfmt-color')?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q || !q._editingField) return;
    q[q._editingField + 'Color'] = e.target.value;
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  document.getElementById('qfmt-color')?.addEventListener('change', () => {
    recordState('Change Text Color');
  });

  document.getElementById('qfmt-bold')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q || !q._editingField) return;
    const f = q._editingField;
    const defBold = f === 'name';
    const curBold = q[f + 'Bold'] !== undefined ? q[f + 'Bold'] : defBold;
    q[f + 'Bold'] = !curBold;
    recordState('Toggle Bold');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  document.getElementById('qfmt-italic')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q || !q._editingField) return;
    const f = q._editingField;
    q[f + 'Italic'] = !q[f + 'Italic'];
    recordState('Toggle Italic');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
  });

  // Quotation Marks Color Picker
  document.getElementById('qfmt-mark-color')?.addEventListener('input', (e) => {
    const q = getActiveQuote();
    if (!q) return;
    q.quoteMarkColor = e.target.value;
    renderCanvas();
  });
  document.getElementById('qfmt-mark-color')?.addEventListener('change', () => {
    recordState('Change Quotation Marks Color');
  });

  // Toggle Quotation Marks Visibility (Show / Remove)
  document.getElementById('qfmt-toggle-marks')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const q = getActiveQuote();
    if (!q) return;
    q.quoteMarksVisible = q.quoteMarksVisible === false;
    recordState('Toggle Quotation Marks');
    renderCanvas();
    syncQuoteCardCanvasOverlay();
    showTextTimingAlert(q.quoteMarksVisible ? 'Quotation marks enabled' : 'Quotation marks hidden', 'info');
    setTimeout(() => showTextTimingAlert(''), 1500);
  });

  // (Stage background context menu is handled contextually by the primary canvas contextmenu router)

  // Wire canvas stage click (deselection of quote editing field when clicking truly outside)
  canvas?.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    if (isTransforming) return; // Do not deselect if user is dragging, grabbing handles, or resizing!
    const q = (timelineClips.quote || []).find(c => c._editingField);
    if (q) {
      q._editingField = null;
      renderCanvas();
      syncQuoteCardCanvasOverlay();
    }
  });
}

// 4b. Synchronize On-Canvas Interactive Quote Overlay with Real Canvas Coordinates
function syncQuoteCardCanvasOverlay() {
  const overlay = document.getElementById('canvas-quote-overlay');
  if (!overlay || !canvasWrapper) return;

  const isClipSelected = selectedClip && (selectedClip.trackType === 'quote' || selectedClip.clip?.isQuoteCard);
  const activeQuoteClip = isClipSelected ? selectedClip.clip : null;

  if (!activeQuoteClip || !activeQuoteClip._subBounds) {
    overlay.style.display = 'none';
    overlay.classList.remove('is-active');
    return;
  }

  overlay.style.display = 'block';
  overlay.classList.add('is-active');

  const canvasRect = canvas.getBoundingClientRect();
  const wrapperRect = canvasWrapper.getBoundingClientRect();
  const scaleX = canvasRect.width / canvas.width;
  const scaleY = canvasRect.height / canvas.height;
  const offsetX = canvasRect.left - wrapperRect.left;
  const offsetY = canvasRect.top - wrapperRect.top;

  const sb = activeQuoteClip._subBounds;

  // 1. Avatar Hit Area & HUD
  const hitAvatar = document.getElementById('quote-hit-avatar');
  const avatarHud = document.getElementById('quote-overlay-avatar-hud');
  if (sb.avatar) {
    const avX = offsetX + sb.avatar.x * scaleX;
    const avY = offsetY + sb.avatar.y * scaleY;
    const avW = sb.avatar.w * scaleX;
    const avH = sb.avatar.h * scaleY;
    if (hitAvatar) {
      hitAvatar.style.display = 'block';
      hitAvatar.style.left = `${avX}px`;
      hitAvatar.style.top = `${avY}px`;
      hitAvatar.style.width = `${avW}px`;
      hitAvatar.style.height = `${avH}px`;
    }
    if (avatarHud) {
      avatarHud.style.left = `${avX + avW / 2}px`;
      avatarHud.style.top = `${avY + avH + 8}px`;
      avatarHud.style.transform = 'translateX(-50%)';

      const curShape = activeQuoteClip.avatarShape || 'circle';
      avatarHud.querySelectorAll('.quote-hud-shape-btns .quote-hud-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shape === curShape);
      });
    }
  }

  // 2. Text Fields (hit areas & inline inputs)
  const editingField = activeQuoteClip._editingField;
  const fields = [
    { name: 'name', subKey: 'name', inputId: 'quote-overlay-name-input', hitId: 'quote-hit-name', defaultVal: activeQuoteClip.speakerTitle || '', defSize: 60, defBold: true, defColor: activeQuoteClip.textColor || '#ffffff' },
    { name: 'role', subKey: 'role', inputId: 'quote-overlay-role-input', hitId: 'quote-hit-role', defaultVal: activeQuoteClip.speakerSubtitle || '', defSize: 38, defBold: false, defColor: activeQuoteClip.subtitleColor || '#94a3b8' },
    { name: 'quote', subKey: 'quoteBody', inputId: 'quote-overlay-text-input', hitId: 'quote-hit-quote', defaultVal: activeQuoteClip.quoteText || '', defSize: activeQuoteClip.fontSize || 34, defBold: false, defColor: '#f1f1f1' }
  ];

  fields.forEach(f => {
    const hitEl = document.getElementById(f.hitId);
    const inputEl = document.getElementById(f.inputId);
    const sub = sb[f.subKey];
    if (!sub) return;

    const x = offsetX + sub.x * scaleX;
    const y = offsetY + sub.y * scaleY;
    const w = sub.w * scaleX;
    const h = sub.h * scaleY;

    if (editingField === f.name) {
      if (hitEl) hitEl.style.display = 'none';
      if (inputEl) {
        inputEl.style.display = 'block';
        inputEl.style.left = `${x}px`;
        inputEl.style.top = `${y}px`;
        inputEl.style.width = `${w}px`;
        inputEl.style.height = `${h}px`;

        const fmtFont = activeQuoteClip[f.name + 'Font'] || activeQuoteClip.fontFamily || "'Inter', sans-serif";
        const fmtSize = (activeQuoteClip[f.name + 'Size'] || f.defSize) * scaleY;
        const fmtColor = activeQuoteClip[f.name + 'Color'] || f.defColor;
        const fmtBold = activeQuoteClip[f.name + 'Bold'] !== undefined ? activeQuoteClip[f.name + 'Bold'] : f.defBold;
        const fmtItalic = !!activeQuoteClip[f.name + 'Italic'];

        inputEl.style.fontFamily = fmtFont;
        inputEl.style.fontSize = `${fmtSize}px`;
        inputEl.style.color = fmtColor;
        inputEl.style.fontWeight = fmtBold ? '700' : '400';
        inputEl.style.fontStyle = fmtItalic ? 'italic' : 'normal';
        inputEl.style.lineHeight = '1.5';

        const isChatBubble = activeQuoteClip.cardStyle === 'chat_bubble';
        if (f.name === 'quote' && isChatBubble) {
          const isReceived = activeQuoteClip.chatDirection !== 'sent';
          inputEl.style.background = isReceived ? '#e9e9eb' : '#007aff';
          inputEl.style.color = isReceived ? '#1c1c1e' : '#ffffff';
          inputEl.style.borderColor = 'rgba(0,0,0,0.2)';
          inputEl.style.padding = '4px 8px';
          inputEl.style.borderRadius = '12px';
        } else {
          inputEl.style.background = 'rgba(0, 0, 0, 0.18)';
          inputEl.style.borderColor = '#38bdf8';
          inputEl.style.padding = '0 4px';
          inputEl.style.borderRadius = '6px';
        }

        if (document.activeElement !== inputEl) {
          inputEl.value = f.defaultVal;
        }
      }
    } else {
      if (inputEl) inputEl.style.display = 'none';
      if (hitEl) {
        hitEl.style.display = 'block';
        hitEl.style.left = `${x}px`;
        hitEl.style.top = `${y}px`;
        hitEl.style.width = `${w}px`;
        hitEl.style.height = `${h}px`;
      }
    }
  });

  // 3. Word-style Formatting Bar
  const formatBar = document.getElementById('quote-format-bar');
  if (formatBar) {
    if (editingField) {
      const activeF = fields.find(f => f.name === editingField);
      const activeSub = activeF ? sb[activeF.subKey] : null;
      if (activeSub) {
        formatBar.style.display = 'flex';
        const barLeft = offsetX + activeSub.x * scaleX;
        const barTop = Math.max(10, offsetY + activeSub.y * scaleY - 44);
        formatBar.style.left = `${barLeft}px`;
        formatBar.style.top = `${barTop}px`;

        const qFont = document.getElementById('qfmt-font');
        const qSize = document.getElementById('qfmt-size');
        const qColor = document.getElementById('qfmt-color');
        const qBold = document.getElementById('qfmt-bold');
        const qItalic = document.getElementById('qfmt-italic');
        const qMarkCol = document.getElementById('qfmt-mark-color');
        const qToggleMarks = document.getElementById('qfmt-toggle-marks');

        const curFont = activeQuoteClip[editingField + 'Font'] || activeQuoteClip.fontFamily || "'Inter', sans-serif";
        const curSize = activeQuoteClip[editingField + 'Size'] || (activeF ? activeF.defSize : 34);
        const curColor = activeQuoteClip[editingField + 'Color'] || (activeF ? activeF.defColor : '#ffffff');
        const curBold = activeQuoteClip[editingField + 'Bold'] !== undefined ? activeQuoteClip[editingField + 'Bold'] : (activeF ? activeF.defBold : false);
        const curItalic = !!activeQuoteClip[editingField + 'Italic'];
        const curMarkColor = activeQuoteClip.quoteMarkColor || '#ff334b';
        const curMarksVis = activeQuoteClip.quoteMarksVisible !== false;

        if (qFont) qFont.value = curFont;
        if (qSize) qSize.textContent = curSize;
        if (qColor) qColor.value = curColor.startsWith('#') ? curColor : '#ffffff';
        if (qBold) qBold.classList.toggle('active', curBold);
        if (qItalic) qItalic.classList.toggle('active', curItalic);
        if (qMarkCol) {
          qMarkCol.value = curMarkColor.startsWith('#') ? curMarkColor : '#ff334b';
          qMarkCol.style.display = isChatBubble ? 'none' : 'block';
        }
        if (qToggleMarks) {
          qToggleMarks.classList.toggle('active', curMarksVis);
          qToggleMarks.style.display = isChatBubble ? 'none' : 'block';
        }
      }
    } else {
      formatBar.style.display = 'none';
    }
  }

  // 4. Effect & Speed Mini HUD (positioned right at bottom center of the card)
  const effectHud = document.getElementById('quote-overlay-effect-hud');
  if (effectHud && sb.card) {
    const effX = offsetX + (sb.card.x + sb.card.w / 2) * scaleX;
    const effY = offsetY + (sb.card.y + sb.card.h) * scaleY - 38;
    effectHud.style.left = `${effX}px`;
    effectHud.style.top = `${effY}px`;
    effectHud.style.transform = 'translateX(-50%)';

    const effSel = document.getElementById('quote-overlay-effect-select');
    const spdVal = document.getElementById('quote-overlay-speed-val');
    const curEffect = activeQuoteClip.quoteEffect || 'typewriter';
    if (effSel && document.activeElement !== effSel) {
      effSel.value = curEffect;
    }
    const effectTriggerLabel = document.getElementById('quote-effect-trigger-label');
    const effectLabels = {
      typewriter: 'Typewriter (Live Typing)',
      falling: 'Falling Characters',
      pop: 'Kinetic Pop',
      fade: 'Cinematic Fade',
      slide_up: 'Slide Up',
      none: 'Static / Instant'
    };
    if (effectTriggerLabel) {
      effectTriggerLabel.textContent = effectLabels[curEffect] || curEffect;
    }
    document.querySelectorAll('.apple-hud-menu-item').forEach(item => {
      item.classList.toggle('active', item.dataset.effect === curEffect);
    });

    if (spdVal) {
      spdVal.textContent = `${(activeQuoteClip.effectSpeed || 1.0).toFixed(1)}x`;
    }
  }
}

// 5. Quote Card Media Library Picker Modal
function openQuoteImagePickerModal(onSelectCallback) {
  document.getElementById('modal-quote-media-picker')?.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-quote-media-picker';
  modal.className = 'chart-modal-overlay is-open';
  modal.style.display = 'flex';

  const imageFiles = (mediaFiles || []).filter(m => m.isImage);

  modal.innerHTML = `
    <div class="chart-modal-card" style="max-width: 680px; width: 92%;">
      <div class="chart-modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: #ff334b;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          <span style="font-weight: 700; font-size: 14px;">Select Image from Media Library</span>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-quote-picker">&times;</button>
      </div>
      <div style="padding: 14px 18px; max-height: 420px; overflow-y: auto;">
        ${imageFiles.length === 0 ? `
          <div style="text-align: center; padding: 30px; color: var(--text-muted); font-size: 12px;">
            No image files loaded in library yet. Please upload files in Media Library on the left.
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
            ${imageFiles.map(img => `
              <div class="quote-picker-item" data-url="${img.url}" data-name="${img.name}" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; cursor: pointer; transition: all 0.15s ease;">
                <div style="height: 95px; width: 100%; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center;">
                  <img src="${img.url}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 6px 8px; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">
                  ${img.name}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
      <div class="chart-modal-footer" style="display: flex; justify-content: flex-end; padding: 10px 18px;">
        <button type="button" class="btn btn-secondary btn-sm" id="btn-cancel-quote-picker">Close</button>
      </div>
    </div>
  `;

  const isFsActive = !!document.fullscreenElement || canvasWrapper?.classList.contains('is-immersive-fallback');
  const mountTarget = (isFsActive && canvasWrapper) ? canvasWrapper : document.body;
  mountTarget.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#btn-close-quote-picker')?.addEventListener('click', closeModal);
  modal.querySelector('#btn-cancel-quote-picker')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  modal.querySelectorAll('.quote-picker-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.url;
      const name = item.dataset.name;
      if (onSelectCallback) onSelectCallback({ name, url });
      renderCanvas();
      syncQuoteCardCanvasOverlay();
      closeModal();
    });
  });
}

// 6. Blank Screen / Canvas Stage Background Context Menu (On-click or right-click empty screen)
function showCanvasBackgroundContextMenu(x, y) {
  hideStudioContextMenu();

  const menu = document.createElement('div');
  menu.className = 'studio-context-menu';
  activeStudioContextMenu = menu;

  menu.innerHTML = `
    <div class="context-menu-header">
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:170px;">Stage &amp; Background</span>
      <span class="context-badge">Stage</span>
    </div>
    <div class="context-menu-items-scroll">
      <!-- Create Executive Quote Card -->
      <div class="context-menu-item" id="ctx-action-new-quote">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        <span style="font-weight: 500; color: #fff;">Executive Quote Card</span>
        <span class="context-badge">Card</span>
      </div>

      <!-- Create Chat Bubble Quote Card -->
      <div class="context-menu-item" id="ctx-action-chat-quote">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
        <span style="font-weight: 500; color: #fff;">Chat Bubble Card</span>
        <span class="context-badge">Chat</span>
      </div>

      <div class="context-menu-divider"></div>
      <div style="font-size: 10px; font-weight: 600; color: var(--text-muted); padding: 4px 10px 2px 10px; text-transform: uppercase; letter-spacing: 0.5px;">Stage Background</div>

      <!-- Radial Gradient Preset (Cinematic Dark) -->
      <div class="context-menu-item" id="ctx-action-bg-gradient">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle, #3a4153 0%, #0a0b0e 100%); border: 1px solid rgba(255,255,255,0.25); flex-shrink: 0;"></span>
        <span>Cinematic Dark Gradient</span>
      </div>

      <!-- Frosted Glass Stage -->
      <div class="context-menu-item" id="ctx-action-bg-glass">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
        <span>Frosted Glass Effect</span>
      </div>

      <!-- Solid Black Studio -->
      <div class="context-menu-item" id="ctx-action-bg-black">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #000000; border: 1px solid rgba(255,255,255,0.25); flex-shrink: 0;"></span>
        <span>Solid Black Studio</span>
      </div>

      <!-- Dark Slate Stage -->
      <div class="context-menu-item" id="ctx-action-bg-slate">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #0d111a; border: 1px solid rgba(255,255,255,0.25); flex-shrink: 0;"></span>
        <span>Dark Slate Cinematic</span>
      </div>

      <!-- Image Wallpaper -->
      <div class="context-menu-item" id="ctx-action-bg-image">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        <span>Image Wallpaper Background...</span>
      </div>

      <!-- 3D Cyber Perspective Grid -->
      <div class="context-menu-item" id="ctx-action-bg-cyber">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #1f2937; border: 1px solid rgba(255,255,255,0.25); flex-shrink: 0;"></span>
        <span>3D Perspective Grid</span>
      </div>

      <div class="context-menu-divider"></div>

      <!-- Quick Add Overlay Options -->
      <div class="context-menu-item" id="ctx-action-quick-text">
        <svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>
        <span>Add Kinetic Text...</span>
      </div>
      <div class="context-menu-item" id="ctx-action-quick-chart">
        <svg viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
        <span>Add Animated Chart...</span>
      </div>
    </div>
  `;

  // Mount menu
  const isFsActive = !!document.fullscreenElement || canvasWrapper?.classList.contains('is-immersive-fallback');
  const mountTarget = isFsActive && canvasWrapper ? canvasWrapper : document.body;
  mountTarget.appendChild(menu);

  // Position
  const menuWidth = 260;
  const menuHeight = 360;
  let posX = x;
  let posY = y;
  if (isFsActive && canvasWrapper) {
    const wrapRect = canvasWrapper.getBoundingClientRect();
    posX = Math.min(wrapRect.width - menuWidth - 14, Math.max(14, x - wrapRect.left));
    posY = Math.min(wrapRect.height - menuHeight - 14, Math.max(14, y - wrapRect.top));
  } else {
    posX = Math.min(window.innerWidth - menuWidth - 10, Math.max(10, x));
    posY = Math.min(window.innerHeight - menuHeight - 10, Math.max(10, y));
  }
  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;

  // Attach Menu Event Handlers
  menu.querySelector('#ctx-action-new-quote')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    const q = createNewQuoteCardAtTime(currentTime);
    q.cardStyle = 'executive';
    selectClip(q, 'quote');
  });

  menu.querySelector('#ctx-action-chat-quote')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    const q = createNewQuoteCardAtTime(currentTime);
    q.cardStyle = 'chat_bubble';
    q.speakerTitle = 'Enter Name Here';
    q.speakerSubtitle = 'Online';
    selectClip(q, 'quote');
    showTextTimingAlert('Chat Bubble Quote Card Created!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-bg-gradient')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    fxState.stageBackground = { type: 'color', color: '#131722' };
    fxState.grid.enabled = false;
    const q = (timelineClips.quote || []).find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    if (q) {
      q.bgMode = 'gradient';
      selectClip(q, 'quote');
    }
    renderLayersPanel();
    renderCanvas();
    recordState('Set Radial Gradient Background');
    showTextTimingAlert('Cinematic Gradient Background Applied!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-bg-glass')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    const q = (timelineClips.quote || []).find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
    if (q) {
      q.glassEnabled = true;
      q.bgMode = 'glass';
      selectClip(q, 'quote');
    } else {
      // Spawn quote card with glass effect enabled
      const newQ = createNewQuoteCardAtTime(currentTime);
      newQ.glassEnabled = true;
      newQ.bgMode = 'glass';
      selectClip(newQ, 'quote');
    }
    recordState('Enable Frosted Glass Effect');
    renderCanvas();
    showTextTimingAlert('Frosted Glassmorphism Plate Active!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-bg-black')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    fxState.stageBackground = { type: 'solid_black', color: '#000000' };
    fxState.grid.enabled = false;
    renderLayersPanel();
    renderCanvas();
    recordState('Set Solid Black Studio');
    showTextTimingAlert('Set stage to Solid Black Studio!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-bg-slate')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    fxState.stageBackground = { type: 'color', color: '#0d111a' };
    fxState.grid.enabled = false;
    renderLayersPanel();
    renderCanvas();
    recordState('Set Dark Slate Background');
    showTextTimingAlert('Set stage to Dark Slate Cinematic!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-bg-image')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    openQuoteImagePickerModal((chosenFile) => {
      if (!chosenFile) return;
      const q = (timelineClips.quote || []).find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
      if (q) {
        q.bgMode = 'image';
        q.bgImageFile = { name: chosenFile.name, url: chosenFile.url };
        selectClip(q, 'quote');
      } else {
        const newQ = createNewQuoteCardAtTime(currentTime);
        newQ.bgMode = 'image';
        newQ.bgImageFile = { name: chosenFile.name, url: chosenFile.url };
        selectClip(newQ, 'quote');
      }
      renderCanvas();
      recordState('Set Image Wallpaper Background');
      showTextTimingAlert('Wallpaper Background Applied!', 'success');
      setTimeout(() => showTextTimingAlert(''), 2000);
    });
  });

  menu.querySelector('#ctx-action-bg-cyber')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    fxState.stageBackground = { type: 'cyber_grid', color: '#0a0b0e' };
    fxState.grid.enabled = true;
    renderLayersPanel();
    renderCanvas();
    recordState('Set 3D Cyber Perspective Grid');
    showTextTimingAlert('Set stage to 3D Cyber Grid!', 'success');
    setTimeout(() => showTextTimingAlert(''), 2000);
  });

  menu.querySelector('#ctx-action-quick-text')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    const btnAddText = document.getElementById('btn-add-text');
    if (btnAddText) btnAddText.click();
  });

  menu.querySelector('#ctx-action-quick-chart')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideStudioContextMenu();
    openChartCreatorModal(currentTime);
  });
}

// Initialize Quote Card Listeners on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuoteCardListeners);
} else {
  initQuoteCardListeners();
}

// ==============================================================================
// BEGINNER TEMPLATE SYSTEM & CUSTOM TEMPLATE GENERATOR
// ==============================================================================
const STORAGE_KEY_TEMPLATES_LIST = 'magnates_user_templates_v1';
let currentTemplateCategoryFilter = 'all';

// Built-in Curated Templates Engineered for Beginners
const BUILTIN_TEMPLATES = [
  {
    id: 'tpl_tiktok_hook_viral',
    name: 'TikTok / Reels Viral Hook & Drop',
    category: 'tiktok_reels',
    badge: '9:16 Vertical',
    aspectRatio: '9:16',
    duration: 12,
    description: 'Punchy 3-second hook video with kinetic headline, followed by highlight showcase and CTA.',
    requires: ['video', 'audio'],
    slots: [
      { id: 'slot-1', type: 'video', label: 'Hook Video Clip', duration: 3.5, hint: 'High-energy opener (first 3s)' },
      { id: 'slot-2', type: 'video', label: 'Main Showcase Video', duration: 6.0, hint: 'Core action or product demo' },
      { id: 'slot-3', type: 'text', label: 'Punchy Call-To-Action', duration: 2.5, text: 'FOLLOW FOR MORE 🚀' }
    ],
    previewBg: 'linear-gradient(135deg, #ff334b, #7928ca)',
    state: {
      duration: 12,
      background: [{ id: 'bg-1', start: 0, duration: 12, bgType: 'cyber_grid', bgColor: '#0a0b0e' }],
      text: [
        { id: 'txt-1', start: 0, duration: 3.5, text: 'STOP SCROLLING ⚠️', highlight: 'STOP', fontSize: 58, textColor: '#ffffff', highlightColor: '#ff334b', anim: 'pop', sfx: 'whoosh', position: 'top' },
        { id: 'txt-2', start: 3.5, duration: 6.0, text: 'Watch What Happens Next', highlight: 'Happens', fontSize: 44, textColor: '#ffffff', highlightColor: '#00f0ff', anim: 'slide', sfx: 'click', position: 'bottom' },
        { id: 'txt-3', start: 9.5, duration: 2.5, text: 'Follow For Part 2 🚀', highlight: 'Part 2', fontSize: 50, textColor: '#ffffff', highlightColor: '#ffd000', anim: 'pop', sfx: 'whoosh', position: 'center' }
      ],
      chart: [],
      quote: []
    }
  },
  {
    id: 'tpl_cinematic_vlog_intro',
    name: 'Cinematic Vlog / Travel Opener',
    category: 'vlog',
    badge: '16:9 Cinematic',
    aspectRatio: '16:9',
    duration: 15,
    description: 'Widescreen atmospheric title card with dark slate backdrop, elegant typography and quote.',
    requires: ['video', 'image'],
    slots: [
      { id: 'slot-1', type: 'video', label: 'Opening Establishing Shot', duration: 5.0, hint: 'Scenic drone or landscape' },
      { id: 'slot-2', type: 'quote', label: 'Narrative Quote Card', duration: 4.5, hint: 'Insightful documentary quote' },
      { id: 'slot-3', type: 'video', label: 'B-Roll Action Reel', duration: 5.5, hint: 'Fast travel montage' }
    ],
    previewBg: 'linear-gradient(135deg, #0d111a, #1a233a)',
    state: {
      duration: 15,
      background: [{ id: 'bg-1', start: 0, duration: 15, bgType: 'dark_slate', bgColor: '#0d111a' }],
      text: [
        { id: 'txt-1', start: 0, duration: 5.0, text: 'A JOURNEY INTO THE UNKNOWN', highlight: 'UNKNOWN', fontSize: 60, textColor: '#f8fafc', highlightColor: '#38bdf8', anim: 'fade', sfx: 'camera_shutter', position: 'center' }
      ],
      quote: [
        { id: 'quote-1', start: 5.0, duration: 4.5, quoteText: '"To travel is to live twice."', authorName: 'Magnates Journal', sourceTag: 'Volume IV', bgMode: 'slate', anim: 'fade' }
      ],
      chart: []
    }
  },
  {
    id: 'tpl_product_promo_stats',
    name: 'Product Promo & Growth Stat',
    category: 'promo',
    badge: 'Sales & Growth',
    aspectRatio: '16:9',
    duration: 14,
    description: 'Ideal for startups: showcase product photo/video followed by an animated upward revenue chart.',
    requires: ['image', 'video'],
    slots: [
      { id: 'slot-1', type: 'image', label: 'Product Hero Image', duration: 4.0, hint: 'Transparent PNG or photo' },
      { id: 'slot-2', type: 'chart', label: 'Metric Infographic Chart', duration: 5.0, hint: 'Bar/Line/Donut stat' },
      { id: 'slot-3', type: 'text', label: 'Closing Offer Headline', duration: 5.0, text: 'Get 50% Off Today' }
    ],
    previewBg: 'linear-gradient(135deg, #00f0ff, #0072ff)',
    state: {
      duration: 14,
      background: [{ id: 'bg-1', start: 0, duration: 14, bgType: 'cyber_grid', bgColor: '#080a10' }],
      text: [
        { id: 'txt-1', start: 0, duration: 4.0, text: 'The Future of Content Creation', highlight: 'Future', fontSize: 54, textColor: '#ffffff', highlightColor: '#00f0ff', anim: 'pop', sfx: 'whoosh', position: 'top' },
        { id: 'txt-2', start: 9.0, duration: 5.0, text: 'Claim Your Early Access Now', highlight: 'Early Access', fontSize: 50, textColor: '#ffffff', highlightColor: '#25d366', anim: 'pop', sfx: 'whoosh', position: 'center' }
      ],
      chart: [
        { id: 'chart-1', start: 4.0, duration: 5.0, chartType: 'bar', title: 'User Retention Surge', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [35, 58, 82, 96], barColor: '#00f0ff' }
      ],
      quote: []
    }
  },
  {
    id: 'tpl_kinetic_quote_podcast',
    name: 'Kinetic Quote & Podcast Voiceover',
    category: 'kinetic',
    badge: 'Audio / Quote',
    aspectRatio: '16:9',
    duration: 10,
    description: 'No footage needed! Perfect for voice recordings: animated typography with waveform audio backdrop.',
    requires: ['audio', 'text'],
    slots: [
      { id: 'slot-1', type: 'voiceover', label: 'Voiceover Recording', duration: 10.0, hint: 'Drop recorded speech here' },
      { id: 'slot-2', type: 'text', label: 'Key Statement Quote', duration: 6.0, text: 'Great things take time.' },
      { id: 'slot-3', type: 'quote', label: 'Speaker Credit Badge', duration: 4.0, hint: 'Speaker name and role' }
    ],
    previewBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    state: {
      duration: 10,
      background: [{ id: 'bg-1', start: 0, duration: 10, bgType: 'vox_cream', bgColor: '#f4eedb' }],
      text: [
        { id: 'txt-1', start: 0, duration: 6.0, text: '“Success is not final, failure is not fatal.”', highlight: 'Success', fontSize: 48, textColor: '#111827', highlightColor: '#ff334b', anim: 'typewriter', sfx: 'click', position: 'center' }
      ],
      quote: [
        { id: 'quote-1', start: 6.0, duration: 4.0, quoteText: 'It is the courage to continue that counts.', authorName: 'Winston Churchill', sourceTag: 'Daily Wisdom', bgMode: 'cream', anim: 'fade' }
      ],
      chart: []
    }
  }
];

// Read user custom templates from localStorage & server
function getCustomTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES_LIST);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomTemplates(list) {
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES_LIST, JSON.stringify(list));
  } catch (e) {}
}

function getAllAvailableTemplates() {
  const custom = getCustomTemplates();
  return [...custom, ...BUILTIN_TEMPLATES];
}

// 1. SAVE AS TEMPLATE LOGIC
function openSaveAsTemplateModal() {
  const modal = document.getElementById('modal-save-template');
  if (!modal) return;
  const nameInput = document.getElementById('tpl-input-name');
  if (nameInput) {
    nameInput.value = getCurrentProjectName() + ' Template';
  }
  const descInput = document.getElementById('tpl-input-desc');
  if (descInput) {
    descInput.value = 'Custom reusable template layout with saved effects';
  }
  modal.style.setProperty('display', 'flex', 'important');
  modal.classList.add('is-open');
}

function closeSaveAsTemplateModal() {
  const modal = document.getElementById('modal-save-template');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('is-open');
  }
}

async function handleConfirmSaveAsTemplate() {
  const nameInput = document.getElementById('tpl-input-name');
  const catSelect = document.getElementById('tpl-select-category');
  const descInput = document.getElementById('tpl-input-desc');

  const title = (nameInput?.value || '').trim() || 'Custom Template';
  const category = catSelect?.value || 'custom';
  const description = (descInput?.value || '').trim() || 'User created template layout';

  // Snapshot current timeline state
  const rawState = getSerializableClips();

  // Extract slots dynamically from timeline
  const slots = [];
  if (timelineClips.video && timelineClips.video.length > 0) {
    timelineClips.video.forEach((v, idx) => {
      slots.push({ id: `slot-v-${idx+1}`, type: 'video', label: `Video Clip Slot ${idx+1}`, duration: v.duration || 4 });
    });
  }
  if (timelineClips.image && timelineClips.image.length > 0) {
    timelineClips.image.forEach((img, idx) => {
      slots.push({ id: `slot-img-${idx+1}`, type: 'image', label: `Image Slot ${idx+1}`, duration: img.duration || 4 });
    });
  }
  if (timelineClips.text && timelineClips.text.length > 0) {
    timelineClips.text.forEach((t, idx) => {
      slots.push({ id: `slot-txt-${idx+1}`, type: 'text', label: `Headline Slot ${idx+1}`, duration: t.duration || 3, text: t.text });
    });
  }
  if (timelineClips.chart && timelineClips.chart.length > 0) {
    slots.push({ id: 'slot-chart-1', type: 'chart', label: 'Animated Chart Slot', duration: 5 });
  }

  const newTemplate = {
    id: 'tpl_custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name: title,
    category: category,
    badge: 'Custom',
    aspectRatio: '16:9',
    duration: duration || 15,
    description: description,
    requires: ['custom'],
    isCustom: true,
    createdAt: Date.now(),
    slots: slots.length > 0 ? slots : [
      { id: 'slot-1', type: 'video', label: 'Primary Video Slot', duration: 5 },
      { id: 'slot-2', type: 'text', label: 'Main Headline Slot', duration: 4 }
    ],
    previewBg: 'linear-gradient(135deg, #00f0ff, #a855f7)',
    state: rawState
  };

  // Save to localStorage
  const customList = getCustomTemplates();
  customList.unshift(newTemplate);
  saveCustomTemplates(customList);

  // Sync with backend API
  try {
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate)
    });
  } catch (err) {}

  closeSaveAsTemplateModal();
  playSFX('pop_cork', 0.8);
  showTextTimingAlert(`Saved "${title}" to Templates!`, 'success');
  setTimeout(() => showTextTimingAlert(''), 2500);

  // Refresh template hub view if currently viewing
  renderTemplatesHub();
}

// 2. APPLY TEMPLATE TO WORKSPACE
function applyTemplateToWorkspace(templateId) {
  const allTemplates = getAllAvailableTemplates();
  const tpl = allTemplates.find(t => t.id === templateId);
  if (!tpl) return;

  // Clone template state to protect original
  const cloned = JSON.parse(JSON.stringify(tpl.state || {}));

  // Create new active project instance from template
  const newProjName = `${tpl.name} Project`;
  _currentProjectId = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

  if (cloned.text && Array.isArray(cloned.text)) timelineClips.text = cloned.text;
  else timelineClips.text = [];

  ['chart', 'image', 'video', 'voiceover', 'music', 'background', 'quote'].forEach(track => {
    if (cloned[track] && Array.isArray(cloned[track])) {
      timelineClips[track] = cloned[track];
    } else {
      timelineClips[track] = [];
    }
  });

  if (typeof tpl.duration === 'number') {
    duration = tpl.duration;
  }
  currentTime = 0;

  const nameEl = document.getElementById('current-project');
  if (nameEl) nameEl.textContent = newProjName;
  const durBadge = document.getElementById('duration-badge');
  if (durBadge) durBadge.textContent = `00:00 / ${formatTime(duration)}`;

  renderAllTimelineTracks();
  saveProjectState(false);
  playSFX('whoosh', 0.7);

  showTextTimingAlert(`Applied Template: "${tpl.name}"! Replace slots or edit now.`, 'success');
  setTimeout(() => showTextTimingAlert(''), 3000);
}

// 3. RENDER TEMPLATES HUB
function renderTemplatesHub() {
  const container = document.getElementById('templates-list-container');
  if (!container) return;
  container.innerHTML = '';

  const allTemplates = getAllAvailableTemplates();
  const filtered = currentTemplateCategoryFilter === 'all'
    ? allTemplates
    : currentTemplateCategoryFilter === 'custom'
      ? allTemplates.filter(t => t.isCustom || t.category === 'custom')
      : allTemplates.filter(t => t.category === currentTemplateCategoryFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); font-size: 11.5px;">
        <svg class="ui-icon" viewBox="0 0 24 24" style="width: 28px; height: 28px; color: rgba(255,255,255,0.2); margin-bottom: 8px;"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
        <div>No templates found in this category.</div>
        <div style="font-size: 10px; margin-top: 4px; color: #64748b;">Click "Save Current" above to make your own!</div>
      </div>
    `;
    return;
  }

  filtered.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'template-card';

    const slotsCount = (tpl.slots && tpl.slots.length) || 2;
    const isCustom = !!tpl.isCustom;

    card.innerHTML = `
      <div class="template-card-preview" style="background: ${tpl.previewBg || '#1e2436'};">
        <span class="template-card-badge">${tpl.badge || 'Template'}</span>
        <span class="template-card-duration">${formatTime(tpl.duration || 10)}</span>
        <div style="font-size: 26px; opacity: 0.85;">✨</div>
      </div>
      <div>
        <h4 class="template-card-title">${tpl.name}</h4>
        <div class="template-card-desc">${tpl.description || 'Pre-designed high impact video template'}</div>
      </div>
      <div class="template-card-meta">
        <div class="template-slots-badge">
          <svg viewBox="0 0 24 24" style="width:12px; height:12px; fill:currentColor;"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          <span>${slotsCount} Smart Slots</span>
        </div>
        <div style="display: flex; gap: 6px;">
          ${isCustom ? `<button type="button" class="btn-micro-del tpl-del-btn" title="Delete Template" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:11px;">🗑️</button>` : ''}
          <button type="button" class="btn btn-secondary btn-sm tpl-use-btn" style="padding: 3px 8px; font-size: 10px; background: rgba(0,240,255,0.15); border-color:#00f0ff; color:#00f0ff; font-weight:700;">Use Template</button>
        </div>
      </div>
    `;

    card.querySelector('.tpl-use-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      applyTemplateToWorkspace(tpl.id);
    });

    if (isCustom) {
      card.querySelector('.tpl-del-btn')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        const conf = await nativeConfirm('Delete Template', `Delete "${tpl.name}" from custom templates?`);
        if (!conf) return;
        const currentCustom = getCustomTemplates().filter(t => t.id !== tpl.id);
        saveCustomTemplates(currentCustom);
        try { fetch(`/api/templates/${tpl.id}`, { method: 'DELETE' }).catch(() => {}); } catch(e) {}
        renderTemplatesHub();
        showTextTimingAlert(`Deleted template "${tpl.name}"`, 'info');
      });
    }

    card.addEventListener('click', () => {
      applyTemplateToWorkspace(tpl.id);
    });

    container.appendChild(card);
  });
}

// 4. BEGINNER ONBOARDING WIZARD ("Start With What You Have")
function openBeginnerOnboardingModal() {
  const modal = document.getElementById('modal-beginner-onboarding');
  if (!modal) return;
  modal.style.setProperty('display', 'flex', 'important');
  modal.classList.add('is-open');
  renderOnboardingRecommendations();
}

function closeBeginnerOnboardingModal() {
  const modal = document.getElementById('modal-beginner-onboarding');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('is-open');
  }
}

function getSelectedOnboardingAssets() {
  const cards = document.querySelectorAll('.onboarding-asset-card.active');
  const assets = [];
  cards.forEach(c => {
    if (c.dataset.has) assets.push(c.dataset.has);
  });
  return assets;
}

function renderOnboardingRecommendations() {
  const recContainer = document.getElementById('onboarding-recommended-templates');
  if (!recContainer) return;
  recContainer.innerHTML = '';

  const selectedAssets = getSelectedOnboardingAssets();
  const allTemplates = getAllAvailableTemplates();

  // Match templates with selected ingredients
  let matched = allTemplates.filter(tpl => {
    if (!tpl.requires || tpl.requires.length === 0) return true;
    return tpl.requires.some(req => selectedAssets.includes(req));
  });

  if (matched.length === 0) matched = allTemplates.slice(0, 3);
  else matched = matched.slice(0, 3);

  matched.forEach(tpl => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: #181d2c;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: all 0.2s ease;
    `;
    card.onmouseover = () => { card.style.borderColor = '#00f0ff'; card.style.transform = 'translateY(-2px)'; };
    card.onmouseout = () => { card.style.borderColor = 'rgba(255,255,255,0.1)'; card.style.transform = 'none'; };

    card.innerHTML = `
      <div style="height: 60px; border-radius: 4px; background: ${tpl.previewBg || '#23293e'}; display: flex; align-items: center; justify-content: center; position: relative;">
        <span style="position: absolute; top: 4px; left: 4px; font-size: 8px; font-weight: 700; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 3px; color: #00f0ff;">${tpl.badge || 'Template'}</span>
        <span style="font-size: 20px;">🎬</span>
      </div>
      <div style="font-size: 11.5px; font-weight: 700; color: #fff; line-height: 1.2;">${tpl.name}</div>
      <div style="font-size: 10px; color: #94a3b8; line-height: 1.3;">${tpl.slots?.length || 2} Replaceable Slots</div>
      <button type="button" class="btn btn-primary btn-sm" style="margin-top: 4px; font-size: 10.5px; padding: 4px 8px; background: #00f0ff; color: #000; font-weight: 700; border: none;">Use This</button>
    `;

    card.addEventListener('click', () => {
      closeBeginnerOnboardingModal();
      applyTemplateToWorkspace(tpl.id);
    });

    recContainer.appendChild(card);
  });
}

// Initialize Template Engine Listeners
function initTemplateEngineListeners() {
  // Top bar "Save as Template" button
  document.getElementById('btn-save-as-template')?.addEventListener('click', openSaveAsTemplateModal);
  // Panel "Save Current" button
  document.getElementById('btn-save-as-template-panel')?.addEventListener('click', openSaveAsTemplateModal);

  // Close Save Template modal
  document.getElementById('btn-close-save-template-modal')?.addEventListener('click', closeSaveAsTemplateModal);
  document.getElementById('btn-cancel-save-template')?.addEventListener('click', closeSaveAsTemplateModal);
  document.getElementById('btn-confirm-save-template')?.addEventListener('click', handleConfirmSaveAsTemplate);

  // Template Category Filter Tabs
  document.querySelectorAll('#templates-category-tabs .template-filter-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('#templates-category-tabs .template-filter-tab').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentTemplateCategoryFilter = e.currentTarget.dataset.cat || 'all';
      renderTemplatesHub();
    });
  });

  // Beginner Onboarding Wizard Listeners
  document.querySelectorAll('.onboarding-asset-card').forEach(card => {
    card.addEventListener('click', (e) => {
      card.classList.toggle('active');
      const chk = card.querySelector('.onboarding-check');
      if (chk) chk.checked = card.classList.contains('active');
      renderOnboardingRecommendations();
    });
  });

  document.getElementById('btn-close-onboarding-modal')?.addEventListener('click', closeBeginnerOnboardingModal);
  document.getElementById('btn-skip-onboarding')?.addEventListener('click', closeBeginnerOnboardingModal);
  document.getElementById('btn-view-all-templates-onboarding')?.addEventListener('click', () => {
    closeBeginnerOnboardingModal();
    switchMediaCategory('templates');
  });

  // Fetch initial templates from server if available
  fetch('/api/templates')
    .then(r => r.json())
    .then(data => {
      if (data && data.success && Array.isArray(data.templates) && data.templates.length > 0) {
        saveCustomTemplates(data.templates);
      }
    })
    .catch(() => {});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTemplateEngineListeners);
} else {
  initTemplateEngineListeners();
}

// ==================== REGAARDER STUDIO: CONTEXTUAL TABS & CANVAS POPOVER ====================
function initRegaarderStudioControls() {

  // 2. Canvas Secondary Settings Popover
  const btnCanvasSec = document.getElementById('btn-canvas-secondary-menu');
  const canvasSecPopover = document.getElementById('canvas-secondary-popover');
  if (btnCanvasSec && canvasSecPopover) {
    btnCanvasSec.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = canvasSecPopover.style.display !== 'none';
      canvasSecPopover.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
      if (!canvasSecPopover.contains(e.target) && e.target !== btnCanvasSec) {
        canvasSecPopover.style.display = 'none';
      }
    });
  }

  // 3. Vertical Navigation Rail (Uploads, Templates, Elements, Text, Icons, Layers, Projects)
  const railBtns = document.querySelectorAll('.nav-rail .rail-btn');
  railBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      railBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const railTab = e.currentTarget.dataset.railTab;
      const heading = document.getElementById('sidebar-panel-heading');
      const sub = document.getElementById('sidebar-panel-sub');
      
      const titleMap = {
        all: { title: 'Media Library', sub: 'Upload or select media files' },
        templates: { title: 'Templates', sub: 'Pre-built structures & layouts' },
        charts: { title: 'Elements', sub: 'Animated charts & widgets' },
        text: { title: 'Kinetic Text', sub: 'Typography & titles' },
        icons: { title: 'Icons & Stickers', sub: 'Vector iconography' },
        layers: { title: 'Canvas Layers', sub: 'Stage backgrounds & overlays' },
        projects: { title: 'Projects', sub: 'Saved project files & backups' }
      };

      if (titleMap[railTab] && heading && sub) {
        heading.textContent = titleMap[railTab].title;
        sub.textContent = titleMap[railTab].sub;
      }

      // If left sidebar was collapsed, automatically expand it to show the panel
      const workspace = document.querySelector('.workspace');
      if (workspace && workspace.classList.contains('hide-left')) {
        workspace.classList.remove('hide-left');
        const toggleBtn = document.getElementById('btn-toggle-left-sidebar');
        if (toggleBtn) toggleBtn.classList.add('active');
      }

      if (typeof switchMediaCategory === 'function') {
        switchMediaCategory(railTab);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegaarderStudioControls);
} else {
  initRegaarderStudioControls();
}


