import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReposTab from "./ReposTab";
import RepoCard from "./RepoCard";

describe("ReposTab", () => {
  it("renders the repository count", () => {
    render(<ReposTab username="davidsilva131" />);
    expect(screen.getByText("6 repositories")).toBeInTheDocument();
  });

  it("renders a repo card for each sample repository", () => {
    render(<ReposTab username="davidsilva131" />);
    expect(screen.getByText("LotoPetsPlay")).toBeInTheDocument();
    expect(screen.getByText("gh-dash")).toBeInTheDocument();
    expect(screen.getByText("dotfiles")).toBeInTheDocument();
  });

  it("marks Most Stars as the active sort by default", () => {
    render(<ReposTab username="davidsilva131" />);
    expect(screen.getByRole("button", { name: "Most Stars" })).toHaveClass("bg-primary");
  });

  it("toggles the active sort to Recently Updated", async () => {
    const user = userEvent.setup();
    render(<ReposTab username="davidsilva131" />);
    await user.click(screen.getByRole("button", { name: "Recently Updated" }));
    expect(screen.getByRole("button", { name: "Recently Updated" })).toHaveClass("bg-primary");
    expect(screen.getByRole("button", { name: "Most Stars" })).not.toHaveClass("bg-primary");
  });
});

describe("RepoCard", () => {
  it("renders all repo fields", () => {
    render(
      <RepoCard
        name="gh-dash"
        description="GitHub dashboard"
        language="TypeScript"
        stars={5}
        forks={1}
        updatedAt="2 days ago"
      />
    );
    expect(screen.getByText("gh-dash")).toBeInTheDocument();
    expect(screen.getByText("GitHub dashboard")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("★ 5")).toBeInTheDocument();
    expect(screen.getByText("★ 1")).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  it("renders without description and language", () => {
    render(<RepoCard name="bare-repo" stars={0} forks={0} updatedAt="never" />);
    expect(screen.getByText("bare-repo")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });
});
