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

    const data = await request.json()
    const { age, location, gender, orientation, lookingFor, interests, photos, bio } = data

    // Update user profile
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        age: Number.parseInt(age),
        location,
        gender,
        orientation,
        lookingFor,
        interests,
        bio,
      },
    })

    // Create photo records
    if (photos && photos.length > 0) {
      await Promise.all(
        photos.map((url: string, index: number) =>
          prisma.photo.create({
            data: {
              userId: user.id,
              url,
              isPrimary: index === 0,
              order: index,
            },
          }),
        ),
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
