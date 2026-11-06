// Canvas rendering of the same posed Three.js meshes when WebGL is unavailable.
// Geometry, skeletons, picking and edits stay in Native3DEngine; only drawing differs.
import * as T from '../vendor/three.module.js';
export class SoftwareRenderer {
  constructor(canvas){this.domElement=canvas;this.isSoftwareRenderer=true;this.shadowMap={enabled:false,type:0};this.autoClear=true;this.context=canvas.getContext('2d');if(!this.context)throw Error('Neither WebGL nor Canvas rendering is available');}
  setSize(w,h){this.domElement.width=w;this.domElement.height=h;}
  setPixelRatio(){} setClearAlpha(){} dispose(){} setRenderTarget(){} getRenderTarget(){return null;}
  clear(){this.context.clearRect(0,0,this.domElement.width,this.domElement.height);}
  texture(map){if(!map?.image)return null;this.textures??=new WeakMap();const cached=this.textures.get(map);if(cached?.version===map.version)return cached;try{const src=map.image,w=src.width||src.naturalWidth,h=src.height||src.naturalHeight;if(!w||!h)return null;const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');c.drawImage(src,0,0);const record={version:map.version,w,h,data:c.getImageData(0,0,w,h).data,flipY:map.flipY};this.textures.set(map,record);return record;}catch{return null;}}
  render(scene,camera){
    const c=this.context,w=this.domElement.width,h=this.domElement.height;
    c.globalAlpha=1;c.fillStyle=scene.background?.isColor?'#'+scene.background.getHexString():'#131821';c.fillRect(0,0,w,h);
    scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
    const view=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),faces=[];
    const world=new T.Vector3(),projected=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),normal=new T.Vector3();
    const light=new T.Vector3(-.4,.8,.7).normalize();
    scene.traverseVisible(mesh=>{
      if(!mesh.isMesh||!camera.layers.test(mesh.layers)||!mesh.geometry?.attributes.position)return;
      const g=mesh.geometry,p=g.attributes.position,count=p.count,points=new Float32Array(count*6),index=g.index?.array;
      mesh.skeleton?.update();
      for(let i=0;i<count;i++){
        mesh.getVertexPosition(i,world).applyMatrix4(mesh.matrixWorld);projected.copy(world).applyMatrix4(view);
        points.set([projected.x*w/2+w/2,-projected.y*h/2+h/2,projected.z,world.x,world.y,world.z],i*6);
      }
      const n=index?.length||count;
      for(let i=0;i<n;i+=3){
        const ia=(index?index[i]:i)*6,ib=(index?index[i+1]:i+1)*6,ic=(index?index[i+2]:i+2)*6;
        if(points[ia+2]<-1||points[ib+2]<-1||points[ic+2]<-1||points[ia+2]>1||points[ib+2]>1||points[ic+2]>1)continue;
        const x0=points[ia],y0=points[ia+1],x1=points[ib],y1=points[ib+1],x2=points[ic],y2=points[ic+1];
        if(Math.max(x0,x1,x2)<0||Math.min(x0,x1,x2)>w||Math.max(y0,y1,y2)<0||Math.min(y0,y1,y2)>h)continue;
        let material=mesh.material;
        if(Array.isArray(material)){const group=g.groups.find(q=>i>=q.start&&i<q.start+q.count);material=material[group?.materialIndex||0];}
        if(!material||material.visible===false||material.opacity===0)continue;
        const area=(x1-x0)*(y2-y0)-(y1-y0)*(x2-x0);
        if(material.side!==T.DoubleSide&&area>=0)continue;
        if(Math.abs(area)<.02)continue;
        a.set(points[ib+3]-points[ia+3],points[ib+4]-points[ia+4],points[ib+5]-points[ia+5]);
        b.set(points[ic+3]-points[ia+3],points[ic+4]-points[ia+4],points[ic+5]-points[ia+5]);
        normal.crossVectors(a,b).normalize();
        const strength=material.isMeshBasicMaterial?1:.32+.68*Math.max(0,normal.dot(light));
        const color=(material.color||new T.Color('white')).clone().multiplyScalar(strength);
        faces.push({z:(points[ia+2]+points[ib+2]+points[ic+2])/3,z0:points[ia+2],z1:points[ib+2],z2:points[ic+2],x0,y0,x1,y1,x2,y2,color:color.getHex(),alpha:material.opacity??1,depthWrite:material.depthWrite!==false,texture:this.texture(material.map),uv:g.attributes.uv?[ia,ib,ic].map(i=>[g.attributes.uv.getX(i/6),g.attributes.uv.getY(i/6)]):null});
      }
    });
    // Depth-buffer rasterization avoids hundreds of thousands of Canvas path calls
    // and prevents the cracks caused by antialiasing adjoining tiny triangles.
    const image=c.getImageData(0,0,w,h),pixels=image.data;
    this.depth??=new Float32Array(w*h);if(this.depth.length!==w*h)this.depth=new Float32Array(w*h);this.depth.fill(Infinity);
    faces.sort((a,b)=>(a.depthWrite===b.depthWrite?b.z-a.z:a.depthWrite?-1:1));
    for(const f of faces){
      const minX=Math.max(0,Math.floor(Math.min(f.x0,f.x1,f.x2))),maxX=Math.min(w-1,Math.ceil(Math.max(f.x0,f.x1,f.x2)));
      const minY=Math.max(0,Math.floor(Math.min(f.y0,f.y1,f.y2))),maxY=Math.min(h-1,Math.ceil(Math.max(f.y0,f.y1,f.y2)));
      const d=(f.y1-f.y2)*(f.x0-f.x2)+(f.x2-f.x1)*(f.y0-f.y2);
      const r=f.color>>16&255,g=f.color>>8&255,b=f.color&255;
      for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
        const u=((f.y1-f.y2)*(x+.5-f.x2)+(f.x2-f.x1)*(y+.5-f.y2))/d;
        const v=((f.y2-f.y0)*(x+.5-f.x2)+(f.x0-f.x2)*(y+.5-f.y2))/d;
        if(u<0||v<0||u+v>1)continue;
        const z=u*f.z0+v*f.z1+(1-u-v)*f.z2,i=y*w+x;if(z>=this.depth[i])continue;
        const at=i*4;let alpha=f.alpha,red=r,green=g,blue=b;
        if(f.texture&&f.uv){const tex=f.texture,tx=u*f.uv[0][0]+v*f.uv[1][0]+(1-u-v)*f.uv[2][0],ty=u*f.uv[0][1]+v*f.uv[1][1]+(1-u-v)*f.uv[2][1],px=Math.max(0,Math.min(tex.w-1,Math.floor(tx*tex.w))),py=Math.max(0,Math.min(tex.h-1,Math.floor((tex.flipY?1-ty:ty)*tex.h))),offset=(py*tex.w+px)*4;alpha*=tex.data[offset+3]/255;red*=tex.data[offset]/255;green*=tex.data[offset+1]/255;blue*=tex.data[offset+2]/255;}if(alpha<.005)continue;if(f.depthWrite)this.depth[i]=z;
        pixels[at]=red*alpha+pixels[at]*(1-alpha);pixels[at+1]=green*alpha+pixels[at+1]*(1-alpha);pixels[at+2]=blue*alpha+pixels[at+2]*(1-alpha);pixels[at+3]=255;
      }
    }
    c.putImageData(image,0,0);
    c.globalAlpha=1;this.triangles=faces.length;
  }
}
