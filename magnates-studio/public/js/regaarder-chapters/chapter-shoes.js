// Project-authored trainer geometry, not a scan or an identified branded product.
// The same editable mesh turns through upper, side, heel and outsole views.
const TAU=Math.PI*2,rad=Math.PI/180;
const noise=n=>{const v=Math.sin(n*17.13+4.7)*43117.3;return v-Math.floor(v)};
export function shoePose(age,o){const depth=Math.sin(age*(o.depthRate??.16)+(o.phase??0))*(o.depthTravel??0),perspective=6/Math.max(3,6+depth);return {x:o.x+Math.sin(age*(o.driftRate??.3)+(o.phase??0))*(o.driftX??12),y:o.y+Math.sin(age*.27+(o.phase??0))*(o.driftY??16),yaw:(o.yaw??0)+age*(o.yawSpeed??24),pitch:(o.pitch??0)+age*(o.pitchSpeed??8),roll:(o.roll??0)+age*(o.rollSpeed??4),size:(o.size??110)*perspective,depth}}
export function rotatePoint([x,y,z],pose){let a=(pose.pitch||0)*rad,b=(pose.yaw||0)*rad,d=(pose.roll||0)*rad;[y,z]=[y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];[x,z]=[x*Math.cos(b)+z*Math.sin(b),-x*Math.sin(b)+z*Math.cos(b)];return [x*Math.cos(d)-y*Math.sin(d),x*Math.sin(d)+y*Math.cos(d),z]}
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16))}
const cached=new Map();
// Raised heel, narrow waist, broad forefoot and lifted rounded toe.
const profile=[[-1.46,.025,.46],[-1.34,.27,.62],[-1.08,.34,.67],[-.72,.34,.58],[-.25,.32,.43],[.25,.43,.32],[.78,.49,.26],[1.16,.4,.21],[1.43,.16,.14],[1.48,.015,.08]];
function last(x){let i=0;while(i<profile.length-2&&x>profile[i+1][0])i++;const a=profile[i],b=profile[i+1],q=Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));return {w:a[1]+(b[1]-a[1])*q,h:a[2]+(b[2]-a[2])*q,lift:.045*Math.max(0,(x-.7)/.78)**2}}
function upperPoint(x,angle,offset=0){const p=last(x);return [x,-.12+Math.cos(angle)*(p.h+offset)+p.lift,Math.sin(angle)*(p.w+offset)]}
export function shoeMesh(style='stripes',upper='#bfc5ca',accent='#a72d35',sole='#c5bfae',spikeLength=.28){
 const key=[style,upper,accent,sole,spikeLength].join();if(cached.has(key))return cached.get(key);const faces=[],N=30,M=18;
 const quad=(p,color,material='leather',grain=1)=>faces.push({p,color,material,grain});
 // Layered rubber sole, with a flat underside and a narrow welt.
 for(let i=0;i<N;i++)for(let j=0;j<M;j++){
  const at=(i,j)=>{const x=-1.46+i/N*2.94,p=last(x),a=j/M*TAU,s=Math.sin(a);return [x,-.235+Math.sign(s)*Math.abs(s)**.28*.105+p.lift,Math.cos(a)*(p.w+.025)]};
  quad([at(i,j),at(i+1,j),at(i+1,j+1),at(i,j+1)],j<M/2?sole:'#776f62','rubber',.98+noise(i*19+j)*.035);
 }
 // Upper follows a shoe last rather than a closed ellipsoid. Leave an ankle opening.
 for(let i=0;i<N;i++)for(let j=0;j<M;j++){
  const x=-1.46+i/N*2.94,X=-1.46+(i+1)/N*2.94,a=-Math.PI/2+j/M*Math.PI,b=-Math.PI/2+(j+1)/M*Math.PI;
  if(x> -1.27&&X<-.61&&Math.abs((a+b)/2)<.63)continue;
  const panel=style==='runner'&&(x< -1.18||x>.98),color=panel?accent:upper;
  quad([upperPoint(x,a),upperPoint(X,a),upperPoint(X,b),upperPoint(x,b)],color,'leather',.98+noise(i*23+j)*.04);
 }
 // Recessed footbed, inner walls and padded collar give the opening real depth.
 for(let j=0;j<28;j++){
  const a=j/28*TAU,b=(j+1)/28*TAU;
  const ring=(a,r,y)=>[-.96+Math.cos(a)*r,y,Math.sin(a)*r*.69];
  quad([[-.96,.31,0],ring(a,.28,.31),ring(b,.28,.31)],'#202126','fabric');
  quad([ring(a,.28,.31),ring(a,.28,.55),ring(b,.28,.55),ring(b,.28,.31)],'#353637','fabric');
  quad([ring(a,.28,.55),ring(a,.36,.60),ring(b,.36,.60),ring(b,.28,.55)],upper,'fabric');
 }
 // Tongue, eyelets and crossed lace ribbons.
 for(let i=0;i<10;i++){const x=-.65+i*.105,X=x+.105;quad([upperPoint(x,-.42,.025),upperPoint(X,-.42,.025),upperPoint(X,.42,.025),upperPoint(x,.42,.025)],upper,'fabric')}
 for(const side of [-1,1])for(let j=0;j<6;j++){
  const x=-.56+j*.16,p=upperPoint(x,side*.56,.036);
  quad([[p[0]-.022,p[1]+.006,p[2]-.018],[p[0]+.022,p[1]+.006,p[2]-.018],[p[0]+.022,p[1]+.006,p[2]+.018],[p[0]-.022,p[1]+.006,p[2]+.018]],'#6b6961','rubber');
  const r=upperPoint(x+.13,-side*.53,.055);
  quad([p,[p[0]+.028,p[1]+.012,p[2]],r,[r[0]-.028,r[1]+.012,r[2]]],'#e6e0cf','fabric');
 }
 // Striped trainers use colour bands; runners have unbranded panel seams.
 for(const side of [-1,1]){
  if(style==='stripes')for(let k=0;k<3;k++)for(let j=0;j<7;j++){
   const a=.53+j*.125,b=a+.125,x=-.42+k*.27+(a-.53)*.24;
   quad([upperPoint(x,side*a,.012),upperPoint(x+.14,side*a,.012),upperPoint(x+.17,side*b,.012),upperPoint(x+.03,side*b,.012)],accent);
  }
  for(const x of [-1.17,.87])for(let j=0;j<14;j++){
   const a=side*(.1+j*.1),b=side*(.1+(j+1)*.1);
   quad([upperPoint(x,a,.008),upperPoint(x+.018,a,.008),upperPoint(x+.018,b,.008),upperPoint(x,b,.008)],style==='runner'?sole:'#9c978b','fabric');
  }
  for(let j=0;j<26;j++){const x=-1.3+j*.1,X=x+.055,p=last(x),P=last(X);quad([[x,-.12+p.lift,side*(p.w+.022)],[X,-.12+P.lift,side*(P.w+.022)],[X,-.105+P.lift,side*(P.w+.023)],[x,-.105+p.lift,side*(p.w+.023)]],'#e0d7c3','rubber')}
 }
 // Outsole blocks and centre channel remain visible through an underside turn.
 for(let j=0;j<19;j++)for(const side of [-1,1]){
  const x=-1.25+j*.135,p=last(x),w=p.w*.78,y=-.345+p.lift;
  quad([[x,y,side*.045],[x+.055,y,side*.045],[x+.08,y,side*w],[x+.025,y,side*w]],'#625f57','rubber');
 }
 if(style==='spikes'&&spikeLength>0)for(const x of [-.8,.4,1])for(const z of [-.19,.19])for(let k=0;k<8;k++){const a=k/8*TAU,b=(k+1)/8*TAU;quad([[x+Math.cos(a)*.055,-.35,z+Math.sin(a)*.055],[x+Math.cos(b)*.055,-.35,z+Math.sin(b)*.055],[x,-.35-spikeLength,z]],'#b8bcc1','metal');}
 if(cached.size>24)cached.clear();cached.set(key,faces);return faces;
}
const buffers=new Map();
export function paintShoe(c,age,o,global={}){
 const screen=c;let buffer=buffers.get(o.id||o.name);if(!buffer){buffer=document.createElement('canvas');buffer.width=buffer.height=512;buffers.set(o.id||o.name,buffer)}c=buffer.getContext('2d');c.clearRect(0,0,512,512);
 const p=shoePose(age,o),mesh=shoeMesh(o.style,o.upper,o.accent,o.sole,o.spikeLength),scale=p.size/3,faces=mesh.map(face=>{const vertices=face.p.map(v=>rotatePoint(v,p));return {...face,v:vertices,z:vertices.reduce((s,v)=>s+v[2]/vertices.length,0)}}).sort((a,b)=>a.z-b.z);
 c.save();c.translate(256,256);c.globalAlpha=1;c.filter='none';
 for(const face of faces){const [a,b,d]=face.v,ab=b.map((v,i)=>v-a[i]),ad=d.map((v,i)=>v-a[i]),n=[ab[1]*ad[2]-ab[2]*ad[1],ab[2]*ad[0]-ab[0]*ad[2],ab[0]*ad[1]-ab[1]*ad[0]],len=Math.hypot(...n)||1,diffuse=Math.abs(n[0]*-.3+n[1]*.75+n[2]*.6)/len,glint=Math.pow(Math.abs(n[0]*.15+n[1]*.5+n[2]*.85)/len,18)*(face.material==='leather'?.09:.025),light=(.34+diffuse*.62+glint)*(o.brightness??1)*(global.light??1)*(face.grain??1),color=rgb(face.color);
  c.fillStyle=`rgb(${color.map(v=>Math.min(255,Math.round(v*light))).join(',')})`;c.beginPath();face.v.forEach(([x,y,z],i)=>{const k=6/(6-z*.17);i?c.lineTo(x*scale*k,-y*scale*k):c.moveTo(x*scale*k,-y*scale*k)});c.closePath();c.fill();
 }c.restore();screen.save();screen.globalAlpha*=o.opacity??1;screen.filter=`blur(${Math.max(0,(o.blur??0)+Math.abs(p.depth)*(o.depthBlur??.65))}px)`;screen.drawImage(buffer,p.x-256,p.y-256);screen.restore();
}
