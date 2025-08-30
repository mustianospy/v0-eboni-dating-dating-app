<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
=======
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
>>>>>>> 4d21eeb (Refactor config and payment flow:)

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  return NextResponse.json({
    success: true,
    message: "Mock payment success. No real gateway used.",
    data: body
  })
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Mock GET endpoint. Payments disabled in demo mode."
  })
}
