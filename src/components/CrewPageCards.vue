<script setup>
import CrewFace from './CrewFace.js'
import { CREW, ROOM } from '../data/crew.js'
import { pickCrew } from '../stores/ui.js'

const members = [...CREW, ROOM]
</script>

<template>
  <article v-for="c in members" :key="c.id" class="crew-row">
    <CrewFace :id="c.id" :size="54" />
    <div class="crew-row-head">
      <h3>{{ c.name }}</h3>
      <span class="stamp">{{ c.role }}</span>
    </div>
    <p>{{ c.blurb }}</p>
    <button type="button" class="act act--line act--sm" @click="pickCrew(c.id)">{{ c.id === 'room' ? 'Ask for a report' : `Ask ${c.name}` }}</button>
  </article>
</template>
