const { chromium } = require(require('node:path').resolve('.readme-browser/node_modules/playwright'));
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
const root = repo === 'CablejatElectric' ? 'dist' : '.';
const folder = 'docs/images';
fs.mkdirSync(folder, { recursive: true });
const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
const report = { repository: repo, sourceCommit: process.env.GITHUB_SHA, url: `https://guirigall.github.io/${repo}/`, screenshots: [] };
(async () => {
 let browser;
 try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:8765/')).ok) break; } catch {} await new Promise(r => setTimeout(r, 250)); }
  browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [name, viewport, mobile] of [['desktop', {width:1440,height:1050}, false], ['mobile', {width:390,height:844}, true]]) {
   const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, locale: 'ca-ES', colorScheme: 'light' });
   const page = await context.newPage(); const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   if(repo==='EmissoraVHF')await page.addInitScript(()=>{
    window.__micRequests=0;
    // v1.2.4+: cada pulsació obre el micròfon una sola vegada i en passa la pista al reconeixedor.
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=async()=>{window.__micRequests++;const ctx=new AudioContext(),dest=ctx.createMediaStreamDestination();return dest.stream};
    window.SpeechRecognition=class {
     start(track){window.__trackPassed=!!track&&track.kind==='audio';setTimeout(()=>{this.onstart?.();this.onaudiostart?.()},50)}
     stop(){setTimeout(()=>{
      if(window.__speechError)this.onerror?.({error:window.__speechError});
      else this.onresult?.({resultIndex:0,results:[[{transcript:'Marina de Mahón, aquí Xaloc, cambio'}]]});
      this.onend?.();
     },100)}
     abort(){this.onend?.()}
    };
   });
   const response = await page.goto('http://127.0.0.1:8765/', {waitUntil:'domcontentloaded',timeout:60000});
   if (!response.ok()) throw Error('App HTTP '+response.status());
   await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r,5000))]));
   await page.waitForTimeout(repo === 'MotorMarino' ? 12000 : 8000);
   await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? Promise.resolve() : new Promise(r => { i.onload=r;i.onerror=r;setTimeout(r,4000); }))));
   if ((await page.locator('body').innerText()).trim().length < 80) throw Error('Empty application');
   if (repo === 'EmissoraVHF') {
    await page.evaluate(async()=>{
     const v=globalThis.__vhf;
     await v.powerToggle();v.setChannel(9);v.sendText('Marina de Mahón, aquí Xaloc, cambio');
     if(!v.state.tx)throw Error('Text TX did not start');
     await v.powerToggle();
     if(v.state.tx||v.state.queue.length)throw Error('Shutdown left active TX or replies');
     document.querySelector('#vol').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
     await new Promise(r=>setTimeout(r,3000));
     if(v.state.tx||v.state.queue.length)throw Error('Late TX after shutdown');
     const log=document.querySelector('#log');log.textContent='';
     await v.powerToggle();v.setChannel(9);v.settings.mode='voice';
     const ptt=document.querySelector('#ptt');
     window.__micRequests=0;window.__trackPassed=false;
     ptt.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',key:' ',bubbles:true}));
     await new Promise(r=>setTimeout(r,150));
     if(!v.state.tx)throw Error('Voice PTT did not start');
     ptt.dispatchEvent(new KeyboardEvent('keyup',{code:'Space',key:' ',bubbles:true}));
     await new Promise(r=>setTimeout(r,250));
     if(!document.querySelector('#log').textContent.includes('Marina de Mahón, aquí Xaloc, cambio'))throw Error('Final transcript lost after release');
     if(window.__micRequests!==1)throw Error('PTT must open the microphone exactly once, got '+window.__micRequests);
     if(!window.__trackPassed)throw Error('Microphone track was not passed to the recogniser');
     window.__speechError='network';
     ptt.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',key:' ',bubbles:true}));
     await new Promise(r=>setTimeout(r,150));
     ptt.dispatchEvent(new KeyboardEvent('keyup',{code:'Space',key:' ',bubbles:true}));
     await new Promise(r=>setTimeout(r,250));
     if(!document.querySelector('#heard').textContent.includes('Internet'))throw Error('Recognition network error not explained');
     await v.powerToggle();await v.powerToggle();v.setChannel(16);document.querySelector('#log').textContent='';

    });
    await page.evaluate(()=>{window.__speechError=null;globalThis.__vhf.setChannel(9)});
    await page.locator('#voiceToggle').click();
    await page.waitForFunction(()=>globalThis.__vhf.state.tx);
    await page.waitForTimeout(150);
    await page.locator('#voiceToggle').click();
    await page.waitForFunction(()=>document.querySelector('#log').textContent.includes('Marina de Mahón, aquí Xaloc, cambio'));
    if(await page.locator('.title .app-icon').getAttribute('src')!=='./icons/icon.svg')throw Error('Old header icon');
    await page.evaluate(async()=>{await globalThis.__vhf.powerToggle();await globalThis.__vhf.powerToggle();globalThis.__vhf.setChannel(16);document.querySelector('#log').textContent=''});
    await page.waitForTimeout(500);
   }
   if (errors.length) throw Error(errors.join('\n'));
   if (repo === 'MotorMarino') await page.locator('canvas').first().waitFor({state:'visible',timeout:30000});
   if (repo === 'CablejatElectric') await page.locator('.workspace').scrollIntoViewIfNeeded();
   if (repo === 'ElectricitatABord') await page.locator('#diagram').scrollIntoViewIfNeeded();
   if (repo === 'ExercicisCartaNautica' && mobile) await page.locator('.chart-panel').scrollIntoViewIfNeeded();
   await page.screenshot({ path: `${folder}/${name}.jpg`, type:'jpeg', quality:88, animations:'disabled', fullPage:false });
   report.screenshots.push({name,viewport,title:await page.title(),pageErrors:errors});
   await context.close();
  }
  try { const r = await fetch(report.url, {signal:AbortSignal.timeout(30000)}); report.publishedStatus=r.status; } catch(e) {report.publishedStatus=null;report.publishedError=e.message;}
  fs.writeFileSync(`${folder}/capture.json`, JSON.stringify(report,null,2)+'\n');
  if (root === 'dist') { fs.mkdirSync('dist/docs/images',{recursive:true}); for(const file of ['desktop.jpg','mobile.jpg','capture.json']) fs.copyFileSync(`${folder}/${file}`,`dist/docs/images/${file}`); }
  console.log(JSON.stringify(report));
 } finally { if (browser) await browser.close();server.kill(); }
})().catch(e => { console.error(e);process.exitCode=1; });
