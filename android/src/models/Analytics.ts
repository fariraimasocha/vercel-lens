export interface AnalyticsOverview {
  total: number;
  devices: number;
  bounceRate: number;
}

export interface TimeseriesPoint {
  key: string;
  total: number;
  devices: number;
  bounceRate: number;
  date?: Date;
}

export interface TimeseriesData {
  groups: Record<string, TimeseriesPoint[]>;
}

export interface TimeseriesResponse {
  data: TimeseriesData;
}

export interface BreakdownItem {
  key: string;
  visitors: number;
}

export interface AnalyticsData {
  overview?: AnalyticsOverview;
  previousOverview?: AnalyticsOverview;
  timeseries: TimeseriesPoint[];
  pages: BreakdownItem[];
  referrers: BreakdownItem[];
  countries: BreakdownItem[];
  devices: BreakdownItem[];
  os: BreakdownItem[];
  browsers: BreakdownItem[];
  utmSources: BreakdownItem[];
  routes: BreakdownItem[];
  hostnames: BreakdownItem[];
  events: BreakdownItem[];
  flags: BreakdownItem[];
  queryParams: BreakdownItem[];
}

export function getVisitorsChange(data: AnalyticsData): number | undefined {
  const c = data.overview?.devices;
  const p = data.previousOverview?.devices;
  if (c == null || p == null || p === 0) return undefined;
  return ((c - p) / p) * 100;
}

export function getPageViewsChange(data: AnalyticsData): number | undefined {
  const c = data.overview?.total;
  const p = data.previousOverview?.total;
  if (c == null || p == null || p === 0) return undefined;
  return ((c - p) / p) * 100;
}

export function getBounceRateChange(data: AnalyticsData): number | undefined {
  const c = data.overview?.bounceRate;
  const p = data.previousOverview?.bounceRate;
  if (c == null || p == null || p === 0) return undefined;
  return c - p;
}

export function parseTimeseriesDate(key: string): Date | undefined {
  const d = new Date(key);
  if (!isNaN(d.getTime())) return d;
  return undefined;
}

export type TimeRangeKey = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface TimeRangeConfig {
  key: TimeRangeKey;
  label: string;
  shortLabel: string;
  intervalMs: number;
}

export const TIME_RANGES: TimeRangeConfig[] = [
  { key: 'day',     label: 'Last 24 Hours',   shortLabel: '24h',  intervalMs: 86400000   },
  { key: 'week',    label: 'Last 7 Days',      shortLabel: '7d',   intervalMs: 604800000  },
  { key: 'month',   label: 'Last 30 Days',     shortLabel: '30d',  intervalMs: 2592000000 },
  { key: 'quarter', label: 'Last 3 Months',    shortLabel: '3mo',  intervalMs: 7776000000 },
  { key: 'year',    label: 'Last 12 Months',   shortLabel: '12mo', intervalMs: 31536000000},
];

function formatISO(date: Date): string {
  return date.toISOString();
}

export function getTimeRangeDates(range: TimeRangeConfig) {
  const now = new Date();
  const from = new Date(now.getTime() - range.intervalMs);
  const previousFrom = new Date(now.getTime() - range.intervalMs * 2);
  return {
    fromDate: formatISO(from),
    toDate: formatISO(now),
    previousFromDate: formatISO(previousFrom),
    previousToDate: formatISO(from),
  };
}

export type EnvironmentKey = 'production' | 'preview' | 'all';

export interface EnvironmentConfig {
  key: EnvironmentKey;
  label: string;
  queryValue?: string;
}

export const ENVIRONMENTS: EnvironmentConfig[] = [
  { key: 'production', label: 'Production', queryValue: 'production' },
  { key: 'preview',    label: 'Preview',    queryValue: 'preview' },
  { key: 'all',        label: 'All Environments', queryValue: undefined },
];
