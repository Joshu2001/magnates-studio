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
  const layers={background:true,foreground:false,people:true,shadows:true,atmosphere:true,title:true};
  const corridorSrc='/assets/barry-sacramento-interior-flythrough/assets/corridor-clean.webp';
  const atlasSrc='assets/transition-atlas.webp';
  const atlasRects={
    // Exact alpha bounds inside the 576×576 transition atlas.
    manLeft:[26,5,81,207],
    manRight:[176,10,87,199],
    shadowLeft:[96,225,92,65],
    shadowRight:[95,306,120,58],
    fog:[288,219,288,159],
    haze:[318,411,235,127]
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


  function drawAtlasSlice(key,sliceIndex,sliceCount,x,y,w,h,alpha=1,filter='none',blend='source-over'){
    const r=atlasRects[key];
    if(!r||!images.atlas||alpha<=0)return;
    const f0=sliceIndex/sliceCount,f1=(sliceIndex+1)/sliceCount;
    const sy=r[1]+r[3]*f0,sh=r[3]*(f1-f0);
    const dy=y+h*f0,dh=h*(f1-f0)+.65;
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.globalCompositeOperation=blend;
    ctx.filter=filter;
    ctx.drawImage(images.atlas,r[0],sy,r[2],sh,x,dy,w,dh);
    ctx.restore();
  }

  function figureMotion(time,entryStart,entryDuration,exitStart,exitDuration){
    const enter=smooth((time-entryStart)/Math.max(.08,entryDuration));
    const leave=smooth((time-exitStart)/Math.max(.08,exitDuration));
    return {
      enter,
      leave,
      alpha:clamp(enter*(1-leave),0,1),
      // Entrance deliberately uses the previous exit language in reverse:
      // a soft fade/settle from slightly enlarged and raised into the grounded pose.
      y:mix(-7,0,enter)+mix(0,-2,leave),
      scale:mix(1.016,1,enter)*mix(1,.994,leave),
      // Exit is now a separate leftward swipe with progressive breakup.
      x:mix(0,-58,leave)
    };
  }

  function figureStates(time){
    return {
      left:figureMotion(time,.58,.42,5.62,.38),
      right:figureMotion(time,1.02,.42,5.24,.38)
    };
  }

  function drawPhotographicShadows(time,p,s){
    const state=figureStates(time);
    const sc=1+s.peopleDepth*.082*p;
    const dy=-s.glide*.66*p;
    const micro=Math.sin(time*1.65)*.42*(1-p*.45);
    ctx.save();
    ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
    ctx.translate(0,dy);

    function shadow(key,cx,baseY,baseW,baseH,st,microX,opacity){
      if(st.alpha<=.002)return;
      const w=baseW*st.scale,h=baseH*st.scale;
      // Shadow follows the person, but with reduced lateral travel so it remains floor-anchored.
      const x=cx-w/2+microX+st.x*.58;
      const y=baseY+st.y;
      const a=st.alpha*s.shadowOpacity*opacity;
      drawAtlas(key,x,y,w,h,a,'blur(1.0px)','multiply');

      // Soft floor smear during the left-swipe exit.
      if(st.leave>.01){
        const q=st.leave;
        drawAtlas(key,x-10*q,y,w,h,a*(1-q)*.22,'blur(2.2px)','multiply');
        drawAtlas(key,x-22*q,y,w,h,a*(1-q)*.10,'blur(3.8px)','multiply');
      }
    }

    shadow('shadowLeft',606,606,122,78,state.left,micro*.18,.52);
    shadow('shadowRight',691,599,138,68,state.right,-micro*.08,.48);
    ctx.restore();
  }

  function drawPhotographicPeople(time,p,s){
    const state=figureStates(time);
    const sc=1+s.peopleDepth*.082*p;
    const dy=-s.glide*.66*p;
    const micro=Math.sin(time*1.65)*.42*(1-p*.45);
    ctx.save();
    ctx.translate(W/2,H/2);ctx.scale(sc,sc);ctx.translate(-W/2,-H/2);
    ctx.translate(0,dy);

    function figure(key,baseX,baseY,baseW,baseH,st,microX){
      if(st.alpha<=.002)return;
      const w=baseW*st.scale,h=baseH*st.scale;
      const x=baseX+microX+st.x+(baseW-w)/2;
      const y=baseY+st.y+(baseH-h);

      // Main body. Entrance is the old fade/settle motion reversed into place.
      drawAtlas(key,x,y,w,h,st.alpha,'none','source-over');

      if(st.leave>.01){
        const q=st.leave;

        // Broad leftward ghosting gives the swipe direction before the body fragments.
        drawAtlas(key,x-14*q,y,w,h,st.alpha*(1-q)*.18,'blur(2.0px)','screen');
        drawAtlas(key,x-30*q,y,w,h,st.alpha*(1-q)*.08,'blur(4.5px)','screen');

        // Horizontal bands progressively shear farther left to create dissipation rather
        // than a single rigid translation. Deterministic offsets avoid frame-to-frame noise.
        const bands=11;
        for(let i=0;i<bands;i++){
          const seed=(Math.sin((i+1)*12.9898)*43758.5453)%1;
          const jitter=Math.abs(seed);
          const phase=clamp((q-i*.018)/.82,0,1);
          if(phase<=0)continue;
          const extra=(10+24*jitter)*phase;
          const bandAlpha=st.alpha*(.12+.10*(1-phase))*(1-q*.72);
          drawAtlasSlice(
            key,i,bands,
            x-extra,y,w,h,
            bandAlpha,
            'blur('+(1.1+2.6*phase)+'px)',
            'screen'
          );
        }
      }
    }

    figure('manLeft',558,407,82,210,state.left,micro);
    figure('manRight',642,419,83,190,state.right,-micro*.28);
    ctx.restore();
  }

  function drawPhotographicAtmosphere(time,p,s){
    if(!layers.atmosphere||!images.atlas)return;

    // Residual interior haze remains behind the foreground architecture after the transition.
    const hazeDrift=Math.sin(time*.42)*7;
    drawAtlas('haze',-80+hazeDrift,-20,W+160,H+60,.28*s.fogOpacity,'blur(1.2px)','screen');

    // The incoming scene starts already behind a near-lens fog plane. During the first
    // three seconds the fog sweeps DOWN and clears. The master sequence supplies the
    // preceding upward rise, giving the same rise → full occlusion → downward release
    // used by the established spatial-occlusion / Alcatraz-style passage.
    const q=smooth(time/3.00);
    const y=-H*.18 + q*H*1.28;
    const a=Math.pow(1-q,.72)*.88*s.fogOpacity;
    if(a>.003){
      drawAtlas('fog',-150,y,W+300,H*.82,a,'blur('+(2.4+7.5*(1-q))+'px)','screen');
      drawAtlas('fog',-250,y-92,W+500,H*.98,a*.52,'blur('+(7+9*(1-q))+'px)','source-over');
    }
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

    // Clean corridor is rendered exactly once as a coherent camera plane.
    // No rectangular re-sampling of the same background is allowed.

    // Separate photographic floor-shadow and human depth planes.
    if(layers.shadows)drawPhotographicShadows(t,p,s);
    if(layers.people)drawPhotographicPeople(t,p,s);

    // No synthetic corridor slices are drawn over the photographic people.
    // Only genuine independent layers remain above the clean background.

    drawPhotographicAtmosphere(t,p,s);
    drawDust(t,p,s);

    // Subtle lens vignette strengthens the depth tunnel without obscuring the architecture.
    const vig=ctx.createRadialGradient(W*.5,H*.51,210,W*.5,H*.51,760);
    vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,.34)');
    ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);

    drawTitle(t,s);

    $('scrub').value=t.toFixed(3);
    $('timecode').textContent=t.toFixed(2)+' / '+D.toFixed(2)+'s';
    let cap='Clean corridor plate appears first; no people are baked into the room.';
    if(t>=.58&&t<1.44)cap='Cutouts enter one after another using the soft fade-and-settle motion, with grounded shadows.';
    if(t>=1.44&&t<s.titleStart)cap='Both figures hold naturally while the camera continues its forward/downward glide.';
    if(t>=s.titleStart&&t<5.24)cap='Editable title resolves independently above the live cutout composition.';
    if(t>=5.24)cap='Figures swipe left and dissipate in reverse order; their shadows leave with them and the clean room remains.';
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