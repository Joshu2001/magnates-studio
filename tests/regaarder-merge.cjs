const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../magnates-studio/public');
const {createCanvas,loadImage}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas' : '@napi-rs/canvas');
(async()=>{
 const scene=await import(pathToFileURL(path.join(root,'native3d-v97/scene.js')));
 const final=await import(pathToFileURL(path.join(root,'native3d-v97/final-scenes.js')));
 const checkpoint=await import(pathToFileURL(path.join(root,'native3d-v97/checkpoint.js')));
 const core=await import(pathToFileURL(path.join(root,'native3d-v97/edit-core.js')));
 const T=await import(pathToFileURL(path.join(root,'vendor/three.module.js')));
 const context={window:{topCustomizerState:{paperPreviewMode:'3d'}},console,navigator:{userAgent:'jsdom'},structuredClone};
 vm.runInNewContext(fs.readFileSync(path.join(root,'js/regaarder-native3d-engine.js'),'utf8'),context);
 const state=context.window.REGAARDER_NATIVE3D_CONFIG;
 state.nativeMods={sceneMod:scene,finalMod:final,checkpointMod:checkpoint};
 const expectations={handshake:2,checkpoint:3,team:3,humanoid:1,blue:2};
 for(const [preset,count] of Object.entries(expectations)){
  context.window.setRegaarderNative3DPreset(preset);
  scene.validateScene(state.nativeScene);
  assert.equal(state.nativeScene.nodes.filter(n=>n.type==='humanoid').length,count,preset+' actor count');
  const before=structuredClone(state.baseNodes.filter(n=>n.type==='humanoid'));
  context.window.syncStateToNativeScene();
  const after=state.nativeScene.nodes.filter(n=>n.type==='humanoid');
  for(let i=0;i<after.length;i++){
   assert.equal(JSON.stringify(after[i].position),JSON.stringify(before[i].position),preset+' preserves positions');
   assert.equal(JSON.stringify(after[i].rotation),JSON.stringify(before[i].rotation),preset+' preserves rotations');
   if(preset!=='blue')assert.equal(after[i].parts.shirt.color,before[i].parts.shirt.color,preset+' preserves palette');
  }
 }
 context.window.setRegaarderNative3DPreset('checkpoint');
 const visible=state.nativeScene.nodes.map(n=>scene.nodeAt(n,1.8));
 assert.equal(visible.find(n=>n.id==='red').visible,true,'red figure visible in preview window');
 assert(visible.some(n=>n.id.startsWith('chair-')&&n.visible),'chair visible');
 state.editScene={...state.nativeScene,nodes:structuredClone(visible)};
 state.editBaseNodes=structuredClone(visible);
 context.window.syncStateToNativeScene(state.editScene);
 for(const id of ['red','coach'])assert.equal(JSON.stringify(state.editScene.nodes.find(n=>n.id===id).position),JSON.stringify(visible.find(n=>n.id===id).position),'edit mode preserves tracked '+id+' pose');
 const authoredCamera=visible.find(n=>n.type==='camera'),editCamera=state.editScene.nodes.find(n=>n.type==='camera');
 authoredCamera.position.forEach((v,i)=>assert(Math.abs(editCamera.position[i]-v)<1e-9,'edit camera preserves authored framing'));

 context.window.setRegaarderNative3DPreset('humanoid');
 const n=state.nativeScene.nodes.find(n=>n.type==='humanoid');
 const mesh=new T.Mesh(new T.PlaneGeometry(.1,.1,2,2));mesh.userData.surface='body';
 const selection={surface:'body',topology:core.meshRevision(mesh.geometry),mode:'vertex',ids:[0]};
 core.deformSelection(n,mesh,selection,{space:'bind-local',units:'m',displacement:[.01,0,0]});
 assert.equal(core.editLayer(n,mesh).vertices[0][0],.01,'mesh edit is stored on source node');
 assert.equal(core.resolveSelection(mesh.geometry,selection).length,1);
 const legacy=await import(pathToFileURL(path.join(root,'regaarder-documentary/legacy-sequence.js')));
 const promo=await import(pathToFileURL(path.join(root,'regaarder-documentary/promo-sequence.js')));
 const dir=path.join(root,'regaarder-documentary/assets');
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'documentary-source-manifest.json'),'utf8'));
 for(const file of Object.values(legacy.legacyAssets))assert(fs.existsSync(path.resolve(dir,'legacy128',file)) || manifest[path.posix.normalize('legacy128/'+file)] || fs.existsSync(path.resolve(root,'assets/legacy128',file)),file);
 for(const file of Object.values(promo.sources))assert(fs.existsSync(path.resolve(dir,'promo129',file)) || manifest['promo129/'+file],file);
 // Paint authentic scene samples on CPU; this checks the real module entry points,
 // source media, frame size and non-empty output without pretending to test WebGL.
 const media={};for(const [id,file] of Object.entries(promo.sources))if(!file.endsWith('.mp4') && fs.existsSync(path.join(dir,'promo129',file)))media[id]=await loadImage(path.join(dir,'promo129',file));
 const canvas=createCanvas(960,540),c=canvas.getContext('2d');
 const hashes=new Set();
 for(const t of [0,5,25,70,90,115]){promo.paint(c,t,media,promo.defaults);const data=c.getImageData(0,0,960,540).data;hashes.add(require('crypto').createHash('sha256').update(data).digest('hex'));}
 assert.equal(hashes.size,6,'promo scene frames are distinct');
 const engine=fs.readFileSync(path.join(root,'js/regaarder-chapters-engine.js'),'utf8');
 assert(!engine.includes('paintArchivalDocumentarySegment'),'synthetic collage removed');
 assert(engine.includes('t >= 1214 && t < 1285'),'legacy timing');assert(engine.includes('t >= 1285 && t < 1405'),'promo timing');
 process.env.VERCEL='1';
 const config=JSON.parse(fs.readFileSync(path.join(root,'../vercel.json'),'utf8'));
 assert(config.builds.some(b=>b.use==='@vercel/static'),'browser files must have a static build');
 for(const resource of ['/native3d-v97/engine.js','/vendor/three.module.js','/v88/camera-keys.js','/js/regaarder-chapters/chapter-sequence.js']){
   let destination;
   for(const route of config.routes){const match=resource.match(new RegExp('^'+route.src+'$'));if(!match)continue;const dest=resource.replace(new RegExp('^'+route.src+'$'),route.dest);if(route.check&&!fs.existsSync(path.join(root,'..',dest)))continue;destination=dest;break;}
   assert(destination.startsWith('/public/'),resource+' must bypass Node transpilation');
 }
 const html=fs.readFileSync(path.join(root,'regaarder-documentary/index.html'),'utf8');
 assert(html.indexOf('body>*{visibility:hidden!important}')<html.indexOf('<script>'),'editor chrome must be hidden before scripts load');
 const {JSDOM}=require('../magnates-studio/node_modules/jsdom');
 const dom=new JSDOM(html,{runScripts:'outside-only'}),w=dom.window;
 Object.assign(w,{base:w.document.getElementById('stage'),playing:false,settings:{duration:960},t:0,frame:()=>{}});
 const bridge=[...w.document.scripts].find(script=>script.textContent.includes('window.RegaarderDocumentaryBridge={'));
 w.eval(bridge.textContent);assert.equal(w.base.parentElement,w.document.body,'playback stage must leave the closed editor dialog');dom.window.close();
 const originalFetch=global.fetch;let requested;
 global.fetch=async (url,options)=>{requested={url,options};return new Response('export const ready=true',{status:206,headers:{'content-type':'text/plain','content-range':'bytes 0-22/23','content-length':'8','content-encoding':'gzip'}})};
 const app=require('../magnates-studio/server.js');const http=require('node:http');
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const request=p=>new Promise((resolve,reject)=>{http.get({host:'127.0.0.1',port:server.address().port,path:p,headers:{Range:'bytes=0-22'}},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,type:res.headers['content-type'],body}));}).on('error',reject)});
 const response=await request('/regaarder-documentary-v4/source-proxy-test.js');
 assert.equal(response.status,206);assert(response.type.includes('javascript'));assert.equal(response.body,'export const ready=true');
 assert(requested.url.includes('/dd0646757b042248d99b171166fc9e6dea5af1f8/dist/'));assert.equal(requested.options.headers.Range,'bytes=0-22');assert.equal(requested.options.headers['Accept-Encoding'],'identity');
 await request('/regaarder-documentary-v4/chapter-sequence.js?v=motion-v70');
 assert(requested.url.endsWith('/dist/assets/archive/v70-refinement/chapter-sequence.js'),'early scenes must resolve their own archived module');
 // A background chapter completion must never paint into the active native canvas.
 const chapters={window:{},console,structuredClone};
 vm.runInNewContext(engine,chapters);
 let wrongCanvasReads=0;
 chapters.window.stepRegaarderChapterAnimation({querySelector:selector=>{if(selector==='canvas')wrongCanvasReads++;return null}},'regaarder-final-chapter',1);
 assert.equal(wrongCanvasReads,0,'chapter painting must require its own viewport');
 await new Promise(r=>server.close(r));global.fetch=originalFetch;
 console.log('PASS: five authentic presets, scene validation, relative transforms, seated visibility, persistent mesh deformation, legacy/promo source assets, six distinct rendered promo frames, master timing.');
})().catch(e=>{console.error(e);process.exitCode=1});
