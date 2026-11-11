// Chats live in this tab only and are shared by the crew pane and the companion.
import { reactive } from 'vue'
import { IDS } from '../data/crew.js'
import { localAnswer } from '../data/brain.js'

const KEY = 'nasyai-crew'
const blank = () => Object.fromEntries(IDS.map((id) => [id, []]))
const okMsg = (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && typeof m.at === 'number'

function load() {
  try {
    const j = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (!j) return blank()
    return Object.fromEntries(IDS.map((id) => [id, Array.isArray(j[id]) ? j[id].filter(okMsg).slice(-30) : []]))
  } catch {
    return blank()
  }
}

export const chat = reactive({
  chats: load(),
  busy: {},
  errs: {},
  unread: {},
  meta: { tier: null, left: null },
  gate: { on: true, min: 10000, ticker: 'NASYAI' },
  online: true,
})

function persist() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(chat.chats))
  } catch {
    /* private mode */
  }
}

export const all = () => chat.chats

export function setChat(id, list) {
  chat.chats[id] = list.filter(okMsg).slice(-30)
  persist()
}

export function lastOf(id) {
  const l = chat.chats[id] || []
  return l[l.length - 1] || null
}

const plain = (t) =>
  String(t)
    .replace(/\*\*|`|^#+\s*/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 110)

export function preview(id) {
  if (chat.busy[id]) return id === 'room' ? 'Writing the report…' : 'Typing…'
  if (chat.errs[id]) return chat.errs[id]
  const m = lastOf(id)
  if (!m) return ''
  return (m.role === 'user' ? 'You: ' : chat.unread[id] ? 'New: ' : '') + plain(m.content)
}

export function clearChat(id) {
  chat.chats[id] = []
  delete chat.errs[id]
  chat.unread[id] = false
  persist()
}

export function markRead(id) {
  chat.unread[id] = false
}

export async function ask(id, text) {
  const q = String(text || '').trim().slice(0, 1500)
  if (!q || chat.busy[id] || !chat.online) return
  let report = null
  if (id === 'room') {
    const m = /^(?:(?:credit\s+)?report\s+(?:for\s+)?(?:on\s+)?)?(?:agent\s+)?#?\s*(\d{1,12})\s*$/i.exec(q)
    if (!m) {
      chat.errs[id] = "Give the room an agent's ERC-8004 id, a whole number like 12."
      return
    }
    report = m[1]
  } else {
    const m = /^(?:credit\s+)?report\s+(?:for\s+)?(?:agent\s+)?#?(\d{1,12})\b/i.exec(q)
    if (m) report = m[1]
  }
  delete chat.errs[id]
  const mine = {
    role: 'user',
    content: id === 'room' ? `Credit report for agent #${report}` : q,
    at: Date.now(),
    ...(report ? { report } : {}),
  }
  chat.chats[id].push(mine)
  chat.busy[id] = true
  persist()
  const wait = 650 + Math.random() * 900
  await new Promise((r) => setTimeout(r, wait))
  const out = localAnswer(id, report ? `agent ${report}` : q)
  chat.chats[id].push({
    role: 'assistant',
    content: out.answer,
    at: Date.now(),
    tools: out.tools || [],
    ...(out.report ? { report: out.report } : {}),
  })
  chat.meta.left = Math.max(0, (chat.meta.left ?? 5) - 1)
  chat.busy[id] = false
  chat.unread[id] = true
  persist()
}
