import { list, put } from "@vercel/blob";
import type { DefectItem } from "./types";
import seedData from "../../data/seed-data.json";

const BLOB_PATHNAME = "defect-tracking/items.json";

export async function readItems(): Promise<DefectItem[]> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const existing = blobs.find((b) => b.pathname === BLOB_PATHNAME);

  if (!existing) {
    const seeded = seedData as DefectItem[];
    await writeItems(seeded);
    return seeded;
  }

  const res = await fetch(existing.url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch defect data blob: ${res.status}`);
  }
  return (await res.json()) as DefectItem[];
}

export async function writeItems(items: DefectItem[]): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
