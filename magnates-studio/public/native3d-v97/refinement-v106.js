// Editable, non-destructive reference corrections to the V105 handshake template.
import{putKey}from'./scene.js';
export function applySceneRefinement(s){
 s.name='Handshake · editable V106';
 const blue=s.nodes.find(n=>n.id==='final-blue'),cream=s.nodes.find(n=>n.id==='final-coach');
 for(const n of[blue,cream]){
  const b=n===blue,home=b?[-.55,0,.14]:[.40,0,-.12],approach=b?[-.55,0,.12]:[.48,0,-.02];
  n.position=[...home];for(const[t,v]of[[0,home],[.7,approach],[2.05,approach],[3.3,home]])putKey(n,'position',t,v);
  if(b){for(const t of[0,.7,2.05,3.3])putKey(n,'leanAngle',t,t===.7||t===2.05?10:0);n.shape.cranialHeight=.08;n.shape.chinProjection=-.04;n.shape.cranialDepth=.10;n.shape.neckThickness=.02;n.shape.napeVolume=.05;n.shape.throatVolume=-.08;n.handCurl.L=.34;n.fingerCurl={...(n.fingerCurl||{}),L:[.25,.28,.35,.40,.45]};n.handOffsets.L=[-.045,.05,-.198];n.rotation[1]-=10;const anchors=[[0,6],[.8,6],[2.4,4],[2.8,1],[3.2,0],[6,0]];for(const k of n.boneTracks.head){let a=anchors[0],z=anchors.at(-1);for(let i=1;i<anchors.length;i++)if(k.time<=anchors[i][0]){a=anchors[i-1];z=anchors[i];break;}const u=Math.max(0,Math.min(1,(k.time-a[0])/(z[0]-a[0])));k.value[0]+=a[1]+(z[1]-a[1])*u;k.value[1]+=10;};}
  else{for(const k of n.tracks.rotation)k.value[1]-=10;n.rotation[1]-=10;n.shape.chinProjection=.04;Object.assign(n.parts.hat,{tilt:-20,roll:-4,brimWidth:1.03,brimDepth:.98,lift:-.003});}
 }
 const grip=s.interactions.find(g=>g.id==='handshake-contact');Object.assign(grip,{center:[-.025,1.04,.15],approachHeight:.48,start:.15,contact:1.0,separation:.026,fingerCurl:[.30,.58,.62,.66,.70],thumbOpposition:true});
 for(const [id,patch]of[['blue-fill',{intensity:2.0}],['blue-key',{intensity:1.1}],['blue-rim',{position:[-2.6,2.2,-2.5],intensity:4.0}]])Object.assign(s.nodes.find(n=>n.id===id),patch);
 const camera=s.nodes.find(n=>n.id===s.cameraId);for(const[t,fov]of[[0,36],[.6,36],[1,25.5],[1.75,25.5],[2.2,32]])putKey(camera,'fov',t,fov);

 return s;
}
