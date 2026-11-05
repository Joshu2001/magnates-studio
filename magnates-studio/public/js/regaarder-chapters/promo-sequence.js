export const duration = 120, masterStart = 1285;
export const scenes = [
 [0,'Memorial fade'],[2,'Host greeting'],[4,'Media board'],[7.9,'Tower breakup'],
 [13.3,'Workstation'],[20.9,'Analytics'],[23.5,'Window travel'],[33,'Nested edit'],
 [40,'Clapperboards'],[45,'Workflow icons'],[57,'Process cards'],[61.7,'Niche choices'],
 [66.5,'Blueprint'],[72,'Subscriber counter'],[80.5,'Offer'],[87,'Profiles'],
 [92,'Community message'],[100,'Monitor reveal'],[104.5,'Clock and cash'],
 [108.4,'Award'],[111.3,'Offer line'],[113.2,'Call to action']
];
export const sources = {memorial:'memorial.jpg',room:'room.jpg',city:'city.jpg',cityRear:'city-rear.jpg',london:'london.jpg',wood:'wood.jpg',pagoda:'pagoda.jpg',coast:'coast.jpg',host:'host.mp4',cash:'cash.jpg',flame:'flame.mp4'};
export const defaults = {
 speed:1, reverse:false, direction:1, travel:1, particles:1, glow:1, exposure:1,
 cues:Object.fromEntries(scenes.map(([t,label])=>[label,t])),
 layers:Object.fromEntries([...Object.keys(sources),'viewer','screen','board','analytics','icons','cards','blueprint','counter','profiles','message','clock','award','copy','arrows'].map(id=>[id,{x:0,y:0,scale:1,rotation:0,opacity:1,blur:0,depth:1,visible:true}])),
 copy:{greeting:'HEY LEGENDS',intro:'IT’S JOHN HERE',brand:'MOTION ATELIER',offer:'BUILD YOUR CREATOR SYSTEM',cta:'CLICK LINK IN DESCRIPTION',url:'YOUR SITE / SYSTEM',counter:1600000}
};
const W=960,H=540, gold='#f6b837';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,p)=>a+(b-a)*p;
const ease=p=>p*p*(3-2*p);
const cue=(t,a,b)=>ease(clamp((t-a)/(b-a)));
const rand=n=>{const x=Math.sin(n*37.719+13.17)*43758.5453;return x-Math.floor(x)};
export function paint(c,raw,media,f=defaults){
 const clock=clamp(f.reverse?duration-raw*f.speed:raw*f.speed,0,duration);
 const index=scenes.findLastIndex(([,label])=>clock>=f.cues[label]);
 const [start,label]=scenes[Math.max(0,index)];
 const [end,next]=scenes[index+1]||[duration,null];
 const t=lerp(start,end,clamp((clock-f.cues[label])/((next?f.cues[next]:duration)-f.cues[label])));
 const q=name=>defaults.cues[name], p=(name,d=1)=>cue(t,q(name),q(name)+d);
 const active=name=>t>=q(name);
 const dr=f.direction, tr=f.travel;
 function box(x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
 function group(id,x,y,fn,scale=1,rot=0,alpha=1){
  const l=f.layers[id];if(!l.visible||alpha<=0)return;
  c.save();c.translate(x+l.x+(x-480)*(l.depth-1)*.05,y+l.y);
  c.rotate((rot+l.rotation)*Math.PI/180);c.scale(scale*l.scale,scale*l.scale);
  c.globalAlpha*=clamp(alpha*l.opacity);if(l.blur)c.filter='blur('+l.blur+'px)';
  const replacement=Object.hasOwn(sources,id)?null:media[id];
  if(replacement){const w=replacement.naturalWidth||replacement.width,h=replacement.naturalHeight||replacement.height,k=Math.min(480/w,300/h);c.drawImage(replacement,-w*k/2,-h*k/2,w*k,h*k)}else fn();
  c.restore();
 }
 function pic(id,x,y,w,h,alpha=1,rot=0){
  const im=media[id],iw=im?.videoWidth||im?.naturalWidth||im?.width,ih=im?.videoHeight||im?.naturalHeight||im?.height;
  if(!iw||!ih)return;
  group(id,x,y,()=>{const k=Math.max(w/iw,h/ih);c.beginPath();c.rect(-w/2,-h/2,w,h);c.clip();c.drawImage(im,-iw*k/2,-ih*k/2,iw*k,ih*k)},1,rot,alpha);
 }
 function text(s,x,y,size=32,color='#f5f4ec',align='center'){
  c.font='900 '+size+'px Arial';c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;c.fillText(s,x,y);
 }
 function grid(){box(0,0,W,H,'#08090d');c.strokeStyle='#a9894020';c.lineWidth=1;c.beginPath();for(let i=0;i<W;i+=28){c.moveTo(i,0);c.lineTo(i,H)}for(let i=0;i<H;i+=28){c.moveTo(0,i);c.lineTo(W,i)}c.stroke()}
 function flecks(age,n,kind){
  for(let i=0;i<n*f.particles;i++){
   const r=rand(i+71), near=i%7===0, spread=Math.max(0,age), x=kind==='debris'?480+(r-.5)*spread*360:rand(i+1)*W+(r-.5)*spread*90;
   const y=kind==='debris'?185-rand(i+8)*spread*170+spread*spread*21:(rand(i+9)*H+spread*(20+r*70))%H;
   c.save();c.translate(x,y);c.rotate(i+age*(r+.2));c.globalAlpha=kind==='dust'?.35:.85;
   if(near&&kind!=='dust')c.filter='blur(3px)';
   box(0,0,kind==='dust'?2:near?25:5,kind==='dust'?2:near?6:3,i%3?gold:'#ede5d0');c.restore();
  }
 }
 function panel(w,h,draw,tilt=0){
  c.save();c.transform(1,tilt*.13,tilt*.21,1,0,0);
  c.shadowColor='#0009';c.shadowBlur=20;
  box(-w/2,-h/2,w,h,'#262730');c.shadowBlur=0;
  c.strokeStyle='#766849';c.strokeRect(-w/2,-h/2,w,h);draw();c.restore();
 }
 function mark(x,y,size){c.beginPath();c.arc(x,y,size*.66,0,Math.PI*2);c.fillStyle='#17141a';c.fill();c.strokeStyle=gold;c.lineWidth=2;c.stroke();text('M',x,y,size,gold)}
 function monitor(content,x=490,y=275,s=1){
  group('screen',x,y,()=>{box(-177,-111,354,222,'#0a0b10');box(-170,-104,340,208,'#18202d');c.save();c.beginPath();c.rect(-167,-101,334,202);c.clip();content();c.restore();box(-16,111,32,25,'#0b1017');box(-55,136,110,5,'#101720')},s);
 }
 function viewer(x=480,y=380,s=1){
  group('viewer',x,y,()=>{c.strokeStyle='#254b5b';c.lineWidth=2;c.fillStyle='#080f19';c.beginPath();c.moveTo(-135,160);c.bezierCurveTo(-126,54,-81,39,-40,28);c.lineTo(-34,6);c.bezierCurveTo(-74,-88,59,-115,53,-25);c.lineTo(37,25);c.bezierCurveTo(100,39,132,75,147,160);c.closePath();c.fill();c.stroke();c.fillStyle='#111b25';c.beginPath();c.roundRect(-90,115,180,110,27);c.fill()},s)
 }
 function workstation(content,{z=1,offset=0,person=true,exterior=null}={}){
  c.save();c.translate(480+offset,270);c.scale(z,z);c.translate(-480,-270);
  pic('room',480,270,1060,600);
  if(exterior){
   const [a,b,m]=exterior;
   for(const [x,w] of [[202,148],[383,174],[570,171],[746,145]]){
    c.save();c.beginPath();c.rect(x-w/2,22,w,396);c.clip();
    pic(a,480,220,790,402);if(b)pic(b,480,220,790,402,m);
    box(x-w/2,22,w,396,'#06314535');c.restore();
   }
  }
  monitor(content);if(person)viewer();c.restore();
 }
 function interfaceArt(){
  box(-168,-102,336,204,'#1b2029');box(-54,-80,173,93,'#4482b1');box(-54,-32,173,45,'#416843');
  for(let i=0;i<13;i++){box(-157,-82+i*13,77+rand(i)*20,3,'#697181');box(-64+i%3*21,26+i*5,100+rand(i+4)*120,3,['#7184b4','#5c936c','#a2747d'][i%3])}
 }
 function message(w=620){
  panel(w,w*.53,()=>{text('CREATOR COMMUNITY',-w*.42,-w*.18,w*.047,gold,'left');for(let i=0;i<9;i++)box(-w*.42,-w*.10+i*w*.033,w*(.48+rand(i+30)*.35),w*.008,'#cbd2dc99')});
 }
 function icon(id,label,x,y,s,alpha=1){
  group('icons',x,y,()=>{c.shadowColor=gold;c.shadowBlur=8*f.glow;text(id,0,-12,39,gold);c.shadowBlur=0;box(-71,15,142,29,'#bb721e');text(label,0,30,15)},s,0,alpha)
 }
 c.save();c.scale(c.canvas.width/W,c.canvas.height/H);box(0,0,W,H,'#030407');
 if(!active('Host greeting')){pic('memorial',480,270,W,H,1-cue(t,.35,1.45));}
 else if(!active('Media board')){
  grid();group('copy',480,270,()=>{const s=t<3?f.copy.greeting:f.copy.intro;const a=cue(t,t<3?2:3,t<3?2.48:3.5);text(s.slice(0,Math.ceil(s.length*a)),0,0,47,gold)});
 }else if(!active('Tower breakup')){
  grid();const a=p('Media board',1.55);
  group('board',480,270,()=>panel(550,325,()=>{text(f.copy.brand,0,-127,29,gold);
   for(let i=0;i<12;i++){const x=-246+i%4*125,y=-93+Math.floor(i/4)*76;box(x,y,115,65,['#364464','#65363b','#305553','#716035'][i%4]);text(String(i+1).padStart(2,'0'),x+57,y+32,24,gold)}
  },dr*(1-a)),lerp(1.55,.75,a),-12*dr*(1-a));
  if(t>6.5)flecks(t-6.5,115,'confetti');
 }else if(!active('Workstation')){
  const a=cue(t,11,12.8);
  pic('cityRear',480,270,W,H);
  c.save();c.globalAlpha=1-a;pic('city',480,270,W,H);c.restore();if(a<1){c.save();c.globalAlpha=1-a;mark(447,82,38);c.restore()}
  if(a>0){
   const im=media.city;
   for(let i=0;i<94*f.particles;i++){
    const sx=.35+rand(i+13)*.22,sy=.13+rand(i+19)*.59,age=t-11;
    const x=sx*W+(rand(i+1)-.5)*age*300,y=sy*H-rand(i+2)*age*145+age*age*22;
    c.save();c.translate(x,y);c.rotate(age*(rand(i+3)-.5)*5);c.globalAlpha=(1-cue(t,12.9,13.3))*a;
    if(im&&f.layers.city.visible)c.drawImage(im,sx*(im.naturalWidth||im.width),sy*(im.naturalHeight||im.height),9,7,-5,-4,11+rand(i)*9,9);c.restore();
   }
  }
 }else if(!active('Analytics')){
  const a=p('Workstation',.57), z=lerp(.95,2.25,cue(t,15,19.3));
  c.save();c.translate(0,(1-a)*H*dr);workstation(()=>pic('host',0,0,334,202),{z,offset:95*dr*tr*(1-z),person:t<16.8});c.restore();
  if(a<1){c.save();c.beginPath();c.rect(0,dr>0?0:a*H,W,(1-a)*H);c.clip();pic('city',480,270,W,H);box(0,dr>0?(1-a)*H-12:a*H,W,12,'#9da4ad');c.restore()}
  if(t>20.2){c.save();c.globalAlpha=cue(t,20.2,20.9);box(0,0,W,H,'#030407');c.restore()}
 }else if(!active('Window travel')){
  const a=p('Analytics',.85), x=480+dr*tr*(1-a)*125*Math.cos(a*7);
  group('analytics',x,270+130*(1-a),()=>panel(560,235,()=>{mark(-229,-57,25);text('CHANNEL ANALYTICS',-165,-59,23,gold,'left');text('Audience and watch time',0,2,27);for(let i=0;i<5;i++)box(-236+i*99,58,68,7+i*3,'#8a99b4');
   const shine=cue(t,21.25,21.85), sx=lerp(-330,340,shine);
   if(shine>0&&shine<1){const g=c.createLinearGradient(sx-55,0,sx+55,0);g.addColorStop(0,'#fff0');g.addColorStop(.5,'#f4ecff36');g.addColorStop(1,'#fff0');box(-280,-117,560,234,g)}},1-a),lerp(.12,1,a),-14*dr*(1-a));
 }else if(!active('Nested edit')){
  const a=cue(t,30.2,31.2),b=cue(t,31.4,32.1);
  workstation(()=>box(-167,-101,334,202,'#d8e6e7'),{z:lerp(2,.97,p('Window travel',2.3)),exterior:b?['pagoda','coast',b]:['london','pagoda',a]});
  if(t>32)icon('●','TEAM',480,232,1,cue(t,32,32.7));
 }else if(!active('Clapperboards')){
  const a=p('Nested edit',3.3);workstation(interfaceArt,{z:lerp(2.7,1,a),person:false});
 }else if(!active('Process cards')){
  const boards=!active('Workflow icons');
  const a=p('Workflow icons',.65),x=lerp(0,90,cue(t,48,49))-lerp(0,175,cue(t,50.7,52.5))+lerp(0,85,cue(t,54,55));
  workstation(()=>{interfaceArt();if(!boards){box(-167,-101,334,202,'#11131a');mark(0,0,36)}},{z:1,offset:boards?0:x*dr*tr,person:t<48,exterior:boards?['london']:null});
  if(boards){for(let i=0;i<5;i++){const u=clamp((t-40-i*.5)/3.1);if(u>0&&u<1)group('icons',lerp(-150,1110,u)*dr+(dr<0?960:0),i%2?420:110,()=>{box(-45,-26,90,60,'#151922');for(let j=0;j<5;j++)box(-41+j*17,-30,8,11,'#e1e0d8')},i%2?1.5:.65,i*8)}}
  else {if(t<48.2||t>=53.3)icon('◎','ALGORITHM',480,245,1,a);if(t>=47.6&&(t<50.8||t>=53.3))icon('●','HIRING',236,250,.83,cue(t,47.6,48.3));if(t>=50.5)icon('$','SPONSORS',724,250,.83,cue(t,50.5,51.2));}
 }else if(!active('Niche choices')){
  const a=p('Process cards',.9);['CREATE','GROW','MONETIZE'].forEach((s,i)=>group('cards',235+i*245,270+170*(1-cue(t,57+i*.14,57.8+i*.14)),()=>panel(148,163,()=>{text(['▶','↗','$'][i],0,-20,46,gold);text(s,0,41,18)},1-a)));
  const d=cue(t,59,60.2);for(let i=0;i<66*d;i++){const x=14+i*14;box(dr>0?x:W-x,285+Math.sin(i*.28)*22,4,4,'#eee5d7')}
 }else if(!active('Subscriber counter')){
  pic('wood',480,270,W,H);const a=p('Blueprint',1.9);
  group('blueprint',480,lerp(350,275,a),()=>panel(435,245,()=>{box(-216,-121,432,242,'#134b7b');c.strokeStyle='#8cd2f7';for(let i=0;i<5;i++)c.strokeRect(-155+i*14,-79+i*12,310-i*28,158-i*24);text('CREATOR BLUEPRINT',0,0,28)},.45*(1-a)),lerp(.55,1.3,a));
  if(t<66.5){viewer(480,330,.9);['TRUE CRIME','HISTORY','TECH','FINANCE','SPORTS'].forEach((s,i)=>icon(['◎','▤','⌘','$','●'][i],s,190+(i%3)*290,i<3?140:330,.75,cue(t,62+i*.43,62.7+i*.43)))}
 }else if(!active('Offer')){
  c.save();c.translate(480,270);c.scale(2.9,2.65);interfaceArt();c.restore();box(0,0,W,H,'#030509a8');
  group('counter',480,260,()=>{mark(0,-40,58);const a=p('Subscriber counter',2.3);text(Math.round(a*f.copy.counter).toLocaleString('en-US')+'+',0,77,54)});
 }else if(!active('Profiles')){
  grid();const a=p('Offer',1.3);
  group('cards',480,270,()=>panel(660,320,()=>{text(f.copy.offer,0,-108,31,gold);['LESSONS','COMMUNITY','SUPPORT'].forEach((s,i)=>{box(-295+i*201,-50,182,152,'#14151a');text(s,-204+i*201,19,20)})},(1-a)*dr),lerp(.4,1,a));
 }else if(!active('Community message')){
  grid();for(let i=0;i<4;i++){const a=cue(t,87+i*.25,87.7+i*.25);group('profiles',360+i%2*240,172+Math.floor(i/2)*180+65*(1-a),()=>panel(203,150,()=>{mark(0,-20,28);text('CREATOR '+(i+1),0,44,17)}),a,0,a)}
 }else if(!active('Clock and cash')){
  const a=p('Monitor reveal',2.7);
  if(a<1){c.save();c.globalAlpha=1-a;grid();group('message',480,270,()=>message(),lerp(.8,.52,a));c.restore()}
  if(a>0){c.save();c.globalAlpha=a;workstation(()=>message(286),{z:lerp(2.5,1,a),person:a>.55});c.restore()}
 }else if(!active('Award')){
  workstation(()=>message(286));const a=p('Clock and cash',1);
  group('clock',480,239,()=>{c.strokeStyle='#deefff';c.lineWidth=5;c.beginPath();c.arc(0,0,157,0,Math.PI*2);c.stroke();for(let i=1;i<=12;i++)text(i,132*Math.sin(i*Math.PI/6),-132*Math.cos(i*Math.PI/6),21);for(let i=0;i<2;i++){c.save();c.rotate((t-104.5)*(i?2.3:.8)*dr);box(-3,-116+i*35,6,123-i*35,'#e6f1ff');c.restore()}},a,0,a);
  viewer();for(const side of [-1,1])for(let i=0;i<4;i++)pic('cash',480+side*(lerp(560,327,a)+i*16),386-i*19,198,90,a,side*(16+i*12));
  if(t>107.7){c.save();c.globalCompositeOperation='screen';pic('flame',480,370,960,390,cue(t,107.7,108.4));c.restore()}
 }else{
  grid();flecks(t-108,48,'dust');
  const call=p('Call to action',.55), url=cue(t,116.7,116.9), offer=p('Offer line',.75);
  group('copy',480,244,()=>{if(call<1){c.save();c.globalAlpha=offer*(1-call);box(-330,-22,660,44,'#bb7826');text(f.copy.offer,0,0,34);c.restore()}if(call){c.save();c.globalAlpha=1-url;text(f.copy.cta.slice(0,Math.ceil(f.copy.cta.length*call)),0,0,36);c.globalAlpha=url;text(f.copy.url,0,0,36);c.restore()}});
  group('arrows',480,315,()=>{for(let i=-1;i<=1;i++)text('↓',i*76,4*Math.sin(t*4+i*.2),57,gold)},1,0,call);
  const exit=p('Offer line',.65),award=p('Award',.6);
  if(exit<1)group('award',480+dr*tr*740*exit,278,()=>{const g=c.createLinearGradient(-165,0,155,0);g.addColorStop(0,'#876035');g.addColorStop(clamp(.42+.25*Math.sin(t*2),.1,.9),'#fff0a4');g.addColorStop(1,'#956028');box(-164,-189,328,378,g);text('▶',0,-58,83,'#46351b');text('CREATOR AWARD',0,82,21,'#534020')},lerp(.7,1.62,exit),-12+exit*22,award);
  if(t<109.15){c.save();c.globalCompositeOperation='screen';pic('flame',480,350,960,430,1-cue(t,108.45,109.15));c.restore()}
 }
 if(f.exposure<1)box(0,0,W,H,'rgba(0,0,0,'+(1-f.exposure)+')');
 c.restore();
}
