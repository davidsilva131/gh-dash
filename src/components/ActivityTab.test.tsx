import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityTab from "./ActivityTab";
import ActivityEvent from "./ActivityEvent";

describe("ActivityTab", () => {
  it("renders the header with the username", () => {
    render(<ActivityTab username="davidsilva131" />);
    expect(
      screen.getByText("Recent activity from davidsilva131")
    ).toBeInTheDocument();
  });

  it("renders all sample events with their badges", () => {
    render(<ActivityTab username="davidsilva131" />);
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
    ["PushEvent", "Push"],
    ["PullRequestEvent", "PR"],
    ["IssuesEvent", "Issue"],
    ["WatchEvent", "Star"],
    ["CreateEvent", "Create"],
    ["ForkEvent", "Fork"],
  ] as const)("renders the %s event with its badge label", (type, label) => {
    render(
      <ActivityEvent
        type={type}
        repo="owner/repo"
        title="Some activity"
        time="1 hour ago"
      />
    );
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("Some activity")).toBeInTheDocument();
    expect(screen.getByText("owner/repo")).toBeInTheDocument();
    expect(screen.getByText("1 hour ago")).toBeInTheDocument();
  });
});
