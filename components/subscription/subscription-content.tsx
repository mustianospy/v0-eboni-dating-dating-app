"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Crown, Star, Zap, Check, Coins } from "lucide-react"
import Link from "next/link"
import { SubscriptionTierCard } from "./subscription-tier-card"
import { CoinsStore } from "./coins-store"
import { TransactionHistory } from "./transaction-history"

interface User {
  id: string
  name: string | null
  email: string
  subscriptionTier: string
  subscriptionExpiresAt: Date | null
  coins: number
  transactions: Array<{
    id: string
    type: string
    amount: number
    status: string
    description: string | null
    createdAt: Date
  }>
}

interface SubscriptionContentProps {
  user: User
}

const SUBSCRIPTION_TIERS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    period: "forever",
    icon: Heart,
    color: "text-muted-foreground",
    features: [
      "Basic profile creation",
      "Limited daily swipes (10)",
      "See who liked you (blurred)",
      "Basic messaging",
      "Standard support",
    ],
    limitations: ["No super likes", "No boosts", "No private gallery access", "Limited filters"],
  },
  {
    id: "PLUS",
    name: "Plus",
    price: 9.99,
    period: "month",
    icon: Star,
    color: "text-secondary",
    popular: false,
    features: [
      "Unlimited swipes",
      "5 super likes per day",
      "See who liked you",
      "Advanced filters",
      "Read receipts",
      "Priority support",
    ],
    limitations: ["Limited boosts (1 per month)", "No private gallery access"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 19.99,
    period: "month",
    icon: Crown,
    color: "text-primary",
    popular: true,
    features: [
      "Everything in Plus",
      "Unlimited super likes",
      "5 boosts per month",
      "Travel mode",
      "Private gallery unlocks (5 per month)",
      "Video calls",
      "Priority matching",
    ],
    limitations: ["Limited private gallery access"],
  },
  {
    id: "ULTRA",
    name: "Ultra",
    price: 39.99,
    period: "month",
    icon: Zap,
    color: "text-accent",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited boosts",
      "Unlimited private gallery access",
      "VIP profile badge",
      "Exclusive events access",
      "Personal matchmaker",
      "24/7 premium support",
    ],
    limitations: [],
  },
]

export function SubscriptionContent({ user }: SubscriptionContentProps) {
  const [activeTab, setActiveTab] = useState("plans")

  const currentTier = SUBSCRIPTION_TIERS.find((tier) => tier.id === user.subscriptionTier) || SUBSCRIPTION_TIERS[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-serif font-bold">EboniDating</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Current Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <currentTier.icon className={`h-6 w-6 ${currentTier.color}`} />
                <span>Your Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={user.subscriptionTier === "FREE" ? "secondary" : "default"} className="text-sm">
                      {currentTier.name}
                    </Badge>
                    {user.subscriptionTier !== "FREE" && (
                      <span className="text-sm text-muted-foreground">
                        {user.subscriptionExpiresAt
                          ? `Expires ${new Date(user.subscriptionExpiresAt).toLocaleDateString()}`
                          : "Active"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-secondary" />
                      <span className="font-medium">{user.coins} coins</span>
                    </div>
                  </div>
                </div>
                {user.subscriptionTier !== "ULTRA" && (
                  <Button>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
              <TabsTrigger value="coins">Coins Store</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SUBSCRIPTION_TIERS.map((tier) => (
                  <SubscriptionTierCard
                    key={tier.id}
                    tier={tier}
                    currentTier={user.subscriptionTier}
                    isCurrentPlan={tier.id === user.subscriptionTier}
                  />
                ))}
              </div>

              {/* Feature Comparison */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Feature</th>
                          {SUBSCRIPTION_TIERS.map((tier) => (
                            <th key={tier.id} className="text-center py-3 px-4">
                              {tier.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Daily Swipes</td>
                          <td className="text-center py-3 px-4">10</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Super Likes</td>
                          <td className="text-center py-3 px-4">-</td>
                          <td className="text-center py-3 px-4">5/day</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Boosts</td>
                          <td className="text-center py-3 px-4">-</td>
                          <td className="text-center py-3 px-4">1/month</td>
                          <td className="text-center py-3 px-4">5/month</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Private Gallery Access</td>
                          <td className="text-center py-3 px-4">-</td>
                          <td className="text-center py-3 px-4">-</td>
                          <td className="text-center py-3 px-4">5/month</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Video Calls</td>
                          <td className="text-center py-3 px-4">-</td>
                          <td className="text-center py-3 px-4">-</td>
                          <td className="text-center py-3 px-4">
                            <Check className="h-4 w-4 mx-auto text-green-500" />
                          </td>
                          <td className="text-center py-3 px-4">
                            <Check className="h-4 w-4 mx-auto text-green-500" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coins">
              <CoinsStore currentCoins={user.coins} />
            </TabsContent>

            <TabsContent value="history">
              <TransactionHistory transactions={user.transactions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
