import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { database } from "@/lib/database";
import { apiError, ApiError, assertOrigin, json, readBody } from "@/lib/http";
import { MAX_UPLOAD_BYTES, optimizeImage } from "@/lib/image-upload";
import { imageStore, imageStoreName, listMedia, mediaItem, type MediaRow } from "@/lib/media-store";

export const runtime = "nodejs";
export async function GET() {
  try { await requireAdmin(); return json({ items: await listMedia() }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    assertOrigin(request); await requireAdmin();
    const type = request.headers.get("content-type") ?? "";
    if (!type.startsWith("multipart/form-data;")) throw new ApiError(400, "Selecciona una fotografía para subir.");
    const body = await readBody(request, MAX_UPLOAD_BYTES + 65_536);
    const form = await new Request(request.url, { method: "POST", headers: { "Content-Type": type }, body: new Uint8Array(body) }).formData();
    const file = form.get("file");
    const alt = z.string().trim().min(1).max(300).safeParse(form.get("alt"));
    if (!(file instanceof File) || !alt.success) throw new ApiError(400, "Añade una fotografía y una descripción de hasta 300 caracteres.");
    const { data, info } = await optimizeImage(Buffer.from(await file.arrayBuffer()));
    const id = randomUUID();
    const storeName = imageStoreName();
    const filename = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "").slice(-240) || "fotografia.webp";
    await imageStore(storeName).set(`${id}.webp`, new Blob([new Uint8Array(data)], { type: "image/webp" }));
    const [row] = await database().sql<MediaRow>`INSERT INTO amv_media (id, filename, alt, width, height, bytes, store_name) VALUES (${id}, ${filename}, ${alt.data}, ${info.width}, ${info.height}, ${info.size}, ${storeName}) RETURNING *`;
    return json({ item: mediaItem(row) }, 201);
  } catch (error) { return apiError(error); }
}
