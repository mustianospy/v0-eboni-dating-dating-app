"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, Info } from "lucide-react"
import { ProfileModal } from "./profile-modal"

interface User {
  id: string
  name: string | null
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
}

interface SwipeViewProps {
  users: User[]
  currentUser: User
}

export function SwipeView({ users, currentUser }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentUser_display = users[currentIndex]

  const handleLike = async () => {
    if (!currentUser_display || isAnimating) return

    setIsAnimating(true)

    try {
      await fetch("/api/user/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: currentUser_display.id }),
      })

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setIsAnimating(false)
      }, 300)
    } catch (error) {
      console.error("Error liking user:", error)
      setIsAnimating(false)
    }
  }

  const handlePass = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  const handleSuperLike = async () => {
    if (!currentUser_display || isAnimating) return

    setIsAnimating(true)

    try {
      await fetch("/api/user/super-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: currentUser_display.id }),
      })

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setIsAnimating(false)
      }, 300)
    } catch (error) {
      console.error("Error super liking user:", error)
      setIsAnimating(false)
    }
  }

  if (currentIndex >= users.length) {
    return (
      <div className="text-center py-20">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">No more profiles!</h3>
        <p className="text-muted-foreground mb-6">
          You've seen everyone in your area. Try adjusting your filters or check back later.
        </p>
        <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
      </div>
    )
  }

  if (!currentUser_display) return null

  const primaryPhoto = currentUser_display.photos.find((photo) => photo.isPrimary) || currentUser_display.photos[0]

  return (
    <div className="max-w-md mx-auto">
      <Card
        className={`relative overflow-hidden transition-transform duration-300 ${isAnimating ? "scale-95 opacity-50" : ""}`}
      >
        <div className="relative aspect-[3/4]">
          <img
            src={primaryPhoto?.url || "/placeholder.svg?height=600&width=450&query=profile photo"}
            alt={`${currentUser_display.name}'s photo`}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Profile info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">
                {currentUser_display.name}, {currentUser_display.age}
              </h2>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                onClick={() => setSelectedUser(currentUser_display)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm opacity-90 mb-3">{currentUser_display.location}</p>

            {currentUser_display.bio && (
              <p className="text-sm opacity-90 mb-3 line-clamp-2">{currentUser_display.bio}</p>
            )}

            <div className="flex flex-wrap gap-1">
              {currentUser_display.interests.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {interest}
                </Badge>
              ))}
              {currentUser_display.interests.length > 3 && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  +{currentUser_display.interests.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-14 w-14 p-0 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive bg-transparent"
          onClick={handlePass}
          disabled={isAnimating}
        >
          <X className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-16 w-16 p-0 border-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary bg-transparent"
          onClick={handleSuperLike}
          disabled={isAnimating}
        >
          <Star className="h-7 w-7" />
        </Button>

        <Button
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90"
          onClick={handleLike}
          disabled={isAnimating}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onLike={handleLike}
          onPass={handlePass}
          onSuperLike={handleSuperLike}
        />
      )}
    </div>
  )
}
