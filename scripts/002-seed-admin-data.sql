-- Insert admin user
INSERT INTO "User" (id, email, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-user-id',
  'admin@ebonidating.com',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample reports for admin dashboard
INSERT INTO "Report" (id, "reporterId", "reportedUserId", reason, "additionalInfo", status, "createdAt", "updatedAt")
VALUES 
  ('report-1', 'user-1', 'user-2', 'inappropriate', 'Sending inappropriate messages', 'PENDING', NOW() - INTERVAL '1 day', NOW()),
  ('report-2', 'user-3', 'user-4', 'fake', 'Using fake photos', 'RESOLVED', NOW() - INTERVAL '3 days', NOW()),
  ('report-3', 'user-5', 'user-6', 'harassment', 'Continuous harassment after being blocked', 'PENDING', NOW() - INTERVAL '2 hours', NOW());

-- Insert sample transactions for revenue analytics
INSERT INTO "Transaction" (id, "userId", type, amount, "stripePaymentIntentId", status, "createdAt", "updatedAt")
VALUES 
  ('trans-1', 'user-1', 'SUBSCRIPTION', 999, 'pi_test_1', 'COMPLETED', NOW() - INTERVAL '30 days', NOW()),
  ('trans-2', 'user-2', 'COINS', 499, 'pi_test_2', 'COMPLETED', NOW() - INTERVAL '25 days', NOW()),
  ('trans-3', 'user-3', 'SUBSCRIPTION', 1999, 'pi_test_3', 'COMPLETED', NOW() - INTERVAL '20 days', NOW()),
  ('trans-4', 'user-4', 'BOOST', 299, 'pi_test_4', 'COMPLETED', NOW() - INTERVAL '15 days', NOW()),
  ('trans-5', 'user-5', 'SUBSCRIPTION', 2999, 'pi_test_5', 'COMPLETED', NOW() - INTERVAL '10 days', NOW());

-- Update user subscriptions for analytics
UPDATE "User" SET 
  "subscriptionTier" = 'PLUS',
  "subscriptionStatus" = 'ACTIVE',
  "subscriptionEndsAt" = NOW() + INTERVAL '30 days'
WHERE id IN ('user-1', 'user-2');

UPDATE "User" SET 
  "subscriptionTier" = 'PRO',
  "subscriptionStatus" = 'ACTIVE',
  "subscriptionEndsAt" = NOW() + INTERVAL '30 days'
WHERE id IN ('user-3', 'user-4');

UPDATE "User" SET 
  "subscriptionTier" = 'ULTRA',
  "subscriptionStatus" = 'ACTIVE',
  "subscriptionEndsAt" = NOW() + INTERVAL '30 days'
WHERE id = 'user-5';
