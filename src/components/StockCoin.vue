<script setup>
import { computed } from 'vue'
import { STOCK_BY } from '../data/stocks.js'

const props = defineProps({
  sym: { type: String, required: true },
  size: { type: Number, default: 28 },
})
const s = computed(() => STOCK_BY[props.sym] || STOCK_BY.SPY)
</script>

<template>
  <span class="stock-coin" :style="{ blockSize: size + 'px', inlineSize: size + 'px' }">
    <img :src="`/img/stocks/${s.sym}.png`" alt="" :width="size" :height="size" loading="lazy" decoding="async">
  </span>
</template>
