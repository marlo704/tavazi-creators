import { supabase } from './supabase';
import { calcAttribution, calcGrossSVOD, calcCreatorPayout, calcPlatformFee } from './calculations';
import toast from 'react-hot-toast';

export async function recalculatePayouts(month: string) {
  const { data: pool, error: poolErr } = await supabase
    .from('svod_revenue_pool')
    .select('*')
    .eq('report_month', month)
    .maybeSingle();

  if (poolErr) {
    toast.error('Failed to fetch SVOD pool: ' + poolErr.message);
    return;
  }

  if (!pool) {
    toast.error('No SVOD pool entry for ' + month);
    return;
  }

  const { data: allCreators, error: creatorsErr } = await supabase
    .from('creators')
    .select('*');

  if (creatorsErr || !allCreators) {
    toast.error('Failed to fetch creators');
    return;
  }

  for (const creator of allCreators) {
    const { data: analytics } = await supabase
      .from('monthly_analytics')
      .select('total_streams')
      .eq('creator_id', creator.id)
      .eq('report_month', month);

    const creatorStreams = (analytics ?? []).reduce(
      (sum: number, row: { total_streams: number }) => sum + row.total_streams,
      0
    );

    const { data: ppvRows } = await supabase
      .from('ppv_transactions')
      .select('gross')
      .eq('creator_id', creator.id)
      .eq('report_month', month);

    const grossPPV = (ppvRows ?? []).reduce(
      (sum: number, row: { gross: number }) => sum + row.gross,
      0
    );

    const attribution = calcAttribution(creatorStreams, pool.platform_total_streams);
    const grossSVOD = calcGrossSVOD(pool.total_pool, attribution);
    const grossTotal = grossSVOD + grossPPV;
    const share = creator.revenue_share;
    const fee = calcPlatformFee(grossTotal, share);
    const payout = calcCreatorPayout(grossTotal, share);
    const reference = `TAV-${creator.id.slice(0, 8).toUpperCase()}-${month.replace('-', '')}`;

    const { error: upsertErr } = await supabase
      .from('payouts')
      .upsert(
        {
          creator_id: creator.id,
          report_month: month,
          gross_svod: grossSVOD,
          gross_ppv: grossPPV,
          platform_fee: fee,
          net_payout: payout,
          status: 'pending',
          reference,
        },
        { onConflict: 'creator_id,report_month' }
      );

    if (upsertErr) {
      toast.error('Failed to save payout for ' + creator.name + ': ' + upsertErr.message);
      return;
    }
  }

  toast.success('Payouts calculated for ' + month);
}
