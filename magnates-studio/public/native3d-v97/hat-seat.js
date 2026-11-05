import * as T from'../vendor/three.module.js';
// Fit the crown opening in the tilted brim plane, not an unrelated horizontal slice.
export function fitHatSeat(geometry,fit){const p=geometry.attributes.position,top=Math.max(...Array.from({length:p.count},(_,i)=>p.getY(i))),q=new T.Quaternion().setFromEuler(new T.Euler((fit.tilt??-4)*Math.PI/180,0,(fit.roll??0)*Math.PI/180)),inverse=q.clone().invert(),center=new T.Vector3(0,top-.055,0);let bounds;
 for(let pass=0;pass<2;pass++){const points=[];for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i).sub(center).applyQuaternion(inverse);if(Math.abs(v.y)<.006)points.push(v);}if(points.length<8)throw Error('Hat seating plane misses skull');bounds={minX:Math.min(...points.map(v=>v.x)),maxX:Math.max(...points.map(v=>v.x)),minZ:Math.min(...points.map(v=>v.z)),maxZ:Math.max(...points.map(v=>v.z))};const offset=new T.Vector3((bounds.minX+bounds.maxX)/2,0,(bounds.minZ+bounds.maxZ)/2).applyQuaternion(q);center.add(offset);}
 center.add(new T.Vector3(fit.offsetX||0,fit.lift||0,fit.offsetZ||0));return{center,width:(bounds.maxX-bounds.minX)/.158*1.02,depth:(bounds.maxZ-bounds.minZ)/(.158*1.13)*1.02};
}
