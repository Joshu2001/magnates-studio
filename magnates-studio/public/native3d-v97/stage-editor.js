import {T} from './engine.js';
import {editSession,clampZoom} from './edit-session.js';
import {connectedDistances, meshRevision, localDragVectors, editLayer, setEditLayer} from './edit-core.js';
import {sculpt} from './workshop.js';

// The studio stage is a 2D copy of the native renderer. Project the actual posed
// vertex buffers, and raycast the same native surfaces, rather than a flat hit box.
export function mountStageEditor(viewport, canvas, state, redraw) {
  const events = new AbortController(), session = editSession(state), topologyCache=new WeakMap();
  const ray = new T.Raycaster(); ray.layers.enableAll();
  let selection = null, hover = null, drag = null;
  const editing = () => window.topCustomizerState?.paperPreviewMode === '3d';
  const visible = m => { for (let p=m;p;p=p.parent) if (!p.visible) return false; return true; };
  const surfaces = () => {
    const out=[];
    for (const [id,c] of state.nativeEngine.characters) c.group.traverse(m=>{
      if(m.isMesh && m.userData.surface && visible(m) && m.geometry.index) out.push({id,mesh:m});
    });
    return out;
  };
  const point = (mesh,i) => mesh.localToWorld(mesh.getVertexPosition(i,new T.Vector3()));
  function hit(e) {
    const r=canvas.getBoundingClientRect(), scale=Math.min(r.width/960,r.height/540);
    const x=(e.clientX-r.left-(r.width-960*scale)/2)/scale;
    const y=(e.clientY-r.top-(r.height-540*scale)/2)/scale;
    if(x<0||x>960||y<0||y>540)return null;
    ray.setFromCamera(new T.Vector2(x/480-1,1-y/270),state.nativeEngine.camera);
    const list=surfaces(),h=ray.intersectObjects(list.map(x=>x.mesh),false)[0];
    if(!h?.face)return null;
    const mesh=h.object,ids=[h.face.a,h.face.b,h.face.c];
    ids.sort((a,b)=>point(mesh,a).distanceToSquared(h.point)-point(mesh,b).distanceToSquared(h.point));
    const region=connectedDistances(mesh.geometry,ids[0],state.brushRadius);
    return {id:list.find(x=>x.mesh===mesh).id,mesh,seed:ids[0],ids:[...region.keys()],distances:region,world:h.point.clone(),topology:meshRevision(mesh.geometry)};
  }
  function source(s) { return state.nativeScene.nodes.find(n=>n.id===s.id); }
  function snapshot() { session.begin(); }
  function activate(s) {
    const actors=state.nativeScene.nodes.filter(n=>n.type==='humanoid');
    const i=actors.findIndex(n=>n.id===s.id);
    state.activeActor=state.preset==='checkpoint'?(s.id==='red'?'n3d_actor_crimson':'n3d_actor_coach'):state.preset==='team'?['n3d_actor_p1','n3d_actor_primary','n3d_actor_secondary'][i]:i===0?'n3d_actor_primary':'n3d_actor_secondary';
    state.activeSurface=s.mesh.userData.surface;
  }
  const screen=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*960/r.width,(e.clientY-r.top)*540/r.height];};
  const boneAt=e=>{const [x,y]=screen(e);let best=null;for(const [id,c] of state.nativeEngine.characters)if(visible(c.group))for(const bone of c.bones){const p=bone.getWorldPosition(new T.Vector3()).project(state.nativeEngine.camera),distance=Math.hypot((p.x+1)*480-x,(1-p.y)*270-y);if(p.z>-1&&p.z<1&&distance<14&&(!best||distance<best.distance))best={id,bone,distance};}return best;};
  const on=(name,fn)=>viewport.addEventListener(name,fn,{capture:true,signal:events.signal});
  on('pointerdown',e=>{
    if(!editing()||state.editTool==='orbit'||e.target.closest('button')||e.button!==0)return;
    if(state.editTool==='bone'){const b=boneAt(e);if(!b)return;e.preventDefault();e.stopImmediatePropagation();state.selectedBone=b.bone.name;state.selectedBoneActor=b.id;const node=state.nativeScene.nodes.find(n=>n.id===b.id);snapshot();node.bones||={};const bone=node.bones[b.bone.name]||={rotation:[0,0,0]};drag={bone,node,start:screen(e),rotation:[...(bone.rotation||[0,0,0])]};viewport.setPointerCapture(e.pointerId);redraw();return;}
    if(state.editTool==='box'||state.editTool.startsWith('guide-')){e.preventDefault();e.stopImmediatePropagation();drag={box:state.editTool==='box',guide:state.editTool.startsWith('guide-')?state.editTool.slice(6):null,start:screen(e),end:screen(e)};viewport.setPointerCapture(e.pointerId);redraw();return;}
    const h=hit(e); if(!h){selection=null;redraw();return;}
    e.preventDefault();e.stopImmediatePropagation();activate(h);
    if(e.shiftKey&&selection?.mesh===h.mesh)h.ids=[...new Set([...selection.ids,...h.ids])];
    selection=h;
    if(state.selectionScope==='surface'){h.ids=[...new Set(h.mesh.geometry.index.array)];h.distances=new Map(h.ids.map(i=>[i,0]));}
    snapshot();
    drag={selection:h,startWorld:h.world,plane:new T.Plane().setFromNormalAndCoplanarPoint(state.nativeEngine.camera.getWorldDirection(new T.Vector3()),h.world),layer:structuredClone(editLayer(source(h),h.mesh)||{topology:h.topology,vertices:{}})};
    viewport.setPointerCapture(e.pointerId);redraw();
  });
  on('pointermove',e=>{
    if(!editing()||state.editTool==='orbit')return;
    if(!drag){hover=hit(e);viewport.style.cursor=hover?'crosshair':'default';redraw();return;}
    e.preventDefault();e.stopImmediatePropagation();
    if(drag.box||drag.guide){drag.end=screen(e);redraw();return;}
    if(drag.bone){const p=screen(e);drag.bone.rotation=[drag.rotation[0]+(p[1]-drag.start[1])*.25,drag.rotation[1]+(p[0]-drag.start[0])*.25,drag.rotation[2]];if(drag.node.boneTracks)delete drag.node.boneTracks[state.selectedBone];state.editScene=null;redraw();return;}
    const s=drag.selection,n=source(s);
    try {
      if(state.editTool==='grab'){
        hit(e); // Refresh the ray in canvas coordinates, even when it misses the body.
        const target=ray.ray.intersectPlane(drag.plane,new T.Vector3());
        if(target){
          const delta=target.sub(drag.startWorld);
          if(state.moveAxis&&state.moveAxis!=='free')for(const axis of ['x','y','z'])if(axis!==state.moveAxis)delta[axis]=0;
          if(state.snapMillimetres>0)for(const axis of ['x','y','z'])delta[axis]=Math.round(delta[axis]/(state.snapMillimetres/1000))*(state.snapMillimetres/1000);
          const vectors=localDragVectors(s.mesh,s.ids,delta.toArray());
          const layer=structuredClone(drag.layer);
          for(const i of s.ids){
            const weight=Math.pow(Math.max(0,1-(s.distances.get(i)||0)/state.brushRadius),2);
            layer.vertices[i]=(drag.layer.vertices[i]||[0,0,0]).map((v,j)=>Math.max(-.15,Math.min(.15,v+vectors[i][j]*weight)));
          }
          setEditLayer(n,s.mesh,layer);
        }
      } else if(['inflate','smooth'].includes(state.editTool)) {
        const h=hit(e);
        if(h?.mesh===s.mesh)sculpt(n,s.mesh,h.seed,{radius:state.brushRadius,strength:.0015,mode:state.editTool,connected:true});
      }
      redraw();
    }catch(err){console.warn('[Stage mesh edit]',err.message);}
  });
  const end=e=>{if(!drag)return;
    if(drag.box){const [x,y]=drag.start,[u,v]=drag.end;let picked=null;for(const {id,mesh} of surfaces()){const ids=[];for(const i of new Set(mesh.geometry.index.array)){const p=point(mesh,i).project(state.nativeEngine.camera),px=(p.x+1)*480,py=(1-p.y)*270;if(p.z>-1&&p.z<1&&px>=Math.min(x,u)&&px<=Math.max(x,u)&&py>=Math.min(y,v)&&py<=Math.max(y,v))ids.push(i);}if(ids.length&&(!picked||ids.length>picked.ids.length))picked={id,mesh,ids,seed:ids[0],world:point(mesh,ids[0]),distances:new Map(ids.map(i=>[i,0])),topology:meshRevision(mesh.geometry)};}selection=picked;if(picked)activate(picked);}
    if(drag.guide){session.begin();state.guides||=[];state.guides.push({type:drag.guide,start:drag.start,end:drag.end});}
    drag=null;session.commit();try{viewport.releasePointerCapture(e.pointerId);}catch{}redraw();};
  on('pointerup',end);on('pointercancel',end);
  viewport.addEventListener('wheel',e=>{
    if(!editing())return;e.preventDefault();
    state.cameraZoom=clampZoom(state.cameraZoom*Math.exp(-e.deltaY*.001));redraw();
  },{passive:false,signal:events.signal});
  let projectionKey='',projectionCache=[];
  function draw(ctx){
    if(!editing())return;
    const camera=state.nativeEngine.camera,project=v=>v.project(camera),list=surfaces();
    const key=state.nativeRenderKey+'|'+state.showTopology+'|'+state.showBones;
    if(key!==projectionKey||projectionCache.length!==list.length||projectionCache.some((entry,i)=>entry.mesh!==list[i].mesh)){
      projectionKey=key;projectionCache=list.map(({mesh})=>{const g=mesh.geometry,a=g.index.array;let topology=topologyCache.get(g);if(!topology||topology.index!==g.index){const used=[...new Set(a)],edges=[],seen=new Set();for(let k=0;k<a.length;k+=3)for(let j=0;j<3;j++){const u=a[k+j],v=a[k+(j+1)%3],key=u<v?u+':'+v:v+':'+u;if(!seen.has(key)){seen.add(key);edges.push([u,v]);}}topology={index:g.index,used,edges};topologyCache.set(g,topology);}const points=new Map();if(state.showTopology)for(const i of topology.used){const v=project(point(mesh,i));points.set(i,[(v.x+1)*480,(1-v.y)*270,v.z]);}return {mesh,topology,points};});
    }
    ctx.save();ctx.lineWidth=.65;
    let vertices=0,edges=0,faces=0;
    for(const {mesh,topology,points} of projectionCache){vertices+=topology.used.length;edges+=topology.edges.length;faces+=mesh.geometry.index.count/3;if(!state.showTopology)continue;ctx.strokeStyle='rgba(17,19,24,.65)';ctx.beginPath();for(const [u,v] of topology.edges){const p=points.get(u),q=points.get(v);if(p[2]>1||q[2]>1||p[2]<-1||q[2]<-1||Math.hypot(p[0]-q[0],p[1]-q[1])<1.5)continue;ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();ctx.fillStyle='rgba(17,19,24,.65)';for(const p of points.values())if(p[2]<1&&p[2]>-1)ctx.fillRect(p[0]-.7,p[1]-.7,1.4,1.4);const active=selection?.mesh===mesh?selection:hover?.mesh===mesh?hover:null;if(active){ctx.fillStyle='#ff8c00';for(const i of active.ids){const p=points.get(i);if(p&&p[2]>-1&&p[2]<1)ctx.fillRect(p[0]-1.7,p[1]-1.7,3.4,3.4);}}}
    if(state.showBones){ctx.lineWidth=2;for(const [id,c] of state.nativeEngine.characters)if(visible(c.group))for(const bone of c.bones){if(!bone.parent?.isBone)continue;const a=project(bone.getWorldPosition(new T.Vector3())),b=project(bone.parent.getWorldPosition(new T.Vector3()));if(a.z<-1||a.z>1||b.z<-1||b.z>1)continue;ctx.strokeStyle=bone.name===state.selectedBone&&id===state.selectedBoneActor?'#ff8c00':'#ffbf69';ctx.beginPath();ctx.moveTo((a.x+1)*480,(1-a.y)*270);ctx.lineTo((b.x+1)*480,(1-b.y)*270);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.fillRect((a.x+1)*480-2,(1-a.y)*270-2,4,4);}}
    if(state.showTopology){ctx.fillStyle='rgba(8,11,16,.8)';ctx.fillRect(12,48,175,100);ctx.fillStyle='#e2e8f0';ctx.font='11px monospace';[`Objects  ${list.length}`,`Vertices ${selection?.ids.length||0} / ${vertices}`,`Edges    ${edges}`,`Faces    ${faces}`,`Triangles ${faces}`].forEach((line,i)=>ctx.fillText(line,22,66+i*17));}
    ctx.strokeStyle='#c4b5fd';ctx.lineWidth=1.5;
    for(const guide of [...(state.guides||[]),...(drag?.guide?[{type:drag.guide,start:drag.start,end:drag.end}]:[])]){const [x,y]=guide.start,[u,v]=guide.end;ctx.beginPath();if(guide.type==='circle')ctx.ellipse((x+u)/2,(y+v)/2,Math.max(.1,Math.abs(u-x)/2),Math.max(.1,Math.abs(v-y)/2),0,0,Math.PI*2);else if(guide.type==='line'){ctx.moveTo(x,y);ctx.lineTo(u,v);}else ctx.rect(x,y,u-x,v-y);ctx.stroke();}
    if(drag?.box){ctx.setLineDash([5,4]);ctx.strokeRect(drag.start[0],drag.start[1],drag.end[0]-drag.start[0],drag.end[1]-drag.start[1]);}
    ctx.restore();
  }
  on('keydown',e=>{if(e.target.closest('input,select,textarea'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)session.redo();else session.undo();selection=hover=drag=null;redraw();}if(e.key==='Escape'){selection=hover=drag=null;redraw();}});
  viewport.tabIndex=0;
  function change(operation){session.begin();operation();session.commit();state.editScene=null;redraw();}
  return {draw,reset(){selection=hover=drag=null;},undo(){if(session.undo()){selection=hover=drag=null;redraw();}},redo(){if(session.redo()){selection=hover=drag=null;redraw();}},
    save(){session.save();},load(){session.load();selection=hover=drag=null;redraw();},
    straighten(){change(()=>{const id=state.selectedBoneActor||selection?.id;const actors=state.nativeScene.nodes.filter(n=>n.type==='humanoid');const actor=actors.find(n=>n.id===id)||actors.find(n=>n.id===state.activeActor?.replace('n3d_actor_',''))||actors[0];if(actor){actor.pose='standing';actor.leanAngle=0;actor.bones={};actor.boneTracks={};actor.bonePositionTracks={};actor.boneScaleTracks={};if(actor.tracks){delete actor.tracks.pose;delete actor.tracks.leanAngle;}}});},
    move(delta){if(['actor','all'].includes(state.selectionScope)){change(()=>{const actors=state.nativeScene.nodes.filter(n=>n.type==='humanoid');for(const [i,n] of actors.entries()){const key=state.preset==='checkpoint'?(n.id==='red'?'n3d_actor_crimson':'n3d_actor_coach'):state.preset==='team'?['n3d_actor_p1','n3d_actor_primary','n3d_actor_secondary'][i]:i===0?'n3d_actor_primary':'n3d_actor_secondary';if(state.selectionScope!=='all'&&key!==state.activeActor&&n.id!==state.selectedBoneActor)continue;const off=state.actorOffsets[key]||={};off.x=(off.x||0)+delta[0]/.003;off.y=(off.y||0)-delta[1]/.003;off.z=(off.z||0)+delta[2]/.003;}});return;}if(!selection)throw Error('Select a mesh region first');change(()=>{const s=selection,n=source(s),layer=structuredClone(editLayer(n,s.mesh)||{topology:s.topology,vertices:{}}),vectors=localDragVectors(s.mesh,s.ids,delta);for(const i of s.ids)layer.vertices[i]=(layer.vertices[i]||[0,0,0]).map((v,j)=>Math.max(-.15,Math.min(.15,v+vectors[i][j])));setEditLayer(n,s.mesh,layer);});},
    shape(mode){if(!selection)throw Error('Select a mesh region first');change(()=>{const s=selection,positions=s.ids.map(i=>point(s.mesh,i)),center=positions.reduce((a,p)=>a.add(p),new T.Vector3()).multiplyScalar(1/positions.length),radius=positions.reduce((sum,p)=>sum+p.distanceTo(center),0)/positions.length,normal=state.nativeEngine.camera.getWorldDirection(new T.Vector3()),layer=structuredClone(editLayer(source(s),s.mesh)||{topology:s.topology,vertices:{}});for(let k=0;k<s.ids.length;k++){const i=s.ids[k],p=positions[k],offset=p.clone().sub(center),target=mode==='round'?center.clone().add(offset.clone().normalize().multiplyScalar(radius)):p.clone().addScaledVector(normal,-offset.dot(normal));const d=target.sub(p).multiplyScalar(.25),v=localDragVectors(s.mesh,[i],d.toArray())[i];layer.vertices[i]=(layer.vertices[i]||[0,0,0]).map((x,j)=>Math.max(-.15,Math.min(.15,x+v[j])));}setEditLayer(source(s),s.mesh,layer);});},
    clearGuides(){change(()=>{state.guides=[];});},
    dispose(){session.commit();events.abort();}};
}
