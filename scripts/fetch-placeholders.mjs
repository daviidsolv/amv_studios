import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const photos = {
  "portrait-sun": "photo-1534528741775-53994a69daeb",
  "portrait-soft": "photo-1524504388940-b1c1722653e1",
  "portrait-city": "photo-1539109136881-3be0616acf4b",
  "portrait-mono": "photo-1517841905240-472988babdf9",
  "couple-warm": "photo-1516589178581-6cd7833ae3b2",
  "portrait-shadow": "photo-1524250502761-1ac6f2e30d43",
  "portrait-copper": "photo-1531123897727-8f129e1688ce",
  "portrait-light": "photo-1502685104226-ee32379fefbe",
  "couple-close": "photo-1511988617509-a57c8a288659",
  "portrait-editorial": "photo-1515886657613-9f3515b0c78f",
  "couple-embrace": "photo-1523438885200-e635ba2c371e",
  "couple-moment": "photo-1511285560929-80b456fea0bc",
  "portrait-man": "photo-1506794778202-cad84cf45f1d",
  "couple-portrait": "photo-1519741497674-611481863552",
};

const fonts = {
  "dm-sans-400.woff2": "rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhS2f3ZGMZpg.woff2",
  "dm-sans-600.woff2": "rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAfJthS2f3ZGMZpg.woff2",
  "dm-sans-900.woff2": "rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAC5thS2f3ZGMZpg.woff2",
};

const assets = [
  ...Object.entries(photos).map(([name, id]) => ({
    path: join("public", "images", `${name}.jpg`),
    url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85&fm=jpg`,
  })),
  ...Object.entries(fonts).map(([name, file]) => ({
    path: join("src", "app", "fonts", name),
    url: `https://fonts.gstatic.com/s/dmsans/v15/${file}`,
  })),
];

await Promise.all(assets.map(async ({ path, url }) => {
  try { await access(path); return; } catch { /* Download missing assets only. */ }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 1000) throw new Error(`Incomplete asset: ${path}`);
  await mkdir(join(path, ".."), { recursive: true });
  await writeFile(path, bytes);
  console.log(`${path}: ${bytes.length} bytes`);
}));

await writeFile("public/images/SOURCES.md", `# Imágenes provisionales\n\nFotografías de referencia de Unsplash. No se presentan como trabajos de AMV Studio.\n\n${Object.entries(photos).map(([name, id]) => `- ${name}.jpg: https://images.unsplash.com/${id}`).join("\n")}\n`);
