# gh-dash — visual redesign exploration

Three throwaway HTML prototypes to compare visual directions before porting the chosen one into the Astro + React + Tailwind v4 + shadcn/ui codebase. Each variant is a complete, self-contained set of 6 views (landing, overview, repos, activity, charts, error) using fake data for `@davidsilva131`.

## How to view

The fastest way to compare all three side-by-side is the comparison page:

```
open sketches/index.html
```

On Windows (this machine):

```
start sketches/index.html
```

Each prototype folder is also fully self-contained — open any HTML directly to walk the full flow.

## The three directions

| # | Name | Stance | Primary tokens | Feel |
|---|---|---|---|---|
| A | Code forge | GitHub-native refined | bg #0d1117, ramp #39d353, accent #6366f1 | Restrained, dense, instantly credible to devs |
| B | Terminal instrument | Developer-tool cockpit | bg #050810, cyan #00d9ff, amber #ffb454, mono everywhere | Distinct, technical, polarizing |
| C | Analytics premium | Linear/Vercel product | bg #09090b, indigo to violet brand gradient, glassy header | Polished, polished, polished |

## Head-to-head

| Dimension | A · Code forge | B · Terminal instrument | C · Analytics premium |
|---|---|---|---|
| Density | High (GitHub-style) | Very high (mono, scanlines) | Medium (generous whitespace) |
| Distinctiveness | Medium - could be another GitHub dark | Very high - instantly recognizable | High - but in a well-trodden product lane |
| Readability at speed | High | Medium (mono fatigue) | High |
| Tabular data scannability | High | High | High |
| Craft signals (hover, motion) | Subtle (border tint, 200ms) | Pronounced (cyan glow, scanline texture) | Soft (lift + glow, backdrop blur) |
| Brand identity hook | Contribution ramp + octocat glyph | Mono + prompt prefix + neon | Gradient wordmark + glassy header |
| Mobile | Solid (grid collapses) | Risky (mono stacks poorly) | Solid (cards adapt well) |
| Map to current stack | 1:1 (Tailwind tokens, shadcn cards) | 1:1 with care (mono + glow need custom CSS) | 1:1 (gradient + glass map to Tailwind v4) |
| Risk of looking dated in 1y | Low | Medium (terminal-aesthetic wave passes) | Low |
| Risk of looking generic | Higher (restrained) | Very low | Medium (Linear/Vercel is the new default SaaS) |
| Portfolio narrative | I know GitHub and I respect it | I have a point of view | I can ship product-grade UI |

## My take

If this dashboard is the whole portfolio piece and the goal is to be remembered, pick B (Terminal instrument). The mono + cyan + scanline combination is the only one of the three that immediately signals this person has taste rather than this person followed the dark dashboard tutorial. The cost is that the design is polarizing - some visitors will love it, some will find it busy. Worth the bet for a portfolio.

If this dashboard sits inside a larger site (personal page, blog, etc.) and the dashboard is one feature among many, pick C (Analytics premium). It plays well as a product surface embedded in a content site. The glassy header and brand gradient scale up: a future About page or Writings index can share the same vocabulary. Lowest cognitive load on a first-time visitor.

If the goal is to be hired by a developer-tools company and demonstrate that you understand the medium, pick A (Code forge). It is the most senior engineer of the three - restrained, information-dense, no wasted pixels. Less memorable in a portfolio scroll, but in a code review or design interview it reads as this person knows what matters.

## The three bugs in the current code that every direction fixes

Every prototype in this folder addresses the same three issues found in the current implementation:

1. Empty icons in OverviewTab.tsx - every StatCard icon="" renders an empty span. All three prototypes use real Lucide-style SVG paths.
2. Star glyph reused for forks in RepoCard.tsx (lines 80-82): the current code shows star 12  star 3 for stars and forks. All three prototypes use distinct star and fork glyphs.
3. Letter icons in ActivityEvent.tsx - P for Push, R for PR, I for Issue, S for Star, C for Create, F for Fork - all rendered as 36px text in a circle. All three prototypes use real icon paths.

When porting the chosen direction back to React, these three fixes ship regardless of which direction wins.

## Next step

Pick a direction. Once chosen, the work is:

1. Update src/styles/global.css with the chosen direction tokens (oklch + @theme mapping for Tailwind v4)
2. Port the chosen HTML to React + shadcn primitives (Card, Badge, Button, Input, Tabs, Avatar, Skeleton, Tooltip)
3. Wire the charts in ChartsTab.tsx to Recharts with the new tooltip + axis style
4. Replace the StatCard icon prop usages with real SVG paths
5. Replace the letter-icon lookup in ActivityEvent.tsx with the icon component map
6. Fix the star/fork glyph in RepoCard.tsx
7. Run pnpm test to confirm the existing test suite still passes (aria-labels, data-testids, and DOM semantics are preserved)

Estimated effort: half a day of focused work, mostly mechanical porting.
