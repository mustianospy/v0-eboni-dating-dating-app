import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      photos: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // Check if user has completed onboarding
  if (!user.age || !user.gender || !user.orientation) {
    redirect("/onboarding")
  }

  return <DashboardContent user={user} />
}
