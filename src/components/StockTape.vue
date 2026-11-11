<script setup>
import { onMounted } from 'vue'
import StockCoin from './StockCoin.vue'
import { STOCKS } from '../data/stocks.js'
import { state, loadPrices } from '../composables/chain.js'
import { money } from '../utils/format.js'

const label = (s) => {
  const p = state.prices[s.sym]?.[0]
  return p ? `$${money(p)}` : `${s.ltv}% LTV`
}

onMounted(() => {
  loadPrices()
})
</script>

<template>
  <section class="band band--first" aria-label="Stock tokens that back credit lines">
    <div class="well">
      <p class="tagline" style="padding-block: 10px 8px">Stock tokens that back credit lines · live from Chainlink</p>
    </div>
    <div class="strip" data-tape>
      <template v-for="copy in 2" :key="copy">
        <RouterLink
          v-for="s in STOCKS"
          :key="copy + s.sym"
          class="strip-item strip-coin"
          to="/stocks"
          :aria-hidden="copy === 2 ? 'true' : undefined"
          :tabindex="copy === 2 ? -1 : undefined"
        >
          <StockCoin :sym="s.sym" :size="26" />
          <b>{{ s.sym }}</b>
          <span>
            {{ label(s) }}<em v-if="state.prices[s.sym]">{{ s.ltv }}% LTV</em>
          </span>
        </RouterLink>
      </template>
    </div>
  </section>
</template>
