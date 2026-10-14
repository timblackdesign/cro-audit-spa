-- Add subscription tracking columns to profiles.
-- Run this in the Supabase SQL editor before deploying the updated ls-hook.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_id     text,
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS renews_at           timestamptz;

-- Fast lookup for webhook event handlers (cancelled, expired, payment_success all query by subscription_id)
CREATE INDEX IF NOT EXISTS profiles_subscription_id_idx ON profiles (subscription_id);
