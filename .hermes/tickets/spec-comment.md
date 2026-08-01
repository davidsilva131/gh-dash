## Implementation tickets

This spec is broken into 6 tracer-bullet tickets (dependency order):

| # | Title | Blocked by | Layer |
|---|---|---|---|
| [#17](https://github.com/davidsilva131/gh-dash/issues/17) | T1: Shared types + test fixtures | None | Prefactoring |
| [#18](https://github.com/davidsilva131/gh-dash/issues/18) | T2: Tab components — accept data/loading/error props | #17 | UI |
| [#19](https://github.com/davidsilva131/gh-dash/issues/19) | T3: GitHub data service + cache | #17 | Service |
| [#20](https://github.com/davidsilva131/gh-dash/issues/20) | T4: Loading skeletons + error UI | #18 | UI |
| [#21](https://github.com/davidsilva131/gh-dash/issues/21) | T5: Astro API endpoint | #19 | HTTP |
| [#22](https://github.com/davidsilva131/gh-dash/issues/22) | T6: Dashboard orchestration + final wiring | #20, #21 | Integration |

**Dependency graph:** T1 → T2 → T4 → T6 (T3 → T5 runs in parallel with T2→T4)

**How to read:** T1 is the prefactoring (types + fixtures). T2 (tab props) and T3 (service) can run in parallel after T1. T4 (skeletons) gates on T2; T5 (endpoint) gates on T3. T6 (final wiring) requires both T4 and T5. Each ticket is a complete vertical slice through its scope, demoable on its own.
