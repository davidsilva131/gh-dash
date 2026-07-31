import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import { SAMPLE_USER_DATA, SAMPLE_USER } from "../test/fixtures";

function okResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function submitUsername(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.type(screen.getByLabelText("GitHub username"), value);
  await user.click(screen.getByRole("button", { name: /View|Search/ }));
}

describe("Dashboard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the empty state with landing prompt and search form", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<Dashboard />);
    expect(screen.getByText("gh-dash")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "GitHub username" })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches on submit and renders real data in the overview tab", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(okResponse(SAMPLE_USER_DATA)));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, SAMPLE_USER);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/github/" + SAMPLE_USER + ".json",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(await screen.findByText("David Silva")).toBeInTheDocument();
    expect(screen.getByText("@davidsilva131")).toBeInTheDocument();
    expect(screen.getByText("57")).toBeInTheDocument();
  });

  it("shows skeletons while loading and then real data", async () => {
    let resolveFetch!: (r: Response) => void;
    const fetchMock = vi.fn(
      () => new Promise<Response>((resolve) => { resolveFetch = resolve; }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, SAMPLE_USER);
    expect(await screen.findByTestId("overview-loading")).toBeInTheDocument();

    resolveFetch(okResponse(SAMPLE_USER_DATA));
    expect(await screen.findByText("David Silva")).toBeInTheDocument();
  });

  it("renders data in every tab", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(okResponse(SAMPLE_USER_DATA)));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, SAMPLE_USER);
    await screen.findByText("David Silva");

    await user.click(screen.getByRole("tab", { name: "Repos" }));
    expect(await screen.findByText("6 repositories")).toBeInTheDocument();
    expect(screen.getByText("LotoPetsPlay")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(await screen.findByText("Recent activity from " + SAMPLE_USER)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Charts" }));
    expect(await screen.findByText("Languages")).toBeInTheDocument();
  });

  it("shows an inline validation error for an invalid username without fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, "bad user!!");

    expect(
      await screen.findByText("Username can only contain letters, numbers, and single hyphens."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders the not_found error UI when the API returns 404", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        errorResponse(404, { error: { type: "not_found", message: "User not found" } }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, "ghost-user");
    expect(await screen.findByText("User not found")).toBeInTheDocument();
    expect(screen.getByText("Check the username and try again.")).toBeInTheDocument();
  });

  it("renders the network error UI and retries successfully", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(okResponse(SAMPLE_USER_DATA));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, SAMPLE_USER);
    expect(await screen.findByText("Could not reach GitHub")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("David Silva")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("aborts the previous request when a new username is submitted", async () => {
    const signals: AbortSignal[] = [];
    const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
      signals.push(init?.signal as AbortSignal);
      return new Promise<Response>(() => {}); // never resolves
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Dashboard />);

    await submitUsername(user, "alpha");
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await user.clear(screen.getByLabelText("GitHub username"));
    await user.type(screen.getByLabelText("GitHub username"), "beta");
    await user.click(screen.getByRole("button", { name: "Search" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });
});
