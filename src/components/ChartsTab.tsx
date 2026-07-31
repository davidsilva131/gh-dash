import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SAMPLE_CHARTS_LANGUAGES as LANGUAGES, SAMPLE_STARS as STARS_PER_REPO, SAMPLE_ACTIVITY as ACTIVITY_DATA, SAMPLE_CONTRIBUTION_WEEKS as CONTRIBUTION_WEEKS } from "../test/fixtures";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface ChartsTabProps {
  username: string;
  data?: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
}

function getContributionColor(count: number): string {
  if (count === 0) return "#1a1a1a";
  if (count === 1) return "#0e4429";
  if (count === 2) return "#006d32";
  if (count === 3) return "#26a641";
  return "#39d353";
}

export default function ChartsTab({ username, data, isLoading, error }: ChartsTabProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground" data-testid="charts-loading">Loading charts...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="charts-error">
        <p className="text-destructive font-semibold">Error</p>
        <p className="text-muted-foreground text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const languages = data?.languages ?? LANGUAGES;
  const starsPerRepo = data?.repos?.map((r) => ({ name: r.name, stars: r.stars })) ?? STARS_PER_REPO;
  const contributionWeeks = data?.contributions ?? CONTRIBUTION_WEEKS;
  const activityData = ACTIVITY_DATA; // No direct spec equivalent yet

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
              <Line type="monotone" dataKey="prs" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} name="PRs" />
              <Line type="monotone" dataKey="issues" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} name="Issues" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
