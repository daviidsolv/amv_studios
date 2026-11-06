import { expect, test } from "@playwright/test";

test("permite explorar el portfolio y contactar con el Instagram real", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/AMV Studio/);
  await page.getByRole("link", { name: "Explorar el portfolio", exact: true }).click();
  await expect(page).toHaveURL(/\/galeria/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Una mirada");
  await page.getByRole("button", { name: "Parejas", exact: true }).click();
  const cards = page.locator("[data-project-card]");
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toContainText("Parejas");
  const trigger = cards.first().getByRole("button");
  await trigger.click();
  const viewer = page.getByRole("dialog", { name: "Visor de fotografías" });
  await expect(viewer).toBeVisible();
  await expect(viewer.getByText("01 / 02")).toBeVisible();
  await viewer.getByRole("button", { name: "Siguiente fotografía" }).click();
  await expect(viewer.getByText("02 / 02")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.goto("/contacto");
  await expect(page.getByRole("link", { name: "Escríbeme en Instagram", exact: true })).toHaveAttribute(
    "href", "https://www.instagram.com/studio__amv/",
  );
});

test("el menú móvil gestiona el foco y no desborda el viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => scrollTo(0, 700));
  const open = page.getByRole("button", { name: "Abrir menú" });
  await open.click();
  const menu = page.getByRole("dialog", { name: "Menú de navegación" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Portfolio", exact: true }).click();
  await expect(page).toHaveURL(/\/galeria/);
  await expect(menu).not.toBeVisible();
  await open.click();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("el modo reducido conserva contenido visible sin bucles decorativos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tu forma de ser");
  await expect(page.locator(".hero-photo--center img")).toBeVisible();
  await page.locator(".mosaic").scrollIntoViewIfNeeded();
  const animations = await page.evaluate(() => document.getAnimations().filter(
    (animation) => animation.effect?.getTiming().iterations === Infinity && animation.playState === "running",
  ).length);
  expect(animations).toBe(0);
});

test("la vista de lista conserva su foto de previsualización", async ({ page }) => {
  await page.goto("/galeria");
  await page.getByRole("button", { name: "Vista de lista" }).click();
  const first = page.locator("[data-project-card]").first();
  await first.getByRole("button").hover();
  await expect(first.locator(".project-card__image")).toHaveCSS("opacity", "1");
  await expect(first.locator(".project-card__layer--default")).toHaveCSS("opacity", "1");
});

test("el texto sobre el retrato queda centrado en móvil", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const offset = await page.locator(".studio-banner__caption").evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs(box.x + box.width / 2 - document.documentElement.clientWidth / 2);
  });
  expect(offset).toBeLessThan(1);
});

test("las sesiones aparecen en una pantalla horizontal baja", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  const first = page.locator(".session-card").first();
  await first.scrollIntoViewIfNeeded();
  await expect.poll(() => first.evaluate((element) => {
    let current: Element | null = element;
    while (current) {
      if (Number(getComputedStyle(current).opacity) < 0.99) return false;
      current = current.parentElement;
    }
    return true;
  })).toBe(true);
});

test("las dos primeras imágenes del archivo son visibles al cargar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/galeria");
  const rightCard = page.locator(".portfolio-item").nth(1);
  await expect(rightCard).toHaveCSS("opacity", "1");
});

test("el menú cabe sin superponer enlaces y controles en pantallas bajas", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto("/galeria");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const menu = page.getByRole("dialog", { name: "Menú de navegación" });
  const first = menu.getByRole("link", { name: "Inicio", exact: true });
  await expect.poll(async () => (await first.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(80);
});

test("el visor conserva un cursor nativo visible", async ({ page }) => {
  await page.goto("/galeria");
  await page.locator("[data-project-card]").first().getByRole("button").click();
  await expect(page.getByRole("dialog", { name: "Visor de fotografías" })).toBeVisible();
  await page.mouse.move(700, 350);
  await expect(page.locator(".lightbox__image")).toHaveCSS("cursor", "auto");
});
