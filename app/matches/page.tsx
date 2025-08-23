import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MatchesContent } from "@/components/matches/matches-content"

export default async function MatchesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!currentUser) {
    redirect("/auth/signin")
  }

  // Get user's matches
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ user1Id: currentUser.id }, { user2Id: currentUser.id }],
    },
    include: {
      user1: {
        include: {
          photos: {
            where: { isPrimary: true },
          },
        },
      },
      user2: {
        include: {
          photos: {
            where: { isPrimary: true },
          },
        },
      },
      chat: {
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get recent likes received
  const recentLikes = await prisma.like.findMany({
    where: { receiverId: currentUser.id },
    include: {
      sender: {
        include: {
          photos: {
            where: { isPrimary: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return <MatchesContent currentUser={currentUser} matches={matches} recentLikes={recentLikes} />
}
