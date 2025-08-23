import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ChatInterface } from "@/components/chat/chat-interface"

interface ChatPageProps {
  params: {
    chatId: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      photos: {
        where: { isPrimary: true },
      },
    },
  })

  if (!currentUser) {
    redirect("/auth/signin")
  }

  // Get chat with participants and messages
  const chat = await prisma.chat.findUnique({
    where: { id: params.chatId },
    include: {
      participants: {
        include: {
          user: {
            include: {
              photos: {
                where: { isPrimary: true },
              },
            },
          },
        },
      },
      messages: {
        include: {
          sender: {
            include: {
              photos: {
                where: { isPrimary: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!chat) {
    redirect("/matches")
  }

  // Check if current user is a participant
  const isParticipant = chat.participants.some((p) => p.userId === currentUser.id)
  if (!isParticipant) {
    redirect("/matches")
  }

  // Get the other participant (for private chats)
  const otherParticipant = chat.participants.find((p) => p.userId !== currentUser.id)

  return <ChatInterface chat={chat} currentUser={currentUser} otherParticipant={otherParticipant?.user || null} />
}
