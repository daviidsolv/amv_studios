import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { defaultContent } from "../src/content/schema";
import { readContent, saveContent } from "../src/lib/content-store";
import { archiveMedia } from "../src/lib/media-store";
import { database } from "../src/lib/database";

test("persiste cambios, detecta conflictos y protege fotografías utilizadas", async () => {
  const { NetlifyDB } = await import("@netlify/database-dev");
  const local = new NetlifyDB({ logger: () => {} });
  const previous = process.env.NETLIFY_DB_URL;
  process.env.NETLIFY_DB_URL = await local.start();
  try {
    await local.applyMigrations("netlify/database/migrations");
    expect((await readContent()).revision).toBe(0);
    const draft = structuredClone(defaultContent);
    draft.homeContent.title = "Prueba de persistencia local";
    const first = await saveContent(draft, 0);
    expect(first.revision).toBe(1);
    expect((await readContent()).content.homeContent.title).toBe(draft.homeContent.title);
    await expect(saveContent(defaultContent, 0)).rejects.toMatchObject({ status: 409 });

    const id = randomUUID();
    draft.homeContent.hero[0] = { src: `/media/${id}.webp`, alt: "Prueba local" };
    await expect(saveContent(draft, 1)).rejects.toMatchObject({ status: 400 });
    await database().sql`INSERT INTO amv_media (id, filename, alt, width, height, bytes, store_name) VALUES (${id}, 'test.webp', 'Prueba local', 10, 10, 100, 'local-test')`;
    await saveContent(draft, 1);
    await expect(archiveMedia(id)).rejects.toMatchObject({ status: 409 });
    await saveContent(defaultContent, 2);
    await archiveMedia(id);
    const [row] = await database().sql<{ archived_at: unknown }>`SELECT archived_at FROM amv_media WHERE id = ${id}`;
    expect(row.archived_at).not.toBeNull();
    await expect(saveContent(draft, 3)).rejects.toMatchObject({ status: 400 });
    expect(() => database().pool.emit("error", new Error("Simulated idle connection error"))).not.toThrow();
  } finally {
    await database().pool.end();
    await local.stop();
    if (previous === undefined) delete process.env.NETLIFY_DB_URL; else process.env.NETLIFY_DB_URL = previous;
  }
});
