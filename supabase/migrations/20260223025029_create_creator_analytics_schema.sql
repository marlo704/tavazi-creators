/*
  # Create Creator Analytics Schema

  1. New Tables
    - `creators`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `avatar_initials` (text)
      - `revenue_share` (numeric, default 0.65)
      - `role` (text, default 'creator')
      - `created_at` (timestamptz)
    - `titles`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creators)
      - `title` (text)
      - `category` (text, e.g. Drama, Documentary)
      - `type` (text: movie, series, documentary, event, short_film)
      - `status` (text: published, draft, processing)
      - `monetisation` (text: svod, ppv)
      - `thumbnail_url` (text)
      - `total_streams` (integer)
      - `unique_viewers` (integer)
      - `watch_hours` (numeric)
      - `avg_completion` (numeric)
      - `gross_revenue` (numeric)
      - `created_at` (timestamptz)
    - `monthly_analytics`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creators)
      - `report_month` (text, YYYY-MM format)
      - `total_streams` (integer)
      - `unique_viewers` (integer)
      - `watch_hours` (numeric)
      - `avg_completion` (numeric)
      - `gross_revenue` (numeric)
      - `platform_fee` (numeric)
      - `creator_payout` (numeric)
      - `created_at` (timestamptz)
    - `svod_revenue_pool`
      - `id` (uuid, primary key)
      - `report_month` (text, YYYY-MM format)
      - `total_pool` (numeric)
      - `platform_total_streams` (integer)
      - `created_at` (timestamptz)
    - `ppv_transactions`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creators)
      - `title_id` (uuid, references titles)
      - `report_month` (text, YYYY-MM format)
      - `units_sold` (integer)
      - `price_kes` (numeric)
      - `gross` (numeric)
      - `created_at` (timestamptz)
    - `payouts`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creators)
      - `report_month` (text, YYYY-MM format)
      - `gross_svod` (numeric)
      - `gross_ppv` (numeric)
      - `platform_fee` (numeric)
      - `net_payout` (numeric)
      - `status` (text: pending, paid)
      - `reference` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Creators can read their own data
    - Admins can read all data
*/

CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  avatar_initials text NOT NULL DEFAULT '',
  revenue_share numeric NOT NULL DEFAULT 0.65,
  role text NOT NULL DEFAULT 'creator',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can read own profile"
  ON creators FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all creators"
  ON creators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) NOT NULL,
  title text NOT NULL,
  category text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'movie',
  status text NOT NULL DEFAULT 'draft',
  monetisation text NOT NULL DEFAULT 'svod',
  thumbnail_url text NOT NULL DEFAULT '',
  total_streams integer NOT NULL DEFAULT 0,
  unique_viewers integer NOT NULL DEFAULT 0,
  watch_hours numeric NOT NULL DEFAULT 0,
  avg_completion numeric NOT NULL DEFAULT 0,
  gross_revenue numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can read own titles"
  ON titles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = titles.creator_id AND creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all titles"
  ON titles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS monthly_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) NOT NULL,
  report_month text NOT NULL,
  total_streams integer NOT NULL DEFAULT 0,
  unique_viewers integer NOT NULL DEFAULT 0,
  watch_hours numeric NOT NULL DEFAULT 0,
  avg_completion numeric NOT NULL DEFAULT 0,
  gross_revenue numeric NOT NULL DEFAULT 0,
  platform_fee numeric NOT NULL DEFAULT 0,
  creator_payout numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE monthly_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can read own analytics"
  ON monthly_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = monthly_analytics.creator_id AND creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all analytics"
  ON monthly_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS svod_revenue_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_month text NOT NULL UNIQUE,
  total_pool numeric NOT NULL DEFAULT 0,
  platform_total_streams integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE svod_revenue_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read svod pool"
  ON svod_revenue_pool FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS ppv_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) NOT NULL,
  title_id uuid REFERENCES titles(id) NOT NULL,
  report_month text NOT NULL,
  units_sold integer NOT NULL DEFAULT 0,
  price_kes numeric NOT NULL DEFAULT 0,
  gross numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ppv_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can read own ppv transactions"
  ON ppv_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = ppv_transactions.creator_id AND creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all ppv transactions"
  ON ppv_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) NOT NULL,
  report_month text NOT NULL,
  gross_svod numeric NOT NULL DEFAULT 0,
  gross_ppv numeric NOT NULL DEFAULT 0,
  platform_fee numeric NOT NULL DEFAULT 0,
  net_payout numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  reference text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can read own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = payouts.creator_id AND creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_titles_creator_id ON titles(creator_id);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_creator_month ON monthly_analytics(creator_id, report_month);
CREATE INDEX IF NOT EXISTS idx_ppv_transactions_creator_month ON ppv_transactions(creator_id, report_month);
CREATE INDEX IF NOT EXISTS idx_payouts_creator_month ON payouts(creator_id, report_month);
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON creators(user_id);
