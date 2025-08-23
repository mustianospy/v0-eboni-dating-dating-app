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

    const { enabled, destination, startDate, endDate } = await request.json()

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // For now, we'll store travel mode info in user metadata
    // In a full implementation, you'd have a separate TravelMode table
    const travelModeData = enabled
      ? {
          destination,
          startDate,
          endDate,
          enabled: true,
        }
      : null

    // This would typically be stored in a separate table or JSON field
    // For demo purposes, we'll just return success
    console.log("Travel mode updated:", travelModeData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Travel mode error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
