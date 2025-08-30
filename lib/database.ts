
import { prisma } from "./prisma"

export async function initializeDatabase() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connected successfully")
    
    // Run basic health check
    const userCount = await prisma.user.count()
    console.log(`📊 Database has ${userCount} users`)
    
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      console.log("📊 Database already has data, skipping seed")
      return
    }

    // Create sample users
    const sampleUsers = [
      {
        id: "user1",
        name: "Alex Johnson",
        email: "alex@example.com",
        bio: "Love hiking and photography",
        age: 28,
        location: "New York, NY",
        gender: "non-binary",
        orientation: "pansexual",
        lookingFor: ["friendship", "relationship"],
        interests: ["hiking", "photography", "travel"],
        isVerified: true,
        subscriptionTier: "PREMIUM_GOLD" as const,
        coins: 100,
      },
      {
        id: "user2",
        name: "Sam Rivera",
        email: "sam@example.com",
        bio: "Passionate about art and music",
        age: 25,
        location: "Los Angeles, CA",
        gender: "female",
        orientation: "lesbian",
        lookingFor: ["relationship"],
        interests: ["art", "music", "reading"],
        isVerified: false,
        subscriptionTier: "STANDARD" as const,
        coins: 50,
      },
      {
        id: "user3",
        name: "Jordan Kim",
        email: "jordan@example.com",
        bio: "Tech enthusiast and gamer",
        age: 30,
        location: "San Francisco, CA",
        gender: "male",
        orientation: "gay",
        lookingFor: ["friendship", "relationship"],
        interests: ["gaming", "technology", "cooking"],
        isVerified: true,
        subscriptionTier: "PREMIUM_SILVER" as const,
        coins: 75,
      },
    ]

    // Create users
    for (const userData of sampleUsers) {
      await prisma.user.create({
        data: userData,
      })
    }

    console.log("✅ Database seeded successfully")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
  }
}

export async function clearDatabase() {
  try {
    // Delete in correct order to avoid foreign key constraints
    await prisma.message.deleteMany()
    await prisma.chatParticipant.deleteMany()
    await prisma.match.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.like.deleteMany()
    await prisma.photo.deleteMany()
    await prisma.privatePhoto.deleteMany()
    await prisma.report.deleteMany()
    await prisma.block.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.boost.deleteMany()
    await prisma.gift.deleteMany()
    await prisma.galleryUnlock.deleteMany()
    await prisma.walletTransaction.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()

    console.log("✅ Database cleared successfully")
  } catch (error) {
    console.error("❌ Database clearing failed:", error)
  }
}
