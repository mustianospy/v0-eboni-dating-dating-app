import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, username, supabaseId } = await req.json();

  if (!email || !username || !supabaseId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { email, username, supabaseId },
  });

  return NextResponse.json({ success: true, user });
}
