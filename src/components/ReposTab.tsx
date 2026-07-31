import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function ReposTab({ username, data, isLoading, error, onRetry }: ReposTabProps) {
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
      <div data-testid="repos-loading" role="status" aria-label="Loading repositories" className="space-y-4">
        <Skeleton className="h-4 w-40 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const repos = data.repos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{repos.length} repositories</p>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "stars" ? "default" : "outline"}
            size="sm"
            aria-pressed={sortBy === "stars"}
            onClick={() => setSortBy("stars")}
          >
            Most Stars
          </Button>
          <Button
            variant={sortBy === "updated" ? "default" : "outline"}
            size="sm"
            aria-pressed={sortBy === "updated"}
            onClick={() => setSortBy("updated")}
          >
            Recently Updated
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
}
