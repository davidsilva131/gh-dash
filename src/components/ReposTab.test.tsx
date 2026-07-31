import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReposTab from "./ReposTab";
import RepoCard from "./RepoCard";
import { SAMPLE_USER } from "../test/fixtures";

describe("ReposTab", () => {
  it("renders the repository count", () => {
    render(<ReposTab username={SAMPLE_USER} />);
    expect(screen.getByText("6 repositories")).toBeInTheDocument();
  });

  it("renders a repo card for each sample repository", () => {
    render(<ReposTab username={SAMPLE_USER} />);
    expect(screen.getByText("LotoPetsPlay")).toBeInTheDocument();
    expect(screen.getByText("gh-dash")).toBeInTheDocument();
    expect(screen.getByText("dotfiles")).toBeInTheDocument();
  });

  it("marks Most Stars as the active sort by default", () => {
    render(<ReposTab username={SAMPLE_USER} />);
    expect(
      screen.getByRole("button", { name: "Most Stars", pressed: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Recently Updated", pressed: false })
    ).toBeInTheDocument();
  });

  it("toggles the active sort to Recently Updated", async () => {
    const user = userEvent.setup();
    render(<ReposTab username={SAMPLE_USER} />);
    await user.click(screen.getByRole("button", { name: "Recently Updated" }));
    expect(
      screen.getByRole("button", { name: "Recently Updated", pressed: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Most Stars", pressed: false })
    ).toBeInTheDocument();
  });

  it("renders a loading placeholder when isLoading is true", () => {
    render(<ReposTab username={SAMPLE_USER} isLoading />);
    expect(screen.getByTestId("repos-loading")).toBeInTheDocument();
  });

  it("renders an error message when an error is provided", () => {
    render(
      <ReposTab
        username={SAMPLE_USER}
        error={{ type: "rate_limited", message: "Rate limit exceeded" }}
      />
    );
    expect(screen.getByTestId("repos-error")).toBeInTheDocument();
    expect(screen.getByText("Rate limit exceeded")).toBeInTheDocument();
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

});

describe("RepoCard", () => {
  it("renders all repo fields including the language color dot", () => {
    const { container } = render(
      <RepoCard
        name="gh-dash"
        description="GitHub dashboard"
        language="TypeScript"
        stars={5}
        forks={1}
        updatedAt="2 days ago"
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
