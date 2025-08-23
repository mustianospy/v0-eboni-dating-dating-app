"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize, Minimize } from "lucide-react"

interface User {
  id: string
  name: string | null
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
}

interface VideoCallModalProps {
  otherUser: User | null
  onClose: () => void
}

export function VideoCallModal({ otherUser, onClose }: VideoCallModalProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Simulate connecting
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const endCall = () => {
    onClose()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!otherUser) return null

  const otherUserPhoto = otherUser.photos[0]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`p-0 ${isFullscreen ? "max-w-full h-full" : "max-w-4xl"}`}>
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {/* Remote video/avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isConnected ? (
              <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
            ) : (
              <div className="text-center text-white">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={otherUserPhoto?.url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{otherUser.name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{otherUser.name}</h3>
                <p className="text-white/70">{isConnected ? "Connected" : "Connecting..."}</p>
              </div>
            )}
          </div>

          {/* Local video */}
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
            {!isVideoOff ? (
              <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <VideoOff className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Call duration */}
          {isConnected && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {formatDuration(callDuration)}
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4">
            <Button
              size="lg"
              variant={isMuted ? "destructive" : "secondary"}
              className="rounded-full h-12 w-12 p-0"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button size="lg" variant="destructive" className="rounded-full h-14 w-14 p-0" onClick={endCall}>
              <PhoneOff className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              variant={isVideoOff ? "destructive" : "secondary"}
              className="rounded-full h-12 w-12 p-0"
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            <Button size="lg" variant="secondary" className="rounded-full h-12 w-12 p-0" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
