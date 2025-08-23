
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkSubscriptionAccess } from "@/lib/subscription-middleware"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const hasAccess = checkSubscriptionAccess(user.subscriptionTier, 'video_call')

    if (!hasAccess) {
      return NextResponse.json({ 
        error: "Video calling requires a subscription",
        redirectTo: "/subscription"
      }, { status: 403 })
    }

    return NextResponse.json({ 
      success: true,
      canMakeVideoCall: true
    })
  } catch (error) {
    console.error("Video call access check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
