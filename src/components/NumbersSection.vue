<script setup>
import { computed, onMounted } from 'vue'
import { state, loadStats } from '../composables/chain.js'
import { money, int, toUsd } from '../utils/format.js'

const s = computed(() => state.stats)

const since = computed(() => {
  const opened = Date.UTC(2026, 10, 8)
  const n = Math.max(1, Math.floor((Date.now() - opened) / 864e5) + 1)
  return `Day ${n} · the pool opened 8 Nov 2026`
})

const repaid = computed(() => (s.value ? money(toUsd(s.value.repaid)) : '—'))
const repayments = computed(() => (s.value ? int(s.value.repayments) : 0))
const loans = computed(() => (s.value ? int(s.value.loans) : '—'))
const lent = computed(() => (s.value ? money(toUsd(s.value.lent)) : 0))
const agents = computed(() => (s.value ? int(s.value.agents) : '—'))
const sponsors = computed(() => (s.value ? int(s.value.sponsors) : 0))
const defaults = computed(() => (s.value ? int(s.value.defaults) : 0))

onMounted(() => {
  loadStats()
})
</script>

<template>
  <section id="numbers" class="band">
    <div class="well band-in">
      <div class="band-head">
        <span class="statement-kicker" data-face="harbor">{{ since }}</span>
        <h2 class="display-lg" style="margin-inline-start: auto">The record in numbers</h2>
      </div>
      <p class="lede" style="margin-bottom: clamp(16px, 2vw, 26px)">Read straight from the pool contract. Short loans count here, but they add little to a score. Every number is Nasyai's own, live from its contract.</p>
      <div class="beats">
        <div class="beat">
          <div class="beat-cap">Repaid</div>
          <div class="beat-figure">$<span>{{ repaid }}</span></div>
          <div class="beat-note"><span>{{ repayments }}</span> repayments</div>
        </div>
        <div class="beat">
          <div class="beat-cap">Loans written</div>
          <div class="beat-figure beat-figure--violet">{{ loans }}</div>
          <div class="beat-note">$<span>{{ lent }}</span> lent out</div>
        </div>
        <div class="beat">
          <div class="beat-cap">Agents</div>
          <div class="beat-figure beat-figure--gold">{{ agents }}</div>
          <div class="beat-note"><span>{{ sponsors }}</span> sponsors · <span>{{ defaults }}</span> defaulted</div>
        </div>
        <div class="beat">
          <div class="beat-cap">Lost by lenders</div>
          <div class="beat-figure beat-figure--mint">$0</div>
          <div class="beat-note">Defaults are paid from the backer's stake</div>
        </div>
      </div>
    </div>
  </section>
</template>
