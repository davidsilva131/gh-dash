import ActivityEvent from "./ActivityEvent";

interface ActivityTabProps {
  username: string;
}

const SAMPLE_EVENTS = [
  { type: "PushEvent" as const, repo: "davidsilva131/LotoPetsPlay", title: "Pushed 3 commits to main", time: "2 hours ago" },
  { type: "PullRequestEvent" as const, repo: "davidsilva131/gh-dash", title: "Opened PR: feat: add dashboard layout", time: "5 hours ago" },
  { type: "IssuesEvent" as const, repo: "davidsilva131/MyTodo-back", title: "Opened issue: Add rate limiting", time: "1 day ago" },
  { type: "WatchEvent" as const, repo: "F1shing-Bugs/LotoPetsPlay", title: "Starred the repository", time: "2 days ago" },
  { type: "CreateEvent" as const, repo: "davidsilva131/gh-dash", title: "Created repository gh-dash", time: "3 days ago" },
  { type: "PushEvent" as const, repo: "davidsilva131/portfolio", title: "Pushed 5 commits to main", time: "4 days ago" },
  { type: "ForkEvent" as const, repo: "davidsilva131/rust-adventures", title: "Forked from rust-lang/book", time: "1 week ago" },
  { type: "PullRequestEvent" as const, repo: "davidsilva131/LotoPetsPlay", title: "Merged PR: fix auth redirect loop", time: "1 week ago" },
];

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
