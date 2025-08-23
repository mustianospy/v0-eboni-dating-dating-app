import { PrismaClient, SubscriptionTier } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alex@example.com",
        name: "Alex Rivera",
        bio: "Love hiking, coffee, and good conversations. Looking for someone genuine.",
        age: 28,
        location: "San Francisco, CA",
        gender: "Non-binary",
        orientation: "Pansexual",
        lookingFor: ["Relationship", "Friends"],
        interests: ["Hiking", "Coffee", "Art", "Music"],
        subscriptionTier: SubscriptionTier.PLUS,
        coins: 50,
      },
    }),
    prisma.user.create({
      data: {
        email: "jordan@example.com",
        name: "Jordan Smith",
        bio: "Photographer and dog lover. Always up for an adventure!",
        age: 32,
        location: "New York, NY",
        gender: "Male",
        orientation: "Gay",
        lookingFor: ["Relationship"],
        interests: ["Photography", "Dogs", "Travel", "Food"],
        subscriptionTier: SubscriptionTier.PRO,
        coins: 100,
      },
    }),
    prisma.user.create({
      data: {
        email: "sam@example.com",
        name: "Sam Johnson",
        bio: "Bookworm and yoga enthusiast. Seeking meaningful connections.",
        age: 26,
        location: "Austin, TX",
        gender: "Female",
        orientation: "Lesbian",
        lookingFor: ["Relationship", "Friends"],
        interests: ["Reading", "Yoga", "Cooking", "Movies"],
        subscriptionTier: SubscriptionTier.FREE,
        coins: 10,
      },
    }),
  ])

  // Create sample photos
  await Promise.all([
    prisma.photo.create({
      data: {
        userId: users[0].id,
        url: "/outdoor-hiker.png",
        isPrimary: true,
        order: 0,
      },
    }),
    prisma.photo.create({
      data: {
        userId: users[1].id,
        url: "/photographer-with-camera.png",
        isPrimary: true,
        order: 0,
      },
    }),
    prisma.photo.create({
      data: {
        userId: users[2].id,
        url: "/person-reading.png",
        isPrimary: true,
        order: 0,
      },
    }),
  ])

  // Create sample likes and matches
  const like1 = await prisma.like.create({
    data: {
      senderId: users[0].id,
      receiverId: users[1].id,
    },
  })

  const like2 = await prisma.like.create({
    data: {
      senderId: users[1].id,
      receiverId: users[0].id,
    },
  })

  // Create a match when both users like each other
  const chat = await prisma.chat.create({
    data: {
      type: "PRIVATE",
    },
  })

  await prisma.match.create({
    data: {
      user1Id: users[0].id,
      user2Id: users[1].id,
      chatId: chat.id,
    },
  })

  // Add chat participants
  await Promise.all([
    prisma.chatParticipant.create({
      data: {
        chatId: chat.id,
        userId: users[0].id,
      },
    }),
    prisma.chatParticipant.create({
      data: {
        chatId: chat.id,
        userId: users[1].id,
      },
    }),
  ])

  // Create sample messages
  await Promise.all([
    prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: users[0].id,
        receiverId: users[1].id,
        content: "Hey! I love your photography work!",
        type: "TEXT",
      },
    }),
    prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: users[1].id,
        receiverId: users[0].id,
        content: "Thank you! I saw you love hiking - we should explore some trails together!",
        type: "TEXT",
      },
    }),
  ])

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
