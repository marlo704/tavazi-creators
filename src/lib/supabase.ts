import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCreatorProfile(userId: string) {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data, error };
}

export async function getMonthlyAnalytics(creatorId: string, month: string) {
  const { data, error } = await supabase
    .from('monthly_analytics')
    .select('*')
    .eq('creator_id', creatorId)
    .eq('report_month', month)
    .maybeSingle();
  return { data, error };
}

export async function getMonthlyAnalyticsRange(creatorId: string) {
  const { data, error } = await supabase
    .from('monthly_analytics')
    .select('*')
    .eq('creator_id', creatorId)
    .order('report_month', { ascending: true });
  return { data: data ?? [], error };
}

export async function getCreatorTitles(creatorId: string) {
  const { data, error } = await supabase
    .from('titles')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function getPPVTransactions(creatorId: string, month: string) {
  const { data, error } = await supabase
    .from('ppv_transactions')
    .select('*, titles(title)')
    .eq('creator_id', creatorId)
    .eq('report_month', month);
  return { data: data ?? [], error };
}

export async function getSVODPool(month: string) {
  const { data, error } = await supabase
    .from('svod_revenue_pool')
    .select('*')
    .eq('report_month', month)
    .maybeSingle();
  return { data, error };
}

export async function getPayoutHistory(creatorId: string) {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('creator_id', creatorId)
    .order('report_month', { ascending: false });
  return { data: data ?? [], error };
}

export async function getAllCreators() {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .order('name');
  return { data: data ?? [], error };
}

export async function getAllTitlesCount() {
  const { count, error } = await supabase
    .from('titles')
    .select('*', { count: 'exact', head: true });
  return { count: count ?? 0, error };
}

export async function getPlatformStats() {
  const { data: analytics, error: analyticsError } = await supabase
    .from('monthly_analytics')
    .select('platform_fee, total_streams');
  if (analyticsError) return { data: null, error: analyticsError };

  const platformRevenue = (analytics ?? []).reduce((s, m) => s + Number(m.platform_fee ?? 0), 0);
  const totalStreams = (analytics ?? []).reduce((s, m) => s + Number(m.total_streams ?? 0), 0);

  return { data: { platformRevenue, totalStreams }, error: null };
}
