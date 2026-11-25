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
  wallBg:'assets/wall-bg.webp',
  wallAtlas:'assets/wallstreet-extracted-atlas.webp',
  valueAtlas:'assets/valuation-extracted-atlas.webp'
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

const WALL_SPR={
  wall_street_architecture:{x:4,y:4,w:184,h:170},
  stock_certificate:{x:192,y:4,w:162,h:104},
  invoice_zzzz_best:{x:358,y:4,w:256,h:168},
  financial_statement:{x:618,y:4,w:238,h:158},
  contract_approved:{x:4,y:178,w:239,h:153},
  earnings_report:{x:247,y:178,w:262,h:145},
  foreground_100_dollar_bill:{x:513,y:178,w:251,h:158},
  bill_upper_left:{x:768,y:178,w:94,h:46},
  bill_top_center:{x:866,y:178,w:71,h:69},
  bill_upper_mid_right:{x:941,y:178,w:57,h:42},
  bill_mid_right:{x:4,y:340,w:36,h:32},
  bill_lower_mid_left:{x:44,y:340,w:52,h:30},
  bill_lower_center:{x:100,y:340,w:90,h:63},
  paper_shard_left:{x:194,y:340,w:28,h:22},
  paper_shard_center:{x:226,y:340,w:26,h:22},
  text_and:{x:256,y:340,w:144,h:70},
  text_yet_dots:{x:404,y:340,w:188,h:74},
  text_wall:{x:596,y:340,w:172,h:70},
  text_street:{x:772,y:340,w:204,h:80},
  text_believed:{x:4,y:424,w:270,h:94},
  text_it:{x:278,y:424,w:66,h:58}
};
const VAL_SPR={
  barry_minkow_upper_body:{x:4,y:4,w:172,h:168},
  wall_street_building_and_sign:{x:180,y:4,w:206,h:211},
  zzzz_best_building:{x:390,y:4,w:259,h:137},
  red_financial_chart:{x:653,y:4,w:654,h:251},
  decline_percentages:{x:1311,y:4,w:128,h:114},
  skyline:{x:4,y:259,w:405,h:112},
  contract_foreground:{x:413,y:259,w:232,h:145},
  financial_statement_foreground:{x:649,y:259,w:168,h:107},
  investor_prospectus_foreground:{x:821,y:259,w:309,h:148},
  floating_paper_top:{x:1134,y:259,w:85,h:52},
  floating_paper_mid_left:{x:1223,y:259,w:70,h:44},
  floating_paper_mid_right:{x:1297,y:259,w:58,h:36},
  floating_paper_right:{x:1359,y:259,w:54,h:63},
  floating_paper_bottom_center:{x:1417,y:259,w:76,h:40},
  text_over:{x:4,y:411,w:282,h:67},
  text_300:{x:290,y:411,w:305,h:129},
  text_million:{x:599,y:411,w:464,h:122},
  valuation_flare_glow:{x:4,y:544,w:820,h:88}
};
function drawSprite(im,map,key,cx,cy,dw,alpha=1,rot=0,blend='source-over',filter='none'){
  const s=map[key];if(!s||!im||!im.complete||im.naturalWidth<2||alpha<=.001)return false;
  const dh=dw*s.h/s.w;
  ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation=blend;ctx.filter=filter;
  ctx.translate(cx,cy);ctx.rotate(rot);ctx.drawImage(im,s.x,s.y,s.w,s.h,-dw/2,-dh/2,dw,dh);ctx.restore();return true;
}
function drawSpriteRevealX(im,map,key,cx,cy,dw,p,alpha=1,rot=0,blend='source-over'){
  const s=map[key];if(!s||!im||!im.complete||im.naturalWidth<2||alpha<=.001)return false;
  const dh=dw*s.h/s.w,pp=clamp(p);
  ctx.save();ctx.beginPath();ctx.rect(cx-dw/2-5,cy-dh/2-8,(dw+10)*pp,dh+16);ctx.clip();
  drawSprite(im,map,key,cx,cy,dw,alpha,rot,blend);ctx.restore();return true;
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
  if(grid){ctx.save();ctx.globalAlpha=.20;ctx.strokeStyle='#b71918';ctx.lineWidth=1;const off=(time*8)%36;for(let x=-off;x<W+40;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=-off;y<H+40;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.restore();}
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
function shadowRevealBand(local){
  const sh=smooth(clamp((local-.55)/1.4));
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.55*(1-sh*.72);
  ctx.translate(-390+local*430,0);ctx.rotate(-.42);ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(0,-360,280,1500);ctx.restore();
}
function wallStreetBelievedBeat(local){
  const intro=smoother(clamp(local/.82)),zoom=mix(1.30,1.015,intro)+.012*Math.sin(local*2.2);
  redAtmosphere(local,zoom,false);emberField(local,1.18,.78);
  const A=images.wallAtlas;
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);
  drawSprite(A,WALL_SPR,'wall_street_architecture',142,118,300,.95,-.02,'source-over','drop-shadow(0 15px 22px rgba(0,0,0,.40))');
  drawSprite(A,WALL_SPR,'stock_certificate',430,138,250,.80,.08);
  drawSprite(A,WALL_SPR,'invoice_zzzz_best',1088,112,410,.96,-.08,'source-over','drop-shadow(0 18px 25px rgba(0,0,0,.38))');
  drawSprite(A,WALL_SPR,'financial_statement',1090,520,365,.90,-.16);
  drawSprite(A,WALL_SPR,'contract_approved',155,570,360,.91,.16);
  drawSprite(A,WALL_SPR,'earnings_report',572,620,305,.70,-.07);
  drawSprite(A,WALL_SPR,'foreground_100_dollar_bill',1125,685,480,.82,-.18,'source-over','blur(.25px)');
  const bills=[
    ['bill_upper_left',245,235,145,-.28,.70],
    ['bill_top_center',590,83,125,.16,.88],
    ['bill_upper_mid_right',760,195,105,.44,.78],
    ['bill_mid_right',835,315,86,-.26,.72],
    ['bill_lower_mid_left',395,540,95,.12,.72],
    ['bill_lower_center',720,515,132,-.22,.82]
  ];
  bills.forEach((b,i)=>{
    const d=.58+i*.07,dx=Math.sin(local*(.8+d)+i*1.2)*(24+8*i),dy=Math.cos(local*(.7+d)+i*.9)*(16+4*i),rot=b[4]+Math.sin(local*.75+i)*.08;
    drawSprite(A,WALL_SPR,b[0],b[1]+dx,b[2]+dy,b[3],b[5],rot,'source-over',i===0?'blur(.35px)':'none');
  });
  drawSprite(A,WALL_SPR,'paper_shard_left',85+Math.sin(local)*24,335+Math.cos(local*.8)*16,64,.68,-.35);
  drawSprite(A,WALL_SPR,'paper_shard_center',690+Math.sin(local*1.1)*30,340+Math.cos(local*.9)*20,58,.72,.25);
  ctx.restore();

  const a1=smoother(clamp((local-.48)/.48)),a2=smoother(clamp((local-.88)/.52)),a3=smoother(clamp((local-1.18)/.58)),a4=smoother(clamp((local-1.42)/.55));
  ctx.save();ctx.translate(0,0);ctx.transform(1,0,-.105,1,0,0);
  drawSprite(A,WALL_SPR,'text_and',300,370,220,a1,0,'source-over','drop-shadow(0 6px 15px rgba(255,70,0,.45))');
  drawSprite(A,WALL_SPR,'text_yet_dots',500,354,300,a2,0,'source-over','drop-shadow(0 6px 15px rgba(255,70,0,.45))');
  drawSprite(A,WALL_SPR,'text_wall',285,490,252,a2,0,'source-over','drop-shadow(0 7px 16px rgba(0,0,0,.40))');
  drawSprite(A,WALL_SPR,'text_street',505,466,305,a3,0,'source-over','drop-shadow(0 7px 16px rgba(0,0,0,.40))');
  drawSprite(A,WALL_SPR,'text_believed',820,430,395,a3,0,'source-over','drop-shadow(0 7px 16px rgba(0,0,0,.40))');
  drawSprite(A,WALL_SPR,'text_it',1093,394,105,a4,0,'source-over','drop-shadow(0 7px 16px rgba(0,0,0,.40))');
  ctx.restore();
  shadowRevealBand(local);
  const pulse=(Math.sin(local*5.4)*.5+.5)*smooth(clamp((local-.3)/.5));ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(255,24,0,'+(.04+.07*pulse)+')';ctx.fillRect(0,0,W,H);ctx.restore();
  flash((1-smooth(clamp(local/.12)))*.25,true);vignette(.58);
}
function valuationBeat(local){
  const pull=smoother(clamp(local/2.15)),zoom=mix(1.16,.965,pull),A=images.valueAtlas;
  redAtmosphere(local+2,zoom,true);emberField(local+3,.62,.20);

  const chartA=smoother(clamp((local-.18)/.55)),chartP=smoother(clamp((local-.22)/1.35));
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);
  drawSpriteRevealX(A,VAL_SPR,'red_financial_chart',640,332,1185,chartP,.78*chartA,0,'screen');
  drawSprite(A,VAL_SPR,'wall_street_building_and_sign',135,160,310,.95,-.015,'source-over','drop-shadow(0 18px 24px rgba(0,0,0,.42))');
  drawSprite(A,VAL_SPR,'zzzz_best_building',1012,150,365,.93,.015,'source-over','drop-shadow(0 16px 22px rgba(0,0,0,.38))');
  const personA=smoother(clamp((local-.10)/.72));
  drawSprite(A,VAL_SPR,'barry_minkow_upper_body',640,145,325,.95*personA,0,'source-over','drop-shadow(0 18px 24px rgba(0,0,0,.45))');
  drawSprite(A,VAL_SPR,'skyline',640,650,1180,.92,0,'source-over','drop-shadow(0 -8px 20px rgba(255,90,20,.18))');

  const papers=[
    ['contract_foreground',145,620,335,.15,.96],
    ['financial_statement_foreground',520,650,225,-.10,.86],
    ['investor_prospectus_foreground',1070,610,430,-.16,.94],
    ['floating_paper_top',330,75,125,.16,.60],
    ['floating_paper_mid_left',385,540,105,-.22,.52],
    ['floating_paper_mid_right',890,530,90,.22,.54],
    ['floating_paper_right',1215,335,95,.12,.55],
    ['floating_paper_bottom_center',720,660,120,-.18,.58]
  ];
  papers.forEach((p,i)=>{
    const dx=Math.sin(local*(.66+i*.025)+i)*18,dy=Math.cos(local*(.72+i*.03)+i*.7)*14,rr=p[4]+Math.sin(local*.55+i)*.045;
    drawSprite(A,VAL_SPR,p[0],p[1]+dx,p[2]+dy,p[3],p[5],rr,'source-over',i>2?'blur(.25px)':'none');
  });
  ctx.restore();

  const percA=smoother(clamp((local-.65)/.60));
  drawSprite(A,VAL_SPR,'decline_percentages',1120,110,205,.92*percA,0,'screen','drop-shadow(0 0 13px rgba(255,20,12,.45))');

  const overA=smoother(clamp((local-.48)/.55)),numA=smoother(clamp((local-.82)/.66));
  drawSprite(A,VAL_SPR,'text_over',640,310,315,overA,0,'source-over','drop-shadow(0 7px 18px rgba(255,145,0,.52))');
  drawSprite(A,VAL_SPR,'text_300',400,472,430,numA,0,'source-over','drop-shadow(0 9px 21px rgba(255,145,0,.55))');
  drawSprite(A,VAL_SPR,'text_million',820,478,650,numA,0,'source-over','drop-shadow(0 9px 21px rgba(255,145,0,.55))');

  const flareA=smooth(clamp((local-1.15)/.35))*(1-smooth(clamp((local-3.55)/.35)));
  drawSprite(A,VAL_SPR,'valuation_flare_glow',640,568,1160,.50*flareA,0,'screen');
  const glint=smooth(clamp((local-2.28)/.18))*(1-smooth(clamp((local-2.64)/.28)));
  if(glint>0){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.55*glint;ctx.translate(270+local*245,395);ctx.rotate(-.21);const g=ctx.createLinearGradient(-45,0,45,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,244,190,.95)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(-45,-170,90,350);ctx.restore();}
  flash((1-smooth(clamp(local/.12)))*.22,true);vignette(.52);
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