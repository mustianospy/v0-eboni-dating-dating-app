"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { CompatibilityCard } from "./compatibility-card"
import { aiMatcher, type UserProfile } from "@/lib/ai-matching"
import { Heart, X, Sparkles, TrendingUp } from "lucide-react"

interface AIRecommendationsProps {
  currentUser: UserProfile
  candidateProfiles: UserProfile[]
  onLike: (profileId: string) => void
  onPass: (profileId: string) => void
}

export function AIRecommendations({ currentUser, candidateProfiles, onLike, onPass }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    Array<{
      profile: UserProfile
      compatibility: any
    }>
  >([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true)
      const recs = await aiMatcher.getRecommendations(currentUser.id, candidateProfiles, 10)
      setRecommendations(recs)
      setIsLoading(false)
    }

    loadRecommendations()
  }, [currentUser.id, candidateProfiles])

  const handleLike = () => {
    if (recommendations[currentIndex]) {
      onLike(recommendations[currentIndex].profile.id)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePass = () => {
    if (recommendations[currentIndex]) {
      onPass(recommendations[currentIndex].profile.id)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-muted-foreground">Finding your perfect matches...</p>
        </div>
      </div>
    )
  }

  if (currentIndex >= recommendations.length) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">You've seen all recommendations!</h3>
        <p className="text-muted-foreground mb-4">Check back later for new matches, or expand your search criteria.</p>
        <Button onClick={() => setCurrentIndex(0)}>Review Matches Again</Button>
      </div>
    )
  }

  const currentRecommendation = recommendations[currentIndex]
  const { profile, compatibility } = currentRecommendation

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center mb-2">
          <Sparkles className="h-6 w-6 mr-2 text-purple-500" />
          AI Recommendations
        </h2>
        <p className="text-muted-foreground">
          {currentIndex + 1} of {recommendations.length}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="relative h-96">
          <OptimizedImage
            src={profile.photos?.find((p) => p.is_primary)?.url || "/placeholder.svg"}
            alt={profile.display_name}
            fill
            className="object-cover"
            sizes="400px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-4 right-4">
            <Badge className="bg-purple-500 text-white">{compatibility.overall}% Match</Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-2xl font-bold">
              {profile.display_name}, {profile.age}
            </h3>
            <p className="text-sm opacity-90 mt-1">{profile.location}</p>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{profile.bio}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {profile.interests.slice(0, 4).map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{profile.interests.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Card */}
      <CompatibilityCard compatibility={compatibility} showDetails />

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6">
        <Button
          size="lg"
          variant="outline"
          onClick={handlePass}
          className="w-16 h-16 rounded-full p-0 border-2 hover:border-gray-400 bg-transparent"
        >
          <X className="h-8 w-8 text-gray-600" />
        </Button>

        <Button
          size="lg"
          onClick={handleLike}
          className="w-16 h-16 rounded-full p-0 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-1">
        {recommendations.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-purple-500" : "bg-gray-300"}`}
          />
        ))}
        {recommendations.length > 5 && (
          <span className="text-xs text-muted-foreground ml-2">+{recommendations.length - 5} more</span>
        )}
      </div>
    </div>
  )
}
