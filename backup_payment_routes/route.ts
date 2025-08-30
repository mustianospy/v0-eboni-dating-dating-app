import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { priceId } = body

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      url: null,
      message: "Stripe not configured, demo mode only"
    })
  }

  // ✅ Later: add Stripe checkout session here
  return NextResponse.json({ url: null })
}
