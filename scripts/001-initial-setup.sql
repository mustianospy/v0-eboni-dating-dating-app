-- Initial database setup for EboniDating
-- This script creates the initial database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('FREE', 'PLUS', 'PRO', 'ULTRA');
CREATE TYPE chat_type AS ENUM ('PRIVATE', 'GROUP');
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'GIFT');
CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');
CREATE TYPE transaction_type AS ENUM ('SUBSCRIPTION', 'COINS', 'BOOST', 'GIFT', 'GALLERY_UNLOCK');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE boost_type AS ENUM ('PROFILE_BOOST', 'SUPER_LIKE', 'TRAVEL_MODE');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_users_location ON "User"(location);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON "User"("subscriptionTier");
CREATE INDEX IF NOT EXISTS idx_likes_sender_receiver ON "Like"("senderId", "receiverId");
CREATE INDEX IF NOT EXISTS idx_matches_users ON "Match"("user1Id", "user2Id");
CREATE INDEX IF NOT EXISTS idx_messages_chat ON "Message"("chatId");
CREATE INDEX IF NOT EXISTS idx_messages_created ON "Message"("createdAt");
