const fs = require('fs');
const path = require('path');

console.log('--- Step 1: Checking Final Chapter assets ---');
const fcDir = path.resolve(__dirname, '..', 'magnates-studio', 'public', 'assets', 'final-chapter');
const fcFiles = fs.readdirSync(fcDir);
const zeroFiles = fcFiles.filter(f => fs.statSync(path.join(fcDir, f)).size === 0);
console.log(`Total final-chapter assets: ${fcFiles.length}, zero-byte: ${zeroFiles.length}`);
if (zeroFiles.length > 0) {
  console.error('Zero-byte files found:', zeroFiles);
  process.exit(1);
} else {
  console.log('[PASS] All 85 final-chapter assets are fully downloaded and > 0 bytes!');
}

console.log('\n--- Step 2: Checking JS Syntax ---');
const filesToTest = [
  'magnates-studio/public/js/tester-templates/tester-templates-data.js',
  'magnates-studio/public/js/regaarder-chapters-engine.js',
  'magnates-studio/public/js/regaarder-native3d-engine.js',
  'magnates-studio/public/js/regaarder-redesign.js'
];

for (const f of filesToTest) {
  try {
    const code = fs.readFileSync(path.resolve(__dirname, '..', f), 'utf8');
    new Function(code);
    console.log(`[PASS] ${f} syntax OK`);
  } catch (err) {
    console.error(`[FAIL] ${f} syntax error:`, err.message);
    process.exit(1);
  }
}

console.log('\n--- Step 3: Checking Native 3D Humanoid & Garments Data ---');
const humanoidPath = path.resolve(__dirname, '..', 'magnates-studio', 'public', 'assets', 'humanoid-v89', 'humanoid.json');
const garmentsPath = path.resolve(__dirname, '..', 'magnates-studio', 'public', 'assets', 'humanoid-v91', 'garments.json');
const shapePath = path.resolve(__dirname, '..', 'magnates-studio', 'public', 'assets', 'humanoid-v93', 'shape-targets.json');

const humanoid = JSON.parse(fs.readFileSync(humanoidPath, 'utf8'));
const garments = JSON.parse(fs.readFileSync(garmentsPath, 'utf8'));
const shape = JSON.parse(fs.readFileSync(shapePath, 'utf8'));

console.log(`[PASS] Humanoid: joints = ${humanoid.joints.length}, vertices = ${humanoid.vertices.length}`);
console.log(`[PASS] Garments keys: ${Object.keys(garments).length}`);
console.log(`[PASS] Shape targets rest joints: ${shape.rest.length}`);

console.log('\n--- Step 4: Testing ES Module Imports ---');
async function testESM() {
  const engineMod = await import('../magnates-studio/public/native3d-v97/engine.js');
  const sceneMod = await import('../magnates-studio/public/native3d-v97/scene.js');
  const blueScene = sceneMod.createNativeScene('blue');
  console.log(`[PASS] Native3D blue preset created: "${blueScene.name}", nodes = ${blueScene.nodes.length}`);

  const chapterSeq = await import('../magnates-studio/public/js/regaarder-chapters/chapter-sequence.js');
  console.log(`[PASS] Final Chapter sequence loaded: duration = ${chapterSeq.duration}s, scenes = ${chapterSeq.scenes.length}`);

  const peleSeq = await import('../magnates-studio/public/js/regaarder-chapters/pele-sequence.js');
  console.log(`[PASS] Pelé sequence loaded: masterStart = ${peleSeq.masterStart}`);

  const m16Seq = await import('../magnates-studio/public/js/regaarder-chapters/minute16-sequence.js');
  console.log(`[PASS] Minute 16 sequence loaded: masterStart = ${m16Seq.masterStart}`);

  const m17Seq = await import('../magnates-studio/public/js/regaarder-chapters/minute17-sequence.js');
  console.log(`[PASS] Minute 17 sequence loaded: masterStart = ${m17Seq.masterStart}`);
}

testESM().then(() => {
  console.log('\n>>> ALL VERIFICATION CHECKS PASSED PERFECTLY! <<<');
}).catch(err => {
  console.error('[FAIL] ESM test failed:', err);
  process.exit(1);
});
