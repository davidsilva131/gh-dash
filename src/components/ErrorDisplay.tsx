import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

  return <p className="text-sm text-muted-foreground mt-1">{label}</p>;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  switch (error.type) {
    case "not_found":
      return (
        <div role="alert" className="p-8 text-center">
          <p className="text-lg font-semibold">User not found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Check the username and try again.
          </p>
        </div>
      );
    case "rate_limited":
      return (
        <div role="alert" className="p-8 text-center">
          <p className="text-lg font-semibold">Rate limit hit</p>
          <RateLimitMessage retryAfter={error.retryAfter} />
        </div>
      );
    case "network":
      return (
        <div role="alert" className="p-8 text-center">
          <p className="text-lg font-semibold">Could not reach GitHub</p>
          <p className="text-muted-foreground text-sm mt-1">
            Check your connection and try again.
          </p>
          <Button onClick={() => onRetry?.()} className="mt-4">
            Retry
          </Button>
        </div>
      );
  }
}
