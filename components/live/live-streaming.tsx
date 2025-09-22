"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, VideoOff, Mic, MicOff, Users, Heart, Gift, MessageCircle, Share, Settings, X } from "lucide-react"

interface LiveStreamProps {
  streamId: string
  isStreamer: boolean
  streamerInfo: {
    id: string
    name: string
    avatar: string
    followers: number
  }
  onEndStream?: () => void
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  type: "message" | "gift" | "join" | "like"
}

export function LiveStreaming({ streamId, isStreamer, streamerInfo, onEndStream }: LiveStreamProps) {
  const [isLive, setIsLive] = useState(false)
  const [viewers, setViewers] = useState(0)
  const [likes, setLikes] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isStreamer && isLive) {
      startStream()
    }

    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewers((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 5000)

    return () => {
      clearInterval(interval)
      stopStream()
    }
  }, [isLive, isStreamer])

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setViewers(Math.floor(Math.random() * 50) + 10)

      // Add welcome message
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          user: "System",
          message: `${streamerInfo.name} is now live!`,
          timestamp: new Date(),
          type: "join",
        },
      ])
    } catch (error) {
      console.error("Error starting stream:", error)
    }
  }

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const toggleStream = () => {
    if (isLive) {
      setIsLive(false)
      stopStream()
      onEndStream?.()
    } else {
      setIsLive(true)
    }
  }

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: newMessage,
      timestamp: new Date(),
      type: "message",
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const sendLike = () => {
    setLikes((prev) => prev + 1)

    const likeMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: "liked the stream",
      timestamp: new Date(),
      type: "like",
    }

    setChatMessages((prev) => [...prev, likeMessage])
  }

  const sendGift = () => {
    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: "sent a gift!",
      timestamp: new Date(),
      type: "gift",
    }

    setChatMessages((prev) => [...prev, giftMessage])
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm text-white">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-red-500">
            <AvatarImage src={streamerInfo.avatar || "/placeholder.svg"} />
            <AvatarFallback>{streamerInfo.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{streamerInfo.name}</h2>
            <div className="flex items-center space-x-4 text-sm">
              {isLive && <Badge className="bg-red-500 animate-pulse">LIVE</Badge>}
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {viewers}
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-red-500" />
                {likes}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          {isStreamer && (
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            muted={isStreamer}
            className="w-full h-full object-cover"
            poster="/live-stream-placeholder.jpg"
          />

          {!isLive && !isStreamer && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Stream not available</p>
              </div>
            </div>
          )}

          {/* Stream Controls (for streamers) */}
          {isStreamer && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                <Button
                  size="sm"
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={toggleMute}
                  className="rounded-full"
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                  size="sm"
                  variant={isVideoOff ? "destructive" : "secondary"}
                  onClick={toggleVideo}
                  className="rounded-full"
                >
                  {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </Button>

                <Button
                  onClick={toggleStream}
                  className={`rounded-full ${isLive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {isLive ? "End Stream" : "Go Live"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-card border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Live Chat</h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  {msg.type === "join" && <div className="text-center text-muted-foreground italic">{msg.message}</div>}

                  {msg.type === "message" && (
                    <div>
                      <span className="font-medium text-purple-600">{msg.user}:</span>
                      <span className="ml-2">{msg.message}</span>
                    </div>
                  )}

                  {msg.type === "like" && (
                    <div className="flex items-center text-red-500">
                      <Heart className="h-4 w-4 mr-1 fill-current" />
                      <span className="font-medium">{msg.user}</span>
                      <span className="ml-1">{msg.message}</span>
                    </div>
                  )}

                  {msg.type === "gift" && (
                    <div className="flex items-center text-yellow-500">
                      <Gift className="h-4 w-4 mr-1" />
                      <span className="font-medium">{msg.user}</span>
                      <span className="ml-1">{msg.message}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2 mb-3">
              <Button size="sm" onClick={sendLike} className="flex-1">
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button size="sm" onClick={sendGift} className="flex-1">
                <Gift className="h-4 w-4 mr-1" />
                Gift
              </Button>
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Say something..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button size="sm" onClick={sendMessage}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
