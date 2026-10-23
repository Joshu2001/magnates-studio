#!/usr/bin/env node
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const folder = 'visual-evidence';
  fs.mkdirSync(folder, {recursive: true});
  const browser = await chromium.launch({headless:true, args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--disable-dev-shm-usage']});
  const page = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror', e => errors.push('PAGE ERROR: '+e.message));
  page.on('console', m => { if(m.type()==='error') errors.push('CONSOLE ERROR: '+m.text()); });
  const response=await page.goto('http://127.0.0.1:3000/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(5000);
  await page.screenshot({path:folder+'/01-initial-editor.png',fullPage:false});
  const state=await page.evaluate(() => ({
    title:document.title,
    headings:Array.from(document.querySelectorAll('h1,h2,h3')).slice(0,20).map(x=>x.innerText),
    spatialGlobals:{
      state:typeof window.spatial3DState,
      preset:typeof window.applySpatialStylePreset,
      loader:typeof window.loadSpatialPreset
    },
    candidateButtons:Array.from(document.querySelectorAll('button,[role="button"]')).filter(x=>/template|spatial|3d/i.test(x.innerText+' '+x.title)).slice(0,30).map(x=>({text:x.innerText.slice(0,100),title:x.title}))
  }));
  fs.writeFileSync(folder+'/page-diagnostics.json',JSON.stringify({httpStatus:response?.status(),state,errors},null,2));
  // Presets are deliberately applied only when a real scene is initialized.
  // Avoid generating deceptively blank screenshots masquerading as comparisons.
  if(state.spatialGlobals.state==='object' && state.spatialGlobals.preset==='function'){
    for(const preset of ['documentary','tech-investigative','cyberpunk']){
      const result=await page.evaluate(id=>{
        try {
          const s=window.spatial3DState;
          if(!s || !s.scene || !s.renderer) return 'SCENE_NOT_INITIALIZED';
          window.applySpatialStylePreset(id);
          return 'APPLIED';
        } catch(e){return 'ERROR: '+e.message;}
      },preset);
      if(result==='APPLIED'){
        await page.waitForTimeout(1000);
        await page.screenshot({path:folder+'/preset-'+preset+'.png'});
      }
      fs.writeFileSync(folder+'/preset-'+preset+'.txt',result);
    }
  }
  await browser.close();
  console.log(JSON.stringify({state,errors},null,2));
  if(response?.status()>=400 || errors.some(x=>x.startsWith('PAGE ERROR:'))) process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
