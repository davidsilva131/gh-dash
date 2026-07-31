import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OverviewTab from "./OverviewTab";
import ReposTab from "./ReposTab";
import ActivityTab from "./ActivityTab";
import ChartsTab from "./ChartsTab";

interface DashboardProps {
  initialUsername?: string;
}

export default function Dashboard({ initialUsername = "" }: DashboardProps) {
  const [username, setUsername] = useState(initialUsername);
  const [searchInput, setSearchInput] = useState(initialUsername);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
    }
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-primary">gh-dash</h1>
          <p className="text-lg text-muted-foreground">GitHub Personal Dashboard</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Enter a GitHub username to view their profile, repositories, contribution history, and more.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="Enter GitHub username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button type="submit">View</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search + Tabs */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4 -mx-4 px-4 pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary shrink-0">gh-dash</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-sm flex-1 ml-6">
            <Input
              type="text"
              placeholder="GitHub username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">Search</Button>
          </form>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repos">Repos</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === "overview" && <OverviewTab username={username} />}
        {activeTab === "repos" && <ReposTab username={username} />}
        {activeTab === "activity" && <ActivityTab username={username} />}
        {activeTab === "charts" && <ChartsTab username={username} />}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground border-t border-border pt-6 mt-12">
        <p>Built with Astro 7 + React 19 + Tailwind v4 + shadcn/ui + Recharts</p>
      </footer>
    </div>
  );
}
