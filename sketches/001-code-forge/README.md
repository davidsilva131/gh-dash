# Variant: Code forge

## Design stance

GitHub-native dark refined — feels like a tool devs already know, but tightened. Every surface is one step away from `#0d1117`, the contribution ramp is GitHub-real, and the only color that does *work* is indigo (links, buttons, active tab indicator). Mono is reserved for usernames, hash-like details, and numbers. No glassmorphism, no neon, no gradients stronger than a 4-step green ramp.

## Key choices

- **Tokens**: `--bg #0d1117`, `--bg-elev #161b22`, `--border #2a2f35`, `--accent #6366f1` (interactive only), `--green #39d353` + 4-step ramp
- **Typography**: Geist for prose, Geist Mono for usernames and numbers, `font-variant-numeric: tabular-nums` everywhere numeric
- **Surfaces**: 1px borders in low-contrast, cards 8px radius, no shadows, no glassmorphism
- **Iconography**: SVG inline everywhere (Lucide-style paths) — stat cards, repo language dots, activity event chips, fork icon (the real fix: current code reuses a star glyph for forks)
- **Background texture**: faint 1px CSS grid (24px cells, 0.04 opacity) for craft, no scanlines
- **Tab active state**: 2px indigo bottom underline + accent text
- **Card hover**: `border-color: var(--accent)/30` + 200ms transition, no lift
- **Contribution ramp**: 4 levels of GitHub green (`#0e4429` -> `#39d353`) + border/30 empty

## Trade-offs

- **Strong at**: legibility at speed; instant GitHub fluency; density without noise; reads as "serious" in a portfolio context
- **Weak at**: distinctiveness — at a glance it can be mistaken for "yet another GitHub dark theme" if you don't study the details
- **Risk**: feels restrained to the point of being forgettable if the only interaction surface is static screenshots

## Best for

Portfolio audiences that value restraint, density, and developer credibility over visual fireworks. Recruiters and engineers who recognize the GitHub ramp and feel at home. Pairs well with a sidebar of "feature story" content if the dashboard sits inside a larger site.

## Files

- `landing.html` — wordmark with octocat SVG glyph, search input with "Try: davidsilva131" hint
- `overview.html` — profile hero + 4 stat cards + languages bars + 26-week heatmap
- `repos.html` — 6 repo cards in 2-col grid, segmented sort (Most Stars / Recently Updated)
- `activity.html` — 8 event rows with real SVG icons (commit / merge / circle / star / fork / plus)
- `charts.html` — donut + stars bars + full-year heatmap + monthly activity area chart (all hand-rolled SVG)
- `error.html` — "User not found" with amber warning icon, retry button, persistent shell
- `styles.css` — shared tokens + utilities

## Notable fixes this direction makes vs. the current code

1. **`StatCard` icon prop is empty string in `OverviewTab.tsx`** — every stat card renders an empty span. This prototype uses real SVG paths.
2. **`RepoCard` renders the star glyph twice** (lines 80-82 of `RepoCard.tsx`): once for stars, once for forks. This prototype uses distinct star and fork glyphs with separate SVG paths.
3. **`ActivityEvent` uses letter icons** ("P", "R", "I", "S", "C", "F") in a 36px chip — looks like a developer console, not a product. This prototype uses Lucide-style paths (git-commit, git-merge, alert-circle, star, git-fork, plus).
