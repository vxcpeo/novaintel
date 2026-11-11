// Read-only Robinhood Chain access over JSON-RPC, no libraries. Tries each endpoint in
// turn. Only eth_call and eth_blockNumber; nothing here signs or sends.
import { reactive } from 'vue'
import { NASYAI } from '../config/nasyai.js'
import { STOCKS } from '../data/stocks.js'

const RPCS = NASYAI.chain.rpc
let id = 0
const MAX = 40
let queue = []
let timer = null

function rpc(method, params) {
  return new Promise((resolve, reject) => {
    queue.push({ method, params, resolve, reject })
    if (!timer) timer = setTimeout(flush, 8)
  })
}

async function flush() {
  const batch = queue.splice(0, MAX)
  timer = queue.length ? setTimeout(flush, 0) : null
  const body = batch.map((c) => ({ jsonrpc: '2.0', id: ++id, method: c.method, params: c.params }))
  let last
  for (const url of RPCS) {
    try {
      const ctl = new AbortController()
      const to = setTimeout(() => ctl.abort(), 9000)
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body.length === 1 ? body[0] : body),
        signal: ctl.signal,
      })
      clearTimeout(to)
      const j = await r.json()
      const got = new Map((Array.isArray(j) ? j : [j]).map((x) => [x && x.id, x]))
      if (body.some((b) => !got.has(b.id))) throw new Error(`rpc ${r.status}: incomplete answer`)
      body.forEach((b, i) => {
        const x = got.get(b.id)
        if (x.error) {
          const e = new Error(x.error.message || 'rpc error')
          e.data = x.error.data
          e.revert = true
          batch[i].reject(e)
        } else batch[i].resolve(x.result)
      })
      return
    } catch (e) {
      last = e
    }
  }
  batch.forEach((c) => c.reject(last || new Error('no rpc')))
}

const call = (to, data) => rpc('eth_call', [{ to, data }, 'latest'])
const word = (n) => BigInt(n).toString(16).padStart(64, '0')
const words = (hex) => {
  const h = hex.replace(/^0x/, '')
  const out = []
  for (let i = 0; i < h.length; i += 64) out.push(h.slice(i, i + 64))
  return out
}
const u = (w) => BigInt('0x' + w)
const int256 = (w) => {
  let v = BigInt('0x' + w)
  if (v >> 255n) v -= 1n << 256n
  return v
}
const addr = (w) => '0x' + w.slice(24)
const usd = (b) => Number(b) / 1e6

const pool = NASYAI.contracts.pool
const SEL = { stats: '0xd80528ae', loanCount: '0xce63094d', getLoan: '0x504006ca', getAgent: '0x2de5aaf7' }

export async function stats() {
  const w = words(await call(pool, SEL.stats))
  return {
    loans: u(w[0]), lent: u(w[1]), repayments: u(w[2]), repaid: u(w[3]),
    defaults: u(w[4]), agents: u(w[6]), sponsors: u(w[7]),
  }
}

export async function loanCount() {
  return Number(u(words(await call(pool, SEL.loanCount))[0]))
}

export async function loan(lid) {
  const w = words(await call(pool, SEL.getLoan + word(lid)))
  return {
    id: lid, agentId: Number(u(w[0])), sponsor: addr(w[1]), principal: u(w[3]), fee: u(w[4]),
    issuedAt: Number(u(w[7])), dueAt: Number(u(w[8])), closedAt: Number(u(w[10])), status: Number(u(w[11])),
  }
}

export async function agent(aid) {
  const w = words(await call(pool, SEL.getAgent + word(aid)))
  return {
    id: aid, sponsor: addr(w[0]), line: u(w[1]), principalOut: u(w[2]), activeLoans: u(w[3]),
    loansRepaid: u(w[4]), volumeRepaid: u(w[5]), qualified: u(w[7]), wdd: u(w[8]),
    defaults: u(w[9]), enrolled: u(w[13]) === 1n,
  }
}

export async function feedPrice(feed, decimals = 8) {
  const w = words(await call(feed, '0xfeaf968c'))
  return { price: Number(int256(w[1])) / 10 ** decimals, updatedAt: Number(u(w[3])) }
}

export function score(a) {
  let s = Math.min(1000, 140 * Math.log(1 + usd(a.wdd) / 100))
  if (a.defaults > 0n) s = Math.min(600, s - 150 * Number(a.defaults))
  return Math.max(0, Math.round(s))
}

export const state = reactive({
  stats: null,
  loans: [],
  prices: {},
  pricesAt: 0,
  loansAt: 0,
  failed: false,
})

function parseCached() {
  try {
    const c = JSON.parse(sessionStorage.getItem('nasyai-px') || 'null')
    if (c && Date.now() - c.at < 180e3) {
      state.prices = c.p
      state.pricesAt = c.at
    }
  } catch {
    /* private mode */
  }
}
parseCached()

export async function loadStats(n = 8) {
  if (!pool) return null
  try {
    const s = await stats()
    state.stats = s
    const count = Number(s.loans)
    if (count > 0) {
      const ids = []
      for (let i = count; i >= 1 && ids.length < n; i--) ids.push(i)
      const ls = await Promise.all(ids.map((i) => loan(i).catch(() => null)))
      state.loans = ls.filter(Boolean).sort(
        (a, b) => (b.closedAt || b.issuedAt) - (a.closedAt || a.issuedAt) || b.id - a.id,
      )
    } else {
      state.loans = []
    }
    return s
  } catch {
    state.failed = true
    return null
  }
}

export async function loadPrices() {
  if (Date.now() - state.pricesAt < 180e3 && Object.keys(state.prices).length) return state.prices
  const p = {}
  await Promise.all(
    STOCKS.map(async (s) => {
      try {
        const f = await feedPrice(s.feed)
        p[s.sym] = [f.price, f.updatedAt]
      } catch {
        /* that feed stays empty */
      }
    }),
  )
  if (Object.keys(p).length) {
    state.prices = p
    state.pricesAt = Date.now()
    try {
      sessionStorage.setItem('nasyai-px', JSON.stringify({ at: Date.now(), p }))
    } catch {
      /* private mode */
    }
  }
  return p
}

export { usd, word, words, addr, usd as toUsd }
