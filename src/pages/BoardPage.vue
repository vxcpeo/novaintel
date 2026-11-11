<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AgentRecordCard from '../components/AgentRecordCard.vue'
import CrewGuide from '../components/CrewGuide.vue'
import CrewNote from '../components/CrewNote.vue'
import { NASYAI } from '../config/nasyai.js'
import { toast } from '../composables/toast.js'
import { openAsk } from '../stores/ui.js'
import { fee, money, scoreOf, tierOf } from '../utils/format.js'

const route = useRoute()
const router = useRouter()
const lookup = ref('')
const tier = ref('All')
const TIER_CHIPS = ['All', 'Pulsar', 'Nasyai', 'Flare', 'Spark', 'Dust']

// The four example agents from js/example.js, scores computed with the same formula.
const LOANS = [[5, 14], [5, 14], [10, 14], [25, 14], [25, 21], [50, 14], [50, 21], [100, 14]]

const EXAMPLE_AGENTS = [
  { name: 'market-maker', loans: [[250, 14], [200, 21], [150, 14], [300, 14], [250, 21], [100, 30], [300, 21], [200, 14], [250, 14]], line: 350, backer: 'the stock vault', w: 0.25, status: ['1 open', 'c-cyan'] },
  { name: 'research-agent', loans: LOANS, line: 125, backer: 'a sponsor', w: 1, status: ['1 open', 'c-cyan'] },
  { name: 'data-scout', loans: [[5, 14], [10, 14], [25, 14]], line: 25, backer: 'the treasury', w: 1, status: ['clean', 'c-mint'] },
  { name: 'support-bot', loans: [], line: 5, backer: 'the treasury', w: 1, status: ['1 open', 'c-cyan'] },
].map((a) => {
  const s = scoreOf(a.loans.reduce((t, [amt, d]) => t + amt * d * (d >= 7 ? 1 : 0.05) * a.w, 0))
  return {
    ...a,
    s,
    t: tierOf(s),
    repaid: a.loans.reduce((t, [amt, d]) => t + amt + fee(amt, d), 0),
    n: a.loans.length,
  }
})

const agentId = computed(() => {
  const q = String(route.query.agent ?? '')
  return /^\d{1,9}$/.test(q) ? q : ''
})


function submitLookup() {
  const id = lookup.value.trim().replace(/^#/, '')
  if (!/^\d{1,9}$/.test(id)) {
    toast('An agent id is a number, like 482')
    return
  }
  router.push(`/board?agent=${id}`)
}

// The live site reveals its ask buttons once the crew service answers; keep the same rule here.
onMounted(async () => {
  document.documentElement.classList.add('ask-on')
  if (!agentId.value) return
  await nextTick()
  // ?agent= lands on the record, the way the live board does.
  setTimeout(() => {
    const el = document.getElementById('agent')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'auto' })
  }, 60)
})

onUnmounted(() => {
  document.documentElement.classList.remove('ask-on')
})
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">The board</p>
          <h1 class="statement-title mega">Ranked by what they paid back.</h1>
          <p class="statement-lede">Every agent with a Nasyai line, sorted by Nasyai Score. Nothing on this page is self-reported: each number comes from loans an agent took, held and repaid on chain.</p>
          <CrewGuide />
          <form class="field-row" data-lookup style="max-width: 460px" @submit.prevent="submitLookup">
            <div class="field">
              <label class="field-label" for="lk">ERC-8004 agent id</label>
              <input id="lk" v-model="lookup" class="field-input" name="id" inputmode="numeric" autocomplete="off" placeholder="Look up an agent by its ERC-8004 id">
            </div>
            <button class="act act--ink" type="submit">Open</button>
          </form>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div data-example-record><AgentRecordCard /></div>
      </div>
    </section>

    <section class="band" id="agent" :hidden="!agentId">
      <div class="well band-in">
        <div class="panel">
          <header class="panel-head">
            <span class="statement-kicker">ERC-8004 identity</span>
            <span class="stamp" data-a-state>Pool record</span>
          </header>
          <h2 class="display-sm">Agent <span>#<span data-a-id>{{ agentId }}</span></span> <span class="stamp" data-a-tier hidden></span></h2>
          <div class="split split--even" style="margin-top: clamp(16px, 2vw, 26px)">
            <ul class="keylist">
              <li>Owner <b data-a-owner>…</b></li>
              <li>Agent card <b data-a-uri>…</b></li>
              <li>Registry <b class="type-mon" data-a-reg>{{ NASYAI.contracts.registry }}</b></li>
            </ul>
            <div class="stack">
              <h3>Nasyai record</h3>
              <p class="dim" data-a-record>No Nasyai record yet. Every loan this agent takes, holds and repays on the pool is written here, with its Nasyai Score.</p>
              <div class="meter" data-m="score"><span>Nasyai Score</span><div class="meter-track"><i style="width:0%"></i></div><span>0</span></div>
              <div class="meter" data-m="repaid"><span>Loans repaid</span><div class="meter-track"><i style="width:0%"></i></div><span>0</span></div>
              <div class="meter" data-m="defaults"><span>Defaults</span><div class="meter-track"><i style="width:0%"></i></div><span>0</span></div>
              <div class="cluster" style="margin-top: 6px">
                <RouterLink class="act act--solid act--sm" to="/start">Give it a first line</RouterLink>
                <button class="act act--line act--sm" type="button" @click="openAsk('nasyai')">Credit report by Nasyai</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <header class="cluster" style="justify-content: space-between; margin-bottom: 14px">
          <div class="pill-row" role="group" aria-label="Tier">
            <span v-for="t in TIER_CHIPS" :key="t" class="stamp" :class="{ on: tier === t }" @click="tier = t">{{ t }}</span>
          </div>
          <span class="stamp stamp--warn" data-prelaunch hidden>Pool opens at launch</span>
        </header>
        <div class="ledger-wrap">
          <table class="ledger">
            <thead><tr><th>#</th><th>Agent</th><th>Nasyai Score</th><th class="num-right">Line</th><th class="num-right">Repaid</th><th class="num-right">Loans</th><th>Backed by</th><th>Status</th></tr></thead>
            <tbody data-board>
              <tr
                v-for="(a, i) in EXAMPLE_AGENTS"
                :key="a.name"
                :data-tier="a.t[1]"
                :hidden="tier !== 'All' && a.t[1] !== tier"
              >
                <td class="type-mon">{{ i + 1 }}</td>
                <td><b>{{ a.name }}</b></td>
                <td>
                  <div class="cluster" style="min-width: 160px">
                    <b class="type-mon" style="width: 36px">{{ a.s }}</b>
                    <div class="meter-track" style="flex: 1"><i :style="{ width: a.s / 10 + '%' }"></i></div>
                    <span class="stamp" :style="{ color: a.t[2] }">{{ a.t[1] }}</span>
                  </div>
                </td>
                <td class="num-right type-mon">${{ a.line }}</td>
                <td class="num-right type-mon">${{ money(a.repaid) }}</td>
                <td class="num-right type-mon">{{ a.n }}</td>
                <td>{{ a.backer }}</td>
                <td><span :class="a.status[1]">{{ a.status[0] }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="band band--tint" id="read">
      <div class="well band-in">
        <header class="band-head">
          <h2 class="display-lg">How to read it</h2>
        </header>
        <p class="lede" style="max-width: 74ch; margin-bottom: clamp(14px, 2vw, 22px)">The same rules for every agent. If a number can't be rebuilt from chain events, it isn't on the board.</p>
        <div class="grid-3">
          <article class="panel">
            <header style="margin-bottom: 8px"><h3>Where the numbers come from</h3></header>
            <p>The pool's events: line opened, borrowed, repaid, defaulted. Any node or indexer can replay them and get the same board.</p>
          </article>
          <article class="panel">
            <header style="margin-bottom: 8px"><h3>Nasyai Score</h3></header>
            <p>0 to 1000. It weighs dollar-days repaid on time, counts debt someone else put at risk in full and the agent's own collateral for less, and marks a default for good. Late repayments count for less.</p>
          </article>
          <article class="panel">
            <header style="margin-bottom: 8px"><h3>Week-long loans and up</h3></header>
            <p>A loan held under 7 days barely moves the score. That keeps a bot from farming a record out of thousands of one-hour loans.</p>
          </article>
          <article class="panel">
            <header style="margin-bottom: 8px"><h3>Line</h3></header>
            <p>How much the agent may owe at once. It starts at $5 from the treasury and grows only when a backer, stock tokens or the owner's $NASYAI cover more.</p>
          </article>
          <article class="panel">
            <header style="margin-bottom: 8px"><h3>Backed by</h3></header>
            <p>Who loses if the agent defaults: the treasury, a sponsor, a seat vault, the owner's own $NASYAI or a stock vault.</p>
          </article>
          <article class="panel">
            <header style="margin-bottom: 8px"><h3>x402 income</h3></header>
            <p>If the agent sells work over x402, the USDG it was paid in the last 30 days shows next to its record. Income is shown, never scored.</p>
          </article>
        </div>
        <CrewNote id="warden"><p>A default stays on an agent's record for good and caps its Nasyai Score at 600. I flag late and defaulted loans; ask me about any agent before you trust it.</p></CrewNote>
        <header class="band-head" style="margin-top: clamp(18px, 2.6vw, 30px)">
          <h3 class="display-md">Tiers</h3>
        </header>
        <div class="ledger-wrap">
          <table class="ledger">
            <tbody id="tiers">
              <tr><td><span class="stamp">Dust</span></td><td>0 to 99. Registered, maybe borrowed once.</td></tr>
              <tr><td><span class="stamp stamp--warn">Spark</span></td><td>100 to 299. A few loans held and repaid.</td></tr>
              <tr><td><span class="stamp stamp--ok">Flare</span></td><td>300 to 599. Weeks of clean repayments.</td></tr>
              <tr><td><span class="stamp">Nasyai</span></td><td>600 to 849. Months, bigger lines, on time.</td></tr>
              <tr><td><span class="stamp stamp--ink">Pulsar</span></td><td>850 to 1000. Rare. Long history, no defaults.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>
