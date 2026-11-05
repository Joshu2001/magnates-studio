// Persistent editor transactions; renderer and model buffers never enter history.
const keys=['nativeScene','baseNodes','actorOffsets','preset','cameraZoom','cameraYaw','cameraPitch','cameraTarget','guides'];
export function editSession(state){
 if(state.editSession)return state.editSession;
 const past=[],future=[];
 const capture=()=>Object.fromEntries(keys.filter(k=>state[k]!==undefined).map(k=>[k,structuredClone(state[k])]));
 const restore=data=>{for(const k of keys){if(k in data)state[k]=structuredClone(data[k]);else delete state[k];}state.editScene=null;state.editRevision=(state.editRevision||0)+1;};
 let pending=null;
 const session={begin(){if(!pending)pending=capture();},commit(){if(!pending)return;if(JSON.stringify(pending)!==JSON.stringify(capture())){past.push(pending);if(past.length>40)past.shift();future.length=0;state.editRevision=(state.editRevision||0)+1;}pending=null;},undo(){session.commit();if(!past.length)return false;future.push(capture());restore(past.pop());return true;},redo(){if(!future.length)return false;past.push(capture());restore(future.pop());return true;},save(storage=localStorage){session.commit();storage.setItem('regaarder-native3d-edits-v1',JSON.stringify({version:1,data:capture()}));},load(storage=localStorage){const saved=JSON.parse(storage.getItem('regaarder-native3d-edits-v1')||'null');if(!saved||saved.version!==1||!Array.isArray(saved.data?.nativeScene?.nodes))throw Error('No saved 3D scene in this browser');session.begin();restore(saved.data);session.commit();},get canUndo(){return !!past.length;},get canRedo(){return !!future.length;}};
 state.editSession=session;return session;
}
export const clampZoom=value=>Math.min(64,Math.max(.05,Number(value)||1));
