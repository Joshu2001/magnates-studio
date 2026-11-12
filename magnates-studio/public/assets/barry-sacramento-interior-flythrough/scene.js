(() => {
  'use strict';
  const W=1280,H=720,D=6.5;
  const canvas=document.getElementById('stage');
  const ctx=canvas.getContext('2d',{alpha:false});
  const DPR=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);

  const $=id=>document.getElementById(id);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,p)=>a+(b-a)*p;
  const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  const smoother=x=>{x=clamp(x,0,1);return x*x*x*(x*(x*6-15)+10);};
  const easeOutBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};

  let ready=false,playing=true,t=0,anchor=performance.now(),anchorT=0;
  const images={};
  const layers={background:true,foreground:true,people:true,shadows:true,atmosphere:true,title:true};
  const corridorSrc='/assets/barry-minkow-opening/assets/construction-corridor.webp';
  const atlasSrc='data:image/webp;base64,'+(window.BARRY_TRANSITION_ATLAS||'');
  const atlasRects={
    manLeft:[0,0,144,216],
    manRight:[144,0,144,216],
    shadowLeft:[26,216,236,79],
    shadowRight:[26,295,236,79],
    fog:[288,216,288,162],
    haze:[288,378,288,162]
  };

  function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Could not load '+src));im.src=src;});}
  Promise.all([
    loadImage(corridorSrc).then(im=>images.corridor=im),
    loadImage(atlasSrc).then(im=>images.atlas=im)
  ]).then(()=>{ready=true;render(0);requestAnimationFrame(loop);}).catch(err=>{
    console.error(err);$('caption').textContent=err.message;
  });

  function val(id){return Number($(id).value);}
  function settings(){return {
    flyDuration:val('flyDuration'),
    push:val('pushStrength')/100,
    glide:val('glideStrength'),
    depth:val('depthStrength')/100,
    peopleDepth:val('peopleDepth')/100,
    shadowOpacity:val('shadowOpacity')/100,
    titleStart:val('titleStart'),
    titleDuration:val('titleDuration'),
    titleSize:val('titleSize'),
    topText:$('topText').value||'AN 18-STORY',
    bottomText:$('bottomText').value||'OFFICE BUILDING',
    topColor:$('topColor').value,
    bottomColor:$('bottomColor').value,
    titleGlow:val('titleGlow')/100,
    fogOpacity:val('fogOpacity')/100,
    dust:val('dustStrength')/100
  };}

  function drawCover(im,tx,ty,scale){
    const ar=im.width/im.height,car=W/H;
    let dw,dh;
    if(ar>car){dh=H*scale;dw=dh*ar;}else{dw=W*scale;dh=dw/ar;}
    ctx.drawImage(im,(W-dw)/2+tx,(H-dh)/2+ty,dw,dh);
  }

  function drawPlane(im,tx,ty,scale,alpha=1,filter='none'){
    ctx.save();ctx.globalAlpha=alpha;ctx.filter=filter;drawCover(im,tx,ty,scale);ctx.restore();
  }

  function clipPlane(im,rect,tx,ty,scale,alpha=1,blur=0){
    ctx.save();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
    ctx.globalAlpha=alpha;if(blur>0)ctx.filter='blur('+blur+'px)';
    drawCover(im,tx,ty,scale);ctx.restore();
  }

  function drawAtlas(key,x,y,w,h,alpha=1,filter='none',blend='source-over'){
    const r=atlasRects[key];
    if(!r||!images.atlas)return;
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.globalCompositeOperation=blend;
    ctx.filter=filter;
    ctx.drawImage(images.atlas,r[0],r[1],r[2],r[3],x,y,w,h);
    ctx.restore();
  }

  function drawPhotographicShadows(time,p,s){
    const sc=1+s.peopleDepth*.055*p;
    const dy=-s.glide*.56*p;
    ctx.save();
    ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
    ctx.translate(0,dy);
    // Long photographed shadows remain attached to the floor plane, therefore they
    // move less than the bodies as the camera advances.
    drawAtlas('shadowLeft',430,568,360,120,s.shadowOpacity*.82,'blur(.7px)','multiply');
    drawAtlas('shadowRight',565,568,360,120,s.shadowOpacity*.78,'blur(.7px)','multiply');
    ctx.restore();
  }

  function drawPhotographicPeople(time,p,s){
    const sc=1+s.peopleDepth*.095*p;
    const dy=-s.glide*.72*p;
    const micro=Math.sin(time*2.0)*.55*(1-p*.45);
    ctx.save();
    ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
    ctx.translate(0,dy);
    // These are the actual generated photographic cutouts from the approved reference
    // composition, not procedural stand-ins. Only sub-pixel camera-relative drift is used.
    drawAtlas('manLeft',500+micro,392,176,264,1);
    drawAtlas('manRight',604-micro*.35,392,176,264,1);
    ctx.restore();
  }

  function drawPhotographicAtmosphere(time,p,s){
    if(!layers.atmosphere||!images.atlas)return;
    // Persistent interior haze is a rear atmospheric plane.
    drawAtlas('haze',-45,-8,W+90,H+20,.30*s.fogOpacity,'blur(.8px)','screen');

    // Entry fog is the remnant of the exterior foreground occluder. It begins across
    // the lens, then sweeps downward using the same 1.35s smoothstep glide duration
    // as the established Barry tower camera passage.
    const clear=smooth(time/1.35);
    const y=-H*.11 + clear*H*1.03;
    const a=(1-clear)*.76*s.fogOpacity;
    if(a>.003){
      drawAtlas('fog',-130,y,W+260,H*.78,a,'blur('+(1.8+4.2*(1-clear))+'px)','screen');
      drawAtlas('fog',-210,y-74,W+420,H*.92,a*.48,'blur('+(5+6*(1-clear))+'px)','source-over');
    }
  }

  function drawWalkingShadows(time,p,s){
    const sc=1+s.peopleDepth*.075*p;
    ctx.save();ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
    ctx.translate(0,-s.glide*.72*p);
    const baseY=610;
    const stretch=1.0+.10*p;
    ctx.globalCompositeOperation='multiply';
    ctx.filter='blur(9px)';
    ctx.globalAlpha=s.shadowOpacity*.55;
    const grad=ctx.createLinearGradient(760,baseY,760,H);
    grad.addColorStop(0,'rgba(35,20,10,.46)');grad.addColorStop(1,'rgba(20,10,4,.05)');
    ctx.fillStyle=grad;
    // Left figure shadow.
    ctx.beginPath();ctx.moveTo(767,baseY-2);ctx.lineTo(793,baseY+2);ctx.lineTo(705,H*stretch);ctx.lineTo(640,H*stretch);ctx.closePath();ctx.fill();
    // Right figure shadow.
    ctx.beginPath();ctx.moveTo(844,baseY-2);ctx.lineTo(872,baseY+3);ctx.lineTo(970,H*stretch);ctx.lineTo(885,H*stretch);ctx.closePath();ctx.fill();
    ctx.restore();
  }

  function drawPerson(x,groundY,scale,variant,time,p){
    ctx.save();ctx.translate(x,groundY);ctx.scale(scale,scale);
    const step=Math.sin(time*3.1+(variant?1.3:0))*(1-p*.55);
    const lean=variant?-.015:.018;
    ctx.rotate(lean);

    // Legs.
    ctx.lineCap='round';ctx.strokeStyle=variant?'#2c2925':'#242426';ctx.lineWidth=10;
    ctx.beginPath();ctx.moveTo(-8,-55);ctx.lineTo(-10+step*4,-15);ctx.stroke();
    ctx.beginPath();ctx.moveTo(8,-55);ctx.lineTo(10-step*4,-15);ctx.stroke();
    ctx.strokeStyle='#151518';ctx.lineWidth=12;
    ctx.beginPath();ctx.moveTo(-11+step*4,-15);ctx.lineTo(-15+step*6,0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(11-step*4,-15);ctx.lineTo(15-step*6,0);ctx.stroke();

    // Coat/body.
    const coat=ctx.createLinearGradient(-28,-125,28,-55);
    coat.addColorStop(0,variant?'#65594b':'#39383a');
    coat.addColorStop(.5,variant?'#52483e':'#2d2d30');
    coat.addColorStop(1,variant?'#312c27':'#1e1e21');
    ctx.fillStyle=coat;
    ctx.beginPath();ctx.moveTo(-25,-120);ctx.quadraticCurveTo(0,-134,25,-120);ctx.lineTo(30,-58);ctx.quadraticCurveTo(0,-48,-30,-58);ctx.closePath();ctx.fill();

    // Shoulders/arms.
    ctx.strokeStyle=variant?'#4d443a':'#27272a';ctx.lineWidth=12;
    ctx.beginPath();ctx.moveTo(-20,-111);ctx.lineTo(-32,-72);ctx.stroke();
    ctx.beginPath();ctx.moveTo(20,-111);ctx.lineTo(30,-73);ctx.stroke();

    // Neck/head with warm rim from the corridor.
    ctx.fillStyle='#8e6547';ctx.fillRect(-5,-135,10,12);
    const head=ctx.createRadialGradient(-4,-151,2,0,-147,18);
    head.addColorStop(0,'#d5a17a');head.addColorStop(.65,'#93684c');head.addColorStop(1,'#5c3f31');
    ctx.fillStyle=head;ctx.beginPath();ctx.ellipse(0,-151,15,18,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=variant?'#5b5147':'#262327';ctx.beginPath();ctx.ellipse(0,-160,15,8,0,Math.PI,Math.PI*2);ctx.fill();

    // Warm edge light.
    ctx.strokeStyle='rgba(255,176,82,.36)';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(-24,-118);ctx.lineTo(-28,-60);ctx.stroke();

    if(!variant){
      // Briefcase.
      ctx.fillStyle='#3a2618';ctx.strokeStyle='#8b5d32';ctx.lineWidth=1;
      ctx.fillRect(-43,-55,25,30);ctx.strokeRect(-43,-55,25,30);
      ctx.beginPath();ctx.arc(-30,-55,7,Math.PI,0);ctx.stroke();
    }else{
      // Folder under arm.
      ctx.fillStyle='#b6aa8c';ctx.strokeStyle='#6d6250';ctx.lineWidth=1.2;
      ctx.save();ctx.translate(32,-72);ctx.rotate(-.12);ctx.fillRect(-3,-20,14,34);ctx.strokeRect(-3,-20,14,34);ctx.restore();
    }

    ctx.restore();
  }

  function drawWalkingPeople(time,p,s){
    const sc=1+s.peopleDepth*.115*p;
    ctx.save();ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
    ctx.translate(0,-s.glide*.92*p);
    const sway=Math.sin(time*2.2)*1.1*(1-p*.45);
    drawPerson(780+sway,610,0.78,false,time,p);
    drawPerson(855-sway*.5,610,0.82,true,time,p);
    ctx.restore();
  }

  function drawShadowVector(x,y,scale,alpha,lean){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha=alpha;
    const g=ctx.createLinearGradient(0,0,0,170);
    g.addColorStop(0,'rgba(27,16,9,.55)');g.addColorStop(.45,'rgba(20,12,7,.33)');g.addColorStop(1,'rgba(8,6,5,0)');
    ctx.fillStyle=g;ctx.filter='blur(6px)';
    ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(18,0);ctx.lineTo(56+lean,168);ctx.lineTo(15+lean,170);ctx.closePath();ctx.fill();
    ctx.restore();
  }

  function drawBusinessman(x,y,scale,variant,walkPhase){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    const dark=variant===0?'#191713':'#40352a', mid=variant===0?'#2a2722':'#5a4938', hi=variant===0?'#51483c':'#8b6d4d';
    const step=Math.sin(walkPhase)*4;

    // head + neck
    ctx.fillStyle='#6d4229';ctx.beginPath();ctx.arc(0,-160,11,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#52311f';ctx.fillRect(-5,-151,10,10);

    // jacket body
    ctx.fillStyle=dark;ctx.beginPath();ctx.moveTo(-26,-141);ctx.quadraticCurveTo(-15,-150,0,-148);ctx.quadraticCurveTo(17,-151,28,-138);
    ctx.lineTo(23,-72);ctx.lineTo(-22,-72);ctx.closePath();ctx.fill();
    // warm rim light
    ctx.strokeStyle='rgba(255,181,88,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-24,-136);ctx.lineTo(-20,-80);ctx.moveTo(25,-136);ctx.lineTo(20,-82);ctx.stroke();

    // arms
    ctx.strokeStyle=dark;ctx.lineWidth=12;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-22,-128);ctx.lineTo(-29,-82);ctx.stroke();
    ctx.beginPath();ctx.moveTo(22,-128);ctx.lineTo(29,-82);ctx.stroke();

    // trousers / walking stance
    ctx.strokeStyle=mid;ctx.lineWidth=13;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-10,-72);ctx.lineTo(-12-step*.35,-22);ctx.lineTo(-15-step*.75,0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(10,-72);ctx.lineTo(12+step*.35,-22);ctx.lineTo(15+step*.75,0);ctx.stroke();

    // shoes
    ctx.strokeStyle='#0d0c0b';ctx.lineWidth=7;
    ctx.beginPath();ctx.moveTo(-17-step*.75,0);ctx.lineTo(-6-step*.75,0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(11+step*.75,0);ctx.lineTo(21+step*.75,0);ctx.stroke();

    // briefcase / folder
    if(variant===0){
      ctx.fillStyle='#3a1d0d';ctx.strokeStyle='#8b522b';ctx.lineWidth=1.5;ctx.fillRect(-43,-63,20,24);ctx.strokeRect(-43,-63,20,24);
      ctx.strokeStyle='#6a3d21';ctx.lineWidth=2;ctx.strokeRect(-37,-68,9,6);
    }else{
      ctx.save();ctx.translate(30,-87);ctx.rotate(-.10);ctx.fillStyle='#d9c9a5';ctx.strokeStyle='#6b5740';ctx.lineWidth=1.5;ctx.fillRect(-2,-16,12,31);ctx.strokeRect(-2,-16,12,31);ctx.restore();
    }

    // subtle jacket highlight
    ctx.fillStyle=hi;ctx.globalAlpha=.16;ctx.beginPath();ctx.moveTo(-3,-145);ctx.lineTo(15,-138);ctx.lineTo(12,-80);ctx.lineTo(1,-78);ctx.closePath();ctx.fill();
    ctx.restore();
  }

  function drawPeopleVector(time,p,s){
    const depth=1+s.peopleDepth*.10*p;
    const y=600-s.glide*.74*p;
    const sway=Math.sin(time*2.15)*1.2*(1-p*.5);
    const phase=time*3.0;
    ctx.save();ctx.translate(W/2,H/2);ctx.scale(depth,depth);ctx.translate(-W/2,-H/2);
    drawBusinessman(602+sway,y,0.92,0,phase);
    drawBusinessman(665-sway*.45,y+2,0.95,1,phase+Math.PI);
    ctx.restore();
  }

  function drawDust(time,p,s){
    if(!layers.atmosphere||s.dust<=0)return;
    ctx.save();ctx.globalCompositeOperation='screen';
    for(let i=0;i<56;i++){
      const z=(i%11)/10;
      const speed=.12+.34*z;
      const x=(i*173.7+time*26*speed)%W;
      const y=(i*91.3+time*10*(.4+z))%H;
      const r=.35+1.25*z;
      ctx.globalAlpha=(.018+.055*z)*s.dust*(.55+.45*p);
      ctx.fillStyle=i%3===0?'#ffd48a':'#e8a34b';
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();

    const glow=ctx.createRadialGradient(W*.5,H*.58,40,W*.5,H*.58,430);
    glow.addColorStop(0,'rgba(255,174,73,'+(0.09*s.dust)+')');
    glow.addColorStop(.45,'rgba(255,142,44,'+(0.035*s.dust)+')');
    glow.addColorStop(1,'rgba(255,120,30,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
  }

  function drawTitle(time,s){
    if(!layers.title)return;
    const p1=smooth((time-s.titleStart)/Math.max(.12,s.titleDuration*.62));
    const p2=smooth((time-(s.titleStart+.13))/Math.max(.12,s.titleDuration*.72));
    if(p1<=0&&p2<=0)return;

    const cx=W/2;
    const topY=293,bottomY=390;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='900 '+Math.round(s.titleSize*1.02)+'px Arial Black, Impact, sans-serif';

    if(p1>0){
      ctx.save();ctx.globalAlpha=p1;
      const y=topY+(1-p1)*18;
      ctx.shadowColor='rgba(105,48,0,'+(0.42*s.titleGlow)+')';ctx.shadowBlur=24*s.titleGlow;ctx.shadowOffsetY=4;
      ctx.fillStyle=s.topColor;
      ctx.fillText(s.topText,cx,y);
      ctx.globalCompositeOperation='screen';ctx.globalAlpha=.20*p1*s.titleGlow;
      ctx.fillStyle='#fff2a4';ctx.fillText(s.topText,cx,y-1);
      ctx.restore();
    }

    ctx.font='900 '+Math.round(s.titleSize*.90)+'px Arial Black, Impact, sans-serif';
    if(p2>0){
      ctx.save();ctx.globalAlpha=p2;
      const y=bottomY+(1-p2)*20;
      ctx.shadowColor='rgba(91,55,20,'+(0.28*s.titleGlow)+')';ctx.shadowBlur=18*s.titleGlow;ctx.shadowOffsetY=4;
      ctx.fillStyle=s.bottomColor;ctx.fillText(s.bottomText,cx,y);
      ctx.globalCompositeOperation='screen';ctx.globalAlpha=.13*p2*s.titleGlow;
      ctx.fillStyle='#fff7de';ctx.fillText(s.bottomText,cx,y-1);
      ctx.restore();
    }
  }

  function render(time){
    if(!ready)return;
    t=clamp(time,0,D);
    const s=settings();
    ctx.setTransform(DPR,0,0,DPR,0,0);
    ctx.fillStyle='#070808';ctx.fillRect(0,0,W,H);

    const p=smoother(t/Math.max(.2,s.flyDuration));
    const settleStart=Math.max(.05,s.flyDuration-.24);
    const settle=smooth((t-settleStart)/.38);
    const overshoot=(t<settleStart?0:Math.sin(clamp((t-settleStart)/.38,0,1)*Math.PI)*.014);

    // Deep plane: slowest. The image moves upward while scaling forward, producing the
    // downward/forward camera glide described in the reference choreography.
    const bgScale=1.03+s.push*.092*p+overshoot;
    const bgY=-8-s.glide*p;
    const bgX=-3*p;
    if(layers.background){
      drawPlane(images.corridor,bgX,bgY,bgScale,1);
      ctx.save();ctx.globalCompositeOperation='screen';
      const warm=ctx.createRadialGradient(W*.50,H*.60,80,W*.50,H*.60,520);
      warm.addColorStop(0,'rgba(255,183,79,.27)');warm.addColorStop(.45,'rgba(255,132,38,.10)');warm.addColorStop(1,'rgba(255,110,24,0)');
      ctx.fillStyle=warm;ctx.fillRect(0,0,W,H);ctx.restore();
      ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.16;ctx.fillStyle='#2b160d';ctx.fillRect(0,0,W,H);ctx.restore();
    }

    // Mid-depth side architecture: same physical corridor, isolated by viewport clips so
    // perspective remains coherent but the side structure travels faster than the vanishing point.
    if(layers.foreground){
      const d=s.depth;
      clipPlane(images.corridor,{x:0,y:0,w:390,h:H},-18*d*p,-14-s.glide*1.18*p,1.045+s.push*.125*p,0.95,0.35+1.1*p);
      clipPlane(images.corridor,{x:890,y:0,w:390,h:H},18*d*p,-14-s.glide*1.20*p,1.045+s.push*.13*p,0.95,0.35+1.1*p);


    }

    // Separate photographic floor-shadow and human depth planes.
    if(layers.shadows)drawPhotographicShadows(t,p,s);
    if(layers.people)drawPhotographicPeople(t,p,s);

    // Near foreground architecture is rendered AFTER the people so it can genuinely pass
    // in front of them during the forward/downward camera glide.
    if(layers.foreground){
      const d=s.depth;
      clipPlane(images.corridor,{x:0,y:0,w:215,h:H},-48*d*p,-34-s.glide*1.72*p,1.10+s.push*.205*p,0.90,1.3+1.9*p);
      clipPlane(images.corridor,{x:1090,y:0,w:190,h:H},48*d*p,-34-s.glide*1.76*p,1.10+s.push*.215*p,0.90,1.3+1.9*p);
      clipPlane(images.corridor,{x:0,y:0,w:W,h:120},0,-58-s.glide*1.78*p,1.09+s.push*.19*p,0.72,1.5+2.0*p);
    }

    drawPhotographicAtmosphere(t,p,s);
    drawDust(t,p,s);

    // Subtle lens vignette strengthens the depth tunnel without obscuring the architecture.
    const vig=ctx.createRadialGradient(W*.5,H*.51,210,W*.5,H*.51,760);
    vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,.34)');
    ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);

    drawTitle(t,s);

    $('scrub').value=t.toFixed(3);
    $('timecode').textContent=t.toFixed(2)+' / '+D.toFixed(2)+'s';
    let cap='Photographic cutouts travel on independent depth planes; residual fog clears downward while the corridor advances.';
    if(t>s.flyDuration-.05&&t<s.titleStart)cap='Camera settles after the 1.35s occlusion passage. Depth motion decelerates before typography enters.';
    if(t>=s.titleStart)cap='Editable two-line title resolves after the camera move, matching the reference beat.';
    $('caption').textContent=cap;
  }

  function loop(now){
    if(playing){
      const n=anchorT+(now-anchor)/1000;
      if(n>=D){t=D;playing=false;syncPlay();render(D);}
      else render(n);
    }
    requestAnimationFrame(loop);
  }
  function syncPlay(){
    $('play').textContent=playing?'Pause':'Play';
    $('playTop').textContent=playing?'Pause preview':'Play preview';
  }
  function togglePlay(){
    playing=!playing;anchor=performance.now();anchorT=t;
    if(playing&&t>=D){t=0;anchorT=0;}
    syncPlay();render(t);
  }
  function restart(){playing=true;t=0;anchor=performance.now();anchorT=0;syncPlay();render(0);}

  $('play').addEventListener('click',togglePlay);
  $('playTop').addEventListener('click',togglePlay);
  $('restart').addEventListener('click',restart);
  $('scrub').addEventListener('input',e=>{playing=false;syncPlay();t=Number(e.target.value);anchorT=t;anchor=performance.now();render(t);});
  document.querySelectorAll('[data-layer]').forEach(el=>el.addEventListener('change',()=>{layers[el.dataset.layer]=el.checked;render(t);}));
  document.querySelectorAll('input[type=range], input[type=text], input[type=color]').forEach(el=>el.addEventListener('input',()=>render(t)));

  const outs={
    flyDuration:['flyDurationOut',v=>v.toFixed(2)+'s'],
    pushStrength:['pushStrengthOut',v=>Math.round(v)+'%'],
    glideStrength:['glideStrengthOut',v=>Math.round(v)+'px'],
    depthStrength:['depthStrengthOut',v=>Math.round(v)+'%'],
    peopleDepth:['peopleDepthOut',v=>Math.round(v)+'%'],
    shadowOpacity:['shadowOpacityOut',v=>Math.round(v)+'%'],
    titleStart:['titleStartOut',v=>v.toFixed(2)+'s'],
    titleDuration:['titleDurationOut',v=>v.toFixed(2)+'s'],
    titleSize:['titleSizeOut',v=>Math.round(v)+'px'],
    titleGlow:['titleGlowOut',v=>Math.round(v)+'%'],
    fogOpacity:['fogOpacityOut',v=>Math.round(v)+'%'],
    dustStrength:['dustStrengthOut',v=>Math.round(v)+'%']
  };
  Object.entries(outs).forEach(([id,[out,fmt]])=>{const fn=()=>$(out).textContent=fmt(val(id));$(id).addEventListener('input',fn);fn();});
})();