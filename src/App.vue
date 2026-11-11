<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import StageHeader from './components/StageHeader.vue'
import StageFooter from './components/StageFooter.vue'
import ToastHost from './components/ToastHost.vue'
import WalletSheet from './components/WalletSheet.vue'
import NasyaiBuddy from './components/NasyaiBuddy.vue'
import { useEyes } from './composables/eyes.js'

const route = useRoute()
useEyes()

const asks = computed(() => {
  const raw = route.meta?.hostAsk || ''
  return raw.split('|').map((s) => s.trim()).filter(Boolean)
})

// The live site's crew answers everywhere; its API check leaves this class on every page.
onMounted(() => document.documentElement.classList.add('ask-on'))
watch(
  () => route.fullPath,
  () => document.documentElement.classList.add('ask-on'),
)
</script>

<template>
  <div class="shell">
    <a class="jump" href="#main">Skip to content</a>
    <StageHeader />
    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="route.fullPath" />
    </RouterView>
    <StageFooter />
  </div>
  <ToastHost />
  <WalletSheet />
  <NasyaiBuddy
    v-if="route.meta.host"
    :key="'buddy-' + route.fullPath"
    :host="route.meta.host"
    :say="route.meta.hostSay || ''"
    :asks="asks"
  />
</template>
