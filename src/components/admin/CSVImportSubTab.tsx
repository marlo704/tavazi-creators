import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, AlertTriangle, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { recalculatePayouts } from '../../lib/payouts';

interface MergedRow {
  content_id: string;
  content_title: string;
  total_streams: number;
  unique_viewers: number;
  watch_time_hrs: number;
  missingFrom: 'views' | 'duration' | null;
}

interface RawViewsRow {
  Id: string;
  'Content Name': string;
  Views: string;
}

interface RawDurationRow {
  Id: string;
  'Content Name': string;
  'Watch Duration': string;
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

function parseViewsCSV(file: File): Promise<Map<string, { id: string; name: string; views: number }>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const map = new Map<string, { id: string; name: string; views: number }>();
        for (const raw of results.data as RawViewsRow[]) {
          const id = (raw['Id'] || '').trim();
          if (!id) continue;
          map.set(id, {
            id,
            name: (raw['Content Name'] || '').trim(),
            views: parseInt(raw['Views'] || '0', 10) || 0,
          });
        }
        resolve(map);
      },
      error: (err: Error) => reject(err),
    });
  });
}

function parseDurationCSV(file: File): Promise<Map<string, { id: string; name: string; duration: number }>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const map = new Map<string, { id: string; name: string; duration: number }>();
        for (const raw of results.data as RawDurationRow[]) {
          const id = (raw['Id'] || '').trim();
          if (!id) continue;
          map.set(id, {
            id,
            name: (raw['Content Name'] || '').trim(),
            duration: parseFloat(raw['Watch Duration'] || '0') || 0,
          });
        }
        resolve(map);
      },
      error: (err: Error) => reject(err),
    });
  });
}

function mergeData(
  viewsMap: Map<string, { id: string; name: string; views: number }>,
  durationMap: Map<string, { id: string; name: string; duration: number }>
): MergedRow[] {
  const allIds = new Set([...viewsMap.keys(), ...durationMap.keys()]);
  const rows: MergedRow[] = [];

  for (const id of allIds) {
    const v = viewsMap.get(id);
    const d = durationMap.get(id);

    rows.push({
      content_id: id,
      content_title: v?.name || d?.name || '',
      total_streams: v?.views ?? 0,
      unique_viewers: v?.views ?? 0,
      watch_time_hrs: d?.duration ?? 0,
      missingFrom: !v ? 'views' : !d ? 'duration' : null,
    });
  }

  return rows.sort((a, b) => a.content_title.localeCompare(b.content_title));
}

export default function CSVImportSubTab() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [creatorId, setCreatorId] = useState('');
  const [creators, setCreators] = useState<Array<{ id: string; name: string }>>([]);
  const [viewsFile, setViewsFile] = useState<File | null>(null);
  const [durationFile, setDurationFile] = useState<File | null>(null);
  const [mergedRows, setMergedRows] = useState<MergedRow[]>([]);
  const [importing, setImporting] = useState(false);
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

  const processFiles = useCallback(async (vFile: File | null, dFile: File | null) => {
    if (!vFile || !dFile) {
      setMergedRows([]);
      return;
    }
    try {
      const [viewsMap, durationMap] = await Promise.all([
        parseViewsCSV(vFile),
        parseDurationCSV(dFile),
      ]);
      const merged = mergeData(viewsMap, durationMap);
      setMergedRows(merged);
      toast.success(`Merged ${merged.length} content items`);
    } catch (err) {
      toast.error('CSV parse error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, []);

  const onDropViews = useCallback(
    (accepted: File[]) => {
      const f = accepted[0];
      if (!f) return;
      setViewsFile(f);
      toast.success('Views CSV loaded');
      processFiles(f, durationFile);
    },
    [durationFile, processFiles]
  );

  const onDropDuration = useCallback(
    (accepted: File[]) => {
      const f = accepted[0];
      if (!f) return;
      setDurationFile(f);
      toast.success('Watch Duration CSV loaded');
      processFiles(viewsFile, f);
    },
    [viewsFile, processFiles]
  );

  const viewsDropzone = useDropzone({
    onDrop: onDropViews,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const durationDropzone = useDropzone({
    onDrop: onDropDuration,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleImport = async () => {
    if (!creatorId) {
      toast.error('Select a creator first');
      return;
    }
    if (mergedRows.length === 0) {
      toast.error('No data to import');
      return;
    }

    setImporting(true);

    const totalStreams = mergedRows.reduce((s, r) => s + r.total_streams, 0);
    const totalViewers = mergedRows.reduce((s, r) => s + r.unique_viewers, 0);
    const totalHours = mergedRows.reduce((s, r) => s + r.watch_time_hrs, 0);

    const { error } = await supabase.from('monthly_analytics').upsert(
      {
        creator_id: creatorId,
        report_month: month,
        total_streams: totalStreams,
        unique_viewers: totalViewers,
        watch_hours: Math.round(totalHours * 100) / 100,
        avg_completion: 0,
        gross_revenue: 0,
        platform_fee: 0,
        creator_payout: 0,
      },
      { onConflict: 'creator_id,report_month' }
    );

    if (error) {
      toast.error('Import failed: ' + error.message);
      setImporting(false);
      return;
    }

    toast.success(`Analytics imported for ${month}`);
    await recalculatePayouts(month);
    setMergedRows([]);
    setViewsFile(null);
    setDurationFile(null);
    setImporting(false);
  };

  const warningCount = mergedRows.filter((r) => r.missingFrom).length;

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
            className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
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
            className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
          >
            <option value="">Select creator...</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#0D1B2A] border border-[rgba(25,113,194,0.15)] rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-tavazi-navy shrink-0 mt-0.5" />
        <div className="text-sm text-cream/60 leading-relaxed">
          <p className="font-semibold text-cream/80 mb-1">How to export from Muvi CMS:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Go to Analytics &rarr; Engagement</li>
            <li>Set Type: Video, Breakdown: Content</li>
            <li>Export with Metric: <span className="text-cream/80">Views</span> &rarr; upload to Views CSV</li>
            <li>Export with Metric: <span className="text-cream/80">Watch Duration</span> &rarr; upload to Watch Duration CSV</li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
            Views CSV
          </label>
          <div
            {...viewsDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-xl min-h-[120px] flex flex-col items-center justify-center gap-2 px-4 py-6 cursor-pointer transition-all ${
              viewsFile
                ? 'border-green-500/50 bg-green-500/5'
                : viewsDropzone.isDragActive
                  ? 'border-tavazi-navy bg-tavazi-navy/10'
                  : 'border-tavazi-navy/40 bg-tavazi-charcoal hover:border-tavazi-navy/70'
            }`}
          >
            <input {...viewsDropzone.getInputProps()} />
            {viewsFile ? (
              <>
                <Check className="w-6 h-6 text-green-500" />
                <p className="text-sm text-cream/70 text-center truncate max-w-full">{viewsFile.name}</p>
                <p className="text-[11px] text-cream/40">Click or drop to replace</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-tavazi-navy/60" />
                <p className="text-sm text-cream/50 text-center">
                  {viewsDropzone.isDragActive ? 'Drop here...' : 'Drop Views CSV or click'}
                </p>
                <p className="text-[11px] text-cream/30">Columns: Id, Content Name, Views</p>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
            Watch Duration CSV
          </label>
          <div
            {...durationDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-xl min-h-[120px] flex flex-col items-center justify-center gap-2 px-4 py-6 cursor-pointer transition-all ${
              durationFile
                ? 'border-green-500/50 bg-green-500/5'
                : durationDropzone.isDragActive
                  ? 'border-tavazi-navy bg-tavazi-navy/10'
                  : 'border-tavazi-navy/40 bg-tavazi-charcoal hover:border-tavazi-navy/70'
            }`}
          >
            <input {...durationDropzone.getInputProps()} />
            {durationFile ? (
              <>
                <Check className="w-6 h-6 text-green-500" />
                <p className="text-sm text-cream/70 text-center truncate max-w-full">{durationFile.name}</p>
                <p className="text-[11px] text-cream/40">Click or drop to replace</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-tavazi-navy/60" />
                <p className="text-sm text-cream/50 text-center">
                  {durationDropzone.isDragActive ? 'Drop here...' : 'Drop Duration CSV or click'}
                </p>
                <p className="text-[11px] text-cream/30">Columns: Id, Content Name, Watch Duration</p>
              </>
            )}
          </div>
        </div>
      </div>

      {mergedRows.length > 0 && (
        <>
          {warningCount > 0 && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{warningCount} item{warningCount > 1 ? 's' : ''} with mismatched data</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-tavazi-navy/15">
                  <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Content Name</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Views</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Watch Hrs</th>
                </tr>
              </thead>
              <tbody>
                {mergedRows.map((row) => (
                  <tr
                    key={row.content_id}
                    className={`border-b border-tavazi-navy/5 ${
                      row.missingFrom ? 'bg-amber-500/8' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-sm text-cream">
                      <span>{row.content_title || '(unnamed)'}</span>
                      {row.missingFrom && (
                        <span className="ml-2 text-[11px] text-amber-400">
                          Missing from {row.missingFrom === 'views' ? 'Views' : 'Duration'} export
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">
                      {row.total_streams.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">
                      {row.watch_time_hrs.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="px-6 py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : 'Confirm Import'}
          </button>
        </>
      )}
    </div>
  );
}
