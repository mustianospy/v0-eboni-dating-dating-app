export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY

export async function GET() {
  if (!STRIPE_KEY) {
    return NextResponse.json(
      { error: "Card payments are not enabled. Please use wallet/coins." },
      { status: 200 }
    )
  }

  return NextResponse.json({ message: "Card payments available." })
}

export async function POST(req: Request) {
  if (!STRIPE_KEY) {
    return NextResponse.json(
      { error: "Card payments are not enabled. Please use wallet/coins." },
      { status: 200 }
    )
  }

  const body = await req.json().catch(() => ({}))
  return NextResponse.json({ message: "Card payment request accepted", body })
}
