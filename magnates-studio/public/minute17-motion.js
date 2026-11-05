/** Reusable deterministic 2.5D tools. Pixels at 960×540; seconds; degrees. */
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,p)=>a+(b-a)*p;
export const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
export const progress=(t,a,b)=>ease((t-a)/(b-a));
export function pathPose(t,{start=0,end=1,from=[0,0,1,0],to=[0,0,1,0],reverse=false}={}){const p=progress(t,start,end),q=reverse?1-p:p;return {x:mix(from[0],to[0],q),y:mix(from[1],to[1],q),scale:mix(from[2],to[2],q),rotation:mix(from[3],to[3],q)}}
export function splitPose(t,{start=35.5,duration=3,gap=160,tilt=28,side=-1}={}){const p=progress(t,start,start+duration);return{x:side*gap*p,y:side*55*p,rotation:side*tilt*p,scale:mix(1,.64,p),progress:p}}
export function flare(c,t,{start=35.5,duration=3,strength=1,x=480,y=270}={}){const p=clamp((t-start)/duration),a=Math.sin(p*Math.PI)*strength;if(!a)return;c.save();c.globalCompositeOperation='screen';const g=c.createRadialGradient(x,y,0,x,y,500);g.addColorStop(0,`rgba(255,255,255,${clamp(a)})`);g.addColorStop(.12,`rgba(219,243,255,${clamp(a*.8)})`);g.addColorStop(.45,`rgba(140,177,211,${clamp(a*.3)})`);g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(0,0,960,540);c.translate(x,y);c.filter="blur(9px)";for(let i=0;i<38;i++){c.rotate(2.39996);c.fillStyle=`rgba(220,239,255,${a*.08})`;c.beginPath();c.moveTo(0,0);c.lineTo(600,-4-12*Math.sin(i));c.lineTo(600,4+12*Math.sin(i));c.fill()}for(let i=0;i<20;i++){const theta=i*2.399+t*.17,rad=80+150*(.5+.5*Math.sin(i*3.1)),xx=Math.cos(theta)*rad,yy=Math.sin(theta)*rad,r=65+40*Math.sin(i*2);const mist=c.createRadialGradient(xx,yy,0,xx,yy,r);mist.addColorStop(0,`rgba(185,211,228,${a*.12})`);mist.addColorStop(1,'rgba(185,211,228,0)');c.fillStyle=mist;c.fillRect(xx-r,yy-r,r*2,r*2)}c.restore()}
export const effectLibrary=[
{id:'layer-path',description:'Replaceable sprite travel with position, scale, rotation and reversible time',units:'px, seconds, degrees',defaults:{start:0,end:1,from:[0,0,1,0],to:[0,0,1,0]}},
{id:'family-panel-rise',description:'Masked panel rise with separate adult, son, logo and reflection',defaults:{redStart:12.5,blueStart:13.1,riseDuration:2.3,exitStart:25.5,exitEnd:27.3}},
{id:'framed-photo-retreat',description:'One archival image moves as a framed plane; subject pixels stay coherent',defaults:{start:25.5,end:35.5,startWidth:650,endWidth:410,perspective:.04}},
{id:'photo-split-flare',description:'Complementary masks split the same photo into cyan/red fragments',defaults:{start:35.5,duration:3,gap:160,tilt:28,fadeStart:38.5,fadeEnd:41}},
{id:'rain-fog-reflection',description:'Seeded rain, drifting fog, mirrored masked image reflections',defaults:{seed:17,rainCount:180,rainSpeed:.65,rainOpacity:.22,fogOpacity:.12}},
{id:'original-motion-bridge',description:'Editable original graphics replacing sponsor visuals; no sponsor identity',defaults:{start:43,end:60,title:'REGAARDER',subtitle:'MOTION ATELIER'}}];
