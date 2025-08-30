
-- Initial database setup for EboniDating
-- This script creates the initial database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('STANDARD', 'PREMIUM_SILVER', 'PREMIUM_GOLD', 'FREE', 'PLUS', 'PRO', 'ULTRA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE chat_type AS ENUM ('PRIVATE', 'GROUP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'GIFT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('SUBSCRIPTION', 'COINS', 'BOOST', 'GIFT', 'GALLERY_UNLOCK', 'WALLET_TOP_UP', 'TIER_UPGRADE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE boost_type AS ENUM ('PROFILE_BOOST', 'SUPER_LIKE', 'TRAVEL_MODE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE wallet_transaction_type AS ENUM ('TOP_UP', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'BONUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_users_location ON "User"(location);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON "User"("subscriptionTier");
CREATE INDEX IF NOT EXISTS idx_users_online ON "User"("isOnline");
CREATE INDEX IF NOT EXISTS idx_users_verified ON "User"("isVerified");
CREATE INDEX IF NOT EXISTS idx_users_age ON "User"(age);
CREATE INDEX IF NOT EXISTS idx_users_gender ON "User"(gender);
CREATE INDEX IF NOT EXISTS idx_users_orientation ON "User"(orientation);

CREATE INDEX IF NOT EXISTS idx_likes_sender_receiver ON "Like"("senderId", "receiverId");
CREATE INDEX IF NOT EXISTS idx_likes_created ON "Like"("createdAt");

CREATE INDEX IF NOT EXISTS idx_matches_users ON "Match"("user1Id", "user2Id");
CREATE INDEX IF NOT EXISTS idx_matches_created ON "Match"("createdAt");

CREATE INDEX IF NOT EXISTS idx_messages_chat ON "Message"("chatId");
CREATE INDEX IF NOT EXISTS idx_messages_created ON "Message"("createdAt");
CREATE INDEX IF NOT EXISTS idx_messages_sender ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS idx_messages_read ON "Message"("isRead");

CREATE INDEX IF NOT EXISTS idx_photos_user ON "Photo"("userId");
CREATE INDEX IF NOT EXISTS idx_photos_primary ON "Photo"("isPrimary");

CREATE INDEX IF NOT EXISTS idx_private_photos_user ON "PrivatePhoto"("userId");

CREATE INDEX IF NOT EXISTS idx_reports_status ON "Report"(status);
CREATE INDEX IF NOT EXISTS idx_reports_created ON "Report"("createdAt");

CREATE INDEX IF NOT EXISTS idx_blocks_blocker_blocked ON "Block"("blockerId", "blockedId");

CREATE INDEX IF NOT EXISTS idx_transactions_user ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_status ON "Transaction"(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON "Transaction"("createdAt");

CREATE INDEX IF NOT EXISTS idx_boosts_user ON "Boost"("userId");
CREATE INDEX IF NOT EXISTS idx_boosts_expires ON "Boost"("expiresAt");

CREATE INDEX IF NOT EXISTS idx_gifts_sender_receiver ON "Gift"("senderId", "receiverId");
CREATE INDEX IF NOT EXISTS idx_gifts_created ON "Gift"("createdAt");

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
    CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_chat_updated_at ON "Chat";
    CREATE TRIGGER update_chat_updated_at BEFORE UPDATE ON "Chat" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_report_updated_at ON "Report";
    CREATE TRIGGER update_report_updated_at BEFORE UPDATE ON "Report" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_transaction_updated_at ON "Transaction";
    CREATE TRIGGER update_transaction_updated_at BEFORE UPDATE ON "Transaction" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_wallet_transaction_updated_at ON "WalletTransaction";
    CREATE TRIGGER update_wallet_transaction_updated_at BEFORE UPDATE ON "WalletTransaction" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;
