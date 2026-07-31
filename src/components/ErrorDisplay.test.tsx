import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorDisplay from "./ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders the not_found variant with a hint", () => {
    render(<ErrorDisplay error={{ type: "not_found", message: "User not found" }} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("User not found")).toBeInTheDocument();
    expect(screen.getByText("Check the username and try again.")).toBeInTheDocument();
  });

  it("renders the rate_limited variant with a countdown from retryAfter", () => {
    const retryAfter = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    render(<ErrorDisplay error={{ type: "rate_limited", message: "Rate limit hit", retryAfter }} />);
    expect(screen.getByText("Rate limit hit")).toBeInTheDocument();
    expect(screen.getByText("Try again in 10 minutes")).toBeInTheDocument();
  });

  it("renders the rate_limited variant without a retryAfter gracefully", () => {
    render(<ErrorDisplay error={{ type: "rate_limited", message: "Rate limit hit" }} />);
    expect(screen.getByText("Rate limit hit")).toBeInTheDocument();
    expect(screen.getByText("Try again in less than a minute")).toBeInTheDocument();
  });

  it("renders the network variant with a clickable Retry button", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorDisplay error={{ type: "network", message: "Could not reach GitHub" }} onRetry={onRetry} />);
    expect(screen.getByText("Could not reach GitHub")).toBeInTheDocument();
    const retry = screen.getByRole("button", { name: "Retry" });
    await user.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
