import { useState } from "react";
import RepoCard from "./RepoCard";
import ErrorDisplay from "./ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface ReposTabProps {
  username: string;
  data: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
  onRetry?: () => void;
}

type SortKey = "stars" | "updated";

export default function ReposTab({
  username,
  data,
  isLoading,
  error,
  onRetry,
}: ReposTabProps) {
  const [sortBy, setSortBy] = useState<SortKey>("stars");

  if (error) {
    return (
      <div data-testid="repos-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div
        data-testid="repos-loading"
        role="status"
        aria-label="Loading repositories"
        className="space-y-4"
      >
        <Skeleton className="h-4 w-40 rounded-sm" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const repos = [...data.repos].sort((a, b) =>
    sortBy === "stars" ? b.stars - a.stars : b.updatedAt.localeCompare(a.updatedAt),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="mono text-sm text-muted-foreground before:mr-1 before:text-primary before:content-['>_']">
          {repos.length} repositories
        </p>
        <div
          role="group"
          aria-label="Sort repositories"
          className="mono flex items-center gap-0 rounded-sm border border-border bg-card"
        >
          <button
            type="button"
            onClick={() => setSortBy("stars")}
            aria-pressed={sortBy === "stars"}
            className={`border-r border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              sortBy === "stars"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Most Stars
          </button>
          <button
            type="button"
            onClick={() => setSortBy("updated")}
            aria-pressed={sortBy === "updated"}
            className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              sortBy === "updated"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recently Updated
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {repos.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
}
