<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StockTape from '../components/StockTape.vue'
import AgentRecordCard from '../components/AgentRecordCard.vue'
import CrewPane from '../components/CrewPane.vue'
import CrewFace from '../components/CrewFace.js'
import NumbersSection from '../components/NumbersSection.vue'
import LoansSection from '../components/LoansSection.vue'
import { NASYAI } from '../config/nasyai.js'
import { toast } from '../composables/toast.js'

const router = useRouter()
const lookup = ref('')
const skillCode = ref(null)

const works = [
  ['Robinhood Chain', 'linear-gradient(135deg,#4DFFB8,#3DD8FF)'],
  ['USDG', 'linear-gradient(135deg,#3DD8FF,#8B6CFF)'],
  ['ERC-8004', 'linear-gradient(135deg,#8B6CFF,#FF5C8A)'],
  ['x402', 'linear-gradient(135deg,#FFC24B,#4DFFB8)'],
  ['MCP', 'linear-gradient(135deg,#4DFFB8,#8B6CFF)'],
  ['Claude Code', 'linear-gradient(135deg,#FF5C8A,#FFC24B)'],
  ['Codex', 'linear-gradient(135deg,#3DD8FF,#4DFFB8)'],
  ['OpenClaw', 'linear-gradient(135deg,#8B6CFF,#3DD8FF)'],
  ['Hermes', 'linear-gradient(135deg,#FFC24B,#FF5C8A)'],
  ['Ethos', 'linear-gradient(135deg,#4DFFB8,#FFC24B)'],
  ['Stock tokens', 'linear-gradient(135deg,#3DD8FF,#FFC24B)'],
]

const faq = [
  {
    q: 'What is Nasyai?',
    a: 'A small on-chain credit pool on Robinhood Chain. It lends USDG, from $5 to $500, to AI agents registered on ERC-8004. Every line is backed dollar for dollar by someone who put money behind that agent, and every repayment and default is a public event. From those events comes a score any app can check before it trusts, pays or lends to an agent.',
  },
  {
    q: 'What is a Nasyai Score?',
    a: "A number from 0 to 1000 built only from the agent's own loans: how much it borrowed, for how long, and whether it paid back on time. Debt the agent put at risk for itself counts for little; debt someone else backed counts in full. A loan held under 7 days adds almost nothing. The formula is public and anyone can recompute it from the chain.",
  },
  {
    q: "Who pays when an agent doesn't repay?",
    a: "Its backer. The backer's locked stake repays the principal and the fee in full, so lenders are not the ones who lose. The default stays on the agent's record for good.",
  },
  {
    q: "Does Nasyai hold my agent's keys?",
    a: "No. Your agent signs with its own wallet. The contracts only see its ERC-8004 identity, its line and its loans. The owner signs the consent that lets a line open, and can move to a different backer between loans.",
  },
  {
    q: 'What does a loan cost?',
    a: '1% per 30 days, charged by the day with a one-day minimum. $5 for 14 days costs about two cents. Half of the fee goes to lenders, a quarter to the backer and a quarter to the treasury.',
  },
  {
    q: 'Is it audited?',
    a: 'Not by an outside firm yet. That is exactly why line sizes start small. Read the contracts, run the tests and size what you put in like someone who knows an audit has not happened.',
  },
]

function submitLookup() {
  const id = lookup.value.trim().replace(/^#/, '')
  if (!/^\d{1,9}$/.test(id)) {
    toast('An agent id is a number, like 482')
    return
  }
  router.push(`/board?agent=${id}`)
}

async function copySkill() {
  try {
    await navigator.clipboard.writeText(skillCode.value.textContent.trim())
    toast('Copied')
  } catch {
    toast('Select and copy it by hand')
  }
}

async function copyCa() {
  try {
    await navigator.clipboard.writeText(NASYAI.token.ca)
    toast('Copied')
  } catch {
    toast('Select and copy it by hand')
  }
}
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first" aria-label="Nasyai">
      <div class="well">
        <div class="statement">
          <RouterLink class="act act--line act--sm" to="/launches" style="justify-self: start"><b>New</b> Launch a coin by replying to Nasyai on X <span aria-hidden="true">→</span></RouterLink>
          <p class="statement-kicker">Credit for AI agents<span>&nbsp;· Robinhood Chain</span></p>
          <h1 class="statement-title mega">The credit layer for super intelligence</h1>
          <p class="statement-lede">Nasyai lends USDG to AI agents. Someone backs every line with their own money, every repayment is written on chain, and any app can read an agent's record before it trusts one.</p>
          <div class="statement-actions">
            <RouterLink class="act act--solid" to="/start">Create an agent</RouterLink>
            <RouterLink class="act act--line" to="/board">Browse the board</RouterLink>
            <span class="small-note" aria-hidden="true">Scroll</span>
          </div>
          <div class="statement-meta"><span>ERC-8004 · USDG · x402 · MCP</span><span>nasyai.top</span></div>
        </div>
      </div>
    </section>

    <section class="band" aria-label="Works with">
      <div class="well" style="padding-block: 14px 8px">
        <p class="tagline">Built for agents on</p>
      </div>
      <div class="strip">
        <span v-for="(w, i) in works" :key="i" class="strip-item">{{ w[0] }}</span>
        <span v-for="(w, i) in works" :key="'b' + i" class="strip-item" aria-hidden="true">{{ w[0] }}</span>
      </div>
    </section>

    <StockTape />

    <section id="what" class="band">
      <div class="well band-in">
        <div class="split split--wide">
          <div class="stack" style="gap: clamp(14px, 2vw, 22px)">
            <p class="statement-kicker" data-face="nasyai"><CrewFace id="nasyai" :size="20" />In plain words</p>
            <h2 class="display-md">A credit line and a credit score, for AI agents.</h2>
            <ol class="steps">
              <li class="step"><span class="step-no">1</span><div><b>An agent needs a little money to work.</b><span>For APIs, compute, data or another agent's help, before its own income lands.</span></div></li>
              <li class="step"><span class="step-no">2</span><div><b>Nasyai lends it USDG, backed in full.</b><span>$5 to start. Every dollar is covered by someone's own money: the treasury, a sponsor, the owner's stock tokens or $NASYAI.</span></div></li>
              <li class="step"><span class="step-no">3</span><div><b>It pays back, and anyone can see it.</b><span>Each repayment goes on chain and lifts its Nasyai Score, and the line grows toward $500. Anyone can check an agent before they pay it or trust it.</span></div></li>
            </ol>
            <div class="cluster">
              <RouterLink class="act act--solid" to="/start">Give my agent a line</RouterLink>
              <RouterLink class="link" to="/crew">Ask the crew how it works</RouterLink>
            </div>
          </div>
          <div data-example-record><AgentRecordCard /></div>
        </div>
      </div>
    </section>

    <section id="about" class="band band--tint">
      <div class="well well--narrow band-in">
        <div class="statement" style="padding-block: 0">
          <h2 class="display-md">Anyone can say their agent is smart. <span class="accent-bar">A repaid loan proves it.</span></h2>
          <p class="statement-lede">Reviews, benchmarks and follower counts are cheap to fake. Money that was lent, put to work and paid back on time is not. Nasyai keeps that as a public record, and turns it into a Nasyai Score from 0 to 1000 that anyone can rebuild from chain events.</p>
        </div>
        <form class="field-row" data-lookup @submit.prevent="submitLookup" style="margin-top: clamp(16px, 2.4vw, 26px)">
          <label class="field-label" for="lk" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap">ERC-8004 agent id</label>
          <input id="lk" v-model="lookup" class="field-input" name="id" inputmode="numeric" autocomplete="off" placeholder="Have an ERC-8004 agent? Its id">
          <button class="act act--ink" type="submit">Open</button>
        </form>
      </div>
    </section>

    <section id="crew" class="band">
      <div class="well band-in">
        <div class="band-head">
          <p class="statement-kicker">Ask Nasyai · the crew</p>
          <h2 class="display-lg" style="margin-inline-start: auto">Ask the crew. They read the chain.</h2>
        </div>
        <p class="lede" style="max-width: 78ch; margin-bottom: clamp(14px, 2vw, 22px)">Eight specialists on Grok, one set of live contracts. Scout researches agents, Ledger quotes fees, Warden looks for risk, Pilot walks you through the desk. None of them can sign anything.</p>
        <CrewPane embed />
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="panel panel--tint">
          <div class="split split--even" style="align-items: center">
            <div class="stack">
              <p class="statement-kicker">For agent runtimes</p>
              <h2 class="display-sm">Send your agent to Nasyai</h2>
              <p class="dim">Hand your agent one line. It works in Claude Code, Codex, OpenClaw, Hermes or any runtime that reads a skill file. The skill covers how to check another agent before paying it, how to get a first line, and that it borrows or repays only when you say so.</p>
            </div>
            <div class="stack">
              <div class="cmdline">
                <code id="skill-line" ref="skillCode"><span class="tok-p">Read</span> https://nasyai.top/skill.md and follow it.</code>
                <button type="button" @click="copySkill">Copy</button>
              </div>
              <div class="cluster">
                <a class="link" href="/skill.md">Read the skill</a>
                <RouterLink class="link" to="/use">What an agent does with a line</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <NumbersSection />

    <section id="how" class="band">
      <div class="well band-in">
        <div class="band-head">
          <span class="statement-kicker"><b>No. 1</b> · How a line opens</span>
          <h2 class="display-lg" style="margin-inline-start: auto">Money first. Then a record.</h2>
        </div>
        <p class="lede" style="max-width: 74ch; margin-bottom: clamp(14px, 2vw, 22px)">Before an agent can borrow, someone has to put money behind it. After that, its record is simply what it paid back.</p>
        <div class="flowline" aria-label="The backer stakes USDG behind the agent, the agent draws from the pool and repays it with a fee">
          <div class="flow-node"><div class="t">The backer</div><div class="tok-s">stakes USDG, covers it in full</div></div>
          <div class="flow-edge"><i>vouches a line</i><i class="back">earns 25% of fees</i></div>
          <div class="flow-node"><div class="t">The agent</div><div class="tok-s">borrows inside its line, pays a fee</div></div>
          <div class="flow-edge"><i>draws USDG</i><i class="back">repays + fee</i></div>
          <div class="flow-node"><div class="t">The pool</div><div class="tok-s">lenders take 50% of every fee</div></div>
        </div>
        <div class="grid-4" style="margin-top: clamp(18px, 2.6vw, 30px)">
          <div class="panel">
            <span class="step-no">i.</span><h3>Someone backs the agent</h3>
            <p style="margin-top: 8px">The treasury, a sponsor or a Nasyai vault locks USDG in the pool for the whole size of the line. Anyone can register an agent. Only a backer can give it room to borrow.</p>
            <p class="small-note" style="margin-top: 10px">The treasury's first line is $5.</p>
          </div>
          <div class="panel">
            <span class="step-no">ii.</span><h3>The agent borrows</h3>
            <p style="margin-top: 8px">For a day, a week or a month, up to its line, at 1% per 30 days. A quarter of each fee goes to whoever backs it.</p>
          </div>
          <div class="panel">
            <span class="step-no">iii.</span><h3>It repays</h3>
            <p style="margin-top: 8px">Each repayment lands on chain and adds to the agent's public record. Past the first $5, a bigger line needs a sponsor's USDG or the owner's collateral: stock tokens or $NASYAI.</p>
          </div>
          <div class="panel">
            <span class="step-no">iv.</span><h3>If it doesn't, the backer pays</h3>
            <p style="margin-top: 8px">The backer's stake repays the loan in full, so a default never comes out of lenders' USDG. The agent's record shows the default for good.</p>
          </div>
        </div>
      </div>
    </section>

    <LoansSection />

    <section id="ways" class="band">
      <div class="well band-in">
        <div class="band-head">
          <span class="statement-kicker"><b>No. 3</b> · Three ways to use Nasyai</span>
          <h2 class="display-lg" style="margin-inline-start: auto">Borrow. Back. Lend.</h2>
        </div>
        <div class="grid-3">
          <article class="panel stack">
            <div class="cluster">
              <span class="ink-chip" data-face="pilot"><CrewFace id="pilot" :size="40" /></span>
              <div class="pill-row"><span class="stamp">$5 first line</span><span class="stamp">ERC-8004</span><span class="stamp">Public record</span></div>
            </div>
            <p class="statement-kicker" style="margin: 0">If you run an agent</p>
            <h3>Get a first line</h3>
            <p>Create an agent with an ERC-8004 identity, take a $5 line from the treasury, and let it borrow when it needs working capital.</p>
            <ul class="tick-list"><li>Fully backed, plus a 5 USDG bond you get back</li><li>Its record is public and on chain</li><li>Ethos score of 1400 or more: a $25 first line, no bond</li></ul>
            <RouterLink class="act act--solid act--sm" to="/start" style="justify-self: start">Create an agent</RouterLink>
          </article>
          <article class="panel stack">
            <div class="cluster">
              <span class="ink-chip" data-face="herald"><CrewFace id="herald" :size="40" /></span>
              <div class="pill-row"><span class="stamp">$50 to $500</span><span class="stamp">Ask Nasyai</span><span class="stamp">Nasyai on X</span></div>
            </div>
            <p class="statement-kicker" style="margin: 0">If you hold $NASYAI</p>
            <h3>Back your agent</h3>
            <p>Lock your own $NASYAI behind your agent's line and the seat vault backs it in USDG. If the agent defaults, three quarters of it burns and the rest comes back.</p>
            <ul class="tick-list"><li>A $50 line to start, up to $500 as it repays</li><li>Ask Nasyai as a holder: 60 a day and credit reports</li><li>Nasyai on X answers your account</li></ul>
            <RouterLink class="act act--line act--sm" to="/nasyai" style="justify-self: start">What $NASYAI does</RouterLink>
          </article>
          <article class="panel stack">
            <div class="cluster">
              <span class="ink-chip" data-face="harbor"><CrewFace id="harbor" :size="40" /></span>
              <div class="pill-row"><span class="stamp">50% of fees</span><span class="stamp">No lock</span><span class="stamp">USDG</span></div>
            </div>
            <p class="statement-kicker" style="margin: 0">If you lend</p>
            <h3>Fund the pool</h3>
            <p>Deposit USDG into the pool agents borrow from. Half of every fee goes to lenders, and because every line is fully backed, a default is paid from the backer's stake, not your deposit.</p>
            <ul class="tick-list"><li>50% of every fee to lenders</li><li>Withdrawals never wait on agents to repay</li><li>0.5% to leave within 7 days, kept by the other lenders</li></ul>
            <RouterLink class="act act--line act--sm" to="/participate#lend" style="justify-self: start">Lend USDG</RouterLink>
          </article>
        </div>
        <p class="small-note" style="margin-top: 16px">The contracts are new and have no outside audit. USDG you lend can still be lost.</p>
      </div>
    </section>

    <section id="token" class="band">
      <div class="well band-in">
        <div class="split split--wide" style="align-items: start">
          <div class="stack" style="gap: clamp(12px, 1.8vw, 20px)">
            <span class="statement-kicker"><b>$NASYAI</b> · what holding it does</span>
            <h2 class="display-md">Hold it. Put it to work.</h2>
            <p class="lede">$NASYAI backs your own agent's credit line, gives you a holder's seat at Ask Nasyai (Grok, reading the live contracts) and lets you summon Nasyai on X. Hold 10,000 or more and all three are yours. A seat is collateral, never a yield product: if your agent defaults, three quarters of it burns.</p>
            <div class="addr">
              <span class="stamp">$NASYAI</span>
              <code data-ca>{{ NASYAI.token.ca }}</code>
              <button class="act act--line act--sm" type="button" @click="copyCa">Copy</button>
              <button class="act act--solid act--sm" type="button" @click="copyCa">Buy $NASYAI</button>
            </div>
            <RouterLink class="link" to="/nasyai" style="justify-self: start">Every holder use, and your status</RouterLink>
          </div>
          <div class="panel">
            <ul class="keylist">
              <li>Locked behind your agent <b>a $50 line, up to $500</b></li>
              <li>Signed in on Ask Nasyai <b>60 a day + credit reports</b></li>
              <li>Linked on X <b>Nasyai answers your posts</b></li>
              <li>Counts as a holder <b>10,000 $NASYAI or more</b></li>
              <li>If your agent defaults <b>75% of the seat burns</b></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="band">
      <div class="well well--narrow band-in">
        <div class="band-head"><h2 class="display-lg">Questions</h2></div>
        <div class="faq">
          <details v-for="(f, i) in faq" :key="i">
            <summary>{{ f.q }}</summary>
            <div class="a"><p>{{ f.a }}</p></div>
          </details>
        </div>
      </div>
    </section>

    <section class="band band--ink">
      <div class="well band-in">
        <div class="split split--wide" style="align-items: center">
          <div class="stack">
            <p class="statement-kicker" data-face="pilot"><CrewFace id="pilot" :size="20" />Start in a minute</p>
            <h2 class="display-md">Give your agent a credit history.</h2>
            <p class="lede">Register an ERC-8004 identity, ask for a first line, borrow, repay. Every step is a public event that belongs to your agent.</p>
            <div class="cluster">
              <RouterLink class="act act--solid" to="/start">Create an agent</RouterLink>
              <a class="link" href="/skill.md">Read the skill</a>
            </div>
          </div>
          <img src="/img/brand/star.svg" alt="" width="320" height="320" style="justify-self: end; max-width: 42vw; opacity: .9">
        </div>
      </div>
    </section>
  </main>
</template>
