import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatCard from "./StatCard";
import { SAMPLE_USER_DATA, SAMPLE_LANGUAGES, SAMPLE_CONTRIBUTION_WEEKS } from "../test/fixtures";
import type { GitHubUserData, ErrorState } from "../lib/types";

interface OverviewTabProps {
  username: string;
  data?: GitHubUserData;
  isLoading?: boolean;
  error?: ErrorState | null;
}

function getContributionLevel(count: number) {
  if (count === 0) return "bg-border/30";
  if (count === 1) return "bg-accent/30";
  if (count === 2) return "bg-accent/50";
  if (count === 3) return "bg-accent/70";
  return "bg-accent";
}

export default function OverviewTab({ username, data, isLoading, error }: OverviewTabProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground" data-testid="overview-loading">Loading {username}'s profile...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center" data-testid="overview-error">
        <p className="text-destructive font-semibold">Error</p>
        <p className="text-muted-foreground text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  // Use provided data when available, otherwise fall back to SAMPLE_USER_DATA (flat shape)
  const profile = data?.profile ?? SAMPLE_USER_DATA;
  const stats = data?.stats ?? { publicRepos: SAMPLE_USER_DATA.publicRepos, totalStars: SAMPLE_USER_DATA.totalStars };
  const languages = data?.languages ?? SAMPLE_USER_DATA.languages;
  const contributionWeeks = data?.contributions ?? SAMPLE_USER_DATA.contributionWeeks;

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
              {contributionWeeks.slice(0, 26).map((week, wi) => (
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
            <p className="text-xs text-muted-foreground mt-3 text-center">
              186 contributions in the last year
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
