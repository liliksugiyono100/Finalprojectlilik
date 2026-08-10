import { NextResponse } from "next/server";
import { readItems } from "@/lib/store";

export async function GET() {
  const items = await readItems();
  return NextResponse.json(items);
}
