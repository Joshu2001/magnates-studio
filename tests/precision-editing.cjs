const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{pathToFileURL}=require('url');
const root=path.resolve(__dirname,'../magnates-studio/public');
(async()=>{
 const {editSession,clampZoom}=await import(pathToFileURL(root+'/native3d-v97/edit-session.js'));
 const state={preset:'team',nativeScene:{nodes:[{id:'actor',bones:{},sculpt:{}}]},actorOffsets:{},cameraZoom:1,shirtColor:'#123456'};
 const session=editSession(state);session.begin();state.nativeScene.nodes[0].sculpt.body={vertices:{1:[.01,0,0]}};session.commit();assert(session.canUndo);assert.equal(editSession(state),session,'history survives viewport remount');assert(session.undo());assert.deepEqual(state.nativeScene.nodes[0].sculpt,{});assert(session.redo());assert.equal(state.nativeScene.nodes[0].sculpt.body.vertices[1][0],.01);
 let saved;const storage={setItem:(k,v)=>saved=v,getItem:()=>saved};session.save(storage);session.begin();state.shirtColor='#ffffff';session.commit();session.load(storage);assert.equal(state.shirtColor,'#123456');assert(session.undo());assert.equal(state.shirtColor,'#ffffff');assert.equal(clampZoom(1000),64);assert.equal(clampZoom(.001),.05);
 const {createCanvas,loadImage}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas');
 const mod=await import(pathToFileURL(root+'/js/regaarder-chapters/minute17-sequence.js'));
 const media=Object.fromEntries(await Promise.all(Object.entries(mod.minute17Assets).map(async([id,file])=>[id,await loadImage(root+'/assets/minute17/'+file)])));
 await mod.preloadMinute17({canvas:createCanvas,manifest:async()=>JSON.parse(fs.readFileSync(root+'/js/regaarder-chapters/minute17-manifest.json')),image:file=>Promise.resolve(media[Object.keys(mod.minute17Assets).find(id=>mod.minute17Assets[id]===file)])});
 const window={topCustomizerState:{currentTime:0}},context={window,console,structuredClone,document:{querySelector:()=>null},setTimeout};
 vm.runInNewContext(fs.readFileSync(root+'/js/regaarder-chapters-engine.js','utf8'),context);
 global.RegaarderLayerFrame=window.RegaarderLayerFrame;
 const rt=window.REGAARDER_CHAPTER_RUNTIME['regaarder-minute17-chapter'];Object.assign(rt,{ready:true,mod,media,config:structuredClone(mod.minute17Defaults)});
 const canvas=createCanvas(960,540),container={querySelector:selector=>selector.includes('data-template-id')?{querySelector:()=>canvas}:null,querySelectorAll:()=>[]};
 const positions=[];for(const t of [0,7,15,23,30,37]){window.stepRegaarderChapterAnimation(container,'regaarder-minute17-chapter',t);for(const b of Object.values(rt.drawnLayers))assert(Object.values(b).every(Number.isFinite),'actual finite layer bounds');if(rt.drawnLayers.profileBlue)positions.push(rt.drawnLayers.profileBlue.x);assert.equal(window.getRegaarderPlaybackReadiness('regaarder-minute17-chapter',t),true);}
 assert(new Set(positions).size>1,'selection bounds follow animated portraits');
 rt.requiredLayers=['profileBlue'];rt.media.profileBlue={complete:false,naturalWidth:0};assert.equal(window.getRegaarderPlaybackReadiness('regaarder-minute17-chapter',0),false,'clock waits for active image');
 // Texture alpha must preserve the background rather than paint a solid plane.
 global.document={createElement:()=>createCanvas(2,2)};const T=await import(pathToFileURL(root+'/vendor/three.module.js')),{SoftwareRenderer}=await import(pathToFileURL(root+'/native3d-v97/software-renderer.js'));
 const tex=createCanvas(2,2);tex.getContext('2d').clearRect(0,0,2,2);const scene=new T.Scene();scene.background=new T.Color('#123456');const plane=new T.Mesh(new T.PlaneGeometry(2,2),new T.MeshBasicMaterial({map:new T.CanvasTexture(tex),side:T.DoubleSide,transparent:true}));scene.add(plane);const cam=new T.PerspectiveCamera(40,1,.01,10);cam.position.z=3;const out=createCanvas(32,32),renderer=new SoftwareRenderer(out);renderer.render(scene,cam);assert.deepEqual([...out.getContext('2d').getImageData(16,16,1,1).data],[18,52,86,255],'transparent texture does not hide scene');
 console.log('PASS: persistent Undo/Redo, save/restore, 64x zoom, actual animated layer bounds, readiness gating, transparent software textures.');
})().catch(e=>{console.error(e);process.exitCode=1});
