
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cardId } = params

    // In a real app, you would:
    // 1. Verify the card belongs to the user
    // 2. Delete from Stripe
    // 3. Delete from your database

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment card:", error)
    return NextResponse.json(
      { error: "Failed to delete payment card" },
      { status: 500 }
    )
  }
}
