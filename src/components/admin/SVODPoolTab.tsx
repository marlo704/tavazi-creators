import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { recalculatePayouts } from '../../lib/payouts';

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

export default function SVODPoolTab() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [totalPool, setTotalPool] = useState('');
  const [totalStreams, setTotalStreams] = useState('');
  const [saving, setSaving] = useState(false);
  const months = getMonthOptions();

  const handleSave = async () => {
    const poolVal = parseFloat(totalPool);
    const streamsVal = parseInt(totalStreams, 10);

    if (!poolVal || poolVal <= 0) {
      toast.error('Enter a valid pool amount');
      return;
    }
    if (!streamsVal || streamsVal <= 0) {
      toast.error('Enter a valid stream count');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('svod_revenue_pool').upsert(
      {
        report_month: month,
        total_pool: poolVal,
        platform_total_streams: streamsVal,
      },
      { onConflict: 'report_month' }
    );

    if (error) {
      toast.error('Failed to save: ' + error.message);
      setSaving(false);
      return;
    }

    toast.success('SVOD pool saved for ' + month);
    await recalculatePayouts(month);
    setSaving(false);
    setTotalPool('');
    setTotalStreams('');
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
          Report Month
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
          Total platform SVOD revenue this month (KES)
        </label>
        <input
          type="number"
          value={totalPool}
          onChange={(e) => setTotalPool(e.target.value)}
          className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
          placeholder="e.g. 6400000"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
          Total platform streams this month
        </label>
        <input
          type="number"
          value={totalStreams}
          onChange={(e) => setTotalStreams(e.target.value)}
          className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
          placeholder="e.g. 128000"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save SVOD Pool'}
      </button>
    </div>
  );
}
