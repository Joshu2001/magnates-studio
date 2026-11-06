/* Exercise the shared layer against the same DOM contracts used by every builder. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../magnates-studio/node_modules/jsdom');
const source=fs.readFileSync(path.join(__dirname,'../magnates-studio/public/js/regaarder-shell.js'),'utf8').split('/* Library-wide inspector presentation.')[1];
const html=`<div class="rg-inspector-shell"><div class="rg-inspector-tabs"></div><div class="rg-tab-pane" data-pane="content">
<div class="rg-inspector-section"><div class="rg-section-header"><span class="rg-section-title">Titles & Editorial Copy</span></div><div class="rg-section-body"><div class="rg-ctrl-row"><label>Chapter title</label><input data-ch-copy="title"></div><div class="rg-ctrl-row"><label>Distress line</label><input data-ch-copy="distress"></div></div></div>
<div class="rg-inspector-section"><div class="rg-section-header"><span class="rg-section-title">Generic template</span></div>${Array.from({length:8},(_,i)=>`<div data-inspector-kind="text"><input id="field${i}"></div>`).join('')}</div>
</div><div class="rg-tab-pane" data-pane="motion"></div><div class="rg-tab-pane" data-pane="look"></div><div class="rg-tab-pane" data-pane="effects"></div><div class="rg-advanced-drawer"><div class="rg-inspector-section"><div class="rg-section-header"><span class="rg-section-title">Special controls</span></div><button id="special">Run specialist tool</button></div></div></div>`;
(async()=>{
 const dom=new JSDOM(html,{runScripts:'outside-only'}),w=dom.window,d=w.document;
 w.topCustomizerState={currentTpl:{id:'regaarder-final-chapter'},currentTime:1};
 w.REGAARDER_CHAPTER_RUNTIME={'regaarder-final-chapter':{scenes:[{id:'Final Chapter',start:0,label:'01 Opening'},{id:'Financial distress',start:37,label:'02 Distress'}]}};
 w.setInterval=()=>0;const input=d.getElementById('field7'),special=d.getElementById('special');let edits=0,actions=0;
 input.addEventListener('input',()=>edits++);special.addEventListener('click',()=>actions++);
 const blueprint=d.createElement('div');blueprint.className='vector-export-modal';blueprint.id='modal-magnates-paper-blueprint-suite';blueprint.innerHTML='<div class="rg-inspector-shell"><div class="rg-inspector-tabs"></div><div class="rg-tab-pane" data-pane="content"><div class="rg-inspector-section"><div class="rg-section-header"><span class="rg-section-title">Shapes</span><button id="header-action">Add shape</button></div><input type="hidden" id="shape-data"></div></div></div>';d.body.appendChild(blueprint);
 let headerActions=0;d.getElementById('header-action').addEventListener('click',()=>headerActions++);
 const before=[...d.querySelectorAll('input,button')];
 w.eval('/* Library-wide inspector presentation.'+source);
 await new Promise(r=>setTimeout(r,20));
 for(const node of before)assert(d.contains(node),'All original controls remain reachable');
 assert.equal(d.querySelectorAll('input').length,11);assert(d.querySelector('#field7').closest('details'));
 d.getElementById('header-action').click();assert.equal(headerActions,1);assert(d.getElementById('header-action').closest('.rm-task-body'));assert(!blueprint.querySelector('.rm-inspector-context').textContent.includes('Opening'),'No stale chapter context in blueprint');
 input.dispatchEvent(new w.Event('input'));special.click();assert.equal(edits,1);assert.equal(actions,1);
 assert(d.querySelector('[data-ch-copy="distress"]').closest('.rm-other-scene-text'));
 assert(!d.querySelector('[data-ch-copy="title"]').closest('.rm-other-scene-text'));
 w.topCustomizerState.currentTime=40;w.RegaarderInspector.refresh();await new Promise(r=>setTimeout(r,20));
 assert(!d.querySelector('[data-ch-copy="distress"]').closest('.rm-other-scene-text'));
 assert(d.querySelector('[data-ch-copy="title"]').closest('.rm-other-scene-text'));
 const count=d.querySelectorAll('.rm-inspector-task').length;w.RegaarderInspector.refresh();await new Promise(r=>setTimeout(r,20));assert.equal(d.querySelectorAll('.rm-inspector-task').length,count,'Enhancement is idempotent');
 assert.equal(d.querySelectorAll('.rm-pane-empty').length,3);assert(d.querySelector('summary[role=button][aria-expanded]'));
 dom.window.close();console.log('PASS: shared grouping, node/handler preservation, advanced tools, scene context, accessibility, repeat rendering.');
})().catch(e=>{console.error(e);process.exitCode=1});

// Test actual classification rather than a copied implementation.
const vm=require('node:vm');
const redesign=fs.readFileSync(path.join(__dirname,'../magnates-studio/public/js/regaarder-redesign.js'),'utf8');
const classifySource=redesign.slice(redesign.indexOf('  function classifyControlCategory('),redesign.indexOf('  function extractControlLabel('));
const classify=vm.runInNewContext(classifySource+';classifyControlCategory');
assert.equal(classify('Enable Simulation 30 Motes','range'),'effects');
assert.equal(classify('Rain speed','range'),'effects');
assert.equal(classify('Camera zoom','range'),'motion');
assert.equal(classify('Main Title','text'),'content');
assert.equal(classify('Background color','color'),'look');
