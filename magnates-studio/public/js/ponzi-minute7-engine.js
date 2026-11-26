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
          <img src="${ASSET_BASE}/${showBalcony ? 'bg_city_balcony.svg' : 'bg_office_handshake.svg'}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
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
          <img src="${ASSET_BASE}/bg_watermelon_table.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
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
          ${showCloseup ? `<img src="${ASSET_BASE}/fg_ponzi_closeup.svg" style="position:absolute;left:50%;top:0;transform:translateX(-50%);height:100%;opacity:0.85;"/>` : `<img src="${ASSET_BASE}/fg_ponzi_cash_fan.svg" style="position:absolute;left:4%;bottom:0;height:88%;"/>`}
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

  window.tplMountPonziMinute7Stage = function (stageEl, data) {
    if (!stageEl) return;
    if (stageEl._ponziMin7Raf) {
      cancelAnimationFrame(stageEl._ponziMin7Raf);
    }

    stageEl.innerHTML = '';
    stageEl.style.position = 'relative';
    stageEl.style.overflow = 'hidden';
    stageEl.style.background = '#000';

    const canvas = document.createElement('div');
    canvas.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
    stageEl.appendChild(canvas);

    const hud = document.createElement('div');
    hud.style.cssText = 'position:absolute;left:12px;bottom:10px;padding:4px 10px;border-radius:6px;background:rgba(0,0,0,0.65);color:#f5c518;font:600 12px/1.4 monospace;z-index:20;pointer-events:none;';
    stageEl.appendChild(hud);

    const startTime = performance.now();
    function tick(now) {
      const elapsed = ((now - startTime) / 1000) % 60;
      canvas.innerHTML = renderBeat(elapsed);
      const sec = Math.floor(elapsed);
      hud.textContent = `07:${String(sec).padStart(2, '0')} / 08:00`;
      stageEl._ponziMin7Raf = requestAnimationFrame(tick);
    }

    stageEl._ponziMin7Raf = requestAnimationFrame(tick);
  };
})();
