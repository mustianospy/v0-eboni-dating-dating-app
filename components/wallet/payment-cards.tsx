
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Trash2, Shield, Eye, EyeOff } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

interface PaymentCard {
  id: string
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  holderName: string
}

interface PaymentCardsProps {
  userId: string
}

export function PaymentCards({ userId }: PaymentCardsProps) {
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: "1",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      holderName: "John Doe"
    }
  ])
  
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({})
  
  // Form states
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [holderName, setHolderName] = useState("")

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = cleaned.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return cleaned
    }
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
  }

  const handleAddCard = async () => {
    if (!cardNumber || !expiryDate || !cvv || !holderName) {
      return
    }

    setIsLoading(true)
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) throw new Error("Stripe failed to load")

      // In a real app, you'd create a setup intent and save the payment method
      const response = await fetch('/api/user/payment-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvv,
          holderName,
          userId
        })
      })

      if (response.ok) {
        const newCard = await response.json()
        setCards(prev => [...prev, newCard])
        setShowForm(false)
        setCardNumber("")
        setExpiryDate("")
        setCvv("")
        setHolderName("")
      }
    } catch (error) {
      console.error('Error adding card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/user/payment-cards/${cardId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCards(prev => prev.filter(card => card.id !== cardId))
      }
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const handleSetDefault = async (cardId: string) => {
    try {
      const response = await fetch(`/api/user/payment-cards/${cardId}/default`, {
        method: 'PATCH'
      })

      if (response.ok) {
        setCards(prev => prev.map(card => ({
          ...card,
          isDefault: card.id === cardId
        })))
      }
    } catch (error) {
      console.error('Error setting default card:', error)
    }
  }

  const toggleShowCardNumber = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Cards
        </CardTitle>
        <CardDescription>
          Manage your saved payment methods for purchases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cards.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No payment cards added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getBrandIcon(card.brand)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {showCardNumbers[card.id] 
                          ? `**** **** **** ${card.last4}`
                          : `•••• •••• •••• ${card.last4}`
                        }
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowCardNumber(card.id)}
                        className="h-6 w-6 p-0"
                      >
                        {showCardNumbers[card.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{card.holderName}</span>
                      <span>•</span>
                      <span>{String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}</span>
                      {card.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!card.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Card</DialogTitle>
              <DialogDescription>
                Add a new payment card to your account
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="holderName">Cardholder Name</Label>
                <Input
                  id="holderName"
                  placeholder="John Doe"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your card details are encrypted and secure</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddCard} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Adding..." : "Add Card"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
