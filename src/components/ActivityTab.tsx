import ActivityEvent from "./ActivityEvent";
import ErrorDisplay from "./ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface ActivityTabProps {
  username: string;
  data: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
  onRetry?: () => void;
}

export default function ActivityTab({ username, data, isLoading, error, onRetry }: ActivityTabProps) {
  if (error) {
    return (
      <div data-testid="activity-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div data-testid="activity-loading" role="status" aria-label="Loading activity" className="space-y-2">
        <Skeleton className="h-4 w-48 rounded-full mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Map spec ActivityEvent shape to the component's expected shape
  const events = data.activity.map((e) => ({
    type: e.type,
    repo: e.repoName,
    title: e.title,
    time: e.createdAt,
  }));

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">Recent activity from {username}</p>
      {events.map((event, i) => (
        <ActivityEvent key={i} {...(event as Parameters<typeof ActivityEvent>[0])} />
      ))}
    </div>
  );
}
