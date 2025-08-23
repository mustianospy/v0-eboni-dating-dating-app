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

    const { chatId, content, type = "TEXT" } = await request.json()

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user is a participant in the chat
    const chatParticipant = await prisma.chatParticipant.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId: currentUser.id,
        },
      },
    })

    if (!chatParticipant) {
      return NextResponse.json({ error: "Not authorized to send messages in this chat" }, { status: 403 })
    }

    // Get other participants for the receiverId
    const otherParticipants = await prisma.chatParticipant.findMany({
      where: {
        chatId,
        userId: { not: currentUser.id },
      },
    })

    const receiverId = otherParticipants[0]?.userId || null

    // Create message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: currentUser.id,
        receiverId,
        content,
        type,
      },
      include: {
        sender: {
          include: {
            photos: {
              where: { isPrimary: true },
            },
          },
        },
      },
    })

    // Update chat's updatedAt
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
