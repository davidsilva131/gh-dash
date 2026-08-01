// Relative-time formatting for GitHub-style ISO 8601 timestamps.

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 12 * MONTH_MS;

function plural(n: number, unit: string): string {
  return n + " " + unit + (n === 1 ? "" : "s") + " ago";
}

/**
 * Formats an ISO 8601 timestamp as a GitHub-style relative time
 * ("just now", "5 minutes ago", "2 days ago", "3 months ago").
 * Falls back to the raw input when the date cannot be parsed.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return iso;

  const diff = now.getTime() - ts;
  if (diff < MINUTE_MS) return "just now"; // also covers future timestamps

  if (diff < HOUR_MS) return plural(Math.floor(diff / MINUTE_MS), "minute");
  if (diff < DAY_MS) return plural(Math.floor(diff / HOUR_MS), "hour");
  if (diff < MONTH_MS) return plural(Math.floor(diff / DAY_MS), "day");
  if (diff < YEAR_MS) return plural(Math.floor(diff / MONTH_MS), "month");
  return plural(Math.floor(diff / YEAR_MS), "year");
}
