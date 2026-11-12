(()=>{
'use strict';
const W=1280,H=720,D=17;
const $=id=>document.getElementById(id);
const canvas=$('stage');
if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:false});
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const smoother=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
const mix=(a,b,t)=>a+(b-a)*t;
const easeOut=x=>1-Math.pow(1-clamp(x),3);
const frac=x=>x-Math.floor(x);
const hash=n=>frac(Math.sin(n*12.9898+78.233)*43758.5453123);

const images={};
const sources={
  barryBg:'assets/barry-bg.webp',
  barryPerson:'assets/barry-person.webp',
  contractBg:'assets/contract-bg.webp',
  contractHero:'assets/contract-hero.webp',
  wallBg:'assets/wall-bg.webp'
};
Object.entries(sources).forEach(([k,src])=>{const im=new Image();im.src=src;images[k]=im;});

let t=0,playing=false,anchor=0,anchorT=0,soundOn=true;
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
  const g=ctx.createRadialGradient(W*.5,H*.48,150,W*.5,H*.48,760);
  g.addColorStop(.42,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+a+')');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
}
function dust(time,strength=.25){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<70;i++){
    const r=hash(i),r2=hash(i+33.1);
    const x=(r*W+time*(8+12*r2))%W,y=(r2*H+Math.sin(time*.7+i)*12+H)%H;
    const a=(.05+.12*r)*strength;ctx.fillStyle='rgba(255,194,106,'+a+')';ctx.beginPath();ctx.arc(x,y,.5+1.6*r,0,Math.PI*2);ctx.fill();
  }ctx.restore();
}
function beam(time,alpha=.35){
  const sweep=(Math.sin(time*.9)*.5+.5),x=mix(250,860,sweep);
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
  const settle=smoother(clamp(local/.9));
  fit(images.barryBg,1.065-.045*settle,0,8-8*settle,1);
  beam(local,.22+.16*Math.sin(Math.PI*clamp(local/1.8)));dust(local,.8);
  const enter=smoother(clamp((local-.16)/.8)),personScale=mix(1.12,1,enter),pw=510*personScale,ph=765*personScale;
  drawImg(images.barryPerson,W/2-pw/2,14+(1-enter)*18,pw,ph,enter,0,'source-over','drop-shadow(0 22px 28px rgba(0,0,0,.38))');
  const facePass=smooth(clamp((local-.65)/.55))*(1-smooth(clamp((local-1.45)/.6)));
  if(facePass>0){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createLinearGradient(390,0,840,0);g.addColorStop(0,'rgba(255,220,150,0)');g.addColorStop(.5,'rgba(255,235,190,'+(.28*facePass)+')');g.addColorStop(1,'rgba(255,220,150,0)');ctx.fillStyle=g;ctx.fillRect(380,80,500,390);ctx.restore();}
  const ta=smoother(clamp((local-1.0)/.55));titleText('BARRY MINKOW','',535,ta,mix(.88,1,ta));
  flash((1-smooth(clamp(local/.18)))*.95,false);flash(smooth(clamp((local-2.76)/.18))*.92,false);vignette(.42);
}
function contractBeat(local){
  const p=clamp(local/3);fit(images.contractBg,1.12-.10*smoother(p),0,0,1);dust(local+3,.35);
  const enter=easeOut(clamp((local-.10)/.72)),wob=(1-enter)*-.08+Math.sin(local*3.2)*.004,hw=mix(520,720,enter),hh=hw*.75;
  for(let k=3;k>=1;k--){const dup=smoother(clamp((local-1.18-k*.09)/.55));if(dup>0){const dir=k%2?1:-1;drawImg(images.contractHero,W/2-hw/2+dir*(90+60*k)*dup,95+(k-1)*20*dup,hw*.78,hh*.78,.22*(1-dup*.25),dir*.05*dup,'screen','blur(1px)');}}
  drawImg(images.contractHero,W/2-hw/2,72+(1-enter)*52,hw,hh,enter,wob,'source-over','drop-shadow(0 24px 30px rgba(0,0,0,.5))');
  const ta=smoother(clamp((local-1.18)/.5));titleText('$7 MILLION','CONTRACT',545,ta,mix(.9,1,ta));flash((1-smooth(clamp(local/.12)))*.72,true);
  for(let i=0;i<4;i++){const q=smooth(clamp((local-(.18+i*.22))/.05))*(1-smooth(clamp((local-(.23+i*.22))/.06)));flash(q*.24,true);}vignette(.5);
}
function warningSweep(local){
  const q=(local*.72)%2.2;ctx.save();ctx.globalCompositeOperation='screen';const x=-420+q*900;ctx.translate(x,0);ctx.rotate(-.48);
  const g=ctx.createLinearGradient(0,0,330,0);g.addColorStop(0,'rgba(255,0,0,0)');g.addColorStop(.46,'rgba(255,0,0,.30)');g.addColorStop(.62,'rgba(255,38,0,.55)');g.addColorStop(1,'rgba(255,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,-260,360,1280);ctx.restore();
}
function wallBeat(local){
  const p=smoother(clamp(local/3));fit(images.wallBg,1.13-.15*p,0,0,1);warningSweep(local);warningSweep(local+1.15);
  const spread=smooth(clamp((local-.62)/1.55));ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(180,0,0,'+(.13+.18*spread)+')';
  ctx.beginPath();ctx.moveTo(0,80);ctx.lineTo(520,0);ctx.lineTo(980,720);ctx.lineTo(340,720);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(1280,30);ctx.lineTo(870,180);ctx.lineTo(1180,720);ctx.lineTo(1280,720);ctx.closePath();ctx.fill();ctx.restore();
  const ta=smoother(clamp((local-.58)/.42));titleText('NO WORK','WAS DONE',370,ta,mix(.88,1,ta),true);flash((1-smooth(clamp(local/.10)))*.45,false);vignette(.56);
}

function redAtmosphere(time,zoom=1,grid=false){
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);
  const bg=ctx.createRadialGradient(W*.52,H*.48,40,W*.52,H*.48,760);bg.addColorStop(0,'#4a0908');bg.addColorStop(.42,'#260606');bg.addColorStop(1,'#080203');ctx.fillStyle=bg;ctx.fillRect(-80,-50,W+160,H+100);
  ctx.globalCompositeOperation='screen';
  for(let i=0;i<12;i++){
    const r=hash(i+12),r2=hash(i+91),x=r*W,y=r2*H,rr=130+260*hash(i+17),pulse=.50+.30*Math.sin(time*.9+i*1.7);
    const g=ctx.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,'rgba(255,38,12,'+(.10*pulse)+')');g.addColorStop(.42,'rgba(210,0,0,'+(.08*pulse)+')');g.addColorStop(1,'rgba(40,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-rr,y-rr,rr*2,rr*2);
  }
  ctx.globalCompositeOperation='source-over';
  if(grid){ctx.save();ctx.globalAlpha=.24;ctx.strokeStyle='#b71918';ctx.lineWidth=1;const off=(time*8)%36;for(let x=-off;x<W+40;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=-off;y<H+40;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.restore();}
  ctx.restore();
}
function emberField(time,strength=1,radial=.35){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<145;i++){
    const a=hash(i+3.4)*Math.PI*2,base=40+hash(i+8)*700,speed=(18+100*hash(i+22))*radial;
    const rr=(base+time*speed)%760,x=W/2+Math.cos(a)*rr*1.18,y=H/2+Math.sin(a)*rr*.72;
    const size=.4+3.6*Math.pow(hash(i+44),3),alpha=(.10+.55*hash(i+66))*strength*(1-rr/900);
    ctx.fillStyle='rgba(255,'+(70+Math.floor(hash(i+77)*130))+',18,'+alpha+')';ctx.shadowBlur=size*4;ctx.shadowColor='rgba(255,35,0,.6)';ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
  }ctx.restore();
}
function drawBill(x,y,s,rot,alpha=1,blur=0){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);if(blur)ctx.filter='blur('+blur+'px)';
  ctx.fillStyle='#d6c08a';ctx.strokeStyle='#7b6b3d';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-90,-38,180,76,5);ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(54,80,42,.85)';ctx.lineWidth=2;ctx.strokeRect(-80,-29,160,58);ctx.fillStyle='#40583b';ctx.font='900 17px Georgia';ctx.fillText('100',55,-15);ctx.fillText('100',-78,29);
  ctx.beginPath();ctx.ellipse(0,0,25,31,0,0,Math.PI*2);ctx.stroke();ctx.font='700 10px Georgia';ctx.fillText('$',-3,4);ctx.restore();
}
function drawPaper(x,y,w,h,rot,label,amount='',alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle='#c99870';ctx.strokeStyle='#6f4939';ctx.lineWidth=2;ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=15;ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2,-h/2,w,h);ctx.shadowBlur=0;
  ctx.fillStyle='#2a1914';ctx.textAlign='center';ctx.font='900 '+Math.max(14,w*.08)+'px Georgia';ctx.fillText(label,0,-h*.26);ctx.strokeStyle='rgba(50,24,20,.45)';ctx.lineWidth=1;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-w*.37,-h*.10+i*h*.11);ctx.lineTo(w*.37,-h*.10+i*h*.11);ctx.stroke();}
  if(amount){ctx.font='900 '+Math.max(18,w*.11)+'px Arial Black';ctx.fillText(amount,0,h*.28);}ctx.restore();
}
function drawWallStreetFacade(x,y,s,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#8b604b';ctx.fillRect(-170,-95,340,190);ctx.fillStyle='#53372f';ctx.beginPath();ctx.moveTo(-190,-95);ctx.lineTo(0,-160);ctx.lineTo(190,-95);ctx.closePath();ctx.fill();
  for(let i=0;i<6;i++){ctx.fillStyle='#a9785f';ctx.fillRect(-145+i*55,-80,20,155);ctx.fillStyle='rgba(255,190,125,.18)';ctx.fillRect(-141+i*55,-80,5,155);}ctx.fillStyle='#1d1514';ctx.font='900 30px Georgia';ctx.textAlign='center';ctx.fillText('WALL STREET',0,-112);ctx.restore();
}
function drawZZZZBuilding(x,y,s,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#9b7160';ctx.beginPath();ctx.roundRect(-170,-100,340,200,25);ctx.fill();ctx.fillStyle='#3d2c2b';for(let r=0;r<3;r++)for(let c=0;c<6;c++)ctx.fillRect(-145+c*49,-55+r*46,37,26);ctx.fillStyle='#1e1618';ctx.font='900 italic 35px Arial Black';ctx.textAlign='center';ctx.fillText('ZZZZ',45,-52);ctx.fillText('BEST',45,-18);ctx.restore();
}
function drawSkyline(y,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#170e11';for(let i=0;i<32;i++){const w=24+hash(i+8)*34,h=50+hash(i+19)*145,x=i*42-30;ctx.fillRect(x,y-h,w,h);ctx.fillStyle='rgba(255,150,55,.42)';for(let yy=y-h+12;yy<y-8;yy+=18)for(let xx=x+8;xx<x+w-6;xx+=14)if(hash(xx*yy*.01)>.52)ctx.fillRect(xx,yy,3,5);ctx.fillStyle='#170e11';}ctx.restore();
}
function diagonalHeadline(line1,line2,local){
  const a1=smoother(clamp((local-.55)/.55)),a2=smoother(clamp((local-1.15)/.70));
  ctx.save();ctx.translate(W/2,H/2+10);ctx.transform(1,0,-.12,1,0,0);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowBlur=22;ctx.shadowColor='rgba(255,70,0,.55)';
  ctx.globalAlpha=a1;ctx.font='900 100px Impact, Arial Black';let g=ctx.createLinearGradient(-500,0,500,0);g.addColorStop(0,'#ffb40a');g.addColorStop(.46,'#ffd938');g.addColorStop(.55,'#fff4d0');g.addColorStop(1,'#fff');ctx.fillStyle=g;ctx.fillText(line1,0,-50);
  ctx.globalAlpha=a2;ctx.font='900 86px Impact, Arial Black';ctx.fillStyle='#fff0d4';ctx.fillText(line2,0,48);ctx.restore();
  const shadow=smooth(clamp((local-.85)/1.25));ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.42*(1-shadow*.6);ctx.translate(-250+local*360,0);ctx.rotate(-.4);ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,-300,260,1300);ctx.restore();
}
function wallStreetBelievedBeat(local){
  const intro=smoother(clamp(local/.75)),zoom=mix(1.28,1.02,intro)+.015*Math.sin(local*2.2);redAtmosphere(local,zoom,false);emberField(local,1.15,.78);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);
  drawWallStreetFacade(170,120,.72,.82);
  drawPaper(985,105,330,165,-.10,'ZZZZ BEST CO.  INVOICE','$487,600',.94);
  drawPaper(1050,470,270,170,-.18,'FINANCIAL STATEMENT','+142.6%',.85);
  drawPaper(165,555,300,175,.17,'CONTRACT','APPROVED',.86);
  drawPaper(545,590,240,145,-.08,'EARNINGS REPORT','',.66);
  const depths=[.65,.9,1.12,.78,.56,.98,.72,.44];
  for(let i=0;i<8;i++){const d=depths[i],tt=local*(.5+d*.85),x=120+hash(i+10)*1040+Math.sin(tt+i)*80*d,y=70+hash(i+40)*560+Math.cos(tt*.9+i)*55*d,rot=(-.5+hash(i+70))*1.3+Math.sin(tt+i)*.18;drawBill(x,y,.42+.55*d,rot,.55+.42*d,d<.6?1.4:0);}
  ctx.restore();
  diagonalHeadline('AND YET...','WALL STREET BELIEVED IT',local);
  const pulse=(Math.sin(local*5.4)*.5+.5)*smooth(clamp((local-.3)/.5));ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(255,24,0,'+(.05+.08*pulse)+')';ctx.fillRect(0,0,W,H);ctx.restore();
  flash((1-smooth(clamp(local/.12)))*.28,true);vignette(.58);
}
function financialChart(local,alpha=1){
  const reveal=smoother(clamp((local-.25)/1.3));ctx.save();ctx.globalAlpha=alpha*reveal;ctx.strokeStyle='#ff201a';ctx.lineWidth=8;ctx.shadowBlur=20;ctx.shadowColor='#ff1a12';ctx.lineJoin='round';ctx.beginPath();
  const pts=[[60,310],[130,270],[185,170],[245,245],[330,215],[400,285],[480,330],[560,300],[630,350],[700,310],[780,225],[845,285],[910,195],[975,290],[1040,350],[1110,470],[1180,550]];
  const count=Math.max(2,Math.floor(pts.length*reveal));for(let i=0;i<count;i++){const p=pts[i];if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);}ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='rgba(230,25,25,.35)';
  for(let i=0;i<15;i++){const h=40+hash(i+32)*150;ctx.fillRect(85+i*70,535-h,34,h);}ctx.restore();
}
function valuationText(local){
  const a=smoother(clamp((local-.48)/.65)),b=smoother(clamp((local-.88)/.72));ctx.save();ctx.translate(W/2,350);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowBlur=22;ctx.shadowColor='rgba(255,145,0,.62)';ctx.globalAlpha=a;ctx.font='900 92px Impact, Arial Black';ctx.fillStyle='#fff0cf';ctx.fillText('OVER',0,-82);
  ctx.globalAlpha=b;ctx.font='900 156px Impact, Arial Black';const g=ctx.createLinearGradient(-500,0,500,0);g.addColorStop(0,'#d58b00');g.addColorStop(.4,'#ffc400');g.addColorStop(.62,'#ffe24c');g.addColorStop(1,'#bd6f00');ctx.fillStyle=g;ctx.fillText('$300 MILLION',0,65);ctx.restore();
  const glint=smooth(clamp((local-2.28)/.18))*(1-smooth(clamp((local-2.62)/.28)));if(glint>0){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.65*glint;ctx.translate(330+local*220,330);ctx.rotate(-.23);const gg=ctx.createLinearGradient(-50,0,50,0);gg.addColorStop(0,'rgba(255,255,255,0)');gg.addColorStop(.5,'rgba(255,244,190,.95)');gg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gg;ctx.fillRect(-50,-180,100,360);ctx.restore();}
}
function valuationBeat(local){
  const pull=smoother(clamp(local/2.2)),zoom=mix(1.15,.96,pull);redAtmosphere(local+2,zoom,true);financialChart(local,.72);emberField(local+3,.72,.22);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);
  drawWallStreetFacade(150,140,.62,.92);drawZZZZBuilding(985,135,.62,.90);drawSkyline(690,.88);
  const personA=smoother(clamp((local-.12)/.75));drawImg(images.barryPerson,455,-35,370,555,.88*personA,0,'source-over','sepia(.65) contrast(1.05) drop-shadow(0 14px 24px rgba(0,0,0,.45))');
  for(let i=0;i<7;i++){const d=.55+hash(i+7)*.7,x=80+hash(i+13)*1120+Math.sin(local*(.7+d)+i)*75,y=70+hash(i+23)*610+Math.cos(local*(.8+d)+i)*45;drawPaper(x,y,105*d,70*d,(-.35+hash(i+33)*.7)+Math.sin(local+i)*.08,'', '',.35+.35*d);}
  ctx.restore();
  const labels=['▼ −8.47%','▼ −12.93%','▼ −21.04%','▼ −37.68%'];ctx.save();ctx.textAlign='right';ctx.font='800 25px Arial';ctx.shadowBlur=10;ctx.shadowColor='#ff1a12';for(let i=0;i<labels.length;i++){ctx.globalAlpha=smoother(clamp((local-.75-i*.12)/.35));ctx.fillStyle='#ff2a22';ctx.fillText(labels[i],1215,65+i*42);}ctx.restore();
  valuationText(local);flash((1-smooth(clamp(local/.12)))*.24,true);vignette(.54);
}

function render(time){
  t=clamp(time,0,D);ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#050505';ctx.fillRect(0,0,W,H);
  let caption='';
  if(t<3){barryBeat(t);caption='Barry Minkow resolves from a white flash; a moving spotlight crosses his face and his name locks on.';}
  else if(t<6){contractBeat(t-3);caption='The $7 million restoration contract snaps forward, duplicates outward, and resolves into a financial-document grid.';}
  else if(t<9){wallBeat(t-6);caption='The camera pulls back across an evidence wall while red warning sweeps spread and NO WORK WAS DONE lands with a deep impact.';}
  else if(t<13){wallStreetBelievedBeat(t-9);caption='A violent red radial push opens into an ember-filled financial storm; bills and documents drift at independent depths while AND YET… WALL STREET BELIEVED IT emerges through moving shadows.';}
  else {valuationBeat(t-13);caption='The composition pulls farther out into a valuation tableau: Wall Street, ZZZZ Best, Barry, skyline and papers separate in depth while a red financial graph moves behind OVER $300 MILLION.';}
  if($('caption'))$('caption').textContent=caption;if($('scrub'))$('scrub').value=t.toFixed(2);if($('clock'))$('clock').textContent=t.toFixed(2)+' / '+D.toFixed(2)+'s';syncAudio(t,playing);
}

function getAudio(){if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC();masterGain=audioCtx.createGain();masterGain.gain.value=soundOn?1:0;masterGain.connect(audioCtx.destination);}if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx;}
function noise(c,d=.2){const b=c.createBuffer(1,c.sampleRate*d,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;return b;}
function impact(freq=58,level=.22,d=.45){if(!soundOn)return;const c=getAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(28,freq*.55),c.currentTime+d);g.gain.setValueAtTime(level,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g);g.connect(masterGain);o.start();o.stop(c.currentTime+d);}
function paperFlick(level=.08,d=.09){if(!soundOn)return;const c=getAudio();if(!c)return;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noise(c,d);f.type='highpass';f.frequency.value=1100;g.gain.setValueAtTime(level,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);s.connect(f);f.connect(g);g.connect(masterGain);s.start();}
function metallic(){if(!soundOn)return;const c=getAudio();if(!c)return;[520,780,1180].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.06/(i+1),c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.36);o.connect(g);g.connect(masterGain);o.start();o.stop(c.currentTime+.37);});}
function whoosh(level=.11,d=.65,reverse=false){if(!soundOn)return;const c=getAudio();if(!c)return;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noise(c,d);f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(reverse?500:1800,c.currentTime);f.frequency.exponentialRampToValueAtTime(reverse?2600:500,c.currentTime+d);g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(level,c.currentTime+d*.55);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);s.connect(f);f.connect(g);g.connect(masterGain);s.start();}
function tension(d=.9){if(!soundOn)return;const c=getAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(115,c.currentTime);o.frequency.exponentialRampToValueAtTime(260,c.currentTime+d);g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.045,c.currentTime+d*.72);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g);g.connect(masterGain);o.start();o.stop(c.currentTime+d);}
function syncAudio(time,isPlaying){
  if(!isPlaying){cues.last=time;return;}
  const events=[[.05,'b0',()=>impact(46,.26,.55)],[1.08,'metal',metallic],[3.05,'p0',()=>paperFlick(.12)],[3.28,'p1',()=>paperFlick(.10)],[3.52,'p2',()=>paperFlick(.10)],[3.82,'p3',()=>paperFlick(.09)],[4.25,'c0',()=>paperFlick(.07)],[4.55,'c1',()=>paperFlick(.07)],[4.85,'c2',()=>paperFlick(.07)],[5.15,'c3',()=>paperFlick(.07)],[6.08,'n0',()=>impact(72,.12,.18)],[6.36,'n1',()=>paperFlick(.08)],[6.62,'n2',()=>paperFlick(.08)],[6.88,'n3',()=>paperFlick(.08)],[7.14,'n4',()=>paperFlick(.08)],[7.70,'sting',()=>impact(50,.16,.70)],[8.42,'deep',()=>impact(34,.32,.72)],
  [9.03,'reverse',()=>whoosh(.17,.9,true)],[9.12,'bassPulse',()=>impact(44,.22,.62)],[9.40,'flutter0',()=>paperFlick(.09,.14)],[9.72,'flutter1',()=>paperFlick(.09,.13)],[10.08,'flutter2',()=>paperFlick(.08,.12)],[10.82,'wind',()=>whoosh(.12,.75,false)],[11.55,'pulse2',()=>impact(52,.11,.34)],[12.45,'bridge',()=>whoosh(.15,.6,true)],
  [13.04,'bassDrop',()=>impact(31,.38,.9)],[13.18,'glint',metallic],[13.55,'swell',()=>tension(1.0)],[14.25,'flutter3',()=>paperFlick(.07,.12)],[14.72,'flutter4',()=>paperFlick(.07,.12)],[15.20,'graphPulse',()=>impact(48,.11,.32)],[15.90,'glint2',metallic],[16.45,'finalDrop',()=>impact(28,.30,.72)]];
  if(time<cues.last-.15)cues.hit.clear();for(const [at,id,fn] of events){if(cues.last<at&&time>=at&&!cues.hit.has(id)){cues.hit.add(id);fn();}}cues.last=time;
}
function setSound(v){soundOn=!!v;if(masterGain)masterGain.gain.value=soundOn?1:0;if($('sound'))$('sound').textContent=soundOn?'🔊 Sound On':'🔇 Sound Off';}
function setButtons(){if($('play'))$('play').textContent=playing?'Pause':'Play';if($('playTop'))$('playTop').textContent=playing?'Pause preview':'Play preview';}
function toggle(){playing=!playing;if(playing&&t>=D)t=0;anchor=performance.now();anchorT=t;if(playing)getAudio();setButtons();}
if($('play'))$('play').onclick=toggle;if($('playTop'))$('playTop').onclick=toggle;
if($('restart'))$('restart').onclick=()=>{playing=false;t=0;cues={last:0,hit:new Set()};setButtons();render(0);};
if($('scrub')){$('scrub').max=D;$('scrub').oninput=e=>{playing=false;t=Number(e.target.value);cues.last=t;cues.hit.clear();setButtons();render(t);};}
if($('sound'))$('sound').onclick=()=>setSound(!soundOn);
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.pane').forEach(x=>x.classList.remove('active'));b.classList.add('active');const p=$(b.dataset.tab);if(p)p.classList.add('active');});
function loop(now){if(playing){t=anchorT+(now-anchor)/1000;if(t>=D){t=D;playing=false;setButtons();}}render(t);requestAnimationFrame(loop);}render(0);requestAnimationFrame(loop);
})();