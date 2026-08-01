import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatCard from "./StatCard";
import ErrorDisplay from "./ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface OverviewTabProps {
  username: string;
  data: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
  onRetry?: () => void;
}

// Contribution heatmap color scale (GitHub-style green ramp).
// 0 = empty, 1..3 = increasing intensity, 4+ = maximum.
const CONTRIBUTION_LEVEL_CLASSES = [
  "bg-border/30",
  "bg-emerald-200",
  "bg-emerald-400",
  "bg-emerald-600",
  "bg-emerald-700",
];

// Weeks of the contribution calendar shown in the Overview tab.
const VISIBLE_WEEKS = 26;

function getContributionLevel(count: number) {
  return CONTRIBUTION_LEVEL_CLASSES[Math.min(count, CONTRIBUTION_LEVEL_CLASSES.length - 1)];
}

function countContributions(weeks: { days: number[] }[]) {
  return weeks.reduce((sum, week) => sum + week.days.reduce((daySum, count) => daySum + count, 0), 0);
}

export default function OverviewTab({ username, data, isLoading, error, onRetry }: OverviewTabProps) {
  if (error) {
    return (
      <div data-testid="overview-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div data-testid="overview-loading" role="status" aria-label="Loading profile" className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded-full" />
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {Array.from({ length: 26 }).map((_, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, di) => (
                  <Skeleton key={di} className="w-3 h-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats, languages } = data;
  // GitHub returns weeks oldest-first, so the visible window is the LAST weeks.
  const visibleContributionWeeks = data.contributions.slice(-VISIBLE_WEEKS);
  const totalContributions = countContributions(visibleContributionWeeks);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 shrink-0 border-4 border-border">
              <AvatarImage src={profile.avatarUrl} alt={profile.login} />
              <AvatarFallback className="text-2xl">{profile.login[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <Badge variant="secondary">@{profile.login}</Badge>
              </div>
              <p className="text-muted-foreground mb-3">{profile.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.company && <span>{profile.company}</span>}
                {profile.location && <span>{profile.location}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Repositories" value={stats.publicRepos} icon="" />
        <StatCard label="Total Stars" value={stats.totalStars} icon="" />
        <StatCard label="Followers" value={profile.followers} icon="" />
        <StatCard label="Following" value={profile.following} icon="" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Languages</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{lang.name}</span>
                      <span className="text-muted-foreground">{lang.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: lang.value + "%", backgroundColor: lang.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Contributions</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-1 overflow-x-auto">
              {visibleContributionWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      className={"w-3 h-3 rounded-sm " + getContributionLevel(day)}
                      title={day + " contributions"}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {totalContributions} {totalContributions === 1 ? "contribution" : "contributions"} in the last 6 months
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Less</span>
                {CONTRIBUTION_LEVEL_CLASSES.map((levelClass) => (
                  <span key={levelClass} className={"w-3 h-3 rounded-sm " + levelClass} />
                ))}
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
