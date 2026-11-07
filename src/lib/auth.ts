import { createHash, timingSafeEqual } from "node:crypto";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { database, databaseConfigured } from "./database";
import { ApiError } from "./http";
import { verifyPassword } from "./password";

type AdminSession = { username?: string; fingerprint?: string };
const fingerprint = () => createHash("sha256").update(`${process.env.AMV_ADMIN_USERNAME}:${process.env.AMV_ADMIN_PASSWORD_HASH}`).digest("hex");
export function authConfigured() {
  return Boolean(process.env.AMV_ADMIN_USERNAME && /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.AMV_ADMIN_PASSWORD_HASH ?? "") && (process.env.AMV_SESSION_SECRET?.length ?? 0) >= 32 && databaseConfigured());
}
async function session() {
  if (!authConfigured()) throw new ApiError(503, "El acceso está pendiente de configurar en Netlify.");
  return getIronSession<AdminSession>(await cookies(), {
    cookieName: "amv-admin", password: process.env.AMV_SESSION_SECRET!, ttl: 8 * 60 * 60,
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" },
  });
}
export async function getAdminState() {
  if (!authConfigured()) return { authenticated: false, configured: false };
  const value = await session();
  const authenticated = value.username === process.env.AMV_ADMIN_USERNAME && value.fingerprint === fingerprint();
  return { authenticated, configured: true, ...(authenticated ? { username: value.username } : {}) };
}
export async function requireAdmin() {
  if (!(await getAdminState()).authenticated) throw new ApiError(401, "Inicia sesión para continuar.");
}
export async function login(username: string, password: string) {
  if (!authConfigured()) throw new ApiError(503, "El acceso está pendiente de configurar en Netlify.");
  const [limit] = await database().sql<{ attempts: number }>`
    INSERT INTO amv_login_limits (id, started_at, attempts) VALUES ('admin', now(), 1)
    ON CONFLICT (id) DO UPDATE SET
      attempts = CASE WHEN amv_login_limits.started_at < now() - interval '15 minutes' THEN 1 ELSE amv_login_limits.attempts + 1 END,
      started_at = CASE WHEN amv_login_limits.started_at < now() - interval '15 minutes' THEN now() ELSE amv_login_limits.started_at END
    RETURNING attempts`;
  if (limit.attempts > 10) throw new ApiError(429, "Demasiados intentos. Espera 15 minutos antes de volver a entrar.");
  const correctPassword = await verifyPassword(password, process.env.AMV_ADMIN_PASSWORD_HASH!);
  const a = createHash("sha256").update(username).digest();
  const b = createHash("sha256").update(process.env.AMV_ADMIN_USERNAME!).digest();
  if (!correctPassword || !timingSafeEqual(a, b)) throw new ApiError(401, "Usuario o contraseña incorrectos.");
  const value = await session();
  value.username = process.env.AMV_ADMIN_USERNAME;
  value.fingerprint = fingerprint();
  await value.save();
  await database().sql`DELETE FROM amv_login_limits WHERE id = 'admin'`;
}
export async function logout() {
  if (authConfigured()) (await session()).destroy();
}
