import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import crypto from "crypto"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerificationToken,
        emailVerificationExpires,
        emailVerified: false,
        subscriptionTier: "FREE",
        coins: 10, // Welcome bonus
      },
    })

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailVerificationToken}`

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@ebonidating.com",
        to: email,
        subject: "Welcome to EboniDating - Verify Your Email",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to EboniDating! 💜</h1>
            </div>
            <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">Hi ${name},</p>
              <p style="color: #6B7280; line-height: 1.6;">Thank you for joining our community! We're excited to help you find meaningful connections.</p>
              <p style="color: #6B7280; line-height: 1.6;">Please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">Verify Email Address</a>
              </div>
              <p style="color: #9CA3AF; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
              <p style="color: #9CA3AF; font-size: 14px;">If the button doesn't work, copy and paste this link: ${verificationUrl}</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px;">
              © 2024 EboniDating. Made with love for the community.
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Continue with signup even if email fails
    }

    return NextResponse.json(
      {
        message: "Account created successfully! Please check your email to verify your account.",
        userId: user.id,
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
