// Deterministic, replaceable Canvas effects. t is seconds, coordinates normalized.
export const defaults={seed:17,rainCount:180,rainSpeed:.65,rainOpacity:.22,fogOpacity:.12,fogSpeed:.025,debrisCount:65};
const frac=x=>x-Math.floor(x);
const rand=(i,s)=>frac(Math.sin(i*127.1+s*311.7)*43758.5453);
export function rain(ctx,t,w,h,options={}){
 const o={...defaults,...options};ctx.save();ctx.strokeStyle=`rgba(195,229,255,${o.rainOpacity})`;ctx.lineWidth=Math.max(.5,w/1300);
 for(let i=0;i<o.rainCount;i++){let x=frac(rand(i,o.seed)+t*.035)*w,y=frac(rand(i+500,o.seed)+t*o.rainSpeed)*h,len=(.01+rand(i+900,o.seed)*.035)*h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len*.17,y+len);ctx.stroke();}ctx.restore();
}
export function fog(ctx,t,w,h,options={}){
 const o={...defaults,...options};ctx.save();ctx.globalCompositeOperation='screen';
 for(let i=0;i<7;i++){let x=frac(rand(i,o.seed)+t*o.fogSpeed)*w,y=h*(.55+rand(i+20,o.seed)*.35),r=w*.28;let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(120,151,192,${o.fogOpacity})`);g.addColorStop(1,'rgba(120,151,192,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}ctx.restore();
}
export function debris(ctx,t,w,h,options={}){
 const o={...defaults,...options};ctx.save();ctx.strokeStyle='rgba(200,216,230,.28)';
 for(let i=0;i<o.debrisCount;i++){const d=rand(i+40,o.seed),x=frac(rand(i,o.seed)+t*.007*(d+.1))*w,y=frac(rand(i+70,o.seed)-t*.012*(d+.1))*h;ctx.save();ctx.translate(x,y);ctx.rotate(t*.1+d*6);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(2+d*6,d);ctx.lineTo(1+d*4,1+d*3);ctx.lineTo(-1,d*2);ctx.closePath();ctx.stroke();ctx.restore();}ctx.restore();
}
// Reflect a layer using the same source transform, then mask/blur during composition.
export function reflection(ctx,img,x,y,w,h,{opacity=.18,blur=5,stretch=.4}={}){ctx.save();ctx.globalAlpha=opacity;ctx.filter=`blur(${blur}px)`;ctx.translate(x,y);ctx.scale(1,-stretch);ctx.drawImage(img,0,-h,w,h);ctx.restore();}
