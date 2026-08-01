import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserX, Clock, WifiOff } from "lucide-react";
import type { ErrorState } from "@/lib/types";

interface ErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
}

function RateLimitMessage({ retryAfter }: { retryAfter?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!retryAfter) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [retryAfter]);

  const msLeft = retryAfter ? new Date(retryAfter).getTime() - now : 0;
  const minutes = Math.max(0, Math.ceil(msLeft / 60_000));

  let label: string;
  if (minutes <= 0) label = "Try again in less than a minute";
  else if (minutes === 1) label = "Try again in 1 minute";
  else label = `Try again in ${minutes} minutes`;

  return <p className="mono mt-1 text-xs text-muted-foreground">{label}</p>;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  switch (error.type) {
    case "not_found":
      return (
        <div
          role="alert"
          className="rounded-md border border-border bg-card p-8 text-center"
        >
          <UserX
            className="mx-auto mb-3 h-8 w-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mono text-sm font-semibold uppercase tracking-wider text-foreground">
            User not found
          </p>
          <p className="mono mt-1 text-xs text-muted-foreground">
            Check the username and try again.
          </p>
        </div>
      );
    case "rate_limited":
      return (
        <div
          role="alert"
          className="rounded-md border border-border bg-card p-8 text-center"
        >
          <Clock
            className="mx-auto mb-3 h-8 w-8 text-accent"
            aria-hidden="true"
          />
          <p className="mono text-sm font-semibold uppercase tracking-wider text-foreground">
            Rate limit hit
          </p>
          <RateLimitMessage retryAfter={error.retryAfter} />
        </div>
      );
    case "network":
      return (
        <div
          role="alert"
          className="rounded-md border border-border bg-card p-8 text-center"
        >
          <WifiOff
            className="mx-auto mb-3 h-8 w-8 text-destructive"
            aria-hidden="true"
          />
          <p className="mono text-sm font-semibold uppercase tracking-wider text-foreground">
            Could not reach GitHub
          </p>
          <p className="mono mt-1 text-xs text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            onClick={() => onRetry?.()}
            className="mono mt-4 border border-primary bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 hover:shadow-[0_0_16px_-4px_var(--primary)]"
          >
            Retry
          </Button>
        </div>
      );
  }
}
