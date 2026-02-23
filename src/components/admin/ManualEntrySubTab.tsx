import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { recalculatePayouts } from '../../lib/payouts';

interface StagedRow {
  id: string;
  content_title: string;
  content_id: string;
  total_streams: number;
  unique_viewers: number;
  watch_hours: number;
  avg_completion: number;
  content_type: string;
  monetisation: string;
  status: string;
}

const CONTENT_TYPES = ['Movie', 'Series', 'Documentary', 'Event', 'Short Film'];
const MONETISATION_OPTIONS = ['SVOD', 'PPV'];
const STATUS_OPTIONS = ['Published', 'Draft'];

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

const INITIAL_FORM = {
  content_title: '',
  content_id: '',
  total_streams: '',
  unique_viewers: '',
  watch_hours: '',
  avg_completion: '',
  content_type: 'Movie',
  monetisation: 'SVOD',
  status: 'Published',
};

export default function ManualEntrySubTab() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [creatorId, setCreatorId] = useState('');
  const [creators, setCreators] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [staged, setStaged] = useState<StagedRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const months = getMonthOptions();

  useEffect(() => {
    supabase
      .from('creators')
      .select('id, name')
      .order('name')
      .then(({ data }) => {
        if (data) setCreators(data);
      });
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addToStaging = () => {
    if (!form.content_title.trim()) {
      toast.error('Content Title is required');
      return;
    }
    if (!form.total_streams && !form.unique_viewers && !form.watch_hours) {
      toast.error('Enter at least one metric');
      return;
    }

    const row: StagedRow = {
      id: crypto.randomUUID(),
      content_title: form.content_title.trim(),
      content_id: form.content_id.trim(),
      total_streams: parseInt(form.total_streams || '0', 10) || 0,
      unique_viewers: parseInt(form.unique_viewers || '0', 10) || 0,
      watch_hours: parseFloat(form.watch_hours || '0') || 0,
      avg_completion: parseFloat(form.avg_completion || '0') || 0,
      content_type: form.content_type,
      monetisation: form.monetisation,
      status: form.status,
    };

    setStaged((prev) => [...prev, row]);
    setForm(INITIAL_FORM);
    toast.success(`"${row.content_title}" added to staging`);
  };

  const removeFromStaging = (id: string) => {
    setStaged((prev) => prev.filter((r) => r.id !== id));
  };

  const handleConfirmAll = async () => {
    if (!creatorId) {
      toast.error('Select a creator first');
      return;
    }
    if (staged.length === 0) {
      toast.error('No titles staged for import');
      return;
    }

    setSubmitting(true);

    const totalStreams = staged.reduce((s, r) => s + r.total_streams, 0);
    const totalViewers = staged.reduce((s, r) => s + r.unique_viewers, 0);
    const totalHours = staged.reduce((s, r) => s + r.watch_hours, 0);
    const avgCompletion =
      staged.length > 0
        ? Math.round(staged.reduce((s, r) => s + r.avg_completion, 0) / staged.length)
        : 0;

    const { error } = await supabase.from('monthly_analytics').upsert(
      {
        creator_id: creatorId,
        report_month: month,
        total_streams: totalStreams,
        unique_viewers: totalViewers,
        watch_hours: Math.round(totalHours * 100) / 100,
        avg_completion: avgCompletion,
        gross_revenue: 0,
        platform_fee: 0,
        creator_payout: 0,
      },
      { onConflict: 'creator_id,report_month' }
    );

    if (error) {
      toast.error('Import failed: ' + error.message);
      setSubmitting(false);
      return;
    }

    await recalculatePayouts(month);

    const creatorName = creators.find((c) => c.id === creatorId)?.name || 'Creator';
    const monthLabel = months.find((m) => m.value === month)?.label || month;
    toast.success(`${staged.length} titles saved for ${creatorName} - ${monthLabel}`);

    setStaged([]);
    setSubmitting(false);
  };

  const inputClass =
    'w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50 placeholder:text-cream/25';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
            Report Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={inputClass}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
            Creator
          </label>
          <select
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
            className={inputClass}
          >
            <option value="">Select creator...</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-tavazi-navy/15 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Content Title *
            </label>
            <input
              type="text"
              value={form.content_title}
              onChange={(e) => handleChange('content_title', e.target.value)}
              placeholder="e.g. Lagos After Dark"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Content ID
            </label>
            <input
              type="text"
              value={form.content_id}
              onChange={(e) => handleChange('content_id', e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Total Streams
            </label>
            <input
              type="number"
              min="0"
              value={form.total_streams}
              onChange={(e) => handleChange('total_streams', e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Unique Viewers
            </label>
            <input
              type="number"
              min="0"
              value={form.unique_viewers}
              onChange={(e) => handleChange('unique_viewers', e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Watch Hours
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={form.watch_hours}
              onChange={(e) => handleChange('watch_hours', e.target.value)}
              placeholder="0.0"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Completion Rate %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.avg_completion}
              onChange={(e) => handleChange('avg_completion', e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Content Type
            </label>
            <select
              value={form.content_type}
              onChange={(e) => handleChange('content_type', e.target.value)}
              className={inputClass}
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Monetisation
            </label>
            <select
              value={form.monetisation}
              onChange={(e) => handleChange('monetisation', e.target.value)}
              className={inputClass}
            >
              {MONETISATION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={addToStaging}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 border border-tavazi-navy/40 text-tavazi-navy text-sm font-semibold rounded-lg transition-all hover:bg-tavazi-navy/10"
        >
          <Plus className="w-4 h-4" />
          Add Another Title
        </button>
      </div>

      {staged.length > 0 && (
        <div className="border-t border-tavazi-navy/15 pt-5 space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-cream/50">
            Staged Titles ({staged.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-tavazi-navy/15">
                  <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Title</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Streams</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Viewers</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Watch Hrs</th>
                  <th className="text-center py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Type</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {staged.map((row) => (
                  <tr key={row.id} className="border-b border-tavazi-navy/5">
                    <td className="py-2 px-3 text-sm text-cream">{row.content_title}</td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">{row.total_streams.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">{row.unique_viewers.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">{row.watch_hours.toFixed(1)}</td>
                    <td className="py-2 px-3 text-center text-sm text-cream/50">{row.content_type}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeFromStaging(row.id)}
                        className="text-cream/30 hover:text-red-400 transition-colors"
                        aria-label={`Remove ${row.content_title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleConfirmAll}
            disabled={submitting}
            className="px-6 py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : `Confirm All (${staged.length} title${staged.length > 1 ? 's' : ''})`}
          </button>
        </div>
      )}
    </div>
  );
}
