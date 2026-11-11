<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import CrewFace from './CrewFace.js'
import { BY, IDS, LIST, PINS } from '../data/crew.js'
import { chat, all, ask, clearChat, markRead, preview } from '../stores/crewChat.js'
import { wallet, connectWallet } from '../composables/wallet.js'
import { md, esc, TOOL_WORDS } from '../utils/markdown.js'

const props = defineProps({
  embed: { type: Boolean, default: false },
  useHash: { type: Boolean, default: false },
})

const rootEl = ref(null)
const logEl = ref(null)
const q = ref('')
const find = ref('')
const menu = ref(false)

const fromHash = () => {
  const h = location.hash.slice(1)
  return IDS.includes(h) ? h : null
}
const initialHash = props.useHash ? fromHash() : null
const active = ref(initialHash || 'nasyai')
const view = ref(initialHash ? 'chat' : 'list')

const messages = computed(() => chat.chats[active.value] || [])
const member = computed(() => BY[active.value])
const busy = computed(() => !!chat.busy[active.value])
const err = computed(() => chat.errs[active.value] || '')
const online = computed(() => chat.online)

const hits = computed(() => {
  const s = find.value.trim().toLowerCase()
  if (!s) return { pins: PINS, list: LIST }
  const hit = (id) => {
    const c = BY[id]
    return `${c.name} ${c.role} ${c.blurb} ${preview(id)}`.toLowerCase().includes(s)
  }
  return { pins: PINS.filter(hit), list: LIST.filter(hit) }
})

const hue = computed(() => {
  const a = wallet.account
  return a ? parseInt(a.slice(2, 6), 16) % 360 : 250
})

const sub = computed(() => {
  const h = wallet.account
  if (!online.value) return 'The crew switches on soon'
  if (!chat.gate.on) return `Open to everyone until $${chat.gate.ticker} launches`
  if (h) return `Guest · holders need ${Number(chat.gate.min).toLocaleString('en-US')} $${chat.gate.ticker}`
  return chat.meta.left != null ? `Guest · ${chat.meta.left} left today` : 'Guest · 5 questions a day'
})

const placeholder = computed(() => {
  if (!online.value) return 'The crew switches on soon'
  return active.value === 'room' ? "An agent's id, like 12" : `Message ${member.value.name}`
})

const suggestions = computed(() => {
  const c = member.value
  return c.suggest.map((s) => ({ raw: s, label: active.value === 'room' ? `Credit report · agent #${s}` : s }))
})

const menuItems = computed(() => {
  const items = suggestions.value.slice()
  if (active.value !== 'room') items.push({ raw: 'report 1', label: 'Credit report for agent #1' })
  return items
})

const clock = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
function dayDiff(d) {
  const a = new Date()
  a.setHours(0, 0, 0, 0)
  const b = new Date(d)
  b.setHours(0, 0, 0, 0)
  return Math.round((a - b) / 864e5)
}
function stamp(at) {
  const d = new Date(at)
  const k = dayDiff(d)
  const day = k === 0 ? 'Today' : k === 1 ? 'Yesterday' : k < 7 ? d.toLocaleDateString('en-US', { weekday: 'long' }) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${day} ${clock(d)}`
}
function shortTime(at) {
  const d = new Date(at)
  const k = dayDiff(d)
  return k === 0 ? clock(d) : k === 1 ? 'Yesterday' : k < 7 ? d.toLocaleDateString('en-US', { weekday: 'long' }) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
const previewText = (id) => preview(id) || BY[id].blurb
const bubbleMd = (t) => md(t)
const bubbleUser = (t) => esc(t).replace(/\n/g, '<br>')
const toolLine = (tools) => [...new Set((tools || []).map((t) => TOOL_WORDS[t] || t))].join(' · ')

function scrollLog() {
  nextTick(() => {
    if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
  })
}

function pick(id) {
  if (!IDS.includes(id)) return
  active.value = id
  chat.unread[id] = false
  markRead(id)
  view.value = 'chat'
  menu.value = false
  if (props.useHash) history.replaceState(null, '', `#${id}`)
  scrollLog()
  nextTick(() => {
    if (matchMedia('(pointer: fine)').matches) qEl.value?.focus({ preventScroll: true })
  })
  const t = rootEl.value?.getBoundingClientRect().top || 0
  if (narrow.value && (t < 0 || t > 140)) rootEl.value?.scrollIntoView({ block: 'start' })
}

function newChat() {
  if (busy.value) return
  clearChat(active.value)
  scrollLog()
}

function send() {
  const text = q.value
  if (!text.trim() || busy.value || !online.value) return
  q.value = ''
  grow()
  ask(active.value, text).then(scrollLog)
  menu.value = false
  scrollLog()
}

function askChip(raw) {
  menu.value = false
  ask(active.value, raw).then(scrollLog)
  scrollLog()
}

function grow() {
  nextTick(() => {
    const el = qEl.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
    el.style.overflowY = el.scrollHeight > 140 ? 'auto' : 'hidden'
  })
}

const qEl = ref(null)
const narrow = ref(false)
const ro = typeof ResizeObserver !== 'undefined'
  ? new ResizeObserver((entries) => {
      for (const e of entries) narrow.value = e.contentRect.width <= 700
    })
  : null

async function signIn() {
  await connectWallet()
}

const onCrewPick = (e) => {
  const id = e.detail?.id
  if (id) pick(id)
}

const onHash = () => {
  if (!props.useHash) return
  const h = fromHash()
  if (h && h !== active.value) pick(h)
}

let io = null

onMounted(() => {
  if (ro && rootEl.value) ro.observe(rootEl.value)
  window.addEventListener('nasyai:crew-pick', onCrewPick)
  window.addEventListener('hashchange', onHash)
  if (typeof IntersectionObserver !== 'undefined' && rootEl.value) {
    io = new IntersectionObserver(
      ([e]) => {
        document.documentElement.classList.toggle('crew-seen', e.isIntersecting)
      },
      { threshold: 0.15 },
    )
    io.observe(rootEl.value)
  }
  scrollLog()
  resetUnread()
})

onUnmounted(() => {
  window.removeEventListener('nasyai:crew-pick', onCrewPick)
  window.removeEventListener('hashchange', onHash)
  ro?.disconnect()
  io?.disconnect()
  document.documentElement.classList.remove('crew-seen')
})

function resetUnread() {
  if (view.value === 'chat' || !narrow.value) chat.unread[active.value] = false
}

watch(
  () => chat.chats[active.value]?.length,
  () => {
    scrollLog()
    resetUnread()
  },
)
watch(active, () => {
  scrollLog()
  grow()
  resetUnread()
})
watch(view, resetUnread)
</script>

<template>
  <div ref="rootEl" class="room-wrap" data-crew :data-crew-embed="embed ? '' : undefined">
    <div class="room-grid" :data-view="view">
      <div class="room-index" aria-label="Nasyai's crew">
        <div class="room-index-head">
          <span class="room-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span>Nasyai's crew</span>
        </div>
        <label class="room-search">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          <input v-model="find" type="search" placeholder="Search" aria-label="Search the crew" autocomplete="off" data-c-find>
        </label>
        <div class="room-scroll">
          <div class="room-pins" data-c-pins>
            <button
              v-for="id in hits.pins"
              :key="id"
              type="button"
              class="room-pin"
              :class="{ 'is-on': id === active }"
              :aria-current="id === active ? 'true' : 'false'"
              @click="pick(id)"
            >
              <CrewFace :id="id" :size="54" :think="!!chat.busy[id]" />
              <span>{{ BY[id].name }}</span>
              <i v-if="chat.unread[id]" class="room-dot" aria-label="new reply"></i>
            </button>
          </div>
          <p class="room-sec">Crew</p>
          <ul class="room-list" data-c-list>
            <li v-for="id in hits.list" :key="id">
              <button
                type="button"
                class="room-entry"
                :class="{ 'is-on': id === active }"
                :aria-current="id === active ? 'true' : 'false'"
                @click="pick(id)"
              >
                <CrewFace :id="id" :size="38" :think="!!chat.busy[id]" />
                <span class="room-entry-body">
                  <span class="room-entry-top">
                    <b>{{ BY[id].name }}</b>
                    <time>{{ chat.chats[id]?.length ? shortTime(chat.chats[id][chat.chats[id].length - 1].at) : '' }}</time>
                  </span>
                  <span class="room-entry-pre" :class="{ 'is-new': chat.unread[id] || chat.errs[id] }">{{ previewText(id) }}</span>
                </span>
                <i v-if="chat.unread[id]" class="room-dot" aria-label="new reply"></i>
              </button>
            </li>
          </ul>
          <p v-if="!hits.pins.length && !hits.list.length" class="room-none">No one by that name.</p>
        </div>
        <RouterLink class="room-board" to="/board">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></svg>
          <span>Agent board</span>
        </RouterLink>
        <div class="room-me" data-c-me>
          <span class="room-avatar" :style="{ '--h': hue }" aria-hidden="true">{{ wallet.account ? '' : '?' }}</span>
          <span class="room-me-text">
            <b>{{ wallet.account ? wallet.account.slice(0, 6) + '…' + wallet.account.slice(-4) : 'You' }}</b>
            <span>{{ sub }}</span>
          </span>
          <button v-if="!wallet.account" type="button" class="act act--line act--sm" @click="signIn">Sign in</button>
          <RouterLink v-else class="act act--line act--sm" to="/nasyai">Get $NASYAI</RouterLink>
        </div>
      </div>

      <div class="room-main" aria-label="Chat">
        <header class="room-head">
          <button class="room-icon" type="button" aria-label="Back to the crew" @click="view = 'list'">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <span class="room-head-face" data-c-face><CrewFace :id="active" :size="30" :think="busy" /></span>
          <div class="room-who"><b>{{ member.name }}</b><span>{{ member.role }}</span></div>
          <button class="room-icon" type="button" title="New chat" aria-label="New chat" @click="newChat">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12a8 8 0 1 1 2.3 5.6M4 20v-5h5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <RouterLink v-if="embed" class="room-icon" to="/crew" title="Open the full crew" aria-label="Open the full crew">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="12" rx="2" /><path d="M8.5 20.5h7M12 17v3.5" /></svg>
          </RouterLink>
        </header>

        <div ref="logEl" class="room-log" data-c-log aria-live="polite">
          <template v-if="!messages.length">
            <div class="room-hello">
              <CrewFace :id="active" :size="76" />
              <b class="room-hello-name">{{ member.name }}</b>
              <span class="room-hello-role">{{ member.role }}</span>
              <p class="room-hello-intro">{{ member.intro }}</p>
              <p v-if="!online" class="room-off">The crew is not connected to Grok yet. Everyone here answers as soon as it is.</p>
              <div class="ask-chips">
                <button
                  v-for="s in suggestions"
                  :key="s.raw"
                  type="button"
                  :disabled="!online"
                  @click="askChip(s.raw)"
                >{{ s.label }}</button>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-for="(m, i) in messages" :key="m.at + '-' + i">
              <p v-if="i === 0 || m.at - messages[i - 1].at > 30 * 60e3" class="room-stamp">{{ stamp(m.at) }}</p>
              <div v-if="m.role === 'user'" class="room-msg mine" v-html="bubbleUser(m.content)"></div>
              <div v-else-if="m.report" class="room-msg them room-report">
                <div class="room-report-head">
                  <CrewFace id="room" :size="20" />
                  <span>Credit report · agent #{{ m.report }}</span>
                </div>
                <div class="room-md" v-html="bubbleMd(m.content)"></div>
                <div v-if="m.tools?.length" class="room-tools">read: {{ toolLine(m.tools) }}</div>
              </div>
              <div v-else class="room-msg them">
                <div class="room-md" v-html="bubbleMd(m.content)"></div>
                <div v-if="m.tools?.length" class="room-tools">read: {{ toolLine(m.tools) }}</div>
              </div>
            </template>
          </template>
          <div v-if="busy" class="room-msg them room-wait">
            <span class="pulse-dots"><i></i><i></i><i></i></span>
            {{ active === 'room' ? 'Pulling the record…' : `${member.name} is reading the chain…` }}
          </div>
          <div v-if="err" class="room-msg err">
            {{ err }}
            <button v-if="!wallet.account" type="button" class="act act--line act--sm" @click="signIn">Sign in</button>
          </div>
        </div>

        <div v-if="menu" class="room-menu" data-c-menu>
          <p>Ask {{ member.name }}</p>
          <button v-for="s in menuItems" :key="s.raw" type="button" @click="askChip(s.raw)">{{ s.label }}</button>
        </div>

        <form class="room-form" data-c-form @submit.prevent="send">
          <button class="room-plus" type="button" aria-label="Suggested questions" :aria-expanded="String(menu)" :disabled="!online" @click="menu = !menu">+</button>
          <textarea ref="qEl" v-model="q" rows="1" maxlength="1500" :placeholder="placeholder" aria-label="Your message" :disabled="!online" @input="grow" @keydown.enter.exact.prevent="send"></textarea>
          <button class="room-send" type="submit" aria-label="Send" :disabled="!online || busy">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 19V6M6 11.5 12 5.5l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
