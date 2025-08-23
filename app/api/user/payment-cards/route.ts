
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, fetch from database
    const cards = [
      {
        id: "1",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        holderName: "John Doe"
      }
    ]

    return NextResponse.json({ cards })
  } catch (error) {
    console.error("Error fetching payment cards:", error)
    return NextResponse.json(
      { error: "Failed to fetch payment cards" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cardNumber, expiryDate, cvv, holderName } = await request.json()

    // Validate input
    if (!cardNumber || !expiryDate || !cvv || !holderName) {
      return NextResponse.json(
        { error: "Missing required card information" },
        { status: 400 }
      )
    }

    // Parse expiry date
    const [month, year] = expiryDate.split('/')
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return NextResponse.json(
        { error: "Invalid expiry date format" },
        { status: 400 }
      )
    }

    // In a real app, you would:
    // 1. Create a Stripe customer if doesn't exist
    // 2. Create a setup intent or payment method
    // 3. Save the payment method to your database
    // 4. Return the saved card information

    // For demo purposes, return mock data
    const newCard = {
      id: Date.now().toString(),
      last4: cardNumber.slice(-4),
      brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      expiryMonth: parseInt(month),
      expiryYear: 2000 + parseInt(year),
      isDefault: false,
      holderName
    }

    return NextResponse.json(newCard)
  } catch (error) {
    console.error("Error adding payment card:", error)
    return NextResponse.json(
      { error: "Failed to add payment card" },
      { status: 500 }
    )
  }
}
