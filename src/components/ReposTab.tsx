import { useState } from "react";
import { Button } from "@/components/ui/button";
import RepoCard from "./RepoCard";

interface ReposTabProps {
  username: string;
}

const SAMPLE_REPOS = [
  { name: "LotoPetsPlay", description: "Next.js pet-themed gaming platform with Supabase auth and Clean Architecture", language: "TypeScript", stars: 12, forks: 3, updatedAt: "2 days ago" },
  { name: "MyTodo-back", description: "FastAPI backend with JWT auth, SQLAlchemy 2.0, Alembic migrations", language: "Python", stars: 8, forks: 2, updatedAt: "1 week ago" },
  { name: "gh-dash", description: "GitHub Personal Dashboard built with Astro + React + Tailwind v4", language: "TypeScript", stars: 5, forks: 1, updatedAt: "just now" },
  { name: "portfolio", description: "Personal portfolio site with dark mode and MDX blog", language: "JavaScript", stars: 3, forks: 0, updatedAt: "3 weeks ago" },
  { name: "dotfiles", description: "My personal dotfiles and development environment setup", language: "Shell", stars: 2, forks: 1, updatedAt: "1 month ago" },
  { name: "rust-adventures", description: "Learning Rust through small projects and algorithms", language: "Rust", stars: 7, forks: 0, updatedAt: "2 months ago" },
];

type SortKey = "stars" | "updated";

export default function ReposTab({ username }: ReposTabProps) {
  const [sortBy, setSortBy] = useState<SortKey>("stars");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{SAMPLE_REPOS.length} repositories</p>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "stars" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("stars")}
          >
            Most Stars
          </Button>
          <Button
            variant={sortBy === "updated" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("updated")}
          >
            Recently Updated
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_REPOS.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
}
