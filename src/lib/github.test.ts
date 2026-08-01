import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fetchGitHubUser, clearCache, GitHubApiError } from "./github";

const GRAPHQL_URL = "https://api.github.com/graphql";
const EVENTS_URL =
  "https://api.github.com/users/octocat/events/public?per_page=100";

function graphQLUserBody() {
  return {
    data: {
      user: {
        login: "octocat",
        name: "The Octocat",
        avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
        bio: "A test bio",
        company: "GitHub",
        location: "San Francisco",
        websiteUrl: null,
        followers: { totalCount: 100 },
        following: { totalCount: 50 },
        repositories: {
          totalCount: 3,
          nodes: [
            {
              name: "repo-a",
              description: "First repo",
              primaryLanguage: { name: "TypeScript", color: "#3178c6" },
              stargazerCount: 10,
              forkCount: 2,
              updatedAt: "2024-01-01T00:00:00Z",
              url: "https://github.com/octocat/repo-a",
            },
            {
              name: "repo-b",
              description: null,
              primaryLanguage: { name: "TypeScript", color: "#3178c6" },
              stargazerCount: 5,
              forkCount: 0,
              updatedAt: "2024-02-01T00:00:00Z",
              url: "https://github.com/octocat/repo-b",
            },
            {
              name: "repo-c",
              description: "Third repo",
              primaryLanguage: null,
              stargazerCount: 0,
              forkCount: 1,
              updatedAt: "2024-03-01T00:00:00Z",
              url: "https://github.com/octocat/repo-c",
            },
          ],
        },
        contributionsCollection: {
          contributionCalendar: {
            weeks: [
              { contributionDays: [{ contributionCount: 0 }, { contributionCount: 1 }] },
              { contributionDays: [{ contributionCount: 2 }, { contributionCount: 3 }] },
            ],
          },
        },
      },
    },
  };
}

function eventsBody() {
  return [
    {
      id: "evt1",
      type: "PushEvent",
      repo: { name: "octocat/repo-a" },
      created_at: "2024-01-05T00:00:00Z",
      payload: { size: 3, ref: "refs/heads/main" },
    },
    {
      id: "evt2",
      type: "WatchEvent",
      repo: { name: "octocat/repo-b" },
      created_at: "2024-01-06T00:00:00Z",
      payload: {},
    },
  ];
}

interface MockOptions {
  graphqlStatus?: number;
  graphqlHeaders?: Record<string, string>;
  eventsStatus?: number;
  eventsHeaders?: Record<string, string>;
  rejectFetch?: boolean;
}

function mockFetch(graphQLBody: unknown, events: unknown, options: MockOptions = {}) {
  const fetchMock = vi.fn(
    async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (options.rejectFetch) {
        throw new TypeError("Failed to fetch");
      }
      const target = String(url);
      if (target.includes("graphql")) {
        return new Response(JSON.stringify(graphQLBody), {
          status: options.graphqlStatus ?? 200,
          headers: options.graphqlHeaders,
        });
      }
      return new Response(JSON.stringify(events), {
        status: options.eventsStatus ?? 200,
        headers: options.eventsHeaders,
      });
    },
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("fetchGitHubUser", () => {
  beforeEach(() => {
    clearCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("fetches and transforms GraphQL + REST data into GitHubUserData", async () => {
    mockFetch(graphQLUserBody(), eventsBody());

    const data = await fetchGitHubUser("octocat", "test-token");

    expect(data.profile).toEqual({
      login: "octocat",
      name: "The Octocat",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      bio: "A test bio",
      company: "GitHub",
      location: "San Francisco",
      blog: "",
      followers: 100,
      following: 50,
    });
    expect(data.stats).toEqual({ publicRepos: 3, totalStars: 15 });
    expect(data.languages).toEqual([
      { name: "TypeScript", value: 100, color: "#3178c6" },
    ]);
    expect(data.contributions).toEqual([
      { days: [0, 1] },
      { days: [2, 3] },
    ]);
    expect(data.repos).toHaveLength(3);
    expect(data.repos[0]).toMatchObject({
      name: "repo-a",
      stars: 10,
      forks: 2,
      languageColor: "#3178c6",
      url: "https://github.com/octocat/repo-a",
    });
    expect(data.repos[2].language).toBeNull();
    expect(data.activity).toHaveLength(2);
    expect(data.activity[0]).toMatchObject({
      id: "evt1",
      type: "PushEvent",
      title: "Pushed 3 commits to main",
      repoName: "octocat/repo-a",
      createdAt: "2024-01-05T00:00:00Z",
    });
    expect(data.activity[1].title).toBe("Starred the repository");
  });

  it("sends the GraphQL query and REST events request to the right URLs", async () => {
    const fetchMock = mockFetch(graphQLUserBody(), eventsBody());

    await fetchGitHubUser("octocat", "test-token");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [gqlCall, eventsCall] = fetchMock.mock.calls;
    expect(String(gqlCall[0])).toBe(GRAPHQL_URL);
    expect(String(eventsCall[0])).toBe(EVENTS_URL);
  });

  it("maps GitHub 404 to a not_found error", async () => {
    mockFetch({}, [], { graphqlStatus: 404 });

    await expect(fetchGitHubUser("ghost", "test-token")).rejects.toMatchObject({
      type: "not_found",
    });
  });

  it("maps a GraphQL NOT_FOUND error body to a not_found error", async () => {
    mockFetch(
      { errors: [{ type: "NOT_FOUND", message: "Could not resolve to a User" }] },
      [],
    );

    await expect(fetchGitHubUser("ghost", "test-token")).rejects.toMatchObject({
      type: "not_found",
    });
  });

  it("surfaces GitHub's real message for unclassified GraphQL errors", async () => {
    mockFetch(
      {
        errors: [
          {
            message:
              "Argument 'ownerAffiliations' on Field 'repositories' has an invalid value ([PUBLIC]). Expected type '[RepositoryAffiliation]'.",
          },
        ],
      },
      [],
    );

    const error = await fetchGitHubUser("octocat", "test-token").catch((e) => e);
    expect(error).toBeInstanceOf(GitHubApiError);
    expect(error.type).toBe("network");
    expect(error.message).toContain("ownerAffiliations");
    expect(error.message).not.toBe("User not found");
  });

  it("queries public repos where the user is the owner", async () => {
    const fetchMock = mockFetch(graphQLUserBody(), eventsBody());

    await fetchGitHubUser("octocat", "test-token");

    const gqlCall = fetchMock.mock.calls[0];
    const body = JSON.parse(String(gqlCall[1].body)) as { query: string };
    expect(body.query).toContain("ownerAffiliations: [OWNER]");
    expect(body.query).toContain("privacy: PUBLIC");
  });

  it("maps 403 with exhausted rate limit to a rate_limited error with retryAfter", async () => {
    const reset = String(Math.floor(Date.now() / 1000) + 3600);
    mockFetch({}, [], {
      graphqlStatus: 403,
      graphqlHeaders: { "x-ratelimit-remaining": "0", "x-ratelimit-reset": reset },
    });

    const error = await fetchGitHubUser("octocat", "test-token").catch((e) => e);
    expect(error).toBeInstanceOf(GitHubApiError);
    expect(error.type).toBe("rate_limited");
    expect(error.retryAfter).toBeDefined();
  });

  it("maps network failures to a network error", async () => {
    mockFetch(graphQLUserBody(), eventsBody(), { rejectFetch: true });

    await expect(fetchGitHubUser("octocat", "test-token")).rejects.toMatchObject({
      type: "network",
    });
  });

  it("returns cached data on a second call within the TTL with zero fetches", async () => {
    const fetchMock = mockFetch(graphQLUserBody(), eventsBody());

    const first = await fetchGitHubUser("octocat", "test-token");
    const second = await fetchGitHubUser("octocat", "test-token");

    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(2); // one GraphQL + one REST for the first call only
  });

  it("fetches again after the 5-minute TTL expires", async () => {
    vi.useFakeTimers();
    const fetchMock = mockFetch(graphQLUserBody(), eventsBody());

    await fetchGitHubUser("octocat", "test-token");
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    await fetchGitHubUser("octocat", "test-token");

    expect(fetchMock).toHaveBeenCalledTimes(4); // 2 GraphQL + 2 REST
  });

  it("keys the cache by lowercase username", async () => {
    const fetchMock = mockFetch(graphQLUserBody(), eventsBody());

    await fetchGitHubUser("Octocat", "test-token");
    await fetchGitHubUser("octocat", "test-token");

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("passes the abort signal to both in-flight requests", async () => {
    const fetchMock = mockFetch(graphQLUserBody(), eventsBody());
    const controller = new AbortController();

    await fetchGitHubUser("octocat", "test-token", controller.signal);

    const [, gqlInit] = fetchMock.mock.calls[0];
    const [, eventsInit] = fetchMock.mock.calls[1];
    expect(gqlInit?.signal).toBe(controller.signal);
    expect(eventsInit?.signal).toBe(controller.signal);
  });
});
