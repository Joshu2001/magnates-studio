'use strict';
/**
 * Regaarder Motion -> Magnates Studio merge regression checks.
 * Run from repository root: node scripts/verify_regaarder_merge.cjs
 * These are deterministic source/asset checks, not a substitute for
 * Chrome WebGL, user-interaction, image-comparison or media decoding QA.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..', 'magnates-studio', 'public');
const file = rel => path.join(root, rel);
const read = rel => fs.readFileSync(file(rel), 'utf8');
const checked = [];

function checkJS(rel) {
  assert.ok(fs.existsSync(file(rel)), 'Missing module: ' + rel);
  execFileSync(process.execPath, ['--check', file(rel)], { stdio: 'pipe' });
  checked.push(rel);
}
function verifyLocalImports(rel) {
  const source = read(rel);
  const pattern = /(?:from\s*|import\s*\()\s*['"]([.][^'"]+)['"]/g;
  for (const match of source.matchAll(pattern)) {
    const dependency = path.resolve(path.dirname(file(rel)), match[1]);
    assert.ok(fs.existsSync(dependency), rel + ' has missing import: ' + match[1]);
  }
}

const js = [
  'js/regaarder-native3d-engine.js',
  'js/regaarder-chapters-engine.js',
  'js/tpl-3d-inspector.js',
  'js/regaarder-chapters/legacy-motion.js',
  'js/regaarder-chapters/legacy-sequence.js',
  'js/regaarder-chapters/promo-sequence.js',
  'js/regaarder-chapters/promo-media.js',
  'native3d-v97/editor.js',
  'native3d-v97/engine.js',
  'native3d-v97/checkpoint.js',
  'native3d-v97/final-scenes.js'
];
for (const rel of js) {
  checkJS(rel);
  if (rel.includes('/legacy-') || rel.includes('/promo-') || rel.startsWith('native3d-v97/')) {
    verifyLocalImports(rel);
  }
}
const native = read('js/regaarder-native3d-engine.js');
const master = read('js/regaarder-chapters-engine.js');
const layout = read('js/tpl-3d-inspector.js');
assert.match(native, /openIntegratedMeshEditor/);
assert.match(native, /mountNativeEditor/);
assert.match(native, /nativeSceneDirty/);
assert.match(native, /source-authored animation tracks|source-authored poses/);
for (const tag of ['handshake', 'checkpoint', 'team', 'humanoid', 'blue']) {
  assert.match(native, new RegExp(tag + ':\\s*\\{'));
}
assert.match(master, /ensureDocumentaryBridge\('legacy'\)/);
assert.match(master, /ensureDocumentaryBridge\('promo'\)/);
assert.match(master, /bridge\.mod\.paintLegacy/);
assert.match(master, /bridge\.mod\.paint\(/);
assert.doesNotMatch(master, /paintArchivalDocumentarySegment/);
assert.match(master, /paintUnimportedDocumentarySegment/);
assert.match(layout, /applyModeLayout\(isDom3DActive \|\| isCustom3D\)/);

const media = JSON.parse(fs.readFileSync(file('js/regaarder-chapters/legacy-manifest.json'), 'utf8'));
assert.ok(Array.isArray(media.assets), 'Legacy manifest is malformed');
const promo = ['cash.jpg', 'city-rear.jpg', 'city.jpg', 'coast.jpg', 'flame.mp4',
  'host.mp4', 'london.jpg', 'memorial.jpg', 'pagoda.jpg', 'room.jpg', 'wood.jpg'];
for (const name of promo) {
  assert.ok(fs.statSync(file('assets/promo129/' + name)).size > 0, 'Missing original promo media: ' + name);
}
for (const name of ['humanoid.json', 'garments.json', 'shape-targets.json']) {
  const base = name === 'humanoid.json' ? 'humanoid-v89' : name === 'garments.json' ? 'humanoid-v91' : 'humanoid-v93';
  assert.ok(fs.existsSync(file('assets/' + base + '/' + name)), 'Native 3D asset missing: ' + name);
}
console.log('PASS merge recovery: ' + checked.length + ' scripts parse; ' + promo.length +
  ' original promo assets and rig sources exist; master no longer uses synthetic collages.');
console.log('NOTE visual/WebGL/video checks still require an actual browser; the early documentary chapters are not imported.');
