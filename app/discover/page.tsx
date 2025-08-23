import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DiscoveryContent } from "@/components/discovery/discovery-content"

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      photos: {
        orderBy: { order: "asc" },
      },
      sentLikes: true,
      blocks: true,
    },
  })

  if (!currentUser) {
    redirect("/auth/signin")
  }

  // Get users to discover (excluding current user, already liked, and blocked users)
  const likedUserIds = currentUser.sentLikes.map((like) => like.receiverId)
  const blockedUserIds = currentUser.blocks.map((block) => block.blockedId)
  const excludedIds = [currentUser.id, ...likedUserIds, ...blockedUserIds]

  const discoveryUsers = await prisma.user.findMany({
    where: {
      id: { notIn: excludedIds },
      age: { not: null },
      gender: { not: null },
      orientation: { not: null },
    },
    include: {
      photos: {
        orderBy: { order: "asc" },
      },
    },
    take: 50,
  })

  return <DiscoveryContent currentUser={currentUser} users={discoveryUsers} />
}
