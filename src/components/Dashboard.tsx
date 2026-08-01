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

// Terminal-style wordmark: ">" in cyan + "gh-dash" in fg
function Wordmark({ size = "lg" }: { size?: "sm" | "lg" }) {
  const cls =
    size === "lg"
      ? "text-4xl font-bold"
      : "text-base font-semibold";
  return (
    <h1
      className={`mono ${cls} leading-none tracking-tight`}
    >
      <span className="text-primary">{">"}</span>
      <span className="text-foreground"> gh-dash</span>
    </h1>
  );
}

// Terminal-style search input with "$" prefix
function SearchInput({
  value,
  onChange,
  placeholder,
  size = "sm",
  autoFocus = false,
  invalid = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  size?: "sm" | "md";
  autoFocus?: boolean;
  invalid?: boolean;
}) {
  const inputCls =
    size === "md"
      ? "h-12 text-base pl-9 pr-4"
      : "h-9 text-sm pl-7 pr-3";
  return (
    <div className="relative w-full">
      <span
        aria-hidden="true"
        className="mono text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        $
      </span>
      <Input
        type="text"
        aria-label="GitHub username"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        aria-invalid={invalid ? true : undefined}
        className={`mono border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-[0_0_16px_-4px_var(--primary)] [caret-color:var(--primary)] ${inputCls}`}
      />
    </div>
  );
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

  const showLoading = isLoading || (!data && !error);
  const tabProps = { username, data, isLoading: showLoading, error, onRetry: handleRetry };

  if (!username) {
    return (
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4">
        <div className="w-full max-w-xl space-y-4 text-center">
          <Wordmark size="lg" />
          <p className="mono text-sm text-muted-foreground">
            // GitHub Personal Dashboard
          </p>
          <p className="text-sm text-muted-foreground/80">
            view profile · repos · contributions · activity
          </p>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-xl gap-2"
          noValidate
        >
          <SearchInput
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (validationError) setValidationError(null);
            }}
            placeholder="davidsilva131"
            size="md"
            autoFocus
            invalid={!!validationError}
          />
          <Button
            type="submit"
            className="mono h-12 border border-primary bg-transparent px-5 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 hover:shadow-[0_0_16px_-4px_var(--primary)]"
          >
            View <span aria-hidden="true">-&gt;</span>
          </Button>
        </form>
        {validationError && (
          <p role="alert" className="mono text-xs text-destructive">
            <span className="text-accent">! </span>
            {validationError}
          </p>
        )}
        <p className="mono text-xs text-muted-foreground/70">
          {"> "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSearchInput("davidsilva131");
              setUsername("davidsilva131");
              setValidationError(null);
            }}
            className="text-primary hover:underline"
          >
            try: davidsilva131
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 space-y-6">
      <header className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <a href="/" className="shrink-0">
            <Wordmark size="sm" />
          </a>
          <form
            onSubmit={handleSearch}
            className="flex max-w-md flex-1 gap-2"
            noValidate
          >
            <SearchInput
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                if (validationError) setValidationError(null);
              }}
              placeholder="search handle..."
              invalid={!!validationError}
            />
            <Button
              type="submit"
              size="sm"
              className="mono border border-primary bg-transparent px-3 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 hover:shadow-[0_0_16px_-4px_var(--primary)]"
            >
              Search
            </Button>
          </form>
        </div>
        {validationError && (
          <p role="alert" className="mono mt-2 text-xs text-destructive">
            <span className="text-accent">! </span>
            {validationError}
          </p>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3 w-full">
          <TabsList className="mono flex h-auto w-full justify-start gap-0 rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="mono relative rounded-none border-0 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground before:mr-1.5 before:text-primary/40 before:content-['>_'] data-[state=active]:before:text-primary data-[state=active]:after:absolute data-[state=active]:after:bottom-[-13px] data-[state=active]:after:left-3 data-[state=active]:after:right-3 data-[state=active]:after:h-px data-[state=active]:after:bg-primary data-[state=active]:after:shadow-[0_0_8px_var(--primary)] data-[state=active]:after:content-['']"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="repos"
              className="mono relative rounded-none border-0 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground before:mr-1.5 before:text-primary/40 before:content-['>_'] data-[state=active]:before:text-primary data-[state=active]:after:absolute data-[state=active]:after:bottom-[-13px] data-[state=active]:after:left-3 data-[state=active]:after:right-3 data-[state=active]:after:h-px data-[state=active]:after:bg-primary data-[state=active]:after:shadow-[0_0_8px_var(--primary)] data-[state=active]:after:content-['']"
            >
              Repos
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="mono relative rounded-none border-0 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground before:mr-1.5 before:text-primary/40 before:content-['>_'] data-[state=active]:before:text-primary data-[state=active]:after:absolute data-[state=active]:after:bottom-[-13px] data-[state=active]:after:left-3 data-[state=active]:after:right-3 data-[state=active]:after:h-px data-[state=active]:after:bg-primary data-[state=active]:after:shadow-[0_0_8px_var(--primary)] data-[state=active]:after:content-['']"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="charts"
              className="mono relative rounded-none border-0 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground before:mr-1.5 before:text-primary/40 before:content-['>_'] data-[state=active]:before:text-primary data-[state=active]:after:absolute data-[state=active]:after:bottom-[-13px] data-[state=active]:after:left-3 data-[state=active]:after:right-3 data-[state=active]:after:h-px data-[state=active]:after:bg-primary data-[state=active]:after:shadow-[0_0_8px_var(--primary)] data-[state=active]:after:content-['']"
            >
              Charts
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="min-h-[60vh]">
        {activeTab === "overview" && <OverviewTab {...tabProps} />}
        {activeTab === "repos" && <ReposTab {...tabProps} />}
        {activeTab === "activity" && <ActivityTab {...tabProps} />}
        {activeTab === "charts" && <ChartsTab {...tabProps} />}
      </div>

      <footer className="mono mt-12 border-t border-border pt-6 text-center text-[11px] text-muted-foreground/70">
        <p>
          {"> "}built with:{" "}
          <span className="text-primary">astro</span>
          {" · "}
          <span className="text-primary">react</span>
          {" · "}
          <span className="text-primary">tailwind</span>
          {" · "}
          <span className="text-primary">shadcn/ui</span>
          {" · "}
          <span className="text-primary">recharts</span>
        </p>
      </footer>
    </div>
  );
}
