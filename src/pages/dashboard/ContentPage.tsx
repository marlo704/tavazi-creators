import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Film, Clapperboard, Tv, Video, Radio } from 'lucide-react';
import { getCurrentCreator, getTitlesByCreator, formatNumber, type Title } from '../../lib/mockData';

const typeIcons: Record<string, typeof Film> = {
  movie: Film,
  documentary: Clapperboard,
  series: Tv,
  short_film: Video,
  event: Radio,
};

const typeLabels: Record<string, string> = {
  movie: 'Movie',
  series: 'Series',
  documentary: 'Documentary',
  event: 'Event',
  short_film: 'Short Film',
};

const statusStyles: Record<string, string> = {
  published: 'bg-[rgba(34,197,94,0.15)] text-success',
  draft: 'bg-[rgba(245,158,11,0.15)] text-warning',
  processing: 'bg-tavazi-navy/15 text-tavazi-navy',
};

const monetisationStyles: Record<string, string> = {
  svod: 'bg-[rgba(25,113,194,0.15)] text-tavazi-navy',
  ppv: 'bg-[rgba(212,168,83,0.15)] text-gold-accent',
};

type SortKey = 'title' | 'type' | 'status' | 'total_streams' | 'unique_viewers' | 'watch_hours' | 'avg_completion' | 'gross_revenue';
type SortDir = 'asc' | 'desc';

function CompletionBar({ value }: { value: number }) {
  const color = value >= 75 ? '#22C55E' : value >= 50 ? '#D4A853' : '#EF4444';
  return (
    <div className="flex items-center gap-2 justify-end">
      <div className="w-16 h-1 rounded-full bg-tavazi-slate overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ color }} className="text-sm tabular-nums">{value}%</span>
    </div>
  );
}

export default function ContentPage() {
  const creator = getCurrentCreator();
  const allTitles = getTitlesByCreator(creator.id);

  const [sortKey, setSortKey] = useState<SortKey>('total_streams');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monetisationFilter, setMonetisationFilter] = useState<string>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...allTitles];
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (monetisationFilter !== 'all') result = result.filter((t) => t.monetisation === monetisationFilter);
    return result;
  }, [allTitles, statusFilter, monetisationFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filtered, sortKey, sortDir]);

  const totals = useMemo(() => ({
    streams: filtered.reduce((s, t) => s + t.total_streams, 0),
    viewers: filtered.reduce((s, t) => s + t.unique_viewers, 0),
    watchHrs: filtered.reduce((s, t) => s + t.watch_hours, 0),
    revenue: filtered.reduce((s, t) => s + t.gross_revenue, 0),
  }), [filtered]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const TH = ({ col, label, align = 'left' }: { col: SortKey; label: string; align?: string }) => (
    <th
      className={`py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50 cursor-pointer hover:text-cream/80 transition-colors select-none ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => handleSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-5 border-b border-tavazi-navy/10">
        <div>
          <h2 className="font-display text-[15px] text-cream">Content Performance &mdash; All Titles</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-3 py-1.5 text-cream/80 focus:outline-none focus:ring-1 focus:ring-tavazi-navy/40"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="processing">Processing</option>
          </select>
          <select
            value={monetisationFilter}
            onChange={(e) => setMonetisationFilter(e.target.value)}
            className="text-xs bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-3 py-1.5 text-cream/80 focus:outline-none focus:ring-1 focus:ring-tavazi-navy/40"
          >
            <option value="all">All Monetisation</option>
            <option value="svod">SVOD</option>
            <option value="ppv">PPV</option>
          </select>
          <span className="text-[11px] text-cream/40">Data from Muvi CMS Analytics CSV</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-tavazi-navy/10">
              <TH col="title" label="Title" />
              <TH col="type" label="Type" />
              <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50 text-left">Status</th>
              <TH col="total_streams" label="Streams" align="right" />
              <TH col="unique_viewers" label="Viewers" align="right" />
              <TH col="watch_hours" label="Watch Hrs" align="right" />
              <TH col="avg_completion" label="Completion" align="right" />
              <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50 text-left">Monetisation</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t: Title, i: number) => {
              const TypeIcon = typeIcons[t.type] || Film;
              return (
                <tr key={t.id} className={`border-b border-tavazi-navy/5 hover:bg-tavazi-navy/5 transition-colors ${i % 2 === 0 ? '' : 'bg-tavazi-slate/10'}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={t.thumbnail_url} alt={t.title} className="w-14 h-8 object-cover rounded shrink-0" />
                      <div>
                        <span className="text-sm font-semibold text-cream block leading-tight">{t.title}</span>
                        <span className="text-[11px] text-cream/40">{t.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-cream/60 text-sm">
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeLabels[t.type]}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-cream tabular-nums">{formatNumber(t.total_streams)}</td>
                  <td className="py-4 px-4 text-right text-sm text-cream/70 tabular-nums">{formatNumber(t.unique_viewers)}</td>
                  <td className="py-4 px-4 text-right text-sm text-cream/70 tabular-nums">{formatNumber(t.watch_hours)}</td>
                  <td className="py-4 px-4"><CompletionBar value={t.avg_completion} /></td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${monetisationStyles[t.monetisation]}`}>
                      {t.monetisation}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-tavazi-navy/20 bg-tavazi-slate/20">
              <td className="py-3 px-4 text-sm font-bold text-cream" colSpan={3}>Totals ({filtered.length} titles)</td>
              <td className="py-3 px-4 text-right text-sm font-bold text-cream tabular-nums">{formatNumber(totals.streams)}</td>
              <td className="py-3 px-4 text-right text-sm font-bold text-cream/70 tabular-nums">{formatNumber(totals.viewers)}</td>
              <td className="py-3 px-4 text-right text-sm font-bold text-cream/70 tabular-nums">{formatNumber(totals.watchHrs)}</td>
              <td className="py-3 px-4" />
              <td className="py-3 px-4" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-tavazi-navy/10">
        <p className="text-[11px] text-cream/30 italic">Data sourced from Muvi CMS Analytics &rarr; Content CSV export</p>
      </div>
    </div>
  );
}
