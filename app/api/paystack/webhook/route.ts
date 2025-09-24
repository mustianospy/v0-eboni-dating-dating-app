import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackWebhook } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyPaystackWebhook(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different Paystack events
    switch (event.event) {
      case "charge.success":
        // Handle successful payment
        console.log("Payment successful:", event.data);
        // TODO: Update user subscription/payment status in database
        break;
      
      case "subscription.create":
        // Handle subscription creation
        console.log("Subscription created:", event.data);
        break;
      
      case "subscription.disable":
        // Handle subscription cancellation
        console.log("Subscription cancelled:", event.data);
        break;
      
      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
