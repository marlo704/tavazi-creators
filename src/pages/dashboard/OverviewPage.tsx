import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Upload } from 'lucide-react';
import KPICard from '../../components/dashboard/KPICard';
import {
  getCurrentCreator,
  getCreatorKPIs,
  getMetricsByCreator,
  getTitlesByCreator,
  formatKES,
  formatNumber,
} from '../../lib/mockData';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-tavazi-charcoal border border-tavazi-navy/20 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-cream/60 text-xs mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatKES(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function OverviewPage() {
  const creator = getCurrentCreator();
  const kpis = getCreatorKPIs(creator.id);
  const metrics = getMetricsByCreator(creator.id);
  const titles = getTitlesByCreator(creator.id).filter((t) => t.status === 'published');

  const chartData = metrics.slice(-6).map((m) => ({
    month: new Date(m.report_month + '-01').toLocaleString('default', { month: 'short' }),
    gross: m.gross_revenue,
    payout: m.creator_payout,
  }));

  const topTitles = [...titles]
    .sort((a, b) => b.total_streams - a.total_streams)
    .slice(0, 4)
    .map((t, i) => ({
      name: t.title.length > 20 ? t.title.slice(0, 20) + '...' : t.title,
      streams: t.total_streams,
      fill: i === 0 ? '#D4A853' : '#1971C2',
    }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-display text-xl text-tavazi-dark shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4A853, #C49B48)' }}
          >
            {creator.avatar_initials}
          </div>
          <div>
            <h1 className="font-display text-[22px] text-cream">{creator.name}</h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-tavazi-navy font-semibold">Revenue Share: {Math.round(creator.revenue_share * 100)}%</span>
              <span className="text-cream/40">|</span>
              <span className="text-cream/50">{kpis.titleCount} titles</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-tavazi-navy/30 text-cream/60 rounded-lg text-sm hover:border-tavazi-navy hover:text-cream transition-all">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-tavazi-navy text-tavazi-dark rounded-lg text-sm font-semibold hover:bg-[#339AF0] transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KPICard label="Total Streams" value={formatNumber(kpis.totalStreams)} color="#1971C2" trend={kpis.streamsTrend} />
        <KPICard label="Unique Viewers" value={formatNumber(kpis.uniqueViewers)} color="#1971C2" />
        <KPICard label="Watch Hours" value={formatNumber(kpis.watchHours)} color="#22C55E" />
        <KPICard label="Avg Completion" value={`${kpis.avgCompletion}%`} color="#D4A853" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard label="Gross Revenue" value={formatKES(kpis.grossRevenue)} color="#D4A853" trend={kpis.revenueTrend} />
        <KPICard label="Platform Fee" value={formatKES(kpis.platformFee)} color="rgba(245,240,230,0.5)" />
        <KPICard label="Net Creator Payout" value={formatKES(kpis.creatorPayout)} color="#22C55E" prominent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-tavazi-charcoal border border-tavazi-navy/15 rounded-[10px] p-6">
          <h3 className="font-display text-lg text-cream mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1971C2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1971C2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,113,194,0.1)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `KES ${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gross" name="Gross Revenue" stroke="#1971C2" strokeWidth={2} fill="url(#grossGradient)" />
              <Area type="monotone" dataKey="payout" name="Creator Payout" stroke="#22C55E" strokeWidth={2} fill="url(#payoutGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-tavazi-charcoal border border-tavazi-navy/15 rounded-[10px] p-6">
          <h3 className="font-display text-lg text-cream mb-6">Top Titles by Streams</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topTitles} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,113,194,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatNumber(v)} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(245,240,230,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                cursor={{ fill: 'rgba(25,113,194,0.05)' }}
                contentStyle={{ background: '#112640', border: '1px solid rgba(25,113,194,0.2)', borderRadius: '8px', color: '#F5F0E6' }}
                formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Streams']}
              />
              <Bar dataKey="streams" radius={[0, 4, 4, 0]} barSize={24}>
                {topTitles.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
