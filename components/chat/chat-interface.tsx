"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Phone, Video, MoreVertical, ImageIcon, Smile, Gift } from "lucide-react"
import Link from "next/link"
import { MessageBubble } from "./message-bubble"
import { VideoCallModal } from "./video-call-modal"

interface User {
  id: string
  name: string | null
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
  subscriptionTier?: string; // Assuming subscriptionTier is added to the User interface
}

interface Message {
  id: string
  content: string
  type: string
  createdAt: Date
  sender: User
}

interface Chat {
  id: string
  type: string
  name: string | null
  messages: Message[]
}

interface ChatInterfaceProps {
  chat: Chat
  currentUser: User
  otherParticipant: User | null
}

export function ChatInterface({ chat, currentUser, otherParticipant }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(chat.messages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      type: "TEXT",
      createdAt: new Date(),
      sender: currentUser,
    }

    setMessages([...messages, tempMessage])
    setNewMessage("")

    try {
      const response = await fetch("/api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chat.id,
          content: newMessage,
          type: "TEXT",
        }),
      })

      if (response.ok) {
        const sentMessage = await response.json()
        setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg)))
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const chatTitle = chat.type === "PRIVATE" ? otherParticipant?.name : chat.name
  const chatAvatar = chat.type === "PRIVATE" ? otherParticipant?.photos[0]?.url : null

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/matches">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <Avatar className="h-10 w-10">
              <AvatarImage src={chatAvatar || "/placeholder.svg"} />
              <AvatarFallback>{chatTitle?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold">{chatTitle}</h2>
              {isTyping && <p className="text-xs text-muted-foreground">Typing...</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {
                if (currentUser.subscriptionTier === "FREE") {
                  window.location.href = '/subscription'
                } else {
                  setShowVideoCall(true)
                }
              }}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender.id === currentUser.id}
              showAvatar={index === 0 || messages[index - 1].sender.id !== message.sender.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Gift className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Call Modal */}
      {showVideoCall && <VideoCallModal otherUser={otherParticipant} onClose={() => setShowVideoCall(false)} />}
    </div>
  )
}