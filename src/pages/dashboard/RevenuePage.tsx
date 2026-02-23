import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import EmptyState from '../../components/dashboard/EmptyState';
import { useIsDemo } from '../../contexts/DemoContext';
import { useAuthStore } from '../../stores/authStore';
import { useMonthlyAnalyticsRange, usePPVTransactions, useSVODPool } from '../../hooks/useCreatorData';
import {
  getCurrentCreator,
  getMetricsByCreator,
  getSVODPoolByMonth as getMockSVODPool,
  getPPVByCreatorMonth as getMockPPV,
  formatKES,
} from '../../lib/mockData';
import { calcAttribution, calcGrossSVOD, calcCreatorPayout, calcPlatformFee } from '../../lib/calculations';

export default function RevenuePage() {
  const isDemo = useIsDemo();
  const { creatorProfile } = useAuthStore();
  const { selectedMonth } = useOutletContext<{ selectedMonth: string }>();

  const liveCreatorId = isDemo ? undefined : creatorProfile?.id;
  const { data: liveMetrics = [] } = useMonthlyAnalyticsRange(liveCreatorId);
  const latestLiveMonth = liveMetrics.length > 0 ? liveMetrics[liveMetrics.length - 1].report_month : selectedMonth;

  const effectiveMonth = isDemo
    ? (getMetricsByCreator(getCurrentCreator().id).slice(-1)[0]?.report_month ?? '2025-01')
    : latestLiveMonth;

  const { data: liveSVODPool } = useSVODPool(isDemo ? '' : effectiveMonth);
  const { data: livePPV = [] } = usePPVTransactions(liveCreatorId, isDemo ? '' : effectiveMonth);

  const demoCreator = isDemo ? getCurrentCreator() : null;
  const demoMetrics = isDemo ? getMetricsByCreator(demoCreator!.id) : null;
  const demoLatestMetric = isDemo ? demoMetrics![demoMetrics!.length - 1] : null;
  const demoSVODPool = isDemo ? getMockSVODPool(effectiveMonth) : null;
  const demoPPV = isDemo ? getMockPPV(demoCreator!.id, effectiveMonth) : null;

  const creator = isDemo ? demoCreator! : creatorProfile!;
  const latestMetric = isDemo ? demoLatestMetric : (liveMetrics.length > 0 ? liveMetrics[liveMetrics.length - 1] : null);
  const svodPool = isDemo ? demoSVODPool : liveSVODPool;
  const ppvItems = isDemo ? demoPPV! : livePPV;

  const revenue = useMemo(() => {
    const creatorStreams = latestMetric?.total_streams ?? 0;
    const platformStreams = svodPool?.platform_total_streams ?? 0;
    const pool = svodPool?.total_pool ? Number(svodPool.total_pool) : 0;

    const attribution = calcAttribution(creatorStreams, platformStreams);
    const grossSVOD = calcGrossSVOD(pool, attribution);
    const totalPPV = ppvItems.reduce((s: number, p: { gross: number }) => s + Number(p.gross), 0);
    const grossTotal = grossSVOD + totalPPV;
    const share = creator.revenue_share;
    const payout = calcCreatorPayout(grossTotal, share);
    const fee = calcPlatformFee(grossTotal, share);

    return {
      creatorStreams,
      platformStreams,
      pool,
      attribution,
      grossSVOD,
      totalPPV,
      grossTotal,
      payout,
      fee,
      share,
    };
  }, [latestMetric, svodPool, ppvItems, creator.revenue_share]);

  if (!isDemo && !latestMetric) {
    return (
      <div>
        <h1 className="font-display text-2xl text-cream mb-6">Revenue &amp; Payouts</h1>
        <EmptyState
          heading="No revenue data yet"
          body="Revenue details will appear here once analytics have been imported for your content."
        />
      </div>
    );
  }

  const monthLabel = new Date(effectiveMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
  const sharePercent = Math.round(creator.revenue_share * 100);
  const feePercent = 100 - sharePercent;

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">Revenue &amp; Payouts</h1>
      <p className="text-sm text-cream/40 mb-8">Reporting period: {monthLabel}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-tavazi-navy" />
            <h3 className="font-display text-lg text-tavazi-navy">SVOD Revenue</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-tavazi-slate/40 rounded-lg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cream/40 mb-1">Your Streams</div>
              <div className="font-display text-xl text-cream">{revenue.creatorStreams.toLocaleString()}</div>
            </div>
            <div className="bg-tavazi-slate/40 rounded-lg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cream/40 mb-1">Platform Streams</div>
              <div className="font-display text-xl text-cream">{revenue.platformStreams.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-tavazi-navy/10">
              <span className="text-sm text-cream/60">SVOD Pool</span>
              <span className="text-sm font-semibold text-cream">{formatKES(revenue.pool)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-tavazi-navy/10">
              <span className="text-sm text-cream/60">Attribution %</span>
              <span className="text-sm font-semibold text-cream">{(revenue.attribution * 100).toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between py-3 bg-tavazi-navy/10 rounded-lg px-4 -mx-1">
              <span className="text-sm font-semibold text-tavazi-navy">Gross SVOD</span>
              <span className="font-display text-lg text-tavazi-navy">{formatKES(revenue.grossSVOD)}</span>
            </div>
          </div>

          <p className="text-[11px] text-cream/30 mt-4 italic">
            Attribution = Your Streams / Platform Streams x SVOD Pool
          </p>
        </div>

        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-gold-accent" />
            <h3 className="font-display text-lg text-gold-accent">PPV Revenue</h3>
          </div>

          {ppvItems.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-tavazi-navy/10">
                      <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/40">Title</th>
                      <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/40">Units Sold</th>
                      <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/40">Price (KES)</th>
                      <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/40">Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ppvItems.map((p: { id: string; titles?: { title: string }; units_sold: number; price_kes: number; gross: number }) => (
                      <tr key={p.id} className="border-b border-tavazi-navy/5">
                        <td className="py-3 px-3 text-sm text-cream">{p.titles?.title ?? 'Unknown'}</td>
                        <td className="py-3 px-3 text-right text-sm text-cream/70 tabular-nums">{p.units_sold}</td>
                        <td className="py-3 px-3 text-right text-sm text-cream/70 tabular-nums">{Number(p.price_kes).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right text-sm font-semibold text-gold-accent tabular-nums">{formatKES(Number(p.gross))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between py-3 bg-[rgba(212,168,83,0.1)] rounded-lg px-4">
                <span className="text-sm font-semibold text-gold-accent">Total PPV</span>
                <span className="font-display text-lg text-gold-accent">{formatKES(revenue.totalPPV)}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-cream/30 text-sm">
              No PPV events this month.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cream/40 mb-2">Gross SVOD</div>
          <div className="font-display text-[24px] text-tavazi-navy">{formatKES(revenue.grossSVOD)}</div>
        </div>
        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cream/40 mb-2">Gross PPV</div>
          <div className="font-display text-[24px] text-gold-accent">{formatKES(revenue.totalPPV)}</div>
        </div>
        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cream/40 mb-2">Platform Fee ({feePercent}%)</div>
          <div className="font-display text-[24px] text-cream/50">{formatKES(revenue.fee)}</div>
        </div>
        <div className="bg-tavazi-charcoal border-2 border-success rounded-xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-success/70 mb-2">Net Creator Payout</div>
          <div className="font-display text-[24px] text-success">{formatKES(revenue.payout)}</div>
        </div>
      </div>

      <div className="mt-6 bg-tavazi-charcoal border border-tavazi-navy/10 rounded-xl p-5">
        <p className="text-sm text-cream/50">
          Payment via M-Pesa or bank transfer within 15 business days.
        </p>
        <p className="text-sm text-cream/40 mt-1">
          Reference: <span className="font-mono text-cream/60">TAV-{creator.id.slice(0, 8).toUpperCase()}-{effectiveMonth.replace('-', '')}</span>
        </p>
      </div>
    </div>
  );
}
