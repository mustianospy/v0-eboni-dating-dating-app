
-- Seed data for EboniDating
-- This script adds sample data for testing

-- Insert sample users
INSERT INTO "User" (id, name, email, bio, age, location, gender, orientation, "lookingFor", interests, "isVerified", "subscriptionTier", coins, "createdAt", "updatedAt")
VALUES 
  ('user1', 'Alex Johnson', 'alex@example.com', 'Love hiking and photography', 28, 'New York, NY', 'non-binary', 'pansexual', ARRAY['friendship', 'relationship'], ARRAY['hiking', 'photography', 'travel'], true, 'PREMIUM_GOLD', 100, NOW(), NOW()),
  ('user2', 'Sam Rivera', 'sam@example.com', 'Passionate about art and music', 25, 'Los Angeles, CA', 'female', 'lesbian', ARRAY['relationship'], ARRAY['art', 'music', 'reading'], false, 'STANDARD', 50, NOW(), NOW()),
  ('user3', 'Jordan Kim', 'jordan@example.com', 'Tech enthusiast and gamer', 30, 'San Francisco, CA', 'male', 'gay', ARRAY['friendship', 'relationship'], ARRAY['gaming', 'technology', 'cooking'], true, 'PREMIUM_SILVER', 75, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample photos
INSERT INTO "Photo" (id, "userId", url, "isPrimary", "order", "createdAt")
VALUES 
  ('photo1', 'user1', '/placeholder-user.jpg', true, 0, NOW()),
  ('photo2', 'user2', '/placeholder-user.jpg', true, 0, NOW()),
  ('photo3', 'user3', '/placeholder-user.jpg', true, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample likes (to create matches)
INSERT INTO "Like" (id, "senderId", "receiverId", "createdAt")
VALUES 
  ('like1', 'user1', 'user2', NOW()),
  ('like2', 'user2', 'user1', NOW()),
  ('like3', 'user1', 'user3', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample chat
INSERT INTO "Chat" (id, type, "createdAt", "updatedAt")
VALUES 
  ('chat1', 'PRIVATE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample match
INSERT INTO "Match" (id, "user1Id", "user2Id", "chatId", "createdAt")
VALUES 
  ('match1', 'user1', 'user2', 'chat1', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert chat participants
INSERT INTO "ChatParticipant" (id, "chatId", "userId")
VALUES 
  ('participant1', 'chat1', 'user1'),
  ('participant2', 'chat1', 'user2')
ON CONFLICT (id) DO NOTHING;

-- Insert sample messages
INSERT INTO "Message" (id, "chatId", "senderId", "receiverId", content, type, "isRead", "createdAt")
VALUES 
  ('message1', 'chat1', 'user1', 'user2', 'Hey! How are you doing?', 'TEXT', false, NOW()),
  ('message2', 'chat1', 'user2', 'user1', 'Hi! I''m doing great, thanks for asking!', 'TEXT', true, NOW())
ON CONFLICT (id) DO NOTHING;
