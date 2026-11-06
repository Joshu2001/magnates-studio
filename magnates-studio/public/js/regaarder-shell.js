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
  if(action&&!action.dataset.rmCustomize){const button=document.createElement('button');button.type='button';button.className=action.className;button.dataset.rmCustomize='true';button.setAttribute('aria-label','Customize '+(tpl.title||card.querySelector('h4')?.textContent||'template'));button.textContent='Customize';const icon=action.querySelector('svg');if(icon)button.appendChild(icon);action.replaceWith(button);}
  const badge=card.querySelector('.home-tpl-badge');if(badge&&!badge.dataset.rmKind){badge.textContent=({full:'Full video',scene:'Scene',effect:'Effect'})[kind(tpl)];badge.dataset.rmKind='true';}
  const img=card.querySelector('.home-tpl-img'),poster=posters[card.dataset.templateId];if(img&&poster&&!img.dataset.rmPoster){img.src='/assets/template-previews/'+poster+'.jpg';img.dataset.rmPoster='true';}
 }
 const meta=()=>typeof EFFECT_TEMPLATES_DATA!=='undefined'?EFFECT_TEMPLATES_DATA:[];
 const kind=tpl=>{if(tpl.libraryKind)return tpl.libraryKind;if(/master|\bfull\b/i.test((tpl.title||'')+' '+(tpl.badge||'')))return 'full';if(/scene|chapter|origins|native3d/.test(tpl.id||'')||['Documentary','Business Storytelling'].includes(tpl.category))return 'scene';return 'effect';};
 function apply(){let visible=0;const templates=meta();for(const card of grid.querySelectorAll('.home-tpl-card')){const tpl=templates.find(t=>t.id===card.dataset.templateId)||{id:card.dataset.templateId,title:card.querySelector('h4')?.textContent};polishCard(card,tpl);const show=selected==='all'||kind(tpl)===selected;card.hidden=!show;if(show)visible++;}for(const button of tabs.children){const active=button.dataset.libraryKind===selected;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}grid.setAttribute('aria-labelledby','rm-library-tab-'+selected);if(count)count.textContent=String(visible);if(heading)heading.textContent=labels[selected];let empty=home.querySelector('.rm-library-empty');if(!empty){empty=document.createElement('p');empty.className='rm-library-empty';empty.textContent='No templates in this view. Try another type or adjust your search and filters.';grid.after(empty);}empty.hidden=visible>0||!grid.querySelector('.home-tpl-card');}
 tabs.addEventListener('click',e=>{const button=e.target.closest('[data-library-kind]');if(button){selected=button.dataset.libraryKind;apply();}});
 tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...tabs.children],index=buttons.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].click();buttons[next].focus();});
 new MutationObserver(apply).observe(grid,{childList:true});apply();
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
