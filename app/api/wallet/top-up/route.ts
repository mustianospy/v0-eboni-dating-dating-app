import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 1 || amount > 1000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create wallet transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        type: "TOP_UP",
        amount: amount,
        description: `Wallet top-up $${amount}`,
        status: "PENDING",
      },
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Wallet Top-up",
              description: `Add $${amount} to your EboniDating wallet`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wallet?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wallet?canceled=true`,
      metadata: {
        userId: user.id,
        transactionId: transaction.id,
        type: "wallet_top_up",
      },
    })

    // Update transaction with Stripe ID
    await prisma.walletTransaction.update({
      where: { id: transaction.id },
      data: { stripeId: checkoutSession.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
