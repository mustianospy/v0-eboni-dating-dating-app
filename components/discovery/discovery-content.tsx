"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Grid3X3, Filter, MapPin, Settings } from "lucide-react"
import { SwipeView } from "./swipe-view"
import { GridView } from "./grid-view"
import { FilterPanel } from "./filter-panel"
import { TravelMode } from "./travel-mode"
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
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
  subscriptionTier: string; // Assuming subscriptionTier is a string like "FREE", "PREMIUM", etc.
}

interface DiscoveryContentProps {
  currentUser: User
  users: User[]
}

export function DiscoveryContent({ currentUser: user, users }: DiscoveryContentProps) {
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [travelMode, setTravelMode] = useState(false)
  const [currentUserSubscription, setCurrentUserSubscription] = useState(user.subscriptionTier)
  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    maxDistance: 50,
    interests: [] as string[],
    gender: "any",
  })

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)

    const filtered = users.filter((user) => {
      // Age filter
      if (user.age && (user.age < newFilters.ageRange[0] || user.age > newFilters.ageRange[1])) {
        return false
      }

      // Gender filter
      if (newFilters.genders.length > 0 && user.gender && !newFilters.genders.includes(user.gender)) {
        return false
      }

      // Orientation filter
      if (
        newFilters.orientations.length > 0 &&
        user.orientation &&
        !newFilters.orientations.includes(user.orientation)
      ) {
        return false
      }

      // Interests filter
      if (newFilters.interests.length > 0) {
        const hasMatchingInterest = newFilters.interests.some((interest) => user.interests.includes(interest))
        if (!hasMatchingInterest) {
          return false
        }
      }

      return true
    })

    setFilteredUsers(filtered)
  }

  const handleUnlockGallery = async () => {
    if (selectedUser) {
      try {
        const response = await fetch('/api/user/unlock-gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetUserId: selectedUser.id }),
        })

        if (response.ok) {
          // Refresh user data to show unlocked gallery
          window.location.reload()
        } else {
          // Redirect to subscription page
          window.location.href = '/subscription'
        }
      } catch (error) {
        console.error('Gallery unlock failed:', error)
      }
    }
  }

  const handleVideoCall = async () => {
    if (currentUserSubscription === "FREE") {
      window.location.href = '/subscription'
      return
    }
    // Implement video call logic here
    console.log('Starting video call...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-serif font-bold">EboniDating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={showTravelMode ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTravelMode(!showTravelMode)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Travel
              </Button>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Travel Mode Panel */}
        {showTravelMode && (
          <Card className="mb-6">
            <TravelMode onClose={() => setShowTravelMode(false)} />
          </Card>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-6">
            <FilterPanel filters={filters} onFiltersChange={applyFilters} onClose={() => setShowFilters(false)} />
          </Card>
        )}

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "swipe" | "grid")} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="swipe" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Swipe</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4" />
              <span>Grid</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swipe" className="mt-6">
            <SwipeView users={filteredUsers} currentUser={user} />
          </TabsContent>

          <TabsContent value="grid" className="mt-6">
            <GridView users={filteredUsers} currentUser={user} />
          </TabsContent>
        </Tabs>

        {/* Profile Modal */}
        {selectedUser && (
          <ProfileModal
            user={selectedUser}
            currentUserSubscription={currentUserSubscription}
            onClose={() => setSelectedUser(null)}
            onLike={() => console.log("Liked")}
            onPass={() => console.log("Passed")}
            onSuperLike={() => console.log("Super liked")}
            onUnlockGallery={handleUnlockGallery}
            onVideoCall={handleVideoCall}
          />
        )}

        {/* Results Count */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredUsers.length} people in your area
        </div>
      </div>
    </div>
  )
}