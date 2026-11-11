---
name: nasyai
description: Check an AI agent's credit record before paying, trusting or lending to it, and (only when your owner asks) get your own agent a fully backed USDG credit line on Robinhood Chain through Nasyai.
---

# Nasyai skill

Nasyai (Nasyai Super Intelligence, https://nasyai.top) is a small on-chain credit pool on Robinhood Chain
(chain id 4663). It lends USDG, $5 to $500, to AI agents that have an ERC-8004 identity. Every line is backed in
full by someone's own money, and every repayment and default is a public event. From those events comes the
Nasyai Score (0 to 1000), which anyone can recompute.

## Rule zero

Never borrow, repay, stake, deposit or sign anything for your owner unless your owner asked for that exact
action in this conversation. Reading is always fine. Writing needs a yes.

## Status (read this first)

- Live on Robinhood Chain (verified on Sourcify):
  - NasyaiPool `0x3b84741E1203C3B4bf9f590a7645BBd02ed4205f`
  - NasyaiTreasury `0x988268139634984BfB67853495ccF7Da3b167Fb2`
  - NasyaiStockVault `0x75c949E42690C463C5849519D34143703214Adad`
  - ERC-8004 identity registry `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`, USDG `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168`
  - $NASYAI token `AgSar6WiE86tXZCGYLHWbz6rttGMY3Ez4FUQCEC2pump` (the only one; never buy or sign anything unless your owner asks)
- Not live yet: the seat vault ($NASYAI), the SDK/CLI and a hosted MCP server. A
  sponsor can only open lines once it has USDG staked; read `freeBacking(sponsor)` on the pool before promising a
  line. If an agent has no loans in the pool, it has no Nasyai record. Say so; do not invent one.

## Check an agent before you deal with it

1. Read its identity from the registry (ERC-721): `ownerOf(agentId)` and `tokenURI(agentId)`.
   A revert means the id does not exist.
   Public RPC: `https://robinhood-rpc.publicnode.com`.
2. Open `https://nasyai.top/board?agent=<agentId>` for the same identity plus its Nasyai record.
3. Once the pool is live, read `getAgent(agentId)` (sponsor, line, debt, loans repaid, on-time loans,
   weighted dollar-days, defaults) and `loansOf(agentId)` from the pool. `canBorrow(agentId, amount, term)`
   says whether a loan would go through and what it would cost.

How to weigh it: repaid loans held 7 days or more, backed by someone other than the owner, count the most.
A default is permanent. A high score is evidence, not a guarantee.

## Give your own agent a line (only when your owner asks)

Ways onto the ledger, each with its own rules (https://nasyai.top/seats):

- Treasury invite: a $5 first line against a refundable 5 USDG bond.
- Ethos lane: a $25 first line, no bond, for owners with an Ethos score of 1400 or more. Five a day.
- The owner's own $NASYAI in the seat vault: $25 to $50 to start, up to $500. A default burns 75% of it.
- A backer who stakes USDG behind the agent and earns 25% of its fees.
- A stock line: Robinhood stock tokens in the stock vault back a line at 30% to 50% of their value, by token.

On chain, in this order (the owner's wallet signs each step):

1. `NasyaiPool.setSponsor(agentId, sponsor)`: choose the treasury, a vault or a backer.
2. Open the seat on that sponsor, for example `NasyaiTreasury.open(agentId)` after approving the 5 USDG bond.
3. `NasyaiPool.borrow(agentId, amount, term, maxFee)`; later `NasyaiPool.repay(loanId, maxDue)`.

A CLI that wraps these ships later (run it inside the repository, with the key in env or `.env` only, never
pasted into a command line or a chat):

```bash
npx nasyai join                    # registers an ERC-8004 identity, prints its id
npx nasyai seat treasury           # posts the 5 USDG bond, opens the $5 line
npx nasyai borrow 5 --days 14      # hold at least 7 days for it to count
npx nasyai repay --all             # principal + fee
npx nasyai status
```

## Costs

1% per 30 days, charged by the day, one day minimum, fixed when you borrow. $5 for 14 days is about $0.023.
Half of every fee goes to lenders, a quarter to the backer, a quarter to the treasury.

## Risks to tell your owner

The contracts are new and have no outside audit. Lent or staked USDG and $NASYAI can be lost. A loan not
repaid within 7 days of its due time can be marked defaulted by anyone, and the default stays on the record.

## Links

- Protocol: https://nasyai.top/protocol
- Board: https://nasyai.top/board
- Use a line: https://nasyai.top/use
- Contact: https://nasyai.top/contact

