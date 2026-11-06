import {paintShoe} from './chapter-shoes.js';
import {sources,shots} from './chapter-data.js';
export {sources};
export const masterStart=1409, duration=205.632;
export const scenes=shots.map(([t,name])=>[t,name]);
const names=['titles','beam','particles','vortex','markers','chapterShoes'];
export const defaults={speed:1,reverse:false,direction:1,travel:1,particles:1,glow:1,exposure:1,cues:Object.fromEntries(scenes.map(([t,n])=>[n,t])),copy:{label:'CHAPTER 7',title:'THE FINAL CHAPTER',distress:'BUT REVIVING THEM WOULDN’T BE',easy:'EASY',robert:'ROBERT LOUIS-DREYFUS',zeitz:'JOCHEN ZEITZ',mcqueen:'ALEXANDER McQUEEN',profession:'FASHION DESIGNER',rihanna:'RIHANNA',adidasHQ:'ADIDAS HEADQUARTERS',pumaHQ:'PUMA HEADQUARTERS'},layers:Object.fromEntries([...Object.keys(sources),...names].map(id=>[id,{x:0,y:0,scale:1,rotation:0,opacity:1,blur:0,depth:1,visible:true}]))};
const clamp=x=>Math.min(1,Math.max(0,x));
const ease=x=>{const a=clamp(x);return a*a*(3-2*a)};
const turns=Math.PI/180;
const overlap=.64;
export function paint(ctx,raw,media,f=defaults){
 const time=Math.max(0,Math.min(duration,f.reverse?duration-raw*f.speed:raw*f.speed));
 const index=Math.max(0,shots.findLastIndex(([,name])=>time>=f.cues[name]));
 function layer(id,x,y,scale,rotation,alpha,draw,blend='source-over'){
  const l=f.layers[id];
  if(!l?.visible||alpha<=0)return;
  globalThis.RegaarderLayerFrame?.require(ctx,id);
  ctx.save();
  ctx.translate(x+l.x+(x-480)*(l.depth-1)*.17,y+l.y+(y-270)*(l.depth-1)*.17);
  ctx.rotate((rotation+l.rotation)*turns);
  ctx.scale(scale*l.scale,scale*l.scale);
  ctx.globalAlpha*=clamp(alpha*l.opacity);
  ctx.globalCompositeOperation=blend;
  if(l.blur)ctx.filter='blur('+l.blur+'px)';
  const originalDraw=ctx.drawImage;
  ctx.drawImage=function(image,...args){const d=args.length===8?args.slice(4):args.length===4?args:[...args,image.naturalWidth||image.width,image.naturalHeight||image.height];globalThis.RegaarderLayerFrame?.bounds(ctx,id,...d);return originalDraw.call(ctx,image,...args);};
  try{draw();}finally{ctx.drawImage=originalDraw;}
  ctx.restore();
 }
 function title(text,x,y,size,color,opacity){
  layer('titles',x,y,1,0,opacity,()=>{
   ctx.font='900 '+size+'px system-ui';ctx.textAlign='center';ctx.fillStyle=color;
   ctx.shadowColor='#000';ctx.shadowBlur=9;ctx.fillText(text,0,0,880);
  });
 }
 function light(x,y,r,color){
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,color);g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
 }
 function scene(i,entrance,wallExit=0){
  const [start,name,items]=shots[i];
  const span=(shots[i+1]?.[0]??duration)-start;
  const editedSpan=(shots[i+1]?f.cues[shots[i+1][1]]:duration)-f.cues[name];
  const q=(time-f.cues[name])*span/editedSpan;
  const p=(q+overlap)/(span+overlap);
  const travel=f.direction*f.travel;
  const rivalry=name==='Final rivalry';
  ctx.save();
  if(entrance<1){
   const amount=ease(entrance);
   ctx.beginPath();
   if(name==='Nike vortex'){
    const radius=amount*650;
    for(let n=0;n<=96;n++){
     const a=n*Math.PI/48, r=radius*(1+.13*Math.sin(3*a+7*amount)+.07*Math.sin(7*a-4*amount));
     ctx.lineTo(480+Math.cos(a)*r,270+Math.sin(a)*r);
    }
   }else if(['Burning shoe','Predator','Yeezy'].includes(name)){
    ctx.rect(0,540*(1-amount),960,540*amount);

   }else if(['Family archive','Peace football'].includes(name)){
    ctx.rect(travel<0?0:960*(1-amount),0,960*amount,540);
   }else{
    ctx.globalAlpha*=amount;
    ctx.rect(0,0,960,540);
   }
   ctx.clip();
  }
  if(wallExit>0){
   const edge=960*wallExit;
   ctx.beginPath();
   ctx.rect(travel<0?0:edge,0,960-edge,540);
   ctx.clip();
  }
  ctx.fillStyle='#050508';ctx.fillRect(0,0,960,540);
  if(name==='Peace portraits'){
   const sky=ctx.createLinearGradient(0,0,960,500);
   sky.addColorStop(0,'#e9e6de');sky.addColorStop(.53,'#c2d0d7');sky.addColorStop(1,'#5a7b9e');
   ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
   light(220,132,450,'#fffaf0bc');
  }
  if(rivalry){
   const spin=ease((q-(span-1.0))/.95);
   ctx.translate(480,270);ctx.rotate(spin*4*travel);ctx.scale(1-.94*spin,1-.94*spin);ctx.translate(-480,-270);
  }
  if(name==='Sponsorship'){
   const approach=1-ease((q+.32)/4.6);
   const zoom=1+.28*approach*f.travel;
   ctx.translate(480+150*approach*travel,270);
   ctx.scale(zoom,zoom);
   ctx.translate(-480,-270);
  }
  const showcase=name==='McQueen and Rihanna';
  const shoeApproach=ease((q-1.05)/1.45);
  const shoeSettle=ease((q-2.58)/1.18);
  const groupPullback=ease((q-6.3)/2.15);
  const roomPullback=name==='Founders'?1-ease((q-.8)/5.6):0;
  for(const [id,x,y,w,h,dx,dy,z,delay,fade,r,blend,motionSeconds] of items){
   const introShoe=name==='Final Chapter'&&id==='hotShoe';
   if(introShoe&&!media.chapterShoes){
    layer('chapterShoes',x,y,1,0,.55,()=>paintShoe(ctx,q,{id:'final-'+x,x:0,y:0,size:140,phase:x/137,yaw:r,yawSpeed:38*travel,depthTravel:1.4,driftX:32,driftY:26,brightness:.85}));
    continue;
   }
   const img=introShoe?media.chapterShoes:media[id];
   if(!img)continue;
   const movingFlame=/^(realFlame|rivalReal)/.test(id);
   const video=Boolean(img.videoWidth);
   const iw=img.videoWidth||img.naturalWidth||img.width, ih=img.videoHeight||img.naturalHeight||img.height;
   if(!iw||!ih)continue;
   if(video){
    const seek=Math.max(0,Math.min(img.duration-.04,q));
    if(!img.seeking&&Math.abs(img.currentTime-seek)>(movingFlame?.025:.045))img.currentTime=seek;
   }
   const motion=delay?ease((q-delay)/(motionSeconds??Math.max(fade,span-delay))):p;
   let reveal=delay?ease((q-delay)/fade):1;
   const wobble=['adidasCard','pumaCard','kanye','yeezy'].includes(id)?Math.sin(q*3.1+x)*2.3:0;
   const fire=/Fire$|^fire$/.test(id);
   const flicker=fire?.83+.15*Math.sin(q*9+x):1;
   const grade=name==='Final Chapter'&&id==='clouds'?.36:
      name==='Final Chapter'&&id==='pumaRed'?.2:
      name.startsWith('Nike')?(id==='amber'?.24:id==='gold'?.32:.85):
      name==='Red shoeboxes'&&id==='realFlameAmber'?1-ease(q/.85):
      name==='Jochen Zeitz'&&id!=='zeitz'?.22+.78*ease(q/2.4):1;
   const k=(w>=960&&h>=540?Math.max:Math.min)(w/iw,h/ih);
   const roomDepth=id.startsWith('viewer')?1.8:id==='sofa'?1.35:id==='wall'||id==='dust'?.56:1;
   const zoom=1+roomPullback*.28*roomDepth*f.travel;
   const slide=wallExit*960*roomDepth*(travel<0?-1:1);
   let posX=480+(x+dx*motion*travel-480)*zoom+slide;
   let posY=244+(y+dy*motion+wobble-244)*zoom+52*roomPullback*f.travel;
   let angle=r+(name==='Final Chapter'&&id==='hotShoe'?q*38*travel:wobble);
   let scale=zoom*Math.max(.05,1+z*motion*f.travel);
   if(name==='Sponsorship'&&id==='crowdNear'){
    reveal=ease((q-3.45)/.55);
    const pullback=ease((q-3.85)/1.5);
    const advance=ease((q-5.35)/2.1);
    scale=1+(1.62*(1-pullback)+.18*advance)*f.travel;
    posY=540+(y-540)*scale-34*pullback*f.travel;
   }
   const looseBill=['Adidas recovery','Financial distress'].includes(name)&&['billA','billB'].includes(id);
   if(looseBill){
    const phase=q*3.4+x*.018;
    posX+=Math.sin(phase)*25*travel;
    posY+=Math.cos(phase*.83)*17*f.travel;
    angle+=Math.sin(phase*.72)*11*travel;
   }
   if(showcase){
    if(id==='shoe'){
     const arc=shoeApproach*(1-shoeSettle)*f.travel;
     posX+=travel*(110*(1-groupPullback)-310*arc-286*shoeSettle*(1-groupPullback));
     posY+=75*arc+92*shoeSettle*(1-groupPullback);
     scale*=1+.23*(1-groupPullback)+1.45*arc;
     angle-=24*arc*Math.sign(travel);
    }else{
     if(id==='mcqueen')reveal*=1-.92*shoeSettle*(1-groupPullback);
     const focus=(1-groupPullback)*f.travel;
     const cameraX=115*shoeSettle-38*(1-shoeSettle);
     posX=480+(posX-480)* (1+.23*focus)-cameraX*focus*Math.sign(travel);
     posY=286+(posY-286)*(1+.23*focus);
     scale*=1+.23*focus;
    }
   }
   const rivalrySide=rivalry&&(/^(left|right|rival)/.test(id));
   if(rivalrySide){
    const left=id.startsWith('left')||id.startsWith('rivalBlue')||id==='rivalRealBlue';
    const rise=ease((q-(left?.42:0))/.63);
    ctx.save();ctx.beginPath();
    ctx.rect(left?0:480,540*(1-rise),480,540*rise);ctx.clip();
   }
   if(id==='rivalRealBlue')reveal=.91*ease(q/.55);
   if(id==='rivalRealDark')reveal=.94*ease(q/.55);
   if(rivalry&&id.endsWith('Fog')){
    posX+=Math.sin(q*2.2+x)*21*travel;
    posY+=Math.cos(q*2.9+x)*15*f.travel;
    reveal=.63+.22*Math.sin(q*2.2+x);
   }
   if(rivalry&&id==='cloudB')reveal=.3+.22*Math.sin(q*1.65);
   layer(introShoe?'chapterShoes':id,posX,posY,scale,angle,reveal*flicker*grade,()=>{
    if(name==='Financial distress'&&['adidasCard','pumaCard'].includes(id)){
     const stripes=24, step=iw/stripes, angle=q*2.4+(id==='pumaCard'?1.2:0);
     for(let n=0;n<stripes;n++){
      const bend=Math.max(0,n/stripes-.53);
      const lift=bend*bend*Math.sin(angle+n*.17)*94;
      ctx.drawImage(img,n*step,0,step,ih,(-iw/2+n*step)*k,-ih*k/2+lift,step*k+.6,ih*k*(1-.22*bend));
     }
    }else if(looseBill){
     const strips=18, step=iw/strips;
     for(let n=0;n<strips;n++){
      const wave=Math.sin(q*5+n*.33+x*.01)*12*f.travel;
      ctx.drawImage(img,n*step,0,step,ih,(-iw/2+n*step)*k,-ih*k/2+wave,step*k+.65,ih*k);
     }
    }else if(movingFlame){
     // Hold the emitter positions while each video frame reshapes the flame.
     const plumeWidth=h*iw/ih*(rivalry?1.42:1);
     ctx.drawImage(img,-w*.28-plumeWidth*.56,-h/2,plumeWidth,h);
     ctx.save();ctx.scale(-1,1);
     ctx.drawImage(img,-w*.23-plumeWidth*.44,-h*.34,plumeWidth*.72,h*.84);
     ctx.restore();
    }else if(name==='Burning shoe'&&id==='hotShoe'){
     const width=iw*k,height=ih*k;
     ctx.drawImage(img,-width/2,-height/2,width,height);
     const showFlame=(id,x,base,w,h,opacity)=>{
      const clip=media[id];
      if(!clip) return;
      if(clip.videoWidth){
       const seek=Math.min(clip.duration-.04,Math.max(0,q));
       if(!clip.seeking&&Math.abs(clip.currentTime-seek)>.025)clip.currentTime=seek;
      }
      layer(id,x*width,base*height,1,0,opacity,()=>{
       ctx.drawImage(clip,-w*width*.56,-h*height,w*width,h*height);
      },'screen');
     };
     ctx.save();
     // Keep the rear flames above the shoe silhouette, in front of the jacket.
     ctx.beginPath();ctx.moveTo(-width/2,-height/2);ctx.lineTo(width/2,-height/2);
     for(const [x,y] of [[.5,.16],[.31,.12],[.274,-.106],[.205,-.112],[.123,-.07],[.01,.05],[-.13,.13],[-.26,.166],[-.35,.20],[-.5,.25]])ctx.lineTo(x*width,y*height);
     ctx.closePath();ctx.clip();
     showFlame('shoeFireRear',-.263,.197,.22,.42,.92);
     showFlame('shoeFireFront',.235,-.078,.20,.38,.92);
     ctx.restore();
     showFlame('shoeFireFront',-.312,.221,.112,.235,.71);
     showFlame('shoeFireRear',.282,.04,.117,.23,.67);
     layer('shoeFireRear',0,0,1,0,(.26+.07*Math.sin(q*12)+.03*Math.sin(q*21))*f.glow,()=>{
      light(-width*.30,height*.18,width*.15,'#ff681977');
      light(width*.24,-height*.045,width*.17,'#ff65188c');
     },'screen');
    }else if(name==='Sponsorship'&&id==='hand'){
     const h=ih*k,w=iw*k;
     ctx.drawImage(img,-w/2,-h/2,w,h);
     const sleeve=Math.round(ih*.125);
     ctx.drawImage(img,0,ih-sleeve,iw,sleeve,-w/2,h/2-sleeve*k,w,sleeve*k*4.2);
    }else if(name==='Yeezy'&&id==='kanye'){
     const w=iw*k,h=ih*k;
     ctx.fillStyle='#12191e';ctx.fillRect(-w*.5-8,-h*.5-8,w+16,h+16);
     ctx.drawImage(img,-w/2,-h/2,w,h);
     const gloss=ctx.createLinearGradient(-w/2,-h/2,w/2,h/2);
     gloss.addColorStop(0,'#c1e5ff13');gloss.addColorStop(.42,'#c1e5ff38');
     gloss.addColorStop(.57,'#d4eaff08');gloss.addColorStop(1,'#080d2077');
     ctx.fillStyle=gloss;ctx.fillRect(-w/2,-h/2,w,h);
     ctx.strokeStyle='#9ba5a76a';ctx.lineWidth=2;ctx.strokeRect(-w*.5-6,-h*.5-6,w+12,h+12);
    }else ctx.drawImage(img,-iw*k/2,-ih*k/2,iw*k,ih*k);
   },blend);
   if(rivalrySide)ctx.restore();
  }
  if(name==='Final Chapter'){
   const dim=1-ease((q-6.7)/1.8);
   title(f.copy.label,480,237-22*(1-ease(q/1.2)),23,'#fff5da',dim*ease(q/.8));
   title(f.copy.title,480,298+52*(1-ease(q/1.5)),57,'#ffdc88',dim*ease(q/.85));
   layer('beam',480,270,1,0,ease((q-6)/.6)*dim*f.glow,()=>light(0,0,53,'#ffe7ac90'),'screen');
   ctx.fillStyle='rgba(0,0,0,'+(1-dim)+')';ctx.fillRect(0,0,960,540);
  }
  if(name==='Financial distress'){
   const caption=f.copy.distress.match(/^(.*)\s+(WOULDN’T BE|WOULDN'T BE)$/i);
   const prefix=caption?.[1]??'';
   const emphasis=caption?.[2]??f.copy.distress;
   layer('titles',718,83,1,76,ease((q-13.75)/.3),()=>{
    ctx.scale(.66,1);
    ctx.textAlign='left';
    ctx.textBaseline='middle';
    ctx.shadowColor='#171313';
    ctx.shadowBlur=3;
    ctx.font='900 31px Arial, DejaVu Sans, sans-serif';
    ctx.fillStyle='#ecebe6';
    ctx.fillText(prefix,202,-40,420*ease((q-13.75)/.55));
    ctx.font='900 64px Arial, DejaVu Sans, sans-serif';
    if(q>14.08)ctx.fillText(emphasis,0,13,435*ease((q-14.08)/.55));
    ctx.fillStyle='#e31524';
    const emphasisWidth=Math.min(435,ctx.measureText(emphasis).width);
    if(q>14.52)ctx.fillText(f.copy.easy,emphasisWidth+16,13,165*ease((q-14.52)/.48));
   });
  }
  if(name==='Louis-Dreyfus'){
   const [first,...rest]=f.copy.robert.split(' ');
   const opacity=1-ease((q-4.8)/1.3);
   title(first,330-115*p,303,61,'#fff',opacity);
   title(rest.join(' '),330-115*p,331,22,'#fff',opacity);
  }
  if(name==='Jochen Zeitz')title(f.copy.zeitz,240,388,37,'#fff',ease((q-2)/1.5));
  if(name==='McQueen and Rihanna'){
   title(f.copy.mcqueen,540,216,29,'#fff',ease((q-.38)/.35)*(1-ease((q-1.8)/.4)));
   title(f.copy.profession,475,244,15,'#fff',ease((q-.48)/.35)*(1-ease((q-1.8)/.4)));
   title(f.copy.rihanna,392,301,36,'#fff',ease((q-3.35)/.6)*(1-ease((q-6.3)/.7)));
  }
  if(name==='Headquarters'){
   for(const [x,y,d,color,label] of [[410,219,0,'#2c57ff',f.copy.adidasHQ],[516,409,3.2,'#ff2748',f.copy.pumaHQ]]){
    const a=ease((q-d)/1.2), size=1-.29*p;
    layer('markers',480+(x-480)*size,270+(y-270)*size+61*p,size,0,a,()=>{
     ctx.beginPath();ctx.arc(0,0,27,-Math.PI/2,Math.PI*2*a-Math.PI/2);ctx.strokeStyle=color;ctx.lineWidth=7;ctx.stroke();
     ctx.fillStyle='#fff';ctx.font='bold 21px system-ui';ctx.fillText(label,35,5);
    });
   }
  }
  if(['Nike vortex','Nike return','Final rivalry'].includes(name)){
   const strength=name==='Final rivalry'?ease((q-(span-1.1))/.85):1-ease((q-.3)/2.4);
   layer('vortex',480,270,1,0,strength*f.glow,()=>light(0,0,305,'#fff0b78a'),'screen');
   layer('particles',480,270,1,0,strength*f.particles,()=>{
    for(let n=1;n<=72;n++){
     const theta=n*2.39996+q*.19, radius=(n*71+q*92)%480;
     ctx.fillStyle=n%3?'#fbd68c9c':'#d4edffb0';
     ctx.fillRect(Math.cos(theta)*radius,Math.sin(theta)*radius*.62,2,1.4);
    }
   },'screen');
  }
  ctx.restore();
 }
 ctx.save();ctx.fillStyle='#050508';ctx.fillRect(0,0,960,540);
 const clipBoundary=(i)=>['Usain Bolt','Red shoeboxes','End'].includes(shots[i]?.[1]);
 const sponsorship=shots.findIndex(([,name])=>name==='Sponsorship');
 const wallProgress=(time-f.cues.Sponsorship+.82)/1.64;
 if(wallProgress>0&&wallProgress<1&&(index===sponsorship-1||index===sponsorship)){
  scene(sponsorship,1);
  scene(sponsorship-1,1,ease(wallProgress));
 }else if(index>0&&!clipBoundary(index)&&time-f.cues[shots[index][1]]<overlap/2){
  scene(index-1,1);scene(index,(time-f.cues[shots[index][1]])/overlap+.5);
 }else{
  scene(index,1);
  const next=shots[index+1];
  if(next&&!clipBoundary(index+1)&&time>f.cues[next[1]]-overlap/2)scene(index+1,(time-f.cues[next[1]])/overlap+.5);
 }
 if(f.exposure<1){ctx.fillStyle='rgba(0,0,0,'+(1-f.exposure)+')';ctx.fillRect(0,0,960,540)}
 ctx.restore();
}
