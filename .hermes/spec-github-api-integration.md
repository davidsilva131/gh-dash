## Problem Statement

gh-dash currently renders hardcoded sample data in all four dashboard tabs. Every user sees the same profile (davidsilva131, 42 followers), the same repos, and random contribution weeks — regardless of the username typed. There is no data-fetching layer, no server-side API integration, no loading or error handling, and no caching. The dashboard is a UI prototype, not a functional tool.

The wayfinder map lists "GitHub API data integration" and "Error/loading/skeleton states" under *Not yet specified*. As the stack and layout are validated, the next step is to make gh-dash actually fetch and display real GitHub data.

## Solution

Build a server-side data layer that fetches from the GitHub GraphQL and REST APIs using a server-side Personal Access Token (PAT). Expose the data through an Astro API endpoint (`GET /api/github/[username]`). Add in-memory caching with a 5-minute TTL to respect rate limits. Implement loading skeletons, empty states, and error states for each tab. The PAT never reaches the browser.

## User Stories

1. As a user, I want to type a GitHub username and see their real profile (name, avatar, bio, company, location, blog, followers, following), so that the dashboard shows actual data instead of the hardcoded placeholder.
2. As a user, I want to see the user's public repository count and total stars across all repos, so that I can gauge their open-source presence at a glance.
3. As a user, I want to see a language breakdown (percentage bars per language) computed from the user's actual repositories, so that I understand what technologies they work with.
4. As a user, I want to see a contribution heatmap showing the last 52 weeks of activity, so that I can visualize their GitHub activity pattern over the past year.
5. As a user, I want to browse the user's public repositories sorted by stars or recently updated, so that I can find their most popular or active projects.
6. As a user, I want to see the user's recent public activity events (pushes, PRs, issues, stars, forks — up to 100 events), so that I know what they've been working on lately.
7. As a user, I want the dashboard to cache recent lookups so that switching tabs or re-entering the same username is instant, and I don't burn through GitHub's rate limits.
8. As a user, I want to see skeleton placeholders (pulsing cards, shimmer text) while data is loading, so that the dashboard feels responsive rather than blank during API calls.
9. As a user, I want a clear error message when a username does not exist (404), so that I can correct a typo rather than wonder why nothing loaded.
10. As a user, I want a clear error message when the API rate limit is exhausted, telling me to try again later, so that I don't see confusing or misleading errors.
11. As a user, I want an error state when GitHub is unreachable (network failure, timeout), with a retry button, so that I can recover from transient issues.
12. As a user, I want the search input to reject invalid usernames (empty, special chars outside the allowed set), so that I get immediate feedback on typos before a network request fires.
13. As a developer, I want the GitHub PAT to be consumed server-side only, never exposed in the browser or any client-side network request, so that the token is never leaked.
14. As a developer, I want the service layer to be unit-testable with mocked HTTP responses, so that data-transformation logic and error-handling branches are verified without real API calls.
15. As a maintainer, I want the existing 29 component tests to keep passing unchanged after the data layer lands, so that the sample-data UI doesn't silently break during integration.

## Implementation Decisions

### Architecture

- **Astro API endpoint**: `GET /api/github/[username].json` (server-side only). Returns a JSON response with all dashboard data. The Dashboard React island fetches this endpoint on username change. The PAT is read from `import.meta.env.GITHUB_TOKEN` — it never leaves the server.
- **GraphQL for structured data**: Profile, repos, languages, and contribution data come from a single GitHub GraphQL query (`https://api.github.com/graphql`). The query requests exactly the fields the UI needs — no overfetching.
- **REST for events**: Recent activity comes from the GitHub REST Events API (`/users/{username}/events/public`) since there is no GraphQL equivalent. Returns up to 100 public events in standard GitHub Event format.
- **In-memory cache**: A `Map<string, CacheEntry>` where CacheEntry is `{ data: GitHubUserData, timestamp: number }`. On fetch, check cache: if entry exists and is less than 5 minutes old, return cached data. Otherwise fetch, store, and return. This handles tab-switching and re-entering the same username without extra API calls. No Redis for MVP — deferred to a future ticket.
- **Node 22 native fetch**: No HTTP client library needed. Node's built-in `fetch` is available on the Astro server and supports streaming headers for rate-limit awareness.

### Data types

Transform raw API responses into a single typed struct (`GitHubUserData`) consumed by the UI:

`TypeScript
interface GitHubUserData {
  profile: {
    login: string
    name: string | null
    avatarUrl: string
    bio: string | null
    company: string | null
    location: string | null
    blog: string
    followers: number
    following: number
  }
  stats: {
    publicRepos: number
    totalStars: number
  }
  languages: { name: string; value: number; color: string }[]
  contributions: { days: number[] }[]  // 52 weeks x 7 days
  repos: Repo[]
  activity: ActivityEvent[]
}

interface Repo {
  name: string
  description: string | null
  language: string | null
  languageColor: string | null
  stars: number
  forks: number
  updatedAt: string
  url: string
}

interface ActivityEvent {
  id: string
  type: string  // "PushEvent" | "PullRequestEvent" | "IssuesEvent" | "WatchEvent" | "ForkEvent" | ...
  title: string
  repoName: string
  repoUrl: string
  createdAt: string  // ISO 8601
}
`

The `color` field on languages uses GitHub's linguist colors (e.g., TypeScript = "#3178c6").

### Component data flow

- **Dashboard** (`src/components/Dashboard.tsx`): owns the fetch lifecycle. State: `{ data, isLoading, error }`. Calls the endpoint on username change. Passes `data`, `isLoading`, and `error` down as props to each tab. The Dashboard triggers a single fetch per username; tabs are purely presentational with no independent data fetching.
- **OverviewTab, ReposTab, ActivityTab, ChartsTab**: gain props for `isLoading`, `error`, and a re-fetch callback. They render three states: loading (skeletons), success (current content), error (message + retry). The existing content rendering becomes the success branch of a three-way conditional.
- **SAMPLE_DATA extraction**: The current hardcoded `SAMPLE_DATA` object is extracted into `src/test/fixtures.ts` alongside the existing `createMockUser()` fixture. The production components use real data passed via props. The 29 existing tests point at the shared fixture.

### Error taxonomy and handling

| Error type | Cause | HTTP indicator | UI behavior |
|---|---|---|---|
| `not_found` | Username doesn't exist | GitHub 404 | "User not found" message with a "Check the username" hint |
| `rate_limited` | PAT exhausted or missing + unauthenticated | GitHub 403 + `x-ratelimit-remaining: 0` header | "Rate limit hit — try again in X minutes" with a countdown timer |
| `network` | GitHub down, DNS failure, timeout (>10s) | Node fetch error or >10s | "Could not reach GitHub — check your connection" with a Retry button |
| `validation` | Invalid username format | Client-side, rejected before fetch | Inline validation message under the search input |

- **Rate limit parsing**: Read `x-ratelimit-remaining` and `x-ratelimit-reset` response headers from the GraphQL and REST calls. If remaining hits 0, return the `rate_limited` error with the reset timestamp for the countdown.
- **Abort controller**: Each fetch attaches an `AbortController`. When the user types a new username, the previous in-flight request is aborted, preventing stale data races.

### Loading skeletons

- **Stat cards**: Pulsing rectangles matching the card dimensions (3 cards in a grid).
- **Language bars**: 5 horizontal pulsing bars of staggered widths.
- **Contribution grid**: 52x7 grid of pulsing cells.
- **Repo list**: 5 pulsing card skeletons matching repo card shape.
- **Activity list**: 6 pulsing event rows.
- **Charts**: One pulsing rectangle per chart card.
- Implementation: a `Skeleton` component leveraging shadcn patterns. Each tab renders its skeleton variant in the loading branch.

### Username validation

- **Format**: `/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/` — matches GitHub's allowed username characters: alphanumeric and single hyphens (no consecutive hyphens, no leading/trailing hyphen). 39 chars max.
- **Client-side**: validated on submit and on blur of the search input. Shows inline feedback: "Username can only contain letters, numbers, and single hyphens."
- **Server-side**: the 404 from GitHub's API distinguishes "no such user" from other errors. Both GraphQL and REST return 404 for nonexistent users.
- **Rate limit**: empty string is rejected client-side. No fetch is made for invalid usernames.

## Testing Decisions

**Seam**: A single new module — the GitHub data service (`fetchGitHubUser(username, token, abortSignal)`) — is the seam. Its return type (`GitHubUserData | Error`) is the contract. Tests mock `global.fetch` (Node 22) to return controlled responses, then assert the returned data or error.

**What makes a good test here**: the service function is called with a username and a mock fetcher. Assertions verify: (a) the GraphQL query body and the REST URL are correct, (b) the response is transformed into the typed `GitHubUserData` shape, (c) errors (404, 403, network) map to the correct error types, (d) the second call within TTL returns cached data with zero fetch calls, and (e) an expired cache triggers a new fetch.

**Modules tested**:
- **GitHub data service** (new): mock `global.fetch`. Parametrize across all response scenarios (success, 404, 403 rate-limit, network error, empty events). Assert transformation logic exhaustively.
- **Component loading/error states** (existing suite + extensions): render each tab with `isLoading=true` → skeleton elements visible. Render with `error={{type:'not_found',message:'...'}}` → error message + "Check the username" hint visible. Render with `error={{type:'rate_limited',retryAfter:'...'}}` → "Rate limit" message + countdown. Render with `error={{type:'network'}}` → "Could not reach GitHub" + Retry button.
- **Dashboard orchestration** (existing suite): unchanged core flow. Extend the search-submit test to assert that a successful fetch updates the tab data. Add tests for: submitting a new username aborts the previous request; error state renders the error UI; retry button triggers a new fetch.
- **API endpoint** (optional, deferred): Astro API routes are server-side functions. For MVP, the endpoint is a thin wrapper around the service. Service-layer tests + component integration tests provide sufficient coverage. The endpoint can be tested later via Playwright E2E or a standalone integration test harness.
- **Existing 29 tests**: must keep passing with zero changes. The sample data fixture in `src/test/fixtures.ts` is the single source of truth for test data.

**Prior art**: The existing test suite (tickets #10–#15) uses the same pattern: render with props, assert user-visible content. The service-layer tests follow the same philosophy applied one layer down — call a function, assert the output.

## Out of Scope

- Redis caching (in-memory TTL only for MVP)
- Real-time search / debounced suggestions as the user types
- Custom date range for the contribution graph (always the last 52 weeks)
- OAuth or authenticated user dashboard (public read-only only)
- Pagination or infinite scroll for repos (top 20 repos, sorted client-side)
- Detailed PR/issue drill-down views (events show title and link only)
- Write operations (creating repos, issues, PRs)
- Multi-user comparison or side-by-side views
- Webhook-driven real-time updates
- PWA / offline support

## Further Notes

- **Environment**: the .env.example already defines `GITHUB_TOKEN=`. The service reads from `import.meta.env.GITHUB_TOKEN` (Astro server-side only). A warning is logged if the token is missing or a 401 is received.
- **GraphQL query design**: request only the fields the UI renders. The query uses `user(login: ) { contributionsCollection { ... } }` for contribution data and `repositories(first: 30, ...) { ... }` for repo/language data — no per-repo language breakdown; languages are aggregated across all public repos.
- **Events deduplication**: the REST Events endpoint returns atomic events. PushEvents are summarized per-branch (one event per push). The activity tab shows each event as-is; no client-side aggregation needed.
- **GraphQL + REST parallelism**: the service fetches GraphQL (profile, repos, languages, contributions) and REST (events) in parallel via `Promise.all` with a shared abort signal. Both must succeed for the dashboard to render — it's all or nothing to avoid an inconsistent UI.
- **Timeout**: 10-second fetch timeout per request enforced via `AbortSignal.timeout(10_000)`. If either fetch exceeds it, the entire request aborts and returns a `network` error.
- **Cache key**: username (lowercased), since GitHub usernames are case-insensitive.
