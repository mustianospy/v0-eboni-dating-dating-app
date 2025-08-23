import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type = "PROFILE_BOOST" } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user can use boost
    const canUseBoost =
      user.subscriptionTier === "ULTRA" ||
      (user.subscriptionTier === "PRO" && user.coins >= 3) ||
      (user.subscriptionTier === "PLUS" && user.coins >= 3) ||
      (user.subscriptionTier === "FREE" && user.coins >= 3)

    if (!canUseBoost) {
      return NextResponse.json({ error: "Insufficient coins or subscription required" }, { status: 400 })
    }

    // Create boost
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30) // 30 minute boost

    const boost = await prisma.boost.create({
      data: {
        userId: user.id,
        type: type as any,
        expiresAt,
      },
    })

    // Deduct coins if not Ultra
    if (user.subscriptionTier !== "ULTRA") {
      await prisma.user.update({
        where: { id: user.id },
        data: { coins: user.coins - 3 },
      })

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "BOOST",
          amount: 3,
          status: "COMPLETED",
          description: "Profile boost activated",
        },
      })
    }

    return NextResponse.json({ success: true, boost })
  } catch (error) {
    console.error("Boost error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
