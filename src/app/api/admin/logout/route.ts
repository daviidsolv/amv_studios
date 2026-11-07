import { logout } from "@/lib/auth";
import { apiError, assertOrigin, json } from "@/lib/http";
export async function POST(request: Request) {
  try { assertOrigin(request); await logout(); return json({ authenticated: false }); }
  catch (error) { return apiError(error); }
}
