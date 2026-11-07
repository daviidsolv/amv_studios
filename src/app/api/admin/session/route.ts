import { getAdminState } from "@/lib/auth";
import { apiError, json } from "@/lib/http";
export async function GET() {
  try { return json(await getAdminState()); } catch (error) { return apiError(error); }
}
