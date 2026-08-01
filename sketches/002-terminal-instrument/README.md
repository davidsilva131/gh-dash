# Direction B — "Terminal instrument"

> Developer-tool cockpit — terminal aesthetics with cyan/amber accents, mono everywhere, scanlines, neon hover only.

This is a throwaway visual prototype. No real code, no framework, no build step. Just 6 static HTML files sharing one `styles.css` to compare against Directions A and C **before** touching the real Astro/React project.

## Files

| File | What it shows |
| --- | --- |
| `landing.html` | Empty state — handle input with `$` prefix, blinking cursor, terminal-window sub-glyph, `EXECUTE →` button |
| `overview.html` | Tab Overview — profile hero with scanline border, 4 stat cards (followers has a blink dot), languages bars (desaturated toward cyan), 26-week contribution heatmap |
| `repos.html` | Tab Repos — toolbar with `> 47 repos` + segmented control, 2-col grid of 6 repo cards with mono meta footer |
| `activity.html` | Tab Activity — feed of 8 events, each with a 32×32 icon chip, badge, relative time, hover cyan border-left |
| `charts.html` | Tab Charts — 2×2 grid: languages donut, stars-per-repo bar chart, 53w contribution heatmap (scrollable), 12-month activity line chart |
| `error.html` | Error state — `!` bang in magenta, `USER_NOT_FOUND` in amber, `// check the username…`, `[ RETRY ]` button |
| `styles.css` | Shared design tokens + base styles (header, cards, footer, animations) |

## Design tokens

```css
--bg:           #050810   /* near-black, blue-tinted */
--bg-elev:      #0a1018   /* card surface */
--bg-elev-2:    #0f1620   /* hover */
--border:       #1a2230   /* low-contrast */
--border-bright:#2a3a52   /* active */
--fg:           #d4dae3   /* primary text */
--fg-muted:     #7a8699
--fg-subtle:    #4a5568
--cyan:         #00d9ff   /* primary accent */
--amber:        #ffb454   /* secondary / warning */
--magenta:      #ff5f87   /* error, used sparingly */
--green:        #44d39a
--green-1..4:   #1a3a2e → #6ee7b7  /* contribution ramp */
--radius:       4px       /* sharp, technical */
--font-sans:    Geist
--font-mono:    Geist Mono / JetBrains Mono fallback
```

## Key choices

- **Black + cyan as the only "color"**: amber and magenta reserved for status (warning, error). Green only for the contribution ramp.
- **Mono everywhere it matters**: every number, every username, every label, every repo name, every "1,247 contributions" string. Sans-serif only for the bio paragraph and a few body descriptions.
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) so columns of numbers don't jiggle when the value changes.
- **`>` and `$` prompt prefixes** on inputs, labels, and feed lines — they read as terminal output without being a costume.
- **Scanline + grid texture** as a body::before overlay (4px scanlines @ 1.5% opacity, 40px grid @ 4% opacity) so the whole page feels like a CRT without being noisy.
- **Cyan glow ONLY on hover/focus**: 1px cyan border + `0 0 16px -4px var(--cyan)` box-shadow with 200ms transition. No resting glow anywhere.
- **Blink dots on critical stats** (followers, online indicators) — 1.6s pulse animation, color-coded.
- **Tab active indicator**: cyan underline 1px with subtle outer glow, plus the `>` prefix turns cyan. Inactive tabs are muted with a dim `>` prefix.
- **1px sharp borders** — no rounded-2xl, no glassmorphism, no shadows on resting elements. Everything is honest geometry.
- **Heatmap uses a 4-level ramp** (green-1 → green-4) with `lvl-0` being a slightly visible empty state on `var(--bg-elev-2)` so you can see the structure even on a slow week.
- **Language brand colors are desaturated 20% toward cyan** so they read as "from the same family" instead of looking like GitHub's octicons.
- **All data is plausible** for `davidsilva131` — real-looking bio, plausible company, plausible counts, plausible activity timeline. No Lorem ipsum.

## Trade-offs

**Strong at…**
- Distinct, technical identity that signals "developer tool" louder than a SaaS landing page ever could.
- Mono type makes data scannable. Numbers align, IDs feel hash-like, usernames feel handle-like.
- Black + cyan works in any ambient light. Won't wash out on bright monitors or hide in dark rooms.
- Scanlines + grid texture is decorative without being noisy — it's a backdrop, not a centerpiece.
- The `>` prefix is the cheapest possible visual identity. It costs 1 char and ties every UI element together.

**Weak at…**
- "Friendly" / "approachable" first impression. This is a cockpit, not a hug. Recruiters used to SaaS gradients will bounce.
- Color-blind users lose the only color signal (cyan vs amber vs magenta). Status is still encoded in icon shape and label, but it's not redundant.
- Mono type for body text (bio, descriptions) is off-brand — we use sans there, but if you ever want the whole page mono, readability tanks below ~14px.
- The aesthetic ages fast if neon-glow trends come back. Mitigated because the glow is hover-only and 16px, not a permanent ring.
- Doesn't photograph well for thumbnails (lots of dark = compressed noise). The portfolio screenshot needs to be full-bleed and well-lit.

## Best for

Portfolio audience that values **technical / distinct identity** over **convention**. The kind of recruiter or peer who says "ooh, terminal" before they read a single word of copy. Use this direction if you want the project to *look* like a developer tool before it says a word about being one.

## Verdict

Strong, opinionated, and uncompromising. The visual identity does 80% of the marketing in the first 200ms.
