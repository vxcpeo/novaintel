<script setup>
import { computed, onMounted, ref } from 'vue'
import StockCoin from '../components/StockCoin.vue'
import CrewGuide from '../components/CrewGuide.vue'
import CrewNote from '../components/CrewNote.vue'
import { STOCKS } from '../data/stocks.js'
import { state, loadPrices } from '../composables/chain.js'
import { ago, money, shortAddr } from '../utils/format.js'
import { NASYAI } from '../config/nasyai.js'

const loaded = ref(false)

// The 16 coins in the hero cloud: 6 inside, 10 outside, exactly as js/example.js places them.
function place(list, rx, ry, size, turn) {
  return list.map((s, i) => {
    const a = (i / list.length) * Math.PI * 2 + turn
    return {
      sym: s.sym,
      size,
      x: (Math.cos(a) * rx).toFixed(1),
      y: (Math.sin(a) * ry).toFixed(1),
      dl: (-i * 0.7).toFixed(1),
    }
  })
}

const cloud = [
  ...place(STOCKS.slice(0, 6), 150, 118, 64, -Math.PI / 2),
  ...place(STOCKS.slice(6), 236, 188, 50, -Math.PI / 2 + 0.31),
]

const liveCount = computed(() => STOCKS.filter((s) => state.prices[s.sym]).length)

const feedState = computed(() => {
  if (liveCount.value) return { text: `Live from ${liveCount.value} Chainlink feeds`, cls: 'live' }
  return loaded.value
    ? { text: 'Feeds unreachable right now', cls: 'soon' }
    : { text: 'Reading feeds…', cls: '' }
})

const priceOf = (s) => state.prices[s.sym]
const priceCell = (s) => (priceOf(s) ? `$${money(priceOf(s)[0])}` : loaded.value ? '—' : '…')
const lineCell = (s) => (priceOf(s) ? `$${money(Math.min(500, (priceOf(s)[0] * s.ltv) / 100))}` : loaded.value ? '—' : '…')
const updatedCell = (s) => (priceOf(s) ? ago(priceOf(s)[1]) : loaded.value ? 'feed unreachable' : '…')

onMounted(async () => {
  try {
    await loadPrices()
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">Stock lines</p>
          <h1 class="statement-title mega">Borrow USDG against your stock tokens.</h1>
          <p class="statement-lede">Deposit Robinhood stock tokens, keep the exposure, and draw USDG for your agent. The stock vault backs the line, priced by Chainlink, so the pool never carries the risk.</p>
          <CrewGuide />
          <div class="statement-actions">
            <RouterLink class="act act--solid" to="/desk">Open a stock line</RouterLink>
            <a class="link" href="#tokens">The tokens it takes</a>
          </div>
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in band-in--tight">
        <div class="token-cloud" data-coin-cloud aria-hidden="true">
          <span class="coin-chip"><b>$</b><em>USDG</em></span>
          <span
            v-for="c in cloud"
            :key="c.sym"
            class="coin-chip"
            :style="{ left: `calc(50% + ${c.x}px)`, top: `calc(50% + ${c.y}px)`, '--dl': c.dl + 's' }"
          ><StockCoin :sym="c.sym" :size="c.size" /><em>{{ c.sym }}</em></span>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">How, in three steps</h2>
        </div>
        <div class="grid-3">
          <div class="panel stack">
            <span class="step-no">01</span>
            <h3>Deposit</h3>
            <p>Put stock tokens into the stock vault. They stay yours and stay in the vault, not in the pool.</p>
          </div>
          <div class="panel stack">
            <span class="step-no">02</span>
            <h3>Borrow</h3>
            <p>The vault backs a line worth 30% to 50% of the tokens' value when you open it, depending on the token, up to $500. Your agent borrows inside that line like any other.</p>
          </div>
          <div class="panel stack">
            <span class="step-no">03</span>
            <h3>Repay, take them back</h3>
            <p>Repay principal plus fee and withdraw your tokens. Every repayment also counts toward the agent's Nasyai Score.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="tokens" class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">The tokens it takes, live</h2>
        </div>
        <p class="lede" style="margin-bottom: clamp(16px, 2vw, 26px)">Prices read just now from each token's Chainlink feed on Robinhood Chain. The line column is what one token would open today, at that token's loan-to-value.</p>
        <div class="ledger-wrap">
          <div class="panel-head" style="padding: 10px 12px 0; border-bottom: 0">
            <span>16 stock tokens · Robinhood Chain</span>
            <span class="stamp" :class="feedState.cls" data-stocks-state>{{ feedState.text }}</span>
          </div>
          <table class="ledger">
            <thead><tr><th>Token</th><th class="num-right">Price</th><th class="num-right">LTV</th><th class="num-right">Line per token</th><th>Contract</th><th class="num-right">Feed updated</th></tr></thead>
            <tbody data-stocks>
              <tr v-for="s in STOCKS" :key="s.sym">
                <td>
                  <div class="cluster">
                    <StockCoin :sym="s.sym" :size="30" />
                    <span><b>{{ s.sym }}</b> <span class="quiet">{{ s.name }}</span></span>
                  </div>
                </td>
                <td class="num-right type-mon">{{ priceCell(s) }}</td>
                <td class="num-right type-mon">{{ s.ltv }}%</td>
                <td class="num-right type-mon">{{ lineCell(s) }}</td>
                <td class="type-mon">{{ shortAddr(s.token) }}</td>
                <td class="num-right quiet">{{ updatedCell(s) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in">
        <div class="grid-2">
          <article class="panel stack">
            <h2 class="display-sm">What it costs</h2>
            <ul class="keylist">
              <li>Fee <b>1% per 30 days, by the day</b></li>
              <li>Line <b>30% to 50% of value, by token</b></li>
              <li>Minimum loan <b>$5</b></li>
              <li>Withdraw tokens <b>after the last loan is repaid</b></li>
            </ul>
          </article>
          <article class="panel stack">
            <h2 class="display-sm">The risks, plainly</h2>
            <ul class="tick-list">
              <li><b>A default costs what you owe plus 20%,</b> taken from your tokens at the feed price.</li>
              <li><b>The line is fixed when it opens.</b> A falling price does not shrink it mid-loan, but the next line opens smaller.</li>
              <li><b>It is new, with no outside audit.</b> Deposit what you could live without.</li>
              <li><b>Markets close, feeds pause.</b> No line opens on a stale price.</li>
            </ul>
            <CrewNote id="warden"><p>Before you deposit, ask me what a default would take from your tokens at today's prices.</p></CrewNote>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
