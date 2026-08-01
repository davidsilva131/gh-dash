import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FolderGit2, Star, Users, UserPlus } from "lucide-react";
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

// Contribution heatmap color scale (Terminal instrument: cyan-green ramp).
// 0 = empty, 1..3 = increasing intensity, 4 = maximum.
const CONTRIBUTION_LEVEL_CLASSES = [
  "bg-contrib-0",
  "bg-contrib-1",
  "bg-contrib-2",
  "bg-contrib-3",
  "bg-contrib-4",
];

const VISIBLE_WEEKS = 26;

function getContributionLevel(count: number) {
  return CONTRIBUTION_LEVEL_CLASSES[Math.min(count, CONTRIBUTION_LEVEL_CLASSES.length - 1)];
}

function countContributions(weeks: { days: number[] }[]) {
  return weeks.reduce(
    (sum, week) =>
      sum + week.days.reduce((daySum, count) => daySum + count, 0),
    0,
  );
}

export default function OverviewTab({
  username,
  data,
  isLoading,
  error,
  onRetry,
}: OverviewTabProps) {
  if (error) {
    return (
      <div data-testid="overview-error">
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div
        data-testid="overview-loading"
        role="status"
        aria-label="Loading profile"
        className="space-y-6"
      >
        <Skeleton className="h-32 w-full rounded-md" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded-sm" />
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {Array.from({ length: 26 }).map((_, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, di) => (
                  <Skeleton key={di} className="h-2.5 w-2.5 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats, languages } = data;
  const visibleContributionWeeks = data.contributions.slice(-VISIBLE_WEEKS);
  const totalContributions = countContributions(visibleContributionWeeks);

  return (
    <div className="space-y-6">
      {/* Profile hero card */}
      <Card className="rounded-md border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar className="h-24 w-24 shrink-0 ring-1 ring-primary/40">
              <AvatarImage src={profile.avatarUrl} alt={profile.login} />
              <AvatarFallback className="mono text-2xl text-foreground">
                {profile.login[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.name}
                </h2>
                <Badge
                  variant="secondary"
                  className="mono rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  @{profile.login}
                </Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{profile.bio}</p>
              <div className="mono flex flex-wrap gap-3 text-xs text-muted-foreground">
                {profile.company && (
                  <span className="text-muted-foreground">{profile.company}</span>
                )}
                {profile.location && (
                  <span className="text-muted-foreground">{profile.location}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Repositories" value={stats.publicRepos} icon={<FolderGit2 />} />
        <StatCard label="Total Stars" value={stats.totalStars} icon={<Star />} />
        <StatCard label="Followers" value={profile.followers} icon={<Users />} />
        <StatCard label="Following" value={profile.following} icon={<UserPlus />} />
      </div>

      {/* Languages + Contributions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-md border border-border bg-card">
          <CardHeader>
            <CardTitle className="mono text-sm font-semibold uppercase tracking-wider text-muted-foreground before:mr-1 before:text-primary before:content-['>_']">
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="mono mb-1 flex justify-between text-xs">
                      <span className="text-foreground before:mr-1 before:text-primary before:content-['>_']">
                        {lang.name}
                      </span>
                      <span className="text-muted-foreground">{lang.value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-sm bg-border">
                      <div
                        className="h-full rounded-sm transition-all duration-500"
                        style={{
                          width: lang.value + "%",
                          backgroundColor: lang.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border border-border bg-card">
          <CardHeader>
            <CardTitle className="mono text-sm font-semibold uppercase tracking-wider text-muted-foreground before:mr-1 before:text-primary before:content-['>_']">
              Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-[2px] overflow-x-auto">
              {visibleContributionWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      className={`h-2.5 w-2.5 rounded-sm ${getContributionLevel(day)}`}
                      title={day + " contributions"}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="mono text-xs text-muted-foreground before:mr-1 before:text-primary before:content-['>_']">
                {totalContributions}{" "}
                {totalContributions === 1 ? "contribution" : "contributions"}{" "}
                in the last 6 months
              </p>
              <div className="mono flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>Less</span>
                {CONTRIBUTION_LEVEL_CLASSES.map((levelClass) => (
                  <span
                    key={levelClass}
                    className={`h-2.5 w-2.5 rounded-sm ${levelClass}`}
                  />
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
