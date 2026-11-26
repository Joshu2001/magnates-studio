/* Shared presentation layer. Existing cards, creation actions and editor handlers retain ownership. */
(()=>{
 'use strict';
 const home=document.getElementById('home-templates-discovery'),topbar=document.getElementById('top-nav-bar');
 if(!home||!topbar)return;
 const hero=home.firstElementChild;if(hero)hero.classList.add('rm-library-hero');
 const search=document.getElementById('home-template-search-input');
 if(search){
   search.placeholder='Search templates, scenes, motion or ideas…';search.setAttribute('aria-label','Search templates');
   search.parentElement?.parentElement?.classList.add('rm-library-search');
 }
 // Relocate original Create menu into the top of the left vertical rail (Canva-style + Create).
 const rail=document.getElementById('main-nav-rail');
 let create=document.querySelector('.rm-create-menu');
 if(!create){
   create=document.createElement('details');create.className='rm-create-menu';create.innerHTML='<summary><span class="rm-create-plus" aria-hidden="true">＋</span><span class="rail-label">Create</span></summary><div class="rm-create-items"></div>';
   const items=create.querySelector('div');
   for(const id of ['btn-templates-open-editor','btn-top-blank-comp','btn-top-story-prompts','btn-top-assets-tools']){const node=document.getElementById(id);if(node)items.appendChild(node);}
 }
 if(create){
   const summary=create.querySelector('summary');
   if(summary&&!summary.querySelector('.rm-create-plus')){
     summary.innerHTML='<span class="rm-create-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span><span class="rail-label">Create</span>';
   }
   if(rail&&create.parentElement!==rail)rail.prepend(create);
 }
 // Use fixed-position flyout coordinates so menus escape #main-nav-rail's overflow-y:auto clipping.
 const positionRailFlyout=(anchor,panel)=>{
   if(!anchor||!panel)return;
   const r=anchor.getBoundingClientRect();
   panel.style.left=(Math.round(r.right)+10)+'px';
   const maxTop=window.innerHeight-Math.min(panel.offsetHeight||280,window.innerHeight-24)-16;
   panel.style.top=Math.max(12,Math.min(Math.round(r.top),maxTop))+'px';
 };
 if(create){
   create.addEventListener('toggle',()=>{if(create.open)positionRailFlyout(create.querySelector('summary'),create.querySelector('.rm-create-items'));});
 }
 document.addEventListener('click',e=>{
   if(create&&!create.contains(e.target))create.open=false;
   else if(create&&e.target.closest('button'))create.open=false;
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(create)create.open=false;const fm=home.querySelector('.rm-filter-menu');if(fm)fm.open=false;}});
 
 let controls=home.querySelector('.rm-library-controls');
 if(!controls){
   const pills=document.getElementById('home-category-pills');
   const filters=document.createElement('details');filters.className='rm-filter-menu';filters.innerHTML='<summary>Filters <span aria-hidden="true">⌄</span></summary>';if(pills)filters.appendChild(pills);
   controls=document.createElement('div');controls.className='rm-library-controls';controls.innerHTML='<div class="rm-library-types" role="tablist" aria-label="Template types"></div>';controls.appendChild(filters);if(hero)hero.after(controls);
 }
 // Remove repeated workflow cards; their original actions remain in Create and the rail.
 const shortcuts=hero?.querySelector('[style*="grid-template-columns: repeat(3"]');if(shortcuts)shortcuts.hidden=true;
 const grid=document.getElementById('home-templates-grid'),count=document.getElementById('home-templates-count'),heading=document.getElementById('home-templates-heading');
 let selected='all';const tabs=controls.querySelector('.rm-library-types')||controls.firstElementChild;
 const labels={all:'All Templates',full:'Full Videos',scene:'Scenes',effect:'Effects & Layers'};
 if(tabs&&tabs.children.length===0){
   for(const [key,label] of Object.entries(labels)){const button=document.createElement('button');button.type='button';button.role='tab';button.textContent=label;button.dataset.libraryKind=key;button.id='rm-library-tab-'+key;button.setAttribute('aria-controls','home-templates-grid');tabs.appendChild(button);}
 }
 if(grid)grid.setAttribute('role','tabpanel');
 const meta=()=>typeof EFFECT_TEMPLATES_DATA!=='undefined'?EFFECT_TEMPLATES_DATA:[];
 const kind=tpl=>{if(tpl.libraryKind)return tpl.libraryKind;if(/master|\bfull\b/i.test((tpl.title||'')+' '+(tpl.badge||'')))return 'full';if(/scene|chapter|origins|native3d/.test(tpl.id||'')||['Documentary','Business Storytelling'].includes(tpl.category))return 'scene';return 'effect';};
 function apply(){let visible=0;const templates=meta();if(grid){for(const card of grid.querySelectorAll('.home-tpl-card')){const tpl=templates.find(t=>t.id===card.dataset.templateId)||{id:card.dataset.templateId,title:card.querySelector('h4')?.textContent};const show=selected==='all'||(selected==='overlay'?(typeof window.isOverlayTemplate==='function'&&window.isOverlayTemplate(tpl)):kind(tpl)===selected);card.hidden=!show;if(show)visible++;}}if(tabs){for(const button of tabs.children){const active=button.dataset.libraryKind===selected;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}}if(grid)grid.setAttribute('aria-labelledby','rm-library-tab-'+selected);if(count)count.textContent=String(visible);if(heading)heading.textContent=labels[selected];let empty=home.querySelector('.rm-library-empty');if(!empty&&grid){empty=document.createElement('p');empty.className='rm-library-empty';empty.textContent='No templates in this view. Try another type or adjust your search and filters.';grid.after(empty);}if(empty&&grid)empty.hidden=visible>0||!grid.querySelector('.home-tpl-card');}
 if(tabs){
   tabs.addEventListener('click',e=>{const button=e.target.closest('[data-library-kind]');if(button){selected=button.dataset.libraryKind;apply();}});
   tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...tabs.children],index=buttons.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].click();buttons[next].focus();});
 }
 if(grid)new MutationObserver(apply).observe(grid,{childList:true});apply();
 const luckinId='luckin-coffee-investigation-intro';
 const luckinTemplate={id:luckinId,title:'Luckin Coffee · Investigation Intro (30s)',category:'Business Storytelling',origCategory:'Business Storytelling',libraryKind:'scene',previewOnly:true,badge:'28-STATE ANIMATIC',difficulty:'Preview',timeToApply:'30 sec',previewGradient:'linear-gradient(135deg,#0d1d2a,#07090d)',description:'Evidence-led cinematic opening with staged map, app, cup-pickup, investigation, and paper reveals. Open the interactive 24 fps preview to scrub all 28 storyboard states and inspect layer groups.',tags:['Luckin Coffee','Documentary','Investigation','28 Frames','Layered Motion'],defaultImage:'/assets/luckin-coffee-storyboard/template/card-preview.jpg'};
 if(!meta().some(t=>t.id===luckinId))meta().push(luckinTemplate);
 const barryOpeningId='barry-minkow-opening';
 const barryOpening={id:barryOpeningId,title:'Barry Minkow · Sacramento Tower Reveal',category:'Business Storytelling',origCategory:'Business Storytelling',libraryKind:'scene',previewOnly:true,badge:'8-SECOND LAYERED OPENING',difficulty:'Preview',timeToApply:'8 sec',previewGradient:'linear-gradient(135deg,#263543,#08090c)',description:'An expanding optical flash reveals Sacramento beneath moving storm clouds. One blue-gray construction tower cutout, including its scaffold bay, holds through the camera push as a searchlight sweeps and textured gold SACRAMENTO glides right across the building facade. A corridor wipe leads to separate facade and portrait layers.',tags:['Barry Minkow','Fraud','Documentary','8 Seconds','Layered Motion','Editable Location'],defaultImage:'/assets/barry-minkow-opening/preview-poster.jpg'};
 if(!meta().some(t=>t.id===barryOpeningId))meta().push(barryOpening);
 const luckinPart2Id='luckin-coffee-fraud-unravels';
 const luckinPart2={id:luckinPart2Id,title:'Luckin Coffee · The Fraud Unravels (30–60s)',category:'Business Storytelling',origCategory:'Business Storytelling',libraryKind:'scene',previewOnly:true,badge:'28-FRAME STORYBOARD',difficulty:'Storyboard',timeToApply:'30 sec',previewGradient:'linear-gradient(135deg,#14232d,#080b10)',description:'The next 30 seconds: SEC-attributed allegations, the audit discovery, company response, settlement, and delisting. Scrub 28 storyboard frames and inspect the planned motion and later asset needs.',tags:['Luckin Coffee','Documentary','Storyboard','28 Frames','Motion Plan'],defaultImage:'/assets/luckin-coffee-storyboard/template/part2/card-preview.svg'};
 if(!meta().some(t=>t.id===luckinPart2Id))meta().push(luckinPart2);
 const previewDialog=document.createElement('dialog');previewDialog.id='modal-luckin-template-preview';previewDialog.setAttribute('aria-label','Luckin Coffee investigation intro template preview');previewDialog.style.cssText='width:min(96vw,1540px);height:min(94vh,980px);max-width:none;max-height:none;padding:0;border:1px solid rgba(121,215,239,.3);border-radius:14px;background:#080b10;color:#eef5f9;box-shadow:0 28px 100px rgba(0,0,0,.75);overflow:hidden';
 previewDialog.innerHTML='<div style="height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px;background:#101722;border-bottom:1px solid #283445;font:600 13px Inter,Arial,sans-serif"><span>Luckin Coffee · Investigation Intro · 30-second template preview</span><button type="button" data-luckin-close aria-label="Close Luckin Coffee template preview" style="border:1px solid #34475a;border-radius:7px;background:#1c2937;color:#eef5f9;padding:6px 12px;cursor:pointer">Close</button></div><iframe title="Interactive Luckin Coffee 30-second template preview" data-luckin-frame src="about:blank" style="display:block;width:100%;height:calc(100% - 48px);border:0;background:#080b10"></iframe>';
 document.body.appendChild(previewDialog);
 const previewFrame=previewDialog.querySelector('[data-luckin-frame]');
 const closePreview=()=>previewDialog.close();
 previewDialog.querySelector('[data-luckin-close]').addEventListener('click',closePreview);
 previewDialog.addEventListener('click',event=>{if(event.target===previewDialog)closePreview();});
 previewDialog.addEventListener('close',()=>{previewFrame.src='about:blank';});
 const openLuckinPreview=()=>{previewFrame.src='/assets/luckin-coffee-storyboard/template/';previewDialog.showModal();previewDialog.querySelector('[data-luckin-close]').focus();};
 const part2Dialog=previewDialog.cloneNode(true);part2Dialog.id='modal-luckin-part2-preview';part2Dialog.setAttribute('aria-label','Luckin Coffee Part 2 storyboard preview');part2Dialog.querySelector('span').textContent='Luckin Coffee · The Fraud Unravels · 30–60-second storyboard';part2Dialog.querySelector('iframe').title='Interactive Luckin Coffee next 30 seconds storyboard';document.body.appendChild(part2Dialog);
 const part2Frame=part2Dialog.querySelector('[data-luckin-frame]');part2Dialog.querySelector('[data-luckin-close]').addEventListener('click',()=>part2Dialog.close());part2Dialog.addEventListener('click',event=>{if(event.target===part2Dialog)part2Dialog.close();});part2Dialog.addEventListener('close',()=>{part2Frame.src='about:blank';});
 const openLuckinPart2Preview=()=>{part2Frame.src='/assets/luckin-coffee-storyboard/template/part2/';part2Dialog.showModal();part2Dialog.querySelector('[data-luckin-close]').focus();};
 const barryDialog=previewDialog.cloneNode(true);barryDialog.id='modal-barry-minkow-opening-preview';barryDialog.setAttribute('aria-label','Barry Minkow eight-second opening preview');barryDialog.querySelector('span').textContent='Barry Minkow · Sacramento Tower Reveal · 8-second layered opening';barryDialog.querySelector('iframe').title='Interactive Barry Minkow eight-second opening preview';document.body.appendChild(barryDialog);
 const barryFrame=barryDialog.querySelector('[data-luckin-frame]');barryDialog.querySelector('[data-luckin-close]').addEventListener('click',()=>barryDialog.close());barryDialog.addEventListener('click',event=>{if(event.target===barryDialog)barryDialog.close();});barryDialog.addEventListener('close',()=>{barryFrame.src='about:blank';});
 const openBarryPreview=()=>{barryFrame.src='/assets/barry-minkow-opening/';barryDialog.showModal();barryDialog.querySelector('[data-luckin-close]').focus();};
 const applyTemplate=window.applySelectedHomepageTemplate;
 window.applySelectedHomepageTemplate=function(templateId,...args){if(templateId===luckinId){openLuckinPreview();return;}if(templateId===luckinPart2Id){openLuckinPart2Preview();return;}if(templateId===barryOpeningId){openBarryPreview();return;}return applyTemplate?.call(this,templateId,...args);};
 const startHover=window.startTemplateHoverVideo;
 if(startHover)window.startTemplateHoverVideo=function(card,tpl,...args){if(tpl?.id===luckinId||tpl?.id===luckinPart2Id||tpl?.id===barryOpeningId)return;return startHover.call(this,card,tpl,...args);};
 const stopHover=window.stopTemplateHoverVideo;
 if(stopHover)window.stopTemplateHoverVideo=function(card,tpl,...args){if(tpl?.id===luckinId||tpl?.id===luckinPart2Id||tpl?.id===barryOpeningId)return;return stopHover.call(this,card,tpl,...args);};
 window.renderHomepageTemplates?.();
 // Match homepage rail icons to the editor's thin outline icon language (no circles).
 const syncRail=()=>{
   const inEditor=home.style.display==='none';
   document.body.classList.toggle('rm-in-editor',inEditor);
   if(inEditor)return;
   for(const button of rail.querySelectorAll('.rail-btn')){const active=button.dataset.railTab==='templates';if(button.classList.contains('active')!==active)button.classList.toggle('active',active);}
 };
 if(rail){new MutationObserver(syncRail).observe(rail,{attributes:true,attributeFilter:['class'],subtree:true});new MutationObserver(syncRail).observe(home,{attributes:true,attributeFilter:['style']});syncRail();}
 const icons={templates:'M3 4h18v16H3z M3 9h18',all:'M12 16V3 M7 8l5-5 5 5 M4 14v7h16v-7',elements:'M5 20V10 M12 20V4 M19 20v-7',animate:'M8 4l12 8-12 8z',transitions:'M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 14H5V6h7v12zm7 0h-5V6h5v12z',text:'M4 5h16 M12 5v15',icons:'M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',layers:'M12 3L2 8l10 5 10-5z M2 12l10 5 10-5 M2 16l10 5 10-5',projects:'M3 6h7l2 3h9v12H3z'};
 document.querySelectorAll('#main-nav-rail .rail-btn').forEach(button=>{
   const path=icons[button.dataset.railTab];
   const old=button.querySelector('svg');
   if(path&&old){
     const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
     svg.setAttribute('viewBox','0 0 24 24');
     svg.setAttribute('aria-hidden','true');
     const p=document.createElementNS(svg.namespaceURI,'path');
     p.setAttribute('d',path);
     svg.appendChild(p);
     old.replaceWith(svg);
   }
 });

 // Organize left rail: primary items (Create, Templates, Projects, Uploads) + More (...) + bottom Notifications.
 if(rail&&!rail.querySelector('.rm-rail-more')){
   const primaryOrder=['templates','projects','all'];
   const primarySet=new Set(primaryOrder);
   const allBtns=[...rail.querySelectorAll(':scope > .rail-btn[data-rail-tab]')];
   const byTab=Object.fromEntries(allBtns.map(b=>[b.dataset.railTab,b]));
   for(const tab of primaryOrder){if(byTab[tab])rail.appendChild(byTab[tab]);}

   const secondary=allBtns.filter(b=>!primarySet.has(b.dataset.railTab));
   if(secondary.length){
     const moreWrap=document.createElement('details');
     moreWrap.className='rm-rail-more';
     moreWrap.innerHTML='<summary class="rm-rail-action-btn rm-rail-more-btn" title="More tools &amp; layers"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg><span class="rail-label">More</span></summary><div class="rm-rail-more-menu" role="menu"></div>';
     const menu=moreWrap.querySelector('.rm-rail-more-menu');
     secondary.forEach(btn=>menu.appendChild(btn));
     rail.appendChild(moreWrap);
     moreWrap.addEventListener('toggle',()=>{if(moreWrap.open)positionRailFlyout(moreWrap.querySelector('summary'),menu);});
     moreWrap.querySelector('summary')?.addEventListener('click',e=>{e.stopPropagation();if(create)create.open=false;});
     document.addEventListener('click',e=>{
       if(!moreWrap.contains(e.target))moreWrap.open=false;
       else if(e.target.closest('.rm-rail-more-menu .rail-btn'))moreWrap.open=false;
     });
     document.addEventListener('keydown',e=>{if(e.key==='Escape')moreWrap.open=false;});
   }
   rail.classList.add('rm-ready');

   // Bottom-pinned Real-Time Notifications bell on the rail
   const notifWrap=document.createElement('details');
   notifWrap.className='rm-rail-notif';
   notifWrap.innerHTML='<summary class="rm-rail-action-btn rm-rail-notif-btn" title="Notifications" aria-label="Notifications"><span class="rm-notif-icon-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="rm-notif-badge" hidden>0</span></span><span class="rail-label">Alerts</span></summary><div class="rm-rail-notif-menu"><div class="rm-notif-head"><strong>Alerts</strong><button type="button" class="rm-notif-clear" data-notif-read-all>Mark all read</button></div><div class="rm-notif-list"><p class="rm-notif-empty">You\'re all caught up. Live alerts and support updates will appear here.</p></div></div>';
   rail.appendChild(notifWrap);
   notifWrap.addEventListener('toggle',()=>{if(notifWrap.open)positionRailFlyout(notifWrap.querySelector('summary'),notifWrap.querySelector('.rm-rail-notif-menu'));});
   notifWrap.querySelector('summary')?.addEventListener('click',e=>{e.stopPropagation();if(create)create.open=false;const mw=rail.querySelector('.rm-rail-more');if(mw)mw.open=false;});
   document.addEventListener('click',e=>{if(!notifWrap.contains(e.target))notifWrap.open=false;});
   document.addEventListener('keydown',e=>{if(e.key==='Escape')notifWrap.open=false;});

   const notifBadge=notifWrap.querySelector('.rm-notif-badge');
   const notifListEl=notifWrap.querySelector('.rm-notif-list');
   let notifItems=[];
   const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   const renderNotifs=(items,unreadCount)=>{
     notifItems=Array.isArray(items)?items:[];
     const count=typeof unreadCount==='number'?unreadCount:notifItems.filter(n=>!n.read).length;
     if(notifBadge){
       notifBadge.textContent=count>9?'9+':String(count);
       notifBadge.hidden=count<=0;
     }
     if(!notifListEl)return;
     if(!notifItems.length){
       notifListEl.innerHTML='<p class="rm-notif-empty">You\'re all caught up. Live alerts and support updates will appear here.</p>';
       return;
     }
     notifListEl.innerHTML=notifItems.slice(0,15).map(n=>{
       const t=n.createdAt?new Date(n.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'';
       return `<button type="button" class="rm-notif-item ${n.read?'':'is-unread'}" data-notif-id="${esc(n.id)}"><span class="rm-notif-dot"></span><span class="rm-notif-copy"><strong>${esc(n.title)}</strong><span>${esc(n.message)}</span><em>${esc(t)}</em></span></button>`;
     }).join('');
   };
   const markNotifRead=(id)=>{
     fetch('/api/notifications/read',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(id?{id}:{})})
       .then(r=>r.json()).then(d=>{if(d?.ok)renderNotifs(d.notifications,d.unreadCount);}).catch(()=>{});
   };
   notifWrap.querySelector('[data-notif-read-all]')?.addEventListener('click',()=>markNotifRead(null));
   notifListEl?.addEventListener('click',e=>{const btn=e.target.closest('[data-notif-id]');if(btn)markNotifRead(btn.dataset.notifId);});
   if(typeof EventSource!=='undefined'){
     const es=new EventSource('/api/notifications/stream');
     es.addEventListener('init',e=>{try{const d=JSON.parse(e.data);renderNotifs(d.notifications,d.unreadCount);}catch(_){}});
     es.addEventListener('notification',e=>{try{const d=JSON.parse(e.data);if(d.item)renderNotifs([d.item,...notifItems.filter(x=>x.id!==d.item.id)],d.unreadCount);}catch(_){}});
     es.addEventListener('sync',e=>{try{const d=JSON.parse(e.data);renderNotifs(d.notifications,d.unreadCount);}catch(_){}});
   }else{
     fetch('/api/notifications').then(r=>r.json()).then(d=>{if(d?.ok)renderNotifs(d.notifications,d.unreadCount);}).catch(()=>{});
   }
 }

 // Floating bottom-right Customer Support Module (?)
 if(!document.getElementById('rm-floating-help')){
   const helpWrap=document.createElement('details');
   helpWrap.id='rm-floating-help';
   helpWrap.className='rm-floating-help';
   helpWrap.innerHTML=`
     <summary class="rm-help-fab" title="Customer Support" aria-label="Customer Support">?</summary>
     <div class="rm-help-popover rm-support-card">
       <div class="rm-support-head">
         <div><strong>Customer Support</strong><span>Send a ticket with files or screenshots</span></div>
         <button type="button" class="rm-support-close" data-support-close aria-label="Close">&times;</button>
       </div>
       <form class="rm-support-form" data-support-form novalidate>
         <label class="rm-support-field"><span>Title</span><input type="text" id="rm-support-title" name="title" placeholder="Short summary of your issue…" required></label>
         <div class="rm-support-row">
           <label class="rm-support-field"><span>Category</span><select id="rm-support-category" name="category"><option value="Bug Report">Bug Report</option><option value="Feature Request">Feature Request</option><option value="Render &amp; Export">Render &amp; Export</option><option value="Account">Account</option></select></label>
           <label class="rm-support-field"><span>Email (optional)</span><input type="email" id="rm-support-email" name="email" placeholder="you@studio.com"></label>
         </div>
         <label class="rm-support-field"><span>Details</span><textarea id="rm-support-message" name="message" rows="3" placeholder="Tell us what happened or what you need…"></textarea></label>
         <div class="rm-support-dropzone" data-support-drop>
           <input type="file" id="rm-support-files" multiple accept="image/*,.pdf,.txt,.log,.json,.zip,.mp4,.mov" hidden>
           <button type="button" class="rm-support-attach-btn" data-support-pick>+ Attach images or files</button>
           <div class="rm-support-files" data-support-file-list></div>
         </div>
         <p class="rm-support-status" data-support-status hidden></p>
         <button type="submit" class="rm-support-submit">Submit Ticket</button>
       </form>
     </div>`;
   document.body.appendChild(helpWrap);
   const form=helpWrap.querySelector('[data-support-form]');
   const fileInput=helpWrap.querySelector('#rm-support-files');
   const fileListEl=helpWrap.querySelector('[data-support-file-list]');
   const dropzone=helpWrap.querySelector('[data-support-drop]');
   const statusEl=helpWrap.querySelector('[data-support-status]');
   let supportFiles=[];
   const renderFiles=()=>{
     if(!fileListEl)return;
     fileListEl.innerHTML=supportFiles.map((f,idx)=>{
       const isImg=/^image\//i.test(f.type||'');
       const thumb=isImg?`<img src="${URL.createObjectURL(f)}" alt="">`:'';
       return `<span class="rm-support-file-chip">${thumb}<span>${f.name.replace(/[<>&"]/g,'')}</span><button type="button" data-remove-file="${idx}" aria-label="Remove">&times;</button></span>`;
     }).join('');
   };
   const addFiles=(files)=>{for(const f of files)if(supportFiles.length<10)supportFiles.push(f);renderFiles();};
   helpWrap.querySelector('[data-support-close]')?.addEventListener('click',()=>{helpWrap.open=false;});
   helpWrap.querySelector('[data-support-pick]')?.addEventListener('click',()=>fileInput?.click());
   fileInput?.addEventListener('change',()=>{addFiles(Array.from(fileInput.files||[]));fileInput.value='';});
   fileListEl?.addEventListener('click',e=>{const rm=e.target.closest('[data-remove-file]');if(rm){supportFiles.splice(Number(rm.dataset.removeFile),1);renderFiles();}});
   dropzone?.addEventListener('dragover',e=>{e.preventDefault();dropzone.classList.add('is-dragover');});
   dropzone?.addEventListener('dragleave',()=>dropzone.classList.remove('is-dragover'));
   dropzone?.addEventListener('drop',e=>{e.preventDefault();dropzone.classList.remove('is-dragover');addFiles(Array.from(e.dataTransfer?.files||[]));});
   form?.addEventListener('submit',async e=>{
     e.preventDefault();
     const title=helpWrap.querySelector('#rm-support-title')?.value.trim()||'';
     const category=helpWrap.querySelector('#rm-support-category')?.value||'General';
     const email=helpWrap.querySelector('#rm-support-email')?.value.trim()||'';
     const message=helpWrap.querySelector('#rm-support-message')?.value.trim()||'';
     if(!title){statusEl.textContent='Please enter a title first.';statusEl.className='rm-support-status is-err';statusEl.hidden=false;return;}
     const submitBtn=form.querySelector('.rm-support-submit');
     submitBtn.disabled=true;submitBtn.textContent='Sending…';
     try{
       const fd=new FormData();
       fd.append('title',title);fd.append('category',category);fd.append('email',email);fd.append('message',message);
       supportFiles.forEach(f=>fd.append('attachments',f));
       const res=await fetch('/api/support/tickets',{method:'POST',body:fd});
       const data=await res.json();
       if(!res.ok||!data.ok)throw new Error(data.error||'Failed to submit ticket');
       statusEl.textContent=`Ticket ${data.ticket.id} sent! Live alert added.`;
       statusEl.className='rm-support-status is-ok';statusEl.hidden=false;
       form.reset();supportFiles=[];renderFiles();
     }catch(err){
       statusEl.textContent=err.message||'Could not submit ticket.';
       statusEl.className='rm-support-status is-err';statusEl.hidden=false;
     }finally{
       submitBtn.disabled=false;submitBtn.textContent='Submit Ticket';
     }
   });
   document.addEventListener('click',e=>{if(!helpWrap.contains(e.target))helpWrap.open=false;});
   document.addEventListener('keydown',e=>{if(e.key==='Escape')helpWrap.open=false;});
 }

 // Visual Preview Cards for Studio Inspector Backdrop Style & Stage Overlay Effect
 function mountVisualSelectCards(selectId,items){
   const sel=document.getElementById(selectId);
   if(!sel||sel.dataset.rmVisualCards)return;
   sel.dataset.rmVisualCards='true';
   sel.classList.add('rm-visual-select-hidden');
   const grid=document.createElement('div');
   grid.className='rm-visual-card-grid';
   grid.innerHTML=items.map(it=>`<button type="button" class="rm-visual-card ${sel.value===it.value?'is-active':''}" data-val="${it.value}" title="${it.label}"><div class="rm-visual-thumb" style="${it.bg}"></div><span>${it.label}</span></button>`).join('');
   sel.after(grid);
   const sync=()=>{for(const b of grid.children)b.classList.toggle('is-active',b.dataset.val===sel.value);};
   grid.addEventListener('click',e=>{
     const btn=e.target.closest('.rm-visual-card');
     if(!btn)return;
     sel.value=btn.dataset.val;
     sel.dispatchEvent(new Event('change',{bubbles:true}));
     sync();
   });
   sel.addEventListener('change',sync);
 }
 mountVisualSelectCards('stage-bg-mode-select',[
   {value:'cyber_grid',label:'Cyber Set',bg:'background:linear-gradient(180deg,#090d1a 0%,#141a33 60%,#1e1b4b 100%),repeating-linear-gradient(90deg,rgba(139,92,246,.22) 0 1px,transparent 1px 10px);'},
   {value:'solid_black',label:'Solid Black',bg:'background:#050508;'},
   {value:'none',label:'Transparent',bg:'background:repeating-conic-gradient(#242636 0% 25%,#141622 0% 50%) 50%/10px 10px;'},
   {value:'color',label:'Studio Tint',bg:'background:linear-gradient(135deg,#1e1b4b,#312e81);'},
   {value:'vox_cream',label:'Cream Doc',bg:'background:linear-gradient(135deg,#f5efe2,#e7decb);'}
 ]);
 mountVisualSelectCards('stage-fx-select',[
   {value:'none',label:'Clean',bg:'background:#0d0e16;'},
   {value:'grid',label:'3D Grid',bg:'background:linear-gradient(180deg,#090c18 20%,#1e1b4b 100%),repeating-linear-gradient(90deg,rgba(96,165,250,.28) 0 1px,transparent 1px 9px);'},
   {value:'particles',label:'Embers',bg:'background:radial-gradient(circle at 30% 60%,#f97316 0%,transparent 35%),radial-gradient(circle at 70% 35%,#fb923c 0%,transparent 30%),#120c0a;'},
   {value:'silhouette',label:'Silhouette',bg:'background:radial-gradient(circle at 50% 45%,#334155 0%,#05060a 70%);'}
 ]);

 // Custom Live-Font Picker for #text-font
 (function initLiveFontPicker(){
   const sel=document.getElementById('text-font');
   if(!sel||sel.dataset.rmFontPicker)return;
   sel.dataset.rmFontPicker='true';
   sel.classList.add('rm-visual-select-hidden');
   const wrap=document.createElement('details');
   wrap.className='rm-font-picker';
   const options=[...sel.options].map(o=>({value:o.value,label:o.textContent}));
   const getLabel=(val)=>options.find(o=>o.value===val)?.label||options[0]?.label||'Inter';
   wrap.innerHTML=`
     <summary class="rm-font-trigger"><span class="rm-font-preview" style="font-family:${sel.value}">${getLabel(sel.value)}</span><span aria-hidden="true">⌄</span></summary>
     <div class="rm-font-menu">${options.map(o=>`<button type="button" class="rm-font-opt ${o.value===sel.value?'is-active':''}" data-val="${o.value.replace(/"/g,'&quot;')}" style="font-family:${o.value}"><span>Aa</span><em>${o.label}</em></button>`).join('')}</div>`;
   sel.after(wrap);
   const triggerSpan=wrap.querySelector('.rm-font-preview');
   const menuEl=wrap.querySelector('.rm-font-menu');
   wrap.addEventListener('toggle',()=>{
     if(wrap.open&&menuEl){
       const r=wrap.getBoundingClientRect();
       menuEl.style.left=Math.max(12,Math.round(r.left-246))+'px';
       menuEl.style.top=Math.max(12,Math.min(Math.round(r.top),window.innerHeight-260))+'px';
     }
   });
   const sync=()=>{
     if(triggerSpan){triggerSpan.textContent=getLabel(sel.value);triggerSpan.style.fontFamily=sel.value;}
     wrap.querySelectorAll('.rm-font-opt').forEach(b=>b.classList.toggle('is-active',b.dataset.val===sel.value));
   };
   wrap.querySelectorAll('.rm-font-opt').forEach(btn=>{
     btn.addEventListener('click',()=>{
       sel.value=btn.dataset.val;
       sel.dispatchEvent(new Event('change',{bubbles:true}));
       wrap.open=false;sync();
     });
   });
   sel.addEventListener('change',sync);
   document.addEventListener('click',e=>{if(!wrap.contains(e.target))wrap.open=false;});
 })();

 // Circular Color Swatch Popovers for #text-color and #text-highlight-color
 (function initCircularColorPickers(){
   const SWATCHES=['#ffffff','#f8fafc','#cbd5e1','#000000','#ff334b','#f43f5e','#ffd000','#f59e0b','#00e676','#10b981','#00f0ff','#38bdf8','#8b5cf6','#c084fc'];
   ['text-color','text-highlight-color'].forEach(id=>{
     const inp=document.getElementById(id);
     if(!inp||inp.dataset.rmColorSwatch)return;
     inp.dataset.rmColorSwatch='true';
     inp.classList.add('rm-visual-select-hidden');
     const wrap=document.createElement('details');
     wrap.className='rm-color-picker-wrap';
     wrap.innerHTML=`
       <summary class="rm-color-swatch-trigger" title="Choose color"><span class="rm-color-circle" style="background:${inp.value}"></span><code class="rm-color-hex">${inp.value}</code></summary>
       <div class="rm-color-popover">
         <div class="rm-color-grid">${SWATCHES.map(c=>`<button type="button" class="rm-color-dot-btn" data-hex="${c}" style="background:${c}" title="${c}"></button>`).join('')}</div>
         <button type="button" class="rm-color-custom-btn">Custom picker…</button>
       </div>`;
     inp.after(wrap);
     const circle=wrap.querySelector('.rm-color-circle');
     const hexEl=wrap.querySelector('.rm-color-hex');
     const sync=()=>{if(circle)circle.style.background=inp.value;if(hexEl)hexEl.textContent=inp.value;};
     wrap.querySelectorAll('.rm-color-dot-btn').forEach(b=>{
       b.addEventListener('click',()=>{
         inp.value=b.dataset.hex;
         inp.dispatchEvent(new Event('input',{bubbles:true}));
         inp.dispatchEvent(new Event('change',{bubbles:true}));
         wrap.open=false;sync();
       });
     });
     wrap.querySelector('.rm-color-custom-btn')?.addEventListener('click',()=>{wrap.open=false;inp.click();});
     inp.addEventListener('input',sync);
     inp.addEventListener('change',sync);
     document.addEventListener('click',e=>{if(!wrap.contains(e.target))wrap.open=false;});
   });
 })();

 // Visual Mini-Diagrams for Layer Arrangement & Clean Position Alignment
 (function initVisualInspectorCards(){
   const backBtn=document.getElementById('btn-text-layer-back');
   const frontBtn=document.getElementById('btn-text-layer-front');
   if(backBtn&&!backBtn.dataset.rmVisual){
     backBtn.dataset.rmVisual='true';
     backBtn.innerHTML='<svg viewBox="0 0 38 24" width="34" height="22" aria-hidden="true"><text x="4" y="17" fill="#cbd5e1" opacity="0.75" font-size="14" font-weight="800">T</text><rect x="12" y="4" width="20" height="15" rx="3" fill="#1e2235" stroke="currentColor" stroke-width="1.4"/><path d="M15 16l4-4 3 3 4-5 3 6z" fill="currentColor" opacity="0.65"/></svg><span>Behind Media</span>';
   }
   if(frontBtn&&!frontBtn.dataset.rmVisual){
     frontBtn.dataset.rmVisual='true';
     frontBtn.innerHTML='<svg viewBox="0 0 38 24" width="34" height="22" aria-hidden="true"><rect x="6" y="4" width="20" height="15" rx="3" fill="#1e2235" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.2"/><path d="M9 16l4-4 3 3 4-5 3 6z" fill="currentColor" opacity="0.28"/><text x="17" y="18" fill="#ffffff" font-size="14" font-weight="900">T</text></svg><span>In Front</span>';
   }
   const saveBtn=document.getElementById('btn-save-color-template');
   const presetLabel=saveBtn?.previousElementSibling;
   if(presetLabel&&/Color Presets/i.test(presetLabel.textContent)){
     presetLabel.textContent='Color Presets';
     presetLabel.style.whiteSpace='nowrap';
   }
 })();

 // Clean Animation Trigger + Side-Opening Live Animated Preview Popover
 (function initAnimationVisualGrid(){
   const sel=document.getElementById('text-anim');
   if(!sel||sel.dataset.rmVisualAnim)return;
   sel.dataset.rmVisualAnim='true';
   sel.classList.add('rm-visual-select-hidden');
   const presets=[
     {value:'pop',label:'Word Pop',cls:'rm-anim-demo-pop'},
     {value:'materialize',label:'Materialize',cls:'rm-anim-demo-fade'},
     {value:'slide_up',label:'Slide Up',cls:'rm-anim-demo-slide'},
     {value:'zoom_in',label:'Zoom In',cls:'rm-anim-demo-zoom'},
     {value:'typewriter',label:'Typewriter',cls:'rm-anim-demo-type'},
     {value:'stamp',label:'Impact',cls:'rm-anim-demo-stamp'},
     {value:'fade',label:'Fade In',cls:'rm-anim-demo-fade'},
     {value:'none',label:'Static',cls:''}
   ];
   const getLabel=(v)=>presets.find(p=>p.value===v)?.label||sel.selectedOptions[0]?.textContent||'Animation';
   const wrap=document.createElement('details');
   wrap.className='rm-anim-picker';
   wrap.innerHTML=`
     <summary class="rm-anim-trigger"><span class="rm-anim-current">${getLabel(sel.value)}</span><em>Preview ▾</em></summary>
     <div class="rm-anim-popover">
       <div class="rm-anim-popover-head"><strong>Animation Style</strong><span>Live motion preview</span></div>
       <div class="rm-anim-card-grid">
         ${presets.map(p=>`<button type="button" class="rm-anim-card ${sel.value===p.value?'is-active':''}" data-val="${p.value}"><div class="rm-anim-stage"><span class="rm-anim-sample ${p.cls}">Aa</span></div><span>${p.label}</span></button>`).join('')}
       </div>
     </div>`;
   sel.after(wrap);
   const pop=wrap.querySelector('.rm-anim-popover');
   const cur=wrap.querySelector('.rm-anim-current');
   wrap.addEventListener('toggle',()=>{
     if(wrap.open&&pop){
       const r=wrap.getBoundingClientRect();
       pop.style.left=Math.max(12,Math.round(r.left-290))+'px';
       pop.style.top=Math.max(12,Math.min(Math.round(r.top-40),window.innerHeight-280))+'px';
     }
   });
   const sync=()=>{
     if(cur)cur.textContent=getLabel(sel.value);
     wrap.querySelectorAll('.rm-anim-card').forEach(b=>b.classList.toggle('is-active',b.dataset.val===sel.value));
   };
   wrap.querySelectorAll('.rm-anim-card').forEach(btn=>{
     btn.addEventListener('click',()=>{
       sel.value=btn.dataset.val;
       sel.dispatchEvent(new Event('change',{bubbles:true}));
       wrap.open=false;sync();
     });
   });
   sel.addEventListener('change',sync);
   document.addEventListener('click',e=>{if(!wrap.contains(e.target))wrap.open=false;});
 })();

 // Side-Opening Visual SFX Picker for #text-sfx
 (function initSfxVisualPicker(){
   const sel=document.getElementById('text-sfx');
   if(!sel||sel.dataset.rmSfxPicker)return;
   sel.dataset.rmSfxPicker='true';
   sel.classList.add('rm-visual-select-hidden');
   const shortNames={
     whoosh:'Cinematic Whoosh',gentle_wind:'Gentle Wind',pencil_circle:'Pencil Circle',
     pencil_scribble:'Pencil Scribble',marker_swipe:'Marker Swipe',paper_tear:'Paper Tear',
     pop_cork:'Bubble Pop',bass_thud:'Bass Impact',camera_click:'Camera Click',
     glitch_burst:'Digital Glitch',none:'Silent'
   };
   const items=[...sel.options].map(o=>({value:o.value,label:shortNames[o.value]||o.textContent}));
   const getLabel=(v)=>items.find(i=>i.value===v)?.label||'Sound Effect';
   const wrap=document.createElement('details');
   wrap.className='rm-sfx-picker';
   wrap.innerHTML=`
     <summary class="rm-anim-trigger"><span class="rm-sfx-current">${getLabel(sel.value)}</span><em>Preview ▾</em></summary>
     <div class="rm-sfx-popover">
       <div class="rm-anim-popover-head"><strong>Sound Effect (SFX)</strong><span>Click to select</span></div>
       <div class="rm-sfx-list">
         ${items.map(it=>`<div class="rm-sfx-row ${sel.value===it.value?'is-active':''}" data-val="${it.value}"><button type="button" class="rm-sfx-select"><span class="rm-sfx-bars" aria-hidden="true"><i></i><i></i><i></i></span><span>${it.label}</span></button>${it.value!=='none'?`<button type="button" class="rm-sfx-play" title="Play preview">▶</button>`:''}</div>`).join('')}
       </div>
     </div>`;
   sel.after(wrap);
   const pop=wrap.querySelector('.rm-sfx-popover');
   const cur=wrap.querySelector('.rm-sfx-current');
   wrap.addEventListener('toggle',()=>{
     if(wrap.open&&pop){
       const r=wrap.getBoundingClientRect();
       pop.style.left=Math.max(12,Math.round(r.left-270))+'px';
       pop.style.top=Math.max(12,Math.min(Math.round(r.top-80),window.innerHeight-340))+'px';
     }
   });
   const sync=()=>{
     if(cur)cur.textContent=getLabel(sel.value);
     wrap.querySelectorAll('.rm-sfx-row').forEach(row=>row.classList.toggle('is-active',row.dataset.val===sel.value));
   };
   wrap.querySelectorAll('.rm-sfx-select').forEach(btn=>{
     btn.addEventListener('click',()=>{
       sel.value=btn.closest('.rm-sfx-row').dataset.val;
       sel.dispatchEvent(new Event('change',{bubbles:true}));
       wrap.open=false;sync();
     });
   });
   wrap.querySelectorAll('.rm-sfx-play').forEach(btn=>{
     btn.addEventListener('click',e=>{
       e.stopPropagation();
       sel.value=btn.closest('.rm-sfx-row').dataset.val;
       sel.dispatchEvent(new Event('change',{bubbles:true}));
       sync();
       document.getElementById('btn-preview-text-sfx')?.click();
     });
   });
   sel.addEventListener('change',sync);
   document.addEventListener('click',e=>{if(!wrap.contains(e.target))wrap.open=false;});
 })();

 // Global #right-inspector Polish: concise labels, strip inline emojis, collapse dense drawers
 (function standardizeRightSidebar(){
   const sidebar=document.getElementById('right-inspector');
   if(!sidebar)return;

   const editChartBtn=document.getElementById('btn-chart-open-modal');
   if(editChartBtn){
     const icon=editChartBtn.querySelector('svg');
     editChartBtn.textContent='';
     if(icon)editChartBtn.appendChild(icon);
     editChartBtn.appendChild(document.createTextNode('Edit'));
   }

   const motionBlurSec=document.getElementById('inspector-motionblur-flash-section');
   if(motionBlurSec&&!motionBlurSec.dataset.rmCollapsed){
     motionBlurSec.dataset.rmCollapsed='true';
     const headRow=motionBlurSec.firstElementChild;
     const bodyKids=[...motionBlurSec.children].slice(1);
     const details=document.createElement('details');
     details.className='rm-sub-drawer';
     const summary=document.createElement('summary');
     summary.textContent='Motion Blur & Camera Flash';
     const body=document.createElement('div');
     body.className='rm-sub-drawer-body';
     bodyKids.forEach(k=>body.appendChild(k));
     if(headRow)headRow.remove();
     details.appendChild(summary);
     details.appendChild(body);
     motionBlurSec.appendChild(details);
   }

   const emojiRe=/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2300-\u23FF\u2B50\uFE0F]/gu;
   const cleanText=(root)=>{
     const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
     let node;
     while((node=walker.nextNode())){
       if(!node.parentElement||node.parentElement.closest('script, style, input, textarea, select'))continue;
       if(emojiRe.test(node.nodeValue)){
         node.nodeValue=node.nodeValue.replace(emojiRe,'').replace(/\s{2,}/g,' ').trimStart();
       }
     }
   };
   cleanText(sidebar);
   new MutationObserver(()=>cleanText(sidebar)).observe(sidebar,{childList:true,subtree:true});

   // Embed + upload button inside .media-search-input-wrap (single container)
   const searchWrap=document.querySelector('#left-sidebar .media-search-input-wrap');
   const dropZone=document.getElementById('drop-zone');
   if(searchWrap&&dropZone&&dropZone.parentElement!==searchWrap){
     searchWrap.appendChild(dropZone);
   }

   // Default charts to transparent overlay with an optional "Chart Background" toggle
   const chartBody=document.querySelector('#card-chart-inspector .fx-body');
   if(chartBody&&!document.getElementById('rm-chart-bg-toggle')){
     const row=document.createElement('div');
     row.className='control-row';
     row.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;"><label style="margin:0;">Chart Background</label><label class="switch" style="width:26px;height:15px;"><input type="checkbox" id="rm-chart-bg-toggle"><span class="slider"></span></label></div>';
     chartBody.prepend(row);
     const toggle=row.querySelector('#rm-chart-bg-toggle');
     toggle?.addEventListener('change',()=>{
       const clip=window.selectedTimelineClip||window.activeTimelineClip;
       if(clip&&clip.chartData){
         clip.chartData.transparentBg=!toggle.checked;
         window.renderStudioFrame?.();
       }
     });
   }
 })();
 function refineToggle(button){if(button.dataset.rmRefined)return;button.dataset.rmRefined='true';const label=button.querySelector('#label-3d-mode');if(!label)return;const update=()=>{const active=window.topCustomizerState?.is3DMode??(window.topCustomizerState?.paperPreviewMode==='3d');const text=active?'Edit mode':'Enable editing';if(label.textContent!==text)label.textContent=text;button.setAttribute('aria-pressed',String(active));button.title=active?'Editing enabled — click to return to playback':'Enable direct object editing';};new MutationObserver(update).observe(label,{childList:true,subtree:true});update();}
 function refineMeshInspector(section){
  if(section.dataset.rmPrecision||!section.querySelector('[data-n3d-prop="editTool"]'))return;
  section.dataset.rmPrecision='true';const body=section.querySelector('.rg-section-body');if(!body)return;
  const details=document.createElement('details');details.className='rm-precision-drawer';const summary=document.createElement('summary');summary.textContent='Precision & shaping';details.appendChild(summary);
  const axis=body.querySelector('[data-n3d-prop="moveAxis"]');if(axis){const label=axis.previousElementSibling;if(label?.tagName==='LABEL')details.appendChild(label);details.appendChild(axis);}
  for(const label of [...body.children].filter(el=>el.tagName==='LABEL'&&el.querySelector('[data-n3d-target],[data-n3d-num="snapMillimetres"],[data-n3d-distance]')))details.appendChild(label);
  const moves=body.querySelector('[data-n3d-move]')?.parentElement;if(moves)details.appendChild(moves);
  const help=body.querySelector('p:not([data-n3d-feedback])');if(help)details.appendChild(help);
  body.appendChild(details);
 }
 const discover=node=>{if(node.nodeType!==1)return;if(node.id==='btn-toggle-3d-interactive-mode')refineToggle(node);if(node.classList.contains('rg-inspector-section'))refineMeshInspector(node);node.querySelectorAll?.('.rg-inspector-section').forEach(refineMeshInspector);node.querySelectorAll?.('#btn-toggle-3d-interactive-mode').forEach(refineToggle);};
 discover(document.body);new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)discover(node);}).observe(document.body,{childList:true,subtree:true});

 // Top-bar Sign up / Log in buttons & Auth Modal
 const AUTH_KEY = 'regaarder_motion_user';
 const signupBtn = document.getElementById('btn-auth-signup');
 const loginBtn = document.getElementById('btn-auth-login');
 const userBtn = document.getElementById('btn-auth-user');
 const avatarEl = document.getElementById('rm-auth-avatar');
 const userNameEl = document.getElementById('rm-auth-user-name');

 function getStoredUser() {
   try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (_) { return null; }
 }
 function syncAuthUI() {
   const user = getStoredUser();
   const signedIn = Boolean(user && user.email);
   if (signupBtn) signupBtn.hidden = signedIn;
   if (loginBtn) loginBtn.hidden = signedIn;
   if (userBtn) userBtn.hidden = !signedIn;
   if (signedIn) {
     const display = user.name || user.email.split('@')[0];
     const initials = display.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'RM';
     if (avatarEl) avatarEl.textContent = initials;
     if (userNameEl) userNameEl.textContent = display;
   }
 }

 let authModal = null;
 let authMode = 'login';
 function ensureAuthModal() {
   if (authModal) return authModal;
   authModal = document.createElement('div');
   authModal.id = 'rg-auth-modal';
   authModal.className = 'rm-auth-backdrop';
   authModal.setAttribute('role', 'dialog');
   authModal.setAttribute('aria-modal', 'true');
   authModal.setAttribute('aria-labelledby', 'rm-auth-heading');
   authModal.innerHTML = `
     <div class="rm-auth-card">
       <button type="button" class="rm-auth-close" data-auth-close aria-label="Close">&times;</button>
       <div class="rm-auth-brand">
         <img src="/assets/regaarder-ribbon.svg" alt="" width="34" height="20">
         <span>REGAARDER <em>MOTION</em></span>
       </div>
       <h3 class="rm-auth-title" id="rm-auth-heading">Welcome back</h3>
       <p class="rm-auth-sub" data-auth-sub>Save templates, sync scenes, and export in 4K.</p>
       <div class="rm-auth-tabs" role="tablist">
         <button type="button" class="rm-auth-tab" data-auth-tab="signup">Sign up</button>
         <button type="button" class="rm-auth-tab is-active" data-auth-tab="login">Log in</button>
       </div>
       <div class="rm-auth-oauth">
         <button type="button" class="rm-auth-oauth-btn" data-auth-provider="Google">
           <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.25-.96 2.31-2.04 3.02l3.3 2.56c1.92-1.77 3.04-4.38 3.04-7.48 0-.72-.06-1.41-.19-2.08H12z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.3-2.56c-.9.61-2.05.97-3.32.97-2.55 0-4.71-1.72-5.48-4.04H3.1v2.64A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.52 13.95A6 6 0 0 1 6.2 12c0-.68.12-1.34.32-1.95V7.41H3.1A10 10 0 0 0 2 12c0 1.61.39 3.14 1.1 4.59l3.42-2.64z"/><path fill="#4285F4" d="M12 6.01c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.1 7.41l3.42 2.64C7.29 7.73 9.45 6.01 12 6.01z"/></svg>
           <span>Continue with Google</span>
         </button>
       </div>
       <div class="rm-auth-divider">or with email</div>
       <form data-auth-form novalidate>
         <div class="rm-auth-field" data-auth-name-wrap hidden>
           <label for="rm-auth-name">Full name</label>
           <input id="rm-auth-name" type="text" placeholder="Alex Rivera" autocomplete="name">
         </div>
         <div class="rm-auth-field">
           <label for="rm-auth-email">Email</label>
           <input id="rm-auth-email" type="email" placeholder="you@studio.com" autocomplete="email" required>
         </div>
         <div class="rm-auth-field">
           <label for="rm-auth-pass">Password</label>
           <div class="rm-auth-input-wrap">
             <input id="rm-auth-pass" type="password" placeholder="At least 6 characters" autocomplete="current-password" required>
             <button type="button" class="rm-auth-eye" data-auth-eye>Show</button>
           </div>
         </div>
         <button type="submit" class="rm-auth-submit" data-auth-submit>Log in</button>
         <div class="rm-auth-msg" data-auth-msg></div>
       </form>
       <div class="rm-auth-footer">
         <span data-auth-switch-text>New to Regaarder Motion?</span>
         <button type="button" data-auth-switch>Create an account</button>
       </div>
     </div>
   `;
   document.body.appendChild(authModal);

   const setMode = (mode) => {
     authMode = mode === 'signup' ? 'signup' : 'login';
     const isSignup = authMode === 'signup';
     authModal.querySelector('#rm-auth-heading').textContent = isSignup ? 'Create your account' : 'Welcome back';
     authModal.querySelector('[data-auth-sub]').textContent = isSignup
       ? 'Start building cinematic motion scenes.'
       : 'Save templates, sync scenes, and export in 4K.';
     authModal.querySelector('[data-auth-name-wrap]').hidden = !isSignup;
     authModal.querySelector('[data-auth-submit]').textContent = isSignup ? 'Create account' : 'Log in';
     authModal.querySelector('[data-auth-switch-text]').textContent = isSignup ? 'Already have an account?' : 'New to Regaarder Motion?';
     authModal.querySelector('[data-auth-switch]').textContent = isSignup ? 'Log in' : 'Create an account';
     authModal.querySelector('[data-auth-msg]').textContent = '';
     authModal.querySelectorAll('[data-auth-tab]').forEach((t) => {
       t.classList.toggle('is-active', t.getAttribute('data-auth-tab') === authMode);
     });
   };

   const closeModal = () => authModal.classList.remove('is-open');
   authModal.addEventListener('click', (e) => {
     if (e.target === authModal || e.target.closest('[data-auth-close]')) closeModal();
   });
   document.addEventListener('keydown', (e) => {
     if (e.key === 'Escape' && authModal.classList.contains('is-open')) closeModal();
   });
   authModal.querySelectorAll('[data-auth-tab]').forEach((t) => {
     t.addEventListener('click', () => setMode(t.getAttribute('data-auth-tab')));
   });
   authModal.querySelector('[data-auth-switch]').addEventListener('click', () => {
     setMode(authMode === 'signup' ? 'login' : 'signup');
   });
   authModal.querySelector('[data-auth-eye]').addEventListener('click', (e) => {
     const inp = authModal.querySelector('#rm-auth-pass');
     const show = inp.type === 'password';
     inp.type = show ? 'text' : 'password';
     e.currentTarget.textContent = show ? 'Hide' : 'Show';
   });
   authModal.querySelector('[data-auth-provider]').addEventListener('click', () => {
     const msg = authModal.querySelector('[data-auth-msg]');
     localStorage.setItem(AUTH_KEY, JSON.stringify({ name: 'Creator Studio', email: 'creator@regaarder.studio' }));
     msg.classList.add('is-ok');
     msg.textContent = 'Signed in with Google.';
     syncAuthUI();
     setTimeout(closeModal, 450);
   });
   authModal.querySelector('[data-auth-form]').addEventListener('submit', (e) => {
     e.preventDefault();
     const name = authModal.querySelector('#rm-auth-name').value.trim();
     const email = authModal.querySelector('#rm-auth-email').value.trim();
     const pass = authModal.querySelector('#rm-auth-pass').value;
     const msg = authModal.querySelector('[data-auth-msg]');
     msg.classList.remove('is-ok');
     if (!email || !email.includes('@')) { msg.textContent = 'Please enter a valid email address.'; return; }
     if (pass.length < 6) { msg.textContent = 'Password must be at least 6 characters.'; return; }
     localStorage.setItem(AUTH_KEY, JSON.stringify({ name: name || email.split('@')[0], email }));
     msg.classList.add('is-ok');
     msg.textContent = authMode === 'signup' ? 'Account created!' : 'Logged in!';
     syncAuthUI();
     setTimeout(closeModal, 450);
   });
   authModal._setMode = setMode;
   return authModal;
 }

 window.openRegaarderAuthModal = (mode = 'login') => {
   const m = ensureAuthModal();
   m._setMode(mode);
   m.classList.add('is-open');
   setTimeout(() => m.querySelector(mode === 'signup' ? '#rm-auth-name' : '#rm-auth-email')?.focus(), 60);
 };

 signupBtn?.addEventListener('click', () => window.openRegaarderAuthModal('signup'));
 loginBtn?.addEventListener('click', () => window.openRegaarderAuthModal('login'));
 userBtn?.addEventListener('click', () => {
   localStorage.removeItem(AUTH_KEY);
   syncAuthUI();
 });
 syncAuthUI();
})();

/* Library-wide inspector presentation. Move original nodes; never clone controls or handlers. */
(()=>{
 'use strict';
 const disclosureState=new Map();
 const paneNames={content:'Content',motion:'Animation & timing',look:'Appearance',effects:'Effects'};
 const taskIcons={content:'M3 4h18v16H3z M7 8h10 M7 12h10 M7 16h6',motion:'m8 4 12 8-12 8z',look:'M12 3a9 9 0 1 0 0 18V3z M12 3a9 9 0 0 1 0 18',effects:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z'};
 const getTemplate=shell=>{const modal=shell?.closest('.vector-export-modal');return modal&&modal.id!=='modal-top-template-customizer'?modal.id:window.topCustomizerState?.currentTpl?.id||'scene';};
 const titles={
  'Chapter Beats & Timeline':'Choose a scene','Documentary scenes':'Choose a scene',
  'Titles & Editorial Copy':'Scene text','Independent Layer & Media Slot':'Scene media',
  '3D Scene Preset & Foundation':'Character & scene','Anatomical Proportions':'Body proportions',
  'Mesh & Skeleton':'Shape & pose','Camera & Sequence Pace':'Camera & timing'
 };
 function makeGroup(title,children){
  const section=document.createElement('div');section.className='rg-inspector-section';
  const header=document.createElement('div');header.className='rg-section-header';
  const label=document.createElement('span');label.className='rg-section-title';label.textContent=title;header.appendChild(label);
  section.appendChild(header);for(const child of children)section.appendChild(child);return section;
 }
 function splitGeneric(section){
  const controls=[...section.children].filter(n=>n.dataset.inspectorKind);
  if(!controls.length)return;
  const pane=section.parentElement,groups=new Map();
  for(const node of controls){const key=node.dataset.inspectorKind;const name=key==='media'?'Scene media':key==='text'?'Text & captions':({motion:'Animation settings',look:'Appearance settings',effects:'Effects settings'}[pane.dataset.pane]||'Scene settings');if(!groups.has(name))groups.set(name,[]);groups.get(name).push(node);}
  for(const [name,nodes]of groups){
   // Keep a short initial form. Remaining controls stay accessible in a named drawer.
   if(nodes.length>5){pane.insertBefore(makeGroup(name,nodes.slice(0,4)),section);const more=makeGroup('More '+name.toLowerCase(),nodes.slice(4));more.dataset.rmStartClosed='true';pane.insertBefore(more,section);}
   else pane.insertBefore(makeGroup(name,nodes),section);
  }
  section.remove();
 }
 function normalize(section,index){
  if(section.dataset.rmInspector)return;
  const header=section.querySelector(':scope > .rg-section-header');
  if(!header)return;
  const interactiveHeader=!!header.querySelector('button,input,select');
  const title=header.querySelector('.rg-section-title');if(!title)return;
  const originalTitle=title.textContent.trim();title.textContent=titles[originalTitle]||originalTitle;
  const pane=section.closest('[data-pane]')?.dataset.pane||'advanced';
  const key=[getTemplate(section.closest('.rg-inspector-shell')),pane,originalTitle,index].join(':');
  const details=document.createElement('details');details.className='rm-inspector-task';
  const summary=document.createElement('summary');
  const icon=document.createElement('span');icon.className='rm-task-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="'+(taskIcons[pane]||taskIcons.effects)+'"/></svg>';
  const help=header.querySelector('.rg-section-subtitle')?.textContent.trim();if(help){summary.title=help;summary.setAttribute('aria-description',help);}
  summary.setAttribute('role','button');summary.appendChild(icon);
  if(interactiveHeader){const heading=document.createElement('span');heading.className='rm-task-heading';heading.textContent=title.textContent;summary.appendChild(heading);title.hidden=true;header.classList.add('rm-task-actions');}else summary.appendChild(header);
  details.appendChild(summary);
  const body=document.createElement('div');body.className='rm-task-body';
  for(const node of [...section.childNodes])body.appendChild(node);
  details.appendChild(body);section.appendChild(details);section.dataset.rmInspector='true';
  const essential=/choose a scene|scene text|text & captions|scene media|shape & pose/i.test(title.textContent);
  details.open=disclosureState.has(key)?disclosureState.get(key):section.dataset.rmStartClosed!=='true'&&(essential||index===0);
  summary.setAttribute('aria-expanded',String(details.open));
  details.addEventListener('toggle',()=>{disclosureState.set(key,details.open);summary.setAttribute('aria-expanded',String(details.open));});
  // Labels must remain meaningful without hover; help is supplementary.
  for(const field of section.querySelectorAll('input,select,textarea')){
   if(!field.getAttribute('aria-label')&&!field.labels?.length){
    const row=field.closest('.rg-ctrl-row,.rg-field-group,.rg-slider-row,.rg-toggle-row');
    const label=row?.querySelector('label,.rg-slider-header>span,.rg-toggle-label')?.textContent.trim()||(field.previousElementSibling?.tagName==='LABEL'?field.previousElementSibling.textContent.trim():'');
    if(label)field.setAttribute('aria-label',label);
   }
  }
 }
 function enhance(shell){
  if(!shell?.isConnected)return;
  for(const pane of shell.querySelectorAll('.rg-tab-pane')){
   for(const section of [...pane.children])if(section.classList.contains('rg-inspector-section')&&!section.dataset.rmInspector)splitGeneric(section);
   [...pane.children].filter(n=>n.classList.contains('rg-inspector-section')).forEach(normalize);
   if(!pane.querySelector('.rg-inspector-section')&&!pane.querySelector('.rm-pane-empty')){
    const empty=document.createElement('p');empty.className='rm-pane-empty';empty.textContent='No '+(paneNames[pane.dataset.pane]||'additional controls').toLowerCase()+' settings for this template.';pane.appendChild(empty);
   }else if(pane.querySelector('.rg-inspector-section'))pane.querySelector('.rm-pane-empty')?.remove();
  }
  shell.querySelectorAll('.rg-advanced-drawer > .rg-inspector-section').forEach(normalize);
 }
 function syncContext(shell){
  const state=window.topCustomizerState,tid=getTemplate(shell);
  const rt=window.REGAARDER_CHAPTER_RUNTIME?.[tid];
  const time=Number(state?.currentTime)||0;
  const scenes=rt?.scenes||[];
  const scene=[...scenes].reverse().find(s=>time>=s.start)||scenes[0];
  const select=shell.querySelector('[data-ch-action="jump-scene"]');
  if(scene&&select&&document.activeElement!==select)select.value=String(scene.start);
  shell.querySelector(':scope > .rm-inspector-context')?.remove();
  const mediaSelect=shell.querySelector('[data-ch-action="select-layer"]');
  if(mediaSelect){
   for(const option of mediaSelect.options){const name=rt?.stageObjects?.find(o=>o.layerId===option.value)?.name||option.value.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());if(option.textContent!==name)option.textContent=name;}
   const image=rt?.media?.[mediaSelect.value];
   const src=image?.tagName==='IMG'?(image.currentSrc||image.src):'';
   let preview=mediaSelect.closest('.rg-section-body')?.querySelector('.rm-selected-media');
   if(!preview){preview=document.createElement('div');preview.className='rm-selected-media';preview.innerHTML='<img alt="Selected layer preview"><span></span>';mediaSelect.closest('.rg-ctrl-row')?.before(preview);}
   if(preview){const img=preview.querySelector('img');if(src&&img.getAttribute('src')!==src)img.src=src;img.hidden=!src;const label=mediaSelect.selectedOptions[0]?.textContent||'Selected layer';if(preview.lastElementChild.textContent!==label)preview.lastElementChild.textContent=label;}
  }
  const signature=tid+':'+(scene?.id||'');
  if(shell.dataset.rmSceneContext===signature)return;
  if(shell.contains(document.activeElement)&&document.activeElement.matches('[data-ch-copy],[data-ch-prop]'))return;
  shell.dataset.rmSceneContext=signature;
  // Explicit scene membership only; unclassified controls are never hidden.
  const membership={
   'regaarder-final-chapter':{label:['Final Chapter'],title:['Final Chapter'],distress:['Financial distress'],adidasHQ:['Final rivalry'],pumaHQ:['Final rivalry']},
   'regaarder-pele-pact-chapter':{chapterTitle:['chapter'],chapterLabel:['chapter'],paperTitle:['newspapers'],secondTitle:['newspapers']},
   'regaarder-minute17-chapter':{bridgeTitle:['bridge'],bridgeSubtitle:['bridge']}
  }[tid]||{};
  const rows=[...shell.querySelectorAll('[data-ch-copy],[data-ch-prop]')].map(field=>({field,row:field.closest('.rg-ctrl-row')})).filter(x=>x.row&&membership[x.field.dataset.chCopy||x.field.dataset.chProp]);
  if(!rows.length)return;
  const body=rows[0].row.closest('.rm-task-body')||rows[0].row.parentElement;
  let other=body.querySelector(':scope > .rm-other-scene-text');
  if(!other){other=document.createElement('details');other.className='rm-other-scene-text';const summary=document.createElement('summary');summary.textContent='Text in other scenes';other.appendChild(summary);body.appendChild(other);}
  for(const {field,row}of rows){const belongs=membership[field.dataset.chCopy||field.dataset.chProp].includes(scene?.id);if(belongs)body.insertBefore(row,other);else other.appendChild(row);}
  other.hidden=other.children.length===1;
 }
 let queued=false;
 function refresh(){queued=false;for(const shell of document.querySelectorAll('.rg-inspector-shell')){enhance(shell);syncContext(shell);}}
 function schedule(){if(!queued){queued=true;queueMicrotask(refresh);}}
 // Watch only structural changes. Range dragging and animation frames do not rebuild the inspector.
 const observer=new MutationObserver(records=>{
  if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches('.rg-inspector-shell,.rg-tab-pane,.rg-inspector-section')||n.querySelector('.rg-inspector-shell,.rg-tab-pane,.rg-inspector-section')))))schedule();
 });
 observer.observe(document.body,{childList:true,subtree:true});
 window.RegaarderInspector={refresh:schedule};
 setInterval(()=>{for(const shell of document.querySelectorAll('.rg-inspector-shell'))if(shell.getClientRects().length)syncContext(shell);},300);
 schedule();
})();
