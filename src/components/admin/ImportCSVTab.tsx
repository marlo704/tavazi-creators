import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, AlertTriangle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { recalculatePayouts } from '../../lib/payouts';

interface CSVRow {
  content_title: string;
  total_streams: number;
  unique_viewers: number;
  watch_time_hrs: number;
  matched_creator_id: string | null;
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

export default function ImportCSVTab() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [creatorId, setCreatorId] = useState('');
  const [creators, setCreators] = useState<Array<{ id: string; name: string }>>([]);
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows: CSVRow[] = (results.data as Record<string, string>[]).map((row) => {
            const durationSec = parseFloat(row['Duration'] || row['duration'] || '0');
            return {
              content_title: row['Name'] || row['name'] || row['Title'] || row['title'] || '',
              total_streams: parseInt(row['Total Views'] || row['total_views'] || '0', 10),
              unique_viewers: parseInt(row['Unique Views'] || row['unique_views'] || '0', 10),
              watch_time_hrs: durationSec / 3600,
              matched_creator_id: creatorId || null,
            };
          });
          setParsedRows(rows);
          toast.success(`Parsed ${rows.length} rows from CSV`);
        },
        error: (err: Error) => {
          toast.error('CSV parse error: ' + err.message);
        },
      });
    },
    [creatorId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleImport = async () => {
    if (!creatorId) {
      toast.error('Select a creator first');
      return;
    }
    if (parsedRows.length === 0) {
      toast.error('No data to import');
      return;
    }

    setImporting(true);

    const totalStreams = parsedRows.reduce((s, r) => s + r.total_streams, 0);
    const totalViewers = parsedRows.reduce((s, r) => s + r.unique_viewers, 0);
    const totalHours = parsedRows.reduce((s, r) => s + r.watch_time_hrs, 0);
    const avgCompletion = 0;

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
      setImporting(false);
      return;
    }

    toast.success(`Analytics imported for ${month}`);
    await recalculatePayouts(month);
    setParsedRows([]);
    setImporting(false);
  };

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

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl min-h-[100px] flex flex-col items-center justify-center gap-3 px-6 py-8 cursor-pointer transition-all ${
          isDragActive
            ? 'border-tavazi-navy bg-tavazi-navy/10'
            : 'border-tavazi-navy/40 bg-tavazi-charcoal hover:border-tavazi-navy/70'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-tavazi-navy/60" />
        <p className="text-sm text-cream/50 text-center">
          {isDragActive
            ? 'Drop the CSV file here...'
            : 'Drop Muvi Analytics CSV here or click to browse'}
        </p>
        <p className="text-[11px] text-cream/30">.csv files only</p>
      </div>

      {parsedRows.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-tavazi-navy/15">
                  <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Title</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Streams</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Unique</th>
                  <th className="text-right py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Watch Hrs</th>
                  <th className="text-center py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-cream/50">Match</th>
                </tr>
              </thead>
              <tbody>
                {parsedRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-tavazi-navy/5 ${
                      !row.matched_creator_id ? 'bg-gold-accent/5' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-sm text-cream">
                      {row.content_title || '(unnamed)'}
                      {!row.matched_creator_id && (
                        <AlertTriangle className="w-3 h-3 text-gold-accent inline ml-2" />
                      )}
                    </td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">{row.total_streams.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">{row.unique_viewers.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-sm text-cream/70 tabular-nums">{row.watch_time_hrs.toFixed(1)}</td>
                    <td className="py-2 px-3 text-center">
                      {row.matched_creator_id ? (
                        <Check className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-gold-accent mx-auto" />
                      )}
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
