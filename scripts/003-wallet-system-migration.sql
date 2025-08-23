-- Add wallet system columns to users table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "walletBalance" DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "hasEverPaid" BOOLEAN DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tierBenefitsUsed" JSONB DEFAULT '{}';

-- Update subscription tier enum to include new tiers
ALTER TYPE "SubscriptionTier" ADD VALUE IF NOT EXISTS 'STANDARD';
ALTER TYPE "SubscriptionTier" ADD VALUE IF NOT EXISTS 'PREMIUM_SILVER';
ALTER TYPE "SubscriptionTier" ADD VALUE IF NOT EXISTS 'PREMIUM_GOLD';

-- Create wallet transaction type enum
DO $$ BEGIN
    CREATE TYPE "WalletTransactionType" AS ENUM ('TOP_UP', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'BONUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new transaction types
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'WALLET_TOP_UP';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'TIER_UPGRADE';

-- Create wallet transactions table
CREATE TABLE IF NOT EXISTS "WalletTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "stripeId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update existing users to STANDARD tier if they are currently FREE
UPDATE "User" SET "subscriptionTier" = 'STANDARD' WHERE "subscriptionTier" = 'FREE';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "WalletTransaction_userId_idx" ON "WalletTransaction"("userId");
CREATE INDEX IF NOT EXISTS "WalletTransaction_createdAt_idx" ON "WalletTransaction"("createdAt");
CREATE INDEX IF NOT EXISTS "User_subscriptionTier_idx" ON "User"("subscriptionTier");
CREATE INDEX IF NOT EXISTS "User_hasEverPaid_idx" ON "User"("hasEverPaid");
