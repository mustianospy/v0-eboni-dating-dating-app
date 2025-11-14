"use client"

import type React from "react"
import { GlobalSignUpForm } from "@/components/auth/global-signup-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <GlobalSignUpForm />
    </div>
  )
}
