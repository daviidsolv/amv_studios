import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { apiError, ApiError, assertOrigin } from "@/lib/http";
import { archiveMedia } from "@/lib/media-store";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOrigin(request); await requireAdmin();
    const id = z.uuid().safeParse((await params).id);
    if (!id.success) throw new ApiError(400, "Identificador de fotografía no válido.");
    await archiveMedia(id.data);
    return new Response(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}
