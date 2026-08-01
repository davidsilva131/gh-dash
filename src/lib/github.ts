// GitHub data service — fetches, transforms, and caches GitHub user data.
// Pure logic module: no Astro imports, no UI, no HTTP server.

import type {
  GitHubUserData,
  GitHubProfile,
  GitHubStats,
  Repo,
  ActivityEvent,
  ErrorType,
} from "./types";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const REST_BASE = "https://api.github.com";

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: GitHubUserData;
  timestamp: number;
}

// Module-level in-memory cache, keyed by lowercased username.
const cache = new Map<string, CacheEntry>();

/** Clears the in-memory cache (used by tests). */
export function clearCache(): void {
  cache.clear();
}

/** Typed error carrying the error classification from the spec. */
export class GitHubApiError extends Error {
  readonly type: ErrorType;
  readonly retryAfter?: string;

  constructor(type: ErrorType, message: string, retryAfter?: string) {
    super(message);
    this.name = "GitHubApiError";
    this.type = type;
    this.retryAfter = retryAfter;
  }
}

const USER_QUERY = `
query($username: String!) {
  user(login: $username) {
    login
    name
    avatarUrl
    bio
    company
    location
    websiteUrl
    followers { totalCount }
    following { totalCount }
    repositories(first: 30, ownerAffiliations: [OWNER], privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        primaryLanguage { name color }
        stargazerCount
        forkCount
        updatedAt
        url
      }
    }
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
          }
        }
      }
    }
  }
}
`;

interface GraphQLUserNode {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  websiteUrl: string | null;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: {
      name: string;
      description: string | null;
      primaryLanguage: { name: string; color: string } | null;
      stargazerCount: number;
      forkCount: number;
      updatedAt: string;
      url: string;
    }[];
  };
  contributionsCollection: {
    contributionCalendar: {
      weeks: { contributionDays: { contributionCount: number }[] }[];
    };
  };
}

interface GraphQLResponse {
  data?: { user: GraphQLUserNode | null };
  errors?: { type?: string; message?: string }[];
}

interface RESTEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: Record<string, unknown>;
}

function classifyHttpError(status: number, headers: Headers, fallbackMessage: string): GitHubApiError {
  if (status === 404) {
    return new GitHubApiError("not_found", "User not found");
  }
  if (status === 403 && headers.get("x-ratelimit-remaining") === "0") {
    const reset = headers.get("x-ratelimit-reset");
    const retryAfter = reset ? new Date(Number(reset) * 1000).toISOString() : undefined;
    return new GitHubApiError("rate_limited", "GitHub API rate limit exceeded", retryAfter);
  }
  return new GitHubApiError("network", fallbackMessage);
}

function classifyGraphQLErrors(errors: { type?: string; message?: string }[]): GitHubApiError | null {
  for (const err of errors) {
    if (err.type === "NOT_FOUND") {
      return new GitHubApiError("not_found", "User not found");
    }
    if (err.type === "RATE_LIMITED" || /rate limit/i.test(err.message ?? "")) {
      return new GitHubApiError("rate_limited", "GitHub API rate limit exceeded");
    }
  }
  return null;
}

async function fetchGraphQL(username: string, token: string, signal?: AbortSignal): Promise<GraphQLUserNode> {
  let res: Response;
  try {
    res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: USER_QUERY, variables: { username } }),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new GitHubApiError("network", "Could not reach GitHub API");
  }

  const body = (await res.json().catch(() => ({}))) as GraphQLResponse;

  if (!res.ok) {
    throw classifyHttpError(res.status, res.headers, `GitHub GraphQL API error (${res.status})`);
  }
  if (body.errors && body.errors.length > 0) {
    const classified = classifyGraphQLErrors(body.errors);
    if (classified) throw classified;
    // Unclassified GraphQL error (e.g. invalid query) — surface GitHub's real
    // message instead of misreporting the user as not found.
    throw new GitHubApiError(
      "network",
      body.errors[0]?.message ?? "GitHub GraphQL API error",
    );
  }
  if (!body.data?.user) {
    throw new GitHubApiError("not_found", "User not found");
  }
  return body.data.user;
}

async function fetchEvents(username: string, token: string, signal?: AbortSignal): Promise<RESTEvent[]> {
  let res: Response;
  try {
    res = await fetch(`${REST_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=100`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new GitHubApiError("network", "Could not reach GitHub API");
  }

  if (!res.ok) {
    throw classifyHttpError(res.status, res.headers, `GitHub Events API error (${res.status})`);
  }
  return (await res.json().catch(() => [])) as RESTEvent[];
}

function transformProfile(user: GraphQLUserNode): GitHubProfile {
  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    company: user.company,
    location: user.location,
    blog: user.websiteUrl ?? "",
    followers: user.followers.totalCount,
    following: user.following.totalCount,
  };
}

function transformStats(user: GraphQLUserNode): GitHubStats {
  const totalStars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);
  return {
    publicRepos: user.repositories.totalCount,
    totalStars,
  };
}

function transformLanguages(user: GraphQLUserNode): { name: string; value: number; color: string }[] {
  const counts = new Map<string, { count: number; color: string }>();
  for (const repo of user.repositories.nodes) {
    if (repo.primaryLanguage) {
      const existing = counts.get(repo.primaryLanguage.name);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(repo.primaryLanguage.name, {
          count: 1,
          color: repo.primaryLanguage.color,
        });
      }
    }
  }
  const total = [...counts.values()].reduce((sum, entry) => sum + entry.count, 0);
  if (total === 0) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, { count, color }]) => ({
      name,
      value: Math.round((count / total) * 100),
      color: color || "#8b949e",
    }));
}

function transformRepos(user: GraphQLUserNode): Repo[] {
  return user.repositories.nodes.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.primaryLanguage?.name ?? null,
    languageColor: repo.primaryLanguage?.color ?? null,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    updatedAt: repo.updatedAt,
    url: repo.url,
  }));
}

function transformContributions(user: GraphQLUserNode): { days: number[] }[] {
  return user.contributionsCollection.contributionCalendar.weeks
    .slice(-52)
    .map((week) => ({
      days: week.contributionDays.map((day) => day.contributionCount),
    }));
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function eventTitle(event: RESTEvent): string {
  const payload = event.payload ?? {};
  switch (event.type) {
    case "PushEvent": {
      const count =
        (payload.size as number) ?? (payload.commits as unknown[] | undefined)?.length ?? 0;
      const ref = (payload.ref as string) ?? "refs/heads/main";
      const branch = ref.replace("refs/heads/", "");
      return `Pushed ${count} commit${count === 1 ? "" : "s"} to ${branch}`;
    }
    case "PullRequestEvent": {
      const action = capitalize((payload.action as string) ?? "opened");
      const pr = payload.pull_request as { title?: string } | undefined;
      return `${action} PR: ${pr?.title ?? "untitled"}`;
    }
    case "IssuesEvent": {
      const action = capitalize((payload.action as string) ?? "opened");
      const issue = payload.issue as { title?: string } | undefined;
      return `${action} issue: ${issue?.title ?? "untitled"}`;
    }
    case "WatchEvent":
      return "Starred the repository";
    case "ForkEvent": {
      const forkee = payload.forkee as { full_name?: string } | undefined;
      return `Forked from ${forkee?.full_name ?? event.repo.name}`;
    }
    case "CreateEvent": {
      const repoName = event.repo.name.split("/")[1] ?? event.repo.name;
      return `Created repository ${repoName}`;
    }
    case "DeleteEvent": {
      const refType = (payload.ref_type as string) ?? "ref";
      const ref = (payload.ref as string) ?? "";
      return `Deleted ${refType} ${ref}`.trim();
    }
    case "ReleaseEvent": {
      const release = payload.release as { tag_name?: string } | undefined;
      return `Released ${release?.tag_name ?? "a version"}`;
    }
    default:
      return event.type.replace(/Event$/, "") || "Activity";
  }
}

function transformEvents(events: RESTEvent[]): ActivityEvent[] {
  return events.map((event) => ({
    id: event.id,
    type: event.type,
    title: eventTitle(event),
    repoName: event.repo.name,
    repoUrl: `https://github.com/${event.repo.name}`,
    createdAt: event.created_at,
  }));
}

/**
 * Fetches complete dashboard data for a GitHub username.
 * GraphQL (profile/repos/languages/contributions) and REST (events)
 * run in parallel. Results are cached in-memory for 5 minutes keyed
 * by lowercased username.
 *
 * Throws GitHubApiError with type not_found | rate_limited | network.
 */
export async function fetchGitHubUser(
  username: string,
  token: string,
  signal?: AbortSignal,
): Promise<GitHubUserData> {
  const key = username.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const [user, events] = await Promise.all([
    fetchGraphQL(username, token, signal),
    fetchEvents(username, token, signal),
  ]);

  const data: GitHubUserData = {
    profile: transformProfile(user),
    stats: transformStats(user),
    languages: transformLanguages(user),
    contributions: transformContributions(user),
    repos: transformRepos(user),
    activity: transformEvents(events),
  };

  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
