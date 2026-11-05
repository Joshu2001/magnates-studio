const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {createCanvas}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas');
const root=path.resolve(__dirname,'../magnates-studio/public');
const assert=require('node:assert/strict');
function canvas(w=960,h=540){const c=createCanvas(w,h);const get=c.getContext.bind(c);c.getContext=t=>t==='2d'?get(t):null;c.addEventListener=()=>{};c.removeEventListener=()=>{};c.style={};return c;}
global.document={createElement:tag=>{if(tag==='canvas')return canvas();throw Error(tag)}};
(async()=>{const {Native3DEngine}=await import(pathToFileURL(root+'/native3d-v97/engine.js'));const {createNativeScene}=await import(pathToFileURL(root+'/native3d-v97/scene.js'));
const data={...JSON.parse(fs.readFileSync(root+'/assets/humanoid-v89/humanoid.json')),garments:JSON.parse(fs.readFileSync(root+'/assets/humanoid-v91/garments.json')),shapeTargets:JSON.parse(fs.readFileSync(root+'/assets/humanoid-v93/shape-targets.json'))};
const c=canvas(),engine=new Native3DEngine(c,data);const scene=createNativeScene('blue');engine.render(scene,0);assert(engine.renderer.isSoftwareRenderer);assert(engine.renderer.triangles>10000,'real anatomical triangles rendered');assert.equal(engine.characters.size,2);const before=c.toBuffer('image/png');engine.render(scene,0);assert(before.equals(c.toBuffer('image/png')),'paused frame cache');scene.nodes.find(n=>n.type==='humanoid').position[0]+=.3;engine.render(scene,0);assert(!before.equals(c.toBuffer('image/png')),'changing the real scene moves the software geometry');const core=await import(pathToFileURL(root+'/native3d-v97/edit-core.js'));
const actor=scene.nodes.find(n=>n.type==='humanoid'),character=engine.characters.get(actor.id);
let body;character.group.traverse(m=>{if(m.isMesh&&m.userData.surface==='body')body=m});
assert(body,'actual body surface available for editing');
const used=[...new Set(body.geometry.index.array)],pos=body.geometry.attributes.position;
const foot=used.filter(i=>pos.getY(i)<.12);assert(foot.length>10,'foot vertices available');
const imageBeforeEdit=c.toBuffer('image/png');
core.deformSelection(actor,body,{surface:'body',topology:core.meshRevision(body.geometry),mode:'vertex',ids:foot},{space:'bind-local',units:'m',displacement:[.12,.08,0]});
engine.render(scene,0);assert(!imageBeforeEdit.equals(c.toBuffer('image/png')),'sculpting real foot vertices changes the rendered anatomy');
engine.dispose();console.log('PASS: WebGL failure renders actual skinned humanoid geometry; scene movement and paused frame caching.');})().catch(e=>{console.error(e);process.exitCode=1});
