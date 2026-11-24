/* Shared presentation layer. Existing cards, creation actions and editor handlers retain ownership. */
(()=>{
 'use strict';
 const home=document.getElementById('home-templates-discovery'),topbar=document.getElementById('top-nav-bar');
 if(!home||!topbar)return;
 const hero=home.firstElementChild;if(hero)hero.classList.add('rm-library-hero');
 const badge=hero?.querySelector('.rm-library-eyebrow')||hero?.firstElementChild;
 if(badge){badge.classList.add('rm-library-eyebrow');badge.textContent='Effortless Visual Effects \u2022 Pro Storytelling';}
 const headline=hero?.querySelector('h2');
 if(headline)headline.innerHTML='Intuitive Editing, <span>Endless Creativity</span>';
 if(!hero?.querySelector('.rm-library-tagline')&&headline){
   const tagline=document.createElement('p');tagline.className='rm-library-tagline';tagline.textContent='Explore cinematic motion. Replace the assets. Make every scene yours.';headline.after(tagline);
 }
 const search=document.getElementById('home-template-search-input');
 if(search){
   search.placeholder='Search templates, scenes, motion or ideas…';search.setAttribute('aria-label','Search templates');
   search.parentElement?.parentElement?.classList.add('rm-library-search');
 }
 // Relocate original action nodes, preserving all attached click handlers.
 let create=topbar.querySelector('.rm-create-menu');
 if(!create){
   create=document.createElement('details');create.className='rm-create-menu';create.innerHTML='<summary>Create <span aria-hidden="true">＋</span></summary><div class="rm-create-items"></div>';
   const items=create.querySelector('div');
   for(const id of ['btn-templates-open-editor','btn-top-blank-comp','btn-top-story-prompts','btn-top-assets-tools']){const node=document.getElementById(id);if(node)items.appendChild(node);}
   topbar.appendChild(create);
 }
 document.addEventListener('click',e=>{if(!create.contains(e.target))create.open=false;else if(e.target.closest('button'))create.open=false;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){create.open=false;const fm=home.querySelector('.rm-filter-menu');if(fm)fm.open=false;}});
 
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
 // Match homepage rail icons to the editor's thin outline icon language.
 const rail=document.getElementById('main-nav-rail');
 const syncRail=()=>{if(home.style.display==='none')return;for(const button of rail.querySelectorAll('.rail-btn')){const active=button.dataset.railTab==='templates';if(button.classList.contains('active')!==active)button.classList.toggle('active',active);}};
 if(rail){new MutationObserver(syncRail).observe(rail,{attributes:true,attributeFilter:['class'],subtree:true});new MutationObserver(syncRail).observe(home,{attributes:true,attributeFilter:['style']});syncRail();}
 const icons={templates:'M3 4h18v16H3z M3 9h18',all:'M12 16V3 M7 8l5-5 5 5 M4 14v7h16v-7',elements:'M5 20V10 M12 20V4 M19 20v-7',animate:'M8 4l12 8-12 8z',transitions:'M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 14H5V6h7v12zm7 0h-5V6h5v12z',text:'M4 5h16 M12 5v15',icons:'M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',layers:'M12 3L2 8l10 5 10-5z M2 12l10 5 10-5 M2 16l10 5 10-5',projects:'M3 6h7l2 3h9v12H3z'};
 document.querySelectorAll('#main-nav-rail .rail-btn').forEach(button=>{const path=icons[button.dataset.railTab];if(path){const old=button.querySelector('svg');if(old){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',path);svg.appendChild(p);old.replaceWith(svg);}}});
 function refineToggle(button){if(button.dataset.rmRefined)return;button.dataset.rmRefined='true';const label=button.querySelector('#label-3d-mode');if(!label)return;const update=()=>{const active=window.topCustomizerState?.is3DMode??(window.topCustomizerState?.paperPreviewMode==='3d');const text=active?'Edit mode':'Enable editing';if(label.textContent!==text)label.textContent=text;button.setAttribute('aria-pressed',String(active));button.title=active?'Editing enabled — click to return to playback':'Enable direct object editing';};new MutationObserver(update).observe(label,{childList:true,subtree:true});update();}
 const discover=node=>{if(node.nodeType!==1)return;if(node.id==='btn-toggle-3d-interactive-mode')refineToggle(node);node.querySelectorAll?.('#btn-toggle-3d-interactive-mode').forEach(refineToggle);};
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
       <p class="rm-auth-sub" data-auth-sub>Log in to save templates, sync scenes, and export in 4K.</p>
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
       ? 'Start building cinematic motion scenes and save your work.'
       : 'Log in to save templates, sync scenes, and export in 4K.';
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
