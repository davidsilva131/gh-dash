import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import OverviewTab from "./OverviewTab";
import StatCard from "./StatCard";
import { SAMPLE_USER, VISIBLE_CONTRIBUTION_WEEKS } from "../test/fixtures";

describe("OverviewTab", () => {
  it("renders profile info from sample data", () => {
    render(<OverviewTab username={SAMPLE_USER} />);
    expect(screen.getByText("David Silva")).toBeInTheDocument();
    expect(screen.getByText("@" + SAMPLE_USER)).toBeInTheDocument();
    expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    expect(screen.getByText("FishingBugs")).toBeInTheDocument();
    expect(screen.getByText("Chile")).toBeInTheDocument();
  });

  it("renders the four stat cards with labels and values", () => {
    render(<OverviewTab username={SAMPLE_USER} />);
    expect(screen.getByText("Repositories")).toBeInTheDocument();
    expect(screen.getByText("57")).toBeInTheDocument();
    expect(screen.getByText("Total Stars")).toBeInTheDocument();
    expect(screen.getByText("186")).toBeInTheDocument();
    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Following")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
  });

  it("renders language bars with names and percentages", () => {
    render(<OverviewTab username={SAMPLE_USER} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
  });

  it("renders the contribution heatmap with the visible weeks of cells", () => {
    render(<OverviewTab username={SAMPLE_USER} />);
    const cells = screen.getAllByTitle(/contributions/i);
    expect(cells).toHaveLength(VISIBLE_CONTRIBUTION_WEEKS * 7);
  });

  it("renders skeletons when isLoading is true", () => {
    const { container } = render(<OverviewTab username={SAMPLE_USER} isLoading />);
    expect(screen.getByTestId("overview-loading")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading profile" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("renders the not_found error UI when a user does not exist", () => {
    render(
      <OverviewTab
        username={SAMPLE_USER}
        error={{ type: "not_found", message: "User not found" }}
      />
    );
    expect(screen.getByTestId("overview-error")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("User not found")).toBeInTheDocument();
    expect(screen.getByText("Check the username and try again.")).toBeInTheDocument();
  });

  it("renders the network error UI with a retry button", () => {
    render(
      <OverviewTab
        username={SAMPLE_USER}
        error={{ type: "network", message: "Could not reach GitHub" }}
      />
    );
    expect(screen.getByText("Could not reach GitHub")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders data from the data prop when provided", () => {
    render(
      <OverviewTab
        username="testuser"
        data={{
          profile: {
            login: "testuser",
            name: "Test User",
            avatarUrl: "https://example.com/avatar.png",
            bio: "A test bio",
            company: "TestCo",
            location: "TestLand",
            blog: "https://test.blog",
            followers: 10,
            following: 5,
          },
          stats: { publicRepos: 3, totalStars: 20 },
          languages: [{ name: "Rust", value: 100, color: "#dea584" }],
          contributions: Array.from({ length: 52 }, () => ({ days: [0] })),
          repos: [],
          activity: [],
        }}
      />
    );
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
    expect(screen.getByText("A test bio")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

});

describe("StatCard", () => {
  it("renders label, value, and optional trend", () => {
    render(<StatCard label="Repos" value={42} trend="+2 this week" />);
    expect(screen.getByText("Repos")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("+2 this week")).toBeInTheDocument();
  });

  it("renders without trend when not provided", () => {
    render(<StatCard label="Repos" value={42} />);
    expect(screen.getByText("Repos")).toBeInTheDocument();
    expect(screen.queryByText("+2 this week")).not.toBeInTheDocument();
  });
});
