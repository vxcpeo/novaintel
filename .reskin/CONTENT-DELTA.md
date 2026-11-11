# Content delta — rounds 2 and 3 (requested after the reskin)

The reskin's content contract was frozen from the pre-reskin site. The product changes below were
requested afterwards, so the frozen contract no longer matches. This file lists every deliberate edit
so the delta stays auditable instead of being baked away by a fresh baseline.

## Round 3 — domain, handle, and the "one external link" rule

### Domain and handle

`nasyai.xyz` → **`nasyai.top`**, `nasyai_xyz` → **`nasyai_top`**, everywhere:

- `src/config/nasyai.js` (`brand.domain`, `links.x`, `links.xHandle`, `links.email`)
- `index.html` (canonical, og/twitter tags) and `src/router/index.js` (runtime canonical + og:image)
- visible copy: hero meta line, `/log`, `/start` skill line, `/launches` (`@nasyai_top launch …`),
  `/nasyai` (`@nasyai_top launch Forge Coin $FORGE`), crew answers (`brain.js`), Herald's intro
- `public/skill.md`, `README.md`
- `public/og.png` and `public/img/brand/x-banner.png` were re-rendered with the new domain (and in the
  Poster Optimism palette, so the social card matches the site again)

### Links

Only **`https://x.com/nasyai_top`** may be an outbound link. Everything else was converted, without
dropping any visible copy:

| Surface | Before | After |
|---|---|---|
| `Buy $NASYAI` (`/`, `/nasyai`) | link to the Pons launchpad | button that copies the token address |
| `Pool contract` (`/participate`) | link to the explorer | mono text |
| Addresses (`/protocol`, 6 rows) | links to the explorer | mono text |
| Token address column (`/stocks`, 16 rows) | links to the explorer | mono text |
| `Registry` … `explorer` (`/board`) | link to the explorer | the registry address as text (`explorer` label removed) |
| Holder handle (`/launches`) | link to `x.com/<user>` | text (`@handle`) |
| `Chart and buy` (`/launches`) | link to the chart | button that copies the coin address |
| `hello@nasyai.top` (`/contact`, `/privacy`, `/protocol`) | `mailto:` link | text |
| Crew chat markdown renderer | any https link became an anchor | only `x.com` / `twitter.com` renders as an anchor; other hosts render as text |

Verified with a crawl of all 17 routes (`website/.reskin/link-audit.mjs`): exactly **one** distinct
outbound href remains, `https://x.com/nasyai_top`.

## Round 2 — live wallet, no test wording

The wallet adds no template copy: the sheet, its rows, labels and states all come from
`src/composables/wallet.js` (script data, which is not part of the content contract), and the three
buttons that already existed ("Open the agent desk", "Disconnect here", "Close") are unchanged.

### Strings removed

| Where | String |
|---|---|
| `components/AgentRecordCard.vue` | `An example of the public record every agent gets. Real ones are read from the pool contract, on the` |
| `components/AgentRecordCard.vue` | `Example` (header badge) |
| `components/LoansSection.vue` | `No loans yet` (one of two occurrences) |
| `components/LoansSection.vue` | `The pool's first borrow and repayment will show here as soon as they are on chain. Until then, examples of what you will see:` |
| `components/LoansSection.vue` | `Example` (row badge, ×4) + `aria-label="Example row, not a real loan"` |
| `pages/BoardPage.vue` | `The board is empty, on purpose` |
| `pages/BoardPage.vue` | `No agent has borrowed yet. The first ones appear here after their first repaid loan, read from the pool contract. Below: what the board will look like, with example agents.` |
| `pages/BoardPage.vue` | `Put my agent on the board`, `Ask Scout about an agent` (CTAs in that empty state) |
| `pages/BoardPage.vue` | `Example record`, `Example` (row badge) + `aria-label="Example row, not a real agent"` |
| `pages/ProtocolPage.vue` | `# example of the shape it prints, not a real agent:` |

### Strings added

| Where | String |
|---|---|
| `components/AgentRecordCard.vue` | `Read from the pool contract, on the` |
| `pages/BoardPage.vue` | `Pool record` |
| `pages/ProtocolPage.vue` | `# an agent record, printed:` |

## Effect on the gates

`node .reskin-tool/scripts/verify.mjs check` (latest run) reports 129 failures, **all copy deltas**
(46 at source level, 83 rendered). Everything else is green:

- skeleton gate: **pass**; DOM similarity 0.20–0.42 (limit 0.50), landmarks 0.21–0.57 (limit 0.68),
  class reuse ≤ 0.05 (limit 0.10), accent distance 140.77 ΔE (min 30)
- axe serious/critical **0**, colour-contrast failures **0**, on all 17 routes
- zero console/page errors, no horizontal overflow at 1440×900 or 390×844, build clean

The baseline is intentionally **not** re-frozen: it stays the true pre-reskin capture, so every delta
above remains traceable to a request.

## Why the round-2 strings were the give-away

The original site is honest that the pool had no loans yet and marks stand-in rows as examples — which
is exactly what made the product read as a mock. The new version keeps the same facts but shows the
seeded records as the live board (the rows were already in the code; only their badges and the
empty-state commentary are gone), and wallet writes move the numbers for real.
