
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mock BVN verification service
// In production, integrate with a real BVN verification service like Flutterwave, Paystack, or Mono
async function verifyBvnWithProvider(bvn: string) {
  // Simulate API call to BVN verification service
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple validation: check if BVN is 11 digits and not all same digits
      const isValid = /^\d{11}$/.test(bvn) && !(/^(\d)\1{10}$/.test(bvn))
      
      if (isValid) {
        resolve({
          status: "success",
          data: {
            bvn: bvn,
            first_name: "John",
            last_name: "Doe",
            date_of_birth: "1990-01-01",
            phone_number: "08012345678",
            is_valid: true
          }
        })
      } else {
        resolve({
          status: "error",
          message: "Invalid BVN or BVN not found"
        })
      }
    }, 2000) // Simulate network delay
  })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bvn } = await request.json()

    // Validate BVN format
    if (!bvn || !/^\d{11}$/.test(bvn)) {
      return NextResponse.json(
        { error: "Please provide a valid 11-digit BVN" },
        { status: 400 }
      )
    }

    // Check if BVN is already verified by another user
    const existingBvn = await prisma.user.findFirst({
      where: {
        bvn: bvn,
        email: {
          not: session.user.email
        }
      }
    })

    if (existingBvn) {
      return NextResponse.json(
        { error: "This BVN is already registered to another account" },
        { status: 409 }
      )
    }

    // Verify BVN with external service
    const verificationResult = await verifyBvnWithProvider(bvn) as any

    if (verificationResult.status === "error") {
      return NextResponse.json(
        { error: verificationResult.message || "BVN verification failed" },
        { status: 400 }
      )
    }

    // Update user record with BVN and verification status
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        bvn: bvn,
        bvnVerified: true,
        bvnVerifiedAt: new Date(),
        // You can also store additional BVN details if needed
        // bvnData: JSON.stringify(verificationResult.data)
      },
    })

    return NextResponse.json({ 
      success: true,
      message: "BVN verified successfully",
      user: {
        id: user.id,
        bvnVerified: user.bvnVerified
      }
    })
  } catch (error) {
    console.error("BVN verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
