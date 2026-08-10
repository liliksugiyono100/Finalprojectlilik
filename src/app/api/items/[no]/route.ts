import { NextResponse } from "next/server";
import { readItems, writeItems } from "@/lib/store";
import type { DefectItem } from "@/lib/types";

type RouteParams = { params: Promise<{ no: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const { no } = await params;
  const items = await readItems();
  const item = items.find((i) => i.no === Number(no));
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

const EDITABLE_FIELDS = [
  "area",
  "disiplin",
  "defect_and_outstanding_works",
  "permasalahan",
  "status",
  "keterangan",
  "feedback_hk",
  "target_penyelesaian",
  "d_o",
  "status_update",
  "pic",
] as const;

export async function PUT(req: Request, { params }: RouteParams) {
  const { no } = await params;
  const noNum = Number(no);
  const body = await req.json();

  const items = await readItems();
  const index = items.findIndex((i) => i.no === noNum);
  if (index === -1) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const updated: DefectItem = { ...items[index] };
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      (updated[field] as string) = body[field];
    }
  }
  updated.last_updated_at = new Date().toISOString();

  items[index] = updated;
  await writeItems(items);

  return NextResponse.json(updated);
}
