/* Regaarder Studio — shared audio layer registry, timeline lane and inspector.
   Audio is treated as a first-class timed layer without replacing template-specific engines. */
(function(){
  'use strict';
  if(window.RegaarderAudioLayers)return;

  const registry=new Map();
  const media=new Map();
  const mounts=new Map();
  let selected=null;

  const legacyCatalog={
    'hp-full-6m30s-documentary':{
      duration:390,
      clips:[
        {id:'hp-master-bus',name:'Investigative Documentary Score & SFX Bus',url:'/hp_recon/hp_ref_audio_6m30s.mp3',start:0,duration:390,volume:.85,kind:'music',managed:false,description:'Existing synchronized 6:30 reference audio bus.'}
      ]
    },
    'countdown-timer':{
      duration:10,
      clips:[
        {id:'countdown-ticks',name:'Tension Tick / Heartbeat Engine',start:0,duration:10,volume:.75,kind:'procedural',managed:false,description:'Procedural Web Audio cue; duration follows the countdown setting.'},
        {id:'countdown-impact',name:'Climax Sub-bass Impact',start:9.25,duration:.75,volume:.8,kind:'procedural',managed:false,description:'Procedural impact tied to the zero/climax beat.'}
      ]
    },
    'document-barrage-suite':{
      duration:6.5,
      clips:[
        {id:'barrage-impacts',name:'Paper Slams, Slides & Shutter Impacts',start:0,duration:6.5,volume:.8,kind:'procedural',managed:false,description:'Existing event-driven barrage SFX across the document arrivals.'}
      ]
    },
    'jani-flash-quad-sequence':{
      duration:6.4,
      clips:[
        {id:'jfq-shutter',name:'Camera Shutter / Xenon Flash',start:0,duration:.55,volume:.85,kind:'procedural',managed:false,description:'Existing synthesized shutter and capacitor cue on Beat 1.'},
        {id:'jfq-whooshes',name:'Directional Slide Whooshes',start:1.45,duration:2.7,volume:.7,kind:'procedural',managed:false,description:'Existing whoosh cues on Beats 2 and 3.'},
        {id:'jfq-subbass',name:'Center Emergence Sub-bass Swell',start:4.15,duration:2.25,volume:.8,kind:'procedural',managed:false,description:'Existing sub-bass swell on Beat 4.'}
      ]
    },
    'jani-spin-flash-glitch-reveal':{
      duration:5.4,
      clips:[
        {id:'jsfg-slow-flash',name:'Slow Flash Impact',start:.52,duration:.68,volume:.85,kind:'procedural',managed:false,description:'Existing slow flash Web Audio cue.'},
        {id:'jsfg-rapid-strobes',name:'Rapid Strobe Impacts',start:1.58,duration:.42,volume:.85,kind:'procedural',managed:false,description:'Existing rapid flashlight/strobe audio burst.'}
      ]
    },
    'circular-spin-flashlight-glitch':{
      duration:5.4,
      clips:[
        {id:'csfg-flashes',name:'Flash / Paparazzi SFX',start:.5,duration:1.6,volume:.85,kind:'sfx',managed:false,description:'Existing file-backed camera flash cues triggered by the animation.'}
      ]
    },
    'multi-image-flash-sequence':{
      duration:6.5,
      clips:[
        {id:'mifs-shutter',name:'Opening Camera Shutter',start:0,duration:.5,volume:.9,kind:'sfx',managed:false,description:'Existing opening shutter profile.'},
        {id:'mifs-whoosh',name:'Slide Whoosh Cues',start:1.2,duration:3.2,volume:.6,kind:'sfx',managed:false,description:'Existing file-backed directional whoosh cues.'},
        {id:'mifs-subbass',name:'Sluggish Bloom Sub-bass',start:4.2,duration:2.0,volume:.8,kind:'sfx',managed:false,description:'Existing sub-bass bloom cue.'}
      ]
    }
  };

  Object.keys(legacyCatalog).forEach(function(id){registry.set(id,normalise(id,legacyCatalog[id]));});

  function num(v,fallback){v=Number(v);return Number.isFinite(v)?v:fallback;}
  function fmt(v){v=Math.max(0,num(v,0));const m=Math.floor(v/60),s=v-m*60;return m+':'+s.toFixed(2).padStart(5,'0');}
  function normalise(id,spec){
    spec=spec||{};
    const duration=Math.max(.01,num(spec.duration,1));
    const clips=(spec.clips||[]).map(function(c,i){
      const start=Math.max(0,num(c.start,0));
      const cd=Math.max(.01,num(c.duration,.5));
      return Object.assign({
        id:c.id||('audio-'+i),name:c.name||('Audio '+(i+1)),url:c.url||'',start:start,duration:cd,
        volume:clamp(num(c.volume,1),0,1),fadeIn:Math.max(0,num(c.fadeIn,0)),fadeOut:Math.max(0,num(c.fadeOut,0)),
        loop:!!c.loop,muted:!!c.muted,kind:c.kind||'audio',managed:c.managed!==false,description:c.description||''
      },c);
    });
    return {id:id,duration:duration,clips:clips};
  }
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function register(id,spec){if(!id)return null;const n=normalise(id,spec);registry.set(id,n);refresh();return n;}
  function get(id){return registry.get(id)||normalise(id,{duration:resolveDuration(id),clips:[]});}
  function resolveDuration(id){
    const tpl=(window.EFFECT_TEMPLATES_DATA||[]).find(function(x){return x&&x.id===id;});
    const raw=tpl&&(tpl.duration||tpl.durationSeconds||tpl.timeToApply);
    const parsed=parseFloat(raw);return Number.isFinite(parsed)&&parsed>0?parsed:10;
  }
  function activeId(){
    return (window.topCustomizerState&&window.topCustomizerState.currentTpl&&window.topCustomizerState.currentTpl.id)||
      (window.activeTopTemplateObj&&window.activeTopTemplateObj.id)||'';
  }
  function currentTime(){return Math.max(0,num(window.topCustomizerState&&window.topCustomizerState.currentTime,0));}

  function ensureStyles(){
    if(document.getElementById('rg-audio-layer-styles'))return;
    const s=document.createElement('style');s.id='rg-audio-layer-styles';
    s.textContent=
      '.rg-audio-lane{margin-top:9px;border:1px solid #33284a;border-radius:10px;background:#0b0b12;overflow:hidden;color:#ddd7ea;font:11px Inter,Arial,sans-serif}'+
      '.rg-audio-lane-head{height:31px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-bottom:1px solid #2a2438;background:#14111d}'+
      '.rg-audio-lane-head strong{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#c6a8ff}.rg-audio-lane-head span{color:#837b91;font:10px ui-monospace,monospace}'+
      '.rg-audio-track{position:relative;min-height:42px;padding:5px 6px 5px 78px;border-bottom:1px solid #201c2a}.rg-audio-track:last-child{border-bottom:0}'+
      '.rg-audio-track-label{position:absolute;left:8px;top:13px;width:64px;color:#8d849b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
      '.rg-audio-clip{position:absolute;top:5px;height:31px;border:1px solid #6d45a8;border-radius:6px;background:linear-gradient(180deg,#422e62,#2b203e);color:#f4edff;padding:4px 7px;overflow:hidden;cursor:pointer;box-shadow:inset 0 1px #ffffff14}'+
      '.rg-audio-clip:hover,.rg-audio-clip.is-selected{border-color:#b794f4;background:linear-gradient(180deg,#613e91,#3a2855);box-shadow:0 0 0 1px #9b6bff55,0 0 16px #9b6bff33}'+
      '.rg-audio-clip b{display:block;font-size:9.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rg-audio-clip small{font-size:8.5px;color:#c8bdd8;white-space:nowrap}'+
      '.rg-audio-playhead{position:absolute;top:31px;bottom:0;width:1px;background:#f3e8ff;box-shadow:0 0 7px #a855f7;pointer-events:none;z-index:4}'+
      '.rg-audio-empty{padding:12px;color:#716a7d;font-size:10px}.rg-audio-inspector{border:1px solid #342744;border-radius:9px;background:#111018;padding:10px;margin-bottom:10px}'+
      '.rg-audio-inspector h4{margin:0 0 2px;color:#f0e9fa;font-size:11px}.rg-audio-inspector .rg-audio-meta{color:#8e849b;font-size:9px;margin-bottom:10px}'+
      '.rg-audio-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rg-audio-field label{display:block;color:#a9a0b4;font-size:9px;margin-bottom:4px}.rg-audio-field input[type=number],.rg-audio-field input[type=range]{width:100%}'+
      '.rg-audio-field input[type=number]{background:#0a0910;border:1px solid #332b3e;border-radius:5px;color:#eee;padding:5px}.rg-audio-toggles{display:flex;gap:12px;margin-top:9px;color:#a9a0b4;font-size:9px}'+
      '.rg-audio-procedural{padding:8px;border-radius:6px;background:#17131f;color:#9c91aa;font-size:9px;line-height:1.45}.rg-audio-lane-wrap{position:relative}';
    document.head.appendChild(s);
  }

  function createMedia(templateId,clip){
    if(!clip.url||clip.managed===false)return null;
    const key=templateId+':'+clip.id;
    let a=media.get(key);
    if(!a){
      a=new Audio(clip.url);a.preload='auto';a.loop=!!clip.loop;a.playsInline=true;
      media.set(key,a);
      a.addEventListener('loadedmetadata',function(){
        if((!clip.duration||clip.duration<=.01)&&Number.isFinite(a.duration))clip.duration=a.duration;
        refresh();
      });
    }
    a.volume=clip.muted?0:clip.volume;
    a.loop=!!clip.loop;
    return a;
  }

  function effectiveGain(clip,local){
    let g=clip.muted?0:clip.volume;
    if(clip.fadeIn>0)g*=clamp(local/clip.fadeIn,0,1);
    if(clip.fadeOut>0)g*=clamp((clip.duration-local)/clip.fadeOut,0,1);
    return clamp(g,0,1);
  }

  function sync(templateId,time,playing){
    const spec=registry.get(templateId);if(!spec)return;
    spec.clips.forEach(function(clip){
      const a=createMedia(templateId,clip);if(!a)return;
      const local=time-clip.start,inside=local>=0&&local<clip.duration;
      if(!inside){if(!a.paused)a.pause();return;}
      const target=clamp(local,0,Math.max(0,clip.duration-.01));
      if(Math.abs((a.currentTime||0)-target)>.16){try{a.currentTime=target}catch(e){}}
      a.volume=effectiveGain(clip,local);
      if(playing){const p=a.play();if(p&&p.catch)p.catch(function(){});}else{a.pause();}
    });
    updatePlayheads(templateId,time);
  }

  function stop(templateId){
    media.forEach(function(a,key){if(!templateId||key.indexOf(templateId+':')===0){a.pause();}});
  }

  function clipRows(spec){
    const groups=[];spec.clips.forEach(function(c){if(groups.indexOf(c.kind)<0)groups.push(c.kind);});
    return groups.length?groups:['audio'];
  }

  function buildLane(templateId,host){
    ensureStyles();const spec=get(templateId);
    host.innerHTML='';host.classList.add('rg-audio-lane-wrap');
    const lane=document.createElement('div');lane.className='rg-audio-lane';lane.dataset.audioTemplate=templateId;
    const head=document.createElement('div');head.className='rg-audio-lane-head';
    head.innerHTML='<strong>Audio Layers</strong><span>'+spec.clips.length+' clip'+(spec.clips.length===1?'':'s')+' · '+fmt(spec.duration)+'</span>';
    lane.appendChild(head);
    if(!spec.clips.length){const e=document.createElement('div');e.className='rg-audio-empty';e.textContent='No audio layers in this template. Audio support is available here when a sound is added.';lane.appendChild(e);}
    else{
      clipRows(spec).forEach(function(kind){
        const row=document.createElement('div');row.className='rg-audio-track';row.dataset.audioKind=kind;
        const label=document.createElement('span');label.className='rg-audio-track-label';label.textContent=kind==='procedural'?'Procedural':kind.charAt(0).toUpperCase()+kind.slice(1);row.appendChild(label);
        spec.clips.filter(function(c){return c.kind===kind}).forEach(function(c){
          const b=document.createElement('button');b.type='button';b.className='rg-audio-clip';b.dataset.audioClip=c.id;
          const left=78+(c.start/spec.duration)*Math.max(1,host.clientWidth-86);
          const width=Math.max(24,(c.duration/spec.duration)*Math.max(1,host.clientWidth-86));
          b.style.left='calc(78px + '+((c.start/spec.duration)*100).toFixed(4)+'% * .72)';
          b.style.width='max(24px, calc('+((c.duration/spec.duration)*100).toFixed(4)+'% * .72))';
          b.innerHTML='<b>'+escapeHtml(c.name)+'</b><small>'+fmt(c.start)+' → '+fmt(c.start+c.duration)+' · '+c.duration.toFixed(2)+'s</small>';
          b.title=c.name+' — '+fmt(c.start)+' to '+fmt(c.start+c.duration);
          b.addEventListener('click',function(){select(templateId,c.id);});
          row.appendChild(b);
        });
        lane.appendChild(row);
      });
    }
    const ph=document.createElement('div');ph.className='rg-audio-playhead';ph.dataset.audioPlayhead='1';lane.appendChild(ph);
    host.appendChild(lane);updatePlayheads(templateId,currentTime());
  }

  function escapeHtml(v){return String(v).replace(/[&<>"']/g,function(ch){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];});}

  function renderInspector(templateId,host){
    const spec=get(templateId),clip=selected&&selected.templateId===templateId?spec.clips.find(function(c){return c.id===selected.clipId;}):spec.clips[0];
    host.innerHTML='';
    const section=document.createElement('div');section.className='rg-audio-inspector rg-inspector-section';section.dataset.rgAudioInspector='1';
    if(!clip){
      section.innerHTML='<h4>Audio</h4><div class="rg-audio-meta">No audio layers</div><div class="rg-audio-procedural">This template has no registered audio clips yet. The Audio lane and inspector are ready for file-based or procedural sound layers.</div>';
      host.appendChild(section);return;
    }
    section.innerHTML='<h4>'+escapeHtml(clip.name)+'</h4><div class="rg-audio-meta">'+escapeHtml(clip.kind)+' · '+fmt(clip.start)+' → '+fmt(clip.start+clip.duration)+' · '+clip.duration.toFixed(2)+'s</div>'+
      (clip.description?'<div class="rg-audio-procedural">'+escapeHtml(clip.description)+'</div>':'')+
      '<div class="rg-audio-grid" style="margin-top:9px">'+
      field('Start (s)','start',clip.start,.01,0,spec.duration)+field('Duration (s)','duration',clip.duration,.01,.01,spec.duration)+
      field('Fade in (s)','fadeIn',clip.fadeIn,.01,0,clip.duration)+field('Fade out (s)','fadeOut',clip.fadeOut,.01,0,clip.duration)+
      '</div><div class="rg-audio-field" style="margin-top:9px"><label>Volume · '+Math.round(clip.volume*100)+'%</label><input data-audio-prop="volume" type="range" min="0" max="1" step=".01" value="'+clip.volume+'"></div>'+
      '<div class="rg-audio-toggles"><label><input data-audio-prop="muted" type="checkbox" '+(clip.muted?'checked':'')+'> Mute</label><label><input data-audio-prop="loop" type="checkbox" '+(clip.loop?'checked':'')+'> Loop</label></div>';
    section.querySelectorAll('[data-audio-prop]').forEach(function(input){
      input.addEventListener('input',function(){
        const prop=input.dataset.audioProp;
        if(prop==='muted'||prop==='loop')clip[prop]=input.checked;else clip[prop]=Math.max(prop==='duration'?.01:0,num(input.value,clip[prop]));
        if(prop==='start')clip.start=clamp(clip.start,0,spec.duration);
        if(prop==='duration')clip.duration=clamp(clip.duration,.01,Math.max(.01,spec.duration-clip.start));
        const a=createMedia(templateId,clip);if(a){a.volume=clip.muted?0:clip.volume;a.loop=clip.loop;}
        rerenderTemplate(templateId);
      });
    });
    host.appendChild(section);
  }
  function field(label,prop,value,step,min,max){return '<div class="rg-audio-field"><label>'+label+'</label><input data-audio-prop="'+prop+'" type="number" min="'+min+'" max="'+max+'" step="'+step+'" value="'+Number(value).toFixed(2)+'"></div>';}

  function select(templateId,clipId){
    selected={templateId:templateId,clipId:clipId};
    document.querySelectorAll('.rg-audio-clip').forEach(function(el){el.classList.toggle('is-selected',el.dataset.audioClip===clipId&&el.closest('[data-audio-template]')&&el.closest('[data-audio-template]').dataset.audioTemplate===templateId);});
    const modal=document.getElementById('modal-top-template-customizer');
    if(modal){
      const shell=modal.querySelector('.rg-inspector-shell'),tab=shell&&shell.querySelector('.rg-inspector-tab[data-tab="effects"]');
      if(tab)tab.click();
      const effects=shell&&shell.querySelector('[data-pane="effects"]'),slot=effects&&effects.querySelector('[data-rg-audio-inspector-slot]');
      if(slot)renderInspector(templateId,slot);
    }
    const m=mounts.get(templateId);if(m&&m.inspectorHost)renderInspector(templateId,m.inspectorHost);
  }

  function ensureStandard(){
    const modal=document.getElementById('modal-top-template-customizer');if(!modal)return;
    const id=activeId();if(!id)return;
    if(!registry.has(id))registry.set(id,normalise(id,{duration:resolveDuration(id),clips:[]}));
    const shell=modal.querySelector('.rg-inspector-shell'),effects=shell&&shell.querySelector('[data-pane="effects"]');
    if(effects){
      let slot=effects.querySelector('[data-rg-audio-inspector-slot]');
      if(!slot){slot=document.createElement('div');slot.dataset.rgAudioInspectorSlot='1';effects.appendChild(slot);}
      if(slot.dataset.audioTemplate!==id){slot.dataset.audioTemplate=id;renderInspector(id,slot);}
    }
    const stage=document.getElementById('tpl-modal-preview-stage-container'),previewCol=document.getElementById('tpl-modal-preview-column');
    if(stage&&previewCol){
      let host=previewCol.querySelector('[data-rg-audio-lane-host]');
      if(!host){host=document.createElement('div');host.dataset.rgAudioLaneHost='1';stage.insertAdjacentElement('afterend',host);}
      if(host.dataset.audioTemplate!==id){host.dataset.audioTemplate=id;buildLane(id,host);}
      updatePlayheads(id,currentTime());
    }
  }

  function mountStandalone(opts){
    opts=opts||{};const id=opts.templateId;if(!id)return null;
    const timelineHost=typeof opts.timelineHost==='string'?document.querySelector(opts.timelineHost):opts.timelineHost;
    const inspectorHost=typeof opts.inspectorHost==='string'?document.querySelector(opts.inspectorHost):opts.inspectorHost;
    mounts.set(id,{timelineHost:timelineHost,inspectorHost:inspectorHost,timeProvider:opts.timeProvider||null});
    if(timelineHost)buildLane(id,timelineHost);if(inspectorHost)renderInspector(id,inspectorHost);
    return mounts.get(id);
  }

  function updatePlayheads(templateId,time){
    const spec=registry.get(templateId);if(!spec)return;
    document.querySelectorAll('[data-audio-template="'+cssEscape(templateId)+'"] [data-audio-playhead]').forEach(function(ph){
      ph.style.left='calc(78px + '+(clamp(time/spec.duration,0,1)*72).toFixed(3)+'%)';
    });
    const m=mounts.get(templateId);
    if(m&&m.timelineHost){
      const ph=m.timelineHost.querySelector('[data-audio-playhead]');if(ph)ph.style.left='calc(78px + '+(clamp(time/spec.duration,0,1)*72).toFixed(3)+'%)';
    }
  }
  function cssEscape(v){return String(v).replace(/"/g,'\\\"');}
  function rerenderTemplate(id){
    document.querySelectorAll('[data-rg-audio-lane-host][data-audio-template="'+cssEscape(id)+'"]').forEach(function(h){buildLane(id,h);});
    const m=mounts.get(id);if(m){if(m.timelineHost)buildLane(id,m.timelineHost);if(m.inspectorHost)renderInspector(id,m.inspectorHost);}
    const modal=document.getElementById('modal-top-template-customizer'),slot=modal&&modal.querySelector('[data-rg-audio-inspector-slot][data-audio-template="'+cssEscape(id)+'"]');if(slot)renderInspector(id,slot);
  }

  function refresh(){
    ensureStyles();ensureStandard();
    mounts.forEach(function(m,id){if(m.timeProvider){const v=m.timeProvider();if(v&&typeof v==='object')sync(id,num(v.time,0),!!v.playing);else updatePlayheads(id,num(v,0));}});
  }

  const observer=new MutationObserver(function(records){
    if(records.some(function(r){return Array.from(r.addedNodes).some(function(n){return n.nodeType===1&&(n.id==='modal-top-template-customizer'||(n.querySelector&&n.querySelector('#modal-top-template-customizer,.rg-inspector-shell')));});}))queueMicrotask(refresh);
  });
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',function(){observer.observe(document.body,{childList:true,subtree:true});refresh();});
  setInterval(refresh,350);

  window.RegaarderAudioLayers={
    register:register,get:get,select:select,sync:sync,stop:stop,mountStandalone:mountStandalone,refresh:refresh,
    list:function(id){return get(id).clips;},formatTime:fmt
  };
  refresh();
})();