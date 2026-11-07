import { expect, test } from "@playwright/test";
import { defaultContent, siteContentSchema } from "../src/content/schema";
import { createPasswordHash, verifyPassword } from "../src/lib/password";
import sharp from "sharp";
import { MAX_UPLOAD_BYTES, optimizeImage } from "../src/lib/image-upload";
import { assertOrigin } from "../src/lib/http";
import { imageStoreName } from "../src/lib/media-store";

test("usa los metadatos de build para autorizar previews y aislar sus imágenes", () => {
  const values = { NODE_ENV: "production", AMV_SITE_ORIGIN: "https://amv.netlify.app", AMV_DEPLOY_URL: "https://preview--amv.netlify.app", AMV_DEPLOY_CONTEXT: "deploy-preview", AMV_DEPLOY_ID: "preview-id" };
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  try {
    expect(() => assertOrigin(new Request("https://preview--amv.netlify.app/api/admin/content", { method: "PUT", headers: { Origin: values.AMV_DEPLOY_URL } }))).not.toThrow();
    expect(() => assertOrigin(new Request("https://preview--amv.netlify.app/api/admin/content", { method: "PUT", headers: { Origin: "https://otro.invalid" } }))).toThrow();
    expect(imageStoreName()).toBe("amv-images-preview-id");
    process.env.AMV_DEPLOY_CONTEXT = "production";
    expect(imageStoreName()).toBe("amv-images");
  } finally {
    for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});

test("las contraseñas se verifican con hash y rechazan valores inválidos", async () => {
  const hash = await createPasswordHash("Una-clave-larga-de-prueba-2026");
  expect(hash).not.toContain("Una-clave");
  expect(await verifyPassword("Una-clave-larga-de-prueba-2026", hash)).toBe(true);
  expect(await verifyPassword("otra clave", hash)).toBe(false);
  expect(await verifyPassword("cualquiera", "hash-malformado")).toBe(false);
});

test("comprueba el formato real, retira metadatos y limita las fotografías", async () => {
  await expect(optimizeImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'))).rejects.toMatchObject({ status: 400 });
  await expect(optimizeImage(Buffer.alloc(MAX_UPLOAD_BYTES + 1))).rejects.toMatchObject({ status: 413 });
  const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: "#112233" } }).png().withMetadata().toBuffer();
  const result = await optimizeImage(png);
  const metadata = await sharp(result.data).metadata();
  expect(metadata.format).toBe("webp");
  expect(metadata.width).toBe(2560);
  expect(metadata.exif).toBeUndefined();
});

test("la API administrativa rechaza accesos anónimos y escrituras desde otro origen", async ({ request }) => {
  for (const path of ["content", "media"]) {
    expect((await request.get(`/api/admin/${path}`)).status()).toBe(401);
  }
  const response = await request.put("/api/admin/content", { headers: { Origin: "https://otro-sitio.invalid" }, data: {} });
  expect(response.status()).toBe(403);
});

test("valida el contenido inicial y rechaza recursos y enlaces inseguros", () => {
  expect(siteContentSchema.safeParse(defaultContent).success).toBe(true);
  const invalid = structuredClone(defaultContent);
  invalid.homeContent.hero[0].src = "https://tracking.invalid/image.svg";
  expect(siteContentSchema.safeParse(invalid).success).toBe(false);
  invalid.homeContent.hero[0].src = "/media/../../secret";
  expect(siteContentSchema.safeParse(invalid).success).toBe(false);
  invalid.homeContent.hero[0].src = "/media/------------------------------------.webp";
  expect(siteContentSchema.safeParse(invalid).success).toBe(false);
  const link = structuredClone(defaultContent);
  link.brand.instagram = "javascript:alert(1)";
  expect(siteContentSchema.safeParse(link).success).toBe(false);
  link.brand.instagram = "esto no es una URL";
  expect(siteContentSchema.safeParse(link).success).toBe(false);
});

test("permite un archivo vacío y series de una imagen, pero no series sin fotos ni IDs duplicados", () => {
  const content = structuredClone(defaultContent);
  content.projects = [];
  expect(siteContentSchema.safeParse(content).success).toBe(true);
  content.projects = [structuredClone(defaultContent.projects[0])];
  content.projects[0].photos = content.projects[0].photos.slice(0, 1);
  expect(siteContentSchema.safeParse(content).success).toBe(true);
  content.projects.push(structuredClone(content.projects[0]));
  expect(siteContentSchema.safeParse(content).success).toBe(false);
  content.projects = [{ ...defaultContent.projects[0], photos: [] }];
  expect(siteContentSchema.safeParse(content).success).toBe(false);
});
