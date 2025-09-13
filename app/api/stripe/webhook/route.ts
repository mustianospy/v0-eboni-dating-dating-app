import { NextResponse } from "next/server";

export async function POST() {
  console.log("Webhook called");
  return NextResponse.json({ ok: true });
}
