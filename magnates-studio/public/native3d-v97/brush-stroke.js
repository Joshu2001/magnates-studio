import{paintColorBrush}from'./surface-tools.js';
import * as T from '../vendor/three.module.js';
import{StrokeSampler,meshRevision,nodeRevision}from'./edit-core.js';
import{sculpt,paintWeights}from'./workshop.js';
// A replayable, single-surface gesture. Null points explicitly break the path.
export function applyBrushStroke(n,mesh,request){
 if(request.version!==1||request.space!=='bind-local'||request.units!=='m'||request.surface!==mesh.userData.surface||request.topology!==meshRevision(mesh.geometry))throw Error('Invalid stroke target, units or topology');
 if(request.expectedRevision!==undefined&&request.expectedRevision!==nodeRevision(n))throw Error('Stale stroke revision');
 if(!Array.isArray(request.points)||!request.points.length||request.points.length>10000||request.points.some(p=>p!==null&&(!Array.isArray(p)||p.length!==3||p.some(v=>!Number.isFinite(v)||Math.abs(v)>100))))throw Error('Invalid stroke path');
 const brush=request.brush||{},spacing=brush.spacing??.2;if(!Number.isFinite(spacing)||spacing<.05||spacing>1||!Number.isFinite(brush.radius)||brush.radius<.005||brush.radius>.25||!Number.isFinite(brush.strength)||brush.strength<.0001||brush.strength>.02)throw Error('Invalid stroke brush');
 const source=mesh.geometry.clone(),p=source.attributes.position,sampler=new StrokeSampler(brush.radius*spacing);let dabs=0,changed=0;
 try{for(const point of request.points){if(point===null){sampler.break();continue;}for(const center of sampler.sample(point)){let nearest=0,best=Infinity;for(let i=0;i<p.count;i++){const d=Math.hypot(p.getX(i)-center[0],p.getY(i)-center[1],p.getZ(i)-center[2]);if(d<best){best=d;nearest=i;}}changed+=(brush.mode==='weight'?paintWeights:brush.mode==='color'?paintColorBrush:sculpt)(n,mesh,nearest,{...brush,center,sourceGeometry:source});dabs++;}}return{operation:'brush-stroke',dabs,vertexVisits:changed,surface:request.surface,units:'m',space:'bind-local'};}finally{source.dispose();}
}
