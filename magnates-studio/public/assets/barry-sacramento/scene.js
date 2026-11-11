(() => {
  'use strict';
  const W=1280,H=720,D=8,canvas=document.getElementById('stage'),ctx=canvas.getContext('2d',{alpha:false});
  const assetFiles={background:'background',building:'building',searchlightRig:'searchlight-rig',clouds:'clouds'};
  const images={}; const layers={background:true,building:true,searchlight:true,reflection:true,clouds:true,title:true};
  const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  let ready=false,playing=true,anchor=performance.now(),anchorT=0,t=0,lastT=0,audioCtx=null,soundFired=false,titleLayer=null,titleMetrics=null;
  const off=document.createElement('canvas'); off.width=W; off.height=H; const oc=off.getContext('2d');
  const reflection=document.createElement('canvas'); reflection.width=W; reflection.height=H; const rc=reflection.getContext('2d');
  let seed=91823; function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  const mix=(a,b,p)=>a+(b-a)*p;
  const assetRoot='assets/';
  Promise.all(Object.entries(assetFiles).map(([name,file])=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[name]=im;resolve();};im.onerror=()=>reject(new Error('Could not load '+file));im.src=assetRoot+file+'.webp';})))
    .then(()=>{ready=true;rebuildTitle();render(0);requestAnimationFrame(loop);})
    .catch(err=>{console.error(err);$('caption').textContent='A scene asset could not be loaded. Check that this page is served from /assets/barry-sacramento/.';});
  function val(id){return Number($(id).value);}
  function readSettings(){return {
    titleStart:val('titleStart'), titleRise:val('titleRise'), lightSpeed:val('lightSpeed'), cameraPush:val('cameraPush')/100,
    titleSize:val('titleSize'), titleY:val('titleY'), cloudOffset:val('cloudOffset'), cloudSpeed:val('cloudSpeed'), skyDrift:val('skyDrift')/100, titleOpacity:val('titleOpacity')/100, titleDistress:val('titleDistress')/100, lightWidth:val('lightWidth'), beamSweep:val('beamSweep'), gold:$('titleGold').value, beamTint:$('beamTint').value,
    flash:val('flashStrength')/100, pool:val('poolStrength')/100, cloud:val('cloudStrength')/100,
    boom:val('boomStrength')/100, beamIn:val('beamIn'), cloudIn:val('cloudIn'), cloudOut:val('cloudOut'), buildingIn:val('buildingIn'), buildingReveal:val('buildingReveal')
  };}
  function rebuildTitle(){
    if(!ready)return;seed=91823;const s=readSettings(),text=$('titleText').value||'SACRAMENTO';
    const measure=document.createElement('canvas').getContext('2d');let size=s.titleSize;
    const fontFor=n=>`900 ${n}px Impact, "Arial Black", "DejaVu Sans", sans-serif`;
    measure.font=fontFor(size);while(measure.measureText(text).width>1100&&size>54){size-=1;measure.font=fontFor(size);}
    const m=measure.measureText(text),ascent=m.actualBoundingBoxAscent||size*.78,descent=m.actualBoundingBoxDescent||size*.2,pad=36;
    const width=Math.ceil(m.width+pad*2),height=Math.ceil(ascent+descent+pad*2),base=pad+ascent;
    const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d');g.font=measure.font;g.textBaseline='alphabetic';g.textAlign='left';
    // Saturated metallic gold with uneven mineral wear and a restrained bevel.
    g.shadowColor='rgba(30,12,0,.82)';g.shadowBlur=15;g.shadowOffsetY=10;g.lineJoin='round';g.strokeStyle='rgba(75,37,2,.88)';g.lineWidth=Math.max(5,size*.055);g.strokeText(text,pad,base);g.shadowColor='transparent';g.shadowBlur=0;g.shadowOffsetY=0;
    const gold=g.createLinearGradient(0,base-ascent,0,base+descent);gold.addColorStop(0,'#ffe85a');gold.addColorStop(.16,'#ffd52c');gold.addColorStop(.48,s.gold);gold.addColorStop(.78,'#e99a0a');gold.addColorStop(1,'#a94e04');g.fillStyle=gold;g.fillText(text,pad,base);
    // Fine mineral speckle, clustered pigment and hairline scratches match the weathered reference without the large repeated dash pattern.
    const distress=s.titleDistress;g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.22*distress;
    for(let i=0;i<Math.round(width*height/210);i++){const x=pad+rand()*m.width,y=base-ascent+rand()*(ascent+descent),r=.35+rand()*2.1;g.fillStyle=rand()<.64?'#48290b':'#8a510d';g.beginPath();g.ellipse(x,y,r*(1+rand()*1.4),r*(.35+rand()*.9),rand()*Math.PI,0,Math.PI*2);g.fill();}
    g.globalAlpha=.19*distress;for(let i=0;i<Math.round(width*height/1450);i++){const x=pad+rand()*m.width,y=base-ascent+rand()*(ascent+descent),rx=1.5+rand()*7,ry=.7+rand()*3.2;g.fillStyle=rand()<.76?'#60350a':'#9a5a0b';g.beginPath();for(let k=0;k<11;k++){const a=k*Math.PI*2/11,r=.67+rand()*.52,px=x+Math.cos(a)*rx*r,py=y+Math.sin(a)*ry*r;if(k===0)g.moveTo(px,py);else g.lineTo(px,py);}g.closePath();g.fill();}
    g.globalAlpha=.23*distress;g.strokeStyle='#4b2d08';for(let i=0;i<74;i++){const x=pad+rand()*m.width,y=base-ascent+rand()*ascent;g.lineWidth=.35+rand()*.8;g.beginPath();g.moveTo(x,y);g.lineTo(x+2+rand()*13,y-1+rand()*2);g.stroke();}g.restore();
    g.save();g.globalCompositeOperation='destination-out';g.globalAlpha=.13*distress;for(let i=0;i<Math.round(width*height/5600);i++){const x=pad+rand()*m.width,y=base-ascent+rand()*(ascent+descent),r=.5+rand()*2.7;g.beginPath();g.ellipse(x,y,r*1.5,r*.7,rand()*Math.PI,0,Math.PI*2);g.fill();}g.restore();
    g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.30;g.strokeStyle='#fff4b0';g.lineWidth=1.5;g.strokeText(text,pad,base-1);g.restore();
    const glyphs=[];let cursor=pad;for(const ch of text){const w=measure.measureText(ch).width;glyphs.push({x:cursor-pad,w,ch});cursor+=w;}
    titleLayer=c;titleMetrics={w:width,h:height,base,ascent,descent,glyphs};
  }
  function rgba(hex,a){const h=hex.replace('#','');const n=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
  function drawCover(im,xoff=0,yoff=0,scale=1){const w=W*scale,h=H*scale;ctx.drawImage(im,(W-w)/2+xoff,(H-h)/2+yoff,w,h);}
  function drawBuildingAlpha(target,x,y,scale){target.drawImage(images.building,x,y,W*scale,H*scale);}
  function beamAim(time,s){
    const sx=1082,sy=108,phase=(time-s.beamIn)*s.lightSpeed*.78,angle=2.83+Math.sin(phase)*s.beamSweep*Math.PI/180,push=1+s.cameraPush*clamp(time/D,0,1);
    const rawX=sx+Math.cos(angle)*620,rawY=sy+Math.sin(angle)*620;
    return {sx,sy,tx:(rawX-W/2)*push+W/2,ty:(rawY-H/2)*push+H/2,phase};
  }
  function drawBeam(time,s,lightIn){
    if(time<s.beamIn)return;const a=beamAim(time,s),dx=a.tx-a.sx,dy=a.ty-a.sy,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,width=s.lightWidth;
    ctx.save();ctx.globalCompositeOperation='screen';
    // A real searchlight reads as a broad amber haze with a restrained luminous core,
    // not a hard white stripe or a sharply outlined triangular graphic.
    const bloom=ctx.createRadialGradient(a.sx,a.sy,2,a.sx,a.sy,118);bloom.addColorStop(0,`rgba(255,221,155,${.54*lightIn})`);bloom.addColorStop(.16,`rgba(255,161,55,${.28*lightIn})`);bloom.addColorStop(1,'rgba(255,115,22,0)');ctx.fillStyle=bloom;ctx.fillRect(a.sx-125,a.sy-125,250,250);
    ctx.filter='blur(24px)';ctx.globalAlpha=lightIn*.95;
    const cone=ctx.createLinearGradient(a.sx,a.sy,a.tx,a.ty);cone.addColorStop(0,'rgba(255,190,91,.58)');cone.addColorStop(.32,'rgba(255,139,43,.38)');cone.addColorStop(1,'rgba(255,104,22,.07)');ctx.fillStyle=cone;ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(a.tx+nx*width*1.55,a.ty+ny*width*1.55);ctx.lineTo(a.tx-nx*width*1.55,a.ty-ny*width*1.55);ctx.closePath();ctx.fill();ctx.filter='none';
    ctx.globalAlpha=lightIn*.28;const core=ctx.createLinearGradient(a.sx,a.sy,a.tx,a.ty);core.addColorStop(0,'rgba(255,239,195,.24)');core.addColorStop(.25,'rgba(255,192,105,.20)');core.addColorStop(1,'rgba(255,140,48,.025)');ctx.strokeStyle=core;ctx.lineWidth=width*.38;ctx.lineCap='round';ctx.shadowColor='#ff9b37';ctx.shadowBlur=38;ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(a.tx,a.ty);ctx.stroke();ctx.shadowBlur=0;
    const hot=ctx.createRadialGradient(a.tx,a.ty,2,a.tx,a.ty,174);hot.addColorStop(0,`rgba(255,192,92,${.29*lightIn})`);hot.addColorStop(.32,`rgba(255,133,42,${.16*lightIn})`);hot.addColorStop(1,'rgba(255,100,20,0)');ctx.fillStyle=hot;ctx.fillRect(a.tx-180,a.ty-180,360,360);ctx.restore();
  }
  function buildReflection(time,s){
    const a=beamAim(time,s),flicker=.94+.06*Math.sin(time*21)+.025*Math.sin(time*38);rc.clearRect(0,0,W,H);rc.save();rc.globalCompositeOperation='source-over';
    const g=rc.createRadialGradient(a.tx,a.ty,2,a.tx,a.ty,230*flicker);g.addColorStop(0,`rgba(255,210,133,${.48*flicker})`);g.addColorStop(.17,`rgba(255,166,59,${.46*flicker})`);g.addColorStop(.46,'rgba(238,96,20,.25)');g.addColorStop(1,'rgba(255,105,18,0)');rc.fillStyle=g;rc.fillRect(0,0,W,H);
    rc.translate(a.tx,a.ty);rc.rotate(Math.atan2(a.ty-a.sy,a.tx-a.sx));const streak=rc.createRadialGradient(0,0,4,0,0,190);streak.addColorStop(0,'rgba(255,183,75,.29)');streak.addColorStop(.4,'rgba(255,120,34,.15)');streak.addColorStop(1,'rgba(255,92,18,0)');rc.fillStyle=streak;rc.beginPath();rc.ellipse(12,0,210,62,0,0,Math.PI*2);rc.fill();rc.restore();
    // Keep the warm pool and streak clipped to the actual tower layer.
    rc.save();rc.globalCompositeOperation='destination-in';const push=1+s.cameraPush*clamp(time/D,0,1);drawBuildingAlpha(rc,(W-W*push)/2,(H-H*push)/2,push);rc.restore();
    ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=s.pool;ctx.drawImage(reflection,0,0);ctx.restore();
  }
  function drawFlash(time,s){
    const burst=s.flash*(.92*Math.exp(-Math.pow((time-.19)/.12,2))+.26*Math.exp(-Math.pow((time-.34)/.10,2)));
    if(burst<.008)return;
    ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=clamp(burst,0,1);
    const g=ctx.createRadialGradient(900,170,0,730,330,790);g.addColorStop(0,'rgba(255,255,231,.96)');g.addColorStop(.11,'rgba(255,230,173,.78)');g.addColorStop(.36,'rgba(255,157,75,.35)');g.addColorStop(1,'rgba(255,142,50,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    const core=ctx.createRadialGradient(900,170,0,900,170,220);core.addColorStop(0,'rgba(255,255,255,.98)');core.addColorStop(.23,'rgba(255,248,220,.62)');core.addColorStop(1,'rgba(255,198,104,0)');ctx.fillStyle=core;ctx.fillRect(0,0,W,H);ctx.restore();
  }
  function drawMovingCloud(time,s,titleProgress){
    if(!layers.clouds)return;const inP=smooth((time-s.cloudIn)/.45),outP=time<s.cloudOut?1:mix(1,.76,smooth((time-s.cloudOut)/1.2));
    const titleThinning=.94+.06*smooth(titleProgress-.25),drift=Math.sin(time*.55*s.cloudSpeed)*28,y=-8+s.cloudOffset;
    ctx.save();ctx.globalAlpha=s.cloud*inP*outP*titleThinning;
    ctx.globalAlpha*=.38;ctx.filter='blur(18px)';ctx.drawImage(images.clouds,-44+drift*.8,y+18,W+88,H+44);ctx.filter='none';
    ctx.globalAlpha=s.cloud*inP*outP*titleThinning*.96;ctx.drawImage(images.clouds,-38+drift,y,W+76,H+16);
    ctx.globalAlpha*=.44;ctx.drawImage(images.clouds,-28-drift*.35,y+24,W+56,H+36);ctx.restore();
  }
  function render(time){
    if(!ready)return;const s=readSettings();time=clamp(time,0,D);t=time;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#070b11';ctx.fillRect(0,0,W,H);
    const bgIn=smooth((time-.02)/.44),push=1+s.cameraPush*clamp(time/D,0,1),pan=Math.sin(time*.32)*5*s.skyDrift;
    if(layers.background){ctx.save();ctx.globalAlpha=bgIn;drawCover(images.background,pan,Math.sin(time*.25)*2*s.skyDrift,1.025);ctx.restore();}
    // Quiet cool vignette keeps the beam and gold title legible without crushing the supplied sky plate.
    const vignette=ctx.createRadialGradient(W*.53,H*.38,140,W*.53,H*.38,780);vignette.addColorStop(0,'rgba(5,9,15,0)');vignette.addColorStop(1,'rgba(2,5,10,.37)');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
    const buildingAlpha=layers.building?smooth((time-s.buildingIn)/s.buildingReveal):0;
    const lightIn=layers.searchlight?smooth((time-s.beamIn)/.55)*(.9+.06*Math.sin(time*17)):0;
    if(layers.searchlight){ctx.save();ctx.globalAlpha=lightIn;drawCover(images.searchlightRig,0,0,1);ctx.restore();}
    if(buildingAlpha>0){ctx.save();ctx.globalAlpha=buildingAlpha;const bscale=push*(.965+.035*smooth((time-s.buildingIn)/Math.max(.4,s.buildingReveal*2))),bw=W*bscale,bh=H*bscale;ctx.drawImage(images.building,(W-bw)/2,(H-bh)/2,bw,bh);ctx.restore();}
    // Keep the source rig behind the tower plate, but project its soft amber beam across the tower.
    if(layers.searchlight)drawBeam(time,s,lightIn);
    if(layers.reflection&&buildingAlpha>0)buildReflection(time,s);
    // Fine dust drifts within the beam path and follows the lamp's current aim.
    if(layers.searchlight&&time>s.beamIn){const aim=beamAim(time,s);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<18;i++){const u=.24+((i*.213+time*.06)% .7),phase=time*(.65+i*.013)+i*1.9,x=aim.sx+(aim.tx-aim.sx)*u+Math.sin(phase)*18,y=aim.sy+(aim.ty-aim.sy)*u+Math.cos(phase*1.1)*12,r=1+(i%4)*.55;ctx.globalAlpha=.10+.11*(.5+.5*Math.sin(phase*3));ctx.fillStyle='#ffd38b';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}ctx.restore();}
    const titleProgress=smooth((time-s.titleStart)/s.titleRise);
    // Keep the cloud bank behind the title: the title sits on the mist instead of
    // being swallowed by a foreground veil during its reveal.
    drawMovingCloud(time,s,titleProgress);
    if(layers.title&&titleLayer&&time>s.titleStart-.12&&titleProgress>0){
      const base=s.titleY,alpha=smooth((time-s.titleStart)/.18)*s.titleOpacity,x=(W-titleMetrics.w)/2,y=base-titleMetrics.base;
      ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation='screen';const glow=ctx.createRadialGradient(W/2,base-50,15,W/2,base-35,350);glow.addColorStop(0,'rgba(255,195,35,.19)');glow.addColorStop(1,'rgba(255,154,27,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=alpha;
      const count=titleMetrics.glyphs.length,interval=s.titleRise*.69/Math.max(1,count-1),glyphDuration=Math.max(.16,s.titleRise*.30);
      titleMetrics.glyphs.forEach((glyph,i)=>{if(!glyph.ch.trim())return;const p=smooth((time-(s.titleStart+i*interval))/glyphDuration);if(p<=0)return;const cellX=x+glyph.x,cellW=Math.max(1,glyph.w),cx=cellX+cellW/2,cy=y+titleMetrics.ascent*.52,maxR=Math.max(cellW*.82,titleMetrics.ascent*.72),radius=maxR*(.12+.88*p);
        ctx.save();ctx.beginPath();ctx.rect(cellX-1,y-4,cellW+2,titleMetrics.h+8);ctx.clip();ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.clip();ctx.drawImage(titleLayer,x,y);ctx.restore();
        if(p<.96){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=alpha*(1-p)*.72;const orb=ctx.createRadialGradient(cx,cy,1,cx,cy,24+22*(1-p));orb.addColorStop(0,'rgba(255,255,230,.96)');orb.addColorStop(.2,'rgba(255,208,75,.65)');orb.addColorStop(1,'rgba(255,174,32,0)');ctx.fillStyle=orb;ctx.beginPath();ctx.arc(cx,cy,25+20*(1-p),0,Math.PI*2);ctx.fill();ctx.restore();}
      });ctx.restore();
    }
    // Reuse the existing circular-flashlight template's soft flash-core/screen-bloom language for one opening hit.
    drawFlash(time,s);
    // Film-like grain is subtle and stable; it overlays the completed comp, not the editable source plates.
    ctx.save();ctx.globalAlpha=.025;ctx.fillStyle='#e6d5ad';for(let i=0;i<65;i++){const x=(i*197+Math.floor(time*24)*13)%W,y=(i*101+Math.floor(time*18)*7)%H;ctx.fillRect(x,y,1.2,1.2);}ctx.restore();
    updateReadout(time,titleProgress);
  }
  function updateReadout(time,titleP){$('scrub').value=time;$('clock').textContent=`00:${time.toFixed(2).padStart(5,'0')} / 00:08.00`;
    let msg='A single flashlight bloom strikes; the Sacramento sky and construction tower resolve through the light.';
    if(time>.55&&time<2.25)msg='The floodlit unfinished tower resolves over the Sacramento sunset plate.';
    if(time>=2.25&&time<readSettings().titleStart)msg='The beam pivots from the floodlight rig; its warm reflected pool tracks over the façade.';
    if(titleP>0&&titleP<1)msg='The gold letters bloom one by one from left to right, rising behind the fuller foreground cloud.';
    if(titleP>=1)msg='Final composition holds: gold title, cloud occlusion, searchlight bloom, and moving façade reflection.';
    $('caption').textContent=msg;
  }
  function loop(now){if(playing){const next=anchorT+(now-anchor)/1000;if(next>=D){t=D;playing=false;syncPlay();render(D);}else{if($('soundOn').checked&&!soundFired&&lastT<.20&&next>=.20)playBoom();if(next<lastT-.1)soundFired=false;lastT=next;render(next);}}requestAnimationFrame(loop);}
  function syncPlay(){const label=playing?'Pause':'Play';$('play').textContent=label;$('playTop').textContent=playing?'Pause preview':'Play preview';}
  function togglePlay(){playing=!playing;anchor=performance.now();anchorT=t;if(playing&&t>=D){t=0;anchorT=0;soundFired=false;}syncPlay();}
  function restart(){playing=true;t=0;anchor=performance.now();anchorT=0;lastT=0;soundFired=false;syncPlay();render(0);}
  function playBoom(){try{seed=91823;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!audioCtx)audioCtx=new AC();if(audioCtx.state==='suspended')audioCtx.resume();const now=audioCtx.currentTime,level=readSettings().boom;
      const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();osc.type='sine';osc.frequency.setValueAtTime(72,now);osc.frequency.exponentialRampToValueAtTime(39,now+.46);filter.type='lowpass';filter.frequency.value=260;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,.25*level),now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.72);osc.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);osc.start(now);osc.stop(now+.74);
      const n=Math.floor(audioCtx.sampleRate*.55),buffer=audioCtx.createBuffer(1,n,audioCtx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<n;i++)data[i]=(rand()*2-1)*Math.pow(1-i/n,3);const src=audioCtx.createBufferSource(),ng=audioCtx.createGain(),lp=audioCtx.createBiquadFilter();src.buffer=buffer;lp.type='lowpass';lp.frequency.setValueAtTime(1100,now);lp.frequency.exponentialRampToValueAtTime(280,now+.5);ng.gain.setValueAtTime(.0001,now);ng.gain.exponentialRampToValueAtTime(.12*level,now+.018);ng.gain.exponentialRampToValueAtTime(.0001,now+.53);src.connect(lp);lp.connect(ng);ng.connect(audioCtx.destination);src.start(now);soundFired=true;
    }catch(e){console.warn('Opening sound could not start',e);}}
  function setOut(id,out,fmt){$(out).textContent=fmt(val(id));}
  $('play').addEventListener('click',togglePlay);$('playTop').addEventListener('click',togglePlay);$('restart').addEventListener('click',restart);
  $('scrub').addEventListener('input',e=>{playing=false;syncPlay();t=Number(e.target.value);anchorT=t;anchor=performance.now();if(t<.2)soundFired=false;render(t);});
  $('titleText').addEventListener('input',()=>{rebuildTitle();render(t);});
  document.querySelectorAll('[data-layer]').forEach(el=>el.addEventListener('change',()=>{layers[el.dataset.layer]=el.checked;render(t);}));
  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('.pane').forEach(x=>x.classList.toggle('active',x.dataset.pane===btn.dataset.tab));}));
  const numeric={lightWidth:['lightWidthOut',v=>`${Math.round(v)}px`],beamSweep:['beamSweepOut',v=>`${Math.round(v)}°`],titleOpacity:['titleOpacityOut',v=>`${Math.round(v)}%`],titleDistress:['titleDistressOut',v=>`${Math.round(v)}%`],titleStart:['titleStartOut',v=>`${v.toFixed(1)}s`],titleRise:['titleRiseOut',v=>`${v.toFixed(1)}s`],lightSpeed:['lightSpeedOut',v=>`${v.toFixed(2)}×`],cameraPush:['cameraPushOut',v=>`${Math.round(v)}%`],titleSize:['titleSizeOut',v=>`${Math.round(v)}px`],titleY:['titleYOut',v=>`${Math.round(v)}px`],cloudOffset:['cloudOffsetOut',v=>`${Math.round(v)}px`],flashStrength:['flashStrengthOut',v=>`${Math.round(v)}%`],poolStrength:['poolStrengthOut',v=>`${Math.round(v)}%`],cloudStrength:['cloudStrengthOut',v=>`${Math.round(v)}%`],boomStrength:['boomStrengthOut',v=>`${Math.round(v)}%`],beamIn:['beamInOut',v=>`${v.toFixed(2)}s`],cloudIn:['cloudInOut',v=>`${v.toFixed(2)}s`],cloudOut:['cloudOutOut',v=>`${v.toFixed(1)}s`],buildingIn:['buildingInOut',v=>`${v.toFixed(2)}s`],buildingReveal:['buildingRevealOut',v=>`${v.toFixed(2)}s`],cloudSpeed:['cloudSpeedOut',v=>`${v.toFixed(2)}×`],skyDrift:['skyDriftOut',v=>`${Math.round(v)}%`]};
  for(const [id,[out,fmt]] of Object.entries(numeric)){$(id).addEventListener('input',()=>{setOut(id,out,fmt);if(id==='titleSize')rebuildTitle();render(t);});setOut(id,out,fmt);}
  $('titleGold').addEventListener('input',()=>{rebuildTitle();render(t);});$('beamTint').addEventListener('input',()=>render(t));
})();
