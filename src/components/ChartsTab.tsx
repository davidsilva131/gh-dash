import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorDisplay from "./ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface ChartsTabProps {
  username: string;
  data: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
  onRetry?: () => void;
}

function getContributionColor(count: number): string {
  if (count === 0) return "var(--contrib-0)";
  if (count === 1) return "var(--contrib-1)";
  if (count === 2) return "var(--contrib-2)";
  if (count === 3) return "var(--contrib-3)";
  return "var(--contrib-4)";
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthlyCommitsFromContributions(
  contributions: { days: number[] }[],
): { month: string; commits: number }[] {
  const days = contributions.flatMap((week) => week.days);
  const perMonth = new Array<number>(12).fill(0);
  days.forEach((count, i) => {
    const bucket = Math.min(11, Math.floor(i / 30));
    perMonth[bucket] += count;
  });
  return MONTHS.map((month, i) => ({ month, commits: perMonth[i] }));
}

// Recharts tooltip style (Terminal instrument: bg card, mono, sharp)
const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border-bright)",
  borderRadius: "4px",
  color: "var(--foreground)",
  fontFamily:
    "'Geist Mono Variable', 'Geist Mono', 'JetBrains Mono', monospace",
  fontSize: "12px",
  padding: "8px 12px",
};

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 11 };
const GRID_STROKE = "var(--border)";

export default function ChartsTab({
  username,
  data,
  isLoading,
  error,
  onRetry,
}: ChartsTabProps) {
  if (error) {
    return (
      <div data-testid="charts-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div
        data-testid="charts-loading"
        role="status"
        aria-label="Loading charts"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[280px] w-full rounded-md" />
          <Skeleton className="h-[280px] w-full rounded-md" />
        </div>
        <Skeleton className="h-64 w-full rounded-md" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  const languages = data.languages;
  const starsPerRepo = data.repos.map((r) => ({ name: r.name, stars: r.stars }));
  const contributionWeeks = data.contributions;
  const activityData = monthlyCommitsFromContributions(data.contributions);

  return (
    <div className="space-y-6">
      {/* Languages donut + Stars bar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-md border border-border bg-card">
          <CardHeader>
            <CardTitle className="mono text-sm font-semibold uppercase tracking-wider text-muted-foreground before:mr-1 before:text-primary before:content-['>_>']">
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={languages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {languages.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: "var(--border)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="mono text-3xl font-bold text-foreground">
                  {languages.length}
                </span>
                <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  total langs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border border-border bg-card">
          <CardHeader>
            <CardTitle className="mono text-sm font-semibold uppercase tracking-wider text-muted-foreground before:mr-1 before:text-primary before:content-['>_>']">
              Stars per Repository
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={starsPerRepo}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--positive)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="name" tick={AXIS_TICK} stroke={GRID_STROKE} />
                <YAxis tick={AXIS_TICK} stroke={GRID_STROKE} />
                <RechartsTooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: "var(--border)" }}
                />
                <Bar dataKey="stars" fill="url(#barGradient)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Calendar */}
      <Card className="rounded-md border border-border bg-card">
        <CardHeader>
          <CardTitle className="mono text-sm font-semibold uppercase tracking-wider text-muted-foreground before:mr-1 before:text-primary before:content-['>_>']">
            Contribution Calendar
          </CardTitle>
          <p className="mono text-xs text-muted-foreground">{username}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-[2px]">
              {contributionWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: getContributionColor(day) }}
                      title={`${day} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mono mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: getContributionColor(level) }}
              />
            ))}
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity line chart */}
      <Card className="rounded-md border border-border bg-card">
        <CardHeader>
          <CardTitle className="mono text-sm font-semibold uppercase tracking-wider text-muted-foreground before:mr-1 before:text-primary before:content-['>_>']">
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="month" tick={AXIS_TICK} stroke={GRID_STROKE} />
              <YAxis tick={AXIS_TICK} stroke={GRID_STROKE} />
              <RechartsTooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#lineGradient)"
                name="Commits"
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ fill: "var(--primary)", r: 3 }}
                activeDot={{ r: 5, fill: "var(--primary)" }}
                name="Commits"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
