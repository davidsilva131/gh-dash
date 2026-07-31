import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import OverviewTab from "./OverviewTab";
import StatCard from "./StatCard";

describe("OverviewTab", () => {
  it("renders profile info from sample data", () => {
    render(<OverviewTab username="davidsilva131" />);
    expect(screen.getByText("David Silva")).toBeInTheDocument();
    expect(screen.getByText("@davidsilva131")).toBeInTheDocument();
    expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    expect(screen.getByText("FishingBugs")).toBeInTheDocument();
    expect(screen.getByText("Chile")).toBeInTheDocument();
  });

  it("renders the four stat cards with labels and values", () => {
    render(<OverviewTab username="davidsilva131" />);
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
    render(<OverviewTab username="davidsilva131" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
  });

  it("renders the contribution heatmap with 26 weeks of cells", () => {
    render(<OverviewTab username="davidsilva131" />);
    const cells = screen.getAllByTitle(/contributions/i);
    expect(cells).toHaveLength(26 * 7);
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
