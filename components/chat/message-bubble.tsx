"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface Message {
  id: string
  content: string
  type: string
  createdAt: Date
  sender: User
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const senderPhoto = message.sender.photos[0]

  return (
    <div className={`flex items-end space-x-2 ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderPhoto?.url || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">{message.sender.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
      )}

      {!showAvatar && !isOwn && <div className="w-8" />}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? "ml-auto" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {message.type === "TEXT" && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

          {message.type === "IMAGE" && (
            <div className="space-y-2">
              <img
                src={message.content || "/placeholder.svg"}
                alt="Shared image"
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {message.type === "GIFT" && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎁</span>
              <span className="text-sm">Sent a gift</span>
            </div>
          )}
        </div>

        <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : ""}`}>
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
