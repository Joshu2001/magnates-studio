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

  function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Could not load '+src));im.src=src;});}
  Promise.all([
    loadImage(corridorSrc).then(im=>images.corridor=im),
    loadImage('data:image/webp;base64,'+(window.BARRY_INTERIOR_PEOPLE2||'')).then(im=>images.people=im),
    loadImage('data:image/webp;base64,'+(window.BARRY_INTERIOR_SHADOWS2||'')).then(im=>images.shadows=im)
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
    if(layers.background)drawPlane(images.corridor,bgX,bgY,bgScale,1);

    // Mid-depth side architecture: same physical corridor, isolated by viewport clips so
    // perspective remains coherent but the side structure travels faster than the vanishing point.
    if(layers.foreground){
      const d=s.depth;
      clipPlane(images.corridor,{x:0,y:0,w:390,h:H},-18*d*p,-14-s.glide*1.18*p,1.045+s.push*.125*p,0.95,0.35+1.1*p);
      clipPlane(images.corridor,{x:890,y:0,w:390,h:H},18*d*p,-14-s.glide*1.20*p,1.045+s.push*.13*p,0.95,0.35+1.1*p);

      // Near occluders rush past the lens. These are not separate invented objects: they
      // are clipped from the exact corridor plate to maintain structural continuity.
      clipPlane(images.corridor,{x:0,y:0,w:235,h:H},-42*d*p,-30-s.glide*1.62*p,1.09+s.push*.19*p,0.92,1.2+1.8*p);
      clipPlane(images.corridor,{x:1080,y:0,w:200,h:H},42*d*p,-30-s.glide*1.68*p,1.09+s.push*.205*p,0.92,1.2+1.8*p);
      clipPlane(images.corridor,{x:0,y:0,w:W,h:145},0,-54-s.glide*1.74*p,1.08+s.push*.18*p,0.78,1.4+2.0*p);
    }

    // People and their shadows form separate planes. Shadows move slightly less, keeping them
    // anchored to the floor while the figures sit one depth step closer to camera.
    if(layers.shadows){
      const sc=1+s.peopleDepth*.075*p;
      ctx.save();ctx.globalAlpha=s.shadowOpacity*(.88+.12*p);
      ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
      ctx.drawImage(images.shadows,-2*p,-s.glide*.72*p,W,H);ctx.restore();
    }
    if(layers.people){
      const sc=1+s.peopleDepth*.115*p;
      const sway=Math.sin(t*2.2)*1.1*(1-p*.45);
      ctx.save();ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
      ctx.drawImage(images.people,sway,-s.glide*.92*p,W,H);ctx.restore();
    }

    drawDust(t,p,s);

    // Subtle lens vignette strengthens the depth tunnel without obscuring the architecture.
    const vig=ctx.createRadialGradient(W*.5,H*.51,210,W*.5,H*.51,760);
    vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,.34)');
    ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);

    drawTitle(t,s);

    $('scrub').value=t.toFixed(3);
    $('timecode').textContent=t.toFixed(2)+' / '+D.toFixed(2)+'s';
    let cap='2.5D fly-through: foreground architecture travels fastest; vanishing point stays stable.';
    if(t>s.flyDuration-.05&&t<s.titleStart)cap='Camera settles. Depth motion decelerates before typography enters.';
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
    dustStrength:['dustStrengthOut',v=>Math.round(v)+'%']
  };
  Object.entries(outs).forEach(([id,[out,fmt]])=>{const fn=()=>$(out).textContent=fmt(val(id));$(id).addEventListener('input',fn);fn();});
})();