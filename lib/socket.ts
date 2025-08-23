import { io, type Socket } from "socket.io-client"

class SocketService {
  private socket: Socket | null = null

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        auth: {
          userId,
        },
      })

      this.socket.on("connect", () => {
        console.log("Connected to socket server")
      })

      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket server")
      })
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit("join-chat", chatId)
    }
  }

  leaveChat(chatId: string) {
    if (this.socket) {
      this.socket.emit("leave-chat", chatId)
    }
  }

  sendMessage(chatId: string, message: any) {
    if (this.socket) {
      this.socket.emit("send-message", { chatId, message })
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("new-message", callback)
    }
  }

  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on("user-typing", callback)
    }
  }

  sendTyping(chatId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit("typing", { chatId, isTyping })
    }
  }
}

export const socketService = new SocketService()
