const { chromium }=require('playwright');
const { spawn,execFileSync }=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve('qa-ponzi-output');fs.mkdirSync(out,{recursive:true});
const report={tests:[],pageErrors:[],assetFailures:[],scope:'actual Studio browser, opening 0–15s; legacy handoff checked separately'};
const record=(name,ok,details)=>{report.tests.push({name,ok,details});console.log(name,ok?'PASS':'FAIL',JSON.stringify(details));};
const server=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3137'},stdio:['ignore','pipe','pipe']});
const log=fs.createWriteStream(path.join(out,'server.log'));server.stdout.pipe(log);server.stderr.pipe(log);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  let browser;
  try{
    for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:3137/')).ok)break;}catch{}await sleep(200);}
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
    const page=await browser.newPage({viewport:{width:1600,height:1000},acceptDownloads:true});
    page.on('pageerror',e=>report.pageErrors.push(e.message));
    page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/ponzi-min7/'))report.assetFailures.push({url:r.url(),status:r.status()});});
    page.on('requestfailed',r=>{if(r.url().includes('/assets/ponzi-min7/'))report.assetFailures.push({url:r.url(),error:r.failure()?.errorText});});
    await page.goto('http://127.0.0.1:3137/',{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForFunction(()=>typeof applySelectedHomepageTemplate==='function'&&typeof window.PonziMinute7Opening?.renderAt==='function',{},{timeout:120000});
    await page.evaluate(()=>applySelectedHomepageTemplate('ponzi-minute7-documentary'));
    await page.waitForSelector('#tpl-modal-preview-stage .ponzi-min7-canvas svg',{timeout:30000});
    const stage=page.locator('#tpl-modal-preview-stage');
    await page.screenshot({path:path.join(out,'studio-open.png')});
    const duration=await page.evaluate(()=>topCustomizerState.duration);
    record('customizer duration 60s',Number(duration)===60,{duration});
    const playback=await page.evaluate(async()=>{topCustomizerState.isPlaying=true;topCustomizerState.startTime=performance.now();await new Promise(r=>setTimeout(r,1250));const elapsed=topCustomizerState.currentTime;topCustomizerState.isPlaying=false;return elapsed;});
    record('live playback advances',playback>.5,{elapsed:playback});
    const seek=await page.evaluate(()=>{topCustomizerState.isPlaying=false;renderCustomizerFrameAtTime(11.6);const st=document.querySelector('#tpl-modal-preview-stage .ponzi-min7-canvas');return {requested:11.6,actual:st?._ponziTime,state:topCustomizerState.currentTime};});
    record('native seek reaches 11.6s',Math.abs(seek.actual-11.6)<.02,seek);
    await page.evaluate(async()=>{const data=window.tplGetContextualData('ponzi-minute7-documentary');const cfg=window.PonziMinute7Opening.config(data);await Promise.all(cfg.layers.filter(l=>l.asset).map(l=>new Promise((resolve,reject)=>{const im=new Image();im.onload=resolve;im.onerror=()=>reject(Error('Missing '+l.asset));im.src=l.url||'/assets/ponzi-min7/opening/'+l.asset;})));await document.fonts.ready;});
    record('all opening asset requests',report.assetFailures.length===0,{failures:report.assetFailures});
    const edit=await page.evaluate(()=>{const tpl='ponzi-minute7-documentary',before=window.tplGetContextualData(tpl),cfg=window.PonziMinute7Opening.config(before);const merchant=cfg.layers.find(l=>l.id==='merchant');merchant.visible=false;window.tplSetContextualData(tpl,{ponziOpeningV2:cfg});const st=document.getElementById('tpl-modal-preview-stage');window.stepPonziMinute7Animation(st,tpl,5,window.tplGetContextualData(tpl));const hidden=st.querySelector('[data-layer-id="merchant"]').style.display==='none';merchant.visible=true;window.tplSetContextualData(tpl,{ponziOpeningV2:cfg});window.stepPonziMinute7Animation(st,tpl,5,window.tplGetContextualData(tpl));return {hidden,restored:st.querySelector('[data-layer-id="merchant"]').style.display!=='none'};});
    record('native layer edit refresh',edit.hidden&&edit.restored,edit);
    // Export the actual browser-rendered opening (independent verification path,
    // not the application's native download button). 375 screenshots, 25 fps.
    await page.evaluate(()=>{const st=document.getElementById('tpl-modal-preview-stage');const c=st.querySelector('.ponzi-min7-canvas');Object.assign(st.style,{width:'640px',height:'360px',minWidth:'640px',maxWidth:'640px',minHeight:'360px',maxHeight:'360px',aspectRatio:'16 / 9',flex:'none'});Object.assign(c.style,{width:'640px',height:'360px'});});
    const frames=path.join(out,'frames');fs.mkdirSync(frames,{recursive:true});
    let invalid=0;
    for(let i=0;i<375;i++){
      const t=i/25;
      const info=await page.evaluate(t=>{const st=document.getElementById('tpl-modal-preview-stage');window.stepPonziMinute7Animation(st,'ponzi-minute7-documentary',t,window.tplGetContextualData('ponzi-minute7-documentary'));const c=st.querySelector('.ponzi-min7-canvas');return {time:c._ponziTime,visible:[...c._opening.groups.values()].filter(r=>r.outer.style.display!=='none').length};},t);
      if(Math.abs(info.time-t)>.001||info.visible===0)invalid++;
      await page.locator('#tpl-modal-preview-stage .ponzi-min7-canvas').screenshot({path:path.join(frames,String(i).padStart(4,'0')+'.png'),animations:'disabled',timeout:10000});
    }
    record('375 actual browser frames',invalid===0,{frames:375,invalid});
    const video=path.join(out,'ponzi-opening-browser.mp4');
    execFileSync('ffmpeg',['-y','-framerate','25','-i',path.join(frames,'%04d.png'),'-vf','scale=1280:720:flags=lanczos','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',video],{stdio:'ignore'});
    const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',video]).toString());
    const v=probe.streams.find(s=>s.codec_type==='video');
    record('independent MP4 encoding',v.width===1280&&v.height===720&&Number(v.nb_read_frames)===375&&Math.abs(Number(probe.format.duration)-15)<.05,{width:v.width,height:v.height,frames:v.nb_read_frames,duration:probe.format.duration,codec:v.codec_name});
    execFileSync('ffmpeg',['-v','error','-i',video,'-f','null','-'],{stdio:'pipe'});
    record('MP4 full decode',true,{});
    const legacy=await page.evaluate(()=>{const st=document.getElementById('tpl-modal-preview-stage');window.stepPonziMinute7Animation(st,'ponzi-minute7-documentary',16,{});return st.querySelector('.ponzi-min7-canvas').textContent;});
    record('legacy handoff at 16s',legacy.includes('BANKRUPT'),{text:legacy.slice(0,180)});
    // Inspect native export routing; this is NOT a native export pass unless
    // actual Ponzi scene rendering reaches the canvas captured by the exporter.
    const route=await page.evaluate(()=>({exportUsesMainCanvas:String(startStudioExport).includes('canvas.captureStream'),ponziUsesSVG:!!window.PonziMinute7Opening,mainCanvasId:document.getElementById('previewCanvas')?.id||null,customizerSeparate:!!document.getElementById('tpl-modal-preview-stage')}));
    record('native exporter route includes Ponzi compositor',!route.exportUsesMainCanvas||!route.customizerSeparate,route);
    fs.rmSync(frames,{recursive:true,force:true});
  }catch(e){record('browser run',false,{error:e.stack});}
  finally{await browser?.close();server.kill();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));if(report.tests.some(t=>!t.ok))process.exitCode=1;}
})();
