"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Sparkles, Zap, Award, Lock, Globe } from 'lucide-react';
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 dark:from-violet-950 dark:via-pink-950 dark:to-orange-950">
      {/* Header */}
      <header
        className="relative z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-violet-200 dark:border-violet-800 sticky top-0"
        role="banner"
      >
        <div className="container mx-auto px-4 py-6">
          <nav
            className="flex items-center justify-between"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart
                  className="h-10 w-10 text-gradient bg-gradient-to-r from-violet-600 to-pink-600 fill-current"
                  aria-hidden="true"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-serif font-black bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                EboniDating
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="hover:bg-violet-100 dark:hover:bg-violet-900 transition-all duration-300 font-semibold"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                  aria-label="Create a new account"
                >
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
          <div className="mb-8 inline-block px-4 py-2 bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-950/50 dark:to-pink-950/50 rounded-full border border-violet-200 dark:border-violet-800">
            <p className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              🏳️‍🌈 Made for the LGBTQ+ Community
            </p>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-black mb-8 leading-tight text-balance">
            <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-gradient">
              Find Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-orange-500 to-violet-600 bg-clip-text text-transparent animate-gradient delay-1000">
              Perfect Match
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed text-pretty">
            Connect authentically with your LGBTQ+ community. Find genuine love, friendship, and meaningful
            connections in a safe, inclusive space where you can be yourself.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-full font-semibold"
                aria-label="Start your journey to find a match"
              >
                <Heart className="mr-3 h-6 w-6" />
                Start Your Journey
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-6 border-2 border-violet-300 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-300 rounded-full font-semibold"
              aria-label="Learn more about EboniDating"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-y border-violet-200 dark:border-violet-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"
              id="features"
            >
              Why Choose EboniDating?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-pink-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature cards */}
            <FeatureCard
              icon={<Heart className="h-16 w-16 text-violet-600" />}
              title="Authentic Connections"
              description="Build meaningful relationships with verified profiles and genuine people in our trusted community."
              gradient="from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950"
            />
            <FeatureCard
              icon={<Users className="h-16 w-16 text-pink-600" />}
              title="LGBTQ+ Focused"
              description="A platform built by and for the LGBTQ+ community with inclusive features and understanding."
              gradient="from-pink-50 to-orange-50 dark:from-pink-950 dark:to-orange-950"
            />
            <FeatureCard
              icon={<Shield className="h-16 w-16 text-orange-600" />}
              title="Safe & Secure"
              description="Advanced safety features, verification, and AI moderation for your complete peace of mind."
              gradient="from-orange-50 to-violet-50 dark:from-orange-950 dark:to-violet-950"
            />
            <FeatureCard
              icon={<Sparkles className="h-16 w-16 text-purple-600" />}
              title="Premium Features"
              description="Video calls, private galleries, advanced matching, and exclusive premium perks."
              gradient="from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
            />
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="relative py-20 bg-gradient-to-b from-violet-100/30 to-pink-100/30 dark:from-violet-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 text-foreground">Your Safety is Our Priority</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">We've implemented industry-leading security measures</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg">
              <CardContent className="p-8 text-center">
                <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
                <p className="text-gray-600 dark:text-gray-400">Your messages and personal data are encrypted</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg">
              <CardContent className="p-8 text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Verified Profiles</h3>
                <p className="text-gray-600 dark:text-gray-400">Selfie verification to prevent catfishing</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 shadow-lg">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">24/7 Moderation</h3>
                <p className="text-gray-600 dark:text-gray-400">AI-powered and human moderation around the clock</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 dark:from-violet-900 dark:via-pink-900 dark:to-orange-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of LGBTQ+ individuals who have found love, friendship, and community on EboniDating.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="text-lg px-16 py-6 bg-white text-violet-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full font-bold"
            >
              Join EboniDating Today
              <Heart className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-violet-900 via-pink-900 to-orange-900 text-white py-16 border-t border-violet-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-400" />
                <span className="text-2xl font-serif font-bold">EboniDating</span>
              </div>
              <p className="text-pink-200 text-sm">Made for the LGBTQ+ community with love and care.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-pink-200 text-sm">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-pink-200 text-sm">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-pink-200 text-sm">
                <li><Link href="#" className="hover:text-white transition">Safety Center</Link></li>
                <li><Link href="#" className="hover:text-white transition">Community Guide</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-pink-700/30 pt-8 text-center text-pink-200">
            <p className="mb-4">
              © 2025 EboniDating. All rights reserved. Made with{" "}
              <Heart className="inline h-4 w-4 text-pink-400" /> for the LGBTQ+ community.
            </p>
            <p className="text-sm text-pink-300">
              Privacy Policy • Terms of Service • Community Guidelines • Accessibility
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <Card className={`group text-center border-0 bg-gradient-to-br ${gradient} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
      <CardContent className="p-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative flex justify-center">{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-4 text-foreground">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
