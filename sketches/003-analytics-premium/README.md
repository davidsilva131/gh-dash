# 003 — Analytics premium

Static HTML prototype of the **Analytics premium** direction for gh-dash.
Throwaway design exploration — does not touch real project code.

## Stance

**Linear / Vercel-style premium product — glassy header, brand gradient, soft elevation, generous whitespace.**

This direction treats gh-dash as a *product*, not a *tool*. Every surface feels considered:
a glassy sticky header with `backdrop-filter: blur(12px)`, cards that lift on hover with a
soft brand-tinted glow, and an indigo→violet brand gradient that shows up in exactly the
right places (wordmark, active-tab indicator, primary buttons, chart accents). The result
reads as "premium SaaS" rather than "developer dashboard."

## Visual system

### Tokens

```
--bg:        #09090b   near-black, slightly warm
--bg-elev:   #111114   cards
--bg-elev-2: #18181c   hover, secondary surfaces
--border:    #1f1f25   very low contrast (layered effect)
--fg:        #fafafa   primary text
--fg-muted:  #a1a1aa   secondary text
--fg-subtle: #71717a   tertiary text / labels
--brand-1:   #818cf8   indigo-400
--brand-2:   #a78bfa   violet-400
--radius:    16px      cards (rounded-2xl)
--shadow-soft: 0 1px 2px rgba(0,0,0,.3), 0 0 0 1px var(--border)
--shadow-glow: 0 8px 32px -8px rgba(129,140,248,.25)
```

Font: Geist (UI) + Geist Mono (numbers, code), tabular numerals on every stat.

### Brand gradient strategy

The signature `linear-gradient(135deg, #818cf8, #a78bfa)` is **used sparingly**:

- wordmark (background-clip: text)
- active tab underline (2px gradient bar)
- primary buttons (filled with the gradient)
- language bars (premium "single-hue" instead of per-language colors)
- donut chart slices (purple ramp, indigo accents)
- bar chart fill
- line chart area + stroke
- hover glow on cards
- left-border accent on hovered activity rows
- landing-page animated radial background

This restraint is what makes the gradient feel **premium** instead of **flashy**. The
default text color is white (`#fafafa`); brand color appears only at moments that deserve
emphasis.

### Glassmorphism header

`backdrop-filter: blur(12px) saturate(180%)` + `background: rgba(9,9,11,0.7)` + 1px border-bottom.
Search input uses a tinted dark surface (`rgba(24,24,28,0.7)`) inside the header so it
sits flush without competing with the wordmark. On focus, the search gets a 3px brand
ring — a very small "the system is paying attention" cue.

### Card elevation

All elevated surfaces use `--shadow-soft`, which combines a 1px hairline border with a
1px shadow so cards always have a defined edge even on dark backgrounds. On hover, cards
translate `-2px` and pick up `--shadow-glow` (brand-tinted). This is the single most
"premium" interaction in the prototype.

### Whitespace

Cards have `p-24` (24–32px). The grid gap is 16–24px. Section spacing is 48–96px. The
landing hero is 720px wide on a 1200px canvas, with a soft brand glow radial-gradient
behind the input. Breathing room is the point.

### Contribution ramp

The contribution heatmap keeps GitHub's green ramp (`#0e4429 → #39d353`) — recognizable
even in a premium context. Mixed with `--shadow-soft` cards and 2px gap cells, the
heatmap reads as "GitHub, but more refined."

## Key choices

- **Glassy sticky header** with inline search, brand wordmark, and gradient tab indicator
- **rounded-2xl (16px)** on every card; **rounded-xl (12px)** on inputs/buttons; **rounded-full** on chips
- **Soft elevation** via `0 0 0 1px var(--border)` combined with a 1px shadow, not boxy 4px shadows
- **Generous whitespace** — hero max-width 720px, card padding 24–32px, section gap 32–48px
- **Brand gradient restraint** — used in ~10 places total, never on body text
- **Tabular numerals + Geist Mono** for all metrics, so columns align and numbers feel precise
- **Animated radial background** on the landing page (3 color stops drifting over 28s, blur 40px, low opacity) — subtle "alive" feeling without distraction
- **Soft glow halos** behind hero inputs and chart cards — radial-gradient with brand color at 0.10–0.15 opacity, no blur shadow on the card itself
- **Type-aware activity icons** in 40×40 brand-tinted rounded squares
- **Real GitHub data**: `@davidsilva131` (exists on GitHub), 6 plausible repos from the same persona, 1,247 contributions, 412 stars, 34 public repos, 128 followers

## Trade-offs

**Strong at**
- "Premium product" feel — looks like Linear, Vercel, Stripe Dashboard, Cal.com
- Portfolio audience: a viewer immediately senses craft and attention to detail
- Soft elevation + brand restraint reads modern without being trend-chasing
- Whitespace makes the dashboard feel calm and expensive
- Glassmorphism header is a clear "this is a real product" signal

**Weak at**
- **Density** — only 2-column grids, generous padding, big type. A power user with 100 repos
  would have to scroll a lot. Less scannable than a denser direction.
- **Information per pixel** — fewer facts fit on screen at once. The bar chart, donut, and
  line chart each get their own card rather than sharing space.
- **Print / screenshot** — heavy gradients and soft glows read as "designed" not "durable"
- **Theming** — the brand gradient is hard-coded. A "GitHub-blue" or "synthwave" alt would
  require rework. Other directions might be themable.
- **Performance-first perception** — backdrop-filter + radial-gradient + multiple box-shadows
  add up. A high-density monitor with 4K zoom isn't the target.
- **GitHub's brand color (blue)** is absent. Users coming from github.com might find the
  indigo-violet palette surprising. Could be framed as a feature or a friction.

## Best for

A portfolio audience that values **polish and product-feel over density** — recruiters
and design-minded reviewers who'll spend 30 seconds looking at this and want to feel
"this person ships premium work." Less ideal for engineering-heavy reviewers who care
about information density and feature breadth.

## Files

| File | Size | Description |
|------|------|-------------|
| `landing.html` | ~11 KB | No-username state: animated gradient hero, brand-gradient wordmark, glassy input + button, feature row |
| `overview.html` | ~18 KB | Profile hero card, 4 stat cards, languages + 26w heatmap |
| `repos.html` | ~16 KB | Toolbar with segmented sort + filter chips, 2-col repo grid with 6 cards |
| `activity.html` | ~13 KB | Filter pills, 8 type-aware activity rows, load-more button |
| `charts.html` | ~21 KB | 2×2 grid: SVG donut, bar chart, 53w heatmap, area-line chart |
| `error.html` | ~8 KB | Centered "user not found" card, brand-gradient icon, Try again CTA |
| `README.md` | this file | Stance, tokens, trade-offs |

## How to view

Open `landing.html` in a browser. All pages cross-link, so the tabs and CTAs are
navigable. No build step, no server — pure static HTML + CSS + a few lines of vanilla
JS for the segmented controls, filter chips, and heatmap generation.
