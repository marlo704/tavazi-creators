import { LogOut, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useIsDemo } from '../../contexts/DemoContext';
import {
  getCurrentCreator,
  getTitlesByCreator,
  getMetricsByCreator,
  getSVODPoolByMonth,
  getPPVByCreatorMonth,
} from '../../lib/mockData';
import { openPrintReport } from '../../lib/exportReport';

interface TopbarProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

function getMonthOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}

export default function Topbar({ selectedMonth, onMonthChange }: TopbarProps) {
  const { signOut } = useAuth();
  const isDemo = useIsDemo();
  const creator = getCurrentCreator();
  const months = getMonthOptions();

  const handleExport = () => {
    const titles = getTitlesByCreator(creator.id);
    const metrics = getMetricsByCreator(creator.id);
    const latestMonth = metrics[metrics.length - 1]?.report_month ?? selectedMonth;
    const svodPool = getSVODPoolByMonth(latestMonth);
    const ppvItems = getPPVByCreatorMonth(creator.id, latestMonth);

    openPrintReport({
      creator,
      titles,
      metrics,
      svodPool,
      ppvItems,
      month: latestMonth,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[60px] bg-tavazi-charcoal border-b border-tavazi-navy/15 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <img src="/assets/tavazi-logo.png" alt="Tavazi" className="h-9" />
        <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-tavazi-navy bg-tavazi-navy/10 px-2 py-1 rounded">
          Creator Portal
        </span>
      </div>

      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-3 py-1.5 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-3">
        {!isDemo && (
          <button
            onClick={handleExport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-tavazi-navy/30 text-cream/60 rounded-lg text-xs hover:border-tavazi-navy hover:text-cream transition-all"
            title="Export Report"
          >
            <FileText className="w-3.5 h-3.5" />
            Export
          </button>
        )}
        {isDemo ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-tavazi-slate shrink-0">
              <Eye className="w-4 h-4 text-cream/50" />
            </div>
            <span className="hidden md:block text-sm text-cream/60 font-medium">Demo Mode</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs text-tavazi-dark shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4A853, #C49B48)' }}
            >
              {creator.avatar_initials}
            </div>
            <span className="hidden md:block text-sm text-cream font-medium">{creator.name}</span>
          </div>
        )}
        {isDemo ? (
          <Link
            to="/login"
            className="px-3 py-1.5 bg-tavazi-navy text-tavazi-dark rounded-lg text-xs font-semibold hover:bg-[#339AF0] transition-all"
          >
            Sign In
          </Link>
        ) : (
          <button
            onClick={signOut}
            className="p-2 text-cream/40 hover:text-cream transition-colors rounded-lg hover:bg-tavazi-slate/50"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
