import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "../lib/dates";
import { Badge } from "@/components/ui/badge";
import {
  GitCommitHorizontal,
  GitMerge,
  CircleDot,
  Star,
  GitFork,
  Plus,
} from "lucide-react";

type EventType =
  | "PushEvent"
  | "PullRequestEvent"
  | "IssuesEvent"
  | "WatchEvent"
  | "CreateEvent"
  | "ForkEvent";

interface ActivityEventProps {
  type: EventType;
  repo: string;
  title: string;
  time: string;
}

interface EventConfig {
  icon: ReactNode;
  label: string;
  variant: "default" | "secondary" | "outline";
}

const eventConfig: Record<EventType, EventConfig> = {
  PushEvent: {
    icon: <GitCommitHorizontal />,
    label: "Push",
    variant: "default",
  },
  PullRequestEvent: {
    icon: <GitMerge />,
    label: "PR",
    variant: "secondary",
  },
  IssuesEvent: {
    icon: <CircleDot />,
    label: "Issue",
    variant: "outline",
  },
  WatchEvent: {
    icon: <Star />,
    label: "Star",
    variant: "default",
  },
  CreateEvent: {
    icon: <Plus />,
    label: "Create",
    variant: "secondary",
  },
  ForkEvent: {
    icon: <GitFork />,
    label: "Fork",
    variant: "outline",
  },
};

export default function ActivityEvent({
  type,
  repo,
  title,
  time,
}: ActivityEventProps) {
  const config = eventConfig[type] || eventConfig.PushEvent;

  return (
    <Card className="group rounded-md border border-border bg-card transition-all duration-200 hover:border-primary hover:shadow-[-2px_0_0_0_var(--primary)]">
      <CardContent className="flex items-center gap-3 p-3">
        <div
          role="img"
          aria-label={type === "PushEvent" ? "Push event icon" : type === "PullRequestEvent" ? "Pull request event icon" : type === "IssuesEvent" ? "Issue event icon" : type === "WatchEvent" ? "Watch event icon" : type === "CreateEvent" ? "Create event icon" : "Fork event icon"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:h-4 [&_svg]:w-4"
        >
          {config.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-foreground">{title}</p>
          <p className="mono truncate text-xs text-muted-foreground">{repo}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge
            variant={config.variant}
            className="mono rounded-sm border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary"
          >
            {config.label}
          </Badge>
          <span className="mono whitespace-nowrap text-xs text-muted-foreground">
            {formatRelativeTime(time)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
