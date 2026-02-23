import { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import EmptyState from '../../components/dashboard/EmptyState';
import { useIsDemo } from '../../contexts/DemoContext';
import { useAuthStore } from '../../stores/authStore';
import { useMonthlyAnalyticsRange } from '../../hooks/useCreatorData';
import { getCurrentCreator, getMetricsByCreator, formatKES, formatNumber } from '../../lib/mockData';

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-tavazi-charcoal border border-tavazi-navy/20 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-cream/50 text-xs mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
};

const RevenueTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-tavazi-charcoal border border-tavazi-navy/20 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-cream/50 text-xs mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatKES(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function TrendPage() {
  const isDemo = useIsDemo();
  const { creatorProfile } = useAuthStore();

  const liveCreatorId = isDemo ? undefined : creatorProfile?.id;
  const { data: liveMetrics = [] } = useMonthlyAnalyticsRange(liveCreatorId);

  const demoMetrics = isDemo ? getMetricsByCreator(getCurrentCreator().id) : null;

  const metrics = isDemo ? demoMetrics! : liveMetrics;

  const trendData = useMemo(() =>
    metrics.map((m) => ({
      month: new Date(m.report_month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      streams: m.total_streams,
      viewers: m.unique_viewers,
      revenue: m.gross_revenue,
      payout: m.creator_payout,
    })),
  [metrics]);

  if (!isDemo && metrics.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl text-cream mb-6">12-Month Trends</h1>
        <EmptyState
          heading="No trend data yet"
          body="Trend charts will appear here once multiple months of analytics have been imported."
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">12-Month Trends</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-5 md:p-6">
          <h3 className="font-display text-lg text-cream mb-6">Streams &amp; Viewers &mdash; 12 Month Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={trendData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,113,194,0.1)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatNumber(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: 'rgba(245,240,230,0.6)', fontSize: '12px' }} />
              <Bar
                dataKey="streams"
                name="Streams"
                fill="#1971C2"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="viewers"
                name="Viewers"
                fill="rgba(25,113,194,0.45)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl p-5 md:p-6">
          <h3 className="font-display text-lg text-cream mb-6">Revenue vs Payout &mdash; 12 Month Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,113,194,0.1)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => {
                  if (v >= 1000000) return `KES ${(v / 1000000).toFixed(0)}M`;
                  return `KES ${(v / 1000).toFixed(0)}K`;
                }}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Legend wrapperStyle={{ color: 'rgba(245,240,230,0.6)', fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#D4A853"
                strokeWidth={3}
                dot={{ r: 4, fill: '#D4A853' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="payout"
                name="Payout"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 4, fill: '#22C55E' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
