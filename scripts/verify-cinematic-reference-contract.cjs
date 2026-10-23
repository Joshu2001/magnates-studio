#!/usr/bin/env node
'use strict';
// Run from repository root: node scripts/verify-cinematic-reference-contract.cjs
// This checks source contracts and syntax. It does NOT measure screenshot fidelity.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const load = p => {
  const content = fs.readFileSync(path.join(root, 'magnates-studio', 'public', 'js', p), 'utf8');
  new vm.Script(content, { filename: p }); // syntax verification without evaluating browser globals
  return content;
};
const spatial = load('tpl-3d-inspector.js');
const search = load('search-3d-engine.js');
const checklist = load('checklist-3d-engine.js');
for (const id of ['documentary', 'tech-investigative', 'cyberpunk']) {
  assert.ok(spatial.includes(id), 'Missing spatial preset ' + id);
}
assert.match(spatial, /REFERENCE_STYLE_LIGHTING/);
assert.match(spatial, /applyReferenceArtDirection\(styleId\)/);
assert.match(spatial, /documentary:\s*Object\.freeze\(\{/);
assert.match(spatial, /gridVisible:\s*false/);
assert.match(spatial, /cardContourColor:\s*'#c3a16c'/);
assert.match(spatial, /'tech-investigative':\s*Object\.freeze\(\{/);
assert.match(spatial, /cyberpunk:\s*Object\.freeze\(\{/);
assert.match(search, /auroraEnabled:\s*true/);
assert.match(search, /widthPercent:\s*65/);
assert.match(search, /lockAspectRatio:\s*true/);
assert.match(checklist, /blurMode:\s*'none'/);
assert.match(checklist, /entryBlurPx:\s*0/);
console.log('PASS: scene source parses, 3 style contracts, Google defaults, opt-in checklist blur.');
console.log('NOT VERIFIED: actual rendering, image parity, interactivity, timeline sync, exports.');
