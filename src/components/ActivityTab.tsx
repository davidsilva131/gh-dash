import ActivityEvent from "./ActivityEvent";
import { SAMPLE_EVENTS } from "../test/fixtures";

interface ActivityTabProps {
  username: string;
}

export default function ActivityTab({ username }: ActivityTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">Recent activity from {username}</p>
      {SAMPLE_EVENTS.map((event, i) => (
        <ActivityEvent key={i} {...event} />
      ))}
    </div>
  );
}
