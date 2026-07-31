import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  LineChart, Line, ResponsiveContainer,
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
  if (count === 0) return "#1a1a1a";
  if (count === 1) return "#0e4429";
  if (count === 2) return "#006d32";
  if (count === 3) return "#26a641";
  return "#39d353";
}


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthlyCommitsFromContributions(contributions: { days: number[] }[]): { month: string; commits: number }[] {
  const days = contributions.flatMap((week) => week.days);
  const perMonth = new Array<number>(12).fill(0);
  days.forEach((count, i) => {
    const bucket = Math.min(11, Math.floor(i / 30));
    perMonth[bucket] += count;
  });
  return MONTHS.map((month, i) => ({ month, commits: perMonth[i] }));
}

export default function ChartsTab({ username, data, isLoading, error, onRetry }: ChartsTabProps) {
  if (error) {
    return (
      <div data-testid="charts-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div data-testid="charts-loading" role="status" aria-label="Loading charts" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[280px] w-full rounded-xl" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  const languages = data.languages;
  const starsPerRepo = data.repos.map((r) => ({ name: r.name, stars: r.stars }));
  const contributionWeeks = data.contributions;
  const activityData = monthlyCommitsFromContributions(data.contributions);

  return (
    <div className="space-y-6">
      {/* Languages Pie + Stars Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Languages</CardTitle></CardHeader>
          <CardContent>
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
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Stars per Repository</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={starsPerRepo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                />
                <Bar dataKey="stars" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contribution Calendar</CardTitle>
          <p className="text-sm text-muted-foreground">{username}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-[3px] min-w-max">
              {contributionWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      className="w-[12px] h-[12px] rounded-sm"
                      style={{ backgroundColor: getContributionColor(day) }}
                      title={`${day} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getContributionColor(level) }}
              />
            ))}
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Line Chart */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Activity Overview</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
              />
              <Line type="monotone" dataKey="commits" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} name="Commits" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
