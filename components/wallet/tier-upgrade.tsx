"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Check } from "lucide-react"

interface TierUpgradeProps {
  currentTier: string
  onSuccess: () => void
}

const tiers = [
  {
    id: "STANDARD",
    name: "Standard",
    price: 0,
    icon: Star,
    color: "bg-gray-500",
    features: ["Basic messaging (after payment)", "Limited likes per day", "Basic profile"],
  },
  {
    id: "PREMIUM_SILVER",
    name: "Premium Silver",
    price: 19.99,
    icon: Star,
    color: "bg-gray-400",
    features: ["Unlimited messaging", "Video calls", "Advanced filters", "See who liked you", "Priority support"],
  },
  {
    id: "PREMIUM_GOLD",
    name: "Premium Gold",
    price: 39.99,
    icon: Crown,
    color: "bg-yellow-500",
    features: [
      "All Silver benefits",
      "Priority matching",
      "Exclusive events access",
      "Advanced analytics",
      "Personal dating coach",
    ],
  },
]

export function TierUpgrade({ currentTier, onSuccess }: TierUpgradeProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (tierId: string, price: number) => {
    setLoading(tierId)
    try {
      const response = await fetch("/api/user/upgrade-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId, amount: price }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error upgrading tier:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Upgrade Your Experience</h3>
        <p className="text-gray-600">Unlock premium features and enhance your dating journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const TierIcon = tier.icon
          const isCurrentTier = currentTier === tier.id
          const canUpgrade = tier.price > 0 && currentTier !== tier.id

          return (
            <Card key={tier.id} className={`relative ${isCurrentTier ? "ring-2 ring-purple-500" : ""}`}>
              {isCurrentTier && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="text-center">
                <div className={`w-12 h-12 rounded-full ${tier.color} flex items-center justify-center mx-auto mb-2`}>
                  <TierIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">${tier.price}</span>
                  {tier.price > 0 && <span className="text-sm">/month</span>}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {canUpgrade && (
                  <Button
                    onClick={() => handleUpgrade(tier.id, tier.price)}
                    disabled={loading === tier.id}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading === tier.id ? "Processing..." : `Upgrade to ${tier.name}`}
                  </Button>
                )}

                {isCurrentTier && (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
