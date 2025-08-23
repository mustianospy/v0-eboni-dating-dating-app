import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { blockedUserId } = await request.json()

    if (!blockedUserId) {
      return NextResponse.json({ error: "Missing blocked user ID" }, { status: 400 })
    }

    // Create the block relationship
    await prisma.block.create({
      data: {
        blockerId: session.user.id,
        blockedUserId,
      },
    })

    // Remove any existing matches between the users
    await prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: blockedUserId },
          { user1Id: blockedUserId, user2Id: session.user.id },
        ],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Block user error:", error)
    return NextResponse.json({ error: "Failed to block user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { blockedUserId } = await request.json()

    if (!blockedUserId) {
      return NextResponse.json({ error: "Missing blocked user ID" }, { status: 400 })
    }

    // Remove the block relationship
    await prisma.block.deleteMany({
      where: {
        blockerId: session.user.id,
        blockedUserId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unblock user error:", error)
    return NextResponse.json({ error: "Failed to unblock user" }, { status: 500 })
  }
}
