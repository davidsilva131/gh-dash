// GitHub data types — the contract between the data service and the UI.
// Matches the shape from spec #16.

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string;
  followers: number;
  following: number;
}

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
}

export interface Language {
  name: string;
  value: number;
  color: string;
}

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  repoName: string;
  repoUrl: string;
  createdAt: string; // ISO 8601
}

export interface GitHubUserData {
  profile: GitHubProfile;
  stats: GitHubStats;
  languages: Language[];
  contributions: { days: number[] }[]; // 52 weeks x 7 days
  repos: Repo[];
  activity: ActivityEvent[];
}

export type ErrorType = "not_found" | "rate_limited" | "network";

export interface ErrorState {
  type: ErrorType;
  message: string;
  retryAfter?: string; // ISO 8601 reset timestamp, only for rate_limited
}
