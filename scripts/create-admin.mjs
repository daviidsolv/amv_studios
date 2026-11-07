import { randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const directory = new URL("../output/private/", import.meta.url);
await mkdir(directory, { recursive: true });
const target = new URL("admin-credentials.json", directory);
let credentials;
try { credentials = JSON.parse(await readFile(target, "utf8")); }
catch (error) {
  if (error.code !== "ENOENT") throw error;
  const password = randomBytes(24).toString("base64url");
  const salt = randomBytes(16).toString("hex");
  credentials = {
    username: "admin", password,
    hash: `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
    sessionSecret: randomBytes(48).toString("base64url"),
  };
  await writeFile(target, JSON.stringify(credentials), { mode: 0o600 });
}
const origin = new URL(process.argv[2] || "http://localhost:3000").origin;
await writeFile(new URL("ACCESO_DASHBOARD.md", directory), `# Acceso privado a AMV Studio\n\nPanel: ${origin}/admin\n\nUsuario: ${credentials.username}\n\nContraseña: ${credentials.password}\n\nEste archivo contiene una contraseña. Guárdalo en tu gestor de contraseñas; no lo subas a Git ni lo compartas públicamente.\n`, { mode: 0o600 });
if (process.argv.includes("--json")) {
  process.stdout.write(`AMV_SETUP:${JSON.stringify({ AMV_ADMIN_USERNAME: credentials.username, AMV_ADMIN_PASSWORD_HASH: credentials.hash, AMV_SESSION_SECRET: credentials.sessionSecret, AMV_SITE_ORIGIN: origin })}\n`);
} else {
  process.stdout.write("Credenciales guardadas en output/private/ACCESO_DASHBOARD.md (ignorado por Git).\n");
}
