import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OverviewTab from "./OverviewTab";
import ReposTab from "./ReposTab";
import ActivityTab from "./ActivityTab";
import ChartsTab from "./ChartsTab";
import type { GitHubUserData, ErrorState } from "@/lib/types";

const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

interface DashboardProps {
  initialUsername?: string;
}

interface ApiErrorBody {
  error?: { type?: ErrorState["type"]; message?: string; retryAfter?: string };
}

export default function Dashboard({ initialUsername = "" }: DashboardProps) {
  const [username, setUsername] = useState(initialUsername);
  const [searchInput, setSearchInput] = useState(initialUsername);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<GitHubUserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!username) return;

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    setData(null);

    fetch("/api/github/" + encodeURIComponent(username) + ".json", {
      signal: controller.signal,
    })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as
          | GitHubUserData
          | ApiErrorBody;
        if (!res.ok) {
          const err = (body as ApiErrorBody).error;
          setError({
            type: err?.type ?? "network",
            message: err?.message ?? "Something went wrong",
            retryAfter: err?.retryAfter,
          });
          return;
        }
        setData(body as GitHubUserData);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError({ type: "network", message: "Could not reach the dashboard API" });
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [username, retryKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchInput.trim();
    if (!value || !USERNAME_REGEX.test(value)) {
      setValidationError(
        "Username can only contain letters, numbers, and single hyphens.",
      );
      return;
    }
    setValidationError(null);
    setUsername(value);
  };

  const handleRetry = () => {
    setRetryKey((k) => k + 1);
  };

  // Until a fetch has produced data or an error, treat the UI as loading
  // (covers the render between submit and the effect running).
  const showLoading = isLoading || (!data && !error);
  const tabProps = { username, data, isLoading: showLoading, error, onRetry: handleRetry };

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
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md" noValidate>
          <Input
            type="text"
            placeholder="Enter GitHub username..."
            aria-label="GitHub username"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="flex-1"
            autoFocus
            aria-invalid={validationError ? true : undefined}
          />
          <Button type="submit">View</Button>
        </form>
        {validationError && (
          <p role="alert" className="text-sm text-destructive">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search + Tabs */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4 -mx-4 px-4 pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary shrink-0">gh-dash</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-sm flex-1 ml-6" noValidate>
            <Input
              type="text"
              placeholder="GitHub username..."
              aria-label="GitHub username"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="flex-1"
              aria-invalid={validationError ? true : undefined}
            />
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>
        {validationError && (
          <p role="alert" className="text-sm text-destructive">
            {validationError}
          </p>
        )}
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
        {activeTab === "overview" && <OverviewTab {...tabProps} />}
        {activeTab === "repos" && <ReposTab {...tabProps} />}
        {activeTab === "activity" && <ActivityTab {...tabProps} />}
        {activeTab === "charts" && <ChartsTab {...tabProps} />}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground border-t border-border pt-6 mt-12">
        <p>Built with Astro 7 + React 19 + Tailwind v4 + shadcn/ui + Recharts</p>
      </footer>
    </div>
  );
}
