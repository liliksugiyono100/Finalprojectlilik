import { NextResponse } from "next/server";
import { readItems, writeItems } from "@/lib/store";
import { STATUS_UPDATE_MAX_LENGTH, type DefectItem, type Status } from "@/lib/types";

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

  if ("status" in body && !["Open", "Close"].includes(body.status)) {
    return NextResponse.json(
      { error: "Status harus 'Open' atau 'Close'" },
      { status: 400 }
    );
  }
  if (
    "status_update" in body &&
    typeof body.status_update === "string" &&
    body.status_update.length > STATUS_UPDATE_MAX_LENGTH
  ) {
    return NextResponse.json(
      {
        error: `Status update maksimal ${STATUS_UPDATE_MAX_LENGTH} karakter`,
      },
      { status: 400 }
    );
  }

  const updated: DefectItem = { ...items[index] };
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      if (field === "status") {
        updated.status = body.status as Status;
      } else {
        (updated[field] as string) = body[field];
      }
    }
  }
  updated.last_updated_at = new Date().toISOString();

  items[index] = updated;
  await writeItems(items);

  return NextResponse.json(updated);
}
