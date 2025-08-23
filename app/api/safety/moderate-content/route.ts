import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Simulated AI content moderation
async function moderateContent(
  content: string,
  type: "text" | "image",
): Promise<{
  isAppropriate: boolean
  confidence: number
  flags: string[]
}> {
  // Simulate AI moderation logic
  const inappropriateWords = ["spam", "scam", "fake", "inappropriate"]
  const flags: string[] = []

  if (type === "text") {
    const lowerContent = content.toLowerCase()
    inappropriateWords.forEach((word) => {
      if (lowerContent.includes(word)) {
        flags.push(`Contains inappropriate word: ${word}`)
      }
    })
  }

  return {
    isAppropriate: flags.length === 0,
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
    flags,
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, type } = await request.json()

    if (!content || !type) {
      return NextResponse.json({ error: "Missing content or type" }, { status: 400 })
    }

    const moderationResult = await moderateContent(content, type)

    return NextResponse.json(moderationResult)
  } catch (error) {
    console.error("Content moderation error:", error)
    return NextResponse.json({ error: "Failed to moderate content" }, { status: 500 })
  }
}
