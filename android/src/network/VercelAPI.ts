import {
  AnalyticsOverview,
  TimeseriesPoint,
  TimeseriesResponse,
  BreakdownItem,
  parseTimeseriesDate,
} from '../models/Analytics';
import {
  Project,
  ProjectsResponse,
  ProjectDomainsResponse,
  getTeamId,
  needsPrimaryDomainRefresh,
} from '../models/Project';

export type APIErrorCode = 'unauthorized' | 'server_error' | 'decoding_error' | 'network_error';

export class APIError extends Error {
  code: APIErrorCode;
  statusCode?: number;

  constructor(code: APIErrorCode, message: string, statusCode?: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

const PROJECTS_BASE = 'https://api.vercel.com';
const ANALYTICS_BASE = 'https://vercel.com/api';

async function request<T>(token: string, url: string): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch (e: any) {
    throw new APIError('network_error', e?.message ?? 'Network error');
  }

  if (resp.status === 401 || resp.status === 403) {
    throw new APIError('unauthorized', 'Session expired. Please log in again.', resp.status);
  }
  if (!resp.ok) {
    const msg =
      resp.status === 400
        ? 'Bad Request (400). Please ensure Web Analytics is enabled for this project on Vercel and your plan supports the selected time range.'
        : `Server error (${resp.status}). Try again later.`;
    throw new APIError('server_error', msg, resp.status);
  }

  try {
    return (await resp.json()) as T;
  } catch {
    throw new APIError('decoding_error', 'Failed to parse response.');
  }
}

function buildUrl(base: string, path: string, params: Record<string, string | undefined>): string {
  const url = new URL(`${base}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, v);
  }
  return url.toString();
}

export async function fetchProjects(token: string): Promise<Project[]> {
  const data = await request<ProjectsResponse>(token, `${PROJECTS_BASE}/v9/projects`);
  return enrichProjectsNeedingDomainRefresh(token, data.projects);
}

async function enrichProjectsNeedingDomainRefresh(token: string, projects: Project[]): Promise<Project[]> {
  const candidates = projects.filter(needsPrimaryDomainRefresh);
  if (candidates.length === 0) return projects;

  const enriched = await Promise.all(
    candidates.map(async p => {
      const teamId = getTeamId(p);
      const [refreshed, domains] = await Promise.all([
        fetchProject(token, p.id, teamId).catch(() => p),
        fetchProjectDomains(token, p.id, teamId).catch(() => [] as string[]),
      ]);
      if (domains.length > 0) {
        const newEntries = domains.map(d => ({ domain: d }));
        return { ...refreshed, alias: [...(refreshed.alias ?? []), ...newEntries] };
      }
      return refreshed;
    })
  );

  const byId = Object.fromEntries(enriched.map(p => [p.id, p]));
  return projects.map(p => byId[p.id] ?? p);
}

export async function fetchProject(token: string, id: string, teamId?: string): Promise<Project> {
  const url = buildUrl(PROJECTS_BASE, `/v9/projects/${id}`, { teamId });
  return request<Project>(token, url);
}

export async function fetchProjectDomains(token: string, projectId: string, teamId?: string): Promise<string[]> {
  const url = buildUrl(PROJECTS_BASE, `/v9/projects/${projectId}/domains`, { teamId });
  const data = await request<ProjectDomainsResponse>(token, url);
  return data.domains.filter(d => (d.verified !== false) && !d.redirect).map(d => d.name);
}

function analyticsParams(
  projectId: string,
  teamId: string | undefined,
  from: string,
  to: string,
  environment: string | undefined,
  groupBy?: string
): Record<string, string | undefined> {
  return { projectId, teamId, from, to, environment, groupBy };
}

export async function fetchOverview(
  token: string,
  projectId: string,
  teamId: string | undefined,
  from: string,
  to: string,
  environment: string | undefined
): Promise<AnalyticsOverview> {
  const url = buildUrl(ANALYTICS_BASE, '/web-analytics/overview', analyticsParams(projectId, teamId, from, to, environment));
  return request<AnalyticsOverview>(token, url);
}

export async function fetchTimeseries(
  token: string,
  projectId: string,
  teamId: string | undefined,
  from: string,
  to: string,
  environment: string | undefined
): Promise<TimeseriesPoint[]> {
  const url = buildUrl(ANALYTICS_BASE, '/web-analytics/timeseries', analyticsParams(projectId, teamId, from, to, environment));
  const data = await request<TimeseriesResponse>(token, url);
  const points = data.data.groups['all'] ?? [];
  return points.map(p => ({ ...p, date: parseTimeseriesDate(p.key) }));
}

export async function fetchBreakdown(
  token: string,
  projectId: string,
  teamId: string | undefined,
  from: string,
  to: string,
  groupBy: string,
  environment: string | undefined
): Promise<BreakdownItem[]> {
  const url = buildUrl(ANALYTICS_BASE, '/web-analytics/timeseries', analyticsParams(projectId, teamId, from, to, environment, groupBy));
  const data = await request<TimeseriesResponse>(token, url);
  const items: BreakdownItem[] = Object.entries(data.data.groups)
    .filter(([key]) => key !== 'all')
    .map(([key, points]) => ({
      key,
      visitors: points.reduce((sum, p) => sum + p.devices, 0),
    }));
  return items.sort((a, b) => b.visitors - a.visitors);
}
