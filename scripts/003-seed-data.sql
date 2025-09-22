-- Insert sample profiles (these will be created after users sign up through auth)
-- This is just for reference - actual profiles are created via the trigger

-- Sample interests for the app
INSERT INTO public.profiles (
  id, 
  email, 
  display_name, 
  bio, 
  age, 
  location, 
  gender, 
  orientation, 
  looking_for, 
  interests,
  subscription_tier,
  coins,
  wallet_balance
) VALUES 
-- Sample user 1
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'alex@example.com',
  'Alex',
  'Love hiking, photography, and good coffee. Looking for genuine connections!',
  28,
  'San Francisco, CA',
  'Non-binary',
  'Pansexual',
  ARRAY['Friendship', 'Dating', 'Long-term'],
  ARRAY['Photography', 'Hiking', 'Coffee', 'Art', 'Travel'],
  'PREMIUM_SILVER',
  50,
  25.00
),
-- Sample user 2
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'jordan@example.com',
  'Jordan',
  'Musician and dog lover. Always up for adventures and deep conversations.',
  25,
  'Los Angeles, CA',
  'Genderfluid',
  'Bisexual',
  ARRAY['Dating', 'Long-term'],
  ARRAY['Music', 'Dogs', 'Adventure', 'Books', 'Cooking'],
  'PREMIUM_GOLD',
  100,
  50.00
),
-- Sample user 3
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'sam@example.com',
  'Sam',
  'Tech enthusiast and yoga instructor. Seeking meaningful connections.',
  30,
  'New York, NY',
  'Male',
  'Gay',
  ARRAY['Dating', 'Long-term', 'Friendship'],
  ARRAY['Technology', 'Yoga', 'Meditation', 'Gaming', 'Movies'],
  'STANDARD',
  10,
  0.00
) ON CONFLICT (id) DO NOTHING;

-- Insert sample photos
INSERT INTO public.photos (user_id, url, is_primary, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, '/placeholder.svg?height=400&width=300', true, 0),
('550e8400-e29b-41d4-a716-446655440001'::uuid, '/placeholder.svg?height=400&width=300', false, 1),
('550e8400-e29b-41d4-a716-446655440002'::uuid, '/placeholder.svg?height=400&width=300', true, 0),
('550e8400-e29b-41d4-a716-446655440002'::uuid, '/placeholder.svg?height=400&width=300', false, 1),
('550e8400-e29b-41d4-a716-446655440003'::uuid, '/placeholder.svg?height=400&width=300', true, 0),
('550e8400-e29b-41d4-a716-446655440003'::uuid, '/placeholder.svg?height=400&width=300', false, 1)
ON CONFLICT DO NOTHING;

-- Insert sample likes (this will trigger match creation)
INSERT INTO public.likes (liker_id, liked_id) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid),
('550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid),
('550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid)
ON CONFLICT DO NOTHING;

-- The matches and chats will be created automatically by the triggers
