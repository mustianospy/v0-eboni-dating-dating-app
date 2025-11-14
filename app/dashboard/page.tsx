import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, MessageCircle, Settings, Flame, Gift, Eye, Users } from 'lucide-react'
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/signin")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 dark:from-violet-950 dark:via-pink-950 dark:to-orange-950">
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-violet-200 dark:border-violet-800 sticky top-0 z-50">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-gradient bg-gradient-to-r from-violet-600 to-pink-600 fill-current" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  EboniDating
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/wallet">
                <Button variant="outline" className="border-violet-300 hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-950">
                  <Gift className="mr-2 h-4 w-4" />
                  Wallet
                </Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="outline" className="border-pink-300 hover:bg-pink-50 dark:border-pink-700 dark:hover:bg-pink-950" type="submit">
                  <User className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-violet-100 via-pink-100 to-orange-100 dark:from-violet-950/50 dark:via-pink-950/50 dark:to-orange-950/50 rounded-2xl p-8 border border-violet-200 dark:border-violet-800">
            <h2 className="text-3xl font-serif font-bold mb-2">
              <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Welcome back, {profile?.display_name || user.email?.split("@")[0]}!
              </span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">Ready to find your perfect match? Let's get started.</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950/50 dark:to-pink-950/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-5 w-5 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-700">Complete</div>
              <p className="text-xs text-violet-600 mt-1">100% profile strength</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-950/50 dark:to-orange-950/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <MessageCircle className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-700">0</div>
              <p className="text-xs text-pink-600 mt-1">Check back soon</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-950/50 dark:to-yellow-950/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Likes Received</CardTitle>
              <Heart className="h-5 w-5 text-orange-600 fill-current" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">0</div>
              <p className="text-xs text-orange-600 mt-1">First impressions coming</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">0</div>
              <p className="text-xs text-purple-600 mt-1">Start exploring to find matches</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-pink-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Flame className="h-5 w-5" />
                <span>Discover Profiles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Explore profiles from people in your area and beyond. Swipe to match with people you love.
              </p>
              <Link href="/discover">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white">
                  Start Discovering
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-orange-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Complete Your Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add more photos and details to get more matches. The more complete your profile, the better!
              </p>
              <Link href="/profile/edit">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white">
                  Edit Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/discover">
                <Button variant="outline" className="w-full border-2 border-violet-300 hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-950">
                  Discover
                </Button>
              </Link>
              <Link href="/matches">
                <Button variant="outline" className="w-full border-2 border-pink-300 hover:bg-pink-50 dark:border-pink-700 dark:hover:bg-pink-950">
                  My Matches
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full border-2 border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950">
                  Messages
                </Button>
              </Link>
              <Link href="/subscription">
                <Button variant="outline" className="w-full border-2 border-yellow-300 hover:bg-yellow-50 dark:border-yellow-700 dark:hover:bg-yellow-950">
                  Premium
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { ArrowRight } from 'lucide-react'
