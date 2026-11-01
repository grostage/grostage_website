const {chromium}=require(process.env.PLAYWRIGHT_PATH);
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.setDefaultNavigationTimeout(60000);
 await page.route('**/*',route=>{const url=route.request().url();return url.startsWith('http://127.0.0.1:3000') || url.startsWith('data:') ? route.continue() : route.abort();});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error' && m.text().includes('hydr')) errors.push(m.text());});
 for(const route of ['/','/about','/services','/work','/work/fruitup','/blog','/client-stories','/contact','/adminportal/login']){
  const response=await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});
  await page.waitForTimeout(1200);
  console.log(JSON.stringify({route,status:response.status(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
 }
 await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
 await page.locator('.service-card').first().scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
 await page.locator('.service-card').first().hover({position:{x:30,y:40}});
 console.log('card',await page.locator('.service-card').first().evaluate(el=>({tilt:el.style.transform,edge:getComputedStyle(el,'::after').animationName})));
 await page.screenshot({path:'reference/previews/services-motion.png'});
 await page.locator('.work-marquee').scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForTimeout(600);
 const read=()=>page.locator('.marquee-row').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).transform));
 const before=await read();await page.waitForTimeout(1000);const after=await read();
 if(before.some((t,i)=>t===after[i]))throw Error('Marquee is not moving');console.log('Both marquee rows move',before,after);
 await page.screenshot({path:'reference/previews/marquee-motion.png'});
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/services','/work','/contact']){await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});console.log('mobile',route,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});await page.waitForTimeout(900);
 console.log('reduced motion',await page.locator('h1').evaluate(el=>({opacity:getComputedStyle(el).opacity,animations:el.getAnimations().length})));
 console.log('errors',errors);await browser.close();if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
