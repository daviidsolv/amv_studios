export class AdminApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(`/api/admin/${path}`, { cache: "no-store", ...init }); }
  catch { throw new AdminApiError("No se ha podido conectar. Comprueba tu conexión e inténtalo de nuevo.", 0); }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new AdminApiError(body?.error ?? "No se ha podido completar la operación. Inténtalo de nuevo.", response.status);
  return body as T;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo de nuevo.";
}
