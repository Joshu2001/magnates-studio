(() => {
  'use strict';
  const W=1280,H=720,D=8,canvas=document.getElementById('stage'),ctx=canvas.getContext('2d',{alpha:false});
  const assetFiles={background:'background.webp',building:'building.webp',clouds:'clouds.webp',searchlightHead:'searchlight-head-three-quarter.svg'};
  const images={}; const layers={background:true,building:true,searchlight:true,reflection:true,clouds:true,title:true};
  const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  let ready=false,playing=true,anchor=performance.now(),anchorT=0,t=0,lastT=0,audioCtx=null,soundFired=false,titleLayer=null,titleMetrics=null,titleParts=[];
  const off=document.createElement('canvas'); off.width=W; off.height=H; const oc=off.getContext('2d');
  const reflection=document.createElement('canvas'); reflection.width=W; reflection.height=H; const rc=reflection.getContext('2d');
  let seed=91823; function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  const mix=(a,b,p)=>a+(b-a)*p;
  const assetRoot='assets/';
  Promise.all(Object.entries(assetFiles).map(([name,file])=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[name]=im;resolve();};im.onerror=()=>reject(new Error('Could not load '+file));im.src=assetRoot+file;})))
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
    // Bright cinematic gold with the stronger dimensionality of the earlier treatment.
    // The face stays luminous gold while the extrusion and mineral wear remain warm brown,
    // avoiding both flat yellow and muddy orange.
    g.lineJoin='round';
    for(let d=10;d>=1;d--){
      const k=d/10;
      g.strokeStyle=`rgba(${Math.round(48+30*(1-k))},${Math.round(24+18*(1-k))},4,${.82+.11*k})`;
      g.fillStyle=`rgba(${Math.round(91+35*(1-k))},${Math.round(46+25*(1-k))},6,.98)`;
      g.lineWidth=Math.max(4,size*.044);
      g.strokeText(text,pad+d*.68,base+d*.76);
      g.fillText(text,pad+d*.68,base+d*.76);
    }
    g.shadowColor='rgba(22,9,0,.80)';g.shadowBlur=14;g.shadowOffsetY=8;
    g.strokeStyle='rgba(78,39,3,.94)';g.lineWidth=Math.max(4,size*.040);g.strokeText(text,pad,base);
    g.shadowColor='transparent';g.shadowBlur=0;g.shadowOffsetY=0;

    const gold=g.createLinearGradient(0,base-ascent,0,base+descent);
    gold.addColorStop(0,'#fff4aa');
    gold.addColorStop(.065,'#ffe064');
    gold.addColorStop(.23,'#f7c633');
    gold.addColorStop(.48,s.gold);
    gold.addColorStop(.70,'#d79212');
    gold.addColorStop(.88,'#a95f08');
    gold.addColorStop(1,'#6f3904');
    g.fillStyle=gold;g.fillText(text,pad,base);

    // Strong but narrow top bevel, plus a subtle darker lower rolloff.
    g.save();g.globalCompositeOperation='source-atop';
    const bevel=g.createLinearGradient(0,base-ascent,0,base+descent);
    bevel.addColorStop(0,'rgba(255,255,224,.82)');
    bevel.addColorStop(.10,'rgba(255,232,133,.38)');
    bevel.addColorStop(.47,'rgba(255,191,45,.04)');
    bevel.addColorStop(.82,'rgba(98,43,2,.16)');
    bevel.addColorStop(1,'rgba(51,20,0,.36)');
    g.fillStyle=bevel;g.fillRect(pad,base-ascent,m.width,ascent+descent);g.restore();

    // Organic weathering: fine dark mineral pits, medium irregular islands, and scratches.
    // The marks stay inside the gold face and never punch holes through the letters.
    const distress=s.titleDistress;
    g.save();g.globalCompositeOperation='source-atop';
    g.globalAlpha=.27*distress;
    for(let i=0;i<Math.round(width*height/190);i++){
      const x=pad+rand()*m.width,y=base-ascent+rand()*(ascent+descent),r=.35+rand()*2.25;
      g.fillStyle=rand()<.58?'#4b2b08':(rand()<.72?'#7f4b0d':'#b27016');
      g.beginPath();g.ellipse(x,y,r*(1+rand()*1.65),r*(.33+rand()*.88),rand()*Math.PI,0,Math.PI*2);g.fill();
    }
    g.globalAlpha=.22*distress;
    for(let i=0;i<Math.round(width*height/1350);i++){
      const x=pad+rand()*m.width,y=base-ascent+rand()*(ascent+descent),rx=1.5+rand()*8,ry=.8+rand()*3.8;
      g.fillStyle=rand()<.70?'#593209':'#91540e';
      g.beginPath();
      for(let k=0;k<11;k++){
        const a=k*Math.PI*2/11,r=.62+rand()*.56,px=x+Math.cos(a)*rx*r,py=y+Math.sin(a)*ry*r;
        if(k===0)g.moveTo(px,py);else g.lineTo(px,py);
      }
      g.closePath();g.fill();
    }
    g.globalAlpha=.23*distress;g.strokeStyle='#4a2a08';
    for(let i=0;i<88;i++){
      const x=pad+rand()*m.width,y=base-ascent+rand()*ascent;
      g.lineWidth=.35+rand()*.75;g.beginPath();g.moveTo(x,y);g.lineTo(x+3+rand()*15,y-1.2+rand()*2.4);g.stroke();
    }
    g.restore();

    g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.37;
    g.strokeStyle='#fff0a8';g.lineWidth=1.45;g.strokeText(text,pad,base-1);g.restore();
    const glyphs=[];let cursor=pad;for(const ch of text){const w=measure.measureText(ch).width;glyphs.push({x:cursor-pad,w,ch});cursor+=w;}
    titleLayer=c;titleMetrics={w:width,h:height,base,ascent,descent,glyphs};

    // Split the finished word into generously padded full-letter plates. These are not
    // reveal masks: every glyph is already fully rendered with its bevel, texture and shadow.
    // Sequential animation now changes only opacity/position, so no rectangular or circular
    // clipping can bite into a letter edge.
    titleParts=[];
    glyphs.forEach((glyph,i)=>{
      if(!glyph.ch.trim()){titleParts.push(null);return;}
      const prevEnd=i>0?glyphs[i-1].x+glyphs[i-1].w:glyph.x;
      const nextStart=i<glyphs.length-1?glyphs[i+1].x:glyph.x+glyph.w;
      const left=Math.floor(pad+(i===0?glyph.x:(prevEnd+glyph.x)/2)-7);
      const right=Math.ceil(pad+(i===glyphs.length-1?glyph.x+glyph.w:(glyph.x+glyph.w+nextStart)/2)+7);
      const sx=Math.max(0,left),sw=Math.min(c.width-sx,Math.max(1,right-sx));
      const pc=document.createElement('canvas');pc.width=sw;pc.height=c.height;
      pc.getContext('2d').drawImage(c,sx,0,sw,c.height,0,0,sw,c.height);
      titleParts.push({canvas:pc,dx:sx-pad,w:sw});
    });
  }
  function rgba(hex,a){const h=hex.replace('#','');const n=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
  function drawCover(im,xoff=0,yoff=0,scale=1){const w=W*scale,h=H*scale;ctx.drawImage(im,(W-w)/2+xoff,(H-h)/2+yoff,w,h);}
  function drawBuildingAlpha(target,x,y,scale){target.drawImage(images.building,x,y,W*scale,H*scale);}
  function beamAim(time,s){
    const sx=1082,sy=108,phase=(time-s.beamIn)*s.lightSpeed*.78,angle=2.83+Math.sin(phase)*s.beamSweep*Math.PI/180,push=1+s.cameraPush*clamp(time/D,0,1);
    const rawX=sx+Math.cos(angle)*620,rawY=sy+Math.sin(angle)*620;
    return {sx,sy,tx:(rawX-W/2)*push+W/2,ty:(rawY-H/2)*push+H/2,phase};
  }
  function drawPhysicalSearchlightRig(time,s,lightIn){
    if(time<s.beamIn||lightIn<=0)return;
    const a=beamAim(time,s),sway=Math.sin(a.phase)*.018;
    ctx.save();

    // Tapered lattice mast. It terminates beneath the mounting brackets of the SVG head.
    const topL={x:1135,y:160},topR={x:1161,y:156};
    const botL={x:1151,y:684},botR={x:1192,y:684};
    ctx.fillStyle='rgba(23,21,19,.97)';
    ctx.beginPath();ctx.moveTo(topL.x,topL.y);ctx.lineTo(topR.x,topR.y);ctx.lineTo(botR.x,botR.y);ctx.lineTo(botL.x,botL.y);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(111,75,40,.78)';ctx.lineWidth=2.1;ctx.stroke();

    ctx.strokeStyle='rgba(103,70,38,.88)';ctx.lineWidth=1.8;
    [0,.34,.67,1].forEach(u=>{
      const tx=topL.x+(topR.x-topL.x)*u,ty=topL.y+(topR.y-topL.y)*u;
      const bx=botL.x+(botR.x-botL.x)*u;
      ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(bx,botL.y);ctx.stroke();
    });
    for(let i=0;i<12;i++){
      const u0=i/12,u1=(i+1)/12;
      const lx0=topL.x+(botL.x-topL.x)*u0,rx0=topR.x+(botR.x-topR.x)*u0,y0=topL.y+(botL.y-topL.y)*u0;
      const lx1=topL.x+(botL.x-topL.x)*u1,rx1=topR.x+(botR.x-topR.x)*u1,y1=topL.y+(botL.y-topL.y)*u1;
      ctx.strokeStyle='rgba(77,54,34,.82)';ctx.lineWidth=1.15;
      ctx.beginPath();ctx.moveTo(lx0,y0);ctx.lineTo(rx1,y1);ctx.moveTo(rx0,y0);ctx.lineTo(lx1,y1);ctx.stroke();
    }
    ctx.fillStyle='rgba(42,35,29,.98)';ctx.fillRect(1138,680,69,12);
    ctx.strokeStyle='rgba(105,72,40,.76)';ctx.strokeRect(1138.5,680.5,68,11);

    // Clean transparent fixture. Its lamp face is already modeled in a three-quarter
    // orientation toward the building. Small sway follows the animated beam.
    ctx.translate(a.sx,a.sy);
    ctx.rotate(sway);
    ctx.globalAlpha=.98;
    ctx.drawImage(images.searchlightHead,-72,-69,210,144);
    ctx.restore();
  }
  function drawSearchlightBulbs(time,s,lightIn){
    if(time<s.beamIn||lightIn<=0)return;
    const a=beamAim(time,s),tint=s.beamTint||'#ffc96a',sway=Math.sin(a.phase)*.018;
    const bulbs=[[-22.1,-19.9],[-3.8,-22.5],[14.6,-25.1],[-19.5,-.3],[-1.1,-2.9],[17.2,-5.5],[-16.9,19.4],[1.5,16.7],[19.9,14.1]];
    ctx.save();ctx.translate(a.sx,a.sy);ctx.rotate(sway);
    bulbs.forEach((o,i)=>{
      const x=o[0],y=o[1],f=.965+.025*Math.sin(time*11+i*1.31);

      // Hot amber lens, elliptical because we are viewing the lamp plane obliquely.
      ctx.globalCompositeOperation='screen';ctx.globalAlpha=.82*lightIn*f;
      const core=ctx.createRadialGradient(x-1,y-1,.3,x,y,7);
      core.addColorStop(0,'rgba(255,255,224,.98)');
      core.addColorStop(.18,'rgba(255,232,145,.96)');
      core.addColorStop(.50,'rgba(255,182,61,.88)');
      core.addColorStop(1,'rgba(255,125,20,0)');
      ctx.fillStyle=core;
      ctx.save();ctx.translate(x,y);ctx.rotate(-.14);ctx.scale(.76,1);
      ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();ctx.restore();

      // Tight individual halo, deliberately too small to merge with neighboring lamps.
      ctx.globalAlpha=.24*lightIn*f;
      const halo=ctx.createRadialGradient(x,y,4,x,y,17);
      halo.addColorStop(0,rgba(tint,.48));halo.addColorStop(.48,rgba(tint,.18));halo.addColorStop(1,rgba(tint,0));
      ctx.fillStyle=halo;ctx.fillRect(x-18,y-18,36,36);
    });
    ctx.restore();
  }
  function drawBeam(time,s,lightIn){
    if(time<s.beamIn||lightIn<=0)return;
    const a=beamAim(time,s),dx=a.tx-a.sx,dy=a.ty-a.sy,len=Math.max(1,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len,width=s.lightWidth;
    const tint=s.beamTint||'#ffc96a';
    ctx.save();ctx.globalCompositeOperation='screen';
    // Keep source bloom compact so the separate bulbs remain visible.
    const lamp=ctx.createRadialGradient(a.sx,a.sy,8,a.sx,a.sy,92);
    lamp.addColorStop(0,rgba(tint,.42*lightIn));
    lamp.addColorStop(.34,rgba(tint,.22*lightIn));
    lamp.addColorStop(1,rgba(tint,0));
    ctx.fillStyle=lamp;ctx.fillRect(a.sx-100,a.sy-100,200,200);

    // Dense amber atmospheric cone: warm, directional and textured rather than pale white.
    ctx.filter='blur(24px)';ctx.globalAlpha=.72*lightIn;
    const haze=ctx.createLinearGradient(a.sx,a.sy,a.tx,a.ty);
    haze.addColorStop(0,rgba(tint,.72));haze.addColorStop(.22,rgba(tint,.52));
    haze.addColorStop(.60,rgba(tint,.30));haze.addColorStop(1,rgba(tint,.05));
    ctx.fillStyle=haze;ctx.beginPath();ctx.moveTo(a.sx,a.sy);
    ctx.lineTo(a.tx+nx*width*1.62,a.ty+ny*width*1.62);
    ctx.lineTo(a.tx-nx*width*1.62,a.ty-ny*width*1.62);ctx.closePath();ctx.fill();

    ctx.filter='blur(8px)';ctx.globalAlpha=.46*lightIn;
    const inner=ctx.createLinearGradient(a.sx,a.sy,a.tx,a.ty);
    inner.addColorStop(0,'rgba(255,231,150,.74)');
    inner.addColorStop(.18,rgba(tint,.58));inner.addColorStop(.72,rgba(tint,.18));inner.addColorStop(1,rgba(tint,0));
    ctx.fillStyle=inner;ctx.beginPath();ctx.moveTo(a.sx,a.sy);
    ctx.lineTo(a.tx+nx*width*.62,a.ty+ny*width*.62);
    ctx.lineTo(a.tx-nx*width*.62,a.ty-ny*width*.62);ctx.closePath();ctx.fill();
    ctx.filter='none';

    // Fine parallel shafts create real volumetric structure inside the beam.
    ctx.lineCap='round';ctx.shadowColor=tint;ctx.shadowBlur=12;
    [-.34,-.16,.05,.23].forEach((off,i)=>{
      ctx.globalAlpha=(.15+(i%2)*.045)*lightIn;
      ctx.strokeStyle=rgba(tint,.72);
      ctx.lineWidth=Math.max(5,width*(.055+(i%2)*.018));
      ctx.beginPath();
      ctx.moveTo(a.sx+nx*off*width*.25,a.sy+ny*off*width*.25);
      ctx.lineTo(a.tx+nx*off*width,a.ty+ny*off*width);
      ctx.stroke();
    });
    ctx.shadowBlur=0;

    for(let i=0;i<6;i++){
      const u=.12+i*.135,px=a.sx+dx*u,py=a.sy+dy*u,r=42+i*13;
      const puff=ctx.createRadialGradient(px,py,0,px,py,r);
      puff.addColorStop(0,rgba(tint,.10*lightIn));puff.addColorStop(1,rgba(tint,0));
      ctx.fillStyle=puff;ctx.fillRect(px-r,py-r,r*2,r*2);
    }

    // Impact bloom is broad and soft; this is what visually ties the beam to the façade.
    const hot=ctx.createRadialGradient(a.tx,a.ty,0,a.tx,a.ty,245);
    hot.addColorStop(0,'rgba(255,224,153,.46)');
    hot.addColorStop(.12,rgba(tint,.62*lightIn));
    hot.addColorStop(.46,rgba(tint,.24*lightIn));
    hot.addColorStop(1,rgba(tint,0));
    ctx.fillStyle=hot;ctx.fillRect(a.tx-255,a.ty-255,510,510);
    ctx.restore();
  }
  function buildReflection(time,s){
    const a=beamAim(time,s),flicker=.96+.035*Math.sin(time*17)+.018*Math.sin(time*31),tint=s.beamTint||'#ffd18a';
    rc.clearRect(0,0,W,H);rc.save();rc.globalCompositeOperation='source-over';
    // Large diffuse bounce first, then a tighter specular response. Both are clipped
    // to the building so windows, tarp and scaffold inherit the same moving light.
    let g=rc.createRadialGradient(a.tx,a.ty,4,a.tx,a.ty,310*flicker);
    g.addColorStop(0,'rgba(255,207,112,.48)');g.addColorStop(.16,rgba(tint,.56*flicker));
    g.addColorStop(.48,rgba(tint,.34));g.addColorStop(1,rgba(tint,0));rc.fillStyle=g;rc.fillRect(0,0,W,H);

    rc.save();rc.translate(a.tx,a.ty);rc.rotate(Math.atan2(a.ty-a.sy,a.tx-a.sx));
    g=rc.createRadialGradient(0,0,2,0,0,230);
    g.addColorStop(0,'rgba(255,224,151,.46)');g.addColorStop(.24,rgba(tint,.48));g.addColorStop(1,rgba(tint,0));
    rc.fillStyle=g;rc.beginPath();rc.ellipse(22,0,275,82,0,0,Math.PI*2);rc.fill();rc.restore();
    rc.restore();

    rc.save();rc.globalCompositeOperation='destination-in';
    const push=1+s.cameraPush*clamp(time/D,0,1);
    drawBuildingAlpha(rc,(W-W*push)/2,(H-H*push)/2,push);rc.restore();

    ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=Math.min(1.35,s.pool*1.12);ctx.filter='blur(1.5px)';ctx.drawImage(reflection,0,0);ctx.filter='none';ctx.restore();

    // Low-level warm bounce into the local atmosphere prevents the illuminated façade
    // from looking like a sticker on an otherwise unaffected scene.
    ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.23*s.pool;
    const spill=ctx.createRadialGradient(a.tx,a.ty,30,a.tx,a.ty,390);
    spill.addColorStop(0,rgba(tint,.30));spill.addColorStop(.52,rgba(tint,.10));spill.addColorStop(1,rgba(tint,0));
    ctx.fillStyle=spill;ctx.fillRect(a.tx-400,a.ty-400,800,800);ctx.restore();
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
    if(layers.searchlight)drawPhysicalSearchlightRig(time,s,lightIn);
    if(buildingAlpha>0){ctx.save();ctx.globalAlpha=buildingAlpha;const bscale=push*(.965+.035*smooth((time-s.buildingIn)/Math.max(.4,s.buildingReveal*2))),bw=W*bscale,bh=H*bscale;ctx.drawImage(images.building,(W-bw)/2,(H-bh)/2,bw,bh);ctx.restore();}
    // Keep the source rig behind the tower plate, but project its soft amber beam across the tower.
    if(layers.searchlight)drawBeam(time,s,lightIn);
    if(layers.reflection&&buildingAlpha>0)buildReflection(time,s);
    if(layers.searchlight)drawSearchlightBulbs(time,s,lightIn);
    // Fine dust drifts within the beam path and follows the lamp's current aim.
    if(layers.searchlight&&time>s.beamIn){const aim=beamAim(time,s);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<18;i++){const u=.24+((i*.213+time*.06)% .7),phase=time*(.65+i*.013)+i*1.9,x=aim.sx+(aim.tx-aim.sx)*u+Math.sin(phase)*18,y=aim.sy+(aim.ty-aim.sy)*u+Math.cos(phase*1.1)*12,r=1+(i%4)*.55;ctx.globalAlpha=.10+.11*(.5+.5*Math.sin(phase*3));ctx.fillStyle='#ffd38b';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}ctx.restore();}
    const titleProgress=smooth((time-s.titleStart)/s.titleRise);
    // Keep the cloud bank behind the title: the title sits on the mist instead of
    // being swallowed by a foreground veil during its reveal.
    drawMovingCloud(time,s,titleProgress);
    if(layers.title&&titleLayer&&time>s.titleStart-.08){
      const base=s.titleY,x=(W-titleMetrics.w)/2,y=base-titleMetrics.base;
      const count=Math.max(1,titleMetrics.glyphs.length);
      const interval=s.titleRise*.72/Math.max(1,count-1);
      const glyphDuration=Math.max(.16,s.titleRise*.34);

      // Scene-level halo behind the word.
      const wholeP=smooth((time-s.titleStart)/Math.max(.25,s.titleRise));
      if(wholeP>0){
        ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.42*wholeP;
        const glow=ctx.createRadialGradient(W/2,base-44,20,W/2,base-32,410);
        glow.addColorStop(0,'rgba(255,193,57,.22)');
        glow.addColorStop(.5,'rgba(226,126,18,.07)');
        glow.addColorStop(1,'rgba(255,132,15,0)');
        ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.restore();
      }

      ctx.save();
      // Slight cinematic perspective without distorting the letter reveal direction.
      ctx.translate(W/2,base-58);
      ctx.transform(.995,-.026,-.066,.998,0,0);
      ctx.translate(-W/2,-(base-58));

      titleMetrics.glyphs.forEach((glyph,i)=>{
        const part=titleParts[i];
        if(!part)return;
        const p=smooth((time-(s.titleStart+i*interval))/glyphDuration);
        if(p<=0)return;
        const rise=(1-p)*8;
        const u=(glyph.x+glyph.w*.5)/Math.max(1,titleMetrics.w-72);
        const perspective=1.045-.085*u;
        const scale=(.987+.013*p)*perspective;
        const px=x+part.dx-u*18, py=y+rise-u*11;
        ctx.save();
        ctx.globalAlpha=s.titleOpacity*p;
        // Tiny per-letter bloom as it enters, but the glyph itself is always drawn whole.
        ctx.translate(px+part.w/2,py+titleMetrics.h/2);
        ctx.scale(scale,scale);
        ctx.translate(-(px+part.w/2),-(py+titleMetrics.h/2));
        ctx.shadowColor='rgba(35,14,0,.66)';
        ctx.shadowBlur=10;ctx.shadowOffsetY=7;
        ctx.drawImage(part.canvas,px,py);
        ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;

        if(p<.9){
          ctx.globalCompositeOperation='screen';
          ctx.globalAlpha=(1-p)*.34;
          const cx=px+part.w*.5,cy=py+titleMetrics.ascent*.48;
          const orb=ctx.createRadialGradient(cx,cy,0,cx,cy,30);
          orb.addColorStop(0,'rgba(255,248,207,.76)');
          orb.addColorStop(.35,'rgba(255,196,58,.30)');
          orb.addColorStop(1,'rgba(255,164,30,0)');
          ctx.fillStyle=orb;ctx.beginPath();ctx.arc(cx,cy,30,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
      });
      ctx.restore();
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
