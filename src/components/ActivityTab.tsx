import ActivityEvent from "./ActivityEvent";
import { SAMPLE_EVENTS } from "../test/fixtures";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface ActivityTabProps {
  username: string;
  data?: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
}

export default function ActivityTab({ username, data, isLoading, error }: ActivityTabProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground" data-testid="activity-loading">Loading activity...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="activity-error">
        <p className="text-destructive font-semibold">Error</p>
        <p className="text-muted-foreground text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  // Map spec ActivityEvent shape to the component's expected shape
  const events = data?.activity?.map((e) => ({
    type: e.type,
    repo: e.repoName,
    title: e.title,
    time: e.createdAt,
  })) ?? SAMPLE_EVENTS;

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">Recent activity from {username}</p>
      {events.map((event, i) => (
        <ActivityEvent key={i} {...(event as Parameters<typeof ActivityEvent>[0])} />
      ))}
    </div>
  );
}
