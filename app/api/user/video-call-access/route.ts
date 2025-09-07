export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json().catch(() => ({}))
  const { targetUserId } = body

  if (!targetUserId) {
    return NextResponse.json({ error: "Missing target user" }, { status: 400 })
  }

  // Deduct 1 coin for video call access
  const wallet = await prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: 1 } },
  })

  if (wallet.balance < 0) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 402 })
  }

  return NextResponse.json({ success: true, targetUserId })
}
