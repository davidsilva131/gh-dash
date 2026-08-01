import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityTab from "./ActivityTab";
import ActivityEvent from "./ActivityEvent";
import { SAMPLE_USER } from "../test/fixtures";
import { SAMPLE_USER_DATA } from "../test/fixtures";

describe("ActivityTab", () => {
  it("renders the header with the username", () => {
    render(<ActivityTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(
      screen.getByText("Recent activity from " + SAMPLE_USER)
    ).toBeInTheDocument();
  });

  it("renders all sample events with their badges", () => {
    render(<ActivityTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(screen.getByText("Pushed 3 commits to main")).toBeInTheDocument();
    expect(screen.getByText("Starred the repository")).toBeInTheDocument();
    expect(screen.getAllByText("Push")).toHaveLength(2);
    expect(screen.getAllByText("PR")).toHaveLength(2);
    expect(screen.getByText("Issue")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Fork")).toBeInTheDocument();
  });

  it("renders a loading placeholder when isLoading is true", () => {
    render(<ActivityTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} isLoading />);
    expect(screen.getByTestId("activity-loading")).toBeInTheDocument();
  });

  it("renders an error message when an error is provided", () => {
    render(
      <ActivityTab
        username={SAMPLE_USER}
        data={SAMPLE_USER_DATA}
        error={{ type: "network", message: "Could not reach GitHub" }}
      />
    );
    expect(screen.getByTestId("activity-error")).toBeInTheDocument();
    expect(screen.getByText("Could not reach GitHub")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders events from the data prop when provided", () => {
    render(
      <ActivityTab
        username="testuser"
        data={{
          profile: { login: "testuser", name: null, avatarUrl: "", bio: null, company: null, location: null, blog: "", followers: 0, following: 0 },
          stats: { publicRepos: 1, totalStars: 0 },
          languages: [],
          contributions: [],
          repos: [],
          activity: [
            { id: "1", type: "PushEvent", title: "Pushed to main", repoName: "test/repo", repoUrl: "https://github.com/test/repo", createdAt: "2024-01-01T00:00:00Z" },
            { id: "2", type: "WatchEvent", title: "Starred the repo", repoName: "test/repo", repoUrl: "https://github.com/test/repo", createdAt: "2024-01-02T00:00:00Z" },
          ],
        }}
      />
    );
    expect(screen.getByText("Pushed to main")).toBeInTheDocument();
    expect(screen.getByText("Starred the repo")).toBeInTheDocument();
  });

});

describe("ActivityEvent", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["PushEvent", "Push", "Push event icon"],
    ["PullRequestEvent", "PR", "Pull request event icon"],
    ["IssuesEvent", "Issue", "Issue event icon"],
    ["WatchEvent", "Star", "Watch event icon"],
    ["CreateEvent", "Create", "Create event icon"],
    ["ForkEvent", "Fork", "Fork event icon"],
  ] as const)(
    "renders the %s event with icon, badge label, title, repo, and time",
    (type, label, iconAriaLabel) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
      render(
        <ActivityEvent
          type={type}
          repo="owner/repo"
          title="Some activity"
          time="2024-06-01T11:00:00Z"
        />
      );
      expect(screen.getByLabelText(iconAriaLabel)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText("Some activity")).toBeInTheDocument();
      expect(screen.getByText("owner/repo")).toBeInTheDocument();
      expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    }
  );
});
