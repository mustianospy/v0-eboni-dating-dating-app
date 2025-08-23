"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

interface SubscriptionTier {
  id: string
  name: string
  price: number
  period: string
  icon: any
  color: string
  popular?: boolean
  features: string[]
  limitations?: string[]
}

interface SubscriptionTierCardProps {
  tier: SubscriptionTier
  currentTier: string
  isCurrentPlan: boolean
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function SubscriptionTierCard({ tier, currentTier, isCurrentPlan }: SubscriptionTierCardProps) {
  const handleSubscribe = async () => {
    if (tier.id === "FREE") return

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: `price_${tier.id.toLowerCase()}`,
          subscriptionTier: tier.id,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  const IconComponent = tier.icon

  return (
    <Card className={`relative ${tier.popular ? "ring-2 ring-primary" : ""} ${isCurrentPlan ? "bg-muted/50" : ""}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <IconComponent className={`h-8 w-8 ${tier.color}`} />
        </div>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <div className="text-3xl font-bold">
          {tier.price === 0 ? (
            "Free"
          ) : (
            <>
              <span className="text-sm font-normal">$</span>
              {tier.price}
              <span className="text-sm font-normal text-muted-foreground">/{tier.period}</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
          {tier.limitations?.map((limitation, index) => (
            <div key={index} className="flex items-center space-x-2 opacity-60">
              <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{limitation}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "secondary" : tier.popular ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={isCurrentPlan || tier.id === "FREE"}
        >
          {isCurrentPlan ? "Current Plan" : tier.id === "FREE" ? "Free Forever" : `Choose ${tier.name}`}
        </Button>
      </CardContent>
    </Card>
  )
}
