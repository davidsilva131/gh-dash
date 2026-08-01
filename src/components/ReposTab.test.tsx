import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReposTab from "./ReposTab";
import RepoCard from "./RepoCard";
import { SAMPLE_USER } from "../test/fixtures";
import { SAMPLE_USER_DATA } from "../test/fixtures";
import type { GitHubUserData } from "../lib/types";

const UNSORTED_DATA: GitHubUserData = {
  profile: { login: "testuser", name: null, avatarUrl: "", bio: null, company: null, location: null, blog: "", followers: 0, following: 0 },
  stats: { publicRepos: 3, totalStars: 25 },
  languages: [],
  contributions: [],
  repos: [
    { name: "repo-a", description: null, language: null, languageColor: null, stars: 5, forks: 0, updatedAt: "2024-03-10T00:00:00Z", url: "https://github.com/test/repo-a" },
    { name: "repo-b", description: null, language: null, languageColor: null, stars: 12, forks: 0, updatedAt: "2024-01-01T00:00:00Z", url: "https://github.com/test/repo-b" },
    { name: "repo-c", description: null, language: null, languageColor: null, stars: 8, forks: 0, updatedAt: "2024-06-15T00:00:00Z", url: "https://github.com/test/repo-c" },
  ],
  activity: [],
};

describe("ReposTab", () => {
  it("renders the repository count", () => {
    render(<ReposTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(screen.getByText("6 repositories")).toBeInTheDocument();
  });

  it("renders a repo card for each sample repository", () => {
    render(<ReposTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(screen.getByText("LotoPetsPlay")).toBeInTheDocument();
    expect(screen.getByText("gh-dash")).toBeInTheDocument();
    expect(screen.getByText("dotfiles")).toBeInTheDocument();
  });

  it("marks Most Stars as the active sort by default", () => {
    render(<ReposTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(
      screen.getByRole("button", { name: "Most Stars", pressed: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Recently Updated", pressed: false })
    ).toBeInTheDocument();
  });

  it("toggles the active sort to Recently Updated", async () => {
    const user = userEvent.setup();
    render(<ReposTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    await user.click(screen.getByRole("button", { name: "Recently Updated" }));
    expect(
      screen.getByRole("button", { name: "Recently Updated", pressed: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Most Stars", pressed: false })
    ).toBeInTheDocument();
  });

  it("renders skeletons when isLoading is true", () => {
    const { container } = render(<ReposTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} isLoading />);
    expect(screen.getByTestId("repos-loading")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading repositories" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("renders the rate_limited error UI with a countdown", () => {
    const retryAfter = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    render(
      <ReposTab
        username={SAMPLE_USER}
        data={SAMPLE_USER_DATA}
        error={{ type: "rate_limited", message: "Rate limit exceeded", retryAfter }}
      />
    );
    expect(screen.getByTestId("repos-error")).toBeInTheDocument();
    expect(screen.getByText("Rate limit hit")).toBeInTheDocument();
    expect(screen.getByText("Try again in 5 minutes")).toBeInTheDocument();
  });

  it("renders repos from the data prop when provided", () => {
    render(
      <ReposTab
        username="testuser"
        data={{
          profile: { login: "testuser", name: null, avatarUrl: "", bio: null, company: null, location: null, blog: "", followers: 0, following: 0 },
          stats: { publicRepos: 2, totalStars: 0 },
          languages: [],
          contributions: [],
          repos: [
            { name: "repo-a", description: "First repo", language: "TypeScript", languageColor: "#3178c6", stars: 5, forks: 1, updatedAt: "2024-01-01", url: "https://github.com/test/repo-a" },
            { name: "repo-b", description: "Second repo", language: "Rust", languageColor: "#dea584", stars: 12, forks: 0, updatedAt: "2024-01-02", url: "https://github.com/test/repo-b" },
          ],
          activity: [],
        }}
      />
    );
    expect(screen.getByText("2 repositories")).toBeInTheDocument();
    expect(screen.getByText("repo-a")).toBeInTheDocument();
    expect(screen.getByText("repo-b")).toBeInTheDocument();
  });

  it("sorts repos by stars descending by default", () => {
    const { container } = render(<ReposTab username="testuser" data={UNSORTED_DATA} />);
    const titles = [...container.querySelectorAll("[data-slot='card-title']")].map((el) => el.textContent);
    expect(titles).toEqual(["repo-b", "repo-c", "repo-a"]);
  });

  it("re-sorts repos by most recently updated when clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<ReposTab username="testuser" data={UNSORTED_DATA} />);
    await user.click(screen.getByRole("button", { name: "Recently Updated" }));
    const titles = [...container.querySelectorAll("[data-slot='card-title']")].map((el) => el.textContent);
    expect(titles).toEqual(["repo-c", "repo-a", "repo-b"]);
  });

});

describe("RepoCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all repo fields including the language color dot", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    const { container } = render(
      <RepoCard
        name="gh-dash"
        description="GitHub dashboard"
        language="TypeScript"
        stars={5}
        forks={1}
        updatedAt="2024-05-30T12:00:00Z"
      />
    );
    expect(screen.getByText("gh-dash")).toBeInTheDocument();
    expect(screen.getByText("GitHub dashboard")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("★ 5")).toBeInTheDocument();
    expect(screen.getByText("★ 1")).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
    const dot = container.querySelector("[style*='background-color']");
    expect(dot).not.toBeNull();
    expect(dot).toHaveStyle({ backgroundColor: "#3178c6" });
  });

  it("renders without description and language", () => {
    const { container } = render(
      <RepoCard name="bare-repo" stars={0} forks={0} updatedAt="never" />
    );
    expect(screen.getByText("bare-repo")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    expect(container.querySelector("[style*='background-color']")).toBeNull();
  });
});
