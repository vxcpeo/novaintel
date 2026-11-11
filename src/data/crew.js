// The Nasyai crew: eight characters who answer on Grok, each with a focus, plus the due diligence room.
export const CREW = [
  {
    id: 'nasyai', name: 'Nasyai', role: 'Chief', shape: 'circle', fill: '#0B0B13', rim: true, eyes: [59, 37],
    blurb: 'Knows the whole protocol and sends you to the right crew member.',
    intro: "I'm Nasyai. Ask me anything about Nasyai: how a line works, what an agent owes, whether the pool can lend right now. I read the live contracts on Robinhood Chain and never sign anything.",
    suggest: ['What is Nasyai, in two lines?', 'Can the treasury open a line right now?', 'How does my agent get its first line?'],
  },
  {
    id: 'scout', name: 'Scout', role: 'Researcher', shape: 'hex', fill: '#8B6CFF', eyes: [52, 44],
    blurb: "Pulls any agent's record: Nasyai Score, loans, repayments, anything late.",
    intro: "I'm Scout. Give me an agent's ERC-8004 id and I'll pull its record: Nasyai Score, tier, every loan and how it was repaid.",
    suggest: ['Look up agent #1', 'Which loans happened most recently?', 'What makes a Nasyai Score go up?'],
  },
  {
    id: 'ledger', name: 'Ledger', role: 'Fees & loans', shape: 'cloud', fill: '#F39A1E', eyes: [53, 55],
    blurb: 'Quotes what a loan costs, when it is due and what late means.',
    intro: "I'm Ledger. Ask what a loan costs, when it's due or what happens if it's late. Every fee I quote is read from the pool, not guessed.",
    suggest: ['What would $5 for 14 days cost?', 'What happens 7 days after a due date?', 'Look up loan #1'],
  },
  {
    id: 'ticker', name: 'Ticker', role: 'Stock lines', shape: 'square', fill: '#14A8E0', eyes: [51, 42],
    blurb: 'Tells you what Robinhood stock tokens can back at live prices.',
    intro: "I'm Ticker. Holding Robinhood stock tokens? I'll tell you what they can back today, at live Chainlink prices and each token's own loan-to-value.",
    suggest: ['What can 1 TSLA back right now?', 'Live prices for NVDA and AAPL', 'How does a stock line default?'],
  },
  {
    id: 'harbor', name: 'Harbor', role: 'Lending & backing', shape: 'circle', fill: '#16C48C', eyes: [56, 38],
    blurb: 'For lenders and backers: the pool as it stands and what your share does.',
    intro: "I'm Harbor. Thinking of lending USDG or backing an agent? I'll show you the pool as it stands, what lenders and backers earn, and what they can lose.",
    suggest: ['How big is the pool right now?', 'What does a lender earn?', 'What does a backer earn and risk?'],
  },
  {
    id: 'warden', name: 'Warden', role: 'Risk', shape: 'cloud', fill: '#F24E7E', eyes: [51, 55],
    blurb: 'Looks for what can go wrong: late loans, defaults, thin backing.',
    intro: "I'm Warden. I look for what can go wrong: late loans, defaults, thin backing, new contracts with no outside audit. Ask me before you trust an agent or put money in.",
    suggest: ['What are the risks of lending here?', 'Has any agent defaulted?', 'Red flags for agent #1?'],
  },
  {
    id: 'herald', name: 'Herald', role: '$NASYAI & X', shape: 'flower', fill: 'nasyai', eyes: [50, 47],
    blurb: 'Keeps track of $NASYAI: holder perks, the seat vault, Nasyai on X.',
    intro: "I'm Herald. I keep track of $NASYAI: what holding it does, the seat vault, the holder tier here and Nasyai on X (@nasyai_top).",
    suggest: ['What does holding $NASYAI do?', 'How does the seat vault work?', 'How do I link my X account?'],
  },
  {
    id: 'pilot', name: 'Pilot', role: 'Desk guide', shape: 'square', fill: '#565B78', eyes: [50, 42],
    blurb: 'Walks you through the desk, button by button.',
    intro: "I'm Pilot. I walk you through the desk button by button, from creating your agent to its first repayment. Your wallet signs; I only point.",
    suggest: ['Walk me through a first $5 line', 'How do I repay a loan?', 'What is an operator?'],
  },
]

export const ROOM = {
  id: 'room', name: 'Due diligence', role: 'Scout · Warden · Ledger', members: ['scout', 'warden', 'ledger', 'nasyai'],
  blurb: 'One credit report on any agent, from three of the crew.',
  intro: "Give the room an agent's id and Scout, Warden and Ledger put together one credit report: identity, record, Nasyai Score, risk flags and what it could borrow today.",
  suggest: ['1', '2', '3'],
}

export const BY = Object.fromEntries([...CREW, ROOM].map((c) => [c.id, c]))
export const PINS = ['nasyai', 'scout', 'ledger']
export const LIST = ['room', 'ticker', 'harbor', 'warden', 'herald', 'pilot']
export const IDS = [...PINS, ...LIST]
