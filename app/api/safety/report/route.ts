import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reportedUserId, reason, additionalInfo } = await request.json()

    if (!reportedUserId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        reportedUserId,
        reason,
        additionalInfo,
        status: "PENDING",
      },
    })

    // Auto-block the reported user for the reporter
    await prisma.block.create({
      data: {
        blockerId: session.user.id,
        blockedUserId: reportedUserId,
      },
    })

    return NextResponse.json({ success: true, reportId: report.id })
  } catch (error) {
    console.error("Report submission error:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}
