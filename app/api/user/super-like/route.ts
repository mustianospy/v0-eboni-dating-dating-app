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

    const { targetUserId } = await request.json()

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has enough coins or premium subscription
    if (currentUser.coins < 1 && currentUser.subscriptionTier === "FREE") {
      return NextResponse.json({ error: "Insufficient coins or subscription required" }, { status: 400 })
    }

    // Create super like (same as regular like but with special flag)
    const like = await prisma.like.create({
      data: {
        senderId: currentUser.id,
        receiverId: targetUserId,
      },
    })

    // Deduct coin if not premium
    if (currentUser.subscriptionTier === "FREE") {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { coins: currentUser.coins - 1 },
      })
    }

    // Check for mutual like and create match if needed
    const mutualLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: targetUserId,
          receiverId: currentUser.id,
        },
      },
    })

    let match = null
    if (mutualLike) {
      const chat = await prisma.chat.create({
        data: { type: "PRIVATE" },
      })

      match = await prisma.match.create({
        data: {
          user1Id: currentUser.id,
          user2Id: targetUserId,
          chatId: chat.id,
        },
      })

      await Promise.all([
        prisma.chatParticipant.create({
          data: { chatId: chat.id, userId: currentUser.id },
        }),
        prisma.chatParticipant.create({
          data: { chatId: chat.id, userId: targetUserId },
        }),
      ])
    }

    return NextResponse.json({
      success: true,
      match: !!match,
      superLike: true,
    })
  } catch (error) {
    console.error("Super like error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
