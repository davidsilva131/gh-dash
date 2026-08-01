import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "../lib/dates";
import { Badge } from "@/components/ui/badge";

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
  const color = language ? (languageColors[language] || languageColors.default) : languageColors.default;

  return (
    <Card className="hover:border-primary/30 transition-colors group">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              {language}
            </span>
          )}
          <span className="flex items-center gap-1">&#9733; {stars}</span>
          <span className="flex items-center gap-1">&#9733; {forks}</span>
          <span className="ml-auto">{formatRelativeTime(updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
