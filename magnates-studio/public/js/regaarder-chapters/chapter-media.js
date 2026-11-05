import {sources} from './chapter-sequence.js';
export async function decodeMedia(id,url){
 if(sources[id]?.endsWith('.mp4')&&!url.startsWith('data:image')){
  const video=document.createElement('video');
  video.muted=true;video.playsInline=true;video.preload='auto';
  await new Promise((resolve,reject)=>{
   video.onloadeddata=resolve;video.onerror=()=>reject(Error('Could not load '+id));video.src=url;
  });
  return video;
 }
 const img=new Image();img.src=url;await img.decode();return img;
}
export async function loadChapter(){
 return Object.fromEntries(await Promise.all(Object.entries(sources).map(async ([id,file])=>[id,await decodeMedia(id,'./assets/final-chapter/'+file)])));
}
