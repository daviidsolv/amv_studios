import { getConnectionString, getDatabase, type DatabaseConnection } from "@netlify/database";

let client: DatabaseConnection | undefined;
export function databaseConfigured() {
  try { return Boolean(getConnectionString()); } catch { return false; }
}
export function database() {
  if (!client) {
    client = getDatabase();
    client.pool.on("error", () => console.error("AMV database: idle connection interrupted"));
  }
  return client;
}
