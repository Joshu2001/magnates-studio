(() => {
  'use strict';
  const W=1280,H=720,D=8,canvas=document.getElementById('stage'),ctx=canvas.getContext('2d',{alpha:false});
  const assetNames=['background','building','searchlight','clouds'];
  const images={}; const layers={background:true,building:true,searchlight:true,reflection:true,clouds:true,title:true};
  const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  let ready=false,playing=true,anchor=performance.now(),anchorT=0,t=0,lastT=0,audioCtx=null,soundFired=false,titleLayer=null,titleMetrics=null;
  const off=document.createElement('canvas'); off.width=W; off.height=H; const oc=off.getContext('2d');
  const reflection=document.createElement('canvas'); reflection.width=W; reflection.height=H; const rc=reflection.getContext('2d');
  let seed=91823; function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  const mix=(a,b,p)=>a+(b-a)*p;
  const assetRoot='assets/';
  Promise.all(assetNames.map(name=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[name]=im;resolve();};im.onerror=()=>reject(new Error('Could not load '+name));im.src=assetRoot+name+'.webp';})))
    .then(()=>{ready=true;rebuildTitle();render(0);requestAnimationFrame(loop);})
    .catch(err=>{console.error(err);$('caption').textContent='A scene asset could not be loaded. Check that this page is served from /assets/barry-sacramento/.';});
  function val(id){return Number($(id).value);}
  function readSettings(){return {
    titleStart:val('titleStart'), titleRise:val('titleRise'), lightSpeed:val('lightSpeed'), cameraPush:val('cameraPush')/100,
    titleSize:val('titleSize'), titleY:val('titleY'), gold:$('titleGold').value, beamTint:$('beamTint').value,
    flash:val('flashStrength')/100, pool:val('poolStrength')/100, cloud:val('cloudStrength')/100,
    boom:val('boomStrength')/100, beamIn:val('beamIn'), cloudIn:val('cloudIn'), cloudOut:val('cloudOut'), buildingIn:val('buildingIn')
  };}
  function rebuildTitle(){
    if(!ready) return; seed=91823; const s=readSettings(),text=$('titleText').value||'SACRAMENTO';
    const measure=document.createElement('canvas').getContext('2d');
    let size=s.titleSize; measure.font=`900 ${size}px Impact, "Arial Black", system-ui, sans-serif`;
    while(measure.measureText(text).width>1100&&size>54){size-=1;measure.font=`900 ${size}px Impact, "Arial Black", system-ui, sans-serif`;}
    const m=measure.measureText(text), ascent=m.actualBoundingBoxAscent||size*.78, descent=m.actualBoundingBoxDescent||size*.2;
    const pad=32,w=Math.ceil(m.width+pad*2),h=Math.ceil(ascent+descent+pad*2),base=pad+ascent;
    const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.font=measure.font;g.textBaseline='alphabetic';g.textAlign='left';
    // Heavy, extruded gold title with a repeatable distressed texture clipped to the glyphs.
    g.shadowColor='rgba(5,3,0,.85)';g.shadowBlur=12;g.shadowOffsetY=8;g.lineJoin='round';g.strokeStyle='rgba(53,30,0,.8)';g.lineWidth=Math.max(4,size*.055);g.strokeText(text,pad,base);g.shadowColor='transparent';g.shadowBlur=0;g.shadowOffsetY=0;
    const gold=g.createLinearGradient(0,base-ascent,0,base+descent);gold.addColorStop(0,'#ffe65b');gold.addColorStop(.38,s.gold);gold.addColorStop(1,'#bd6809');g.fillStyle=gold;g.fillText(text,pad,base);
    // Fine dark flecks and scratches; deterministic and fully opaque pigment.
    g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.22;
    for(let i=0;i<Math.round(w*h/2700);i++){const x=pad+rand()*m.width,y=base-ascent+rand()*(ascent+descent),r=rand()*2.2+.35;g.fillStyle=rand()<.65?'#3b2609':'#7a4d11';g.beginPath();g.ellipse(x,y,r*1.4,r*.65,rand()*Math.PI,0,Math.PI*2);g.fill();}
    g.globalAlpha=.18;g.strokeStyle='#4c320b';g.lineWidth=1;for(let i=0;i<20;i++){const x=pad+rand()*m.width,y=base-ascent+rand()*ascent;g.beginPath();g.moveTo(x,y);g.lineTo(x+3+rand()*13,y-1+rand()*3);g.stroke();}g.restore();
    // Narrow bevel highlight and a dark lower extrusion give the title the same physical, distressed weight as the reference.
    g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.28;g.strokeStyle='#fff0a0';g.lineWidth=1.5;g.strokeText(text,pad,base-1);g.restore();
    titleLayer=c;titleMetrics={w,h,base,ascent,descent};
  }
  function rgba(hex,a){const h=hex.replace('#','');const n=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
  function drawCover(im,xoff=0,yoff=0,scale=1){const w=W*scale,h=H*scale;ctx.drawImage(im,(W-w)/2+xoff,(H-h)/2+yoff,w,h);}
  function drawBuildingAlpha(target,x,y,scale){target.drawImage(images.building,x,y,W*scale,H*scale);}
  function buildReflection(time,s){
    rc.clearRect(0,0,W,H); const p=clamp((time-s.beamIn)/4.7,0,1.2),phase=p*s.lightSpeed*2*Math.PI;
    // The warm flare makes one loose orbit across the tower, with small flame-like flutter.
    const cx=690+350*Math.cos(phase-.55),cy=305+168*Math.sin(phase*1.15),flicker=.92+.08*Math.sin(time*19)+.035*Math.sin(time*37);
    rc.save();rc.globalCompositeOperation='source-over';
    let g=rc.createRadialGradient(cx,cy,5,cx,cy,250*flicker);g.addColorStop(0,`rgba(255,246,195,${.67*flicker})`);g.addColorStop(.19,`rgba(255,194,91,${.43*flicker})`);g.addColorStop(.62,'rgba(238,112,30,.14)');g.addColorStop(1,'rgba(255,112,20,0)');rc.fillStyle=g;rc.fillRect(0,0,W,H);
    // A reflected lower streak echoes the moving hot spot without copying the beam geometry.
    const rx=840-110*Math.cos(phase-.55),ry=500+42*Math.sin(phase*1.15);let r=rc.createRadialGradient(rx,ry,3,rx,ry,220);r.addColorStop(0,rgba(s.beamTint,.30));r.addColorStop(.35,rgba(s.beamTint,.15));r.addColorStop(1,rgba(s.beamTint,0));rc.fillStyle=r;rc.fillRect(0,0,W,H);
    rc.restore();
    // Matte the moving light to the transparent building silhouette.
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
    if(!layers.clouds)return;const inP=smooth((time-s.cloudIn)/.45),outP=time<s.cloudOut?1:mix(1,.58,smooth((time-s.cloudOut)/1.2));
    // Cloud stays in front of the title, thinning only after the gold letters have risen into place.
    const titleThinning=.78+.22*smooth(titleProgress-.25);ctx.save();ctx.globalAlpha=s.cloud*inP*outP*titleThinning;
    const drift=Math.sin(time*.55)*32;ctx.drawImage(images.clouds,-38+drift,-8,W+76,H+16);ctx.restore();
  }
  function render(time){
    if(!ready)return;const s=readSettings();time=clamp(time,0,D);t=time;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#070b11';ctx.fillRect(0,0,W,H);
    const bgIn=smooth((time-.02)/.44),push=1+s.cameraPush*clamp(time/D,0,1),pan=Math.sin(time*.32)*5;
    if(layers.background){ctx.save();ctx.globalAlpha=bgIn;drawCover(images.background,pan,Math.sin(time*.25)*2,1.025);ctx.restore();}
    // Quiet cool vignette keeps the beam and gold title legible without crushing the supplied sky plate.
    const vignette=ctx.createRadialGradient(W*.53,H*.38,140,W*.53,H*.38,780);vignette.addColorStop(0,'rgba(5,9,15,0)');vignette.addColorStop(1,'rgba(2,5,10,.37)');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
    const buildingAlpha=layers.building?smooth((time-s.buildingIn)/.72):0;
    if(layers.searchlight){const lightIn=smooth((time-s.beamIn)/.55)*(.91+.025*Math.sin(time*16));ctx.save();ctx.globalAlpha=lightIn;drawCover(images.searchlight,0,0,1);
      // Editable warm cone follows the fixture and sweeps the construction floors.
      const ph=Math.max(0,time-s.beamIn)*s.lightSpeed*.72, sx=1115,sy=105,tx=690+320*Math.cos(ph-.45),ty=330+115*Math.sin(ph*1.16),dx=tx-sx,dy=ty-sy,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
      const cone=ctx.createLinearGradient(sx,sy,tx,ty);cone.addColorStop(0,rgba(s.beamTint,.36));cone.addColorStop(.55,rgba(s.beamTint,.18));cone.addColorStop(1,rgba(s.beamTint,.025));ctx.globalAlpha=lightIn*.68;ctx.globalCompositeOperation='screen';ctx.fillStyle=cone;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(tx+nx*90,ty+ny*90);ctx.lineTo(tx-nx*90,ty-ny*90);ctx.closePath();ctx.fill();ctx.restore();}
    if(buildingAlpha>0){ctx.save();ctx.globalAlpha=buildingAlpha;const bscale=push*(.965+.035*smooth((time-s.buildingIn)/1.4)),bw=W*bscale,bh=H*bscale;ctx.drawImage(images.building,(W-bw)/2,(H-bh)/2,bw,bh);ctx.restore();}
    if(layers.reflection&&buildingAlpha>0)buildReflection(time,s);
    // Sparse hot motes drift through the beam around the moving pool of light.
    if(layers.searchlight&&time>s.beamIn){ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<14;i++){const a=time*(.35+i*.012)+i*2.4;const x=690+350*Math.cos(a),y=290+180*Math.sin(a*1.12),r=1.2+(i%3)*.7;ctx.globalAlpha=.12+.13*(.5+.5*Math.sin(a*4));ctx.fillStyle='#ffd38b';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}ctx.restore();}
    const titleProgress=smooth((time-s.titleStart)/s.titleRise);
    if(layers.title&&titleLayer&&time>s.titleStart-.18&&titleProgress>0){const base=H+80+(s.titleY-(H+80))*titleProgress,alpha=smooth((time-s.titleStart)/.22);ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation='screen';const glow=ctx.createRadialGradient(W/2,base-50,15,W/2,base-35,350);glow.addColorStop(0,'rgba(255,196,49,.25)');glow.addColorStop(1,'rgba(255,154,27,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';const x=(W-titleMetrics.w)/2,y=base-titleMetrics.base;ctx.drawImage(titleLayer,x,y);ctx.restore();}
    drawMovingCloud(time,s,titleProgress);
    // Reuse the existing circular-flashlight template's soft flash-core/screen-bloom language for one opening hit.
    drawFlash(time,s);
    // Film-like grain is subtle and stable; it overlays the completed comp, not the editable source plates.
    ctx.save();ctx.globalAlpha=.025;ctx.fillStyle='#e6d5ad';for(let i=0;i<65;i++){const x=(i*197+Math.floor(time*24)*13)%W,y=(i*101+Math.floor(time*18)*7)%H;ctx.fillRect(x,y,1.2,1.2);}ctx.restore();
    updateReadout(time,titleProgress);
  }
  function updateReadout(time,titleP){$('scrub').value=time;$('clock').textContent=`00:${time.toFixed(2).padStart(5,'0')} / 00:08.00`;
    let msg='A single flashlight bloom strikes; the Sacramento sky and construction tower resolve through the light.';
    if(time>.55&&time<2.25)msg='The floodlit unfinished tower resolves over the Sacramento sunset plate.';
    if(time>=2.25&&time<readSettings().titleStart)msg='A warm flare orbits the façade; its reflected pool moves across the lit windows.';
    if(titleP>0&&titleP<1)msg='SACRAMENTO rises from below the frame, behind the rolling cloud veil.';
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
  const numeric={titleStart:['titleStartOut',v=>`${v.toFixed(1)}s`],titleRise:['titleRiseOut',v=>`${v.toFixed(1)}s`],lightSpeed:['lightSpeedOut',v=>`${v.toFixed(2)}×`],cameraPush:['cameraPushOut',v=>`${Math.round(v)}%`],titleSize:['titleSizeOut',v=>`${Math.round(v)}px`],titleY:['titleYOut',v=>`${Math.round(v)}px`],flashStrength:['flashStrengthOut',v=>`${Math.round(v)}%`],poolStrength:['poolStrengthOut',v=>`${Math.round(v)}%`],cloudStrength:['cloudStrengthOut',v=>`${Math.round(v)}%`],boomStrength:['boomStrengthOut',v=>`${Math.round(v)}%`],beamIn:['beamInOut',v=>`${v.toFixed(2)}s`],cloudIn:['cloudInOut',v=>`${v.toFixed(2)}s`],cloudOut:['cloudOutOut',v=>`${v.toFixed(1)}s`],buildingIn:['buildingInOut',v=>`${v.toFixed(2)}s`]};
  for(const [id,[out,fmt]] of Object.entries(numeric)){$(id).addEventListener('input',()=>{setOut(id,out,fmt);if(id==='titleSize')rebuildTitle();render(t);});setOut(id,out,fmt);}
  $('titleGold').addEventListener('input',()=>{rebuildTitle();render(t);});$('beamTint').addEventListener('input',()=>render(t));
})();
