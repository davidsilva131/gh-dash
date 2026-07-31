import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartsTab from "./ChartsTab";

describe("ChartsTab", () => {
  it("renders all chart cards without runtime errors", () => {
    render(<ChartsTab username="davidsilva131" />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Stars per Repository")).toBeInTheDocument();
    expect(screen.getByText("Contribution Calendar")).toBeInTheDocument();
    expect(screen.getByText("Activity Overview")).toBeInTheDocument();
    expect(screen.getByText("davidsilva131")).toBeInTheDocument();
  });

  it("renders the contribution heatmap with its legend", () => {
    render(<ChartsTab username="davidsilva131" />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("renders svg charts via the mocked ResponsiveContainer", () => {
    const { container } = render(<ChartsTab username="davidsilva131" />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(3);
  });
});
