import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatCard from "./StatCard";

interface OverviewTabProps {
  username: string;
}

const SAMPLE_DATA = {
  name: "David Silva",
  login: "davidsilva131",
  bio: "Full-stack developer. Building with Next.js, Astro, React, and Tailwind. Open source enthusiast.",
  avatarUrl: "https://avatars.githubusercontent.com/u/116703237?v=4",
  followers: 42,
  following: 28,
  publicRepos: 57,
  totalStars: 186,
  company: "FishingBugs",
  location: "Chile",
  blog: "",
  languages: [
    { name: "TypeScript", value: 35, color: "#3178c6" },
    { name: "JavaScript", value: 28, color: "#f1e05a" },
    { name: "Python", value: 18, color: "#3572A5" },
    { name: "CSS/HTML", value: 12, color: "#e34c26" },
    { name: "Other", value: 7, color: "#8b949e" },
  ],
  contributionWeeks: Array.from({ length: 52 }, () => ({
    days: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)),
  })),
};

function getContributionLevel(count: number) {
  if (count === 0) return "bg-border/30";
  if (count === 1) return "bg-accent/30";
  if (count === 2) return "bg-accent/50";
  if (count === 3) return "bg-accent/70";
  return "bg-accent";
}

export default function OverviewTab({ username }: OverviewTabProps) {
  const data = SAMPLE_DATA;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 shrink-0 border-4 border-border">
              <AvatarImage src={data.avatarUrl} alt={data.login} />
              <AvatarFallback className="text-2xl">{data.login[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{data.name}</h2>
                <Badge variant="secondary">@{data.login}</Badge>
              </div>
              <p className="text-muted-foreground mb-3">{data.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {data.company && <span>{data.company}</span>}
                {data.location && <span>{data.location}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Repositories" value={data.publicRepos} icon="" />
        <StatCard label="Total Stars" value={data.totalStars} icon="" />
        <StatCard label="Followers" value={data.followers} icon="" />
        <StatCard label="Following" value={data.following} icon="" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Languages</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.languages.map((lang) => (
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
              {data.contributionWeeks.slice(0, 26).map((week, wi) => (
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
