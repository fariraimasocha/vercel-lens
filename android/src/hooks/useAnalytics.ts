import { useState, useCallback } from 'react';
import {
  AnalyticsData,
  TimeRangeConfig,
  EnvironmentConfig,
  getTimeRangeDates,
} from '../models/Analytics';
import {
  fetchOverview,
  fetchTimeseries,
  fetchBreakdown,
} from '../network/VercelAPI';

const BREAKDOWNS = [
  { key: 'pages',       groupBy: 'path' },
  { key: 'referrers',   groupBy: 'referrer' },
  { key: 'countries',   groupBy: 'country' },
  { key: 'devices',     groupBy: 'device_type' },
  { key: 'os',          groupBy: 'os_name' },
  { key: 'browsers',    groupBy: 'client_name' },
  { key: 'utmSources',  groupBy: 'utm' },
  { key: 'routes',      groupBy: 'route' },
  { key: 'hostnames',   groupBy: 'hostname' },
  { key: 'events',      groupBy: 'event_name' },
  { key: 'flags',       groupBy: 'flags' },
  { key: 'queryParams', groupBy: 'query_params' },
] as const;

const EMPTY_DATA: AnalyticsData = {
  timeseries: [],
  pages: [],
  referrers: [],
  countries: [],
  devices: [],
  os: [],
  browsers: [],
  utmSources: [],
  routes: [],
  hostnames: [],
  events: [],
  flags: [],
  queryParams: [],
};

export function useAnalytics(projectId: string, teamId: string | undefined, token: string) {
  const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

  const load = useCallback(
    async (range: TimeRangeConfig, env: EnvironmentConfig) => {
      setIsLoading(true);
      setError(undefined);

      const { fromDate, toDate, previousFromDate, previousToDate } = getTimeRangeDates(range);
      const environment = env.queryValue;

      try {
        const [overview, previousOverview, timeseries, ...breakdownResults] = await Promise.all([
          fetchOverview(token, projectId, teamId, fromDate, toDate, environment),
          fetchOverview(token, projectId, teamId, previousFromDate, previousToDate, environment),
          fetchTimeseries(token, projectId, teamId, fromDate, toDate, environment),
          ...BREAKDOWNS.map(b =>
            fetchBreakdown(token, projectId, teamId, fromDate, toDate, b.groupBy, environment).catch(() => [])
          ),
        ]);

        const result: AnalyticsData = {
          overview,
          previousOverview,
          timeseries,
          ...Object.fromEntries(BREAKDOWNS.map((b, i) => [b.key, breakdownResults[i]])),
        } as AnalyticsData;

        setData(result);
        setLastUpdated(new Date());
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load analytics.');
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, teamId, token]
  );

  return { data, isLoading, error, lastUpdated, load };
}
