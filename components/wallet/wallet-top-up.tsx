"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, DollarSign } from "lucide-react"

interface WalletTopUpProps {
  onSuccess: () => void
}

export function WalletTopUp({ onSuccess }: WalletTopUpProps) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const quickAmounts = [10, 25, 50, 100]

  const handleTopUp = async (topUpAmount: number) => {
    setLoading(true)
    try {
      const response = await fetch("/api/wallet/top-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: topUpAmount }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Add Funds</span>
        </CardTitle>
        <CardDescription>Top up your wallet to access premium features and make purchases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Amount Buttons */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick amounts</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                onClick={() => handleTopUp(quickAmount)}
                disabled={loading}
                className="h-12 flex flex-col items-center justify-center"
              >
                <DollarSign className="h-4 w-4 mb-1" />${quickAmount}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="space-y-3">
          <Label htmlFor="custom-amount">Custom amount</Label>
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="custom-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="1"
                max="1000"
              />
            </div>
            <Button
              onClick={() => handleTopUp(Number.parseFloat(amount))}
              disabled={loading || !amount || Number.parseFloat(amount) < 1}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Processing..." : "Add Funds"}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>• Minimum top-up amount: $1.00</p>
          <p>• Maximum top-up amount: $1,000.00</p>
          <p>• Funds are added instantly after payment</p>
        </div>
      </CardContent>
    </Card>
  )
}
