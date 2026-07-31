import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "./[username].json";
import { fetchGitHubUser, GitHubApiError } from "../../../lib/github";

vi.mock("../../../lib/github", () => {
  class MockGitHubApiError extends Error {
    type: string;
    retryAfter?: string;
    constructor(type: string, message: string, retryAfter?: string) {
      super(message);
      this.name = "GitHubApiError";
      this.type = type;
      this.retryAfter = retryAfter;
    }
  }
  return {
    fetchGitHubUser: vi.fn(),
    GitHubApiError: MockGitHubApiError,
  };
});

const mockedFetch = vi.mocked(fetchGitHubUser);

const SAMPLE_DATA = {
  profile: {
    login: "octocat",
    name: "The Octocat",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    bio: "A test bio",
    company: null,
    location: null,
    blog: "",
    followers: 100,
    following: 50,
  },
  stats: { publicRepos: 3, totalStars: 15 },
  languages: [{ name: "TypeScript", value: 100, color: "#3178c6" }],
  contributions: [{ days: [0, 1] }],
  repos: [],
  activity: [],
};

function ctx(username?: string) {
  return { params: { username: username ?? "octocat" } } as Parameters<typeof GET>[0];
}

describe("GET /api/github/[username].json", () => {
  beforeEach(() => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    mockedFetch.mockReset();
  });

  it("returns 200 with GitHubUserData on success", async () => {
    mockedFetch.mockResolvedValue(SAMPLE_DATA);

    const res = await GET(ctx());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(SAMPLE_DATA);
    expect(mockedFetch).toHaveBeenCalledWith("octocat", "test-token");
  });

  it("returns 404 with a not_found error body", async () => {
    mockedFetch.mockRejectedValue(new GitHubApiError("not_found", "User not found"));

    const res = await GET(ctx());
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: { type: "not_found", message: "User not found" } });
  });

  it("returns 429 with a rate_limited error body including retryAfter", async () => {
    const retryAfter = new Date(Date.now() + 3600 * 1000).toISOString();
    mockedFetch.mockRejectedValue(
      new GitHubApiError("rate_limited", "GitHub API rate limit exceeded", retryAfter),
    );

    const res = await GET(ctx());
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body).toEqual({
      error: {
        type: "rate_limited",
        message: "GitHub API rate limit exceeded",
        retryAfter,
      },
    });
  });

  it("returns 502 with a network error body", async () => {
    mockedFetch.mockRejectedValue(new GitHubApiError("network", "Could not reach GitHub API"));

    const res = await GET(ctx());
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({
      error: { type: "network", message: "Could not reach GitHub API" },
    });
  });

  it("returns 502 for unexpected errors", async () => {
    mockedFetch.mockRejectedValue(new Error("boom"));

    const res = await GET(ctx());
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error.type).toBe("network");
  });

  it("returns 500 with a clear message when GITHUB_TOKEN is missing", async () => {
    vi.stubEnv("GITHUB_TOKEN", undefined);

    const res = await GET(ctx());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.message).toContain("GITHUB_TOKEN");
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("returns 404 for an invalid username", async () => {
    const res = await GET(ctx("bad username!!"));
    expect(res.status).toBe(404);
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});
