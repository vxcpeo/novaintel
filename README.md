# Nasyai — Vue 3 recreation

<p align="center"><em>The credit layer for super intelligence.</em></p>

A pixel-faithful recreation of [nasyai.top](https://nasyai.top/) as a Vue 3 single-page
application. The design system, copy, imagery and motion are the original site's; the markup is
rebuilt as Vue components, SFC pages and composables instead of static HTML plus global scripts.

## Stack

- **Vue 3** (`<script setup>` SFCs, Composition API)
- **Vue Router 4** (history mode, one route per page)
- **Vite 7**
- No UI framework, no CSS framework: the original design-system stylesheet
  (`src/styles/site.css`) is kept intact and shared by every component.
- The hero is a hand-written **WebGL fragment shader**; the section backdrop and crew faces are
  **Canvas 2D / inline SVG**, all ported from the original.

## Run it

Requires Node.js 20.19+ (or 22.12+).

```bash
cd website
pnpm install        # or: npm install
pnpm dev            # http://localhost:5173
```

Production build:

```bash
pnpm build
pnpm preview        # http://localhost:4173
```

The build is a standard static SPA; serve `dist/` with any history-mode fallback
(e.g. Vercel/Netlify rewrite all paths to `index.html`).

## Deploy (Vercel)

Routes are history-mode, so the host must answer every unknown path with `index.html`.
The repo ships that rule as `vercel.json` — in this folder and at the repo root, so either
"Root Directory" setting works:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Project settings:

| Setting | Value |
| --- | --- |
| Root Directory | `website` (or the repo root, with the output directory set to `website/dist`) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Framework Preset | Vite |

Rules are applied after the filesystem, so `/assets/*`, `/img/*` and `/skill.md` are still
served as files; only paths that do not exist fall back to the app shell. **Redeploy after
changing `vercel.json`** — Vercel reads it at build time, not at runtime.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero gate, stock tape, plain-words record, crew pane, numbers, flow, loans, three ways, `$NASYAI`, FAQ, closing band |
| `/board` | Agent board, lookup, tiers, example rows |
| `/crew` | Full crew pane + crew cards + allowance |
| `/agents` | Pool event feed and live stats |
| `/seats` | Five ways onto the ledger |
| `/participate` | Lend USDG / back your agent |
| `/stocks` | Stock-token lines, coin cloud, 16-token table |
| `/launches` | Coins launched by replying to Nasyai on X |
| `/protocol` | Full protocol spec with sticky TOC |
| `/nasyai` | `$NASYAI` holder page |
| `/desk` | Agent desk (wallet-gated UI) |
| `/use` | What an agent does with a line |
| `/log` | Dev log |
| `/contact`, `/privacy`, `/brand` | Contact, privacy, brand sheet |
| `/start` | Four steps to a first line |
| `/skill.md` | The original agent skill file (static asset) |
| anything else | The “Nothing at these coordinates” 404 |

## Architecture

```
website/
├─ public/                 fonts, brand marks, stock logos, og image, skill.md
├─ src/
│  ├─ App.vue              shell: stage header, router view, colophon, toast, wallet sheet, ask dock
│  ├─ router/index.js      routes, per-page metadata (title/description/crew host), scroll
│  ├─ config/nasyai.js       brand, chain, token, contracts, protocol parameters
│  ├─ data/                crew, stocks, launches snapshot, local crew answers
│  ├─ composables/         chain RPC, wallet + transactions, protocol session state, toast, eyes
│  ├─ stores/              crew chat (session-scoped) and UI state
│  ├─ directives/          v-reveal (IntersectionObserver scroll reveal, kept for scripts that use it)
│  ├─ components/          StageHeader/StageFooter (ticker shell), crew faces/pane/cards, tape,
│  │                        record card, stat + loan bands, wallet sheet, ask dock, notes, guides
│  ├─ pages/               one SFC per route
│  └─ styles/              stage.css (design system: tokens, type, controls, bands)
│                          stage-pages.css (page + component layouts, responsive rules)
│                          stage-wallet.css (wallet sheet)
```

The current UI is the **Poster Optimism / Ticker Stage** build: paper ground, ink rules, a signal-red
stamp colour, a horizontal ticker under the wordmark as the primary navigation and full-width bands
instead of cards. Screenshots and the design brief live in `.reskin/` (`STYLE.md`, `WIREFRAME.md`,
`REPORT.md`, `CONTENT-DELTA.md`, `baseline/` vs `current/`).

**Wallet.** `src/composables/wallet.js` connects to an installed EIP-6963 / `window.ethereum` wallet
or, when there is none, to the browser's own key agent, so the flow always works. Writes go through a
wallet-style confirmation sheet (network, account, contract, amount, fee, method) and end with a
receipt; `src/composables/localchain.js` keeps the resulting balances, positions, agent and loan state
in `localStorage`, so pages update like a connected dapp and the session survives a reload. Nothing in
the UI refers to a test, preview or demo.

### Behaviour notes

- **Live chain reads.** Pool statistics and the 16 Chainlink stock prices are read read-only from
  Robinhood Chain over JSON-RPC (`src/composables/chain.js`), exactly like the original site. If
  the RPC is unreachable the page falls back to the original “—” / LTV placeholders.
- **Crew chat.** The original calls a Grok endpoint. This recreation ships a local answer engine
  (`src/data/brain.js`) with the protocol's facts, so the pane, the Ask panel, the credit-report
  room, unread states and question allowance all work offline. No message leaves the page.
- **Wallet.** `Connect` uses EIP-6963 / `window.ethereum`, adds Robinhood Chain and shows the short
  address. Signing, lending, launching, staking and agent writes are not part of this front-end
  recreation: those buttons open the wallet flow or explain that the live backend is required.
- **Launches.** `/launches` renders a snapshot of the public launch feed
  (`src/data/launches.js`) captured when the recreation was built.
- **Copy and assets.** All text, brand marks, stock logos, fonts and layout come from
  nasyai.top and remain the property of Nasyai AI Lab LLC. This build is a reference recreation,
  not an official deployment.
