export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Fake coin top-up, bypass payment gateway
  const body = await req.json().catch(() => ({}))
  const { amount } = body

  return NextResponse.json({
    success: true,
    coinsAdded: amount || 0,
    message: "Demo top-up success. No payment gateway used."
  })
}
