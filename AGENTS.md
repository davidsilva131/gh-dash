# gh-dash

GitHub Personal Dashboard - Astro + React + Tailwind v4 + shadcn/ui + Railway.

## Stack

- **Framework**: Astro 7 (SSR, @astrojs/node standalone)
- **UI**: React 19 islands + Tailwind v4 + shadcn/ui
- **Data**: GitHub API (GraphQL + REST) with server-side PAT
- **Deploy**: Railway (Node.js container)
- **Package manager**: pnpm

## Quick Commands

```sh
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm start            # Start production server (node ./dist/server/entry.mjs)
```

## Project Structure



## Wayfinder Map

https://github.com/davidsilva131/gh-dash/issues/1

## Notes

- Chat in Spanish, GitHub artifacts in English
- shadcn/ui components in src/components/ui/
- Environment variables in .env (see .env.example)
## Agent skills

### Issue tracker

Issues live on GitHub Issues. See docs/agents/issue-tracker.md.

### Triage labels

Five canonical labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See docs/agents/triage-labels.md.

### Domain docs

Single-context layout. See docs/agents/domain.md.
