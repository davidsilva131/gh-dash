## Destination

**gh-dash**: a GitHub Personal Dashboard — an interactive SPA where a user types a GitHub username and sees their profile, repositories, contribution graph, language breakdown, activity timeline, and stats at a glance. Built with **Astro + React islands + Tailwind v4 + shadcn/ui + Recharts + Railway**. The destination is a fully-specified plan — all decisions made, no open questions — ready to hand off and build.

## Notes

- **Stack**: Astro 7 SSR, React 19 islands, TypeScript, Tailwind v4, shadcn/ui, Recharts
- **Data**: Hybrid GraphQL + REST (GitHub API), server-side PAT for rate limits
- **Caching**: Railway Redis (or in-memory TTL for MVP)
- **Deployment**: Railway (Node.js container)
- **Repo**: davidsilva131/gh-dash (public, portfolio project)
- **Chat**: Spanish; GitHub artifacts in English

## Decisions so far

- [#2 Cloudflare decision](https://github.com/davidsilva131/gh-dash/issues/2) — Chose Railway over Cloudflare Workers/Pages
- [#3 GitHub API strategy](https://github.com/davidsilva131/gh-dash/issues/3) — Hybrid GraphQL+REST, server-side PAT
- [#4 Chart library](https://github.com/davidsilva131/gh-dash/issues/4) — Recharts with shadcn/ui chart wrapper
- [#6 Stack scaffold](https://github.com/davidsilva131/gh-dash/issues/6) — Validated Astro+React+Tailwind+shadcn/ui+Node adapter
- [#5 Dashboard layout](https://github.com/davidsilva131/gh-dash/issues/5) — 4-tab Vercel Analytics style. Commit 44362ca. Build verified.

## Frontier (open, unblocked, unclaimed)

- #8 Task: Railway account and project setup — deploy the scaffold

## Not yet specified

- GitHub API data integration (GraphQL query + REST events endpoint)
- Error/loading/skeleton states for each section
- Accessibility and keyboard navigation
- Testing setup (Vitest? Playwright?)
- CI/CD pipeline
- Custom domain
- Real-time search / username validation

## Out of scope

- Multi-user auth/sessions
- Write operations (creating repos, issues, PRs) — read-only dashboard
- Real-time webhooks
