"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useVirtualScroll } from "@/lib/virtual-scroll"
import { LazyLoad } from "@/components/ui/lazy-load"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, X } from "lucide-react"

interface Profile {
  id: string
  display_name: string
  age: number
  bio: string
  location: string
  photos: Array<{ url: string; is_primary: boolean }>
  interests: string[]
}

interface VirtualSwipeStackProps {
  profiles: Profile[]
  onLike: (profileId: string) => void
  onPass: (profileId: string) => void
  containerHeight?: number
}

export function VirtualSwipeStack({ profiles, onLike, onPass, containerHeight = 600 }: VirtualSwipeStackProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const virtualScroll = useVirtualScroll(profiles, {
    itemHeight: 500,
    containerHeight,
    overscan: 2,
  })

  const {
    items: visibleProfiles,
    offsetY,
    totalHeight,
  } = useMemo(() => virtualScroll.getVisibleItems(scrollTop), [virtualScroll, scrollTop])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div className="overflow-auto" style={{ height: containerHeight }} onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleProfiles.map((profile) => (
            <LazyLoad key={profile.id} height={500} className="mb-4">
              <Card className="h-[480px] overflow-hidden">
                <div className="relative h-3/4">
                  <OptimizedImage
                    src={profile.photos.find((p) => p.is_primary)?.url || "/placeholder.svg"}
                    alt={profile.display_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={false}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold">
                      {profile.display_name}, {profile.age}
                    </h3>
                    <div className="flex items-center mt-1 text-sm opacity-90">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 h-1/4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{profile.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {profile.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {profile.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.interests.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() => onPass(profile.id)}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onLike(profile.id)}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                    >
                      <Heart className="h-6 w-6 text-pink-600" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </LazyLoad>
          ))}
        </div>
      </div>
    </div>
  )
}
