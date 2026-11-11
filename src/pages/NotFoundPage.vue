<script setup>
import CrewFace from '../components/CrewFace.js'
import { openAsk } from '../stores/ui.js'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement" style="min-height: 58svh; align-content: center">
          <span><CrewFace id="pilot" :size="150" /></span>
          <p class="statement-kicker">404</p>
          <h1 class="statement-title mega">Nothing at these coordinates.</h1>
          <p class="statement-lede">The page you were looking for collapsed, or never formed.</p>
          <div class="statement-actions">
            <RouterLink class="act act--solid" to="/">Back home</RouterLink>
            <RouterLink class="link link--plain" to="/board">The board</RouterLink>
            <button class="act act--line" type="button" @click="openAsk('pilot')">Ask Pilot the way</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
