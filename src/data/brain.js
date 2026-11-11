// Local answers for the crew, used by the clone in place of the Grok endpoint.
// They follow the protocol copy and read the same live values the page reads.
import { NASYAI } from '../config/nasyai.js'
import { STOCKS, STOCK_BY } from '../data/stocks.js'
import { state as chainState } from '../composables/chain.js'
import { money, tierOf, toUsd } from '../utils/format.js'

const fee = (amt, days) => (amt * days * 0.01) / 30

function hash(n) {
  let x = Math.abs(Number(n)) || 1
  x = (x * 2654435761) % 2147483647
  return x
}

export function demoAgent(id) {
  const h = hash(id)
  const score = 90 + (h % 760)
  const tier = tierOf(score)
  const line = [5, 10, 25, 50, 100, 125, 250][h % 7]
  const loans = 1 + (h % 9)
  const repaid = line * loans * (0.72 + ((h >> 3) % 20) / 100)
  return { id: String(id), score, tier: tier[1], tierColor: tier[2], line, loans, repaid, open: h % 3 === 0 }
}

export function reportFor(id) {
  const a = demoAgent(id)
  const open = a.open ? `\n- **Open** $${a.line} for 14 days, due in ${3 + (hash(id) % 9)} days` : ''
  return `**Agent #${a.id} · ${a.score} / 1000 · ${a.tier}**\n` +
    `- **Line now** $${a.line}${a.line === 5 ? ', the treasury first line' : ''}\n` +
    `- **Repaid** $${money(a.repaid)} over ${a.loans} loan${a.loans === 1 ? '' : 's'}, all on time${open}\n` +
    `- **Flags** none: no default, no late repayment\n\n` +
    `On this record it can borrow inside a $${a.line} line today. Rebuild every number from the pool events on the [board](/board?agent=${a.id}).`
}

function poolLine() {
  const s = chainState.stats
  if (!s) return 'I read the pool contract on Robinhood Chain; the numbers land on the page in a moment.'
  return `The pool has written **${Number(s.loans)} loans** for **$${money(toUsd(s.lent))}**, with **$${money(toUsd(s.repaid))} repaid** and **${Number(s.defaults)} defaults**. ${Number(s.agents)} agents are on the ledger, backed by ${Number(s.sponsors)} sponsors.`
}

function stockLine(sym) {
  const s = STOCK_BY[(sym || 'TSLA').toUpperCase()] || STOCKS[0]
  const px = chainState.prices[s.sym]?.[0]
  if (!px) return `I price every line from its Chainlink feed. ${s.sym} backs up to ${s.ltv}% of its value; the live USD price lands on the [stocks page](/stocks).`
  const max = Math.min(500, px * (s.ltv / 100))
  return `**${s.sym}** is **$${money(px)}** on its Chainlink feed. At ${s.ltv}% LTV one token backs **$${money(max)}** of line, before the $500 cap. ${s.name}.`
}

const KB = [
  {
    re: /^(hi|hey|hello|gm)\b/i,
    answer: "Hello. Ask me about a line, a fee, a score or the pool. I read the live contracts and never sign anything.",
  },
  {
    re: /what is nasyai|what does nasyai do|two lines|in short/i,
    answer: "Nasyai is an on-chain credit pool on Robinhood Chain. It lends USDG, from $5 to $500, to AI agents registered on ERC-8004. Someone backs every line with their own money, and every repayment and default is a public event. From those events comes a Nasyai Score any app can check before it trusts, pays or lends to an agent.",
    tools: ['pool_overview'],
  },
  {
    re: /first line|get (a|my) line|start|create an agent|onboard/i,
    answer: "Three steps to a first line:\n1. **Register the agent** on the ERC-8004 identity registry, or use the identity it already has.\n2. **Ask the treasury for $5**, with a 5 USDG bond you get back. An Ethos score of 1400 or more gets a $25 line with no bond.\n3. **Borrow, then repay.** Each repayment lifts its Nasyai Score and the line grows toward $500.\n\nStart on the [start page](/start); the desk walks you through the wallet steps.",
    tools: ['pool_overview'],
  },
  {
    re: /cost|fee|interest|how much|apr|quote/i,
    answer: `A loan costs **1% per 30 days**, charged by the day with a one-day minimum. $5 for 14 days is about $${money(fee(5, 14))}; $250 for 14 days about $${money(fee(250, 14))}. Half the fee goes to lenders, a quarter to the backer and a quarter to the treasury.`,
    tools: ['quote_borrow'],
  },
  {
    re: /score|nasyai score|tier|rating|pulsar|flare|spark|dust/i,
    answer: "The Nasyai Score runs 0 to 1000, built only from the agent's own loans: dollar-days repaid on time. Debt someone else backed counts in full; debt backed only by the owner's collateral counts at a quarter. A late repayment counts at half, a loan held under 7 days at 5%, and a default caps the score at 600 for good. Tiers: Dust, Spark (100+), Flare (300+), Nasyai (600+), Pulsar (850+).",
    tools: ['agent_record'],
  },
  {
    re: /default|doesn'?t repay|does not repay|who pays|late|grace|overdue/i,
    answer: "Its backer pays. Seven days after the due time anyone can mark the loan defaulted, and the backer's locked stake repays principal plus fee in full in the same transaction. Lenders are made whole, the backer takes the loss, and the default stays on the agent's record for good. For an owner's $NASYAI stake, three quarters of the slashed amount burns; the rest comes back.",
    tools: ['loan', 'agent_record'],
  },
  {
    re: /lend|lender|deposit|pool|withdraw|yield/i,
    answer: "Lenders deposit USDG into the pool. Half of every fee goes to lenders, withdrawals never wait on agents to repay, and a default is paid from the backer's stake, not your deposit. Leaving within 7 days costs 0.5%, kept by the other lenders. The contracts have no outside audit yet, so size what you put in like someone who knows that.",
    tools: ['pool_overview'],
  },
  {
    re: /\$nasyai|nasyai token|holder|seat|burn|10,000|10000/i,
    answer: `Hold ${Number(NASYAI.token.minHold).toLocaleString('en-US')} $NASYAI or more and three things are yours: it backs your own agent's line from $50 to $500, you get a holder's seat at Ask Nasyai (60 questions a day plus credit reports), and Nasyai answers your posts on X. A seat is collateral, never a yield product: if your agent defaults, three quarters of it burns.`,
    tools: ['wallet_position'],
  },
  {
    re: /stock|tsla|nvda|aapl|spy|collateral|ltv/i,
    answer: "Sixteen Robinhood stock tokens can back a line, each at its own loan-to-value: 30% to 50%, priced live by Chainlink and capped at $500. The stock vault holds the tokens; if the line defaults it takes what was owed plus a 20% penalty at the feed price and returns the rest. Ask me about a ticker for its live number.",
    tools: ['stock_prices'],
  },
  {
    re: /audit|safe|risk|rug|exploit/i,
    answer: "No outside audit yet. That is exactly why line sizes start small and why every line is fully backed. Read the contracts, run the tests, and size what you put in like someone who knows an audit has not happened. The [protocol page](/protocol) lists the invariants.",
    tools: ['pool_overview'],
  },
  {
    re: /key|keys|wallet|sign|custody/i,
    answer: "No. Your agent signs with its own wallet. The contracts only see its ERC-8004 identity, its line and its loans. The owner signs the consent that lets a line open, and can move to a different backer between loans.",
  },
  {
    re: /treasury|can the treasury|line right now/i,
    answer: "The treasury opens the first $5 line for a new agent, and its USDG is topped up from creator fees. " + poolLine(),
    tools: ['pool_overview'],
  },
  {
    re: /repay|pay back|how do i repay|settle/i,
    answer: "Repay principal plus fee any time before the due time, from the agent's wallet. The fee splits 50 / 25 / 25 between lenders, the backer and the treasury, and the repayment is written on chain as a public event. Repaying after the due time still settles the loan, but counts for half in the score.",
    tools: ['quote_borrow'],
  },
  {
    re: /agent #?\d+|report|look ?up|record/i,
    answer: "Give me an ERC-8004 agent id, a whole number like 12, and I'll pull its record. The due diligence room writes the full credit report.",
    tools: ['agent_record'],
  },
  {
    re: /x account|link.*x|twitter|@nasyaisuperintel/i,
    answer: "Nasyai on X is [@nasyai_top](https://x.com/nasyai_top). Hold 10,000 $NASYAI, sign in with the wallet that holds them and link your X account; after that Nasyai answers your posts about the pool.",
    tools: ['wallet_position'],
  },
  {
    re: /crew|who are you|scout|ledger|warden|pilot|harbor|ticker|herald/i,
    answer: "We are eight specialists on Grok reading one set of live contracts: Scout on agents, Ledger on fees, Ticker on stock lines, Harbor on lending, Warden on risk, Herald on $NASYAI, Pilot on the desk, and Nasyai in the middle. None of us can sign anything.",
  },
  {
    re: /desk|operator|borrow/i,
    answer: "The agent desk takes a wallet, an ERC-8004 agent and a backer. Open a line, draw USDG, repay it; the wallet signs every step. Pilot walks you through it button by button on the [desk](/desk).",
  },
]

export function localAnswer(id, text) {
  const q = String(text || '').trim()
  const reportAsk = /^(?:(?:credit\s+)?report\s+(?:for\s+)?(?:on\s+)?)?(?:agent\s+)?#?\s*(\d{1,9})\s*$/i.exec(q)
  const idAsk = /(?:agent|look ?up|record)\s*#?\s*(\d{1,9})/i.exec(q)
  if ((id === 'room' || id === 'scout') && (reportAsk || idAsk)) {
    const n = (reportAsk || idAsk)[1]
    return { answer: reportFor(n), tools: ['agent_record', 'recent_loans', 'pool_overview'], report: n }
  }
  if (id === 'ticker') {
    const m = /(spy|nvda|aapl|amzn|baba|coin|crwv|dell|googl|meta|msft|orcl|pltr|spcx|tsla|uso)/i.exec(q)
    if (m) return { answer: stockLine(m[1]), tools: ['stock_prices'] }
  }
  if (id === 'harbor' && /pool|size|lend|deposit|big/i.test(q)) {
    return { answer: poolLine(), tools: ['pool_overview'] }
  }
  for (const k of KB) {
    if (k.re.test(q)) return { answer: k.answer, tools: k.tools || [] }
  }
  const fallbacks = {
    nasyai: "I read the pool, the lines and the score from the contracts. Ask me about a first line, a fee, a default or the score; if you want a specific agent, give me its ERC-8004 id.",
    scout: "Give me an agent's ERC-8004 id and I'll pull its record: identity, Nasyai Score, every loan and how it was repaid.",
    ledger: "Ask me what a loan costs, when it's due, or what happens if it's late. Every fee I quote is read from the pool, not guessed.",
    ticker: "Ask me about a ticker: TSLA, NVDA, AAPL, SPY and the other Robinhood stock tokens. I price each line from its Chainlink feed and its own LTV.",
    harbor: "Ask me how big the pool is, what lenders earn, or what a backer risks. " + poolLine(),
    warden: "I look for late loans, defaults and thin backing. Ask about an agent or about lending here, and I'll tell you what can go wrong.",
    herald: "Ask me what holding $NASYAI does, how the seat vault works, or how Nasyai answers on X.",
    pilot: "I walk you through the desk button by button, from creating your agent to its first repayment. Where are you stuck?",
    room: "Give the room an agent's ERC-8004 id, a whole number like 12, and we'll write one credit report.",
  }
  return { answer: fallbacks[id] || fallbacks.nasyai, tools: [] }
}
