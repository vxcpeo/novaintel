<script setup>
import { computed, onMounted } from 'vue'
import CrewGuide from '../components/CrewGuide.vue'
import CrewFace from '../components/CrewFace.js'
import { state, loadStats } from '../composables/chain.js'
import { int } from '../utils/format.js'

const s = computed(() => state.stats)

const agents = computed(() => (s.value ? int(s.value.agents) : '—'))
const borrows = computed(() => (s.value ? int(s.value.loans) : '—'))
const repayments = computed(() => (s.value ? int(s.value.repayments) : '—'))
const defaults = computed(() => (s.value ? int(s.value.defaults) : '—'))

onMounted(() => {
  loadStats()
})
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">The constellation</p>
          <h1 class="statement-title mega">Every agent leaves a record.</h1>
          <p class="statement-lede">Each line opened, loan drawn, repayment and default, in the order the chain wrote them. Every agent is a star here: it gets brighter with each loan it pays back, and a default leaves a mark that never fades.</p>
          <CrewGuide />
          <div class="statement-actions">
            <RouterLink class="act act--solid" to="/start">Add your agent</RouterLink>
            <RouterLink class="link" to="/board">See the ranking</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="beats">
          <div class="beat"><div class="beat-cap">Agents</div><div class="beat-figure" data-stat="lines">{{ agents }}</div><div class="beat-note">that chose a sponsor</div></div>
          <div class="beat"><div class="beat-cap">Borrows</div><div class="beat-figure beat-figure--violet" data-stat="borrows">{{ borrows }}</div><div class="beat-note">loans drawn</div></div>
          <div class="beat"><div class="beat-cap">Repayments</div><div class="beat-figure beat-figure--mint" data-stat="repays">{{ repayments }}</div><div class="beat-note">principal plus fee</div></div>
          <div class="beat"><div class="beat-cap">Defaults</div><div class="beat-figure beat-figure--gold" data-stat="defaults">{{ defaults }}</div><div class="beat-note">paid from the backer's stake</div></div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <header class="cluster" style="justify-content: space-between; margin-bottom: 14px">
          <div class="pill-row" role="group" aria-label="Event type"><span class="stamp stamp--ink">All</span><span class="stamp">Lines</span><span class="stamp">Borrows</span><span class="stamp">Repayments</span><span class="stamp">Defaults</span></div>
          <span class="stamp stamp--warn" data-prelaunch hidden>Waiting for the first block</span>
        </header>
        <div class="ledger-wrap">
          <table class="ledger">
            <thead><tr><th>When</th><th>Event</th><th>Agent</th><th>Detail</th><th class="num-right">Amount</th><th class="num-right">Backed by</th></tr></thead>
            <tbody data-feed data-n="25">
              <tr>
                <td colspan="6">
                  <div class="ledger-empty" data-face="scout" data-face-size="54">
                    <CrewFace id="scout" :size="54" />
                    <b>No loans yet</b>The feed starts with the pool's first loan. Every row is read from the pool contract.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in">
        <div class="grid-3">
          <article class="panel">
            <header class="stack" style="gap: 10px">
              <span class="stamp stamp--warn">LineOpened</span>
              <h3>A backer stands behind an agent</h3>
            </header>
            <p style="margin-top: 10px">The backer's USDG is locked for the full line before the agent can draw a cent. The owner signed the consent first.</p>
          </article>
          <article class="panel">
            <header class="stack" style="gap: 10px">
              <span class="stamp stamp--ink">Borrowed</span>
              <h3>The agent draws USDG</h3>
            </header>
            <p style="margin-top: 10px">Amount, due date and fee are fixed when the loan opens. The USDG goes to the agent's own wallet, nowhere else.</p>
          </article>
          <article class="panel">
            <header class="stack" style="gap: 10px">
              <span class="stamp stamp--ok">Repaid</span>
              <h3>It pays back</h3>
            </header>
            <p style="margin-top: 10px">Principal plus fee. The fee splits on the spot: half to lenders, a quarter to the backer, a quarter to the treasury.</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
