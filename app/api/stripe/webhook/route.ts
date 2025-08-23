import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, type, subscriptionTier, coins } = session.metadata!

        if (type === "coins") {
          // Handle coin purchase
          await prisma.user.update({
            where: { id: userId },
            data: {
              coins: {
                increment: Number.parseInt(coins),
              },
            },
          })

          await prisma.transaction.create({
            data: {
              userId,
              type: "COINS",
              amount: session.amount_total! / 100,
              status: "COMPLETED",
              stripeId: session.id,
              description: `${coins} coins purchased`,
            },
          })
        } else {
          // Handle subscription
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + 1)

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: subscriptionTier as any,
              subscriptionExpiresAt: expiresAt,
            },
          })

          await prisma.transaction.create({
            data: {
              userId,
              type: "SUBSCRIPTION",
              amount: session.amount_total! / 100,
              status: "COMPLETED",
              stripeId: session.id,
              description: `${subscriptionTier} subscription`,
            },
          })
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          // Handle recurring subscription payment
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const { userId, subscriptionTier } = subscription.metadata

          const expiresAt = new Date(subscription.current_period_end * 1000)

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: subscriptionTier as any,
              subscriptionExpiresAt: expiresAt,
            },
          })

          await prisma.transaction.create({
            data: {
              userId,
              type: "SUBSCRIPTION",
              amount: invoice.amount_paid / 100,
              status: "COMPLETED",
              stripeId: invoice.id,
              description: `${subscriptionTier} subscription renewal`,
            },
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const { userId } = subscription.metadata

          await prisma.transaction.create({
            data: {
              userId,
              type: "SUBSCRIPTION",
              amount: invoice.amount_due / 100,
              status: "FAILED",
              stripeId: invoice.id,
              description: "Subscription payment failed",
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
