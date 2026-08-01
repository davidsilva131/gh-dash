import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "../lib/dates";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork } from "lucide-react";

interface RepoCardProps {
  name: string;
  description?: string;
  language?: string;
  languageColor?: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  default: "#8b949e",
};

export default function RepoCard({
  name,
  description,
  language,
  stars,
  forks,
  updatedAt,
}: RepoCardProps) {
  const color = language
    ? languageColors[language] || languageColors.default
    : languageColors.default;

  return (
    <Card className="group relative rounded-md border border-border bg-card p-0 transition-all duration-200 hover:border-primary hover:shadow-[0_0_0_1px_var(--primary),0_0_16px_-4px_var(--primary)]">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="mono text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {name}
        </CardTitle>
        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="mono flex items-center gap-4 text-xs text-muted-foreground">
          {language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star
              className="h-3 w-3"
              aria-label={`${stars} stars`}
            />
            {stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork
              className="h-3 w-3"
              aria-label={`${forks} forks`}
            />
            {forks}
          </span>
          <span className="ml-auto">{formatRelativeTime(updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
