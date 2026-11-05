import {sources} from './promo-sequence.js';
const videoIds = new Set(['host','flame']);
export async function decodeMedia(id,src){
 if(videoIds.has(id)&&!src.startsWith('data:image/')){
  const video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';
  await new Promise((resolve,reject)=>{
   video.addEventListener('loadeddata',resolve,{once:true});
   video.addEventListener('error',()=>reject(Error('Could not decode '+id)),{once:true});
   video.src=src;
  });
  return video;
 }
 const image=new Image();image.src=src;await image.decode();return image;
}
export async function loadPromo(){
 return Object.fromEntries(await Promise.all(Object.entries(sources).map(async([id,path])=>[id,await decodeMedia(id,'./assets/promo129/'+path)])));
}
export function syncPromo(media,clock,draw){
 for(const id of videoIds){
  const v=media[id];if(v?.tagName!=='VIDEO'||v.readyState<2)continue;
  const a=id==='host'?13.3:107.7,b=id==='host'?20.9:109.15;
  if(clock<a||clock>b)continue;
  const target=(clock-a)%v.duration;
  if(!v.seeking&&Math.abs(v.currentTime-target)>.039){
   v.addEventListener('seeked',draw,{once:true});v.currentTime=target;
  }
 }
}
