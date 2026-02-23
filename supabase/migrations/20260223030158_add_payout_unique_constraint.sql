/*
  # Add unique constraint for payout upserts

  1. Modified Tables
    - `payouts`: Add unique constraint on (creator_id, report_month) for upsert support
    - `monthly_analytics`: Add unique constraint on (creator_id, report_month) for upsert support

  2. Important Notes
    - These constraints enable ON CONFLICT upsert operations from the admin CSV import and payout recalculation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payouts_creator_month_unique'
  ) THEN
    ALTER TABLE payouts ADD CONSTRAINT payouts_creator_month_unique UNIQUE (creator_id, report_month);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monthly_analytics_creator_month_unique'
  ) THEN
    ALTER TABLE monthly_analytics ADD CONSTRAINT monthly_analytics_creator_month_unique UNIQUE (creator_id, report_month);
  END IF;
END $$;
