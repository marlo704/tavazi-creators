import type { Creator, Title, MonthlyMetric } from './mockData';
import { formatKES, formatNumber } from './mockData';
import { calcAttribution, calcGrossSVOD, calcCreatorPayout, calcPlatformFee } from './calculations';
import type { SVODPool, PPVTransaction } from './mockData';

interface ExportData {
  creator: Creator;
  titles: Title[];
  metrics: MonthlyMetric[];
  svodPool?: SVODPool;
  ppvItems: PPVTransaction[];
  month: string;
}

export function openPrintReport(data: ExportData) {
  const { creator, titles, metrics, svodPool, ppvItems, month } = data;

  const latestMetric = metrics[metrics.length - 1];
  const creatorStreams = latestMetric?.total_streams ?? 0;
  const platformStreams = svodPool?.platform_total_streams ?? 0;
  const pool = svodPool?.total_pool ?? 0;
  const attribution = calcAttribution(creatorStreams, platformStreams);
  const grossSVOD = calcGrossSVOD(pool, attribution);
  const totalPPV = ppvItems.reduce((s, p) => s + p.gross, 0);
  const grossTotal = grossSVOD + totalPPV;
  const share = creator.revenue_share;
  const fee = calcPlatformFee(grossTotal, share);
  const payout = calcCreatorPayout(grossTotal, share);

  const totalStreams = titles.reduce((s, t) => s + t.total_streams, 0);
  const uniqueViewers = titles.reduce((s, t) => s + t.unique_viewers, 0);
  const watchHours = titles.reduce((s, t) => s + t.watch_hours, 0);
  const activeTitles = titles.filter((t) => t.avg_completion > 0);
  const avgCompletion = activeTitles.length > 0
    ? Math.round(activeTitles.reduce((s, t) => s + t.avg_completion, 0) / activeTitles.length)
    : 0;

  const monthLabel = new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
  const sharePercent = Math.round(share * 100);
  const ref = `TAV-${creator.id.slice(0, 8).toUpperCase()}-${month.replace('-', '')}`;

  const titleRows = titles
    .filter((t) => t.status === 'published')
    .map(
      (t) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #ddd;">${t.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:right;">${formatNumber(t.total_streams)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:right;">${formatNumber(t.unique_viewers)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:right;">${formatNumber(t.watch_hours)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:right;">${t.avg_completion}%</td>
        <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:center;">${t.monetisation.toUpperCase()}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Creator Report - ${creator.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Serif+Display&display=swap');
  @media print {
    * { background: white !important; color: black !important; box-shadow: none !important; }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }
  body {
    font-family: 'DM Sans', sans-serif;
    margin: 0;
    padding: 40px;
    color: #1a1a1a;
    max-width: 900px;
    margin: 0 auto;
  }
  h1, h2, h3 { font-family: 'DM Serif Display', serif; margin: 0; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1971C2; padding-bottom: 20px; margin-bottom: 30px; }
  .header img { height: 40px; }
  .header h1 { font-size: 18px; color: #1971C2; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
  .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
  .kpi-item { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
  .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: #888; margin-bottom: 4px; }
  .kpi-value { font-family: 'DM Serif Display', serif; font-size: 22px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
  th { text-align: left; padding: 8px 12px; border-bottom: 2px solid #1971C2; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #666; }
  .revenue-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 30px; }
  .revenue-item { border: 1px solid #ddd; border-radius: 8px; padding: 14px; }
  .revenue-item.payout { border: 2px solid #22C55E; }
  .footer { border-top: 1px solid #ddd; padding-top: 16px; font-size: 11px; color: #999; text-align: center; }
</style>
</head>
<body onload="window.print()">
  <div class="header">
    <div>
      <h1>CREATOR PERFORMANCE REPORT</h1>
      <p style="font-size:12px;color:#666;margin-top:4px;">Tavazi Creator Analytics</p>
    </div>
    <img src="/assets/tavazi-logo.png" alt="Tavazi" style="height:40px;" />
  </div>

  <div class="subtitle">
    <strong>${creator.name}</strong> &nbsp;|&nbsp; Revenue Share ${sharePercent}% &nbsp;|&nbsp; Reporting Period: ${monthLabel}
  </div>

  <h2 style="font-size:16px;margin-bottom:16px;">Key Metrics</h2>
  <div class="kpi-grid">
    <div class="kpi-item">
      <div class="kpi-label">Total Streams</div>
      <div class="kpi-value">${formatNumber(totalStreams)}</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-label">Unique Viewers</div>
      <div class="kpi-value">${formatNumber(uniqueViewers)}</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-label">Watch Hours</div>
      <div class="kpi-value">${formatNumber(watchHours)}</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-label">Avg Completion</div>
      <div class="kpi-value">${avgCompletion}%</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-label">Gross Revenue</div>
      <div class="kpi-value">${formatKES(latestMetric?.gross_revenue ?? 0)}</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-label">Platform Fee</div>
      <div class="kpi-value">${formatKES(latestMetric?.platform_fee ?? 0)}</div>
    </div>
    <div class="kpi-item" style="grid-column: span 2; border: 2px solid #22C55E;">
      <div class="kpi-label" style="color:#22C55E;">Net Creator Payout</div>
      <div class="kpi-value" style="color:#22C55E;">${formatKES(latestMetric?.creator_payout ?? 0)}</div>
    </div>
  </div>

  <h2 style="font-size:16px;margin-bottom:16px;">Content Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th style="text-align:right;">Streams</th>
        <th style="text-align:right;">Viewers</th>
        <th style="text-align:right;">Watch Hrs</th>
        <th style="text-align:right;">Completion</th>
        <th style="text-align:center;">Monetisation</th>
      </tr>
    </thead>
    <tbody>
      ${titleRows}
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2 style="font-size:16px;margin-bottom:16px;">Revenue Breakdown</h2>
  <div class="revenue-grid">
    <div class="revenue-item">
      <div class="kpi-label">Gross SVOD</div>
      <div class="kpi-value" style="font-size:18px;color:#1971C2;">${formatKES(grossSVOD)}</div>
    </div>
    <div class="revenue-item">
      <div class="kpi-label">Gross PPV</div>
      <div class="kpi-value" style="font-size:18px;color:#D4A853;">${formatKES(totalPPV)}</div>
    </div>
    <div class="revenue-item">
      <div class="kpi-label">Platform Fee</div>
      <div class="kpi-value" style="font-size:18px;color:#888;">${formatKES(fee)}</div>
    </div>
    <div class="revenue-item payout">
      <div class="kpi-label" style="color:#22C55E;">Net Creator Payout</div>
      <div class="kpi-value" style="font-size:18px;color:#22C55E;">${formatKES(payout)}</div>
    </div>
  </div>

  <div class="footer">
    Confidential &mdash; Tavazi.tv &nbsp;|&nbsp; Ref: ${ref}
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
