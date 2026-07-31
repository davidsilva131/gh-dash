import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardIslandProps {
  username?: string;
}

export default function DashboardIsland({ username = "" }: DashboardIslandProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
            {username ? username[0].toUpperCase() : "?"}
          </span>
          <span>{username || "Enter a GitHub username"}</span>
          <Badge variant="outline" className="ml-auto">scaffold</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">--</p>
              <p className="text-xs text-muted-foreground mt-1">Repos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">--</p>
              <p className="text-xs text-muted-foreground mt-1">Followers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">--</p>
              <p className="text-xs text-muted-foreground mt-1">Following</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Input type="text" placeholder="GitHub username..." />
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Search
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This scaffold validates the stack works. Real data integration coming in future tickets.
        </p>
      </CardContent>
    </Card>
  );
}
