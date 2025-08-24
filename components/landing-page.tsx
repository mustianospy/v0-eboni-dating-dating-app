"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 dark:from-violet-950 dark:via-pink-950 dark:to-orange-950">
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-violet-200 dark:border-violet-800" role="banner">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-10 w-10 text-gradient bg-gradient-to-r from-violet-600 to-pink-600 fill-current" aria-hidden="true" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-serif font-black bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">EboniDating</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="hover:bg-violet-100 dark:hover:bg-violet-900 transition-all duration-300" aria-label="Sign in to your account">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" aria-label="Create a new account">
                  Join Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-violet-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center space-x-4">
            <div className="relative group">
              <img src="/diverse-group.png" alt="Happy couple" className="w-20 h-20 rounded-full object-cover border-4 border-violet-200 shadow-lg group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-bounce"></div>
            </div>
            <div className="relative group">
              <img src="/person-reading.png" alt="Person enjoying life" className="w-20 h-20 rounded-full object-cover border-4 border-pink-200 shadow-lg group-hover:scale-110 transition-transform duration-300 delay-100" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="relative group">
              <img src="/outdoor-hiker.png" alt="Adventure together" className="w-20 h-20 rounded-full object-cover border-4 border-orange-200 shadow-lg group-hover:scale-110 transition-transform duration-300 delay-200" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-white animate-bounce delay-500"></div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-gradient">Find Your</span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-orange-500 to-violet-600 bg-clip-text text-transparent animate-gradient delay-1000">Perfect Match</span>
          </h1>
          
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with your community. Find love, friendship, and meaningful connections in a safe, inclusive space
            designed for <span className="font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">LGBTQ+ individuals</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-xl px-12 py-6 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-full" aria-label="Start your journey to find a match">
                <Heart className="mr-3 h-6 w-6" />
                Start Your Journey
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-xl px-12 py-6 border-2 border-violet-300 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-300 rounded-full" aria-label="Learn more about EboniDating">
              <Sparkles className="mr-3 h-6 w-6" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" id="features">
              Why Choose EboniDating?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-pink-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group text-center border-0 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Heart className="relative h-16 w-16 text-violet-600 mx-auto group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-violet-800 dark:text-violet-200">Authentic Connections</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Build meaningful relationships with verified profiles and genuine people in our trusted community.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950 dark:to-orange-950 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Users className="relative h-16 w-16 text-pink-600 mx-auto group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-800 dark:text-pink-200">LGBTQ+ Focused</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  A platform built by and for the LGBTQ+ community with inclusive features and understanding.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-gradient-to-br from-orange-50 to-violet-50 dark:from-orange-950 dark:to-violet-950 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-violet-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Shield className="relative h-16 w-16 text-orange-600 mx-auto group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-orange-800 dark:text-orange-200">Safe & Secure</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Advanced safety features, verification, and moderation for your complete peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Sparkles className="relative h-16 w-16 text-violet-600 mx-auto group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-violet-800 dark:text-violet-200">Premium Features</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Video calls, private galleries, advanced matching algorithms, and exclusive premium perks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-violet-900 via-pink-900 to-orange-900 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="h-8 w-8 text-pink-400 animate-pulse" aria-hidden="true" />
              <span className="text-3xl font-serif font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">EboniDating</span>
            </div>
            <div className="flex justify-center space-x-8 mb-6">
              <Link href="/auth/signin" className="hover:text-pink-400 transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="hover:text-pink-400 transition-colors">Join Now</Link>
              <Link href="/safety" className="hover:text-pink-400 transition-colors">Safety</Link>
              <Link href="/subscription" className="hover:text-pink-400 transition-colors">Premium</Link>
            </div>
            <p className="text-pink-200 text-lg">
              © 2024 EboniDating. All rights reserved. Made with <Heart className="inline h-4 w-4 text-pink-400" /> for the community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}