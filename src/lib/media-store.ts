import { getStore } from "@netlify/blobs";
import { collectImageSources, defaultContent, type MediaItem } from "@/content/schema";
import { database } from "./database";
import { ApiError } from "./http";

export function imageStoreName() {
  return process.env.AMV_DEPLOY_CONTEXT === "production" ? "amv-images" : `amv-images-${process.env.AMV_DEPLOY_ID ?? "local"}`;
}
export function imageStore(name = imageStoreName()) {
  return getStore({ name, consistency: "strong", region: "us-east-2" });
}
export type MediaRow = { id: string; filename: string; alt: string; width: number; height: number; bytes: number; created_at: Date; store_name: string };
export function mediaItem(row: MediaRow): MediaItem {
  return { id: row.id, src: `/media/${row.id}.webp`, filename: row.filename, alt: row.alt, width: row.width, height: row.height, bytes: row.bytes, createdAt: new Date(row.created_at).toISOString() };
}
export async function listMedia() {
  const rows = await database().sql<MediaRow>`SELECT * FROM amv_media WHERE archived_at IS NULL ORDER BY created_at DESC`;
  return rows.map(mediaItem);
}
export async function archiveMedia(id: string) {
  const client = await database().pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [row] } = await client.query("SELECT document FROM amv_content WHERE id = 1 FOR UPDATE");
    if (collectImageSources(row?.document ?? defaultContent).has(`/media/${id}.webp`)) throw new ApiError(409, "La fotografía se está usando en la web. Sustitúyela y guarda los cambios antes de retirarla.");
    const result = await client.query("UPDATE amv_media SET archived_at = now() WHERE id = $1 AND archived_at IS NULL RETURNING id", [id]);
    if (!result.rowCount) throw new ApiError(404, "La fotografía ya no está en la biblioteca.");
    await client.query("COMMIT");
    // Preserve the file for recovery; an archive never destroys an original upload.
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}
