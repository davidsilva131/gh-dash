// Shared fixtures for component tests.
// All data conforms to the spec #16 types (src/lib/types.ts).

import type { GitHubUserData, Repo, ActivityEvent, Language } from "../lib/types";

// ---------------------------------------------------------------------------
// Simple re-usable values
// ---------------------------------------------------------------------------
export const SAMPLE_USER = "davidsilva131";
export const VISIBLE_CONTRIBUTION_WEEKS = 26;

// ---------------------------------------------------------------------------
// Languages (spec: Language[])
// ---------------------------------------------------------------------------
export const SAMPLE_LANGUAGES: Language[] = [
  { name: "TypeScript", value: 35, color: "#3178c6" },
  { name: "JavaScript", value: 28, color: "#f1e05a" },
  { name: "Python", value: 18, color: "#3572A5" },
  { name: "CSS/HTML", value: 12, color: "#e34c26" },
  { name: "Other", value: 7, color: "#8b949e" },
];

// ---------------------------------------------------------------------------
// Repositories (spec: Repo[])
// ---------------------------------------------------------------------------
export const SAMPLE_REPOS: Repo[] = [
  {
    name: "LotoPetsPlay",
    description: "Next.js pet-themed gaming platform with Supabase auth and Clean Architecture",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 12,
    forks: 3,
    updatedAt: "2 days ago",
    url: "https://github.com/davidsilva131/LotoPetsPlay",
  },
  {
    name: "MyTodo-back",
    description: "FastAPI backend with JWT auth, SQLAlchemy 2.0, Alembic migrations",
    language: "Python",
    languageColor: "#3572A5",
    stars: 8,
    forks: 2,
    updatedAt: "1 week ago",
    url: "https://github.com/davidsilva131/MyTodo-back",
  },
  {
    name: "gh-dash",
    description: "GitHub Personal Dashboard built with Astro + React + Tailwind v4",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 5,
    forks: 1,
    updatedAt: "just now",
    url: "https://github.com/davidsilva131/gh-dash",
  },
  {
    name: "portfolio",
    description: "Personal portfolio site with dark mode and MDX blog",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 3,
    forks: 0,
    updatedAt: "3 weeks ago",
    url: "https://github.com/davidsilva131/portfolio",
  },
  {
    name: "dotfiles",
    description: "My personal dotfiles and development environment setup",
    language: "Shell",
    languageColor: "#89e051",
    stars: 2,
    forks: 1,
    updatedAt: "1 month ago",
    url: "https://github.com/davidsilva131/dotfiles",
  },
  {
    name: "rust-adventures",
    description: "Learning Rust through small projects and algorithms",
    language: "Rust",
    languageColor: "#dea584",
    stars: 7,
    forks: 0,
    updatedAt: "2 months ago",
    url: "https://github.com/davidsilva131/rust-adventures",
  },
];

// ---------------------------------------------------------------------------
// Activity events (spec: ActivityEvent[])
// ---------------------------------------------------------------------------
export const SAMPLE_EVENTS: ActivityEvent[] = [
  {
    id: "evt1",
    type: "PushEvent",
    title: "Pushed 3 commits to main",
    repoName: "davidsilva131/LotoPetsPlay",
    repoUrl: "https://github.com/davidsilva131/LotoPetsPlay",
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "evt2",
    type: "PullRequestEvent",
    title: "Opened PR: feat: add dashboard layout",
    repoName: "davidsilva131/gh-dash",
    repoUrl: "https://github.com/davidsilva131/gh-dash",
    createdAt: "2024-01-06T00:00:00Z",
  },
  {
    id: "evt3",
    type: "IssuesEvent",
    title: "Opened issue: Add rate limiting",
    repoName: "davidsilva131/MyTodo-back",
    repoUrl: "https://github.com/davidsilva131/MyTodo-back",
    createdAt: "2024-01-07T00:00:00Z",
  },
  {
    id: "evt4",
    type: "WatchEvent",
    title: "Starred the repository",
    repoName: "F1shing-Bugs/LotoPetsPlay",
    repoUrl: "https://github.com/F1shing-Bugs/LotoPetsPlay",
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "evt5",
    type: "CreateEvent",
    title: "Created repository gh-dash",
    repoName: "davidsilva131/gh-dash",
    repoUrl: "https://github.com/davidsilva131/gh-dash",
    createdAt: "2024-01-09T00:00:00Z",
  },
  {
    id: "evt6",
    type: "PushEvent",
    title: "Pushed 5 commits to main",
    repoName: "davidsilva131/portfolio",
    repoUrl: "https://github.com/davidsilva131/portfolio",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "evt7",
    type: "ForkEvent",
    title: "Forked from rust-lang/book",
    repoName: "davidsilva131/rust-adventures",
    repoUrl: "https://github.com/davidsilva131/rust-adventures",
    createdAt: "2024-01-11T00:00:00Z",
  },
  {
    id: "evt8",
    type: "PullRequestEvent",
    title: "Merged PR: fix auth redirect loop",
    repoName: "davidsilva131/LotoPetsPlay",
    repoUrl: "https://github.com/davidsilva131/LotoPetsPlay",
    createdAt: "2024-01-12T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Charts data (chart-consumer shapes)
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

export const SAMPLE_CONTRIBUTION_WEEKS: { days: number[] }[] = Array.from(
  { length: 52 },
  () => ({
    days: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)),
  }),
);

// ---------------------------------------------------------------------------
// Full user dashboard payload (spec: GitHubUserData)
// ---------------------------------------------------------------------------
export const SAMPLE_USER_DATA: GitHubUserData = {
  profile: {
    login: "davidsilva131",
    name: "David Silva",
    avatarUrl: "https://avatars.githubusercontent.com/u/116703237?v=4",
    bio: "Full-stack developer. Building with Next.js, Astro, React, and Tailwind. Open source enthusiast.",
    company: "FishingBugs",
    location: "Chile",
    blog: "",
    followers: 42,
    following: 28,
  },
  stats: {
    publicRepos: 57,
    totalStars: 186,
  },
  languages: SAMPLE_LANGUAGES,
  contributions: SAMPLE_CONTRIBUTION_WEEKS,
  repos: SAMPLE_REPOS,
  activity: SAMPLE_EVENTS,
};
