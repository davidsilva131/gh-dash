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

export default function ActivityTab({
  username,
  data,
  isLoading,
  error,
  onRetry,
}: ActivityTabProps) {
  if (error) {
    return (
      <div data-testid="activity-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div
        data-testid="activity-loading"
        role="status"
        aria-label="Loading activity"
        className="space-y-2"
      >
        <Skeleton className="mb-4 h-4 w-48 rounded-sm" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  const events = data.activity.map((e) => ({
    type: e.type,
    repo: e.repoName,
    title: e.title,
    time: e.createdAt,
  }));

  return (
    <div className="space-y-2">
      <p className="mono mb-4 text-sm text-muted-foreground before:mr-1 before:text-primary before:content-['>_']">
        Recent activity from {username}
      </p>
      {events.map((event, i) => (
        <ActivityEvent key={i} {...(event as Parameters<typeof ActivityEvent>[0])} />
      ))}
    </div>
  );
}
