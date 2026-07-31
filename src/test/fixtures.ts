// Shared fixtures for component tests.

// ---------------------------------------------------------------------------
// Simple re-usable values (already used by the existing test suite)
// ---------------------------------------------------------------------------
export const SAMPLE_USER = "davidsilva131";
export const VISIBLE_CONTRIBUTION_WEEKS = 26;

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------
export const SAMPLE_LANGUAGES = [
  { name: "TypeScript", value: 35, color: "#3178c6" },
  { name: "JavaScript", value: 28, color: "#f1e05a" },
  { name: "Python", value: 18, color: "#3572A5" },
  { name: "CSS/HTML", value: 12, color: "#e34c26" },
  { name: "Other", value: 7, color: "#8b949e" },
];

// ---------------------------------------------------------------------------
// Repositories
// ---------------------------------------------------------------------------
export const SAMPLE_REPOS = [
  {
    name: "LotoPetsPlay",
    description:
      "Next.js pet-themed gaming platform with Supabase auth and Clean Architecture",
    language: "TypeScript",
    stars: 12,
    forks: 3,
    updatedAt: "2 days ago",
  },
  {
    name: "MyTodo-back",
    description: "FastAPI backend with JWT auth, SQLAlchemy 2.0, Alembic migrations",
    language: "Python",
    stars: 8,
    forks: 2,
    updatedAt: "1 week ago",
  },
  {
    name: "gh-dash",
    description: "GitHub Personal Dashboard built with Astro + React + Tailwind v4",
    language: "TypeScript",
    stars: 5,
    forks: 1,
    updatedAt: "just now",
  },
  {
    name: "portfolio",
    description: "Personal portfolio site with dark mode and MDX blog",
    language: "JavaScript",
    stars: 3,
    forks: 0,
    updatedAt: "3 weeks ago",
  },
  {
    name: "dotfiles",
    description: "My personal dotfiles and development environment setup",
    language: "Shell",
    stars: 2,
    forks: 1,
    updatedAt: "1 month ago",
  },
  {
    name: "rust-adventures",
    description: "Learning Rust through small projects and algorithms",
    language: "Rust",
    stars: 7,
    forks: 0,
    updatedAt: "2 months ago",
  },
];

// ---------------------------------------------------------------------------
// Activity events
// ---------------------------------------------------------------------------
export const SAMPLE_EVENTS = [
  {
    type: "PushEvent" as const,
    repo: "davidsilva131/LotoPetsPlay",
    title: "Pushed 3 commits to main",
    time: "2 hours ago",
  },
  {
    type: "PullRequestEvent" as const,
    repo: "davidsilva131/gh-dash",
    title: "Opened PR: feat: add dashboard layout",
    time: "5 hours ago",
  },
  {
    type: "IssuesEvent" as const,
    repo: "davidsilva131/MyTodo-back",
    title: "Opened issue: Add rate limiting",
    time: "1 day ago",
  },
  {
    type: "WatchEvent" as const,
    repo: "F1shing-Bugs/LotoPetsPlay",
    title: "Starred the repository",
    time: "2 days ago",
  },
  {
    type: "CreateEvent" as const,
    repo: "davidsilva131/gh-dash",
    title: "Created repository gh-dash",
    time: "3 days ago",
  },
  {
    type: "PushEvent" as const,
    repo: "davidsilva131/portfolio",
    title: "Pushed 5 commits to main",
    time: "4 days ago",
  },
  {
    type: "ForkEvent" as const,
    repo: "davidsilva131/rust-adventures",
    title: "Forked from rust-lang/book",
    time: "1 week ago",
  },
  {
    type: "PullRequestEvent" as const,
    repo: "davidsilva131/LotoPetsPlay",
    title: "Merged PR: fix auth redirect loop",
    time: "1 week ago",
  },
];

// ---------------------------------------------------------------------------
// Charts data
// ---------------------------------------------------------------------------
export const SAMPLE_CHARTS_LANGUAGES = [
  { name: "TypeScript", value: 35, color: "#3178c6" },
  { name: "JavaScript", value: 28, color: "#f1e05a" },
  { name: "Python", value: 18, color: "#3572A5" },
  { name: "CSS/HTML", value: 12, color: "#e34c26" },
  { name: "Rust", value: 5, color: "#dea584" },
  { name: "Other", value: 2, color: "#8b949e" },
];

export const SAMPLE_STARS = [
  { name: "LotoPetsPlay", stars: 12 },
  { name: "MyTodo-back", stars: 8 },
  { name: "rust-adventures", stars: 7 },
  { name: "gh-dash", stars: 5 },
  { name: "portfolio", stars: 3 },
  { name: "dotfiles", stars: 2 },
];

export const SAMPLE_ACTIVITY = [
  { month: "Jan", commits: 48, prs: 6, issues: 4 },
  { month: "Feb", commits: 52, prs: 8, issues: 3 },
  { month: "Mar", commits: 38, prs: 5, issues: 7 },
  { month: "Apr", commits: 65, prs: 10, issues: 5 },
  { month: "May", commits: 42, prs: 7, issues: 2 },
  { month: "Jun", commits: 55, prs: 9, issues: 6 },
  { month: "Jul", commits: 35, prs: 4, issues: 3 },
];

export const SAMPLE_CONTRIBUTION_WEEKS = Array.from({ length: 52 }, () => ({
  days: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)),
}));

// ---------------------------------------------------------------------------
// Full user profile (used by OverviewTab)
// ---------------------------------------------------------------------------
export const SAMPLE_USER_DATA = {
  name: "David Silva",
  login: "davidsilva131",
  bio: "Full-stack developer. Building with Next.js, Astro, React, and Tailwind. Open source enthusiast.",
  avatarUrl: "https://avatars.githubusercontent.com/u/116703237?v=4",
  followers: 42,
  following: 28,
  publicRepos: 57,
  totalStars: 186,
  company: "FishingBugs",
  location: "Chile",
  blog: "",
  languages: SAMPLE_LANGUAGES,
  contributionWeeks: SAMPLE_CONTRIBUTION_WEEKS,
};
