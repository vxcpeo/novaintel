<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CrewFace from './CrewFace.js'
import { BY } from '../data/crew.js'
import { openAsk } from '../stores/ui.js'

const route = useRoute()
const props = defineProps({ id: { type: String, default: '' } })
const member = computed(() => BY[props.id || route.meta.host] || BY.nasyai)
</script>

<template>
  <div class="guide-line">
    <button type="button" class="guide-portrait" :aria-label="`Ask ${member.name}`" @click="openAsk(member.id)">
      <CrewFace :id="member.id" :size="44" />
    </button>
    <p class="guide-copy"><b>{{ member.name }}</b> <span>{{ member.role }} · your guide on this page</span><br>{{ member.blurb }}</p>
    <button type="button" class="act act--line act--sm" @click="openAsk(member.id)">Ask {{ member.name }}</button>
  </div>
</template>
