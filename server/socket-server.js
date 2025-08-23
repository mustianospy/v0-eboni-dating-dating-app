const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)

app.use(cors())

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Store active users and their socket connections
const activeUsers = new Map()
const chatRooms = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Handle user authentication
  socket.on("authenticate", (userId) => {
    activeUsers.set(userId, socket.id)
    socket.userId = userId
    console.log(`User ${userId} authenticated`)
  })

  // Handle joining chat rooms
  socket.on("join-chat", (chatId) => {
    socket.join(chatId)

    if (!chatRooms.has(chatId)) {
      chatRooms.set(chatId, new Set())
    }
    chatRooms.get(chatId).add(socket.userId)

    console.log(`User ${socket.userId} joined chat ${chatId}`)
  })

  // Handle leaving chat rooms
  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId)

    if (chatRooms.has(chatId)) {
      chatRooms.get(chatId).delete(socket.userId)
    }

    console.log(`User ${socket.userId} left chat ${chatId}`)
  })

  // Handle sending messages
  socket.on("send-message", ({ chatId, message }) => {
    // Broadcast message to all users in the chat room
    socket.to(chatId).emit("new-message", message)
    console.log(`Message sent to chat ${chatId}:`, message.content)
  })

  // Handle typing indicators
  socket.on("typing", ({ chatId, isTyping }) => {
    socket.to(chatId).emit("user-typing", {
      userId: socket.userId,
      isTyping,
    })
  })

  // Handle video call signaling
  socket.on("call-user", ({ targetUserId, offer }) => {
    const targetSocketId = activeUsers.get(targetUserId)
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", {
        from: socket.userId,
        offer,
      })
    }
  })

  socket.on("answer-call", ({ targetUserId, answer }) => {
    const targetSocketId = activeUsers.get(targetUserId)
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-answered", {
        from: socket.userId,
        answer,
      })
    }
  })

  socket.on("ice-candidate", ({ targetUserId, candidate }) => {
    const targetSocketId = activeUsers.get(targetUserId)
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", {
        from: socket.userId,
        candidate,
      })
    }
  })

  socket.on("end-call", ({ targetUserId }) => {
    const targetSocketId = activeUsers.get(targetUserId)
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-ended", {
        from: socket.userId,
      })
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId)

      // Remove user from all chat rooms
      chatRooms.forEach((users, chatId) => {
        users.delete(socket.userId)
      })
    }

    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket server running on port ${PORT}`)
})