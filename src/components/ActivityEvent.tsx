import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type EventType = "PushEvent" | "PullRequestEvent" | "IssuesEvent" | "WatchEvent" | "CreateEvent" | "ForkEvent";

interface ActivityEventProps {
  type: EventType;
  repo: string;
  title: string;
  time: string;
}

const eventConfig: Record<EventType, { icon: string; label: string; variant: "default" | "secondary" | "outline" }> = {
  PushEvent: { icon: "P", label: "Push", variant: "default" },
  PullRequestEvent: { icon: "R", label: "PR", variant: "secondary" },
  IssuesEvent: { icon: "I", label: "Issue", variant: "outline" },
  WatchEvent: { icon: "S", label: "Star", variant: "default" },
  CreateEvent: { icon: "C", label: "Create", variant: "secondary" },
  ForkEvent: { icon: "F", label: "Fork", variant: "outline" },
};

export default function ActivityEvent({ type, repo, title, time }: ActivityEventProps) {
  const config = eventConfig[type] || eventConfig.PushEvent;
  
  return (
    <Card className="border-border/50 hover:border-primary/20 transition-colors">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{repo}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
        </div>
      </CardContent>
    </Card>
  );
}
