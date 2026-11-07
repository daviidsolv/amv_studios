import { z } from "zod";
import { login } from "@/lib/auth";
import { apiError, ApiError, assertOrigin, json, readJson } from "@/lib/http";
const credentials = z.object({ username: z.string().min(1).max(120), password: z.string().min(1).max(256) });
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const result = credentials.safeParse(await readJson(request, 4096));
    if (!result.success) throw new ApiError(400, "Introduce tu usuario y contraseña.");
    await login(result.data.username, result.data.password);
    return json({ authenticated: true });
  } catch (error) { return apiError(error); }
}
