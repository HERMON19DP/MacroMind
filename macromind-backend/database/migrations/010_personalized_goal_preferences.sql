
-- Add preferences for personalized calorie and macro calculations.
-- Preserve existing user data and current goal values.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS activity_level VARCHAR(30)
    NOT NULL DEFAULT 'lightly_active',
  ADD COLUMN IF NOT EXISTS goal_rate_kg_week DECIMAL(4,2),
  ADD COLUMN IF NOT EXISTS target_date DATE;

ALTER TABLE pending_signups
  ADD COLUMN IF NOT EXISTS target_weight_kg DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS activity_level VARCHAR(30)
    NOT NULL DEFAULT 'lightly_active',
  ADD COLUMN IF NOT EXISTS goal_rate_kg_week DECIMAL(4,2),
  ADD COLUMN IF NOT EXISTS target_date DATE;
