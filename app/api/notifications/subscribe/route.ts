import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, subscription } = await request.json()

    if (!userId || !subscription) {
      return NextResponse.json({ error: "Missing userId or subscription" }, { status: 400 })
    }

    const supabase = await createClient()

    // Store the push subscription in the database
    const { error } = await supabase.from("push_subscriptions").upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error storing push subscription:", error)
      return NextResponse.json({ error: "Failed to store subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Push subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
