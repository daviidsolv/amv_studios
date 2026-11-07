import { expect, test, type Page } from "@playwright/test";
import { defaultContent, type SiteContent } from "../src/content/schema";

async function mockAdmin(page: Page, authenticated = true) {
  let content = structuredClone(defaultContent);
  let revision = 1;
  let conflict = false;
  await page.route("**/api/admin/session", (route) => route.fulfill({ json: { authenticated, configured: true, username: "admin-test" } }));
  await page.route("**/api/admin/login", async (route) => {
    const input = route.request().postDataJSON();
    if (input.username !== "admin-test" || input.password !== "test-password") return route.fulfill({ status: 401, json: { error: "Credenciales incorrectas." } });
    authenticated = true;
    return route.fulfill({ json: { authenticated: true } });
  });
  await page.route("**/api/admin/media", (route) => route.fulfill({ json: { items: [] } }));
  await page.route("**/api/admin/content", async (route) => {
    if (route.request().method() === "PUT") {
      if (conflict) return route.fulfill({ status: 409, json: { error: "Hay una versión más reciente." } });
      const input = route.request().postDataJSON() as { content: SiteContent; revision: number };
      if (input.revision !== revision) return route.fulfill({ status: 409, json: { error: "Revisión incorrecta." } });
      content = input.content;
      revision++;
    }
    return route.fulfill({ json: { content, revision, updatedAt: "2026-11-06T12:00:00.000Z" } });
  });
  return { conflict: () => { conflict = true; content.brand.name = "Versión de otra sesión"; revision++; } };
}

test("el acceso permite corregir credenciales y guardar una edición", async ({ page }) => {
  await mockAdmin(page, false);
  await page.goto("/admin");
  await page.getByLabel("Usuario", { exact: true }).fill("admin-test");
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.locator(".admin-root").getByRole("alert")).toContainText("Credenciales incorrectas");
  await page.getByLabel("Contraseña", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Resumen", exact: true })).toBeVisible();
  await test.info().attach("dashboard-desktop", { body: await page.screenshot(), contentType: "image/png" });
  await page.getByRole("button", { name: "Contenido", exact: true }).click();
  await page.getByLabel("Nombre del estudio", { exact: true }).fill("AMV actualizado");
  await expect(page.getByText("Cambios sin guardar", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await expect(page.getByText("Cambios guardados", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Contenido", exact: true }).click();
  await expect(page.getByLabel("Nombre del estudio", { exact: true })).toHaveValue("AMV actualizado");
});

test("un conflicto conserva el borrador hasta recargar con confirmación", async ({ page }) => {
  const state = await mockAdmin(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Contenido", exact: true }).click();
  await page.getByLabel("Nombre del estudio", { exact: true }).fill("Mi borrador");
  state.conflict();
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await expect(page.locator(".admin-root").getByRole("alert")).toContainText("versión más reciente");
  await expect(page.getByLabel("Nombre del estudio", { exact: true })).toHaveValue("Mi borrador");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Cargar versión guardada", exact: true }).click();
  await expect(page.getByLabel("Nombre del estudio", { exact: true })).toHaveValue("Mi borrador");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cargar versión guardada", exact: true }).click();
  await expect(page.getByLabel("Nombre del estudio", { exact: true })).toHaveValue("Versión de otra sesión");
});

test("permite crear una serie y seleccionar sus fotografías en móvil", async ({ page }) => {
  await mockAdmin(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin");
  await page.getByRole("button", { name: "Series", exact: true }).click();
  await page.getByRole("button", { name: "Nueva serie", exact: true }).click();
  const series = page.getByRole("group", { name: "Nueva serie" });
  await series.getByLabel("Título de la serie", { exact: true }).fill("Retratos de prueba");
  await page.getByRole("group", { name: "Retratos de prueba" }).getByRole("button", { name: "Cambiar fotografía", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Seleccionar fotografía" });
  await expect(picker).toBeVisible();
  await test.info().attach("photo-picker-mobile", { body: await page.screenshot(), contentType: "image/png" });
  await picker.getByRole("button", { name: /Usar imagen/ }).last().click();
  await expect(picker).not.toBeVisible();
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await expect(page.getByText("Cambios guardados", { exact: true })).toBeVisible();
  await test.info().attach("series-mobile", { body: await page.screenshot(), contentType: "image/png" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("la biblioteca conserva una fotografía cuando el servidor impide borrarla", async ({ page }) => {
  await mockAdmin(page);
  await page.route("**/api/admin/media", (route) => route.fulfill({ json: { items: [{
    id: "00000000-0000-4000-8000-000000000001", src: "/media/00000000-0000-4000-8000-000000000001.webp",
    filename: "retrato-cliente.jpg", alt: "Retrato con luz natural", width: 1200, height: 1800,
    bytes: 245000, createdAt: "2026-11-06T12:00:00.000Z",
  }] } }));
  await page.route("**/api/admin/media/00000000-0000-4000-8000-000000000001", (route) => route.fulfill({ status: 409, json: { error: "Esta fotografía está en uso." } }));
  await page.goto("/admin");
  await page.getByRole("button", { name: "Biblioteca", exact: true }).click();
  await expect(page.getByText("retrato-cliente.jpg", { exact: true })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar retrato-cliente.jpg", exact: true }).click();
  await expect(page.locator(".admin-root").getByRole("alert")).toContainText("está en uso");
  await expect(page.getByText("retrato-cliente.jpg", { exact: true })).toBeVisible();
});

test("sin configuración explica cómo habilitar el acceso sin mostrar credenciales", async ({ page }) => {
  await page.route("**/api/admin/session", (route) => route.fulfill({ json: { authenticated: false, configured: false } }));
  await page.goto("/admin");
  await expect(page.getByText("Acceso pendiente de configuración", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Contraseña", { exact: true })).toHaveCount(0);
});
