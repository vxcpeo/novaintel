<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CrewFace from './CrewFace.js'
import { BY, IDS } from '../data/crew.js'
import { chat, ask, clearChat, markRead } from '../stores/crewChat.js'
import { closeAsk, openAsk, ui } from '../stores/ui.js'
import { wallet, connectWallet } from '../composables/wallet.js'
import { md, esc, TOOL_WORDS } from '../utils/markdown.js'

const props = defineProps({
  host: { type: String, default: 'nasyai' },
  say: { type: String, default: '' },
  asks: { type: Array, default: () => [] },
})

const route = useRoute()
const hostMember = computed(() => BY[props.host] || BY.nasyai)
const who = ref(props.host)
const member = computed(() => BY[who.value])
const messages = computed(() => chat.chats[who.value] || [])
const busy = computed(() => !!chat.busy[who.value])
const err = computed(() => chat.errs[who.value] || '')
const online = computed(() => chat.online)
const q = ref('')
const qEl = ref(null)
const logEl = ref(null)
const note = ref(false)
const dot = ref(false)
const hopped = ref(false)
let noteTimer = 0
let hopTimer = 0
let talkTimer = 0

const seenKey = 'nasyai-buddy-hi'
function seen() {
  try {
    return JSON.parse(sessionStorage.getItem(seenKey) || '[]')
  } catch {
    return []
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(seenKey, JSON.stringify([...new Set([...seen(), route.path])].slice(-40)))
  } catch {
    /* private mode */
  }
}

const greet = computed(() => {
  const agent = route.path === '/board' ? new URLSearchParams(route.query).get('agent') : null
  const qs = route.query.ask
  const list = [...(agent && /^\d{1,12}$/.test(agent) ? [`report ${agent}`] : []), ...(props.asks.length ? props.asks : hostMember.value.suggest)]
  return list.slice(0, 3)
})

const label = (s) => {
  const m = /^report (\d+)$/.exec(s)
  return m ? `Credit report for agent #${m[1]}` : s
}

const placeholder = computed(() => {
  if (!online.value) return 'The crew switches on soon'
  return who.value === 'room' ? "An agent's id, like 12" : `Message ${member.value.name}`
})

const tier = computed(() => {
  if (!online.value) return { tag: 'Soon', text: 'The crew is not connected to Grok yet. Everyone here answers as soon as it is.' }
  if (!chat.gate.on) return { tag: 'Open', text: `Everyone asks freely until $${chat.gate.ticker} launches; then holders of ${Number(chat.gate.min).toLocaleString('en-US')} get 60 a day and credit reports.` }
  if (wallet.account) return { tag: 'Guest', text: `This wallet holds 0 $${chat.gate.ticker}; holders need ${Number(chat.gate.min).toLocaleString('en-US')}.` }
  return { tag: 'Guest', text: `${chat.meta.left != null ? chat.meta.left + ' left today' : '5 questions a day'}. Hold ${Number(chat.gate.min).toLocaleString('en-US')} $${chat.gate.ticker}?` }
})

const helloAsks = computed(() => {
  const c = member.value
  const asks = who.value === props.host ? greet.value : c.suggest.map((s) => (who.value === 'room' ? `report ${s}` : s))
  return asks.map((s) => ({ raw: s, label: label(s) }))
})

const toolLine = (tools) => [...new Set((tools || []).map((t) => TOOL_WORDS[t] || t))].join(' · ')
const bubbleUser = (t) => esc(t).replace(/\n/g, '<br>')
const bubbleMd = (t) => md(t)

function scrollLog() {
  nextTick(() => {
    if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
  })
}

function grow() {
  nextTick(() => {
    const el = qEl.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden'
  })
}

function hop() {
  hopped.value = false
  clearTimeout(hopTimer)
  requestAnimationFrame(() => {
    hopped.value = true
    hopTimer = setTimeout(() => (hopped.value = false), 800)
  })
}

function hush(remember = true) {
  clearTimeout(noteTimer)
  note.value = false
  if (remember) markSeen()
}

function talk() {
  if (ui.askOpen || document.documentElement.classList.contains('crew-seen')) return
  note.value = true
  markSeen()
  hop()
  const later = () => {
    clearTimeout(noteTimer)
    noteTimer = setTimeout(() => {
      const label = document.querySelector('.launcher')
      if (label && label.matches(':hover, :focus-within')) later()
      else hush()
    }, innerWidth <= 560 ? 9000 : 14000)
  }
  later()
}

function openPanel(id, question = null) {
  who.value = IDS.includes(id) ? id : props.host
  hush(false)
  ui.askId = who.value
  ui.askOpen = true
  document.documentElement.classList.add('ask-open')
  dot.value = false
  scrollLog()
  nextTick(() => {
    if (matchMedia('(pointer: fine)').matches && online.value) qEl.value?.focus()
  })
  if (question) {
    ask(who.value, question)
  }
}

function close() {
  closeAsk()
  document.documentElement.classList.remove('ask-open')
  scrollLog()
}

function send() {
  const text = q.value
  if (!text.trim() || busy.value || !online.value) return
  q.value = ''
  grow()
  ask(who.value, text)
  scrollLog()
}

function chip(raw) {
  if (/^report \d+$/.test(raw)) who.value = 'room'
  ask(who.value, raw)
  scrollLog()
}

function pick(id) {
  who.value = id
  chat.unread[id] = false
  markRead(id)
  scrollLog()
  nextTick(() => {
    if (matchMedia('(pointer: fine)').matches && online.value) qEl.value?.focus()
  })
}

function newChat() {
  if (busy.value) return
  clearChat(who.value)
  scrollLog()
}

async function signIn() {
  await connectWallet()
}

function onBuddyClick(e) {
  if (e.target.closest('[data-b-hush]')) return hush()
  const a = e.target.closest('[data-b-ask]')
  if (!a) return openPanel(props.host)
  const raw = a.dataset.bAsk
  if (/^report \d+$/.test(raw)) {
    openPanel('room')
    ask('room', raw)
  } else {
    openPanel(props.host)
    ask(props.host, raw)
  }
}

function onKey(e) {
  if (e.key === 'Escape' && ui.askOpen) close()
}

watch(
  () => chat.chats[who.value]?.length,
  () => {
    scrollLog()
    if (ui.askOpen) {
      chat.unread[who.value] = false
      dot.value = false
    } else {
      dot.value = true
    }
  },
)

watch(who, () => {
  scrollLog()
  grow()
  if (ui.askOpen) chat.unread[who.value] = false
})

watch(
  () => ui.askOpen,
  (v) => {
    if (!v) {
      document.documentElement.classList.remove('ask-open')
    }
  },
)

watch(
  () => ui.askNonce,
  () => {
    if (ui.askOpen) openPanel(ui.askId, ui.askQuestion)
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (!seen().includes(route.path) && !new URLSearchParams(location.search).has('ask')) {
    talkTimer = setTimeout(talk, 1600)
  }
  if (new URLSearchParams(location.search).get('ask') === '1') openPanel(props.host)
  scrollLog()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(noteTimer)
  clearTimeout(hopTimer)
  clearTimeout(talkTimer)
  document.documentElement.classList.remove('ask-open')
  closeAsk()
})
</script>

<template>
  <div class="launcher-dock" :class="{ 'is-hop': hopped }" :hidden="ui.askOpen" @click="onBuddyClick">
    <div v-if="note" class="dock-note" data-b-say>
      <button type="button" class="dock-hide" aria-label="Hide Nasyai's note" data-b-hush>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </button>
      <p><b>{{ hostMember.name }}</b>{{ say }}</p>
      <div class="dock-chips">
        <button v-for="s in greet" :key="s" type="button" :data-b-ask="s" @click="onBuddyClick">{{ label(s) }}</button>
      </div>
    </div>
    <button type="button" class="launcher" aria-haspopup="dialog" :aria-label="`Chat with ${hostMember.name}, ${hostMember.role}`">
      <span class="launcher-tag">Ask {{ hostMember.name }}</span>
      <span class="launcher-face" :class="{ 'is-think': busy }" data-b-bod><CrewFace :id="hostMember.id" :size="56" /></span>
      <i v-if="dot" class="launcher-dot" data-b-dot></i>
    </button>
  </div>

  <section v-show="ui.askOpen" class="chatpanel" role="dialog" aria-label="Nasyai's crew">
    <div class="chatpanel-head">
      <span class="chatpanel-face" data-b-face><CrewFace :id="who" :size="34" :think="busy" /></span>
      <div class="chatpanel-title">
        <b>{{ member.name }}</b>
        <span>{{ member.id === 'room' ? member.role : member.role + ' · reads the chain' }}</span>
      </div>
      <button type="button" class="chatpanel-btn" title="New chat" aria-label="New chat" @click="newChat">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12a8 8 0 1 1 2.3 5.6M4 20v-5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <button type="button" class="chatpanel-btn" title="Close" aria-label="Close" @click="close">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </button>
    </div>
    <div class="chatpanel-crew" role="group" aria-label="Who you talk to">
      <button
        v-for="id in IDS"
        :key="id"
        type="button"
        class="chatpanel-member"
        :class="{ 'is-on': id === who }"
        :aria-pressed="id === who"
        :title="`${BY[id].name} · ${BY[id].role}`"
        :aria-label="`${BY[id].name}, ${BY[id].role}`"
        @click="pick(id)"
      >
        <CrewFace :id="id" :size="26" :think="!!chat.busy[id]" />
      </button>
    </div>
    <div class="chatpanel-tier" data-ask-tier>
      <span class="stamp" :class="online ? (wallet.account ? 'stamp--warn' : 'stamp--warn') : 'stamp--warn'">{{ tier.tag }}</span>
      <span>{{ tier.text }}</span>
      <button v-if="!wallet.account" type="button" class="act act--line act--sm" data-ask-signin @click="signIn">Sign in</button>
      <RouterLink v-else class="link link--plain" to="/nasyai">Get ${{ chat.gate.ticker }}</RouterLink>
    </div>
    <div ref="logEl" class="chatpanel-log" data-ask-log aria-live="polite">
      <template v-if="!messages.length">
        <div class="chatpanel-hello">
          <CrewFace :id="who" :size="58" />
          <b>{{ member.name }}</b>
          <span>{{ member.role }}</span>
          <p>{{ member.intro }}</p>
          <div class="ask-chips">
            <button
              v-for="s in helloAsks"
              :key="s.raw"
              type="button"
              :disabled="!online"
              @click="chip(s.raw)"
            >{{ s.label }}</button>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="(m, i) in messages" :key="m.at + '-' + i">
          <div v-if="m.role === 'user'" class="chatpanel-msg me" v-html="bubbleUser(m.content)"></div>
          <div v-else class="chatpanel-msg crew" :class="{ 'is-report': m.report }">
            <span class="chatpanel-avatar"><CrewFace :id="m.report ? 'room' : who" :size="24" /></span>
            <div class="chatpanel-body">
              <div v-if="m.report" class="chatpanel-rhd">Credit report · agent #{{ m.report }}</div>
              <div class="chatpanel-md" v-html="bubbleMd(m.content)"></div>
              <div v-if="m.tools?.length" class="chatpanel-tools">read: {{ toolLine(m.tools) }}</div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="busy" class="chatpanel-msg crew chatpanel-wait">
        <span class="chatpanel-avatar"><CrewFace :id="who" :size="24" :think="true" /></span>
        <span class="pulse-dots"><i></i><i></i><i></i></span>
        {{ who === 'room' ? 'Pulling the record…' : `${member.name} is reading the chain…` }}
      </div>
      <div v-if="err" class="chatpanel-msg crew chatpanel-err">{{ err }}</div>
    </div>
    <form class="chatpanel-form" data-ask-form @submit.prevent="send">
      <textarea ref="qEl" v-model="q" rows="1" maxlength="1500" :placeholder="placeholder" aria-label="Your message" :disabled="!online" @input="grow" @keydown.enter.exact.prevent="send"></textarea>
      <button type="submit" class="chatpanel-send" aria-label="Send" :disabled="!online || busy">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 19V6M6 11.5 12 5.5l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </form>
    <p class="chatpanel-foot">Grok by xAI. The crew reads, never signs. Answers can be wrong and are not financial advice; the contracts are the source of truth.</p>
  </section>
</template>
