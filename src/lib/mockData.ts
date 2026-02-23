export interface Creator {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_initials: string;
  revenue_share: number;
  role: 'creator' | 'admin';
  created_at: string;
}

export interface Title {
  id: string;
  creator_id: string;
  title: string;
  category: string;
  type: 'movie' | 'series' | 'documentary' | 'event' | 'short_film';
  status: 'published' | 'draft' | 'processing';
  monetisation: 'svod' | 'ppv';
  thumbnail_url: string;
  total_streams: number;
  unique_viewers: number;
  watch_hours: number;
  avg_completion: number;
  gross_revenue: number;
  created_at: string;
}

export interface MonthlyMetric {
  id: string;
  creator_id: string;
  report_month: string;
  total_streams: number;
  unique_viewers: number;
  watch_hours: number;
  avg_completion: number;
  gross_revenue: number;
  platform_fee: number;
  creator_payout: number;
}

export interface SVODPool {
  id: string;
  report_month: string;
  total_pool: number;
  platform_total_streams: number;
}

export interface PPVTransaction {
  id: string;
  creator_id: string;
  title_id: string;
  report_month: string;
  units_sold: number;
  price_kes: number;
  gross: number;
  titles?: { title: string };
}

export interface Payout {
  id: string;
  creator_id: string;
  report_month: string;
  gross_svod: number;
  gross_ppv: number;
  platform_fee: number;
  net_payout: number;
  status: 'pending' | 'paid';
  reference: string;
}

export const creators: Creator[] = [
  {
    id: 'c1',
    user_id: 'u1',
    name: 'Amara Okonkwo',
    email: 'amara@example.com',
    avatar_initials: 'AO',
    revenue_share: 0.65,
    role: 'creator',
    created_at: '2024-06-15',
  },
  {
    id: 'c2',
    user_id: 'u2',
    name: 'Kofi Mensah',
    email: 'kofi@example.com',
    avatar_initials: 'KM',
    revenue_share: 0.60,
    role: 'creator',
    created_at: '2024-08-01',
  },
  {
    id: 'c3',
    user_id: 'u3',
    name: 'Thandiwe Nkosi',
    email: 'thandiwe@example.com',
    avatar_initials: 'TN',
    revenue_share: 0.70,
    role: 'admin',
    created_at: '2024-03-10',
  },
];

export const titles: Title[] = [
  {
    id: 't1',
    creator_id: 'c1',
    title: 'Echoes of the Sahel',
    category: 'Documentary',
    type: 'documentary',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=300&h=170&fit=crop',
    total_streams: 14520,
    unique_viewers: 8340,
    watch_hours: 1245,
    avg_completion: 78,
    gross_revenue: 435600,
    created_at: '2024-07-01',
  },
  {
    id: 't2',
    creator_id: 'c1',
    title: 'Lagos After Dark',
    category: 'Drama',
    type: 'movie',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&h=170&fit=crop',
    total_streams: 22180,
    unique_viewers: 15600,
    watch_hours: 3102,
    avg_completion: 85,
    gross_revenue: 665400,
    created_at: '2024-08-15',
  },
  {
    id: 't3',
    creator_id: 'c1',
    title: 'The Fisherman\'s Daughter',
    category: 'Drama',
    type: 'short_film',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=170&fit=crop',
    total_streams: 8900,
    unique_viewers: 6200,
    watch_hours: 445,
    avg_completion: 92,
    gross_revenue: 178000,
    created_at: '2024-09-20',
  },
  {
    id: 't4',
    creator_id: 'c1',
    title: 'Market Day: Stories',
    category: 'Culture',
    type: 'series',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=300&h=170&fit=crop',
    total_streams: 31200,
    unique_viewers: 18400,
    watch_hours: 5200,
    avg_completion: 71,
    gross_revenue: 936000,
    created_at: '2024-10-05',
  },
  {
    id: 't5',
    creator_id: 'c1',
    title: 'Rhythms of Accra',
    category: 'Music',
    type: 'documentary',
    status: 'processing',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&h=170&fit=crop',
    total_streams: 0,
    unique_viewers: 0,
    watch_hours: 0,
    avg_completion: 0,
    gross_revenue: 0,
    created_at: '2025-01-10',
  },
  {
    id: 't6',
    creator_id: 'c1',
    title: 'Nairobi Live Concert',
    category: 'Entertainment',
    type: 'event',
    status: 'published',
    monetisation: 'ppv',
    thumbnail_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=170&fit=crop',
    total_streams: 4200,
    unique_viewers: 3800,
    watch_hours: 840,
    avg_completion: 88,
    gross_revenue: 210000,
    created_at: '2024-12-01',
  },
  {
    id: 't7',
    creator_id: 'c2',
    title: 'Gold Coast Dreams',
    category: 'Drama',
    type: 'movie',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=300&h=170&fit=crop',
    total_streams: 19800,
    unique_viewers: 12100,
    watch_hours: 2640,
    avg_completion: 80,
    gross_revenue: 594000,
    created_at: '2024-09-01',
  },
  {
    id: 't8',
    creator_id: 'c2',
    title: 'Volta Rising',
    category: 'Documentary',
    type: 'documentary',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&h=170&fit=crop',
    total_streams: 11400,
    unique_viewers: 7800,
    watch_hours: 1520,
    avg_completion: 74,
    gross_revenue: 342000,
    created_at: '2024-10-15',
  },
  {
    id: 't9',
    creator_id: 'c3',
    title: 'Johannesburg Uncut',
    category: 'Culture',
    type: 'series',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=300&h=170&fit=crop',
    total_streams: 42500,
    unique_viewers: 28300,
    watch_hours: 7120,
    avg_completion: 68,
    gross_revenue: 1275000,
    created_at: '2024-05-20',
  },
  {
    id: 't10',
    creator_id: 'c3',
    title: 'Table Mountain Diaries',
    category: 'Documentary',
    type: 'documentary',
    status: 'published',
    monetisation: 'svod',
    thumbnail_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&h=170&fit=crop',
    total_streams: 16700,
    unique_viewers: 11200,
    watch_hours: 2230,
    avg_completion: 82,
    gross_revenue: 501000,
    created_at: '2024-07-10',
  },
];

export const svodPools: SVODPool[] = [
  { id: 'sp1', report_month: '2024-07', total_pool: 2400000, platform_total_streams: 48000 },
  { id: 'sp2', report_month: '2024-08', total_pool: 3100000, platform_total_streams: 62000 },
  { id: 'sp3', report_month: '2024-09', total_pool: 3800000, platform_total_streams: 76000 },
  { id: 'sp4', report_month: '2024-10', total_pool: 4500000, platform_total_streams: 90000 },
  { id: 'sp5', report_month: '2024-11', total_pool: 5200000, platform_total_streams: 104000 },
  { id: 'sp6', report_month: '2024-12', total_pool: 5800000, platform_total_streams: 116000 },
  { id: 'sp7', report_month: '2025-01', total_pool: 6400000, platform_total_streams: 128000 },
];

export const ppvTransactions: PPVTransaction[] = [
  { id: 'ppv1', creator_id: 'c1', title_id: 't6', report_month: '2024-12', units_sold: 420, price_kes: 500, gross: 210000, titles: { title: 'Nairobi Live Concert' } },
  { id: 'ppv2', creator_id: 'c1', title_id: 't6', report_month: '2025-01', units_sold: 180, price_kes: 500, gross: 90000, titles: { title: 'Nairobi Live Concert' } },
];

export const monthlyMetrics: MonthlyMetric[] = [
  { id: 'm1', creator_id: 'c1', report_month: '2024-07', total_streams: 3200, unique_viewers: 2100, watch_hours: 280, avg_completion: 72, gross_revenue: 96000, platform_fee: 33600, creator_payout: 62400 },
  { id: 'm2', creator_id: 'c1', report_month: '2024-08', total_streams: 8400, unique_viewers: 5600, watch_hours: 720, avg_completion: 76, gross_revenue: 252000, platform_fee: 88200, creator_payout: 163800 },
  { id: 'm3', creator_id: 'c1', report_month: '2024-09', total_streams: 12100, unique_viewers: 8200, watch_hours: 1050, avg_completion: 79, gross_revenue: 363000, platform_fee: 127050, creator_payout: 235950 },
  { id: 'm4', creator_id: 'c1', report_month: '2024-10', total_streams: 18500, unique_viewers: 12400, watch_hours: 1680, avg_completion: 81, gross_revenue: 555000, platform_fee: 194250, creator_payout: 360750 },
  { id: 'm5', creator_id: 'c1', report_month: '2024-11', total_streams: 21300, unique_viewers: 14800, watch_hours: 2100, avg_completion: 83, gross_revenue: 639000, platform_fee: 223650, creator_payout: 415350 },
  { id: 'm6', creator_id: 'c1', report_month: '2024-12', total_streams: 24800, unique_viewers: 17200, watch_hours: 2540, avg_completion: 80, gross_revenue: 744000, platform_fee: 260400, creator_payout: 483600 },
  { id: 'm7', creator_id: 'c1', report_month: '2025-01', total_streams: 28400, unique_viewers: 19600, watch_hours: 2890, avg_completion: 82, gross_revenue: 852000, platform_fee: 298200, creator_payout: 553800 },
  { id: 'm8', creator_id: 'c2', report_month: '2024-09', total_streams: 5200, unique_viewers: 3400, watch_hours: 480, avg_completion: 74, gross_revenue: 156000, platform_fee: 62400, creator_payout: 93600 },
  { id: 'm9', creator_id: 'c2', report_month: '2024-10', total_streams: 9800, unique_viewers: 6500, watch_hours: 920, avg_completion: 77, gross_revenue: 294000, platform_fee: 117600, creator_payout: 176400 },
  { id: 'm10', creator_id: 'c2', report_month: '2024-11', total_streams: 13200, unique_viewers: 8700, watch_hours: 1280, avg_completion: 78, gross_revenue: 396000, platform_fee: 158400, creator_payout: 237600 },
  { id: 'm11', creator_id: 'c2', report_month: '2024-12', total_streams: 16400, unique_viewers: 10800, watch_hours: 1620, avg_completion: 76, gross_revenue: 492000, platform_fee: 196800, creator_payout: 295200 },
  { id: 'm12', creator_id: 'c2', report_month: '2025-01', total_streams: 19200, unique_viewers: 12900, watch_hours: 1940, avg_completion: 79, gross_revenue: 576000, platform_fee: 230400, creator_payout: 345600 },
  { id: 'm13', creator_id: 'c3', report_month: '2024-05', total_streams: 7800, unique_viewers: 5200, watch_hours: 640, avg_completion: 70, gross_revenue: 234000, platform_fee: 70200, creator_payout: 163800 },
  { id: 'm14', creator_id: 'c3', report_month: '2024-06', total_streams: 14200, unique_viewers: 9800, watch_hours: 1280, avg_completion: 73, gross_revenue: 426000, platform_fee: 127800, creator_payout: 298200 },
  { id: 'm15', creator_id: 'c3', report_month: '2024-07', total_streams: 19600, unique_viewers: 13400, watch_hours: 1860, avg_completion: 76, gross_revenue: 588000, platform_fee: 176400, creator_payout: 411600 },
  { id: 'm16', creator_id: 'c3', report_month: '2024-08', total_streams: 25100, unique_viewers: 17200, watch_hours: 2440, avg_completion: 74, gross_revenue: 753000, platform_fee: 225900, creator_payout: 527100 },
  { id: 'm17', creator_id: 'c3', report_month: '2024-09', total_streams: 31400, unique_viewers: 21600, watch_hours: 3120, avg_completion: 77, gross_revenue: 942000, platform_fee: 282600, creator_payout: 659400 },
  { id: 'm18', creator_id: 'c3', report_month: '2024-10', total_streams: 38200, unique_viewers: 26100, watch_hours: 3840, avg_completion: 75, gross_revenue: 1146000, platform_fee: 343800, creator_payout: 802200 },
  { id: 'm19', creator_id: 'c3', report_month: '2024-11', total_streams: 42800, unique_viewers: 29400, watch_hours: 4560, avg_completion: 78, gross_revenue: 1284000, platform_fee: 385200, creator_payout: 898800 },
];

export function getCreatorById(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}

export function getTitlesByCreator(creatorId: string): Title[] {
  return titles.filter((t) => t.creator_id === creatorId);
}

export function getMetricsByCreator(creatorId: string): MonthlyMetric[] {
  return monthlyMetrics.filter((m) => m.creator_id === creatorId);
}

export function getCurrentCreator(): Creator {
  return creators[0];
}

export function getLatestMetrics(creatorId: string): MonthlyMetric | undefined {
  const metrics = getMetricsByCreator(creatorId);
  return metrics[metrics.length - 1];
}

export function getSVODPoolByMonth(month: string): SVODPool | undefined {
  return svodPools.find((p) => p.report_month === month);
}

export function getPPVByCreatorMonth(creatorId: string, month: string): PPVTransaction[] {
  return ppvTransactions.filter((p) => p.creator_id === creatorId && p.report_month === month);
}

export function getCreatorKPIs(creatorId: string) {
  const creatorTitles = getTitlesByCreator(creatorId);
  const metrics = getMetricsByCreator(creatorId);
  const latest = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];

  const totalStreams = creatorTitles.reduce((s, t) => s + t.total_streams, 0);
  const uniqueViewers = creatorTitles.reduce((s, t) => s + t.unique_viewers, 0);
  const watchHours = creatorTitles.reduce((s, t) => s + t.watch_hours, 0);
  const activeTitles = creatorTitles.filter((t) => t.avg_completion > 0);
  const avgCompletion = activeTitles.length > 0
    ? Math.round(activeTitles.reduce((s, t) => s + t.avg_completion, 0) / activeTitles.length)
    : 0;
  const grossRevenue = latest?.gross_revenue ?? 0;
  const platformFee = latest?.platform_fee ?? 0;
  const creatorPayout = latest?.creator_payout ?? 0;

  const streamsTrend = previous
    ? Math.round(((latest!.total_streams - previous.total_streams) / previous.total_streams) * 100)
    : 0;
  const revenueTrend = previous
    ? Math.round(((latest!.gross_revenue - previous.gross_revenue) / previous.gross_revenue) * 100)
    : 0;

  return {
    totalStreams,
    uniqueViewers,
    watchHours,
    avgCompletion,
    grossRevenue,
    platformFee,
    creatorPayout,
    streamsTrend,
    revenueTrend,
    titleCount: creatorTitles.filter((t) => t.status === 'published').length,
  };
}

export function formatKES(value: number): string {
  if (value >= 1000000) return `KES ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `KES ${(value / 1000).toFixed(0)}K`;
  return `KES ${value}`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}
