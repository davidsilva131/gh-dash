import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartsTab from "./ChartsTab";
import { SAMPLE_USER } from "../test/fixtures";
import { SAMPLE_USER_DATA } from "../test/fixtures";

describe("ChartsTab", () => {
  it("renders all chart cards without runtime errors", () => {
    render(<ChartsTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Stars per Repository")).toBeInTheDocument();
    expect(screen.getByText("Contribution Calendar")).toBeInTheDocument();
    expect(screen.getByText("Activity Overview")).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_USER)).toBeInTheDocument();
  });

  it("renders the contribution heatmap with its legend", () => {
    render(<ChartsTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("renders skeletons when isLoading is true", () => {
    const { container } = render(<ChartsTab username={SAMPLE_USER} data={SAMPLE_USER_DATA} isLoading />);
    expect(screen.getByTestId("charts-loading")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading charts" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("renders an error message when an error is provided", () => {
    render(
      <ChartsTab
        username={SAMPLE_USER}
        data={SAMPLE_USER_DATA}
        error={{ type: "not_found", message: "User not found" }}
      />
    );
    expect(screen.getByTestId("charts-error")).toBeInTheDocument();
    expect(screen.getByText("User not found")).toBeInTheDocument();
  });
});
