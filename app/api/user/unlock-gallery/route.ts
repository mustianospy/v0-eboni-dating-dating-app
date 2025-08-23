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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has subscription or enough coins to unlock gallery
    const canUnlock =
      user.subscriptionTier === "ULTRA" || 
      user.subscriptionTier === "PRO" || 
      user.subscriptionTier === "PLUS" || 
      (user.subscriptionTier === "FREE" && user.coins >= 10)

    if (!canUnlock) {
      return NextResponse.json({ error: "Insufficient coins or subscription required" }, { status: 400 })
    }

    // Get target user's private photos
    const privatePhotos = await prisma.privatePhoto.findMany({
      where: { userId: targetUserId },
    })

    if (privatePhotos.length === 0) {
      return NextResponse.json({ error: "No private photos to unlock" }, { status: 400 })
    }

    // Create gallery unlocks for all private photos
    const unlocks = await Promise.all(
      privatePhotos.map((photo) =>
        prisma.galleryUnlock.create({
          data: {
            userId: user.id,
            privatePhotoId: photo.id,
          },
        }),
      ),
    )

    // Deduct coins if not subscribed
    if (user.subscriptionTier === "FREE") {
      await prisma.user.update({
        where: { id: user.id },
        data: { coins: user.coins - 10 },
      })

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "GALLERY_UNLOCK",
          amount: 10,
          status: "COMPLETED",
          description: "Private gallery unlocked",
        },
      })
    }

    return NextResponse.json({ success: true, unlocks })
  } catch (error) {
    console.error("Gallery unlock error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
