// Smooth, fitted, skinned waist trim sampled from the body cross-section.
import * as T from '../vendor/three.module.js';
export function shirtHem(data,positions,normals){
 const candidates=[];for(let i=0;i<data.vertices.length;i++){const p=data.vertices[i];if(p[1]>.94&&p[1]<1.04&&Math.abs(p[0])<.25)candidates.push(i);}
 const pos=[],si=[],sw=[],index=[],female=[],segments=96,levels=[.961,.964,.971,.990,1.002,1.005],lift=[.001,.003,.005,.005,.003,.001];
 for(let row=0;row<levels.length;row++){const y=levels[row],samples=[];for(let j=0;j<segments;j++){const a=j/segments*Math.PI*2;let best=Infinity,id=0;for(const i of candidates){const p=data.vertices[i],angle=Math.atan2(p[2],p[0]),da=Math.atan2(Math.sin(a-angle),Math.cos(a-angle)),score=Math.abs(p[1]-y)+Math.abs(da)*.08;if(score<best){best=score;id=i;}}const p=data.vertices[id];samples.push({id,r:Math.hypot(p[0],p[2])});}
 for(let pass=0;pass<4;pass++){const values=samples.map((s,j)=>(samples[(j+segments-1)%segments].r+s.r*2+samples[(j+1)%segments].r)/4);samples.forEach((s,j)=>s.r=values[j]);}
 for(let j=0;j<=segments;j++){const a=j/segments*Math.PI*2,s=samples[j%segments],r=s.r+lift[row];pos.push(Math.cos(a)*r,y,Math.sin(a)*r);si.push(...data.skinIndices[s.id]);sw.push(...data.skinWeights[s.id]);female.push(data.shapeTargets?.female?.[s.id]||[0,0,0]);if(row<levels.length-1&&j<segments){const k=row*(segments+1)+j;index.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(index);g.setAttribute('skinIndex',new T.Uint16BufferAttribute(si,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(sw,4));g.computeVertexNormals();return{geometry:g,female};
}
