import { cache } from "react";
import { unstable_cache } from "next/cache";
import { collectImageSources, defaultContent, siteContentSchema, type ContentSnapshot, type SiteContent } from "@/content/schema";
import { database, databaseConfigured } from "./database";
import { ApiError } from "./http";

export async function readContent(): Promise<ContentSnapshot> {
  if (!databaseConfigured()) return { content: defaultContent, revision: 0, updatedAt: null };
  const [row] = await database().sql<{ document: unknown; revision: number; updated_at: Date }>`SELECT document, revision, updated_at FROM amv_content WHERE id = 1`;
  if (!row) throw new Error("Content migration not applied");
  return { content: row.document ? siteContentSchema.parse(row.document) : defaultContent, revision: row.revision, updatedAt: new Date(row.updated_at).toISOString() };
}

const cachedContent = unstable_cache(async () => (await readContent()).content, ["amv-site-content-v1"], { tags: ["amv-content"], revalidate: 60 });
export const getSiteContent = cache(cachedContent);

export async function saveContent(content: SiteContent, revision: number): Promise<ContentSnapshot> {
  if (!databaseConfigured()) throw new ApiError(503, "La base de datos de Netlify no está configurada.");
  const client = await database().pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [current] } = await client.query("SELECT revision FROM amv_content WHERE id = 1 FOR UPDATE");
    if (!current || current.revision !== revision) throw new ApiError(409, "Hay cambios más recientes. Recarga el contenido antes de guardar para no sobrescribirlos.");
    const ids = [...collectImageSources(content)].filter((src) => src.startsWith("/media/")).map((src) => src.slice(7, -5));
    if (ids.length) {
      const result = await client.query("SELECT id FROM amv_media WHERE id = ANY($1::uuid[]) AND archived_at IS NULL FOR SHARE", [ids]);
      if (result.rows.length !== new Set(ids).size) throw new ApiError(400, "Alguna fotografía ya no está disponible. Vuelve a seleccionarla en la biblioteca.");
    }
    const { rows: [saved] } = await client.query("UPDATE amv_content SET document = $1::jsonb, revision = revision + 1, updated_at = now() WHERE id = 1 RETURNING revision, updated_at", [JSON.stringify(content)]);
    await client.query("COMMIT");
    return { content, revision: saved.revision, updatedAt: saved.updated_at.toISOString() };
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}
