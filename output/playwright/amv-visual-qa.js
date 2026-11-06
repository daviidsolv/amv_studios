async (page) => {
  await page.goto('http://localhost:3000/', {waitUntil:'networkidle'});
  await page.waitForTimeout(2000);
  await page.screenshot({path:'output/playwright/amv-home-desktop.png'});
  const images=await page.evaluate(()=>[...document.images].filter(i=>i.getBoundingClientRect().width).map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})));
  const boxes=[];
  for(const selector of ['.introduction','.studio-banner','.featured-work','.sessions','.mosaic','.process-banner','.last-word','footer']){
    await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1600);
    boxes.push(await page.locator(selector).evaluate(e=>({selector:e.className,rect:e.getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth-innerWidth})));
    await page.screenshot({path:'output/playwright/amv-'+selector.replaceAll('.','').replace('footer','footer')+'-desktop.png'});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://localhost:3000/', {waitUntil:'networkidle'});await page.waitForTimeout(2000);await page.screenshot({path:'output/playwright/amv-home-mobile.png'});
  for(const selector of ['.featured-work','.sessions','.mosaic','footer']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1400);await page.screenshot({path:'output/playwright/amv-'+selector.replace('.','')+'-mobile.png'});}
  await page.evaluate(data=>window.__amvVisualQA=data,{images,boxes});
}
