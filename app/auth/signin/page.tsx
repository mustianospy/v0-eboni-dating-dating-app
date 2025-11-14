"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 dark:from-violet-950 dark:via-pink-950 dark:to-orange-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col gap-6">
          <Card className="border-0 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-2xl glow-primary">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <Heart className="h-10 w-10 text-gradient bg-gradient-to-r from-violet-600 to-pink-600 fill-current" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-3xl font-serif font-black bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  EboniDating
                </span>
              </div>
              <div>
                <CardTitle className="text-3xl bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Welcome Back</CardTitle>
                <CardDescription className="text-base mt-2">Sign in to your account and find your perfect match</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-violet-200 dark:border-violet-800 focus:border-pink-500 h-10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-violet-200 dark:border-violet-800 focus:border-pink-500 h-10"
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-200">
                      {error}
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-semibold h-10 shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-pink-600 dark:text-pink-400 font-semibold hover:underline">
                      Join EboniDating
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Part of the LGBTQ+ community? You&apos;re in good hands.</p>
            <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">We prioritize your safety and privacy</p>
          </div>
        </div>
      </div>
    </div>
  )
}
