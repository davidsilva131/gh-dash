import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  it("renders the empty state with landing prompt and search form", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: "gh-dash" })).toBeInTheDocument();
    expect(screen.getByText("GitHub Personal Dashboard")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "GitHub username" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("switches to the loaded state when a username is submitted", async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await user.type(
      screen.getByRole("textbox", { name: "GitHub username" }),
      "davidsilva131"
    );
    await user.click(screen.getByRole("button", { name: "View" }));
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Repos" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Activity" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Charts" })).toBeInTheDocument();
  });

  it("renders the overview tab content by default after search", async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await user.type(
      screen.getByRole("textbox", { name: "GitHub username" }),
      "davidsilva131"
    );
    await user.click(screen.getByRole("button", { name: "View" }));
    expect(screen.getByText("David Silva")).toBeInTheDocument();
  });

  it("switches between tabs", async () => {
    const user = userEvent.setup();
    render(<Dashboard initialUsername="davidsilva131" />);
    await user.click(screen.getByRole("tab", { name: "Repos" }));
    expect(screen.getByText("6 repositories")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(
      screen.getByText("Recent activity from davidsilva131")
    ).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Charts" }));
    expect(screen.getByText("Stars per Repository")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    expect(screen.getByText("David Silva")).toBeInTheDocument();
  });
});
