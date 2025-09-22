-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  age INTEGER,
  location TEXT,
  gender TEXT,
  orientation TEXT,
  looking_for TEXT[],
  interests TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'STANDARD' CHECK (subscription_tier IN ('STANDARD', 'PREMIUM_SILVER', 'PREMIUM_GOLD')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  coins INTEGER DEFAULT 0,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  has_ever_paid BOOLEAN DEFAULT FALSE,
  travel_mode_location TEXT,
  travel_mode_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user1_id, user2_id)
);

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  liker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_super_like BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'gift', 'audio')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('top_up', 'purchase', 'refund', 'boost', 'gift', 'gallery_unlock')),
  description TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- Create gallery_unlocks table
CREATE TABLE IF NOT EXISTS public.gallery_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unlocked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, unlocked_user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_unlocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for photos
CREATE POLICY "Users can view all public photos" ON public.photos FOR SELECT USING (NOT is_private OR user_id = auth.uid());
CREATE POLICY "Users can manage their own photos" ON public.photos FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for matches
CREATE POLICY "Users can view their own matches" ON public.matches FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can create matches" ON public.matches FOR INSERT WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Create RLS policies for likes
CREATE POLICY "Users can view likes involving them" ON public.likes FOR SELECT USING (liker_id = auth.uid() OR liked_id = auth.uid());
CREATE POLICY "Users can create their own likes" ON public.likes FOR INSERT WITH CHECK (liker_id = auth.uid());

-- Create RLS policies for chats
CREATE POLICY "Users can view their own chats" ON public.chats FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = chats.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their chats" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chats 
    JOIN public.matches ON chats.match_id = matches.id
    WHERE chats.id = messages.chat_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages in their chats" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create RLS policies for wallet transactions
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for reports
CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING (reporter_id = auth.uid());
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- Create RLS policies for blocked users
CREATE POLICY "Users can view their own blocks" ON public.blocked_users FOR SELECT USING (blocker_id = auth.uid());
CREATE POLICY "Users can manage their own blocks" ON public.blocked_users FOR ALL USING (blocker_id = auth.uid());

-- Create RLS policies for gallery unlocks
CREATE POLICY "Users can view their own unlocks" ON public.gallery_unlocks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create unlocks" ON public.gallery_unlocks FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_likes_users ON public.likes(liker_id, liked_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
