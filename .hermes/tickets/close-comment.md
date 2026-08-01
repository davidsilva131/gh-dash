Implemented in `0ae0f0a`.

**What was built:**
- `src/lib/types.ts`: type definitions (`GitHubUserData`, `Repo`, `ActivityEvent`, `Language`, `ErrorState`, `ErrorType`) matching spec #16
- `src/test/fixtures.ts`: extracted all `SAMPLE_*` data from the four tab components into shared exports: `SAMPLE_USER_DATA`, `SAMPLE_REPOS`, `SAMPLE_EVENTS`, `SAMPLE_LANGUAGES`, `SAMPLE_STARS`, `SAMPLE_ACTIVITY`, `SAMPLE_CONTRIBUTION_WEEKS`, `SAMPLE_CHARTS_LANGUAGES`
- Updated OverviewTab, ReposTab, ActivityTab, and ChartsTab to import from fixtures instead of defining data inline

**Verification:**
- 29/29 tests passing (`pnpm test`)
- Production build succeeds (`pnpm build`)
- Zero behavioral change — the dashboard renders identically

**Code review note:** Types in `types.ts` follow the spec #16 shapes (nested profile/stats, `id`/`repoName`/`createdAt` on events, `url`/`languageColor` on repos). The fixtures and components still use a flat, current-compatible shape. These will align in T2 (#18).