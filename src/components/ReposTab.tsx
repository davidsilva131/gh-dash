import { useState } from "react";
import { Button } from "@/components/ui/button";
import RepoCard from "./RepoCard";
import { SAMPLE_REPOS } from "../test/fixtures";

interface ReposTabProps {
  username: string;
}

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
        {SAMPLE_REPOS.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
}
