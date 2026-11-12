(()=>{
'use strict';
const W=1280,H=720,D=9;
const $=id=>document.getElementById(id);
const ctx=$('stage').getContext('2d',{alpha:false});
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const smoother=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
const mix=(a,b,t)=>a+(b-a)*t;
const easeOut=x=>1-Math.pow(1-clamp(x),3);

const images={};
const sources={
  barryBg:'assets/barry-bg.webp',
  barryPerson:'assets/barry-person.webp',
  contractBg:'assets/contract-bg.webp',
  contractHero:'assets/contract-hero.webp',
  wallBg:'assets/wall-bg.webp'
};
Object.entries(sources).forEach(([k,src])=>{const im=new Image();im.src=src;images[k]=im;});

let t=0,playing=false,last=performance.now(),anchor=0,anchorT=0,soundOn=true;
let audioCtx=null,masterGain=null,cues={last:0,hit:new Set()};

function fit(im,scale=1,dx=0,dy=0,alpha=1){
  if(!im||!im.complete||im.naturalWidth<2)return;
  const s=Math.max(W/im.naturalWidth,H/im.naturalHeight)*scale;
  const w=im.naturalWidth*s,h=im.naturalHeight*s;
  ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(im,(W-w)/2+dx,(H-h)/2+dy,w,h);ctx.restore();
}
function drawImg(im,x,y,w,h,alpha=1,rot=0,blend='source-over',filter='none'){
  if(!im||!im.complete||im.naturalWidth<2||alpha<=.001)return;
  ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation=blend;ctx.filter=filter;
  ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
}
function flash(a,warm=false){
  if(a<=.001)return;ctx.save();ctx.globalAlpha=a;ctx.fillStyle=warm?'#ffd38a':'#fff';ctx.fillRect(0,0,W,H);ctx.restore();
}
function vignette(a=.45){
  const g=ctx.createRadialGradient(W*.5,H*.48,160,W*.5,H*.48,760);
  g.addColorStop(.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+a+')');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
}
function dust(time,strength=.25){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<70;i++){
    const seed=Math.sin(i*12.9898+78.233)*43758.5453;
    const r=seed-Math.floor(seed),r2=(seed*1.618)-Math.floor(seed*1.618);
    const x=(r*W+time*(8+12*r2))%W,y=(r2*H+Math.sin(time*.7+i)*12)%H;
    const a=(.05+.12*r)*strength;ctx.fillStyle='rgba(255,194,106,'+a+')';ctx.beginPath();ctx.arc(x,y,.5+1.6*r,0,Math.PI*2);ctx.fill();
  }ctx.restore();
}
function beam(time,alpha=.35){
  const sweep=(Math.sin(time*.9)*.5+.5);
  const x=mix(250,860,sweep);
  ctx.save();ctx.globalCompositeOperation='screen';ctx.translate(x,0);ctx.rotate(-.42);
  const g=ctx.createLinearGradient(-70,0,220,0);g.addColorStop(0,'rgba(255,231,185,0)');g.addColorStop(.38,'rgba(255,197,105,'+alpha+')');g.addColorStop(1,'rgba(255,160,50,0)');
  ctx.fillStyle=g;ctx.fillRect(-90,-80,360,920);ctx.restore();
}
function titleText(line1,line2,y,alpha,scale=1,underline=false){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(W/2,y);ctx.scale(scale,scale);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 104px Impact, Arial Black, sans-serif';
  ctx.shadowBlur=18;ctx.shadowColor='rgba(255,170,40,.46)';
  const grad=ctx.createLinearGradient(-420,0,420,0);grad.addColorStop(0,'#d99100');grad.addColorStop(.48,'#ffd21c');grad.addColorStop(.5,'#f4ebd0');grad.addColorStop(1,'#fff4d8');
  ctx.fillStyle=grad;ctx.fillText(line1,0,-55);
  if(line2){ctx.font='900 100px Impact, Arial Black, sans-serif';ctx.fillStyle='#fff0cf';ctx.fillText(line2,0,52);}
  if(underline){ctx.strokeStyle='#e12219';ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-330,118);ctx.quadraticCurveTo(0,98,360,116);ctx.stroke();}
  ctx.restore();
}
function barryBeat(local){
  const p=clamp(local/3);
  const settle=smoother(clamp(local/.9));
  fit(images.barryBg,1.065-.045*settle,0,8-8*settle,1);
  beam(local,.22+.16*Math.sin(Math.PI*clamp(local/1.8)));
  dust(local,.8);
  const enter=smoother(clamp((local-.16)/.8));
  const personScale=mix(1.12,1,enter);
  const pw=510*personScale,ph=765*personScale;
  drawImg(images.barryPerson,W/2-pw/2,14+(1-enter)*18,pw,ph,enter,0,'source-over','drop-shadow(0 22px 28px rgba(0,0,0,.38))');
  const facePass=smooth(clamp((local-.65)/.55))*(1-smooth(clamp((local-1.45)/.6)));
  if(facePass>0){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createLinearGradient(390,0,840,0);g.addColorStop(0,'rgba(255,220,150,0)');g.addColorStop(.5,'rgba(255,235,190,'+(.28*facePass)+')');g.addColorStop(1,'rgba(255,220,150,0)');ctx.fillStyle=g;ctx.fillRect(380,80,500,390);ctx.restore();}
  const ta=smoother(clamp((local-1.0)/.55));
  titleText('BARRY MINKOW','',535,ta,mix(.88,1,ta));
  flash((1-smooth(clamp(local/.18)))*.95,false);
  flash(smooth(clamp((local-2.76)/.18))*.92,false);
  vignette(.42);
}
function contractBeat(local){
  const p=clamp(local/3);
  fit(images.contractBg,1.12-.10*smoother(p),0,0,1);
  dust(local+3,.35);
  const enter=easeOut(clamp((local-.10)/.72));
  const wob=(1-enter)*-.08+Math.sin(local*3.2)*.004;
  const hw=mix(520,720,enter),hh=hw*.75;
  for(let k=3;k>=1;k--){
    const dup=smoother(clamp((local-1.18-k*.09)/.55));
    if(dup>0){
      const dir=k%2?1:-1;
      drawImg(images.contractHero,W/2-hw/2+dir*(90+60*k)*dup,95+(k-1)*20*dup,hw*.78,hh*.78,.22*(1-dup*.25),dir*.05*dup,'screen','blur(1px)');
    }
  }
  drawImg(images.contractHero,W/2-hw/2,72+(1-enter)*52,hw,hh,enter,wob,'source-over','drop-shadow(0 24px 30px rgba(0,0,0,.5))');
  const ta=smoother(clamp((local-1.18)/.5));
  titleText('$7 MILLION','CONTRACT',545,ta,mix(.9,1,ta));
  flash((1-smooth(clamp(local/.12)))*.72,true);
  for(let i=0;i<4;i++){const q=smooth(clamp((local-(.18+i*.22))/.05))*(1-smooth(clamp((local-(.23+i*.22))/.06)));flash(q*.24,true);}
  vignette(.5);
}
function warningSweep(local){
  const q=(local*.72)%2.2;
  ctx.save();ctx.globalCompositeOperation='screen';
  const x=-420+q*900;ctx.translate(x,0);ctx.rotate(-.48);
  const g=ctx.createLinearGradient(0,0,330,0);g.addColorStop(0,'rgba(255,0,0,0)');g.addColorStop(.46,'rgba(255,0,0,.30)');g.addColorStop(.62,'rgba(255,38,0,.55)');g.addColorStop(1,'rgba(255,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(0,-260,360,1280);ctx.restore();
}
function wallBeat(local){
  const p=smoother(clamp(local/3));
  fit(images.wallBg,1.13-.15*p,0,0,1);
  warningSweep(local);warningSweep(local+1.15);
  const spread=smooth(clamp((local-.62)/1.55));
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(180,0,0,'+(.13+.18*spread)+')';
  ctx.beginPath();ctx.moveTo(0,80);ctx.lineTo(520,0);ctx.lineTo(980,720);ctx.lineTo(340,720);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(1280,30);ctx.lineTo(870,180);ctx.lineTo(1180,720);ctx.lineTo(1280,720);ctx.closePath();ctx.fill();ctx.restore();
  const ta=smoother(clamp((local-.58)/.42));
  titleText('NO WORK','WAS DONE',370,ta,mix(.88,1,ta),true);
  flash((1-smooth(clamp(local/.10)))*.45,false);
  vignette(.56);
}
function render(time){
  t=clamp(time,0,D);
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#050505';ctx.fillRect(0,0,W,H);
  if(t<3){barryBeat(t);$('caption').textContent='Barry Minkow resolves from a white flash; a moving spotlight crosses his face and his name locks on.';}
  else if(t<6){contractBeat(t-3);$('caption').textContent='The $7 million restoration contract snaps forward, duplicates outward, and resolves into a financial-document grid.';}
  else {wallBeat(t-6);$('caption').textContent='The camera pulls back across an evidence wall while red warning sweeps spread and NO WORK WAS DONE lands with a deep impact.';}
  $('scrub').value=t.toFixed(2);$('clock').textContent=t.toFixed(2)+' / 9.00s';
  syncAudio(t,playing);
}

function getAudio(){
  if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC();masterGain=audioCtx.createGain();masterGain.gain.value=soundOn?1:0;masterGain.connect(audioCtx.destination);}
  if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx;
}
function noise(ctx,d=.2){const b=ctx.createBuffer(1,ctx.sampleRate*d,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;return b;}
function impact(freq=58,level=.22,d=.45){if(!soundOn)return;const c=getAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(28,freq*.55),c.currentTime+d);g.gain.setValueAtTime(level,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g);g.connect(masterGain);o.start();o.stop(c.currentTime+d);}
function paperFlick(level=.08){if(!soundOn)return;const c=getAudio();if(!c)return;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noise(c,.09);f.type='highpass';f.frequency.value=1100;g.gain.setValueAtTime(level,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.09);s.connect(f);f.connect(g);g.connect(masterGain);s.start();}
function metallic(){if(!soundOn)return;const c=getAudio();if(!c)return;[520,780,1180].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.06/(i+1),c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.36);o.connect(g);g.connect(masterGain);o.start();o.stop(c.currentTime+.37);});}
function syncAudio(time,isPlaying){
  if(!isPlaying){cues.last=time;return;}
  const events=[
    [0.05,'b0',()=>impact(46,.26,.55)],[1.08,'metal',metallic],
    [3.05,'p0',()=>paperFlick(.12)],[3.28,'p1',()=>paperFlick(.10)],[3.52,'p2',()=>paperFlick(.10)],[3.82,'p3',()=>paperFlick(.09)],
    [4.25,'c0',()=>paperFlick(.07)],[4.55,'c1',()=>paperFlick(.07)],[4.85,'c2',()=>paperFlick(.07)],[5.15,'c3',()=>paperFlick(.07)],
    [6.08,'n0',()=>impact(72,.12,.18)],[6.36,'n1',()=>paperFlick(.08)],[6.62,'n2',()=>paperFlick(.08)],[6.88,'n3',()=>paperFlick(.08)],[7.14,'n4',()=>paperFlick(.08)],
    [7.70,'sting',()=>impact(50,.16,.70)],[8.42,'deep',()=>impact(34,.32,.72)]
  ];
  if(time<cues.last-.15)cues.hit.clear();
  for(const [at,id,fn] of events){if(cues.last<at&&time>=at&&!cues.hit.has(id)){cues.hit.add(id);fn();}}
  cues.last=time;
}
function setSound(v){soundOn=!!v;if(masterGain)masterGain.gain.value=soundOn?1:0;$('sound').textContent=soundOn?'🔊 Sound On':'🔇 Sound Off';}

function toggle(){playing=!playing;if(playing&&t>=D)t=0;anchor=performance.now();anchorT=t;if(playing)getAudio();$('play').textContent=playing?'Pause':'Play';$('playTop').textContent=playing?'Pause preview':'Play preview';}
$('play').onclick=toggle;$('playTop').onclick=toggle;
$('restart').onclick=()=>{playing=false;t=0;cues={last:0,hit:new Set()};$('play').textContent='Play';$('playTop').textContent='Play preview';render(0);};
$('scrub').oninput=e=>{playing=false;t=Number(e.target.value);cues.last=t;cues.hit.clear();$('play').textContent='Play';$('playTop').textContent='Play preview';render(t);};
$('sound').onclick=()=>setSound(!soundOn);
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.pane').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active');});
function loop(now){if(playing){t=anchorT+(now-anchor)/1000;if(t>=D){t=D;playing=false;$('play').textContent='Play';$('playTop').textContent='Play preview';}}render(t);requestAnimationFrame(loop);}
render(0);requestAnimationFrame(loop);
})();