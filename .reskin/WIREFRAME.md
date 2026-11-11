# Wireframe — Ticker Stage on Poster Optimism

Committed direction: **Poster Optimism** (`optimism-poster`, performance-brutalist) on the
**Ticker Stage** (`ticker-stage`, linear) skeleton. The original shell was `orbital` (spatial:
centered WebGL gate, pill app bar, rounded glass cards on near-black).

## Principles

- Paper, not void: `#FAFAF9` ground, `#161616` ink, `#FF0421` signal stamp, `#FF7A00` second.
- Zero radius, 2px ink rules, hard offset shadows. Everything reads like a printed ledger sheet
  pinned to a wall, not glass in space.
- Display voice: Arial Black, uppercase, tracking −0.04em, oversized. Micro-labels and figures:
  Courier New, uppercase, tracked +0.12em.
- Motion is a step: 110 ms `steps(2, end)`, guarded by `prefers-reduced-motion`.
- Every page is a stack of full-width **bands** (statement → beats → ledger → closing), separated
  by ink rules. No card grids: data becomes ruled rows, metrics become beats.

## New shell

| Region | Component | Notes |
|---|---|---|
| Skip link | `App.vue` | first focusable element |
| Masthead + navigation | `components/StageHeader.vue` | brand block on the left, **ticker strip** of route labels below the wordmark; mobile hides the strip and opens a full-bleed menu sheet |
| Page canvas | `App.vue` → `<RouterView>` | each route renders `<main id="main" class="page">` |
| Colophon | `components/StageFooter.vue` | four mono columns + status line, ink top rule |
| Overlays | `ToastHost`, `WalletSheet`, `NasyaiBuddy` | kept, restyled |

Landmarks: `header` → `nav` → `main` → `footer`; no `aside` anywhere (the old crew sidebar becomes
a horizontal beat/rail inside the page body).

## Route mapping

| Route | Composition |
|---|---|
| `/` | statement band (kicker, h1, lede, actions, meta strip) → tape strip → three-beat record → crew rail → numbers beat → flow ledger → loans ledger → three ways → $NASYAI band → FAQ ledger → closing band |
| `/board` | statement → lookup strip → record beat → tiers ledger → example rows |
| `/crew` | statement → crew rail (pane) → faces ledger → allowance note |
| `/agents` | statement → live stats beats → event ledger |
| `/seats` | statement → five seat rows (numbered beats) → note |
| `/participate` | statement → tabbed bands (lend / back) → forms as inline strips |
| `/stocks` | statement → live price beat → token ledger (16 rows) → coin cloud |
| `/launches` | statement → launch ledger → how-to beats → rules |
| `/protocol` | statement → sticky mono index → section ledger (model, lifecycle, default, score, invariants, parameters, token, interface, addresses, security) |
| `/nasyai` | statement → holder bands → faucet/allowance → link flow |
| `/desk` | statement → wallet gate strip → desk beats (open line, borrow, repay, stock line, seat) |
| `/use` | statement → step beats → code strip |
| `/log` | statement → entry ledger |
| `/contact`, `/privacy`, `/brand` | statement → contact/matrix/brand ledger |
| `/start` | statement → four step beats → skill strip |
| 404 | statement + return link |

## Files

- New: `src/styles/stage.css` (tokens, reset, type, controls, components), `src/styles/stage-pages.css`
  (page bands, tables, responsive), `src/components/StageHeader.vue`, `src/components/StageFooter.vue`.
- Removed from the render path and deleted: `src/styles/site.css`, `src/styles/app.css`,
  `src/components/AppHeader.vue`, `src/components/AppFooter.vue`, `src/components/HeroGate.vue`,
  `src/components/ShellCanvas.vue`.
- Kept as content-only children, re-marked up: `NumbersSection`, `LoansSection`, `CrewPane`,
  `CrewCards`, `CrewPageCards`, `CrewGuide`, `CrewNote`, `AgentRecordCard`, `StockTape`, `StockCoin`,
  `NasyaiBuddy`, `WalletSheet`, `ToastHost`.

## Breakpoints

`390px` single column, ticker → menu sheet; `768px` two-column beats; `1200px+` full four-column
beats and 3-column colophon. No horizontal document overflow at any width: tickers scroll inside
their own box.
