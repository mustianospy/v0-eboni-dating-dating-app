"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Plus, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  category: string
  attendeeCount: number
  maxAttendees: number
  organizer: {
    id: string
    name: string
    avatar: string
  }
  isAttending: boolean
}

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    // Mock events data
    setEvents([
      {
        id: "1",
        title: "Pride Month Celebration",
        description: "Join us for a vibrant celebration of Pride Month with music, food, and community!",
        date: new Date("2024-06-15T18:00:00"),
        location: "Central Park, NYC",
        category: "Social",
        attendeeCount: 45,
        maxAttendees: 100,
        organizer: {
          id: "1",
          name: "Alex Rivera",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        isAttending: false,
      },
      {
        id: "2",
        title: "LGBTQ+ Book Club",
        description: "Monthly book discussion focusing on queer literature and authors.",
        date: new Date("2024-06-20T19:00:00"),
        location: "Rainbow Bookstore, SF",
        category: "Educational",
        attendeeCount: 12,
        maxAttendees: 20,
        organizer: {
          id: "2",
          name: "Jordan Kim",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        isAttending: true,
      },
      {
        id: "3",
        title: "Drag Bingo Night",
        description: "Fun-filled evening of bingo with fabulous drag performances!",
        date: new Date("2024-06-22T20:00:00"),
        location: "The Rainbow Lounge, LA",
        category: "Entertainment",
        attendeeCount: 78,
        maxAttendees: 80,
        organizer: {
          id: "3",
          name: "Sam Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        isAttending: false,
      },
    ])
  }, [])

  const filteredEvents = events.filter(
    (event) =>
      filter === "all" || event.category.toLowerCase() === filter || (filter === "attending" && event.isAttending),
  )

  const toggleAttendance = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isAttending: !event.isAttending,
              attendeeCount: event.isAttending ? event.attendeeCount - 1 : event.attendeeCount + 1,
            }
          : event,
      ),
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community Events
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect with the LGBTQ+ community through local events and meetups
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="Enter event title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your event" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Event location" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" type="datetime-local" />
              </div>
            </div>
            <Button onClick={() => setShowCreateDialog(false)}>Create Event</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {["all", "social", "educational", "entertainment", "attending"].map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption)}
            className="capitalize"
          >
            {filterOption === "all" && <Filter className="h-4 w-4 mr-2" />}
            {filterOption}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2">
                  {event.category}
                </Badge>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendeeCount}/{event.maxAttendees}
                  </div>
                </div>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date.toLocaleDateString()} at{" "}
                  {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{event.organizer.name}</span>
                </div>

                <Button
                  size="sm"
                  variant={event.isAttending ? "default" : "outline"}
                  onClick={() => toggleAttendance(event.id)}
                  disabled={!event.isAttending && event.attendeeCount >= event.maxAttendees}
                >
                  {event.isAttending ? "Attending" : "Join"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}
