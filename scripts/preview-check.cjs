// Manual public-page smoke check. Run with PLAYWRIGHT_PATH pointing to playwright.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
(async () => {
  fs.mkdirSync('reference/previews', { recursive: true });
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')console.log('BROWSER: '+m.text().slice(0,1000));});
  const paths=['/','/about','/services','/work','/work/fruitup','/work/chanakya-properties','/work/custom-erp','/work/warehouse-app','/work/samsung-exclusive-store','/work/soorya-solar','/blog','/blog/technology-with-a-business-purpose','/blog/from-information-to-action','/blog/building-commerce-around-customers','/blog/from-business-problem-to-outcome','/client-stories','/contact','/adminportal/login'];
  for(const path of paths){
    const response=await page.goto('http://127.0.0.1:3000'+path,{waitUntil:'networkidle',timeout:90000});
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}window.scrollTo(0,0);});
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
    const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
    console.log(JSON.stringify({path,status:response.status(),broken,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
    if(['/','/work','/about','/contact'].includes(path))await page.screenshot({path:'reference/previews/'+(path==='/'?'home':path.slice(1))+'-desktop.png',fullPage:true});
  }
  await page.goto('http://127.0.0.1:3000/work',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Next project'}).click();
  await page.waitForTimeout(900);
  if(!await page.locator('.reel-controls').textContent().then(t=>t.includes('Chanakya Properties')))throw Error('Reel navigation failed');
  await page.getByRole('button',{name:'Business systems',exact:true}).click();
  if(await page.locator('.work-grid .project-card').count()!==1)throw Error('Gallery filter failed');
  await page.goto('http://127.0.0.1:3000/client-stories',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Play sample video: A conversation about the journey'}).click();
  if(await page.locator('iframe').count()!==1)throw Error('Video embed failed');
  await page.locator('iframe').evaluateAll(frames=>frames.forEach(frame=>frame.remove()));
  await page.setViewportSize({width:390,height:844});
  for(const path of ['/','/about','/services','/work','/work/fruitup','/blog','/client-stories','/contact']){
    await page.goto('http://127.0.0.1:3000'+path,{waitUntil:'networkidle'});
    console.log(JSON.stringify({mobile:path,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}window.scrollTo(0,0);});
    if(['/','/work','/contact'].includes(path))await page.screenshot({path:'reference/previews/'+(path==='/'?'home':path.slice(1))+'-mobile.png',fullPage:true});
  }
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.locator('#mobile-navigation').getByRole('link',{name:'About Us'}).click();
  await page.waitForURL('**/about');
  console.log(JSON.stringify({navigation:'passed',reel:'passed',filters:'passed',video:'passed',errors}));
  await browser.close();
  if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
