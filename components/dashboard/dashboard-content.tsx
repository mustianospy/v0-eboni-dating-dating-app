"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Users, Settings, Crown, Coins } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string | null
  email: string
  bio: string | null
  age: number | null
  location: string | null
  gender: string | null
  orientation: string | null
  interests: string[]
  subscriptionTier: string
  coins: number
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
}

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const primaryPhoto = user.photos.find((photo) => photo.isPrimary)

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case "PLUS":
        return "bg-secondary text-secondary-foreground"
      case "PRO":
        return "bg-primary text-primary-foreground"
      case "ULTRA":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-serif font-bold">EboniDating</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/matches">
                <Button variant="ghost" size="sm" className="hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="ghost" size="sm" className="hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors">
                  <Users className="h-4 w-4 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/subscription">
                <Button variant="ghost" size="sm" className="hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">
                  <Crown className="h-4 w-4 mr-2" />
                  Premium
                </Button>
              </Link>
              <Link href="/safety">
                <Button variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="ghost" size="sm" className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                  <Coins className="h-4 w-4 mr-2" />
                  Wallet
                </Button>
              </Link>
              <Avatar>
                <AvatarImage src={primaryPhoto?.url || "/placeholder.svg"} />
                <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={primaryPhoto?.url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">
                    {user.age} • {user.location}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-2">Subscription</h4>
                    <Badge className={getSubscriptionColor(user.subscriptionTier)}>{user.subscriptionTier}</Badge>
                  </div>
                  <div className="text-right">
                    <h4 className="font-medium mb-2">Coins</h4>
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-secondary" />
                      <span className="font-semibold">{user.coins}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Identity</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary">{user.gender}</Badge>
                    <Badge variant="secondary">{user.orientation}</Badge>
                  </div>
                </div>

                {user.interests.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.interests.slice(0, 6).map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {user.interests.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.interests.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {user.bio && (
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}

                <Button className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Premium Upgrade Banner */}
            {user.subscriptionTier === "FREE" && (
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Unlock Premium Features</h3>
                      <p className="text-muted-foreground mb-4">
                        Get unlimited swipes, super likes, and access to exclusive features
                      </p>
                    </div>
                    <Crown className="h-12 w-12 text-primary" />
                  </div>
                  <Link href="/subscription">
                    <Button>Upgrade Now</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/discover">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Discover</h3>
                    <p className="text-sm text-muted-foreground">Find new people</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/matches">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <h3 className="font-semibold">Messages</h3>
                    <p className="text-sm text-muted-foreground">Chat with matches</p>
                  </CardContent>
                </Card>
              </Link>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Likes</h3>
                  <p className="text-sm text-muted-foreground">See who likes you</p>
                </CardContent>
              </Card>
            </div>

            {/* Welcome Message */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to EboniDating!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your profile is now complete! Start discovering amazing people in your community. Remember to stay
                  safe and have fun connecting with others.
                </p>
                <div className="flex gap-4">
                  <Link href="/discover">
                    <Button>Start Discovering</Button>
                  </Link>
                  <Link href="/subscription">
                    <Button variant="outline">View Premium Features</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
