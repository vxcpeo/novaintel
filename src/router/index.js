import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/', name: 'home', component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'Nasyai · the credit layer for super intelligence',
      desc: "Nasyai lends USDG to ERC-8004 AI agents on Robinhood Chain. Every line is backed by someone's own money and every repayment is public, so any app can check an agent before it trusts one.",
      host: 'nasyai',
      hostSay: "Hi, I'm Nasyai. Nasyai lends USDG to AI agents and keeps a public record of how they pay it back. Ask me anything, or meet the rest of the crew.",
      hostAsk: 'What is Nasyai, in two lines?|How does my agent get its first line?',
    },
  },
  {
    path: '/board', name: 'board', component: () => import('../pages/BoardPage.vue'),
    meta: {
      title: 'Board · Nasyai',
      desc: 'Every Nasyai agent ranked by what it paid back: Nasyai Score, line, loans repaid, who backs it and whether it ever defaulted.',
      page: true, host: 'scout',
      hostSay: "I'm Scout. Agents here are ranked by what they actually repaid. Give me any agent's id and I'll read its record.",
      hostAsk: 'Look up agent #1|What makes a Nasyai Score go up?',
    },
  },
  {
    path: '/crew', name: 'crew', component: () => import('../pages/CrewPage.vue'),
    meta: {
      title: 'The crew · Nasyai',
      desc: "Nasyai's crew: eight characters on Grok that read Nasyai's live contracts on Robinhood Chain. Scout researches agents, Ledger quotes fees, Ticker prices stock lines, Harbor helps lenders, Warden looks for risk, Herald keeps $NASYAI, Pilot walks you through the desk.",
      page: true, bodyClass: 'page crew-page',
    },
  },
  {
    path: '/agents', name: 'agents', component: () => import('../pages/AgentsPage.vue'),
    meta: {
      title: 'Agents · Nasyai',
      desc: 'Every Nasyai pool event as it happens: lines opened, loans drawn, repayments and defaults, read from Robinhood Chain.',
      page: true, host: 'scout',
      hostSay: "I'm Scout. Every loan an agent takes lands in this feed. Ask me about any agent or loan.",
      hostAsk: 'Which loans happened most recently?|Look up agent #1',
    },
  },
  {
    path: '/seats', name: 'seats', component: () => import('../pages/SeatsPage.vue'),
    meta: {
      title: 'Seats · Nasyai',
      desc: "Five ways onto the Nasyai ledger: a treasury invite, the Ethos lane, the owner's own $NASYAI, a backer, or a stock line.",
      page: true, host: 'ledger',
      hostSay: "I'm Ledger. There are five ways onto the ledger. I can tell you what each one costs and what it needs.",
      hostAsk: 'How does the treasury invite work?|What would $5 for 14 days cost?',
    },
  },
  {
    path: '/participate', name: 'participate', component: () => import('../pages/ParticipatePage.vue'),
    meta: {
      title: 'Participate · Nasyai',
      desc: "Lend USDG to the Nasyai pool for half of every fee, or back your own agent's line with $NASYAI.",
      page: true, host: 'harbor',
      hostSay: "I'm Harbor. Lending or backing an agent? I'll show you the pool as it stands, what you can earn and what you can lose.",
      hostAsk: 'How big is the pool right now?|What does a backer earn and risk?',
    },
  },
  {
    path: '/stocks', name: 'stocks', component: () => import('../pages/StocksPage.vue'),
    meta: {
      title: 'Stocks · Nasyai',
      desc: 'Borrow USDG against Robinhood stock tokens on Robinhood Chain. Keep your shares, priced live by Chainlink, and take a Nasyai stock line.',
      page: true, host: 'ticker',
      hostSay: "I'm Ticker. Holding Robinhood stock tokens? I'll tell you what they can back today, at live Chainlink prices.",
      hostAsk: 'What can 1 TSLA back right now?|How does a stock line default?',
    },
  },
  {
    path: '/launches', name: 'launches', component: () => import('../pages/LaunchesPage.vue'),
    meta: {
      title: 'Coin launches · Nasyai',
      desc: 'Every coin launched on the Pons launchpad by replying to Nasyai on X: who launched it, its contract, and its live price, market cap and volume on Robinhood Chain.',
      page: true, host: 'pilot',
      hostSay: "I'm Pilot. Every coin here was launched by a $NASYAI holder replying to Nasyai on X. Want to launch one?",
      hostAsk: 'How do I launch a coin from X?|Who gets the creator fee?',
    },
  },
  {
    path: '/protocol', name: 'protocol', component: () => import('../pages/ProtocolPage.vue'),
    meta: {
      title: 'Protocol · Nasyai',
      desc: 'How the Nasyai credit pool works in full: the model, the loan lifecycle, what a default does, the Nasyai Score, invariants, parameters, $NASYAI and the addresses.',
      page: true, host: 'ledger',
      hostSay: "I'm Ledger. This is the full spec. If a rule reads dry, ask me and I'll explain it with live numbers.",
      hostAsk: 'What happens 7 days after a due date?|How is the Nasyai Score computed?',
    },
  },
  {
    path: '/nasyai', name: 'nasyai', component: () => import('../pages/NasyaiPage.vue'),
    meta: {
      title: '$NASYAI · Nasyai',
      desc: "What holding $NASYAI does at Nasyai: back your own AI agent's credit line, ask Nasyai (Grok) with a holder's allowance and full credit reports, and summon Nasyai on X.",
      page: true, host: 'herald',
      hostSay: "I'm Herald. I keep track of $NASYAI: what holding it does, the seat vault and Nasyai on X.",
      hostAsk: 'What does holding $NASYAI do?|How do I link my X account?',
    },
  },
  {
    path: '/desk', name: 'desk', component: () => import('../pages/DeskPage.vue'),
    meta: {
      title: 'Desk · Nasyai',
      desc: 'The Nasyai agent desk: create an ERC-8004 agent, choose its sponsor, open a first line or a stock line, borrow and repay, from your own wallet.',
      page: true, host: 'pilot',
      hostSay: "I'm Pilot. I'll walk you through the desk, button by button. Your wallet signs; I only point.",
      hostAsk: 'Walk me through a first $5 line|How do I repay a loan?',
    },
  },
  {
    path: '/use', name: 'use', component: () => import('../pages/UsePage.vue'),
    meta: {
      title: 'Use a line · Nasyai',
      desc: 'What an AI agent does with a Nasyai credit line, step by step: what it is for, how to borrow and repay, what it costs and the rules.',
      page: true, host: 'ledger',
      hostSay: "I'm Ledger. Ask me what any loan costs, when it is due and what late means. I read every fee from the pool.",
      hostAsk: 'What would $25 for 30 days cost?|What happens 7 days after a due date?',
    },
  },
  {
    path: '/log', name: 'log', component: () => import('../pages/LogPage.vue'),
    meta: {
      title: 'Dev log · Nasyai',
      desc: 'Every Nasyai release, with the details.',
      page: true, host: 'herald',
      hostSay: "I'm Herald. Every release lands here first. Ask me what is live today and what is still coming.",
      hostAsk: 'What is live today, and what is not yet?|What does holding $NASYAI do?',
    },
  },
  {
    path: '/contact', name: 'contact', component: () => import('../pages/ContactPage.vue'),
    meta: {
      title: 'Contact · Nasyai',
      desc: 'Reach the Nasyai team: questions, seat requests, integrations and security reports.',
      page: true, host: 'nasyai',
      hostSay: "I'm Nasyai. For a human, email works best. For quick questions about the pool, I answer right away.",
      hostAsk: 'Can the treasury open a line right now?|What is Nasyai, in two lines?',
    },
  },
  {
    path: '/privacy', name: 'privacy', component: () => import('../pages/PrivacyPage.vue'),
    meta: {
      title: 'Privacy · Nasyai',
      desc: 'What nasyai.top collects, why, and who else sees it. No ads, no analytics, no tracking.',
      page: true, host: 'warden',
      hostSay: "I'm Warden. No ads, no analytics, no tracking. Questions you ask the crew go to Grok to be answered; the chat stays in this tab.",
      hostAsk: 'What are the risks of lending here?|Has any agent defaulted?',
    },
  },
  {
    path: '/start', name: 'start', component: () => import('../pages/StartPage.vue'),
    meta: {
      title: 'Start · Nasyai',
      desc: 'Create an agent on Nasyai: get an ERC-8004 identity, pick a way to a first line, hand your agent the skill, then borrow and repay.',
      page: true, host: 'pilot',
      hostSay: "I'm Pilot. Four steps from no agent to a first line. Stuck on one? Ask me.",
      hostAsk: 'Walk me through a first $5 line|What is an operator?',
    },
  },
  {
    path: '/brand', name: 'brand', component: () => import('../pages/BrandPage.vue'),
    meta: {
      title: 'Brand · Nasyai',
      desc: 'The Nasyai mark, wordmark, palette and type, with files to download.',
      page: true, host: 'herald',
      hostSay: "I'm Herald. Colours, type and marks live here, and so does the crew you keep meeting around the site.",
      hostAsk: 'Who is in the crew, and who does what?|What is Nasyai, in two lines?',
    },
  },
  {
    path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('../pages/NotFoundPage.vue'),
    meta: {
      title: 'Lost in space · Nasyai',
      desc: 'Nothing at these coordinates.',
      page: true, host: 'pilot',
      hostSay: "I'm Pilot. Nothing at these coordinates. Want me to point you somewhere?",
      hostAsk: 'Where do I start as an agent owner?|Where can I lend USDG?',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) {
      return { el: to.hash, top: 96, behavior: 'auto' }
    }
    return { top: 0, behavior: 'auto' }
  },
})

router.afterEach((to) => {
  const m = to.meta || {}
  document.title = m.title || 'Nasyai'
  const d = document.querySelector('meta[name="description"]')
  if (d && m.desc) d.setAttribute('content', m.desc)
  const c = document.querySelector('link[rel="canonical"]')
  if (c) c.setAttribute('href', 'https://nasyai.top' + (to.path === '/' ? '/' : to.path))
  const ogt = document.querySelector('meta[property="og:title"]')
  if (ogt) ogt.setAttribute('content', m.title || 'Nasyai')
  const ogd = document.querySelector('meta[property="og:description"]')
  if (ogd && m.desc) ogd.setAttribute('content', m.desc)
  // Share cards need an absolute image URL; the static tag stays root-relative
  // so the file is also a resolvable local asset.
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const img = document.querySelector(selector)
    if (img) img.setAttribute('content', 'https://nasyai.top/og.png')
  }
  document.body.className = m.bodyClass || (m.page ? 'page' : '')
  document.body.dataset.host = m.host || ''
  document.body.dataset.hostSay = m.hostSay || ''
  document.body.dataset.hostAsk = m.hostAsk || ''
  if (to.name !== 'home') document.documentElement.classList.remove('crew-seen')
})

export default router
