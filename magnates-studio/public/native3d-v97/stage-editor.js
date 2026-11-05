import {T} from './engine.js';
import {connectedDistances, meshRevision, localDragVectors, editLayer, setEditLayer} from './edit-core.js';
import {sculpt} from './workshop.js';

// The studio stage is a 2D copy of the native renderer. Project the actual posed
// vertex buffers, and raycast the same native surfaces, rather than a flat hit box.
export function mountStageEditor(viewport, canvas, state, redraw) {
  const events = new AbortController(), history = [];
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
  function snapshot() { history.push(structuredClone(state.nativeScene)); if(history.length>30)history.shift(); }
  function activate(s) {
    const actors=state.nativeScene.nodes.filter(n=>n.type==='humanoid');
    const i=actors.findIndex(n=>n.id===s.id);
    state.activeActor=state.preset==='checkpoint'?(s.id==='red'?'n3d_actor_crimson':'n3d_actor_coach'):state.preset==='team'?['n3d_actor_p1','n3d_actor_primary','n3d_actor_secondary'][i]:i===0?'n3d_actor_primary':'n3d_actor_secondary';
    state.activeSurface=s.mesh.userData.surface;
  }
  const on=(name,fn)=>viewport.addEventListener(name,fn,{capture:true,signal:events.signal});
  on('pointerdown',e=>{
    if(!editing()||state.editTool==='orbit'||e.target.closest('button')||e.button!==0)return;
    const h=hit(e); if(!h){selection=null;redraw();return;}
    e.preventDefault();e.stopImmediatePropagation();activate(h);
    if(e.shiftKey&&selection?.mesh===h.mesh)h.ids=[...new Set([...selection.ids,...h.ids])];
    selection=h;snapshot();
    drag={selection:h,startWorld:h.world,plane:new T.Plane().setFromNormalAndCoplanarPoint(state.nativeEngine.camera.getWorldDirection(new T.Vector3()),h.world),layer:structuredClone(editLayer(source(h),h.mesh)||{topology:h.topology,vertices:{}})};
    viewport.setPointerCapture(e.pointerId);redraw();
  });
  on('pointermove',e=>{
    if(!editing()||state.editTool==='orbit')return;
    if(!drag){hover=hit(e);viewport.style.cursor=hover?'crosshair':'default';redraw();return;}
    e.preventDefault();e.stopImmediatePropagation();
    const s=drag.selection,n=source(s);
    try {
      if(state.editTool==='grab'){
        hit(e); // Refresh the ray in canvas coordinates, even when it misses the body.
        const target=ray.ray.intersectPlane(drag.plane,new T.Vector3());
        if(target){
          const delta=target.sub(drag.startWorld),vectors=localDragVectors(s.mesh,s.ids,delta.toArray());
          const layer=structuredClone(drag.layer);
          for(const i of s.ids){
            const weight=Math.pow(1-(s.distances.get(i)||0)/state.brushRadius,2);
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
  const end=e=>{if(!drag)return;drag=null;try{viewport.releasePointerCapture(e.pointerId);}catch{};redraw();};
  on('pointerup',end);on('pointercancel',end);
  viewport.addEventListener('wheel',e=>{
    if(!editing())return;e.preventDefault();
    state.cameraZoom=Math.max(.6,Math.min(2,state.cameraZoom*Math.exp(-e.deltaY*.001)));redraw();
  },{passive:false,signal:events.signal});
  function draw(ctx){
    if(!editing())return;
    const camera=state.nativeEngine.camera,project=v=>v.project(camera),list=surfaces();
    let vertices=0,edges=0,faces=0;
    ctx.save();ctx.lineWidth=.65;
    for(const {mesh} of list){
      const g=mesh.geometry,a=g.index.array,used=[...new Set(a)],points=new Map();
      vertices+=used.length;faces+=a.length/3;
      if(!state.showTopology)continue;
      for(const i of used){const v=project(point(mesh,i));points.set(i,[(v.x+1)*480,(1-v.y)*270,v.z]);}
      const edgeSet=new Set();ctx.strokeStyle='rgba(17,19,24,.65)';ctx.beginPath();
      for(let k=0;k<a.length;k+=3)for(let j=0;j<3;j++){
        const u=a[k+j],v=a[k+(j+1)%3],key=u<v?u+':'+v:v+':'+u;
        if(edgeSet.has(key))continue;edgeSet.add(key);
        const p=points.get(u),q=points.get(v);if(p[2]>1||q[2]>1)continue;
        ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);
      }ctx.stroke();edges+=edgeSet.size;
      ctx.fillStyle='rgba(17,19,24,.65)';
      for(const p of points.values())if(p[2]<1)ctx.fillRect(p[0]-.7,p[1]-.7,1.4,1.4);
      const active=selection?.mesh===mesh?selection:hover?.mesh===mesh?hover:null;
      if(active){ctx.fillStyle='#ff8c00';for(const i of active.ids){const p=points.get(i);if(p)ctx.fillRect(p[0]-1.7,p[1]-1.7,3.4,3.4);}}
    }
    if(state.showBones){
      ctx.strokeStyle='#ffbf69';ctx.lineWidth=2;
      for(const c of state.nativeEngine.characters.values())if(visible(c.group))for(const bone of c.bones){
        if(!bone.parent?.isBone)continue;
        const a=project(bone.getWorldPosition(new T.Vector3())),b=project(bone.parent.getWorldPosition(new T.Vector3()));
        ctx.beginPath();ctx.moveTo((a.x+1)*480,(1-a.y)*270);ctx.lineTo((b.x+1)*480,(1-b.y)*270);ctx.stroke();
      }
    }
    if(state.showTopology){
      ctx.fillStyle='rgba(8,11,16,.8)';ctx.fillRect(12,48,175,100);ctx.fillStyle='#e2e8f0';ctx.font='11px monospace';
      [`Objects  ${list.length}`,`Vertices ${selection?.ids.length||0} / ${vertices}`,`Edges    ${edges}`,`Faces    ${faces}`,`Triangles ${faces}`].forEach((line,i)=>ctx.fillText(line,22,66+i*17));
    }
    ctx.restore();
  }
  return {draw,reset(){selection=hover=drag=null;},undo(){if(history.length){state.nativeScene=history.pop();state.editScene=null;selection=hover=drag=null;redraw();}},dispose(){events.abort();}};
}
