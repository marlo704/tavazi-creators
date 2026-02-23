/*
  # Add admin write RLS policies

  1. Modified Tables
    - `creators`: Add INSERT, UPDATE policies for admins
    - `monthly_analytics`: Add INSERT, UPDATE policies for admins
    - `svod_revenue_pool`: Add INSERT, UPDATE policies for admins
    - `payouts`: Add INSERT, UPDATE policies for admins
    - `titles`: Add INSERT, UPDATE policies for admins
    - `ppv_transactions`: Add INSERT, UPDATE policies for admins

  2. Security
    - All write policies restricted to authenticated users with admin role
    - Admin role verified via creators table lookup
*/

CREATE POLICY "Admins can insert creators"
  ON creators FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can update creators"
  ON creators FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert analytics"
  ON monthly_analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can update analytics"
  ON monthly_analytics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert svod pool"
  ON svod_revenue_pool FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can update svod pool"
  ON svod_revenue_pool FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert payouts"
  ON payouts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can update payouts"
  ON payouts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert titles"
  ON titles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can update titles"
  ON titles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert ppv transactions"
  ON ppv_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );

CREATE POLICY "Admins can update ppv transactions"
  ON ppv_transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators AS c
      WHERE c.user_id = auth.uid() AND c.role = 'admin'
    )
  );
