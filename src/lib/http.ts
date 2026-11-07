export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) return json({ error: error.message }, error.status);
  console.error("AMV API error", error instanceof Error ? error.name : "Unknown error");
  return json({ error: "No se ha podido completar la operación. Inténtalo de nuevo; si persiste, revisa la configuración de Netlify." }, 500);
}

export function assertOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = [process.env.AMV_SITE_ORIGIN, process.env.DEPLOY_PRIME_URL, process.env.DEPLOY_URL];
  if (process.env.NODE_ENV !== "production") allowed.push(new URL(request.url).origin);
  if (!origin || !allowed.some((value) => value && new URL(value).origin === origin)) throw new ApiError(403, "Origen de la solicitud no permitido.");
}

export async function readBody(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "La solicitud está vacía.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new ApiError(413, "La solicitud supera el tamaño permitido."); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function readJson(request: Request, limit = 500_000) {
  const body = await readBody(request, limit);
  try { return JSON.parse(body.toString("utf8")); }
  catch { throw new ApiError(400, "El contenido no tiene un formato válido."); }
}
