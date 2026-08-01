# gh-dash — Total Visual Redesign Brief

**Project:** gh-dash — GitHub Personal Dashboard (portfolio piece)
**Repo:** github.com/davidsilva131/gh-dash · **Stack:** Astro 7 (SSR) + React 19 islands + Tailwind v4 + shadcn/ui + Recharts
**Deploy:** Railway (public URL, dark-only UI)
**Design engine:** Open Design (Hermes / OpenCode runtime)

---

## 1. What the product is

A public single-page web app that shows any GitHub user's developer profile at a glance. You type a GitHub username → the app fetches real data from the GitHub API (GraphQL + REST, server-side) and renders a dashboard with:

- **Landing state** — hero + username search box
- **Overview tab** — profile header card, 4 stat cards, language bars, 6-month contribution heatmap
- **Repos tab** — sortable grid of repo cards (Most Stars / Recently Updated)
- **Activity tab** — chronological feed of GitHub events (push, PR, issue, star, fork, create)
- **Charts tab** — languages donut, stars-per-repo bars, full-year contribution calendar, monthly activity line chart

## 2. Why a redesign

The current UI is functional but visually generic: neutral zinc dark theme + indigo accents, default shadcn cards, letter-based event icons, no identity. This is a **portfolio piece** — it should look *designed*, distinctive, and polished, while staying fast and data-dense.

## 3. Design principles

1. **Developer-native aesthetic** — it should feel like a tool a developer *wants* to use daily: precise, information-dense but breathable.
2. **Distinct identity** — a signature visual hook (color story, texture, typography detail) that makes it memorable as a portfolio piece. Not another generic dark dashboard.
3. **GitHub fluency** — instantly readable GitHub concepts: stars, forks, contributions, languages, relative time ("2h ago"). Users should parse the data at a glance.
4. **Data-density with hierarchy** — dense information, clear hierarchy: big numbers, small labels, scannable lists.
5. **Craft details** — micro-interactions (hover lifts, animated bars, skeleton shimmer), consistent radii/spacing, tabular numerals for numbers.
6. **Dark-first, contrast-safe** — dark mode only (class="dark" fixed). Use proper contrast; avoid pure black (#0a0a0b ok as bg, but surfaces must separate).
7. **Accessible** — WCAG AA contrast, focus-visible rings, aria labels preserved (tests assert user-visible behavior).

## 4. Visual directions (pick ONE, or hybrid)

Give 2–3 distinct directions as early prototype options:

- **A · "Code forge"** — GitHub-native dark refined: warm neutral surfaces (#0d1117-family), green contribution ramp, monospace accents for usernames/hash-like details, subtle grid texture, indigo→violet only for interactive states.
- **B · "Terminal instrument"** — developer-tool cockpit: deep black-blue surfaces, cyan/amber terminal accents, mono type for data, thin 1px borders, scanline/grid background texture, neon-glow on hover only.
- **C · "Analytics premium"** — Linear/Vercel-style product dashboard: near-black surfaces with layered elevation, glassy sticky header, indigo-violet gradient brand accent, soft glows behind charts, rounded-2xl cards, generous whitespace.

## 5. Page-by-page component spec

### 5.1 Landing (no username yet)
- Bold wordmark **gh-dash** with a signature mark (octocat-inspired glyph or custom logo shape — must be buildable in pure CSS/SVG)
- One-line tagline: "GitHub Personal Dashboard"
- Large, focused search input + submit button (Enter submits; inline validation message for bad usernames)
- Subtle background: brand gradient glow / grid texture / orbiting dots — tasteful, not noisy
- Maybe a hint row: "Try: davidsilva131"

### 5.2 App shell (dashboard state)
- Sticky glassy header: wordmark (compact) · search input inline · 4 tabs (Overview / Repos / Activity / Charts) with animated active indicator
- Content max-width ~1200px, consistent gutters
- Footer: stack line + "Built with Astro · React · Tailwind · shadcn/ui"

### 5.3 Overview tab
- **Profile hero card**: large avatar (ring treatment), name + @handle badge, bio, company/location chips, Follow button-style affordance (non-functional is fine)
- **4 stat cards**: Repositories · Total Stars · Followers · Following — each with an inline SVG icon, big number in tabular numerals, subtle hover
- **Languages card**: stacked progress bars with language brand colors (per-repo lang colors come from GitHub API), % labels, animated width on load
- **Contributions card**: 26-week GitHub-style heatmap (7×26 grid, 3px cells, brand green ramp: #161b22 → 4 green levels), total count line "1,234 contributions in the last 6 months", Less/More legend

### 5.4 Repos tab
- Toolbar: "{n} repositories" + segmented control (Most Stars / Recently Updated)
- **Repo card grid** (2 cols desktop): name (link-styled, hover→brand), description (2-line clamp), footer row: language dot + name · ★ stars · fork icon + forks · relative time right-aligned. Fork icon must be a fork icon (currently it reuses a star glyph — fix this!)
- Loading: 4–6 shimmer skeleton cards

### 5.5 Activity tab
- "Recent activity from @user" caption
- **Event rows**: left icon chip per event type (Push/PushEvent → commit glyph, PR → git-merge glyph, Issue → circle-dot, Star → star, Fork → fork, Create → plus) — real SVG icons, not letters; right side: type badge + relative time
- Row hover: subtle bg tint + left border accent

### 5.6 Charts tab
- 2×2 grid (lg): **Languages donut** (brand colors, center total), **Stars per repo** bars (rounded tops, brand gradient fill, hover tooltip), **Full-year contribution calendar** (53×7, GitHub ramp), **Monthly activity** line/area chart (brand gradient fill, smooth curve)
- Charts must respect a shared tooltip style (dark surface, border, rounded, small shadow) and axis style (muted ticks, no heavy gridlines)

### 5.7 Error & empty states
- Friendly error card: icon, message, retry button (rate-limit case shows "try again in X minutes")
- Keep all current aria labels / roles / testids intact (component tests depend on them)

## 6. Design tokens (must map to Tailwind v4 `@theme` + oklch CSS vars)

| Token | Current | Direction |
|---|---|---|
| Background | #0a0a0b | deep surface per direction (e.g. #0d1117 / #0a0f1a) |
| Card | #18181b | 1 step lighter than bg, subtle border |
| Border | #27272a | 1px, low-contrast (#2a2f35-ish) |
| Primary | #6366f1 indigo | brand accent per direction (indigo-violet / cyan / green) |
| Accent | #22c55e green | keep for positive states + contribution ramp |
| Muted | #a1a1aa | text-secondary |
| Radius | 0.625rem | 0.5–0.75rem range; charts/cards can be larger |
| Font | Geist Variable (already loaded) | keep; optionally mono variant (Geist Mono) for numbers/usernames |

- Provide the full token table as **oklch() values** (project uses oklch CSS variables + `@theme` mapping) so it drops straight into `src/styles/global.css`
- Contribution ramp (5 levels) as explicit hex/oklch values for both the 6-month and full-year heatmaps

## 7. Deliverables

1. **2–3 prototype directions** (single-page HTML artifacts, responsive, dark-only) — enough to pick one
2. For the chosen direction: a **DESIGN.md** design system (tokens, typography scale, component recipes, spacing, motion)
3. Production-ready HTML/CSS that maps 1:1 onto the component list above (I port it into React + Tailwind + shadcn + Recharts afterwards)

## 8. Constraints & context the designer needs

- **No new runtime deps**: pure Tailwind v4 utilities + existing shadcn/ui primitives (Card, Badge, Button, Input, Tabs, Avatar, Skeleton, Tooltip). Avoid custom fonts beyond Geist/Geist Mono (already bundled via fontsource). Icons: inline SVG (lucide-style paths) are fine.
- **Recharts** renders the charts — design chart shells/tooltips that Recharts can produce (donut, bar, line/area; no exotic chart types).
- **Fixed dark mode** — `.dark` class is always on `<html>`; design dark-first.
- **Keep DOM semantics**: all interactive elements must remain buttons/links/inputs with current aria-labels (tests + accessibility).
- **Relative time** format already exists ("2h ago", GitHub-style).
- Data is real and fetched server-side; design must handle long names, many repos, empty languages gracefully.
- Mobile: single column, tabs scrollable, heatmap horizontally scrollable.

## 9. Non-goals (this round)

- No multi-user accounts, no auth UI, no theme switcher, no new pages beyond the dashboard
- No changes to the data API contracts (`/api/github/:username.json`)
