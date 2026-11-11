<script setup>
import { computed } from 'vue'
import CrewFace from './CrewFace.js'
import { BY } from '../data/crew.js'
import { openAsk } from '../stores/ui.js'

const props = defineProps({ id: { type: String, required: true } })
const member = computed(() => BY[props.id] || BY.nasyai)
</script>

<template>
  <div class="note-line">
    <span class="note-portrait"><CrewFace :id="member.id" :size="44" /></span>
    <div class="note-body">
      <b class="note-name">{{ member.name }}<span>{{ member.role }}</span></b>
      <slot />
      <button type="button" class="act act--line act--sm" @click="openAsk(member.id)">Ask {{ member.name }}</button>
    </div>
  </div>
</template>
