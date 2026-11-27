/* Ponzi Minute 7 (07:00 - 08:00) Documentary Template Engine */
(function () {
  'use strict';

  const ASSET_BASE = '/assets/ponzi-min7';

  function writeOnText(text, progress, color, extraStyle) {
    const count = Math.max(0, Math.min(text.length, Math.floor(text.length * progress)));
    const visible = text.slice(0, count);
    return `<span style="color:${color};${extraStyle || ''}">${visible}</span>`;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function renderBeat(t) {
    // t is 0..60 seconds within Minute 7 (07:00 - 08:00)
    if (t < 3) {
      // 07:00 - 07:03: Leaving the Job
      const p = clamp01(t / 3);
      const showBalcony = t >= 1;
      const writeP = clamp01((t - 1) / 1.3);
      const slideX = t > 2.4 ? ((t - 2.4) / 0.6) * 100 : 0;
      return `
        <div style="position:absolute;inset:0;transform:translateX(${slideX}%);">
          <img src="${ASSET_BASE}/${showBalcony ? 'bg_city_balcony.jpg' : 'bg_office_handshake.svg'}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
          ${!showBalcony ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:64px;font-weight:700;color:#f5c518;text-shadow:0 4px 16px rgba(0,0,0,0.8);">Six Months</div>` : ''}
          ${showBalcony ? `<img src="${ASSET_BASE}/fg_man_back_suit.svg" style="position:absolute;left:50%;bottom:8%;transform:translateX(-50%);height:58%;"/>` : ''}
          <img src="${ASSET_BASE}/fg_handshake.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:${showBalcony ? 0.35 : 1};filter:${showBalcony ? 'blur(4px)' : 'none'};"/>
          ${showBalcony ? `<div style="position:absolute;left:34%;top:54%;transform:rotate(-10deg);font-family:'Brush Script MT',cursive;font-size:34px;text-shadow:0 0 12px rgba(245,197,24,0.8),0 3px 8px #000;">${writeOnText('looking for something new to do', writeP, '#f5c518')}</div>` : ''}
        </div>`;
    }

    if (t < 7) {
      // 07:03 - 07:07: Father-in-law's Fruit Business
      const writeP = clamp01((t - 4) / 1.5);
      const showArrows = t >= 6;
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/bg_watermelon_table.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
          <img src="${ASSET_BASE}/fg_father_in_law.svg" style="position:absolute;left:2%;bottom:0;height:78%;"/>
          <div style="position:absolute;right:8%;top:22%;font-family:'Brush Script MT',cursive;font-size:40px;text-shadow:0 3px 10px #000;">${writeOnText('Fruit selling business', writeP, '#f5c518')}</div>
          ${showArrows ? `<div style="position:absolute;right:12%;top:32%;font-size:72px;color:#fff;letter-spacing:16px;opacity:0.9;">⬇ ⬇ ⬇</div>` : ''}
        </div>`;
    }

    if (t < 13) {
      // 07:07 - 07:13: Financial Genius & The Challenge
      const writeP = clamp01((t - 8) / 1.4);
      const showCloseup = t >= 10;
      const leakP = clamp01((t - 12) / 1);
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/bg_dollar_bills.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
          ${showCloseup ? `<img src="${ASSET_BASE}/fg_ponzi_closeup.jpg" style="position:absolute;left:50%;top:0;transform:translateX(-50%);height:100%;opacity:0.85;"/>` : `<img src="${ASSET_BASE}/fg_ponzi_cash_fan.svg" style="position:absolute;left:4%;bottom:0;height:88%;"/>`}
          ${!showCloseup ? `<div style="position:absolute;left:22%;top:48%;font-family:'Brush Script MT',cursive;font-size:38px;text-shadow:0 3px 10px #000;">${writeOnText('Financial Genius', writeP, '#f5c518')}</div>` : ''}
          ${showCloseup ? `
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-weight:900;font-size:30px;text-align:center;text-shadow:0 4px 14px #000;line-height:1.25;">
              <div><span style="color:#fff;">THIS WAS </span><span style="color:#f5c518;">THE TIME</span><span style="color:#fff;"> FOR HIM</span></div>
              <div><span style="color:#f5c518;">TO SHOW</span><span style="color:#fff;"> EVERYONE</span></div>
              <div><span style="color:#fff;">WHAT HE </span><span style="color:#f5c518;">COULD DO</span></div>
            </div>` : ''}
          ${leakP > 0 ? `<img src="${ASSET_BASE}/fg_light_leak.svg" style="position:absolute;left:0;bottom:8%;width:100%;opacity:${leakP};"/>` : ''}
        </div>`;
    }

    if (t < 18) {
      // 07:13 - 07:18: Bankruptcy
      return `
        <div style="position:absolute;inset:0;background:#1a1410;">
          <img src="${ASSET_BASE}/fg_stressed_man.svg" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:92%;"/>
          <img src="${ASSET_BASE}/fg_light_leak.svg" style="position:absolute;left:0;bottom:10%;width:100%;opacity:0.85;"/>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-weight:900;font-size:28px;color:#fff;text-shadow:0 4px 14px #000;text-align:center;">
            <div>INSTEAD IT WENT BANKRUPT</div>
            <div>BY THE END OF THE YEAR</div>
          </div>
        </div>`;
    }

    if (t < 24) {
      // 07:18 - 07:24: Import & Export Business
      const isDesk = t >= 20;
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/${isDesk ? 'bg_typewriter_desk.svg' : 'bg_dramatic_sky.svg'}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
          ${!isDesk ? `<div style="position:absolute;left:50%;top:6%;transform:translateX(-50%);font-size:78px;color:#e53935;letter-spacing:14px;">⬇ ⬇ ⬇</div>` : ''}
          <img src="${ASSET_BASE}/fg_man_back_suit.svg" style="position:absolute;left:50%;bottom:4%;transform:translateX(-50%);height:58%;"/>
          ${isDesk ? `
            <div style="position:absolute;top:16%;left:50%;transform:translateX(-50%);text-align:center;font-family:Arial,sans-serif;font-weight:900;color:#f5c518;text-shadow:0 4px 14px #000;">
              <div style="font-size:18px;letter-spacing:2px;">IMPORT AND EXPORT</div>
              <div style="font-size:46px;line-height:1;">BUSINESS</div>
            </div>
            <div style="position:absolute;left:14%;top:42%;font-size:64px;color:#f5c518;">⬅</div>
            <div style="position:absolute;right:14%;top:42%;font-size:64px;color:#f5c518;">➡</div>` : ''}
        </div>`;
    }

    if (t < 30) {
      // 07:24 - 07:30: No Contacts, No Business
      const secondPart = t >= 27;
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/bg_globe_bokeh.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(2px);"/>
          <img src="${ASSET_BASE}/fg_man_back_suit.svg" style="position:absolute;left:${secondPart ? '22%' : '62%'};bottom:4%;transform:translateX(-50%);height:62%;"/>
          ${!secondPart ? `
            <div style="position:absolute;left:10%;top:36%;font-family:Arial,sans-serif;font-weight:900;font-size:32px;text-shadow:0 4px 14px #000;">
              <div style="color:#f5c518;">PONZI LACKED</div>
              <div style="color:#ff7043;">THE CONTACTS</div>
            </div>` : `
            <div style="position:absolute;right:8%;top:34%;font-family:Arial,sans-serif;font-weight:900;color:#f5c518;text-shadow:0 4px 14px #000;">
              <div style="font-size:20px;">TO ATTRACT ANY SERIOUS</div>
              <div style="font-size:52px;line-height:1;">BUSINESS</div>
            </div>`}
        </div>`;
    }

    if (t < 37) {
      // 07:30 - 07:37: PROBLEM -> ADVERTISE
      const isAdvertise = t >= 33;
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/${isAdvertise ? 'bg_chalkboard_math.svg' : 'bg_globe_bokeh.svg'}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
          <div style="position:absolute;left:50%;top:10%;transform:translateX(-50%);font-size:64px;color:#f5c518;">⬇</div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-weight:900;font-size:84px;color:#f5c518;letter-spacing:4px;text-shadow:0 6px 20px #000;">
            ${isAdvertise ? 'ADVERTISE' : 'PROBLEM'}
          </div>
          <img src="${ASSET_BASE}/fg_man_back_suit.svg" style="position:absolute;left:50%;bottom:4%;transform:translateX(-50%);height:58%;"/>
        </div>`;
    }

    if (t < 43) {
      // 07:37 - 07:43: Empty Wallet & Burning Money
      const isBurning = t >= 39.5;
      const writeP = clamp01((t - 38) / 1.3);
      return `
        <div style="position:absolute;inset:0;background:#12100e;">
          ${!isBurning ? `
            <img src="${ASSET_BASE}/fg_empty_wallet.svg" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:76%;"/>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Brush Script MT',cursive;font-size:38px;text-shadow:0 4px 14px #000;">${writeOnText('Costs were well outside his reach', writeP, '#ffffff')}</div>` : `
            <img src="${ASSET_BASE}/fg_burning_money.svg" style="position:absolute;right:12%;bottom:0;height:86%;"/>
            <div style="position:absolute;left:12%;top:42%;font-family:Georgia,serif;font-style:italic;font-size:34px;text-shadow:0 4px 12px #000;">
              <div style="color:#fff;">Became another</div>
              <div style="color:#e53935;font-weight:700;">Failed Venture</div>
            </div>`}
        </div>`;
    }

    if (t < 51) {
      // 07:43 - 07:51: The Lightbulb Idea
      const showBulb = t >= 45;
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/bg_sepia_vintage.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
          <img src="${ASSET_BASE}/fg_ponzi_closeup.svg" style="position:absolute;left:18%;bottom:0;height:88%;filter:sepia(0.75);"/>
          ${showBulb ? `<img src="${ASSET_BASE}/fg_lightbulb.svg" style="position:absolute;right:24%;top:14%;height:42%;"/>` : ''}
        </div>`;
    }

    if (t < 57) {
      // 07:51 - 07:57: Ponzi Magazine
      const showBank = t >= 53;
      const showHand = t >= 55;
      return `
        <div style="position:absolute;inset:0;">
          <img src="${ASSET_BASE}/bg_sepia_vintage.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(4px);"/>
          <img src="${ASSET_BASE}/fg_ponzi_magazine.svg" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:78%;box-shadow:0 12px 40px rgba(0,0,0,0.8);"/>
          ${showBank ? `
            <div style="position:absolute;left:8%;top:28%;width:22%;text-align:center;">
              <img src="${ASSET_BASE}/fg_icon_bank.svg" style="width:100%;"/>
              <div style="font-family:Georgia,serif;font-weight:700;font-size:20px;color:#fff;text-shadow:0 2px 8px #000;">COMPANIES PAY HIM</div>
            </div>` : ''}
          ${showHand ? `
            <div style="position:absolute;right:8%;top:28%;width:22%;text-align:center;">
              <img src="${ASSET_BASE}/fg_icon_hand_cash.svg" style="width:100%;"/>
              <div style="font-family:Georgia,serif;font-weight:700;font-size:20px;color:#fff;text-shadow:0 2px 8px #000;">SAME FEES</div>
            </div>` : ''}
        </div>`;
    }

    // 07:57 - 08:00: Zero Experience
    return `
      <div style="position:absolute;inset:0;">
        <img src="${ASSET_BASE}/bg_sepia_vintage.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
        <img src="${ASSET_BASE}/fg_ponzi_closeup.svg" style="position:absolute;left:8%;bottom:0;height:82%;filter:sepia(0.8);"/>
        <div style="position:absolute;right:8%;top:16%;text-align:left;text-shadow:0 4px 16px #000;">
          <div style="font-family:Georgia,serif;font-weight:900;font-size:88px;color:#fff;line-height:0.9;">ZERO</div>
          <div style="font-family:Georgia,serif;font-weight:700;font-size:18px;color:#f5c518;margin-top:8px;">EXPERIENCE WHEN IT CAME TO PUBLISHING</div>
        </div>
      </div>`;
  }


  // Editable opening: 07:00–07:15. Remaining minute retains the legacy renderer.
  // All timings are local seconds. Assets are replaceable; effects are sampled at t.
  const W=1280,H=720, NS='http://www.w3.org/2000/svg';
  const NEW=ASSET_BASE+'/opening/';
  const defaults={
    camera:{enabled:true,keyframes:[{t:0,x:0,y:0,scale:1,rotation:0},{t:1.12,x:0,y:0,scale:1.04,rotation:-2},{t:3.05,x:0,y:0,scale:1,rotation:0},{t:3.72,x:0,y:0,scale:1,rotation:0},{t:6.4,x:-20,y:0,scale:1.1,rotation:0},{t:7.32,x:0,y:0,scale:1,rotation:0},{t:10.28,x:0,y:0,scale:1.02,rotation:0},{t:12.76,x:0,y:0,scale:1.07,rotation:0},{t:15,x:0,y:0,scale:1.04,rotation:0}]},
    layers:[
      {id:'office',name:'Conference room',type:'image',asset:'office.jpg',fallback:'bg_office_handshake.svg',start:0,end:1.72,x:640,y:360,w:1280,h:720,z:0,depth:0,fadeOut:.6},
      {id:'city',name:'City and balcony',type:'image',asset:'city.jpg',fallback:'bg_city_balcony.jpg',start:1.12,end:3.72,x:640,y:360,w:1280,h:720,z:1,depth:0,fadeIn:.5,keys:[{t:3.24,x:640},{t:3.72,x:1920}]},
      {id:'balcony-man',name:'Businessman · rear view',type:'image',asset:'balcony-man.png',fallback:'fg_man_back_suit.svg',start:1.12,end:3.72,x:445,y:460,w:700,h:610,z:4,depth:.35,fadeIn:.48,keys:[{t:3.24,x:445},{t:3.72,x:1725}]},
      {id:'six-months',name:'Six months',type:'text',text:'Six months',font:'Georgia, serif',size:152,weight:700,color:'#e6d800',glow:14,reveal:'character',revealDuration:.65,start:.28,end:1.68,x:640,y:310,w:1200,h:200,z:5,depth:.4,fadeOut:.55,keys:[{t:.28,rotation:0},{t:1.68,rotation:-13}]},
      {id:'looking',name:'Looking for something new to do',type:'text',text:'looking for something new to do',font:'Brush Script MT, Segoe Script, cursive',size:63,weight:700,color:'#f5df00',glow:9,reveal:'character',revealDuration:.48,start:1.60,end:3.72,x:650,y:346,w:1200,h:110,z:6,depth:.5,rotation:-29,keys:[{t:3.24,x:650},{t:3.72,x:1930}]},
      {id:'handshake',name:'Handshake',type:'image',asset:'handshake.png',fallback:'fg_handshake.svg',start:0,end:3.55,x:640,y:330,w:1920,h:600,z:12,depth:1,rotation:-16,keys:[{t:0,x:640,y:330,scale:.92,blur:0},{t:1.12,x:660,y:355,scale:.98,blur:0},{t:2.08,x:860,y:495,scale:1.18,blur:7},{t:3.12,x:960,y:545,scale:1.24,blur:10},{t:3.55,x:1960,y:710,scale:1.3,blur:15}]},
      {id:'table',name:'Fruit market background',type:'image',asset:'table.jpg',fallback:'bg_watermelon_table.jpg',start:3.24,end:11.16,x:640,y:360,w:1280,h:720,z:2,depth:0,keys:[{t:3.24,x:-640},{t:3.72,x:640},{t:7.32,x:640},{t:8.2,x:860}],fadeOut:.35},
      {id:'melon',name:'Whole watermelon',type:'image',asset:'watermelon.png',start:3.24,end:11.16,x:690,y:255,w:450,h:460,z:5,depth:.3,keys:[{t:3.24,x:-590},{t:3.72,x:690},{t:7.32,x:690},{t:8.6,x:1420}],fadeOut:.4},
      {id:'slices',name:'Watermelon slices',type:'image',asset:'watermelon-slices.png',start:3.24,end:11.16,x:585,y:515,w:400,h:300,z:6,depth:.45,keys:[{t:3.24,x:-695},{t:3.72,x:585},{t:7.32,x:585},{t:8.6,x:1315}],fadeOut:.4},
      {id:'weights',name:'Antique scale weights',type:'image',asset:'weights.png',start:3.24,end:9.2,x:965,y:495,w:270,h:270,z:6,depth:.4,keys:[{t:3.24,x:-315},{t:3.72,x:965},{t:7.32,x:965},{t:8.6,x:1695}]},
      {id:'merchant',name:'Elderly fruit merchant',type:'image',asset:'merchant.png',fallback:'fg_father_in_law.svg',start:3.24,end:11.16,x:280,y:464,w:650,h:620,z:13,depth:1,keys:[{t:3.24,x:-1000},{t:3.72,x:280},{t:6.4,x:245,y:470,scale:1},{t:7.32,x:280,y:464,scale:1,blur:0},{t:8.6,x:950,y:465,scale:1.6,blur:14},{t:10.28,x:1030,y:490,scale:1.68,blur:17}],fadeOut:.38},
      {id:'fruit-title',name:'Fruit selling business',type:'text',text:'Fruit selling business',font:'Brush Script MT, Segoe Script, cursive',size:72,color:'#f5df00',weight:700,glow:7,reveal:'character',revealDuration:.88,start:4.68,end:8.6,x:830,y:310,w:850,h:120,z:10,depth:.5,keys:[{t:7.32,x:830},{t:8.6,x:1560}]},
      {id:'arrow-left',name:'Down arrow · left',type:'arrow',start:6.64,end:8.6,x:610,y:425,w:105,h:145,z:11,depth:.6,color:'#ffffff',stroke:9,revealDuration:.4,keys:[{t:7.32,x:610},{t:8.6,x:1340}]},
      {id:'arrow-center',name:'Down arrow · center',type:'arrow',start:6.64,end:8.6,x:810,y:450,w:105,h:195,z:11,depth:.6,color:'#ffffff',stroke:9,revealDuration:.4,keys:[{t:7.32,x:810},{t:8.6,x:1540}]},
      {id:'arrow-right',name:'Down arrow · right',type:'arrow',start:6.64,end:8.6,x:1010,y:425,w:105,h:145,z:11,depth:.6,color:'#ffffff',stroke:9,revealDuration:.4,keys:[{t:7.32,x:1010},{t:8.6,x:1740}]},
      {id:'cash-behind',name:'Falling cash · rear',type:'cash',asset:'banknote-1.png',start:7.72,end:11.16,x:640,y:360,w:1280,h:720,z:7,depth:.25,count:20,speed:135,size:82,seed:41,fadeIn:.3,fadeOut:.4},
      {id:'ponzi-standing',name:'Businessman with cash',type:'image',asset:'cash-man.png',fallback:'fg_ponzi_cash_fan.svg',start:7.92,end:11.16,x:210,y:390,w:440,h:760,z:9,depth:.55,keys:[{t:7.92,x:-240},{t:8.6,x:210}],fadeIn:.25,fadeOut:.35},
      {id:'cash-front',name:'Falling cash · front',type:'cash',asset:'banknote-2.png',start:7.72,end:11.16,x:640,y:360,w:1280,h:720,z:12,depth:.85,count:12,speed:205,size:112,seed:83,fadeIn:.4,fadeOut:.35},
      {id:'genius',name:'Financial Genius',type:'text',text:'Financial Genius',font:'Brush Script MT, Segoe Script, cursive',size:78,weight:700,color:'#f5df00',glow:9,reveal:'character',revealDuration:.48,start:9.44,end:11.16,x:380,y:335,w:720,h:130,z:12.5,depth:.6,fadeOut:.3},
      {id:'currency',name:'Teal currency collage',type:'image',asset:'currency.jpg',fallback:'bg_dollar_bills.svg',start:10.28,end:14.6,x:640,y:360,w:1280,h:720,z:20,depth:0,mask:'ink',revealDuration:.88,turbulence:1,feather:10,seed:29},
      {id:'portrait',name:'Grayscale portrait',type:'image',asset:'portrait.png',fallback:'fg_ponzi_closeup.jpg',start:10.28,end:14.6,x:640,y:408,w:970,h:940,z:21,depth:.5,mask:'ink',revealDuration:.88,turbulence:1,feather:10,seed:29,keys:[{t:10.28,scale:1},{t:12.76,scale:1.08}]},
      {id:'headline-1',name:'This was the time for him',type:'words',text:'THIS WAS THE TIME FOR HIM',emphasis:'THE TIME',font:'Arial, sans-serif',size:70,weight:900,color:'#fff',accent:'#f5df00',glow:3,start:10.60,end:14.6,x:640,y:280,w:1160,h:110,z:22,depth:.6,wordTimes:[0,.08,.16,.28,.4,.52]},
      {id:'headline-2',name:'To show everyone',type:'words',text:'TO SHOW EVERYONE',emphasis:'TO SHOW',font:'Arial, sans-serif',size:72,weight:900,color:'#fff',accent:'#f5df00',glow:3,start:11.24,end:14.6,x:640,y:380,w:1130,h:110,z:22,depth:.6,wordTimes:[0,.12,.24]},
      {id:'headline-3',name:'What he could do',type:'words',text:'WHAT HE COULD DO',emphasis:'COULD DO',font:'Arial, sans-serif',size:72,weight:900,color:'#fff',accent:'#f5df00',glow:3,start:11.84,end:14.6,x:640,y:480,w:1130,h:110,z:22,depth:.6,wordTimes:[0,.12,.24,.36]},
      {id:'amber',name:'Amber currency environment',type:'image',asset:'amber.jpg',fallback:'bg_dollar_bills.svg',start:12.76,end:15,x:640,y:360,w:1280,h:720,z:30,depth:0,mask:'burn',revealDuration:1.84,turbulence:1,feather:12,seed:53},
      {id:'amber-note-left',name:'Amber banknote · left',type:'image',asset:'banknote-1.png',start:12.76,end:15,x:430,y:340,w:840,h:380,z:30.2,depth:.18,rotation:73,opacity:.8,mask:'burn',revealDuration:1.84,turbulence:1,feather:12,seed:53,brightness:1.1,saturation:.7},
      {id:'amber-note-right',name:'Amber banknote · right',type:'image',asset:'banknote-2.png',start:12.76,end:15,x:850,y:360,w:900,h:410,z:30.3,depth:.24,rotation:110,opacity:.75,mask:'burn',revealDuration:1.84,turbulence:1,feather:12,seed:53,brightness:1.05,saturation:.7},
      {id:'amber-note-center',name:'Amber banknote · center',type:'image',asset:'banknote-1.png',start:12.76,end:15,x:650,y:360,w:880,h:410,z:30.4,depth:.3,rotation:90,opacity:.95,mask:'burn',revealDuration:1.84,turbulence:1,feather:12,seed:53,brightness:1.16,saturation:.8},
      {id:'distressed-man',name:'Distressed man · hands covering face',type:'image',asset:'distressed-man.png',fallback:'fg_stressed_man.svg',start:12.76,end:15,x:640,y:440,w:810,h:730,z:31,depth:.4,opacity:.62,blend:'screen',mask:'burn',revealDuration:1.84,turbulence:1,feather:12,seed:53,keys:[{t:12.76,opacity:.24},{t:14.6,opacity:.62},{t:15,opacity:.75}]},
      {id:'flare',name:'Horizontal light flare',type:'flare',start:12.92,end:15,x:625,y:570,w:1280,h:120,z:32,depth:.6,color:'#ff8529',intensity:1,fadeIn:.24},
      {id:'dust',name:'Atmospheric dust',type:'dust',start:0,end:15,x:640,y:360,w:1280,h:720,z:40,depth:.7,color:'#ffe1aa',count:42,speed:20,size:2.3,seed:17,opacity:.34}
    ]
  };
  const copy=o=>JSON.parse(JSON.stringify(o));
  const num=(x,d)=>Number.isFinite(Number(x))?Number(x):d;
  const smooth=x=>{x=clamp01(x);return x*x*(3-2*x);};
  const mix=(a,b,p)=>a+(b-a)*p;
  const rand=(seed,i)=>{const n=Math.sin(seed*78.233+i*12.9898)*43758.5453;return n-Math.floor(n);};
  const attr=(el,obj)=>{for(const [k,v] of Object.entries(obj))el.setAttribute(k,String(v));return el;};
  function svg(tag,attrs,parent){const el=document.createElementNS(NS,tag);attr(el,attrs||{});if(parent)parent.appendChild(el);return el;}
  function config(data){
    const saved=data&&data.ponziOpeningV2;
    const overrides=saved&&Array.isArray(saved.layers)?saved.layers:[];
    return {camera:Object.assign(copy(defaults.camera),saved&&saved.camera||{}),layers:defaults.layers.map(l=>Object.assign(copy(l),overrides.find(o=>o.id===l.id)||{}))};
  }
  function sample(obj,t){
    const keys=(obj.keys||obj.keyframes||[]).filter(k=>Number.isFinite(k.t)).slice().sort((a,b)=>a.t-b.t);
    const result=Object.assign({},obj);
    for(const prop of ['x','y','scale','rotation','blur','opacity']){
      const k=keys.filter(k=>Number.isFinite(k[prop]));
      if(!k.length)continue;
      let a=k[0],b=k[k.length-1];
      if(t<=a.t){result[prop]=a[prop];continue;}
      if(t>=b.t){result[prop]=b[prop];continue;}
      for(let i=1;i<k.length;i++)if(t<=k[i].t){a=k[i-1];b=k[i];break;}
      result[prop]=mix(a[prop],b[prop],smooth((t-a.t)/Math.max(.001,b.t-a.t)));
    }
    return result;
  }
  function imageURL(l){return l.url||NEW+l.asset;}
  function makeImage(p,l,w,h){
    const n=svg('image',{x:-w/2,y:-h/2,width:w,height:h,preserveAspectRatio:l.fit==='cover'?'xMidYMid slice':'xMidYMid meet',href:imageURL(l)},p);
    n.addEventListener('error',()=>{if(l.fallback&&n.getAttribute('href')!==ASSET_BASE+'/'+l.fallback)n.setAttribute('href',ASSET_BASE+'/'+l.fallback);});
    return n;
  }
  function resetOpening(canvas){
    canvas.innerHTML='';
    const root=svg('svg',{viewBox:'0 0 1280 720',width:'100%',height:'100%',preserveAspectRatio:'xMidYMid meet','aria-label':'Ponzi minute seven editable opening'},canvas);
    root.addEventListener('click',e=>{
      const hit=e.target.closest?.('[data-layer-id]');
      if(hit)window.tplSelectPonziMinute7Layer?.(hit.getAttribute('data-layer-id'));
    });
    const defs=svg('defs',{},root);
    const world=svg('g',{},root);
    canvas._opening={root,defs,world,groups:new Map(),signature:''};
    return canvas._opening;
  }
  let nextMask=0;
  function buildLayer(state,l){
    const outer=svg('g',{'data-layer-id':l.id,'aria-label':l.name},state.world);
    const g=svg('g',{},outer),r={outer,g,l,parts:[]};
    if(['dust','cash','flare'].includes(l.type))outer.style.pointerEvents='none';
    if(l.mask){
      const id='ponzi-opening-mask-'+(++nextMask),filterId=id+'-blur';
      const mask=svg('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:W,height:H},state.defs);
      const f=svg('filter',{id:filterId,x:'-30%',y:'-30%',width:'160%',height:'160%'},state.defs);
      svg('feGaussianBlur',{stdDeviation:Math.max(0,num(l.feather,10))},f);
      r.mask=svg('path',{fill:'#fff',filter:'url(#'+filterId+')'},mask);
      outer.setAttribute('mask','url(#'+id+')');
    }
    if(l.type==='image'){
      if(l.id==='amber')svg('rect',{x:-l.w/2,y:-l.h/2,width:l.w,height:l.h,fill:'#201009'},g);
      makeImage(g,l,l.w,l.h);
    }
    if(l.type==='text'||l.type==='words'){
      r.text=svg('text',{'text-anchor':'middle','dominant-baseline':'middle','font-family':l.font,'font-size':l.size,'font-weight':l.weight||700,fill:l.color||'#fff',style:'filter:drop-shadow(0 0 '+num(l.glow,0)+'px '+(l.accent||l.color||'#fff')+') drop-shadow(0 3px 4px #000);'},g);
      if(l.type==='text'&&l.reveal==='character'){
        r.text.textContent=String(l.text);
        const clipId='ponzi-type-clip-'+(++nextMask),clip=svg('clipPath',{id:clipId},state.defs);
        r.revealRect=svg('rect',{x:-l.w/2,y:-l.h,width:0,height:l.h*2},clip);
        r.text.setAttribute('clip-path','url(#'+clipId+')');
        try{const width=r.text.getComputedTextLength();r.revealWidth=Math.min(l.w,width||l.w);if(width>l.w)attr(r.text,{textLength:l.w,lengthAdjust:'spacingAndGlyphs'});}catch(_){r.revealWidth=l.w;}
      }
      if(l.type==='words'){
        const terms=String(l.text).split(/\s+/),em=new Set(String(l.emphasis||'').split(/\s+/));
        terms.forEach((word,i)=>{const hot=em.has(word),s=svg('tspan',{fill:hot?l.accent:l.color,'font-size':hot?l.size*1.17:l.size*.8},r.text);s.textContent=(i?' ':'')+word;r.parts.push(s);});
        try{const measured=r.text.getComputedTextLength();if(measured>l.w)attr(r.text,{textLength:l.w,lengthAdjust:'spacingAndGlyphs'});}catch(_){}
      }
    }
    if(l.type==='arrow'){
      r.path=svg('path',{d:'M -18 '+(-l.h/2)+' V '+(l.h/2-42)+' H -50 L 0 '+(l.h/2)+' L 50 '+(l.h/2-42)+' H 18 V '+(-l.h/2),fill:'none',stroke:l.color,'stroke-width':l.stroke,'stroke-linejoin':'round','stroke-linecap':'round',pathLength:1,'stroke-dasharray':1,'stroke-dashoffset':1},g);
    }
    if(l.type==='cash'||l.type==='dust'){
      for(let i=0;i<Math.min(160,Math.max(0,Math.round(num(l.count,30))));i++){
        const p=svg('g',{},g),sz=num(l.size,90)*mix(.55,1.35,rand(l.seed,i+100));
        if(l.type==='cash'){
          const note=svg('rect',{x:-sz/2,y:-sz*.23,width:sz,height:sz*.46,rx:1,fill:'#c2c0a3',stroke:'#77816a','stroke-width':1},p);
          svg('rect',{x:-sz*.43,y:-sz*.16,width:sz*.86,height:sz*.32,fill:'none',stroke:'#7b8068','stroke-width':1},p);
          svg('ellipse',{cx:0,cy:0,rx:sz*.11,ry:sz*.15,fill:'#79836b'},p);
          if(l.url||l.asset){const im=makeImage(p,l,sz,sz*.55);im.addEventListener('error',()=>im.remove());}
        }else svg('circle',{r:sz,fill:l.color||'#fff'},p);
        r.parts.push(p);
      }
    }
    if(l.type==='flare'){
      const id='ponzi-flare-'+(++nextMask),grad=svg('radialGradient',{id},state.defs);
      svg('stop',{offset:0,'stop-color':'#fff','stop-opacity':1},grad);svg('stop',{offset:.18,'stop-color':'#ffedab','stop-opacity':.85},grad);svg('stop',{offset:.55,'stop-color':l.color,'stop-opacity':.44},grad);svg('stop',{offset:1,'stop-color':l.color,'stop-opacity':0},grad);
      svg('ellipse',{rx:l.w*.5,ry:l.h*.65,fill:'url(#'+id+')'},g);
      svg('ellipse',{rx:l.w*.5,ry:5,fill:'#fff3c8'},g);
      svg('ellipse',{rx:l.w*.46,ry:2,fill:'#fff'},g);
    }
    return r;
  }
  function maskPath(l,p){
    if(p>=1)return 'M-60 -60H1340V780H-60Z';
    if(p<=0)return '';
    if(l.mask==='burn'){
      let path='M-60 800L-60 '+(H+100-p*(H+240));
      for(let x=0;x<=W+70;x+=26){const y=H+100-p*(H+240)+num(l.turbulence,1)*(32*Math.sin(x*.026+p*8)+23*Math.sin(x*.071+p*13));path+='L'+x+' '+y;}
      return path+'L1340 800Z';
    }
    let path='';
    const origins=[[625,70],[360,260],[910,195],[640,470],[155,100],[1150,520]];
    for(let j=0;j<origins.length;j++){
      const a=origins[j],rad=Math.max(0,(p-j*.045))*950;
      if(!rad)continue;
      for(let k=0;k<=32;k++){const th=k/32*Math.PI*2;const rr=rad*(1+num(l.turbulence,1)*(.12*Math.sin(th*7+j)+.08*Math.sin(th*13+j*2)));path+=(k?'L':'M')+(a[0]+Math.cos(th)*rr)+' '+(a[1]+Math.sin(th)*rr);}
      path+='Z';
    }return path;
  }
  function drawOpening(canvas,t,data){
    const saved=data&&data.ponziOpeningV2;
    let state=canvas._opening||resetOpening(canvas);
    if(!state.cfg||state.saved!==saved){state=resetOpening(canvas);state.saved=saved;state.cfg=config(data);state.cfg.layers.slice().sort((a,b)=>a.z-b.z).forEach(l=>state.groups.set(l.id,buildLayer(state,l)));}
    const cfg=state.cfg;
    const cam=cfg.camera.enabled===false?{x:0,y:0,scale:1,rotation:0}:sample(cfg.camera,t);
    for(const r of state.groups.values()){
      const l=r.l,k=sample(l,t),active=l.visible!==false&&t>=l.start&&t<=l.end;
      r.outer.style.display=active?'':'none';if(!active)continue;
      const p=t-l.start;
      const mp=clamp01(p/Math.max(.01,num(l.motionDuration,1))),ma=num(l.motionAmount,1),m=smooth(mp);
      switch(l.motionPreset){
        case 'push':k.scale=num(k.scale,1)*(1+.12*ma*m);break;
        case 'pull':k.scale=num(k.scale,1)*(1-.12*ma*m);break;
        case 'float':k.x=num(k.x,640)+Math.sin(p*2)*18*ma;k.y=num(k.y,360)+Math.cos(p*1.5)*9*ma;break;
        case 'slideleft':k.x=num(k.x,640)+100*ma*(1-m);break;
        case 'slideup':k.y=num(k.y,360)+100*ma*(1-m);break;
        case 'tilt':k.rotation=num(k.rotation,0)+5*ma*Math.sin(mp*Math.PI);break;
        case 'pulse':k.scale=num(k.scale,1)*(1+.05*ma*Math.sin(p*4));break;
      }
      const fadeIn=l.fadeIn? smooth(p/l.fadeIn):1,fadeOut=l.fadeOut?smooth((l.end-t)/l.fadeOut):1;
      const depth=1+num(l.depth,0)*.18,cscale=1+(num(cam.scale,1)-1)*depth;
      attr(r.outer,{opacity:clamp01(num(k.opacity,1)*fadeIn*fadeOut*(l.type==='flare'?num(l.intensity,1):1))});
      attr(r.g,{transform:'translate('+(640+(num(k.x,640)-640)*cscale+num(cam.x,0)*depth)+' '+(360+(num(k.y,360)-360)*cscale+num(cam.y,0)*depth)+') rotate('+(num(k.rotation,0)+num(cam.rotation,0))+') scale('+(num(k.scale,1)*cscale)+')'});
      r.outer.style.mixBlendMode=l.blend||'normal';
      r.g.style.filter='blur('+Math.max(0,num(k.blur,0))+'px) brightness('+num(l.brightness,1)+') contrast('+num(l.contrast,1)+') saturate('+num(l.saturation,1)+')'+(l.type!=='text'&&l.type!=='words'&&num(l.glow,0)>0?' drop-shadow(0 0 '+num(l.glow,0)+'px '+(l.glowColor||'#fff4b8')+')':'');
      if(r.mask)attr(r.mask,{d:maskPath(l,clamp01(p/Math.max(.01,num(l.revealDuration,1))))});
      if(l.type==='text'){const frac=l.reveal==='character'?clamp01(p/Math.max(.01,num(l.revealDuration,1))):1;if(r.revealRect){const width=r.revealWidth||l.w;attr(r.revealRect,{x:-width/2-2,width:(width+4)*frac});}else{r.text.textContent=String(l.text);try{if(r.text.getComputedTextLength()>l.w)attr(r.text,{textLength:l.w,lengthAdjust:'spacingAndGlyphs'});else r.text.removeAttribute('textLength');}catch(_){}}}
      if(l.type==='words')r.parts.forEach((part,i)=>part.setAttribute('opacity',p>=(l.wordTimes||[])[i]||p>=i*.12&&!(l.wordTimes||[]).length?'1':'0'));
      if(l.type==='arrow')attr(r.path,{'stroke-dashoffset':1-clamp01(p/Math.max(.01,num(l.revealDuration,.4)))});
      if(l.type==='cash'||l.type==='dust')r.parts.forEach((part,i)=>{
        const seed=num(l.seed,1),sp=num(l.speed,20),x=(rand(seed,i)*W+Math.sin(p*1.6+i)*75+(l.type==='dust'?p*sp*.25:0)+W*4)%W-W/2;
        const y=(rand(seed,i+400)*(H+200)+p*sp*mix(.55,1.5,rand(seed,i+700)))%(H+200)-H/2-100;
        const a=rand(seed,i+900)*360+p*mix(-85,85,rand(seed,i+200));
        const sx=l.type==='cash'?Math.max(.13,Math.abs(Math.cos(p*2+i))):1;
        attr(part,{transform:'translate('+x+' '+y+') rotate('+a+') scale('+sx+' 1)',opacity:mix(.35,1,rand(seed,i+500))});
      });
    }
  }
  function renderAt(canvas,t,data){
    canvas._ponziTime=t;
    if(t<15&&(!data||data.ponziOpeningEnabled!==false)){drawOpening(canvas,t,data);}
    else{canvas._opening=null;canvas.innerHTML=renderBeat(t);}
  }
  // The existing contextual inspector calls this builder; it stores editable scene
  // data through the same contextual data API used by other Studio templates.
  window.tplBuildPonziMinute7Inspector=function(container,data,tplId,options){
    if(!container)return;
    let cfg=config(data),selected=cfg.layers.some(l=>l.id===window.PonziMinute7SelectedLayer)?window.PonziMinute7SelectedLayer:cfg.layers[0].id,enabled=!data||data.ponziOpeningEnabled!==false;
    const save=()=>{if(typeof window.tplSetContextualData==='function')window.tplSetContextualData(tplId,{ponziOpeningV2:copy(cfg),ponziOpeningEnabled:enabled});else if(data){data.ponziOpeningV2=copy(cfg);data.ponziOpeningEnabled=enabled;}};
    function field(parent,label,value,type,onChange,opts){
      const row=document.createElement('label');row.style.cssText='display:flex;flex-direction:column;gap:4px;font-size:12px;color:#ddd;margin:6px 0';row.textContent=label;
      const input=document.createElement(type==='textarea'?'textarea':'input');
      if(type!=='textarea')input.type=type;
      if(type==='checkbox')input.checked=value!==false;else input.value=value??'';
      if(opts)Object.assign(input,opts);
      input.style.cssText='box-sizing:border-box;width:100%;background:#171722;color:#eee;border:1px solid #383849;border-radius:6px;padding:6px;';
      input.addEventListener('change',()=>{try{onChange(type==='checkbox'?input.checked:type==='number'?Number(input.value):input.value);input.setCustomValidity('');save();}catch(e){input.setCustomValidity(e.message);input.reportValidity();}});
      row.appendChild(input);parent.appendChild(row);return input;
    }
    function build(){
      container.replaceChildren();
      const panel=document.createElement('div');panel.style.cssText='display:flex;flex-direction:column;gap:7px;width:100%;padding:8px 0';
      const h=document.createElement('strong');h.textContent='Ponzi · 07:00–07:15';panel.appendChild(h);
      field(panel,'Use editable opening (off = original)',enabled,'checkbox',v=>{enabled=v;});

      // Jump to Scene Beat cards (Cargo-style)
      const beatsWrap=document.createElement('div');
      beatsWrap.style.cssText='display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin:4px 0 8px;';
      const beats=[
        {label:'0:00 Office',t:0,img:NEW+'office.jpg'},
        {label:'0:01 Balcony',t:1.4,img:NEW+'city.jpg'},
        {label:'0:03 Market',t:3.8,img:NEW+'table.jpg'},
        {label:'0:08 Cash Rain',t:8.6,img:NEW+'cash-man.png'},
        {label:'0:10 Portrait',t:10.8,img:NEW+'portrait.png'},
        {label:'0:13 Bankrupt',t:13.2,img:NEW+'amber.jpg'}
      ];
      for(const b of beats){
        const card=document.createElement('button');card.type='button';
        card.style.cssText='position:relative;height:48px;border-radius:6px;overflow:hidden;border:1px solid #383849;background:#111;cursor:pointer;padding:0;';
        card.innerHTML=`<img src="${b.img}" style="width:100%;height:100%;object-fit:cover;opacity:.8;"/><span style="position:absolute;right:4px;bottom:3px;background:rgba(0,0,0,.75);color:#fff;font:600 10px/1.2 sans-serif;padding:2px 4px;border-radius:3px;">${b.label}</span>`;
        card.onclick=()=>{
          if(window.topCustomizerState){window.topCustomizerState.currentTime=b.t;window.topCustomizerState.isPlaying=false;}
          const st=document.getElementById('tpl-modal-preview-stage');
          if(st&&typeof window.stepPonziMinute7Animation==='function')window.stepPonziMinute7Animation(st,'ponzi-minute7-documentary',b.t,data);
        };
        beatsWrap.appendChild(card);
      }
      panel.appendChild(beatsWrap);

      // Scene Layers grid with Show All toggle
      let showAll=window._ponziShowAllLayers||false;
      const curT=(window.topCustomizerState&&Number.isFinite(window.topCustomizerState.currentTime))?window.topCustomizerState.currentTime:0;
      const activeLayers=cfg.layers.filter(x=>curT>=x.start&&curT<=x.end);
      const visibleList=showAll?cfg.layers:(activeLayers.length?activeLayers:cfg.layers.slice(0,6));
      const hdr=document.createElement('div');hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin:4px 0;';
      const hdrTitle=document.createElement('span');hdrTitle.textContent=`Scene Layers (${activeLayers.length})`;hdrTitle.style.cssText='font:600 12px/1.2 sans-serif;color:#eee;';
      const showBtn=document.createElement('button');showBtn.type='button';showBtn.textContent=showAll?'Active Only':`Show All (${cfg.layers.length})`;
      showBtn.style.cssText='background:#232333;color:#ddd;border:1px solid #383849;border-radius:5px;padding:4px 8px;font-size:11px;cursor:pointer;';
      showBtn.onclick=()=>{window._ponziShowAllLayers=!showAll;build();};
      hdr.append(hdrTitle,showBtn);panel.appendChild(hdr);

      const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(2,1fr);gap:6px;max-height:220px;overflow:auto;margin-bottom:6px;';
      for(const layer of visibleList){
        const lc=document.createElement('button');lc.type='button';
        lc.style.cssText='display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;height:54px;padding:6px;border-radius:6px;cursor:pointer;text-align:left;background:'+(layer.id===selected?'#2c2448':'#171722')+';border:1px solid '+(layer.id===selected?'#8b5cf6':'#383849')+';color:#eee;';
        lc.innerHTML=`<span style="font:600 11px/1.2 sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${layer.name}</span><span style="font:500 10px/1 sans-serif;color:#9ca3af;">${layer.start.toFixed(1)}–${layer.end.toFixed(1)}s · ${layer.type}</span>`;
        lc.onclick=()=>{selected=layer.id;window.PonziMinute7SelectedLayer=selected;build();};
        grid.appendChild(lc);
      }
      panel.appendChild(grid);

      const select=document.createElement('select');select.style.cssText='width:100%;background:#171722;color:#eee;padding:8px;border-radius:6px';
      for(const l of cfg.layers){const opt=document.createElement('option');opt.value=l.id;opt.textContent=l.name+' · '+l.start.toFixed(2)+'–'+l.end.toFixed(2)+'s';select.appendChild(opt);}
      select.value=selected;select.onchange=()=>{selected=select.value;window.PonziMinute7SelectedLayer=selected;build();};panel.appendChild(select);
      const l=cfg.layers.find(x=>x.id===selected);
      window.PonziMinute7SelectedLayer=selected;
      const f=(key,label,type='number',d=0)=>field(panel,label,l[key]??d,type,v=>{
        if(type==='number'&&!Number.isFinite(v))throw Error('Enter a finite number');
        if(key==='start'||key==='end'){if(v<0||v>15||(key==='start'&&v>l.end)||(key==='end'&&v<l.start))throw Error('Use an ordered time within 0–15 seconds');}
        if(['x','y','scale','rotation','blur','opacity'].includes(key)&&Array.isArray(l.keys)){
          const previous=num(l[key],d),delta=v-previous;
          l.keys.forEach(k=>{if(Number.isFinite(k[key]))k[key]=key==='scale'&&previous!==0?k[key]*v/previous:k[key]+delta;});
        }l[key]=v;
      },type==='number'?{step:'any'}:null);
      f('visible','Visible','checkbox',true);f('start','In point (s)');f('end','Out point (s)');f('z','Layer order');f('depth','Parallax depth');f('x','Position X');f('y','Position Y');f('w','Width');f('h','Height');f('scale','Scale','number',1);f('rotation','Rotation (°)');f('opacity','Opacity','number',1);f('blur','Focus blur (px)');f('brightness','Brightness','number',1);f('contrast','Contrast','number',1);f('saturation','Saturation','number',1);f('fadeIn','Fade in (s)');f('fadeOut','Fade out (s)');f('blend','Blend mode','text','normal');
      if(l.type==='image'||l.type==='cash'){f('url','Replace image URL','text','');const upload=document.createElement('input');upload.type='file';upload.accept='image/*';upload.onchange=()=>{const file=upload.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{l.url=String(reader.result);save();build();};reader.readAsDataURL(file);};panel.appendChild(upload);}
      if(l.type==='text'||l.type==='words'){f('text','Text','text','');f('font','Font family','text','');f('size','Font size');f('weight','Font weight');f('color','Color','color','#ffffff');f('glow','Text glow');if(l.type==='words'){f('emphasis','Highlighted words','text','');f('accent','Accent','color','#f5df00');field(panel,'Word timing offsets (JSON)',JSON.stringify(l.wordTimes||[]),'textarea',v=>{const a=JSON.parse(v);if(!Array.isArray(a)||a.some(n=>!Number.isFinite(n)))throw Error('Expected numeric array');l.wordTimes=a;});}else{f('reveal','Reveal: character or none','text','none');f('revealDuration','Reveal duration (s)');}}
      if(l.type==='cash'||l.type==='dust'){f('count','Particle count');f('size','Particle size');f('speed','Fall / drift speed');f('seed','Random seed');}
      if(l.type==='arrow'){f('stroke','Stroke width');f('color','Stroke color','color','#ffffff');f('revealDuration','Draw duration');}
      if(l.mask){f('mask','Mask: ink or burn','text',l.mask);f('revealDuration','Mask duration');f('turbulence','Edge turbulence');f('feather','Edge feather');}
      if(l.type==='flare'){f('intensity','Light intensity','number',1);f('color','Light color','color','#ff8529');}
      if(l.type==='image'){f('glow','Object glow (px)','number',0);f('glowColor','Object glow color','color','#fff4b8');}
      f('motionPreset','Animation preset','text','none');f('motionAmount','Animation amount','number',1);f('motionDuration','Animation duration (s)','number',1);
      if(l.type==='dust'){f('color','Dust color','color','#ffe1aa');}
      const keys=v=>{const a=JSON.parse(v);if(!Array.isArray(a)||a.some(k=>!k||!Number.isFinite(k.t)))throw Error('Expected array of keyframes with numeric t');return a;};
      field(panel,'Layer keyframes (JSON: t, x, y, scale, rotation, blur, opacity)',JSON.stringify(l.keys||[],null,2),'textarea',v=>l.keys=keys(v),{rows:6});
      field(panel,'Camera enabled',cfg.camera.enabled,'checkbox',v=>cfg.camera.enabled=v);
      field(panel,'Camera keyframes (JSON)',JSON.stringify(cfg.camera.keyframes,null,2),'textarea',v=>cfg.camera.keyframes=keys(v),{rows:6});
      const reset=document.createElement('button');reset.type='button';reset.textContent='Reset opening to defaults';reset.onclick=()=>{cfg=copy(defaults);save();build();};panel.appendChild(reset);
      if(options&&options.panes){
        const panes=options.panes;
        const cats={content:'Content',motion:'Animation & camera',look:'Appearance',effects:'Effects & transitions',advanced:'Advanced'};
        const sections={};
        for(const [key,title] of Object.entries(cats)){
          const dest=key==='advanced'?options.advanced:panes[key];if(!dest)continue;
          dest.replaceChildren();
          const sec=document.createElement('section');sec.className='rg-inspector-section';
          const heading=document.createElement('strong');heading.className='rg-section-title';heading.textContent=title;sec.appendChild(heading);
          const caption=document.createElement('div');caption.className='rg-section-subtitle';caption.textContent=l.name;sec.appendChild(caption);
          if(key!=='content'){
            const picker=select.cloneNode(true);picker.value=selected;picker.onchange=()=>{selected=picker.value;window.PonziMinute7SelectedLayer=selected;build();};sec.appendChild(picker);
          }
          dest.appendChild(sec);sections[key]=sec;
        }
        function bucket(node){
          if(node===h||node===select||node===beatsWrap||node===hdr||node===grid||node===reset||node.tagName==='INPUT')return 'content';
          const label=(node.firstChild?.textContent||'').trim();
          if(/keyframes|In point|Out point|Parallax|Position|Width|Height|Scale|Rotation|Fade in|Fade out|timing offsets|Reveal duration|Draw duration|Animation|Fall \/ drift speed|Camera enabled/i.test(label))return 'motion';
          if(/Opacity|Brightness|Contrast|Saturation|Blend mode/i.test(label))return 'look';
          if(/Glow|Blur|Particle|Random seed|Mask|Edge|Stroke|Light intensity|Light color|Dust color/i.test(label))return 'effects';
          return 'content';
        }
        for(const node of Array.from(panel.children)){(sections[bucket(node)]||sections.content).appendChild(node);}
        const jump=(parent,label,tab,fx=false)=>{const btn=document.createElement('button');btn.type='button';btn.className='rg-btn-secondary';btn.textContent=label;
          if(fx)btn.setAttribute('data-ctx-fx-trigger','true');else btn.onclick=()=>document.querySelector('#modal-top-template-customizer .rg-inspector-tab[data-tab="'+tab+'"]')?.click();
          parent.appendChild(btn);};
        jump(sections.content,'Effects & Animations','effects',true);
        jump(sections.content,'Animation','motion');
        const add=document.createElement('select');
        for(const [v,label] of [['','Add effect…'],['glow','Soft glow'],['blur','Depth blur'],['ink','Ink reveal'],['burn','Burn reveal'],['clear-mask','Remove transition']]){const o=document.createElement('option');o.value=v;o.textContent=label;add.appendChild(o);}
        add.onchange=()=>{if(add.value==='glow')l.glow=12;else if(add.value==='blur'){l.blur=6;for(const k of l.keys||[])if('blur' in k)k.blur=6;}else if(add.value==='clear-mask')l.mask=null;else if(add.value){l.mask=add.value;l.revealDuration=.8;l.feather=10;l.turbulence=1;}save();build();};sections.effects.appendChild(add);
        const motion=document.createElement('select');for(const v of ['none','push','pull','float','slideleft','slideup','tilt','pulse']){const o=document.createElement('option');o.value=v;o.textContent=v==='none'?'No additional motion':v;motion.appendChild(o);}motion.value=l.motionPreset||'none';motion.onchange=()=>{l.motionPreset=motion.value;l.motionAmount=l.motionAmount??1;l.motionDuration=l.motionDuration??1;save();build();};sections.motion.appendChild(motion);
      }else container.appendChild(panel);
    }build();
  };
  window.tplBuildPonziMinute7NativePanes=function(panes,advanced){
    const tplId='ponzi-minute7-documentary',data=window.tplGetContextualData?.(tplId)||{};
    window.tplBuildPonziMinute7Inspector(document.createElement('div'),data,tplId,{panes,advanced});
  };
  window.tplSelectPonziMinute7Layer=function(id){
    if(!defaults.layers.some(l=>l.id===id))return;
    window.PonziMinute7SelectedLayer=id;
    window.organizeUniversalTemplateControls?.();
  };
  window.tplRefreshPonziMinute7Stage=function(stageEl,data){
    if(!stageEl)return;
    stageEl._ponziOpeningData=data||{};
    const canvas=stageEl.querySelector('.ponzi-min7-canvas');
    if(canvas)renderAt(canvas,canvas._ponziTime||0,stageEl._ponziOpeningData);
  };
  window.PonziMinute7Opening={defaults:()=>copy(defaults),sample,config,maskPath,renderAt};

  window.tplMountPonziMinute7Stage = function (stageEl, data) {
    if (!stageEl) return;
    if (stageEl._ponziMin7Raf) {
      cancelAnimationFrame(stageEl._ponziMin7Raf);
    }

    stageEl._ponziOpeningData=data || {};
    stageEl.innerHTML = '';
    stageEl.style.position = 'relative';
    stageEl.style.overflow = 'hidden';
    stageEl.style.background = '#000';

    const canvas = document.createElement('div');
    canvas.className = 'ponzi-min7-canvas';
    canvas.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
    stageEl.appendChild(canvas);

    const hud = document.createElement('div');
    hud.style.cssText = 'position:absolute;left:12px;bottom:10px;padding:4px 10px;border-radius:6px;background:rgba(0,0,0,0.65);color:#f5c518;font:600 12px/1.4 monospace;z-index:20;pointer-events:none;';
    stageEl.appendChild(hud);

    const startTime = performance.now();
    function tick(now) {
      const elapsed = ((now - startTime) / 1000) % 60;
      if (!stageEl.isConnected) return;
      renderAt(canvas, elapsed, stageEl._ponziOpeningData || data);
      const sec = Math.floor(elapsed);
      hud.textContent = `07:${String(sec).padStart(2, '0')} / 08:00`;
      stageEl._ponziMin7Raf = requestAnimationFrame(tick);
    }

    stageEl._ponziMin7Raf = requestAnimationFrame(tick);
  };

  window.stepPonziMinute7Animation = function (stageEl, tplId, localSceneT, data) {
    if (!stageEl) return;
    if (stageEl._ponziMin7Raf) {
      cancelAnimationFrame(stageEl._ponziMin7Raf);
      stageEl._ponziMin7Raf = null;
    }
    let canvas = stageEl.querySelector('.ponzi-min7-canvas');
    if (!canvas) {
      stageEl.innerHTML = '';
      stageEl.style.position = 'relative';
      stageEl.style.overflow = 'hidden';
      stageEl.style.background = '#000';
      canvas = document.createElement('div');
      canvas.className = 'ponzi-min7-canvas';
      canvas.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
      stageEl.appendChild(canvas);
    }
    const t = Math.max(0, Number(localSceneT) || 0) % 60;
    stageEl._ponziOpeningData=data || {};
    renderAt(canvas, t, stageEl._ponziOpeningData);
  };
})();
