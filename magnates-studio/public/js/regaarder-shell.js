/* Shared presentation layer. Existing cards, creation actions and editor handlers retain ownership. */
(()=>{
 'use strict';
 const home=document.getElementById('home-templates-discovery'),topbar=document.getElementById('top-nav-bar');
 if(!home||!topbar)return;
 const hero=home.firstElementChild;hero.classList.add('rm-library-hero');
 const badge=hero.firstElementChild;badge.classList.add('rm-library-eyebrow');badge.textContent='REGAARDER CINEMATIC LIBRARY';
 const headline=hero.querySelector('h2');headline.innerHTML='Your next story <span>starts here.</span>';
 const tagline=document.createElement('p');tagline.className='rm-library-tagline';tagline.textContent='Explore cinematic motion. Replace the assets. Make every scene yours.';headline.after(tagline);
 const search=document.getElementById('home-template-search-input');search.placeholder='Search templates, scenes, motion or ideas…';search.setAttribute('aria-label','Search templates');search.parentElement.parentElement.classList.add('rm-library-search');
 // Relocate original action nodes, preserving all attached click handlers.
 const create=document.createElement('details');create.className='rm-create-menu';create.innerHTML='<summary>Create <span aria-hidden="true">＋</span></summary><div class="rm-create-items"></div>';
 const items=create.querySelector('div');
 for(const id of ['btn-templates-open-editor','btn-top-blank-comp','btn-top-story-prompts','btn-top-assets-tools']){const node=document.getElementById(id);if(node)items.appendChild(node);}
 topbar.appendChild(create);
 document.addEventListener('click',e=>{if(!create.contains(e.target))create.open=false;else if(e.target.closest('button'))create.open=false;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){create.open=false;home.querySelector('.rm-filter-menu').open=false;}});
 const pills=document.getElementById('home-category-pills');const filters=document.createElement('details');filters.className='rm-filter-menu';filters.innerHTML='<summary>Filters <span aria-hidden="true">⌄</span></summary>';filters.appendChild(pills);
 const controls=document.createElement('div');controls.className='rm-library-controls';controls.innerHTML='<div class="rm-library-types" role="tablist" aria-label="Template types"></div>';controls.appendChild(filters);hero.after(controls);
 // Remove repeated workflow cards; their original actions remain in Create and the rail.
 const shortcuts=hero.querySelector('[style*="grid-template-columns: repeat(3"]');if(shortcuts)shortcuts.hidden=true;
 const grid=document.getElementById('home-templates-grid'),count=document.getElementById('home-templates-count'),heading=document.getElementById('home-templates-heading');
 let selected='all';const tabs=controls.firstElementChild;
 const labels={all:'All Templates',full:'Full Videos',scene:'Scenes',effect:'Effects & Layers'};
 for(const [key,label] of Object.entries(labels)){const button=document.createElement('button');button.type='button';button.role='tab';button.textContent=label;button.dataset.libraryKind=key;button.id='rm-library-tab-'+key;button.setAttribute('aria-controls','home-templates-grid');tabs.appendChild(button);}
 grid.setAttribute('role','tabpanel');
 const posters={
  'regaarder-minute17-chapter':'minute17','regaarder-minute16-chapter':'minute16',
  'regaarder-pele-pact-chapter':'pele','regaarder-final-chapter':'final',
  'regaarder-native3d-surface-builder':'native3d'
 };
 const originalSnapshot=window.tplGetSnapshot;
 window.tplGetSnapshot=function(id){return posters[id]?'/assets/template-previews/'+posters[id]+'.jpg':originalSnapshot?.apply(this,arguments);};
 function polishCard(card,tpl){
  const action=card.querySelector('.home-tpl-btn-use');
  if(action&&!action.dataset.rmCustomize){const button=document.createElement('button');button.type='button';button.className=action.className;button.dataset.rmCustomize='true';button.setAttribute('aria-label',(tpl.previewOnly?'Preview ':'Customize ')+(tpl.title||card.querySelector('h4')?.textContent||'template'));button.textContent=tpl.previewOnly?'Preview':'Customize';const icon=action.querySelector('svg');if(icon)button.appendChild(icon);action.replaceWith(button);}
  const badge=card.querySelector('.home-tpl-badge');if(badge&&!badge.dataset.rmKind){badge.textContent=({full:'Full video',scene:'Scene',effect:'Effect'})[kind(tpl)];badge.dataset.rmKind='true';}
  const img=card.querySelector('.home-tpl-img'),poster=posters[card.dataset.templateId];if(img&&poster&&!img.dataset.rmPoster){img.src='/assets/template-previews/'+poster+'.jpg';img.dataset.rmPoster='true';}
 }
 const meta=()=>typeof EFFECT_TEMPLATES_DATA!=='undefined'?EFFECT_TEMPLATES_DATA:[];
 const kind=tpl=>{if(tpl.libraryKind)return tpl.libraryKind;if(/master|\bfull\b/i.test((tpl.title||'')+' '+(tpl.badge||'')))return 'full';if(/scene|chapter|origins|native3d/.test(tpl.id||'')||['Documentary','Business Storytelling'].includes(tpl.category))return 'scene';return 'effect';};
 function apply(){let visible=0;const templates=meta();for(const card of grid.querySelectorAll('.home-tpl-card')){const tpl=templates.find(t=>t.id===card.dataset.templateId)||{id:card.dataset.templateId,title:card.querySelector('h4')?.textContent};polishCard(card,tpl);const show=selected==='all'||kind(tpl)===selected;card.hidden=!show;if(show)visible++;}for(const button of tabs.children){const active=button.dataset.libraryKind===selected;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}grid.setAttribute('aria-labelledby','rm-library-tab-'+selected);if(count)count.textContent=String(visible);if(heading)heading.textContent=labels[selected];let empty=home.querySelector('.rm-library-empty');if(!empty){empty=document.createElement('p');empty.className='rm-library-empty';empty.textContent='No templates in this view. Try another type or adjust your search and filters.';grid.after(empty);}empty.hidden=visible>0||!grid.querySelector('.home-tpl-card');}
 tabs.addEventListener('click',e=>{const button=e.target.closest('[data-library-kind]');if(button){selected=button.dataset.libraryKind;apply();}});
 tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...tabs.children],index=buttons.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].click();buttons[next].focus();});
 new MutationObserver(apply).observe(grid,{childList:true});apply();
 const luckinId='luckin-coffee-investigation-intro';
 const luckinTemplate={id:luckinId,title:'Luckin Coffee · Investigation Intro (30s)',category:'Business Storytelling',origCategory:'Business Storytelling',libraryKind:'scene',previewOnly:true,badge:'28-STATE ANIMATIC',difficulty:'Preview',timeToApply:'30 sec',previewGradient:'linear-gradient(135deg,#0d1d2a,#07090d)',description:'Evidence-led cinematic opening with staged map, app, cup-pickup, investigation, and paper reveals. Open the interactive 24 fps preview to scrub all 28 storyboard states and inspect layer groups.',tags:['Luckin Coffee','Documentary','Investigation','28 Frames','Layered Motion'],defaultImage:'/assets/luckin-coffee-storyboard/template/card-preview.jpg'};
 if(!meta().some(t=>t.id===luckinId))meta().push(luckinTemplate);
 const barryOpeningId='barry-minkow-opening';
 const barryOpening={id:barryOpeningId,title:'Barry Minkow · The $7 Million Job That Didn’t Exist',category:'Business Storytelling',origCategory:'Business Storytelling',libraryKind:'scene',previewOnly:true,badge:'8-SECOND LAYERED OPENING',difficulty:'Preview',timeToApply:'8 sec',previewGradient:'linear-gradient(135deg,#263543,#08090c)',description:'Flash bloom into Sacramento, separate moving storm sky, a blue tower cutout with a sweeping searchlight, editable gold title, corridor occlusion wipe, then a separate facade and caption-free portrait reveal. Scrub the eight-second animatic and edit each title layer.',tags:['Barry Minkow','Fraud','Documentary','8 Seconds','Layered Motion','Editable Titles'],defaultImage:'/assets/barry-minkow-opening/preview-poster.jpg'};
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
 const barryDialog=previewDialog.cloneNode(true);barryDialog.id='modal-barry-minkow-opening-preview';barryDialog.setAttribute('aria-label','Barry Minkow eight-second opening preview');barryDialog.querySelector('span').textContent='Barry Minkow · The $7 Million Job That Didn’t Exist · 8-second layered opening';barryDialog.querySelector('iframe').title='Interactive Barry Minkow eight-second opening preview';document.body.appendChild(barryDialog);
 const barryFrame=barryDialog.querySelector('[data-luckin-frame]');barryDialog.querySelector('[data-luckin-close]').addEventListener('click',()=>barryDialog.close());barryDialog.addEventListener('click',event=>{if(event.target===barryDialog)barryDialog.close();});barryDialog.addEventListener('close',()=>{barryFrame.src='about:blank';});
 const openBarryPreview=()=>{barryFrame.src='/assets/barry-minkow-opening/';barryDialog.showModal();barryDialog.querySelector('[data-luckin-close]').focus();};
 const applyTemplate=window.applySelectedHomepageTemplate;
 window.applySelectedHomepageTemplate=function(templateId,...args){if(templateId===luckinId){openLuckinPreview();return;}if(templateId===luckinPart2Id){openLuckinPart2Preview();return;}if(templateId===barryOpeningId){openBarryPreview();return;}return applyTemplate?.call(this,templateId,...args);};
 const startHover=window.startTemplateHoverVideo;
 if(startHover)window.startTemplateHoverVideo=function(card,tpl,...args){if(tpl?.id===luckinId||tpl?.id===luckinPart2Id||tpl?.id===barryOpeningId)return;return startHover.call(this,card,tpl,...args);};
 const stopHover=window.stopTemplateHoverVideo;
 if(stopHover)window.stopTemplateHoverVideo=function(card,tpl,...args){if(tpl?.id===luckinId||tpl?.id===luckinPart2Id||tpl?.id===barryOpeningId)return;return stopHover.call(this,card,tpl,...args);};
 window.renderHomepageTemplates?.();
 // Match homepage rail icons to the editor's thin outline icon language.
 const rail=document.getElementById('main-nav-rail');
 const syncRail=()=>{if(home.style.display==='none')return;for(const button of rail.querySelectorAll('.rail-btn')){const active=button.dataset.railTab==='templates';if(button.classList.contains('active')!==active)button.classList.toggle('active',active);}};
 if(rail){new MutationObserver(syncRail).observe(rail,{attributes:true,attributeFilter:['class'],subtree:true});new MutationObserver(syncRail).observe(home,{attributes:true,attributeFilter:['style']});syncRail();}
 const icons={templates:'M3 4h18v16H3z M3 9h18',all:'M12 16V3 M7 8l5-5 5 5 M4 14v7h16v-7',elements:'M5 20V10 M12 20V4 M19 20v-7',animate:'M8 4l12 8-12 8z',text:'M4 5h16 M12 5v15',icons:'M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',layers:'M12 3L2 8l10 5 10-5z M2 12l10 5 10-5 M2 16l10 5 10-5',projects:'M3 6h7l2 3h9v12H3z'};
 document.querySelectorAll('#main-nav-rail .rail-btn').forEach(button=>{const path=icons[button.dataset.railTab];if(path){const old=button.querySelector('svg');if(old){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',path);svg.appendChild(p);old.replaceWith(svg);}}});
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
  let context=shell.querySelector(':scope > .rm-inspector-context');
  if(!context){context=document.createElement('div');context.className='rm-inspector-context';context.innerHTML='<span class="rm-context-kicker"></span><strong></strong><span class="rm-context-help"></span>';shell.querySelector('.rg-inspector-tabs')?.after(context);}
  const identity=document.querySelector('.rg-ctx-toolbar:not([hidden]) .rg-ctx-identity-label');
  const selected=identity&&identity.getClientRects().length?identity.textContent.trim():'';
  const heading=scene?.label?.replace(/^\d+\s*[·:.]?\s*/,'')||selected||'Scene settings';
  const values=[scene?'CURRENT SCENE':selected?'SELECTED OBJECT':'INSPECTOR',heading,selected?'Selected: '+selected:scene?'Select an object on the canvas to edit it.':'Open a section to adjust its settings.'];
  [context.children[0],context.children[1],context.children[2]].forEach((el,i)=>{if(el.textContent!==values[i])el.textContent=values[i];});
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
