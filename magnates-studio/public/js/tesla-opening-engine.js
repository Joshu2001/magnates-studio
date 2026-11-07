/**
 * Tesla: The Electrical Age — deterministic, seven-second editable canvas engine.
 * This is the SOURCE, not a pre-rendered video. Native browser preview / WebM export.
 * Photograph slots may be replaced with user-owned PNG/JPEG; canvas fallbacks remain editable.
 * No global changes to other templates.
 */
(function(global){
'use strict';
const ID='tesla-electrical-age', D=7, TAU=Math.PI*2;
const slots=['room','window_frame','glass_reflection','portrait','blueprint','chair','desk','lamp','coil','books','foreground_roof','city_mid','city_far','storm_clouds','lightning_overlay','rain_overlay','city_lights_emission'];
const defaults=Object.freeze({
 cameraStart:.91,cameraEnd:2.10,pushStart:2.8,pushEnd:6.6,windowCross:4.85,depth:.65,
 roomExposure:1,cityExposure:1,glassReflections:.29,lampGlow:1,vignette:.25,
 rainAmount:1,rainSpeed:1,rainWind:.25,glassRain:1,lightningStrength:1,
 cloudDrift:1,cloudDarkening:.46,cityLightCount:64,cityLightStart:5.25,cityLightSpread:1.55,
 paperStart:1.10,paperDuration:.90,portraitStart:2,portraitDuration:.88,
 paperX:42,paperY:71,portraitX:15,portraitY:22,lightningTime1:.58,lightningTime2:5.62,
 lightningDuration:.17,rainOn:true,lightningOn:true,cloudsOn:true,lampOn:true,glassOn:true,cityLightsOn:true
});
let config={...defaults}, images={},sources={};
let layers=Object.fromEntries(slots.map(id=>[id,{x:0,y:0,scale:1,rotation:0,opacity:1,depth:0,visible:true,entrance:0,fadeIn:0,exit:7,fadeOut:0}]));
const canvasTmp=()=>document.createElement('canvas');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
const ramp=(t,s,d)=>smooth((t-s)/Math.max(.01,d));
const rand=(n,seed)=>{let x=Math.sin((n+1)*12.9898+seed*78.233)*43758.5453;return x-Math.floor(x)};
function loadData(id,data){return new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>{images[id]=im;sources[id]=data;resolve()};im.onerror=reject;im.src=data})}
function imageRect(ctx,id,x,y,w,h,alpha=1){if(!images[id])return false;let p=layers[id]||{};if(p.visible===false)return true;ctx.save();ctx.translate(x+w/2+(Number(p.x)||0)*ctx.canvas.width/100+(Number(p.depth)||0)*Math.max(0,ctx.__teslaTime-2.8)*12,y+h/2+(Number(p.y)||0)*ctx.canvas.height/100);ctx.rotate((Number(p.rotation)||0)*Math.PI/180);let scale=Number(p.scale)||1;ctx.scale(scale,scale);let at=ctx.__teslaTime||0;let enter=(Number(p.fadeIn)||0)>0?ramp(at,Number(p.entrance)||0,Number(p.fadeIn)):at>=(Number(p.entrance)||0)?1:0;let leave=(Number(p.fadeOut)||0)>0?1-ramp(at,(Number(p.exit)||7)-(Number(p.fadeOut)||0),Number(p.fadeOut)):at<=(Number(p.exit)||7)?1:0;ctx.globalAlpha*=alpha*(Number(p.opacity)??1)*enter*leave;ctx.drawImage(images[id],-w/2,-h/2,w,h);ctx.restore();return true}
function sky(ctx,t,W,H){
 let grad=ctx.createLinearGradient(0,0,0,H);
 grad.addColorStop(0,'#060d1c');grad.addColorStop(.58,'#13243b');grad.addColorStop(1,'#050b14');
 ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 if(config.cloudsOn){ctx.save();ctx.globalAlpha=.16+.28*config.cloudDarkening*ramp(t,3.6,3.2);
 for(let i=0;i<21;i++){let x=(rand(i,2)*1500+t*config.cloudDrift*(i%2?5:-9))%1500-100;let y=rand(i,5)*380;let rx=80+rand(i,7)*200;
 let g=ctx.createRadialGradient(x,y,3,x,y,rx);g.addColorStop(0,'#8192b1');g.addColorStop(1,'transparent');ctx.fillStyle=g;
 ctx.fillRect(x-rx,y-rx,2*rx,2*rx)}ctx.restore()}
 imageRect(ctx,'storm_clouds',0,0,W,H,.40);
}
function skyline(ctx,t,W,H){
 ctx.save();let brightness=config.cityExposure;ctx.globalAlpha=clamp(brightness/1.5,.2,1);
 if(!imageRect(ctx,'city_far',0,H*.26,W,H*.74)){ctx.fillStyle='#111927';for(let i=0;i<72;i++){let x=i*W/69-12;let h=50+rand(i,4)*270;ctx.fillRect(x,H*.83-h,14+rand(i,7)*35,h)}}
 ctx.restore();
 ctx.save();ctx.translate((t-5)*config.depth*-3,0);
 if(!imageRect(ctx,'city_mid',0,H*.4,W,H*.60)){ctx.fillStyle='#121923';for(let i=0;i<45;i++){let x=i*W/43-10;let h=45+rand(i,10)*175;ctx.fillRect(x,H*.91-h,14+rand(i,3)*55,h)}}
 ctx.restore();
 if(config.cityLightsOn){const count=Math.round(config.cityLightCount);
 for(let i=0;i<count;i++){let x=rand(i,51)*W,y=H*(.56+rand(i,52)*.39);
 let moment=config.cityLightStart+rand(i,53)*config.cityLightSpread;
 let p=ramp(t,moment,.28);
 if(p<.001)continue;ctx.globalAlpha=.12+.85*p;ctx.fillStyle=i%5?'#e9a45c':'#ffe0a0';
 ctx.fillRect(x,y,2.5+rand(i,54)*4,4+rand(i,55)*6);
 }ctx.globalAlpha=1}
 if(images.city_lights_emission&&config.cityLightsOn){ctx.save();const wave=ramp(t,config.cityLightStart,config.cityLightSpread);ctx.beginPath();ctx.rect(0,0,W*wave,H);ctx.clip();imageRect(ctx,'city_lights_emission',0,0,W,H,wave);ctx.restore()}
 if(images.foreground_roof){ctx.save();ctx.translate((t-5)*config.depth*-13,0);imageRect(ctx,'foreground_roof',-55,H*.68,W+110,H*.32);ctx.restore()}
 else{ctx.fillStyle='#07101a';ctx.beginPath();ctx.moveTo(0,H*.91);ctx.lineTo(W*.19,H*.84);ctx.lineTo(W*.38,H*.92);ctx.lineTo(W*.68,H*.89);ctx.lineTo(W,H*.98);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill()}
}
function bolt(ctx,time,t,W,H){
 const intensity=config.lightningStrength;
 for(let k=0;k<2;k++){let hit=config['lightningTime'+(k+1)];let d=Math.abs(t-hit);
 if(d>config.lightningDuration)continue;
 let alpha=Math.exp(-Math.pow(d/(config.lightningDuration*.36),2))*intensity;
 if(alpha<.02)continue;
 ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(158,188,245,'+(.12*alpha)+')';ctx.fillRect(0,0,W,H);
 if(images.lightning_overlay){imageRect(ctx,'lightning_overlay',0,0,W,H,alpha);ctx.restore();continue;}
 let sx=W*(.56+rand(k,77)*.20),y=0;ctx.beginPath();ctx.moveTo(sx,y);
 for(let i=0;i<13;i++){let x=sx+Math.sin(i*2.8+k)*16+i*8;y=(i+1)*H*.045;ctx.lineTo(x,y)}
 ctx.shadowColor='#a8caff';ctx.shadowBlur=23;ctx.strokeStyle='rgba(195,221,255,'+(.9*alpha)+')';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;
 ctx.strokeStyle='rgba(255,255,255,'+alpha+')';ctx.lineWidth=1;ctx.stroke();ctx.restore();
 }

}
function rain(ctx,t,W,H,glass){
 if(!config.rainOn)return;let amount=Math.round((glass?95:270)*config.rainAmount);
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();ctx.lineWidth=glass?1.5:1;
 for(let i=0;i<amount;i++){
 let speed=config.rainSpeed*(glass?9:350)*( .5+rand(i,6));
 let x=(rand(i,12)*W+(glass?rand(i,13)*4:t*config.rainWind*90*(.5+rand(i,8))))%(W+30);
 let y=(rand(i,9)*H+t*speed)%(H+25)-15;
 let len=glass?2+rand(i,14)*13:9+rand(i,15)*25;
 ctx.strokeStyle='rgba(190,214,236,'+((glass?.10:.055)+rand(i,11)*(glass?.22:.18))+')';
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+len*config.rainWind*(glass?.06:.5),y+len);ctx.stroke();
 }
 if(images.rain_overlay){ctx.save();ctx.globalAlpha=.30;let dy=(t*config.rainSpeed*110)%H;imageRect(ctx,'rain_overlay',0,dy-H,W,H);imageRect(ctx,'rain_overlay',0,dy,W,H);ctx.restore()}
 ctx.restore();
}
function interior(ctx,t,W,H){
 let p=ramp(t,.40,1.0);ctx.save();
 ctx.beginPath();ctx.rect(0,0,W,H);ctx.rect(W*.31,0,W*.69,H*.77);ctx.clip('evenodd');
 let g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#100b0e');g.addColorStop(1,'#322016');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 if(images.room){ ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.rect(W*.31,0,W*.69,H*.77);ctx.clip('evenodd');imageRect(ctx,'room',0,0,W,H);ctx.restore(); } else {ctx.fillStyle='#211915';ctx.fillRect(0,0,W*.30,H);ctx.fillStyle='#503026';ctx.fillRect(0,H*.85,W,H*.15);
 ctx.fillStyle='#271b14';for(let i=0;i<5;i++)ctx.fillRect(12+i*50,40,34,H*.76);
 /* Aperture stays transparent: city is rendered behind the glass. */}
 ctx.restore();
 // Objects remain separately editable, source images take precedence.
 if(!imageRect(ctx,'desk',W*.19,H*.70,W*.78,H*.30)){ctx.fillStyle='#372116';ctx.fillRect(0,H*.79,W,H*.21)}
 imageRect(ctx,'chair',W*-.03,H*.44,W*.32,H*.62);
 imageRect(ctx,'books',W*.57,H*.66,W*.18,H*.13);
 imageRect(ctx,'coil',W*.72,H*.62,W*.09,H*.18);
 let paper=ramp(t,config.paperStart,config.paperDuration);
 if(paper>.001){ctx.save();ctx.beginPath();ctx.rect(W*.20,H*.66,W*.50*paper,H*.23);ctx.clip();
 if(!imageRect(ctx,'blueprint',W*config.paperX/100-W*.21,H*config.paperY/100-H*.06,W*.42,H*.22,paper)){
 ctx.fillStyle='rgba(218,197,159,'+(.95*paper)+')';ctx.fillRect(W*.21,H*.69,W*.46,H*.12);
 ctx.strokeStyle='rgba(56,73,84,'+paper+')';for(let i=0;i<13;i++){ctx.beginPath();ctx.moveTo(W*(.23+i*.03),H*.72);ctx.lineTo(W*(.26+i*.023),H*.78);ctx.stroke()}}
 ctx.restore()}
 // Frame remains visible; portrait itself is progressively sketched in.
 ctx.fillStyle='#6d4a27';ctx.fillRect(W*.045,H*.10,W*.155,H*.42);
 ctx.fillStyle='#1b1512';ctx.fillRect(W*.053,H*.115,W*.139,H*.39);
 let portrait=ramp(t,config.portraitStart,config.portraitDuration);
 if(portrait>.001){
 ctx.save();ctx.beginPath();ctx.rect(W*.053,H*.115,W*.139*portrait,H*.39);ctx.clip();
 if(!imageRect(ctx,'portrait',W*config.portraitX/100-W*.068,H*config.portraitY/100-H*.10,W*.139,H*.39,portrait)){
 ctx.fillStyle='#806d55';ctx.beginPath();ctx.ellipse(W*.121,H*.245,W*.039,H*.070,0,0,TAU);ctx.fill();
 ctx.fillStyle='#58493c';ctx.fillRect(W*.092,H*.30,W*.072,H*.11)}ctx.restore()}
 if(config.lampOn){let glow=config.lampGlow*(.18+.82*ramp(t,.66,.48));let x=W*.85,y=H*.49;
 let gd=ctx.createRadialGradient(x,y,0,x,y,W*.42);gd.addColorStop(0,'rgba(245,175,95,'+clamp(glow*.30)+')');gd.addColorStop(1,'rgba(245,175,95,0)');ctx.fillStyle=gd;ctx.fillRect(0,0,W,H);
 if(!imageRect(ctx,'lamp',W*.79,H*.29,W*.13,H*.45)){ctx.fillStyle='#d49b50';ctx.fillRect(W*.848,H*.45,6,H*.22);ctx.beginPath();ctx.ellipse(W*.85,H*.45,W*.075,H*.035,0,Math.PI,TAU);ctx.fill()}}
 ctx.fillStyle='rgba(0,0,0,'+clamp(.75*(1-p)+.06)+')';ctx.fillRect(0,0,W,H);
}
function window(ctx,t,W,H){
 // One consistent pane frame; not a duplicate baked-city composite.
 ctx.strokeStyle='#140e12';ctx.lineWidth=21;
 ctx.strokeRect(W*.31,-10,W*.70,H*.79);
 for(let i=1;i<4;i++){let x=W*(.31+i*.70/4);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H*.79);ctx.stroke()}
 ctx.beginPath();ctx.moveTo(W*.31,H*.36);ctx.lineTo(W,H*.36);ctx.stroke();
 ctx.beginPath();ctx.moveTo(W*.31,H*.58);ctx.lineTo(W,H*.58);ctx.stroke();
 if(config.glassOn){ctx.save();ctx.beginPath();ctx.rect(W*.32,0,W*.68,H*.76);ctx.clip();
 let g=ctx.createLinearGradient(W*.33,0,W,0);g.addColorStop(0,'rgba(180,202,240,.035)');g.addColorStop(.5,'rgba(205,228,255,'+(.12*config.glassReflections)+')');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(W*.32,0,W*.68,H*.76);
 rain(ctx,t,W,H,true);imageRect(ctx,'glass_reflection',W*.31,0,W*.69,H*.78,config.glassReflections);ctx.restore()}
 imageRect(ctx,'window_frame',W*.30,-5,W*.71,H*.80);
}
function render(canvas,t){
 if(!canvas || !canvas.getContext)return;let ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;t=clamp(t,0,D);
 ctx.clearRect(0,0,W,H);ctx.__teslaTime=t;
 let push=ramp(t,config.pushStart,config.pushEnd);
 let crossed=ramp(t,config.windowCross,.75);
 let z=config.cameraStart+(config.cameraEnd-config.cameraStart)*push;
 ctx.save();ctx.translate(W*.54,H*.44);ctx.scale(z,z);ctx.translate(-W*.54,-H*.44);
 sky(ctx,t,W,H);
 skyline(ctx,t,W,H);
 // Interior is a separate foreground layer, always revealed in source timeline.
 if(crossed<1){ctx.save();ctx.globalAlpha=1-crossed;interior(ctx,t,W,H);window(ctx,t,W,H);ctx.restore()}
 rain(ctx,t,W,H,false);
 bolt(ctx,0,t,W,H);
 ctx.restore();
 // Scene darkness is short. Lightning continues in both interior and exterior.
 const shade=1-ramp(t,.16,.95);
 ctx.fillStyle='rgba(0,0,0,'+(.68*shade)+')';ctx.fillRect(0,0,W,H);
 if(config.vignette){let g=ctx.createRadialGradient(W/2,H/2,W*.12,W/2,H/2,W*.78);g.addColorStop(0,'transparent');g.addColorStop(1,'rgba(0,0,0,'+(.66*config.vignette)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
}
function download(name,blob){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000)}
const store='magnates-tesla-opening-v1';
function persist(){
 try{global.localStorage.setItem(store,JSON.stringify({id:ID,config,layers}))}
 catch(e){global.console.warn('Tesla preferences could not be saved locally',e)}
}
function assetDb(){
 return new Promise(resolve=>{
  if(!global.indexedDB)return resolve(null);
  try{const req=global.indexedDB.open('magnates-tesla-assets-v1',1);
   req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('images'))req.result.createObjectStore('images')};
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);
  }catch(e){resolve(null)}
 });
}
async function saveAsset(id,src){
 const db=await assetDb();if(!db)return;
 await new Promise(resolve=>{try{const tx=db.transaction('images','readwrite');tx.objectStore('images').put(src,id);tx.oncomplete=resolve;tx.onerror=resolve}catch(e){resolve()}});
 db.close();
}
async function eraseAsset(id){
 const db=await assetDb();if(!db)return;
 await new Promise(resolve=>{try{const tx=db.transaction('images','readwrite');if(id===null)tx.objectStore('images').clear();else tx.objectStore('images').delete(id);tx.oncomplete=resolve;tx.onerror=resolve}catch(e){resolve()}});
 db.close();
}
async function restoreAssets(){
 const db=await assetDb();if(!db)return;
 const jobs=slots.map(id=>new Promise(resolve=>{try{const r=db.transaction('images').objectStore('images').get(id);r.onsuccess=async()=>{if(r.result){try{await loadData(id,r.result)}catch(e){}}resolve()};r.onerror=resolve}catch(e){resolve()}}));
 await Promise.all(jobs);db.close();
}
async function importProject(json){let p=JSON.parse(json);if(p.id!==ID)throw Error('Not a Tesla project');
 config={...defaults,...p.config};layers={...layers,...p.layers};persist();await eraseAsset(null);for(let [k,v] of Object.entries(p.assets||{})){if(slots.includes(k)){await loadData(k,v);await saveAsset(k,v)}}}
const api={id:ID,duration:D,assetSlots:slots,config,render,
 set(k,v){if(!Object.prototype.hasOwnProperty.call(defaults,k))throw Error('Unknown parameter: '+k);config[k]=v;persist()},
 getLayer:id=>({...layers[id]}),
 setLayer(id,key,value){if(!slots.includes(id)||!['x','y','scale','rotation','opacity','depth','visible','entrance','fadeIn','exit','fadeOut'].includes(key))throw Error('Unknown layer/property');layers[id][key]=value;global.localStorage.setItem(store,JSON.stringify({id:ID,config,layers,assets:sources}))},
 loadAsset:async(id,file)=>{if(!slots.includes(id))throw Error('Unknown slot');let url=await new Promise((resolve,reject)=>{let r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});await loadData(id,url);global.localStorage.setItem(store,JSON.stringify({id:ID,config,layers,assets:sources}))},
 clearAsset:id=>{delete images[id];delete sources[id];global.localStorage.setItem(store,JSON.stringify({id:ID,config,assets:sources}))},
 exportProject:()=>({id:ID,version:2,config:{...config},layers:JSON.parse(JSON.stringify(layers)),assets:{...sources},duration:D,scenes:[{id:'study',start:0,end:4.8},{id:'window',start:4.8,end:5.7},{id:'city',start:5.7,end:7}]}),
 downloadProject(){download('tesla-electrical-age.project.json',new Blob([JSON.stringify(api.exportProject(),null,2)],{type:'application/json'}))},
 importProject,
 reset(){config={...defaults};api.config=config;layers=Object.fromEntries(slots.map(id=>[id,{x:0,y:0,scale:1,rotation:0,opacity:1,depth:0,visible:true}]));images={};sources={};global.localStorage.removeItem(store);eraseAsset(null)},
 async recordWebM(canvas){if(!canvas.captureStream||!global.MediaRecorder)throw Error('MediaRecorder unavailable');
 let stream=canvas.captureStream(30),mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';
 let chunks=[],rec=new MediaRecorder(stream,{mimeType:mime});rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 const done=new Promise((resolve,reject)=>{rec.onstop=resolve;rec.onerror=reject});rec.start();
 let started=performance.now();
 await new Promise(resolve=>{function frame(){let sec=(performance.now()-started)/1000;render(canvas,Math.min(D,sec));if(sec<D)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});
 rec.stop();await done;stream.getTracks().forEach(t=>t.stop());download('tesla-electrical-age.webm',new Blob(chunks,{type:mime}))}
};
try{let saved=global.localStorage.getItem(store);if(saved){let p=JSON.parse(saved);config={...defaults,...p.config};layers={...layers,...p.layers};api.config=config;if(p.assets&&Object.keys(p.assets).length){Object.entries(p.assets).filter(([k])=>slots.includes(k)).forEach(([k,v])=>loadData(k,v))}else restoreAssets()}}catch(e){global.console.warn('Tesla previous session cannot reload',e)}
if(!global.localStorage.getItem(store))restoreAssets();
global.MagnatesTeslaOpening=api;
})(window);
