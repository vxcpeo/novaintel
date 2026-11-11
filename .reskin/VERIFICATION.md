# Reskin verification — FAIL

Generated: 2026-11-11T10:03:34.909Z

- Project: **nasyai-website**
- URL: http://127.0.0.1:4317/
- Original skeleton: `orbital` (spatial)
- New skeleton: `marketing-stack` (editorial)
- Accent: #3dd8ff -> #ff0421 (140.77 ΔE; min 30)
- Source contract: changed (`5f0be9d90781`)

| Route | Result | DOM similarity | Landmark similarity | Axe serious | Screenshot |
|---|---|---:|---:|---:|---|
| `/` | FAIL | 0.42 | 0.571 | 0 | [desktop](current/home-desktop.png) |
| `/agents` | PASS | 0.341 | 0.25 | 0 | [desktop](current/agents-desktop.png) |
| `/board` | FAIL | 0.359 | 0.214 | 0 | [desktop](current/board-desktop.png) |
| `/brand` | PASS | 0.338 | 0.5 | 0 | [desktop](current/brand-desktop.png) |
| `/contact` | FAIL | 0.224 | 0.5 | 0 | [desktop](current/contact-desktop.png) |
| `/crew` | PASS | 0.338 | 0.5 | 0 | [desktop](current/crew-desktop.png) |
| `/desk` | FAIL | 0.228 | 0.429 | 0 | [desktop](current/desk-desktop.png) |
| `/launches` | FAIL | 0.338 | 0.4 | 0 | [desktop](current/launches-desktop.png) |
| `/log` | FAIL | 0.208 | 0.5 | 0 | [desktop](current/log-desktop.png) |
| `/nasyai` | FAIL | 0.314 | 0.5 | 0 | [desktop](current/nasyai-desktop.png) |
| `/participate` | FAIL | 0.287 | 0.4 | 0 | [desktop](current/participate-desktop.png) |
| `/privacy` | FAIL | 0.228 | 0.5 | 0 | [desktop](current/privacy-desktop.png) |
| `/protocol` | FAIL | 0.202 | 0.5 | 0 | [desktop](current/protocol-desktop.png) |
| `/seats` | PASS | 0.275 | 0.5 | 0 | [desktop](current/seats-desktop.png) |
| `/start` | FAIL | 0.245 | 0.4 | 0 | [desktop](current/start-desktop.png) |
| `/stocks` | FAIL | 0.323 | 0.4 | 0 | [desktop](current/stocks-desktop.png) |
| `/use` | PASS | 0.275 | 0.5 | 0 | [desktop](current/use-desktop.png) |

## Blocking issues

- source: visibleText: removed "@nasyai_xyz launch Forge Coin $FORGE"
- source: visibleText: removed "@nasyai_xyz launch Name $TICKER"
- source: visibleText: removed "# example of the shape it prints, not a real agent:"
- source: visibleText: removed "An example of the public record every agent gets. Real ones are read from the pool contract, on the"
- source: visibleText: removed "Ask Scout about an agent"
- source: visibleText: removed "Example"
- source: visibleText: removed "Example record"
- source: visibleText: removed "explorer"
- source: visibleText: removed "https://nasyai.xyz/skill.md and follow it."
- source: visibleText: removed "nasyai.xyz"
- source: visibleText: removed "No agent has borrowed yet. The first ones appear here after their first repaid loan, read from the pool contract. Below: what the board will look like, with example agents."
- source: visibleText: "No loans yet" count 2 -> 1
- source: visibleText: removed "Put my agent on the board"
- source: visibleText: removed "The board is empty, on purpose"
- source: visibleText: removed "The pool's first borrow and repayment will show here as soon as they are on chain. Until then, examples of what you will see:"
- source: visibleText: removed "The site is up at nasyai.xyz with the protocol written down in full: how lines open, what a default does, the Nasyai Score and every launch parameter. Two things already read Robinhood Chain live: the agent lookup reads the ERC-8004 identity registry, and the stock page prices 16 stock tokens from their Chainlink feeds."
- source: attributes: removed "to=/crew#scout"
- source: attributes: "to=/start" count 9 -> 8
- source: bindings: removed "attr:`https://x.com/${encodeURIComponent(c.user)}`"
- source: bindings: removed "attr:`mailto:${NASYAI.links.email}`"
- source: bindings: removed "attr:addressUrl(address)"
- source: bindings: removed "attr:buy"
- source: bindings: removed "attr:c.link"
- source: bindings: removed "attr:NASYAI.token.buy"
- source: bindings: removed "attr:poolUrl"
- source: bindings: removed "attr:regHref"
- source: bindings: removed "attr:tokenHref(s)"
- source: bindings: removed "link:`https://x.com/${encodeURIComponent(c.user)}`"
- source: bindings: removed "link:`mailto:${NASYAI.links.email}`"
- source: bindings: removed "link:addressUrl(address)"
- source: bindings: removed "link:buy"
- source: bindings: removed "link:c.link"
- source: bindings: removed "link:NASYAI.token.buy"
- source: bindings: removed "link:poolUrl"
- source: bindings: removed "link:regHref"
- source: bindings: removed "link:tokenHref(s)"
- source: links: removed "to:/crew#scout"
- source: links: "to:/start" count 9 -> 8
- source: visibleText: added "The site is up at nasyai.top with the protocol written down in full: how lines open, what a default does, the Nasyai Score and every launch parameter. Two things already read Robinhood Chain live: the agent lookup reads the ERC-8004 identity registry, and the stock page prices 16 stock tokens from their Chainlink feeds."
- source: visibleText: added "Read from the pool contract, on the"
- source: visibleText: added "Pool record"
- source: visibleText: added "nasyai.top"
- source: visibleText: added "https://nasyai.top/skill.md and follow it."
- source: visibleText: added "# an agent record, printed:"
- source: visibleText: added "@nasyai_top launch Name $TICKER"
- source: visibleText: added "@nasyai_top launch Forge Coin $FORGE"
- /: content removed/changed: "agent" (38 -> 37)
- /: content removed/changed: "An" (2 -> 1)
- /: content removed/changed: "and" (36 -> 35)
- /: content removed/changed: "are" (7 -> 5)
- /: content removed/changed: "as" (7 -> 5)
- /: content removed/changed: "borrow" (8 -> 7)
- /: content removed/changed: "chain" (9 -> 8)
- /: content removed/changed: "every" (9 -> 8)
- /: content removed/changed: "example" (1 -> 0)
- /: content removed/changed: "Example" (5 -> 0)
- /: content removed/changed: "examples" (1 -> 0)
- /: content removed/changed: "first" (14 -> 13)
- /: content removed/changed: "gets" (1 -> 0)
- /: content removed/changed: "here" (3 -> 2)
- /: content removed/changed: "https://nasyai.xyz/skill.md" (1 -> 0)
- /: content removed/changed: "loans" (8 -> 7)
- /: content removed/changed: "nasyai.xyz" (1 -> 0)
- /: content removed/changed: "No" (6 -> 5)
- /: content removed/changed: "of" (22 -> 20)
- /: content removed/changed: "on" (26 -> 25)
- /: visible content added/changed: "https://nasyai.top/skill.md" (0 -> 1)
- /: visible content added/changed: "nasyai.top" (0 -> 1)
- /: visible content added/changed: "Read" (7 -> 8)
- /board: content removed/changed: "about" (2 -> 1)
- /board: content removed/changed: "after" (1 -> 0)
- /board: content removed/changed: "agent" (13 -> 9)
- /board: content removed/changed: "agents" (3 -> 2)
- /board: content removed/changed: "an" (4 -> 3)
- /board: content removed/changed: "An" (1 -> 0)
- /board: content removed/changed: "appear" (1 -> 0)
- /board: content removed/changed: "are" (1 -> 0)
- /board: content removed/changed: "Ask" (4 -> 3)
- /board: content removed/changed: "Below" (1 -> 0)
- /board: content removed/changed: "board" (7 -> 4)
- /board: content removed/changed: "borrowed" (3 -> 2)
- /board: content removed/changed: "contract" (2 -> 1)
- /board: content removed/changed: "empty" (1 -> 0)
- /board: content removed/changed: "every" (3 -> 2)
- /board: content removed/changed: "example" (2 -> 0)
- /board: content removed/changed: "Example" (5 -> 0)
- /board: content removed/changed: "first" (3 -> 1)
- /board: content removed/changed: "from" (7 -> 6)
- /board: content removed/changed: "gets" (1 -> 0)
- /board: visible content added/changed: "Read" (0 -> 1)
- /contact: content removed/changed: "hello@nasyai.xyz" (1 -> 0)
- /contact: visible content added/changed: "hello@nasyai.top" (0 -> 1)
- /desk: content removed/changed: "not" (1 -> 0)
- /desk: visible content added/changed: "Chain" (2 -> 3)
- /desk: visible content added/changed: "ETH" (2 -> 3)
- /desk: visible content added/changed: "Not" (0 -> 1)
- /desk: visible content added/changed: "Robinhood" (2 -> 3)
- /desk: visible content added/changed: "USDG" (3 -> 4)
- /launches: content removed/changed: "nasyai_xyz" (2 -> 0)
- /launches: visible content added/changed: "nasyai_top" (0 -> 2)
- /log: content removed/changed: "nasyai.xyz" (1 -> 0)
- /log: visible content added/changed: "nasyai.top" (0 -> 1)
- /nasyai: content removed/changed: "nasyai_xyz" (2 -> 0)
- /nasyai: visible content added/changed: "$NASYAI" (20 -> 21)
- /nasyai: visible content added/changed: "nasyai_top" (0 -> 2)
- /participate: content removed/changed: "a" (10 -> 9)
- /participate: content removed/changed: "connect" (2 -> 1)
- /participate: content removed/changed: "wallet" (3 -> 2)
- /participate: visible content added/changed: "USDG" (13 -> 15)
- /privacy: content removed/changed: "hello@nasyai.xyz" (1 -> 0)
- /privacy: visible content added/changed: "hello@nasyai.top" (0 -> 1)
- /protocol: content removed/changed: "a" (23 -> 22)
- /protocol: content removed/changed: "example" (1 -> 0)
- /protocol: content removed/changed: "hello@nasyai.xyz" (1 -> 0)
- /protocol: content removed/changed: "it" (9 -> 8)
- /protocol: content removed/changed: "not" (2 -> 1)
- /protocol: content removed/changed: "of" (11 -> 10)
- /protocol: content removed/changed: "prints" (1 -> 0)
- /protocol: content removed/changed: "real" (1 -> 0)
- /protocol: content removed/changed: "shape" (1 -> 0)
- /protocol: content removed/changed: "the" (56 -> 55)
- /protocol: visible content added/changed: "an" (9 -> 10)
- /protocol: visible content added/changed: "hello@nasyai.top" (0 -> 1)
- /protocol: visible content added/changed: "printed" (0 -> 1)
- /protocol: visible content added/changed: "record" (4 -> 5)
- /start: content removed/changed: "https://nasyai.xyz/skill.md" (1 -> 0)
- /start: visible content added/changed: "https://nasyai.top/skill.md" (0 -> 1)
- /stocks: content removed/changed: "min" (11 -> 10)
- /stocks: visible content added/changed: "h" (5 -> 6)

## Warnings

- bindings: added "interpolation:NASYAI.contracts.registry"
- bindings: added "interpolation:row.k"
- bindings: added "interpolation:row.v"
- bindings: added "interpolation:sheet.acceptLabel"
- bindings: added "interpolation:sheet.balanceLabel"
- bindings: added "interpolation:sheet.rejectLabel"
- bindings: added "interpolation:sheet.stateLabel"
- events: "click:closeSheet" count increased 3 -> 4
- events: "click:copy(c.token)" count increased 1 -> 2
- events: "click:copyCa" count increased 2 -> 4
- events: added "click:confirmRequest"
- /: aria attribute changed/removed: aria-label=Example of an agent's record, not a real agent
- /: aria attribute changed/removed: aria-label=Example row, not a real loan
- /: aria attribute added: aria-label=Agent credit record
- /: link target no longer rendered: https://ponsfamily.com/launchpad/AgSar6WiE86tXZCGYLHWbz6rttGMY3Ez4FUQCEC2pump
- /: link target no longer rendered: https://x.com/nasyai_xyz
- /: link target added: https://x.com/nasyai_top
- /agents: link target no longer rendered: https://x.com/nasyai_xyz
- /agents: link target added: https://x.com/nasyai_top
- /board: aria attribute changed/removed: aria-label=Example of an agent's record, not a real agent
- /board: aria attribute changed/removed: aria-label=Example row, not a real agent
- /board: aria attribute added: aria-label=Agent credit record
- /board: link target no longer rendered: /crew#scout
- /board: link target no longer rendered: /start
- /board: link target no longer rendered: https://x.com/nasyai_xyz
- /board: link target added: https://x.com/nasyai_top
- /brand: link target no longer rendered: https://x.com/nasyai_xyz
- /brand: link target added: https://x.com/nasyai_top
- /contact: link target no longer rendered: https://x.com/nasyai_xyz
- /contact: link target no longer rendered: mailto:hello@nasyai.xyz
- /contact: link target added: https://x.com/nasyai_top
- /crew: link target no longer rendered: https://x.com/nasyai_xyz
- /crew: link target added: https://x.com/nasyai_top
- /desk: numeric token count changed: 1 -> 3 (dynamic values may differ)
- /desk: link target no longer rendered: https://x.com/nasyai_xyz
- /desk: link target added: https://x.com/nasyai_top
- /launches: link target no longer rendered: https://ponsfamily.com/launchpad/0x98587fdee1b863f761041a739e744923c0b0f828
- /launches: link target no longer rendered: https://x.com/nasyai_xyz
- /launches: link target no longer rendered: https://x.com/shdweth
- /launches: link target added: https://x.com/nasyai_top

## Thresholds

- DOM fingerprint similarity <= 0.5
- Landmark sequence similarity <= 0.68
- CSS class overlap <= 0.1
- Accent distance >= 30 ΔE
- Contrast failures <= 0
- Axe serious/critical <= 0

All content is compared as a multiset of visible words plus rendered attribute values. Reordering is allowed, rewriting/removing/adding visible copy is not. Dynamic numeric values are reported as warnings, never silently accepted.
