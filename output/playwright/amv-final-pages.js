async (page) => {
  const diagnostics=[];
  for(const width of [1440,1024,810,809,390]){
    await page.setViewportSize({width,height:width===390?844:1000});
    for(const route of ['/', '/galeria', '/estudio', '/contacto']){
      await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});await page.waitForTimeout(1800);
      diagnostics.push(await page.evaluate(()=>({url:location.pathname,viewport:innerWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,title:document.title,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight}))})));
      if(width===1440||width===390) await page.screenshot({path:`output/playwright/amv-final-${route==='/'?'home':route.slice(1)}-${width}.png`});
    }
  }
  await page.goto('http://localhost:3000/');
  await page.setViewportSize({width:1440,height:1000});
  const caption=page.locator('.studio-banner__caption');await caption.scrollIntoViewIfNeeded();await page.waitForTimeout(1600);await page.screenshot({path:'output/playwright/amv-final-studio-caption.png'});
  await page.locator('.featured-work .section-heading').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);await page.screenshot({path:'output/playwright/amv-final-featured-start.png'});
  await page.evaluate(data=>window.__amvFinalDiagnostics=data,diagnostics);
}
