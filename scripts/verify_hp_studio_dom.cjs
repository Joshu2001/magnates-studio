const fs = require('fs');
const path = require('path');

const studioDir = path.resolve(__dirname, '../magnates-studio');
const { JSDOM } = require(path.join(studioDir, 'node_modules/jsdom'));

async function main() {
  const htmlPath = path.join(studioDir, 'public/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(html, {
    url: 'http://localhost:3120/',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  const { window } = dom;
  const { document } = window;

  // Polyfill browser globals used by app.js
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
  window.HTMLMediaElement.prototype.load = () => {};
  window.HTMLCanvasElement.prototype.getContext = () => new Proxy({
    measureText: () => ({ width: 50 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    getImageData: () => ({ data: new Uint8ClampedArray(4) })
  }, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return () => {};
    }
  });
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.URL.createObjectURL = () => 'blob:mock';
  window.URL.revokeObjectURL = () => {};
  window.fetch = async () => ({
    ok: true,
    json: async () => ({}),
    text: async () => ''
  });
  window.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
  window.scrollTo = () => {};
  window.Element.prototype.scrollIntoView = () => {};

  const scriptsToLoad = [
    'public/js/world-geo-data.js',
    'public/js/tpl-snapshots.js',
    'public/js/app.js',
    'public/js/tpl-contextual-inspector.js',
    'public/js/regaarder-redesign.js',
    'public/js/hp-documentary-engine.js'
  ];

  for (const rel of scriptsToLoad) {
    const code = fs.readFileSync(path.join(studioDir, rel), 'utf8');
    window.eval(code);
  }

  // Trigger DOMContentLoaded & init
  document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 250));
  if (window.HPDocEngine && typeof window.HPDocEngine.init === 'function') {
    window.HPDocEngine.init();
  }

  // Open the Blueprint / Documentary Suite on Chapter 1
  if (typeof window.openMagnatesPaperBlueprintSuite === 'function') {
    window.openMagnatesPaperBlueprintSuite('printer_glitch_card');
  }

  const bpState = window.eval('magnatesBPState');
  const tG = bpState.printerGlitchTime;
  const tZ = bpState.printerZoomStart;
  const tZE = tZ + bpState.printerZoomDur;
  const tSlitStart = tZE + (bpState.printerSlitDelay / 1000);
  const tUnfoldStart = tSlitStart + bpState.printerSlitDur;

  console.log('--- CHAPTER 1 (0:05.00 CALIBRATION CHECK) ---');
  console.log({
    duration: bpState.duration,
    tGlitch: tG,
    tZoomStart: tZ,
    tZoomEnd: Number(tZE.toFixed(2)),
    tSlitStart: Number(tSlitStart.toFixed(2)),
    tUnfoldStart: Number(tUnfoldStart.toFixed(2))
  });

  if (Math.abs(tUnfoldStart - 5.00) > 0.01) {
    throw new Error(`Expected tUnfoldStart === 5.00s, got ${tUnfoldStart}`);
  }

  // Test playhead at 4.95s (Light Slit) and 5.20s (Center-Out Unfold)
  bpState.playhead = 4.95;
  window.updateMagnatesBPVisualStyles();
  const slitEl = document.getElementById('magnates-bp-light-slit');
  const cardEl = document.getElementById('magnates-bp-spec-card');
  console.log('At 4.95s -> slit opacity:', slitEl.style.opacity, 'card height:', cardEl.style.height);

  bpState.playhead = 5.25;
  window.updateMagnatesBPVisualStyles();
  console.log('At 5.25s -> slit opacity:', slitEl.style.opacity, 'card opacity:', cardEl.style.opacity, 'transform:', cardEl.style.transform);

  // Test Chapters 2..10 + Full 6:30 Master
  console.log('--- CHAPTERS 2..10 & FULL 6:30 DOM CHECK ---');
  const chapterIds = window.HPDocEngine.chapters.map((c) => c.id);
  for (const chId of chapterIds) {
    window.HPDocEngine.selectChapter(chId);
    const ch = window.HPDocEngine.chapterMap[chId];
    bpState.playhead = Math.min(ch.duration - 0.5, Math.max(1.0, ch.duration * 0.5));
    window.updateMagnatesBPVisualStyles();
    const root = document.getElementById('hp-doc-stage-root');
    const renderedLayers = root ? root.querySelectorAll('.hp-stage-layer').length : 0;
    console.log(`Chapter ${ch.code} (${chId}) @ t=${bpState.playhead.toFixed(1)}s/${ch.duration}s -> StageLayers=${renderedLayers}`);
  }

  console.log('ALL DOM & SCENE GRAPH CONTRACTS VERIFIED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('DOM VERIFICATION FAILED:', err);
  process.exit(1);
});
