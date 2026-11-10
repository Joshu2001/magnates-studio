(function(){
'use strict';
const W=1280,H=720,D=8,cv=document.getElementById('stage'),ctx=cv.getContext('2d',{alpha:false});
const root='assets/';
const specs=[['sky','sacramento-storm-sky.webp'],['city','sacramento-skyline.webp'],['tower','office-tower-cutout.webp'],['corridor','construction-corridor.webp'],['portraitBackground','portrait-facade-background.webp'],['portrait','barry-minkow-caption-free-portrait.webp']];
const images={}; let ready=false,playing=true,anchor=performance.now(),anchorT=0,lastBeat=-1;
const beats=[
 {a:0,b:.55,label:'Optical flash contracts and dissipates',layers:['Flash','Film texture']},
 {a:.55,b:1.45,label:'Storm sky and Sacramento emerge',layers:['Moving storm sky','City plate','Film grain']},
 {a:1.45,b:2.65,label:'The blue office tower rises into frame',layers:['Tower cutout','City plate','Storm sky']},
 {a:2.65,b:3.85,label:'A warm searchlight scans the facade',layers:['Searchlight beam','Tower cutout']},
 {a:3.85,b:5.05,label:'The gold title unfolds across the tower',layers:['Editable title','Gold reveal matte','Tower cutout']},
 {a:5.05,b:6.35,label:'A downward gold occlusion reveals the unfinished corridor',layers:['Corridor plate','Gold wipe','Allegation qualifier']},
 {a:6.35,b:7.12,label:'The corridor advances toward camera',layers:['Corridor plate','Allegation qualifier']},
 {a:7.12,b:8,label:'Flash cut: separate portrait and facade layers assemble',layers:['Facade background','Caption-free portrait cutout','Editable name title']}
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
 const h=mix(385,595,close)*(1-.24*pull),w=h*(images.tower.width/images.tower.height),cx=806+mix(65,0,close)-20*pull,base=H+85;
 ctx.save();ctx.globalAlpha=reveal*(1-.24*pull);ctx.shadowColor='rgba(237,162,70,.25)';ctx.shadowBlur=26;ctx.drawImage(images.tower,cx-w/2,base-h,w,h);ctx.restore();
}
function drawSearchlight(t){const p=clamp((t-2.55)/1.35);if(p<=0||p>=1)return;const sw=smooth(p),x=1010-540*sw+Math.max(0,(p-.84)/.16)*100,cy=318+Math.sin(p*Math.PI)*20;
 ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=Math.sin(p*Math.PI)*.75;
 const beam=ctx.createLinearGradient(x-185,cy-165,x+205,cy+135);beam.addColorStop(0,'rgba(255,200,105,0)');beam.addColorStop(.45,'rgba(255,205,124,.1)');beam.addColorStop(.54,'rgba(255,219,155,.5)');beam.addColorStop(.62,'rgba(255,180,78,.16)');beam.addColorStop(1,'rgba(255,150,60,0)');ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(1188,148);ctx.lineTo(x-88,cy+98);ctx.lineTo(x+106,cy+116);ctx.lineTo(1210,167);ctx.closePath();ctx.fill();ctx.globalAlpha*=1.4;ctx.fillStyle='rgba(255,195,105,.22)';ctx.beginPath();ctx.moveTo(1188,148);ctx.lineTo(x-70,cy+102);ctx.lineTo(x+82,cy+116);ctx.lineTo(1210,167);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,230,183,.72)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1184,151);ctx.lineTo(x+5,cy+108);ctx.stroke();
 const glow=ctx.createRadialGradient(x,cy,2,x,cy,230);glow.addColorStop(0,'rgba(255,221,159,.34)');glow.addColorStop(1,'rgba(255,175,72,0)');ctx.fillStyle=glow;ctx.fillRect(x-240,cy-200,480,400);ctx.restore();}
function drawGoldTitle(t){const p=smooth((t-3.75)/.95);if(p<=0)return;
 ctx.save();ctx.beginPath();ctx.rect(0,0,W*p,H);ctx.clip();ctx.globalAlpha=.14;const fill=ctx.createLinearGradient(0,430,0,622);fill.addColorStop(0,'rgba(247,190,65,.04)');fill.addColorStop(.5,'rgba(244,184,55,.6)');fill.addColorStop(1,'rgba(150,89,18,.32)');ctx.fillStyle=fill;ctx.fillRect(0,430,W,196);ctx.restore();
 const fa=smooth((t-3.95)/.45)*p;
 text((document.getElementById('hook')?.value||'').toUpperCase(),W*.52,516,48,'center',fa,1.2);text((document.getElementById('qualifier')?.value||'').toUpperCase(),W*.52,567,16,'center',fa,3.1);
 const loc=smooth((t-2.15)/.34)*(1-smooth((t-4.55)/.55));
 if(loc>0)text((document.getElementById('location')?.value||'').toUpperCase(),W*.08,594,20,'left',loc,3.4);
}
function drawCorridor(t){const p=smooth((t-5.05)/1.12);if(!p)return;
 ctx.save();ctx.beginPath();ctx.rect(0,H*(1-p),W,H*p);ctx.clip();const z=1.02+Math.max(0,t-5.1)*.035;cover(images.corridor,0,0,W,H,z,0,-4);ctx.restore();
 const y=H*(1-p);if(p<1){const g=ctx.createLinearGradient(0,y-18,0,y+34);g.addColorStop(0,'rgba(255,230,150,0)');g.addColorStop(.36,'rgba(255,207,91,.92)');g.addColorStop(1,'rgba(153,92,24,0)');ctx.fillStyle=g;ctx.fillRect(0,y-18,W,54);}
 const q=smooth((t-5.7)/.38);if(q>0){ctx.save();ctx.globalAlpha=q;ctx.font='700 16px Arial';ctx.textAlign='left';ctx.fillStyle='#edbd58';ctx.letterSpacing='3px';ctx.fillText((document.getElementById('qualifier')?.value||'').toUpperCase(),72,630);ctx.restore();}
}
function drawPortrait(t){const p=smooth((t-7.12)/.42);if(!p)return;
 ctx.save();ctx.globalAlpha=p;cover(images.portraitBackground,0,0,W,H,1.05+Math.max(0,t-7.2)*.12,-5,-2);
 const h=620,w=h*(images.portrait.width/images.portrait.height),x=234,y=H+20-h;
 ctx.globalAlpha=p;ctx.shadowColor='rgba(0,0,0,.65)';ctx.shadowBlur=30;ctx.drawImage(images.portrait,x,y,w,h);ctx.restore();
 const name=(document.getElementById('name')?.value||'').toUpperCase();text(name,850,543,56,'left',smooth((t-7.46)/.24),2.2);
}
function addTexture(t){ctx.save();const seed=Math.floor(t*24);for(let i=0;i<380;i++){const n=(i*9301+seed*49297+233280)%233280/233280;const m=(i*4751+seed*21831+67589)%233280/233280;ctx.globalAlpha=.025+n*.035;ctx.fillStyle=i%5?'#fff':'#ad7f50';ctx.fillRect(n*W,m*H,1+(i%3),1+(i%2));}ctx.globalAlpha=.08;ctx.fillStyle='#d8c59c';for(let i=0;i<7;i++){const x=((i*193+seed*7)%W);ctx.fillRect(x,0,1,H);}ctx.restore();}
function renderAt(raw){if(!ready)return;const t=clamp(Number(raw)||0,0,D);ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
 const pre=1-smooth((t-.02)/.62);drawSkyCity(t);drawTower(t);drawSearchlight(t);drawGoldTitle(t);drawCorridor(t);drawPortrait(t);vignette(.55);addTexture(t);
 // Film-flash starts the story and punctuates the portrait match cut; its bloom quickly shrinks away.
 const flash=Math.max(pre,Math.exp(-Math.pow((t-7.12)/.10,2))*.78);if(flash>.004){const g=ctx.createRadialGradient(640,350,20,640,350,850);g.addColorStop(0,'rgba(255,255,244,'+Math.min(.99,flash)+')');g.addColorStop(.45,'rgba(255,239,204,'+(flash*.45)+')');g.addColorStop(1,'rgba(255,239,204,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
 document.getElementById('scrub').value=t;document.getElementById('clock').textContent='00:'+String(Math.floor(t)).padStart(2,'0')+'.'+String(Math.floor((t%1)*100)).padStart(2,'0')+' / 00:08.00';
 const idx=beats.findIndex(b=>t>=b.a&&t<b.b)||0;if(idx!==lastBeat){lastBeat=idx;document.getElementById('beat').textContent=beats[idx].label;document.getElementById('layers').innerHTML=beats[idx].layers.map(x=>'<span class="chip">'+x+'</span>').join('');}
}
function tick(now){if(playing){const t=(anchorT+(now-anchor)/1000)%D;renderAt(t);}requestAnimationFrame(tick);}
document.getElementById('play').onclick=()=>{playing=!playing;if(playing){anchor=performance.now();anchorT=Number(document.getElementById('scrub').value);}document.getElementById('play').textContent=playing?'Pause':'Play';};
document.getElementById('restart').onclick=()=>{anchor=performance.now();anchorT=0;playing=true;document.getElementById('play').textContent='Pause';renderAt(0);};
document.getElementById('scrub').oninput=e=>{playing=false;document.getElementById('play').textContent='Play';renderAt(Number(e.target.value));};
for(const id of ['location','hook','qualifier','name'])document.getElementById(id).addEventListener('input',()=>renderAt(Number(document.getElementById('scrub').value)));
window.renderBarryAt=renderAt;window.barryAssetsReady=()=>ready;window.barrySequence={fps:24,duration:D,width:W,height:H,beats};requestAnimationFrame(tick);
})();
