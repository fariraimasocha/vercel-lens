export interface DeploymentMeta {
  githubCommitMessage?: string;
}

export interface Deployment {
  createdAt?: number;
  alias?: string[];
  meta?: DeploymentMeta;
}

export interface GitLink {
  repo?: string;
  org?: string;
}

export interface AliasEntry {
  domain: string;
}

export interface ProductionTarget {
  alias?: string[];
}

export interface Targets {
  production?: ProductionTarget;
}

export interface EnvironmentDomain {
  name: string;
  redirect?: string;
}

export interface CustomEnvironment {
  type?: string;
  domains?: EnvironmentDomain[];
  currentDeploymentAliases?: string[];
}

export interface Project {
  id: string;
  name: string;
  accountId?: string;
  framework?: string;
  latestDeployments?: Deployment[];
  updatedAt?: number;
  targets?: Targets;
  link?: GitLink;
  alias?: AliasEntry[];
  customEnvironments?: CustomEnvironment[];
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface ProjectDomain {
  name: string;
  verified?: boolean;
  redirect?: string;
}

export interface ProjectDomainsResponse {
  domains: ProjectDomain[];
}

export function isVercelDomain(domain: string): boolean {
  const normalized = domain.toLowerCase();
  return normalized === 'vercel.app' || normalized.endsWith('.vercel.app');
}

export function getTeamId(project: Project): string | undefined {
  if (!project.accountId) return undefined;
  return project.accountId.startsWith('team_') ? project.accountId : undefined;
}

export function getLastDeployment(project: Project): Deployment | undefined {
  return project.latestDeployments?.[0];
}

function deduplicateDomains(groups: string[][]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const group of groups) {
    for (const domain of group) {
      const normalized = domain.trim();
      if (!normalized) continue;
      const key = normalized.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(normalized);
      }
    }
  }
  return result;
}

export function getPrimaryDomain(project: Project): string | undefined {
  const productionEnv = project.customEnvironments?.find(e => e.type === 'production');
  const lastDeploy = getLastDeployment(project);

  const nonRedirectDomains = productionEnv?.domains?.filter(d => !d.redirect).map(d => d.name) ?? [];
  const redirectDomains = productionEnv?.domains?.filter(d => d.redirect).map(d => d.name) ?? [];
  const preferredDomains = [...nonRedirectDomains, ...redirectDomains];

  const allAliases = deduplicateDomains([
    lastDeploy?.alias ?? [],
    productionEnv?.currentDeploymentAliases ?? [],
    project.targets?.production?.alias ?? [],
    project.alias?.map(a => a.domain) ?? [],
    preferredDomains,
  ]);

  if (allAliases.length === 0) return undefined;

  const custom = allAliases.find(d => !isVercelDomain(d));
  if (custom) return custom;

  const vercelDomains = allAliases.filter(d => isVercelDomain(d));
  if (vercelDomains.length === 0) return undefined;
  return vercelDomains.reduce((a, b) => (a.length <= b.length ? a : b));
}

export function needsPrimaryDomainRefresh(project: Project): boolean {
  const domain = getPrimaryDomain(project);
  if (!domain) return true;
  return isVercelDomain(domain);
}
