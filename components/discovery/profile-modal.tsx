"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, X, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

interface User {
  id: string
  name: string | null
  bio: string | null
  age: number | null
  location: string | null
  gender: string | null
  orientation: string | null
  interests: string[]
  subscriptionTier: string
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
  privatePhotos?: Array<{
    id: string
    url: string
  }>
}

interface ProfileModalProps {
  user: User
  currentUserSubscription?: string
  onClose: () => void
  onLike: () => void
  onPass: () => void
  onSuperLike: () => void
  onUnlockGallery?: () => void
  onVideoCall?: () => void
}

export function ProfileModal({ 
  user, 
  currentUserSubscription = "FREE",
  onClose, 
  onLike, 
  onPass, 
  onSuperLike,
  onUnlockGallery,
  onVideoCall
}: ProfileModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showGalleryUnlock, setShowGalleryUnlock] = useState(false)
  
  const hasSubscription = currentUserSubscription !== "FREE"
  const canViewGallery = hasSubscription || user.subscriptionTier === "FREE"
  const canMakeVideoCall = hasSubscription

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length)
  }

  const currentPhoto = user.photos[currentPhotoIndex] || user.photos[0]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Photo carousel */}
          <div className="relative aspect-[3/4]">
            <img
              src={currentPhoto?.url || "/placeholder.svg?height=600&width=450&query=profile photo"}
              alt={`${user.name}'s photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Photo navigation */}
            {user.photos.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0 bg-black/20 backdrop-blur-sm border-0 text-white hover:bg-black/40"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0 bg-black/20 backdrop-blur-sm border-0 text-white hover:bg-black/40"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Photo indicators */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-1">
                  {user.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 w-8 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile info */}
          <ScrollArea className="max-h-80">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {user.name}, {user.age}
                </h2>
              </div>

              {user.location && (
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{user.location}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Gender</h4>
                  <Badge variant="secondary">{user.gender}</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Orientation</h4>
                  <Badge variant="secondary">{user.orientation}</Badge>
                </div>
              </div>

              {user.bio && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
                </div>
              )}

              {user.interests.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Gallery unlock section */}
          {!canViewGallery && user.privatePhotos && user.privatePhotos.length > 0 && (
            <div className="p-6 border-t bg-muted/50">
              <div className="text-center">
                <h4 className="font-medium mb-2">Private Gallery</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to unlock {user.privatePhotos.length} private photos
                </p>
                <Button onClick={onUnlockGallery} className="w-full">
                  Unlock Gallery
                </Button>
              </div>
            </div>
          )}

          {/* Video call section */}
          {!canMakeVideoCall && (
            <div className="p-6 border-t bg-muted/50">
              <div className="text-center">
                <h4 className="font-medium mb-2">Video Calling</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to enable video calls
                </p>
                <Button onClick={() => window.location.href = '/subscription'} variant="outline" className="w-full">
                  Upgrade to Call
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center items-center space-x-4 p-6 border-t">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 w-12 p-0 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive bg-transparent"
              onClick={() => {
                onPass()
                onClose()
              }}
            >
              <X className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 w-14 p-0 border-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary bg-transparent"
              onClick={() => {
                onSuperLike()
                onClose()
              }}
            >
              <Star className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              className="rounded-full h-12 w-12 p-0 bg-primary hover:bg-primary/90"
              onClick={() => {
                onLike()
                onClose()
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>

            {canMakeVideoCall && onVideoCall && (
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 w-12 p-0 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent"
                onClick={onVideoCall}
              >
                📹
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
