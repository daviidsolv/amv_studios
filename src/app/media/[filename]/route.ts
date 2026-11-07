import { collectImageSources } from "@/content/schema";
import { getAdminState } from "@/lib/auth";
import { getSiteContent } from "@/lib/content-store";
import { database } from "@/lib/database";
import { apiError } from "@/lib/http";
import { imageStore } from "@/lib/media-store";

export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/.test(filename)) return new Response(null, { status: 404 });
    const published = collectImageSources(await getSiteContent()).has(`/media/${filename}`);
    if (!published && !(await getAdminState()).authenticated) return new Response(null, { status: 404 });
    const [row] = await database().sql<{ store_name: string }>`SELECT store_name FROM amv_media WHERE id = ${filename.slice(0, -5)} AND archived_at IS NULL`;
    if (!row) return new Response(null, { status: 404 });
    const entry = await imageStore(row.store_name).getWithMetadata(filename, { type: "stream" });
    if (!entry) return new Response(null, { status: 404 });
    return new Response(entry.data, { headers: {
      "Content-Type": "image/webp", "X-Content-Type-Options": "nosniff", ...(entry.etag ? { ETag: entry.etag } : {}),
      "Cache-Control": published ? "public, max-age=60, must-revalidate" : "private, no-store",
    } });
  } catch (error) { return apiError(error); }
}
