export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Upgrade system disabled in demo mode",
  });
}
