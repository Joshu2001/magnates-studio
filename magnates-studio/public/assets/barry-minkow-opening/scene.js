(function(){
'use strict';
const W=1280,H=720,D=8,cv=document.getElementById('stage'),ctx=cv.getContext('2d',{alpha:false});
const root='assets/';
const specs=[['sky','sacramento-storm-sky.webp'],['city','sacramento-skyline.webp'],['tower','sacramento-tower-podium-cutout.webp'],['corridor','construction-corridor.webp'],['portraitBackground','portrait-facade-background.webp'],['portrait','barry-minkow-caption-free-portrait.webp']];
const images={}; let ready=false,playing=true,anchor=performance.now(),anchorT=0,lastBeat=-1;
const beats=[
 {a:0,b:.72,label:'A full-frame optical flare contracts to a hot spot, then dissipates',layers:['Contracting flash','Film texture']},
 {a:.55,b:1.45,label:'Storm sky and Sacramento emerge',layers:['Moving storm sky','City plate','Film grain']},
 {a:1.45,b:2.65,label:'The blue construction tower and illuminated podium emerge as one cutout',layers:['Tower + podium cutout','City plate','Storm sky']},
 {a:2.65,b:3.85,label:'A warm searchlight scans the facade',layers:['Searchlight beam','Tower cutout']},
 {a:3.85,b:5.05,label:'Textured gold “SACRAMENTO” glides right across the podium',layers:['Editable location text','Facade-texture fill','Tower + podium cutout']},
 {a:5.05,b:6.35,label:'A gold-edged occlusion reveals the unfinished corridor',layers:['Corridor plate','Gold wipe']},
 {a:6.35,b:7.12,label:'The corridor advances toward camera',layers:['Corridor plate']},
 {a:7.12,b:8,label:'Flash cut: separate facade and portrait layers assemble',layers:['Facade background','Caption-free portrait cutout']}
];
function E(id,file){const im=new Image();im.onload=()=>{images[id]=im;if(Object.keys(images).length===specs.length){ready=true;renderAt(0);}};im.onerror=()=>console.error('Missing Barry opening asset',file);im.src=root+file;}
specs.forEach(s=>E(s[0],s[1]));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,p)=>a+(b-a)*p;
function cover(im,x,y,w,h,z=1,dx=0,dy=0){if(!im)return;const s=Math.max(w/im.width,h/im.height)*z,iw=im.width*s,ih=im.height*s;ctx.drawImage(im,x+(w-iw)/2+dx,y+(h-ih)/2+dy,iw,ih);}
function vignette(power=0.64){const g=ctx.createRadialGradient(W*.51,H*.46,170,W*.5,H*.5,770);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.68,'rgba(0,0,0,.14)');g.addColorStop(1,'rgba(0,0,0,'+power+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function text(str,x,y,size,align='left',alpha=1,tracking=0){if(!str)return;ctx.save();ctx.globalAlpha=alpha;ctx.textAlign=align;ctx.textBaseline='middle';ctx.font='800 '+size+'px Arial, sans-serif';ctx.letterSpacing=tracking+'px';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=18;ctx.shadowOffsetY=3;const grad=ctx.createLinearGradient(0,y-size/2,0,y+size/2);grad.addColorStop(0,'#ffe39b');grad.addColorStop(.55,'#e4b64c');grad.addColorStop(1,'#a86d20');ctx.fillStyle=grad;ctx.fillText(str,x,y);ctx.restore();}
function drawSkyCity(t){
 // Pan the cloud plate independently, then hold the city farther back for restrained 2.5D parallax.
 ctx.save();ctx.globalAlpha=.96;cover(images.city,-10,0,W+20,H,1.04+Math.sin(t*.42)*.008,-10+Math.sin(t*.35)*12,0);ctx.restore();
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,440);ctx.clip();ctx.globalAlpha=.62;ctx.globalCompositeOperation='multiply';cover(images.sky,-80+((t*17)%100),-8,W+160,500,1.08,0,Math.sin(t*.2)*6);ctx.restore();
 const haze=ctx.createLinearGradient(0,345,0,590);haze.addColorStop(0,'rgba(19,29,38,0)');haze.addColorStop(.58,'rgba(174,125,76,.14)');haze.addColorStop(1,'rgba(2,6,10,.58)');ctx.fillStyle=haze;ctx.fillRect(0,330,W,300);
}
function drawTower(t){
 const reveal=smooth((t-1.05)/.95), close=smooth((t-2.2)/1.25), pull=smooth((t-3.6)/.8);
 if(reveal<=0)return;
 const h=mix(430,660,close)*(1-.12*pull),w=h*(images.tower.width/images.tower.height),cx=830+mix(35,0,close)-10*pull,base=H+5;
 const x=cx-w/2,y=base-h;
 ctx.save();ctx.globalAlpha=reveal*(1-.12*pull);ctx.shadowColor='rgba(237,162,70,.25)';ctx.shadowBlur=26;ctx.drawImage(images.tower,x,y,w,h);ctx.restore();
 return {x,y,w,h};
}
function drawSearchlight(t){const p=clamp((t-2.55)/1.35);if(p<=0||p>=1)return;const sw=smooth(p),x=1010-540*sw+Math.max(0,(p-.84)/.16)*100,cy=318+Math.sin(p*Math.PI)*20;
 ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=Math.sin(p*Math.PI)*.75;
 const beam=ctx.createLinearGradient(x-185,cy-165,x+205,cy+135);beam.addColorStop(0,'rgba(255,200,105,0)');beam.addColorStop(.45,'rgba(255,205,124,.1)');beam.addColorStop(.54,'rgba(255,219,155,.5)');beam.addColorStop(.62,'rgba(255,180,78,.16)');beam.addColorStop(1,'rgba(255,150,60,0)');ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(1188,148);ctx.lineTo(x-88,cy+98);ctx.lineTo(x+106,cy+116);ctx.lineTo(1210,167);ctx.closePath();ctx.fill();ctx.globalAlpha*=1.4;ctx.fillStyle='rgba(255,195,105,.22)';ctx.beginPath();ctx.moveTo(1188,148);ctx.lineTo(x-70,cy+102);ctx.lineTo(x+82,cy+116);ctx.lineTo(1210,167);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,230,183,.72)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1184,151);ctx.lineTo(x+5,cy+108);ctx.stroke();
 const glow=ctx.createRadialGradient(x,cy,2,x,cy,230);glow.addColorStop(0,'rgba(255,221,159,.34)');glow.addColorStop(1,'rgba(255,175,72,0)');ctx.fillStyle=glow;ctx.fillRect(x-240,cy-200,480,400);ctx.restore();}
function drawGoldTitle(t,tower){const p=smooth((t-3.65)/.9);if(p<=0||!tower)return;
 const loc=smooth((t-2.25)/.34)*(1-smooth((t-4.78)/.48));if(loc<=0)return;
 const label=(document.getElementById('location')?.value||'SACRAMENTO').toUpperCase();
 const startX=610,endX=720,x=mix(startX,endX,smooth((t-3.75)/.78)),y=tower.y+tower.h*.855,size=29;
 // Make the letters from the actual podium pixels, then glaze them with translucent gold.
 const mask=document.createElement('canvas');mask.width=W;mask.height=H;const m=mask.getContext('2d');m.font='800 '+size+'px Arial, sans-serif';m.textBaseline='middle';m.textAlign='left';m.letterSpacing='2px';m.fillStyle='#fff';m.fillText(label,x,y);
 const ink=document.createElement('canvas');ink.width=W;ink.height=H;const ic=ink.getContext('2d');ic.drawImage(images.tower,tower.x,tower.y,tower.w,tower.h);ic.globalCompositeOperation='destination-in';ic.drawImage(mask,0,0);ic.globalCompositeOperation='source-atop';ic.fillStyle='rgba(235,169,48,.62)';ic.fillRect(0,0,W,H);
 ctx.save();ctx.globalAlpha=loc;ctx.shadowColor='rgba(255,188,67,.42)';ctx.shadowBlur=11;ctx.drawImage(ink,0,0);ctx.restore();
}
function drawCorridor(t){const p=smooth((t-5.05)/1.12);if(!p)return;
 ctx.save();ctx.beginPath();ctx.rect(0,H*(1-p),W,H*p);ctx.clip();const z=1.02+Math.max(0,t-5.1)*.035;cover(images.corridor,0,0,W,H,z,0,-4);ctx.restore();
 const y=H*(1-p);if(p<1){const g=ctx.createLinearGradient(0,y-18,0,y+34);g.addColorStop(0,'rgba(255,230,150,0)');g.addColorStop(.36,'rgba(255,207,91,.92)');g.addColorStop(1,'rgba(153,92,24,0)');ctx.fillStyle=g;ctx.fillRect(0,y-18,W,54);}
}
function drawPortrait(t){const p=smooth((t-7.12)/.42);if(!p)return;
 ctx.save();ctx.globalAlpha=p;cover(images.portraitBackground,0,0,W,H,1.05+Math.max(0,t-7.2)*.12,-5,-2);
 const h=620,w=h*(images.portrait.width/images.portrait.height),x=234,y=H+20-h;
 ctx.globalAlpha=p;ctx.shadowColor='rgba(0,0,0,.65)';ctx.shadowBlur=30;ctx.drawImage(images.portrait,x,y,w,h);ctx.restore();
}
function addTexture(t){ctx.save();const seed=Math.floor(t*24);for(let i=0;i<380;i++){const n=(i*9301+seed*49297+233280)%233280/233280;const m=(i*4751+seed*21831+67589)%233280/233280;ctx.globalAlpha=.025+n*.035;ctx.fillStyle=i%5?'#fff':'#ad7f50';ctx.fillRect(n*W,m*H,1+(i%3),1+(i%2));}ctx.globalAlpha=.08;ctx.fillStyle='#d8c59c';for(let i=0;i<7;i++){const x=((i*193+seed*7)%W);ctx.fillRect(x,0,1,H);}ctx.restore();}
function renderAt(raw){if(!ready)return;const t=clamp(Number(raw)||0,0,D);ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
 drawSkyCity(t);const tower=drawTower(t);drawSearchlight(t);drawGoldTitle(t,tower);drawCorridor(t);drawPortrait(t);vignette(.55);addTexture(t);
 // The opening flare begins beyond the frame edge, draws inward, and fades.
 const radius=mix(1120,70,smooth(t/.66)),flash=1-smooth(t/.72);
 const cut=Math.exp(-Math.pow((t-7.12)/.10,2))*.78;const f=Math.max(flash,cut);if(f>.004){const g=ctx.createRadialGradient(640,350,Math.max(1,radius*.012),640,350,Math.max(20,radius));g.addColorStop(0,'rgba(255,255,248,'+Math.min(.99,f)+')');g.addColorStop(.48,'rgba(255,250,230,'+(f*.98)+')');g.addColorStop(1,'rgba(255,242,213,'+(f*.82)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
 document.getElementById('scrub').value=t;document.getElementById('clock').textContent='00:'+String(Math.floor(t)).padStart(2,'0')+'.'+String(Math.floor((t%1)*100)).padStart(2,'0')+' / 00:08.00';
 const idx=beats.findIndex(b=>t>=b.a&&t<b.b)||0;if(idx!==lastBeat){lastBeat=idx;document.getElementById('beat').textContent=beats[idx].label;document.getElementById('layers').innerHTML=beats[idx].layers.map(x=>'<span class="chip">'+x+'</span>').join('');}
}
function tick(now){if(playing){const t=(anchorT+(now-anchor)/1000)%D;renderAt(t);}requestAnimationFrame(tick);}
document.getElementById('play').onclick=()=>{playing=!playing;if(playing){anchor=performance.now();anchorT=Number(document.getElementById('scrub').value);}document.getElementById('play').textContent=playing?'Pause':'Play';};
document.getElementById('restart').onclick=()=>{anchor=performance.now();anchorT=0;playing=true;document.getElementById('play').textContent='Pause';renderAt(0);};
document.getElementById('scrub').oninput=e=>{playing=false;document.getElementById('play').textContent='Play';renderAt(Number(e.target.value));};
document.getElementById('location').addEventListener('input',()=>renderAt(Number(document.getElementById('scrub').value)));
window.renderBarryAt=renderAt;window.barryAssetsReady=()=>ready;window.barrySequence={fps:24,duration:D,width:W,height:H,beats};requestAnimationFrame(tick);
})();
