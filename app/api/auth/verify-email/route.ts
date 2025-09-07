export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const verification = await prisma.emailVerificationToken.findUnique({
    where: { token },
  })

  if (!verification) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: verification.userId },
    data: { emailVerified: new Date() },
  })

  await prisma.emailVerificationToken.delete({ where: { token } })

  return NextResponse.redirect("/")
}
