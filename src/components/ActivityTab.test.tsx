import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityTab from "./ActivityTab";
import ActivityEvent from "./ActivityEvent";
import { SAMPLE_USER } from "../test/fixtures";

describe("ActivityTab", () => {
  it("renders the header with the username", () => {
    render(<ActivityTab username={SAMPLE_USER} />);
    expect(
      screen.getByText("Recent activity from " + SAMPLE_USER)
    ).toBeInTheDocument();
  });

  it("renders all sample events with their badges", () => {
    render(<ActivityTab username={SAMPLE_USER} />);
    expect(screen.getByText("Pushed 3 commits to main")).toBeInTheDocument();
    expect(screen.getByText("Starred the repository")).toBeInTheDocument();
    expect(screen.getAllByText("Push")).toHaveLength(2);
    expect(screen.getAllByText("PR")).toHaveLength(2);
    expect(screen.getByText("Issue")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Fork")).toBeInTheDocument();
  });
});

describe("ActivityEvent", () => {
  it.each([
    ["PushEvent", "Push", "P"],
    ["PullRequestEvent", "PR", "R"],
    ["IssuesEvent", "Issue", "I"],
    ["WatchEvent", "Star", "S"],
    ["CreateEvent", "Create", "C"],
    ["ForkEvent", "Fork", "F"],
  ] as const)(
    "renders the %s event with icon, badge label, title, repo, and time",
    (type, label, icon) => {
      render(
        <ActivityEvent
          type={type}
          repo="owner/repo"
          title="Some activity"
          time="1 hour ago"
        />
      );
      expect(screen.getByText(icon)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText("Some activity")).toBeInTheDocument();
      expect(screen.getByText("owner/repo")).toBeInTheDocument();
      expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    }
  );
});
