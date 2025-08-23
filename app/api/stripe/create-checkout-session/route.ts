import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId, subscriptionTier, type } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let checkoutSession

    if (type === "coins") {
      // Handle coin purchases
      const coinPackages: Record<string, { coins: number; bonus: number; price: number }> = {
        coins_10: { coins: 10, bonus: 0, price: 4.99 },
        coins_25: { coins: 25, bonus: 5, price: 9.99 },
        coins_50: { coins: 50, bonus: 15, price: 19.99 },
        coins_100: { coins: 100, bonus: 35, price: 34.99 },
      }

      const coinPackage = coinPackages[priceId]
      if (!coinPackage) {
        return NextResponse.json({ error: "Invalid coin package" }, { status: 400 })
      }

      checkoutSession = await stripe.checkout.sessions.create({
        customer_email: user.email,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${coinPackage.coins + coinPackage.bonus} Coins`,
                description:
                  coinPackage.bonus > 0
                    ? `${coinPackage.coins} coins + ${coinPackage.bonus} bonus`
                    : `${coinPackage.coins} coins`,
              },
              unit_amount: Math.round(coinPackage.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true&type=coins`,
        cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
        metadata: {
          userId: user.id,
          type: "coins",
          coins: coinPackage.coins + coinPackage.bonus,
        },
      })
    } else {
      // Handle subscription purchases
      const subscriptionPrices: Record<string, { price: number; name: string }> = {
        price_plus: { price: 9.99, name: "Plus" },
        price_pro: { price: 19.99, name: "Pro" },
        price_ultra: { price: 39.99, name: "Ultra" },
      }

      const subscription = subscriptionPrices[priceId]
      if (!subscription) {
        return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 })
      }

      checkoutSession = await stripe.checkout.sessions.create({
        customer_email: user.email,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `EboniDating ${subscription.name}`,
                description: `Monthly subscription to EboniDating ${subscription.name}`,
              },
              unit_amount: Math.round(subscription.price * 100),
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true&tier=${subscriptionTier}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
        metadata: {
          userId: user.id,
          subscriptionTier,
        },
      })
    }

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
