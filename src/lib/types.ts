export interface CreatorProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_initials: string;
  revenue_share: number;
  role: 'creator' | 'admin';
  created_at: string;
}

export interface TitleRow {
  id: string;
  creator_id: string;
  title: string;
  category: string;
  type: string;
  status: string;
  monetisation: string;
  thumbnail_url: string;
  total_streams: number;
  unique_viewers: number;
  watch_hours: number;
  avg_completion: number;
  gross_revenue: number;
  created_at: string;
}

export interface MonthlyAnalyticsRow {
  id: string;
  creator_id: string;
  report_month: string;
  total_streams: number;
  unique_viewers: number;
  watch_hours: number;
  avg_completion: number;
  gross_revenue: number;
  platform_fee: number;
  creator_payout: number;
}

export interface SVODPoolRow {
  id: string;
  report_month: string;
  total_pool: number;
  platform_total_streams: number;
}

export interface PPVTransactionRow {
  id: string;
  creator_id: string;
  title_id: string;
  report_month: string;
  units_sold: number;
  price_kes: number;
  gross: number;
  titles?: { title: string };
}

export interface PayoutRow {
  id: string;
  creator_id: string;
  report_month: string;
  gross_svod: number;
  gross_ppv: number;
  platform_fee: number;
  net_payout: number;
  status: string;
  reference: string;
}
