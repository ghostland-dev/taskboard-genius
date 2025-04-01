
-- Add Stripe fields to the profiles table
ALTER TABLE IF EXISTS public.profiles 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_period_end TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles (subscription_status);
