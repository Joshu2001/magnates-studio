const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
class MockNode {
  constructor(tag) { this.tagName=tag.toUpperCase(); this.children=[]; this.attrs={}; this.style={}; this.handlers={}; this._text=''; this._html=''; }
  setAttribute(k,v){this.attrs[k]=String(v)} getAttribute(k){return this.attrs[k]??null} removeAttribute(k){delete this.attrs[k]}
  appendChild(n){if(n.parent)n.parent.children=n.parent.children.filter(x=>x!==n);this.children.push(n);n.parent=this;return n}
  append(...ns){ns.forEach(n=>this.appendChild(n))} replaceChildren(){this.children=[]}
  addEventListener(k,f){this.handlers[k]=f} getComputedTextLength(){return 600}
  get firstChild(){return this._text?{textContent:this._text}:this.children[0]}
  set textContent(v){this._text=String(v)} get textContent(){return this._text+this.children.map(x=>x.textContent||'').join('')}
  set innerHTML(v){this._html=v;this.children=[]} get innerHTML(){return this._html}
  cloneNode(deep){const n=new MockNode(this.tagName);n.value=this.value;n._text=this._text;if(deep)this.children.forEach(c=>n.appendChild(c.cloneNode(true)));return n}
  setCustomValidity(){} reportValidity(){}
}
const document={createElementNS:(_,tag)=>new MockNode(tag),createElement:tag=>new MockNode(tag),querySelector:()=>null};
let data={};const window={tplGetContextualData:()=>data,tplSetContextualData:(_,patch)=>{data={...data,...patch}}};
const code=fs.readFileSync(path.join(root,'public/js/ponzi-minute7-engine.js'),'utf8');
vm.runInNewContext(code,{window,document});
const api=window.PonziMinute7Opening,cfg=api.defaults(),canvas=new MockNode('div');
assert.equal(cfg.layers.length,31);
assert.equal(new Set(cfg.layers.map(l=>l.id)).size,31);
for(const l of cfg.layers)assert(l.start>=0&&l.end<=15&&l.start<=l.end,l.id);
for(let i=0;i<375;i++){
  api.renderAt(canvas,i/25,{});
  assert.equal(canvas._opening.groups.size,31);
  for(const n of canvas._opening.groups.values())if(n.outer.style.display!=='none')assert(!/NaN|Infinity/.test(n.g.attrs.transform||''),n.l.id+' @ '+i/25);
}
// The installed long-arm PNG is 1376×768. Check its actual visible sleeve
// edge ranges through every animation sample, including camera and parallax.
const hand=cfg.layers.find(l=>l.id==='handshake');
assert.equal(hand.sleeveSourceWidth,1376);
assert.equal(hand.sleeveSourceHeight,768);
const hw=Math.min(hand.w,hand.h*1376/768),hh=hw*768/1376;
let minimumClearance=Infinity;
for(let frame=0;frame<375;frame++){
  const t=frame/25;if(t>hand.end)break;
  const k=api.sample(hand,t),cam=api.sample(cfg.camera,t),depth=1+hand.depth*.18;
  const cs=1+(cam.scale-1)*depth,scale=k.scale*cs,ang=(k.rotation+cam.rotation)*Math.PI/180;
  const tx=640+(k.x-640)*cs+cam.x*depth,ty=360+(k.y-360)*cs+cam.y*depth;
  for(const [edge,lo,hi] of [[-hw/2-hand.sleeveOverscan,185,419],[hw/2+hand.sleeveOverscan,138,379]]){
    for(let row=lo;row<=hi;row++){
      const dy=(row-384)*hh/768;
      const px=tx+(edge*Math.cos(ang)-dy*Math.sin(ang))*scale;
      const py=ty+(edge*Math.sin(ang)+dy*Math.cos(ang))*scale;
      const clearance=Math.hypot(Math.max(0,-px,px-1280),Math.max(0,-py,py-720));
      minimumClearance=Math.min(minimumClearance,clearance);
      assert(clearance>0,'Visible sleeve termination at '+t+'s');
    }
  }
}
assert(minimumClearance>50,'Insufficient safety overscan');
assert.equal(api.config({ponziOpeningV2:api.baseline()}).version,5);
const previous=api.baseline();previous.layers.find(l=>l.id==='merchant').brightness=.7;
assert.equal(api.config({ponziOpeningV2:previous}).layers.find(l=>l.id==='merchant').brightness,.7);
const oldV4=api.baselineV4();oldV4.layers.find(l=>l.id==='merchant').brightness=.7;
assert.equal(api.config({ponziOpeningV2:oldV4}).layers.find(l=>l.id==='merchant').brightness,.7);
assert.equal(api.config({ponziOpeningV2:api.baselineV4()}).layers.find(l=>l.id==='ponzi-standing').w,620);
assert.equal(api.sample(cfg.layers.find(l=>l.id==='merchant'),9.2).blur,8);
api.renderAt(canvas,0,{});
assert.equal(canvas._opening.groups.get('handshake').g.children.length,3);
assert.equal(canvas._opening.groups.get('six-months').outer.style.display,'');
api.renderAt(canvas,6.84,{});
assert.equal(canvas._opening.groups.get('arrow-center').arrowShafts.length,2);
console.log('PASS: default sleeve terminations remain offscreen, minimum clearance '+minimumClearance.toFixed(1)+'px; calibration migration preserves user edits.');

const panes=Object.fromEntries(['content','motion','look','effects'].map(k=>[k,new MockNode('div')]));
const adv=new MockNode('div');window.PonziMinute7SelectedLayer='merchant';window.tplBuildPonziMinute7NativePanes(panes,adv);
assert(panes.effects.textContent.includes('Object glow'));
assert(panes.motion.textContent.includes('Layer keyframes'));
assert(panes.content.textContent.includes('Replace image URL'));
const all=n=>[n,...n.children.flatMap(all)];
const add=all(panes.effects).find(n=>n.tagName==='SELECT'&&n.textContent.includes('Add effect'));
assert(add);add.value='glow';add.onchange();assert.equal(data.ponziOpeningV2.layers.find(x=>x.id==='merchant').glow,12);
const motion=all(panes.motion).find(n=>n.tagName==='SELECT'&&n.textContent.includes('No additional motion'));
assert(motion);motion.value='push';motion.onchange();assert.equal(data.ponziOpeningV2.layers.find(x=>x.id==='merchant').motionPreset,'push');
api.renderAt(canvas,5,data);assert(canvas._opening.groups.get('merchant').g.style.filter.includes('drop-shadow'));
api.renderAt(canvas,0.5,{ponziOpeningEnabled:false});assert(canvas.innerHTML.includes('Six Months'));
api.renderAt(canvas,16,{});assert(canvas.innerHTML.includes('BANKRUPT'));
console.log('PASS: 31 layers, 375 time samples, native pane classification, persisted effect and animation, legacy handoff.');
const dir=path.join(root,'public/assets/ponzi-min7/opening');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'asset-checksums.json'),'utf8'));
const assets=new Set(cfg.layers.filter(l=>l.asset).map(l=>l.asset));
assert.equal(assets.size,Object.keys(manifest.files).length);
const failures=[];
for(const name of assets){
  if(!Object.hasOwn(manifest.files,name)){failures.push(name+': no expected checksum');continue;}
  const file=path.join(dir,name);
  if(!fs.existsSync(file)){failures.push(name+': missing');continue;}
  const digest=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if(digest!==manifest.files[name])failures.push(name+': checksum mismatch');
}
if(failures.length){console.error('Asset validation FAILED:\n'+failures.join('\n'));if(!process.argv.includes('--logic-only'))process.exitCode=1;}
else console.log('PASS: all '+assets.size+' generated image checksums match.');
console.log('Scope: mocked DOM and exact asset bytes, not browser visual fidelity or video export.');
