## Destination

**gh-dash**: a GitHub Personal Dashboard — an interactive SPA where a user types a GitHub username and sees their profile, repositories, contribution graph, language breakdown, activity timeline, and stats at a glance. Built with **Astro + React islands + Tailwind v4 + shadcn/ui + Cloudflare Pages + KV caching**. The destination is a fully-specified plan — all decisions made, no open questions — ready to hand off and build.

## Notes

- **Stack**: Astro (SSR with Cloudflare adapter), React (islands), TypeScript, Tailwind v4, shadcn/ui, chart library TBD
- **Data**: GitHub REST + GraphQL APIs, server-side token for rate limits
- **Caching**: Cloudflare KV
- **Deployment**: Cloudflare Pages
- **Repo**: davidsilva131/gh-dash (public, portfolio project)
- **Chat**: Spanish; GitHub artifacts in English
- **Skills**: domain-modeling, grilling, research, prototype

## Decisions so far

*None yet.*

## Not yet specified

- Auth model: server-side PAT vs per-user OAuth
- Error/loading states for sections
- Accessibility strategy
- Testing tools
- CI/CD pipeline
- Custom domain
- Color scheme beyond dark mode

## Out of scope

- Multi-user auth/sessions
- Write operations — read-only dashboard
- Real-time webhooks
