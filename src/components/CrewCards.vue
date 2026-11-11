<script setup>
import CrewFace from './CrewFace.js'
import { CREW } from '../data/crew.js'
import { openAsk } from '../stores/ui.js'

const SHAPES = { circle: 'circle', hex: 'hexagon', cloud: 'cloud', square: 'rounded square', flower: 'flower' }
const fillLabel = (c) => (c.fill === 'nasyai' ? 'nasyai gradient' : c.fill)
</script>

<template>
  <div v-for="c in CREW" :key="c.id" class="crew-cell">
    <CrewFace :id="c.id" :size="70" />
    <h3>{{ c.name }}</h3>
    <p>{{ c.role }}</p>
    <p class="crew-cell-meta">
      <span>{{ fillLabel(c) }}</span>
      <span>{{ SHAPES[c.shape] }}{{ c.rim ? ', nasyai rim' : '' }}</span>
    </p>
    <button type="button" class="act act--line act--sm" @click="openAsk(c.id)">Ask {{ c.name }}</button>
  </div>
</template>
