"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Users, Video } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  name: string | null
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
}

interface Match {
  id: string
  createdAt: Date
  user1: User
  user2: User
  chat: {
    id: string
    messages: Array<{
      id: string
      content: string
      createdAt: Date
    }>
  }
}

interface Like {
  id: string
  createdAt: Date
  sender: User
}

interface MatchesContentProps {
  currentUser: { id: string; name: string | null }
  matches: Match[]
  recentLikes: Like[]
}

export function MatchesContent({ currentUser, matches, recentLikes }: MatchesContentProps) {
  const [activeTab, setActiveTab] = useState("matches")

  const getMatchedUser = (match: Match) => {
    return match.user1.id === currentUser.id ? match.user2 : match.user1
  }

  const getLastMessage = (match: Match) => {
    return match.chat.messages[0]
  }

  const handleLikeBack = async (userId: string) => {
    try {
      await fetch("/api/user/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      })
      // Refresh the page or update state
      window.location.reload()
    } catch (error) {
      console.error("Error liking back:", error)
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
              <Link href="/discover">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-8">Your Connections</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="matches" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Matches ({matches.length})</span>
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Likes ({recentLikes.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches">
              {matches.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start swiping to find your perfect match and begin conversations!
                    </p>
                    <Link href="/discover">
                      <Button>Start Discovering</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {matches.map((match) => {
                    const matchedUser = getMatchedUser(match)
                    const lastMessage = getLastMessage(match)
                    const primaryPhoto = matchedUser.photos[0]

                    return (
                      <Card key={match.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={primaryPhoto?.url || "/placeholder.svg"} />
                              <AvatarFallback>{matchedUser.name?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">{matchedUser.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Match
                                </Badge>
                              </div>

                              {lastMessage ? (
                                <div>
                                  <p className="text-sm text-muted-foreground truncate">{lastMessage.content}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Matched {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                                </p>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <Link href={`/chat/${match.chat.id}`}>
                                <Button size="sm">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Chat
                                </Button>
                              </Link>
                              <Button size="sm" variant="outline">
                                <Video className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="likes">
              {recentLikes.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No likes yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Keep swiping and updating your profile to get more likes!
                    </p>
                    <Link href="/discover">
                      <Button>Continue Swiping</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recentLikes.map((like) => {
                    const primaryPhoto = like.sender.photos[0]

                    return (
                      <Card key={like.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative aspect-[3/4]">
                          <img
                            src={primaryPhoto?.url || "/placeholder.svg?height=300&width=225&query=profile photo"}
                            alt={`${like.sender.name}'s photo`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Heart className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold truncate">{like.sender.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(like.createdAt), { addSuffix: true })}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" className="flex-1 text-xs" onClick={() => handleLikeBack(like.sender.id)}>
                              Like Back
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                              Pass
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
