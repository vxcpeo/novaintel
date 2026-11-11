<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NASYAI } from '../config/nasyai.js'
import { wallet, connectWallet, showConnected, short } from '../composables/wallet.js'

const route = useRoute()
const sheetOpen = ref(false)

function toggle() {
  sheetOpen.value = !sheetOpen.value
}

async function onConnect() {
  if (wallet.account) showConnected()
  else await connectWallet()
}

const onKey = (e) => {
  if (e.key === 'Escape') sheetOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    sheetOpen.value = false
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="masthead" role="banner">
    <div class="well">
      <div class="masthead-row">
        <RouterLink class="masthead-id" to="/" aria-label="Nasyai home">
          <img class="masthead-mark" src="/img/brand/mark.svg" alt="" width="34" height="34">
          <span class="masthead-word">Nas<b>yai</b></span>
        </RouterLink>
        <div class="masthead-tools">
          <a v-if="NASYAI.links.x" class="icon-act" :href="NASYAI.links.x" target="_blank" rel="noopener" aria-label="Nasyai on X">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
            </svg>
          </a>
          <button class="act act--line act--sm" type="button" :class="{ 'act--solid': wallet.account, 'act--addr': wallet.account }" @click="onConnect">
            {{ wallet.account ? short(wallet.account) : 'Connect' }}
          </button>
          <RouterLink class="act act--ink act--sm" to="/start">Start</RouterLink>
          <button
            class="icon-act menu-toggle"
            type="button"
            aria-label="Menu"
            :aria-expanded="String(sheetOpen)"
            aria-controls="nav-sheet"
            @click="toggle"
          >
            <svg v-if="!sheetOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16" /></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
    </div>
    <nav class="nav-strip" aria-label="Main">
      <RouterLink to="/board" :class="{ 'is-current': route.path === '/board' }">Board</RouterLink>
      <RouterLink to="/crew" :class="{ 'is-current': route.path === '/crew' }">Crew</RouterLink>
      <RouterLink to="/agents" :class="{ 'is-current': route.path === '/agents' }">Agents</RouterLink>
      <RouterLink to="/seats" :class="{ 'is-current': route.path === '/seats' }">Seats</RouterLink>
      <RouterLink to="/participate" :class="{ 'is-current': route.path === '/participate' }">Participate</RouterLink>
      <RouterLink to="/stocks" :class="{ 'is-current': route.path === '/stocks' }">Stocks</RouterLink>
      <RouterLink to="/launches" :class="{ 'is-current': route.path === '/launches' }">Launches</RouterLink>
      <RouterLink to="/protocol" :class="{ 'is-current': route.path === '/protocol' }">Protocol</RouterLink>
      <a href="/skill.md">Skill</a>
      <RouterLink to="/desk" :class="{ 'is-current': route.path === '/desk' }">Desk</RouterLink>
      <RouterLink class="nav-token" to="/nasyai" :class="{ 'is-current': route.path === '/nasyai' }">$NASYAI</RouterLink>
    </nav>
    <nav id="nav-sheet" class="sheet" aria-label="Menu" :hidden="!sheetOpen">
      <div class="sheet-list">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/desk">Agent desk</RouterLink>
        <RouterLink to="/nasyai">$NASYAI · holders</RouterLink>
        <RouterLink to="/launches">Coin launches</RouterLink>
        <RouterLink to="/crew">The crew · Ask Nasyai</RouterLink>
        <RouterLink to="/board">Board</RouterLink>
        <RouterLink to="/agents">Agents</RouterLink>
        <RouterLink to="/seats">Seats</RouterLink>
        <RouterLink to="/participate">Participate</RouterLink>
        <RouterLink to="/stocks">Stocks</RouterLink>
        <RouterLink to="/protocol">Protocol</RouterLink>
        <RouterLink to="/use">Use a line</RouterLink>
        <a href="/skill.md">Agent skill</a>
        <RouterLink to="/log">Dev log</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink class="act act--solid" to="/start">Create an agent</RouterLink>
      </div>
    </nav>
  </div>
</template>
