"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  description: string | null
  createdAt: Date
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "REFUNDED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SUBSCRIPTION":
        return "👑"
      case "COINS":
        return "🪙"
      case "BOOST":
        return "🚀"
      case "GIFT":
        return "🎁"
      case "GALLERY_UNLOCK":
        return "👁️"
      default:
        return "💳"
    }
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
          <p className="text-muted-foreground">Your purchase history will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                <div>
                  <h4 className="font-semibold">
                    {transaction.description || `${transaction.type.toLowerCase().replace("_", " ")}`}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
