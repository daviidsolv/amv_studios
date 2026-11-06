async (page) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://localhost:3000/galeria',{waitUntil:'networkidle'});
  await page.waitForTimeout(1600);
  await page.screenshot({path:'output/playwright/amv-final-galeria-1440.png'});
  await page.setViewportSize({width:667,height:375});
  await page.getByRole('button',{name:'Abrir menú'}).click();
  await page.waitForTimeout(1300);
  await page.screenshot({path:'output/playwright/amv-final-menu-short.png'});
  await page.keyboard.press('Escape');
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
  await page.waitForTimeout(1800);
  await page.screenshot({path:'output/playwright/amv-final-home-1440.png'});
}
