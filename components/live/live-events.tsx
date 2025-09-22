"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { MapPin, Users, Clock, Heart, Share, Bell, Play, Radio } from "lucide-react"

interface LiveEvent {
  id: string
  title: string
  description: string
  type: "stream" | "meetup" | "party" | "discussion"
  startTime: Date
  duration: number // minutes
  location?: string
  isOnline: boolean
  host: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  attendees: number
  maxAttendees?: number
  isLive: boolean
  tags: string[]
  coverImage: string
}

export function LiveEvents() {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [filter, setFilter] = useState<"all" | "live" | "upcoming" | "following">("all")

  useEffect(() => {
    // Mock live events data
    setEvents([
      {
        id: "1",
        title: "Pride Month Celebration Stream",
        description: "Join us for a special Pride Month celebration with music, stories, and community love!",
        type: "stream",
        startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        duration: 120,
        isOnline: true,
        host: {
          id: "1",
          name: "Alex Rivera",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        attendees: 234,
        isLive: false,
        tags: ["Pride", "Music", "Community"],
        coverImage: "/pride-celebration.jpg",
      },
      {
        id: "2",
        title: "LGBTQ+ Speed Dating Night",
        description: "Meet new people in a fun, safe environment. All orientations welcome!",
        type: "meetup",
        startTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
        duration: 90,
        location: "Rainbow Lounge, SF",
        isOnline: false,
        host: {
          id: "2",
          name: "Jordan Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: false,
        },
        attendees: 45,
        maxAttendees: 50,
        isLive: true,
        tags: ["Dating", "Social", "In-Person"],
        coverImage: "/speed-dating.png",
      },
      {
        id: "3",
        title: "Queer Book Club Discussion",
        description: "This month we're discussing \"Red: A Crayon's Story\" and its themes of identity.",
        type: "discussion",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 60,
        isOnline: true,
        host: {
          id: "3",
          name: "Sam Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        attendees: 18,
        maxAttendees: 25,
        isLive: false,
        tags: ["Books", "Discussion", "Educational"],
        coverImage: "/book-club-meeting.png",
      },
    ])
  }, [])

  const filteredEvents = events.filter((event) => {
    switch (filter) {
      case "live":
        return event.isLive
      case "upcoming":
        return !event.isLive && event.startTime > new Date()
      case "following":
        // In real app, filter by followed hosts
        return event.host.verified
      default:
        return true
    }
  })

  const getEventStatus = (event: LiveEvent) => {
    if (event.isLive) return { text: "LIVE", color: "bg-red-500" }
    if (event.startTime > new Date()) return { text: "UPCOMING", color: "bg-blue-500" }
    return { text: "ENDED", color: "bg-gray-500" }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()

    if (diff < 0) return "Started"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `Starts in ${hours}h ${minutes}m`
    return `Starts in ${minutes}m`
  }

  const joinEvent = (eventId: string) => {
    // Handle joining event
    console.log("Joining event:", eventId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Live Events
          </h1>
          <p className="text-muted-foreground mt-2">Join live streams, meetups, and community events</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All Events" },
          { key: "live", label: "Live Now" },
          { key: "upcoming", label: "Upcoming" },
          { key: "following", label: "Following" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as any)}
          >
            {key === "live" && <Radio className="h-4 w-4 mr-2 text-red-500" />}
            {label}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const status = getEventStatus(event)

          return (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <OptimizedImage
                  src={event.coverImage}
                  alt={event.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />

                <div className="absolute top-3 left-3">
                  <Badge className={`${status.color} text-white`}>{status.text}</Badge>
                </div>

                <div className="absolute top-3 right-3 flex space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {event.type.toUpperCase()}
                  </Badge>
                </div>

                {event.isLive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Button size="lg" className="rounded-full">
                      <Play className="h-6 w-6 mr-2" />
                      Join Live
                    </Button>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTime(event.startTime)} • {event.duration}min
                  </div>

                  {event.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  )}

                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} attending
                    {event.maxAttendees && ` • ${event.maxAttendees} max`}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.host.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{event.host.name}</p>
                      {event.host.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={() => joinEvent(event.id)}
                  disabled={event.maxAttendees ? event.attendees >= event.maxAttendees : false}
                >
                  {event.isLive ? "Join Live" : "Join Event"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Radio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or check back later for new events.</p>
        </div>
      )}
    </div>
  )
}
