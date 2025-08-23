"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin } from "lucide-react"
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

interface GridViewProps {
  users: User[]
  currentUser: User
}

export function GridView({ users, currentUser }: GridViewProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleLike = async (targetUserId: string) => {
    try {
      await fetch("/api/user/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      })
    } catch (error) {
      console.error("Error liking user:", error)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">No profiles found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to see more people.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => {
          const primaryPhoto = user.photos.find((photo) => photo.isPrimary) || user.photos[0]

          return (
            <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative aspect-[3/4]" onClick={() => setSelectedUser(user)}>
                <img
                  src={primaryPhoto?.url || "/placeholder.svg?height=400&width=300&query=profile photo"}
                  alt={`${user.name}'s photo`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick like button */}
                <Button
                  size="sm"
                  className="absolute top-3 right-3 rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(user.id)
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">
                    {user.name}, {user.age}
                  </h3>
                </div>

                {user.location && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )}

                {user.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>}

                <div className="flex flex-wrap gap-1">
                  {user.interests.slice(0, 2).map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {user.interests.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.interests.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onLike={() => handleLike(selectedUser.id)}
          onPass={() => setSelectedUser(null)}
          onSuperLike={() => handleLike(selectedUser.id)}
        />
      )}
    </>
  )
}
