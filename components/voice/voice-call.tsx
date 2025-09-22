"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageCircle, MoreVertical } from "lucide-react"

interface VoiceCallProps {
  otherUser: {
    id: string
    name: string
    avatar: string
  }
  isIncoming?: boolean
  onEndCall: () => void
  onAcceptCall?: () => void
  onDeclineCall?: () => void
}

export function VoiceCall({ otherUser, isIncoming = false, onEndCall, onAcceptCall, onDeclineCall }: VoiceCallProps) {
  const [isConnected, setIsConnected] = useState(!isIncoming)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const audioRef = useRef<HTMLAudioElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isConnected && connectionStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected, connectionStatus])

  useEffect(() => {
    if (isConnected) {
      initializeCall()
    }

    return () => {
      cleanup()
    }
  }, [isConnected])

  const initializeCall = async () => {
    try {
      setConnectionStatus("connecting")

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream

      // Simulate connection delay
      setTimeout(() => {
        setConnectionStatus("connected")
      }, 2000)
    } catch (error) {
      console.error("Error initializing call:", error)
      setConnectionStatus("disconnected")
    }
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
  }

  const handleAcceptCall = () => {
    setIsConnected(true)
    onAcceptCall?.()
  }

  const handleDeclineCall = () => {
    onDeclineCall?.()
    onEndCall()
  }

  const handleEndCall = () => {
    cleanup()
    onEndCall()
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    // In a real implementation, this would switch audio output
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusText = () => {
    if (isIncoming && !isConnected) return "Incoming call..."
    if (connectionStatus === "connecting") return "Connecting..."
    if (connectionStatus === "connected") return formatDuration(callDuration)
    return "Call ended"
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-sm mx-4">
        <CardContent className="p-8 text-center">
          {/* Avatar */}
          <div className="mb-6">
            <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-purple-500/20">
              <AvatarImage src={otherUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-semibold mb-1">{otherUser.name}</h2>
            <p className="text-muted-foreground">{getStatusText()}</p>
          </div>

          {/* Connection Status Indicator */}
          {connectionStatus === "connecting" && (
            <div className="mb-6">
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Call Controls */}
          {isIncoming && !isConnected ? (
            // Incoming call controls
            <div className="flex justify-center space-x-6">
              <Button
                size="lg"
                variant="destructive"
                onClick={handleDeclineCall}
                className="w-16 h-16 rounded-full p-0"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>

              <Button
                size="lg"
                onClick={handleAcceptCall}
                className="w-16 h-16 rounded-full p-0 bg-green-500 hover:bg-green-600"
              >
                <Phone className="h-8 w-8" />
              </Button>
            </div>
          ) : (
            // Active call controls
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  size="lg"
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={toggleMute}
                  className="w-12 h-12 rounded-full p-0"
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  size="lg"
                  variant={isSpeakerOn ? "default" : "secondary"}
                  onClick={toggleSpeaker}
                  className="w-12 h-12 rounded-full p-0"
                >
                  {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>

                <Button size="lg" variant="secondary" className="w-12 h-12 rounded-full p-0">
                  <MessageCircle className="h-5 w-5" />
                </Button>

                <Button size="lg" variant="secondary" className="w-12 h-12 rounded-full p-0">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                variant="destructive"
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full p-0 mx-auto"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden audio element for call audio */}
      <audio ref={audioRef} autoPlay />
    </div>
  )
}
