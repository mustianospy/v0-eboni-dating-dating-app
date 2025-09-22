import { NextResponse } from "next/server"
import { setupDatabase } from "@/lib/database-setup"

export async function POST() {
  try {
    const result = await setupDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database setup completed" })
    } else {
      return NextResponse.json({ error: "Database setup failed", details: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
