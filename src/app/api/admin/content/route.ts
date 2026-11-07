import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { siteContentSchema } from "@/content/schema";
import { requireAdmin } from "@/lib/auth";
import { readContent, saveContent } from "@/lib/content-store";
import { apiError, ApiError, assertOrigin, json, readJson } from "@/lib/http";

export async function GET() {
  try { await requireAdmin(); return json(await readContent()); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try {
    assertOrigin(request); await requireAdmin();
    const result = z.object({ content: siteContentSchema, revision: z.number().int().nonnegative() }).safeParse(await readJson(request));
    if (!result.success) {
      const first = result.error.issues[0];
      throw new ApiError(400, `Revisa el contenido: ${first.message}`);
    }
    const saved = await saveContent(result.data.content, result.data.revision);
    revalidateTag("amv-content", { expire: 0 });
    revalidatePath("/", "layout");
    return json(saved);
  } catch (error) { return apiError(error); }
}
