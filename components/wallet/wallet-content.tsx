"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, Crown, History, Coins, TrendingUp, CreditCard } from "lucide-react"
import { WalletTopUp } from "./wallet-top-up"
import { TransactionHistory } from "./transaction-history"
import { TierUpgrade } from "./tier-upgrade"
import { PaymentCards } from "./payment-cards"

interface UserData {
  walletBalance: number
  subscriptionTier: string
  hasEverPaid: boolean
  tierBenefitsUsed: any
}

export function WalletContent() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/wallet")
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case "STANDARD":
        return { name: "Standard", icon: Star, color: "bg-gray-500", benefits: ["Basic messaging", "Limited likes"] }
      case "PREMIUM_SILVER":
        return {
          name: "Premium Silver",
          icon: Star,
          color: "bg-gray-400",
          benefits: ["Unlimited messaging", "Video calls", "Advanced filters"],
        }
      case "PREMIUM_GOLD":
        return {
          name: "Premium Gold",
          icon: Crown,
          color: "bg-yellow-500",
          benefits: ["All Silver benefits", "Priority matching", "Exclusive features"],
        }
      default:
        return { name: "Standard", icon: Star, color: "bg-gray-500", benefits: ["Basic features"] }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Error loading wallet data</div>
  }

  const tierInfo = getTierInfo(userData.subscriptionTier)
  const TierIcon = tierInfo.icon

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">Manage your balance, transactions, and account tier</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6" />
              <CardTitle>Wallet Balance</CardTitle>
            </div>
            <Badge className={`${tierInfo.color} text-white`}>
              <TierIcon className="h-4 w-4 mr-1" />
              {tierInfo.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">${userData.walletBalance.toFixed(2)}</div>
          <p className="text-purple-100">Available balance</p>
          {!userData.hasEverPaid && (
            <div className="mt-4 p-3 bg-red-500/20 rounded-lg">
              <p className="text-sm">⚠️ Payment required to access messaging and calling features</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="top-up" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="top-up" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Top Up
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Upgrade
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-up" className="space-y-6">
          <WalletTopUp onSuccess={fetchUserData} />
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-6">
          <TierUpgrade currentTier={userData.subscriptionTier} onSuccess={fetchUserData} />
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <PaymentCards userId={session?.user?.id} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}