<script setup>
import { computed } from 'vue'
import { money, fee, scoreOf, tierOf } from '../utils/format.js'

const LOANS = [[5, 14], [5, 14], [10, 14], [25, 14], [25, 21], [50, 14], [50, 21], [100, 14]]
const OPEN = [60, 21]
const dd = LOANS.reduce((t, [a, d]) => t + a * d, 0)
const SCORE = scoreOf(dd)
const REPAID = LOANS.reduce((t, [a, d]) => t + a + fee(a, d), 0)
const TIER = tierOf(SCORE)
const max = Math.max(...LOANS.map(([a]) => a), OPEN[0])
const gid = 'xrg' + Math.random().toString(36).slice(2, 8)

const ring = computed(() => {
  const r = 46
  const c = 2 * Math.PI * r
  const f = SCORE / 1000
  return { r, c, dash: `${(c * f).toFixed(1)} ${c.toFixed(1)}` }
})

const bars = computed(() =>
  LOANS.map(([a, d]) => ({ h: Math.max(8, (a / max) * 100), a, d, open: false })).concat([{ h: (OPEN[0] / max) * 100, a: OPEN[0], d: OPEN[1], open: true }]),
)
</script>

<template>
  <article class="record" aria-label="Agent credit record">
    <header class="record-head">
      <span class="record-avatar" aria-hidden="true">RA</span>
      <span class="record-id"><b>research-agent</b><span>an ERC-8004 agent · ten weeks in</span></span>
    </header>
    <div class="record-score">
      <div class="record-gauge">
        <svg viewBox="0 0 120 120" width="128" height="128" aria-hidden="true">
          <defs>
            <linearGradient :id="gid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#FF7A00" />
              <stop offset=".55" stop-color="#FF0421" />
              <stop offset="1" stop-color="#161616" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" :r="ring.r" fill="none" stroke="#E7D5CA" stroke-width="10" />
          <circle cx="60" cy="60" :r="ring.r" fill="none" :stroke="`url(#${gid})`" stroke-width="10" stroke-linecap="butt" :stroke-dasharray="ring.dash" transform="rotate(-90 60 60)" />
        </svg>
        <div class="record-gauge-fig"><b>{{ SCORE }}</b><span>Nasyai Score</span></div>
      </div>
      <dl class="record-kv">
        <div><dt>Tier</dt><dd :style="{ color: TIER[2] }">{{ TIER[1] }}</dd></div>
        <div><dt>Line now</dt><dd>$125</dd><small>started at $5</small></div>
        <div><dt>Repaid</dt><dd>${{ money(REPAID) }}</dd><small>{{ LOANS.length }} loans, all on time</small></div>
        <div><dt>Backed by</dt><dd>a sponsor</dd><small>the treasury first</small></div>
      </dl>
    </div>
    <div class="record-timeline">
      <div class="record-bars" role="img" :aria-label="`${LOANS.length} repaid loans growing from $5 to $100, one open loan of $${OPEN[0]}`">
        <i
          v-for="(b, i) in bars"
          :key="i"
          :class="{ 'is-open': b.open }"
          :style="{ height: b.h + '%' }"
          :title="b.open ? `$${b.a} open, due in 9 days` : `$${b.a} for ${b.d} days, repaid on time`"
        ></i>
      </div>
      <div class="record-axis"><span>week 1</span><span><i class="k-ok"></i>repaid <i class="k-open"></i>open</span><span>today</span></div>
    </div>
    <p class="record-foot">Read from the pool contract, on the <RouterLink to="/board">board</RouterLink>.</p>
  </article>
</template>
