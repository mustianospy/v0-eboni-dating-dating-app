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

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: currentUser.id,
          receiverId: targetUserId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 })
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        senderId: currentUser.id,
        receiverId: targetUserId,
      },
    })

    // Check if it's a mutual like (match)
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
      // Create chat for the match
      const chat = await prisma.chat.create({
        data: {
          type: "PRIVATE",
        },
      })

      // Create match
      match = await prisma.match.create({
        data: {
          user1Id: currentUser.id,
          user2Id: targetUserId,
          chatId: chat.id,
        },
      })

      // Add participants to chat
      await Promise.all([
        prisma.chatParticipant.create({
          data: {
            chatId: chat.id,
            userId: currentUser.id,
          },
        }),
        prisma.chatParticipant.create({
          data: {
            chatId: chat.id,
            userId: targetUserId,
          },
        }),
      ])
    }

    return NextResponse.json({
      success: true,
      match: !!match,
      matchId: match?.id,
    })
  } catch (error) {
    console.error("Like error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
