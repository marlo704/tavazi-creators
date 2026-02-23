import { useState } from 'react';
import { Users, Film, DollarSign, TrendingUp } from 'lucide-react';
import { creators, titles, monthlyMetrics, formatKES } from '../../lib/mockData';
import ImportCSVTab from '../../components/admin/ImportCSVTab';
import SVODPoolTab from '../../components/admin/SVODPoolTab';
import CreatorManagementTab from '../../components/admin/CreatorManagementTab';

const stats = [
  {
    label: 'Total Creators',
    value: creators.length.toString(),
    icon: Users,
    color: '#1971C2',
  },
  {
    label: 'Total Titles',
    value: titles.length.toString(),
    icon: Film,
    color: '#D4A853',
  },
  {
    label: 'Platform Revenue',
    value: formatKES(monthlyMetrics.reduce((s, m) => s + m.platform_fee, 0)),
    icon: DollarSign,
    color: '#22C55E',
  },
  {
    label: 'Total Streams',
    value: titles.reduce((s, t) => s + t.total_streams, 0).toLocaleString(),
    icon: TrendingUp,
    color: '#1971C2',
  },
];

const tabs = [
  { id: 'import', label: 'Import Analytics' },
  { id: 'svod', label: 'SVOD Pool Entry' },
  { id: 'creators', label: 'Creator Management' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('import');

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-[10px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cream/50">{stat.label}</span>
            </div>
            <div className="font-display text-[28px]" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-tavazi-charcoal border border-tavazi-navy/15 rounded-xl overflow-hidden">
        <div className="flex border-b border-tavazi-navy/15">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-tavazi-navy'
                  : 'text-cream/40 hover:text-cream/60'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-tavazi-navy" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'import' && <ImportCSVTab />}
          {activeTab === 'svod' && <SVODPoolTab />}
          {activeTab === 'creators' && <CreatorManagementTab />}
        </div>
      </div>
    </div>
  );
}
