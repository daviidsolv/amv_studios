import { z } from "zod";
import * as initial from "./site";

const text = z.string().trim().min(1, "Este campo es obligatorio.").max(2000);
const heading = text.max(180);
const photo = z.object({
  src: z.string().regex(/^\/(?:images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)|media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp)$/, "Selecciona una imagen de la biblioteca."),
  alt: text.max(300),
  position: z.string().regex(/^(?:100|\d{1,2})% (?:100|\d{1,2})%$/, "Usa dos porcentajes entre 0 y 100.").optional(),
});
export const categories = ["Retrato", "Boudoir", "Parejas"] as const;
export const sectionKeys = ["introduction", "studio", "portfolio", "sessions", "mosaic", "process", "invitation"] as const;
const story = z.object({ title: heading, text, label: heading });

export const siteContentSchema = z.object({
  brand: z.object({
    name: heading, location: heading, description: text.max(500), instagramHandle: heading,
    instagram: z.url().refine((value) => { try { const url = new URL(value); return url.protocol === "https:" && ["instagram.com", "www.instagram.com"].includes(url.hostname) && !url.username && !url.password; } catch { return false; } }, "Introduce un enlace HTTPS de Instagram."),
  }),
  photos: z.object({ soft: photo, sun: photo, copper: photo, light: photo, man: photo, couple: photo, moment: photo, editorial: photo }),
  homeContent: z.object({
    hero: z.array(photo).length(3), eyebrow: heading, title: heading,
    introduction: z.array(text).min(1).max(6),
    studio: z.object({ title: heading, text, photo }),
    portfolioTitle: heading, sessionsTitle: heading, mosaicTitle: heading, processPhoto: photo,
  }),
  projects: z.array(z.object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/), title: heading, category: z.enum(categories),
    format: z.enum(["landscape", "portrait"]), photos: z.array(photo).min(1, "Añade al menos una fotografía.").max(30),
  })).max(100).refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Hay series con identificadores duplicados."),
  services: z.array(z.object({ title: z.enum(categories), description: text, detail: heading, photos: z.array(photo).length(2) })).length(3),
  process: z.array(story).min(1).max(10), faqs: z.array(story).min(1).max(15),
  studioContent: z.object({ title: heading, paragraphs: z.array(text).min(1).max(8), statement: text.max(500), photo }),
  gallery: z.object({ title: heading, description: text.max(500) }),
  contact: z.object({ title: heading, introduction: text, photo }),
  footer: z.object({ invitation: heading, eyebrow: heading, photo }),
  sections: z.object({ introduction: z.boolean(), studio: z.boolean(), portfolio: z.boolean(), sessions: z.boolean(), mosaic: z.boolean(), process: z.boolean(), invitation: z.boolean() }),
  settings: z.object({ imagesArePlaceholders: z.boolean() }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type ContentSnapshot = { content: SiteContent; revision: number; updatedAt: string | null };
export type MediaItem = { id: string; src: string; filename: string; alt: string; width: number; height: number; bytes: number; createdAt: string };

export const defaultContent: SiteContent = siteContentSchema.parse({
  brand: initial.brand, photos: initial.photos, homeContent: initial.homeContent, projects: initial.projects,
  services: initial.services, process: initial.process, faqs: initial.faqs,
  studioContent: { ...initial.studioContent, photo: initial.photos.soft },
  gallery: { title: "Una mirada. Infinitas formas de ser.", description: "Selección de imágenes de referencia.\nCada serie, una forma de mirar." },
  contact: { title: "Todo empieza\ncon un hola.", introduction: "¿Quieres actualizar tu perfil?\n¿Una sesión para ti o para los dos?\nCuéntame lo que tienes en mente.", photo: initial.photos.sun },
  footer: { invitation: "¿Actualizamos\ntu perfil?", eyebrow: "Hagamos una foto que sea muy tú", photo: initial.photos.soft },
  sections: Object.fromEntries(sectionKeys.map((key) => [key, true])), settings: { imagesArePlaceholders: true },
});

export function collectImageSources(value: unknown): Set<string> {
  const sources = new Set<string>();
  const visit = (item: unknown) => {
    if (!item || typeof item !== "object") return;
    if ("src" in item && typeof item.src === "string") sources.add(item.src);
    for (const child of Object.values(item)) visit(child);
  };
  visit(value);
  return sources;
}
