import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartsTab from "./ChartsTab";
import { SAMPLE_USER } from "../test/fixtures";

describe("ChartsTab", () => {
  it("renders all chart cards without runtime errors", () => {
    render(<ChartsTab username={SAMPLE_USER} />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Stars per Repository")).toBeInTheDocument();
    expect(screen.getByText("Contribution Calendar")).toBeInTheDocument();
    expect(screen.getByText("Activity Overview")).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_USER)).toBeInTheDocument();
  });

  it("renders the contribution heatmap with its legend", () => {
    render(<ChartsTab username={SAMPLE_USER} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });
});
