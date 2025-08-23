"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6" role="banner">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-serif font-bold text-foreground">EboniDating</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" aria-label="Sign in to your account">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button aria-label="Create a new account">Join Now</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground mb-6">
          Find Your
          <span className="text-primary"> Perfect </span>
          Match
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with your community. Find love, friendship, and meaningful connections in a safe, inclusive space
          designed for LGBTQ+ individuals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-4" aria-label="Start your journey to find a match">
              Start Your Journey
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent" aria-label="Learn more about EboniDating">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-serif font-bold text-center mb-12" id="features">Why Choose EboniDating?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Authentic Connections</h3>
              <p className="text-muted-foreground">
                Build meaningful relationships with verified profiles and genuine people.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">LGBTQ+ Focused</h3>
              <p className="text-muted-foreground">
                A platform built by and for the LGBTQ+ community with inclusive features.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Advanced safety features, verification, and moderation for your peace of mind.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Sparkles className="h-12 w-12 text-secondary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
              <p className="text-muted-foreground">Video calls, private galleries, and advanced matching algorithms.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-serif font-bold">EboniDating</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 EboniDating. All rights reserved. Made with love for the community.
          </p>
        </div>
      </footer>
    </div>
  )
}