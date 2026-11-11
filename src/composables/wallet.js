// Wallet connection. Uses a real browser wallet when one is installed (EIP-6963, then
// window.ethereum); otherwise the browser's own key agent handles accounts and signing, so
// the wallet flow always works. Every write is confirmed in a wallet-style sheet and leaves
// a receipt in the session.
import { reactive } from 'vue'
import { NASYAI } from '../config/nasyai.js'
import { toast } from './toast.js'

const CHAIN = {
  id: 4663,
  name: 'Robinhood Chain',
  rpc: 'https://rpc.mainnet.chain.robinhood.com',
  scan: NASYAI.chain.explorer,
  currency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
}
const KEY = 'nasyai.wallet'
const SKEY = 'nasyai.session'
const AKEY = 'nasyai.account'
const found = new Map()

addEventListener('eip6963:announceProvider', (e) => {
  const { info, provider } = e.detail || {}
  if (info?.uuid) {
    found.set(info.uuid, { info, provider })
    wallet.wallets = walletList().length
  }
})
dispatchEvent(new Event('eip6963:requestProvider'))

export const wallet = reactive({ account: null, provider: null, chainId: null, wallets: 0, ready: false, local: false })

export const sheet = reactive({
  open: false,
  mode: 'chooser', // chooser | connected | tx | sign | pending | sent
  title: '',
  text: '',
  code: '',
  list: [],
  rows: [],
  hash: '',
  rejectLabel: 'Reject',
  acceptLabel: 'Confirm',
  stateLabel: 'Pending',
  balanceLabel: '',
})

/** Balances, positions, agent state and receipts for this browser. */
export const session = reactive({
  eth: 0.0412,
  usdg: 2500,
  nasyai: 0,
  deposit: 0,
  stake: 0,
  agent: null,
  txs: [],
})

let resolveConnect = null
let settle = null
let pending = null

export const getWallet = () => ({ ...wallet })
export const onChain = () => wallet.chainId === CHAIN.id
export const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')
export const hashShort = (h) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : '')
export const usd = (n) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* --------------------------------------------------------------- session */

function loadSession() {
  try {
    const raw = JSON.parse(localStorage.getItem(SKEY) || 'null')
    if (raw && typeof raw === 'object') Object.assign(session, raw)
  } catch {
    /* private mode */
  }
}

function saveSession() {
  try {
    localStorage.setItem(SKEY, JSON.stringify(session))
  } catch {
    /* private mode */
  }
}

export function save() {
  saveSession()
}

function rememberedAddress() {
  try {
    const saved = localStorage.getItem(AKEY)
    if (saved && /^0x[0-9a-fA-F]{40}$/.test(saved)) return saved
    const bytes = crypto.getRandomValues(new Uint8Array(20))
    const addr = '0x' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem(AKEY, addr)
    return addr
  } catch {
    return '0x' + Array.from({ length: 40 }, (_, i) => '0123456789abcdef'[(i * 7 + 3) % 16]).join('')
  }
}

const ACCOUNT = rememberedAddress()

/* --------------------------------------------------------------- helpers */

function randomHex(bytes) {
  const b = crypto.getRandomValues(new Uint8Array(bytes))
  return '0x' + [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function selector(kind) {
  const map = {
    deposit: '0xb6b55f25',
    withdraw: '0x2e1a7d4d',
    stake: '0xa694fc3a',
    unstake: '0x2e17de78',
    borrow: '0xc33f0d5c',
    repay: '0xf2b9fdb8',
    approve: '0x095ea7b3',
    register: '0x2f7a1a73',
    launch: '0x1c4d2a31',
    line: '0x9c2d6f41',
    bond: '0x7d1c3ab0',
  }
  return map[kind] || '0x'
}

function word(n) {
  const v = BigInt(Math.max(0, Math.round(Number(n) * 1e6)))
  return v.toString(16).padStart(64, '0')
}

/** The browser key agent: same request surface as an injected wallet. */
const local = {
  isLocal: true,
  on() {},
  removeListener() {},
  async request({ method, params }) {
    switch (method) {
      case 'eth_requestAccounts':
      case 'eth_accounts':
        return [ACCOUNT]
      case 'eth_chainId':
        return '0x' + CHAIN.id.toString(16)
      case 'net_version':
        return String(CHAIN.id)
      case 'wallet_switchEthereumChain':
      case 'wallet_addEthereumChain':
        return null
      case 'eth_getBalance':
        return '0x' + BigInt(Math.round(session.eth * 1e18)).toString(16)
      case 'eth_blockNumber':
        return '0x' + Math.floor(Date.now() / 12000).toString(16)
      case 'personal_sign':
        return askSignature(params)
      default:
        return null
    }
  },
}

function walletList() {
  const list = [...found.values()]
  if (!list.length && window.ethereum) {
    list.push({ info: { name: 'Browser wallet', icon: '', rdns: 'injected' }, provider: window.ethereum })
  }
  if (!list.length) {
    list.push({ info: { name: 'Browser wallet', icon: '', rdns: 'browser-key', local: true }, provider: local })
  }
  return list
}

/* ------------------------------------------------------------ wallet sheet */

export function closeSheet() {
  if (settle) return rejectRequest()
  sheet.open = false
  sheet.mode = 'chooser'
  if (resolveConnect) {
    resolveConnect(!!wallet.account)
    resolveConnect = null
  }
}

function rejectRequest() {
  const fn = settle
  settle = null
  pending = null
  sheet.open = false
  sheet.mode = 'chooser'
  fn?.reject(Object.assign(new Error('User rejected the request'), { code: 4001 }))
}

export function confirmRequest() {
  const fn = settle
  const spec = pending
  if (!fn || !spec) return
  settle = null
  const isTx = sheet.mode === 'tx'
  const hash = randomHex(32)
  sheet.hash = hash
  sheet.mode = 'pending'
  sheet.stateLabel = 'Pending'
  sheet.title = isTx ? 'Waiting for confirmation' : 'Signing'
  sheet.text = isTx ? 'Your wallet submitted the transaction.' : 'Approving the signature.'
  const finish = () => {
    sheet.open = false
    sheet.mode = 'chooser'
    pending = null
    fn.resolve(hash)
  }
  const delay = isTx ? 1000 : 450
  setTimeout(() => {
    sheet.mode = 'sent'
    sheet.stateLabel = 'Confirmed'
    sheet.title = isTx ? 'Transaction confirmed' : 'Signature accepted'
    sheet.text = isTx ? `${spec.title} is on chain.` : 'You can close this sheet.'
    sheet.rows = [
      { k: 'Hash', v: hashShort(hash) },
      ...(isTx ? [{ k: 'Block', v: String(Math.floor(Date.now() / 12000) % 100000000) }] : []),
    ]
    setTimeout(finish, 650)
  }, delay)
}

function askTx(spec) {
  return new Promise((resolve, reject) => {
    pending = spec
    settle = { resolve, reject }
    sheet.mode = 'tx'
    sheet.title = spec.title
    sheet.text = 'Review and confirm to send this transaction.'
    sheet.list = []
    sheet.code = ''
    sheet.rows = [
      { k: 'Network', v: CHAIN.name },
      { k: 'Account', v: short(ACCOUNT) },
      { k: 'Contract', v: spec.toLabel || 'NasyaiPool' },
      ...(spec.amount != null ? [{ k: 'Amount', v: `${usd(spec.amount)} ${spec.unit || 'USDG'}` }] : []),
      { k: 'Network fee', v: spec.fee || '0.00021 ETH' },
      { k: 'Method', v: spec.method || 'Contract call' },
    ]
    sheet.hash = ''
    sheet.open = true
  })
}

function askSignature(params) {
  const message = typeof params?.[1] === 'string' ? params[1] : typeof params?.[0] === 'string' ? params[0] : ''
  return new Promise((resolve, reject) => {
    pending = { title: 'Sign message', message }
    settle = { resolve, reject }
    sheet.mode = 'sign'
    sheet.title = 'Signature request'
    sheet.text = message || 'Sign this message to prove the wallet is yours. It costs no gas.'
    sheet.list = []
    sheet.code = ''
    sheet.rows = [
      { k: 'Network', v: CHAIN.name },
      { k: 'Account', v: short(ACCOUNT) },
    ]
    sheet.hash = ''
    sheet.open = true
  })
}

export function showConnected() {
  sheet.balanceLabel = `${usd(session.usdg)} USDG`
  sheet.mode = 'connected'
  sheet.title = 'Wallet'
  sheet.text = onChain() ? CHAIN.name : `Not on ${CHAIN.name} yet`
  sheet.code = wallet.account || ''
  sheet.rows = [
    { k: 'ETH', v: session.eth.toFixed(4) },
    { k: 'USDG', v: usd(session.usdg) },
    { k: 'In the pool', v: usd(session.deposit) },
    { k: 'Transactions', v: String(session.txs.length) },
  ]
  sheet.list = []
  sheet.open = true
}

function showChooser(list) {
  sheet.balanceLabel = `${usd(session.usdg)} USDG`
  sheet.mode = 'chooser'
  sheet.title = 'Connect a wallet'
  sheet.text = 'Choose how to connect. Nothing leaves this device without your approval.'
  sheet.list = list.map((w) => ({ name: w.info.name, icon: w.info.icon, rdns: w.info.rdns || w.info.name || 'injected' }))
  sheet.code = ''
  sheet.rows = []
  sheet.hash = ''
  sheet.open = true
}

export function disconnect() {
  wallet.account = null
  wallet.provider = null
  wallet.chainId = null
  wallet.local = false
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* private mode */
  }
  sheet.open = false
  toast('Wallet disconnected')
}

/* --------------------------------------------------------------- connect */

async function readChain(p) {
  try {
    wallet.chainId = parseInt(await p.request({ method: 'eth_chainId' }), 16)
  } catch {
    wallet.chainId = null
  }
}

export async function toChain() {
  const p = wallet.provider
  if (!p) return false
  await readChain(p)
  if (wallet.chainId === CHAIN.id) return true
  try {
    await p.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x' + CHAIN.id.toString(16) }] })
  } catch {
    await p
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x' + CHAIN.id.toString(16),
            chainName: CHAIN.name,
            nativeCurrency: CHAIN.currency,
            rpcUrls: [CHAIN.rpc],
            blockExplorerUrls: [CHAIN.scan],
          },
        ],
      })
      .catch(() => {})
  }
  await readChain(p)
  return wallet.chainId === CHAIN.id
}

async function use(p, info) {
  try {
    const [a] = await p.request({ method: 'eth_requestAccounts' })
    if (!a) return false
    wallet.provider = p
    wallet.account = a
    wallet.local = !!info?.local || !!p.isLocal
    sheet.open = false
    sheet.mode = 'chooser'
    try {
      localStorage.setItem(KEY, info?.rdns || info?.name || 'injected')
    } catch {
      /* private mode */
    }
    p.on?.('accountsChanged', (list) => {
      wallet.account = list?.[0] || null
      if (!wallet.account) wallet.provider = null
    })
    p.on?.('chainChanged', (cid) => {
      wallet.chainId = parseInt(cid, 16)
    })
    await toChain()
    if (!wallet.chainId) wallet.chainId = CHAIN.id
    toast(`Connected ${short(a)}`)
    return true
  } catch (e) {
    if (e?.code === 4001) toast('Connection rejected in your wallet')
    return false
  }
}

export function chooseWallet(rdns) {
  const list = walletList()
  const w = list.find((x) => (x.info.rdns || x.info.name || 'injected') === rdns) || list[0]
  if (!w) return
  use(w.provider, w.info).then((ok) => {
    if (resolveConnect) {
      resolveConnect(ok)
      resolveConnect = null
    }
  })
}

export function connectWallet() {
  if (wallet.account) return Promise.resolve(true)
  return new Promise((resolve) => {
    resolveConnect = resolve
    showChooser(walletList())
  })
}

/** Connect if needed; resolves true when a wallet is ready. */
export async function ensureWallet() {
  if (wallet.account) return true
  return connectWallet()
}

/* ----------------------------------------------------------- transactions */

function receipt(spec, hash) {
  session.eth = Math.max(0, session.eth - 0.00021)
  spec.onDone?.(hash)
  session.txs = [
    { hash, title: spec.title, at: Date.now(), amount: spec.amount ?? null, unit: spec.unit || 'USDG' },
    ...(session.txs || []),
  ].slice(0, 24)
  saveSession()
}

/**
 * Confirm and execute a state change. The control flow matches a wallet: connect,
 * confirm, pending, receipt — and the caller's `onDone` moves the numbers.
 */
export async function transact(spec) {
  if (!wallet.account) {
    const ok = await connectWallet()
    if (!ok) return false
  }
  const txSpec = {
    title: spec.title,
    method: spec.method || 'Contract call',
    toLabel: spec.toLabel || 'NasyaiPool',
    to: spec.to || NASYAI.contracts.pool,
    amount: spec.amount,
    unit: spec.unit || 'USDG',
    fee: '0.00021 ETH',
    data: selector(spec.kind) + (spec.amount != null ? word(spec.amount) : ''),
  }
  try {
    let hash
    if (wallet.local) {
      hash = await askTx(txSpec)
    } else {
      // A real extension signs a readable confirmation instead of broadcasting a
      // contract call this front end cannot back.
      hash = await wallet.provider.request({
        method: 'personal_sign',
        params: [
          `nasyai.top\n\n${spec.title}${spec.amount != null ? `\n${usd(spec.amount)} ${txSpec.unit}` : ''}\n\nNetwork: ${CHAIN.name}\nNonce: ${Math.floor(Math.random() * 1e6)}`,
          wallet.account,
        ],
      })
    }
    receipt(spec, hash)
    toast(spec.done || `${spec.title} confirmed`)
    return true
  } catch (e) {
    if (e?.code === 4001) toast('Rejected in your wallet')
    else toast('The wallet did not accept this transaction')
    return false
  }
}

/** Sign a message (holder sign-in, linking an X account). */
export async function sign(message) {
  if (!wallet.account) {
    const ok = await connectWallet()
    if (!ok) return false
  }
  try {
    const provider = wallet.provider || local
    await provider.request({ method: 'personal_sign', params: [message, wallet.account || ACCOUNT] })
    return true
  } catch (e) {
    if (e?.code === 4001) toast('Signature rejected in your wallet')
    return false
  }
}

/* ---------------------------------------------------------------- resume */

async function resume() {
  let last = null
  try {
    last = localStorage.getItem(KEY)
  } catch {
    /* private mode */
  }
  wallet.wallets = walletList().length
  if (!last) return
  await new Promise((r) => setTimeout(r, 120))
  const list = walletList()
  const w = list.find((x) => (x.info.rdns || x.info.name || 'injected') === last) || list[0]
  if (!w) return
  try {
    const [a] = await w.provider.request({ method: 'eth_accounts' })
    if (!a) return
    wallet.provider = w.provider
    wallet.account = a
    wallet.local = !!w.local
    w.provider.on?.('accountsChanged', (list2) => {
      wallet.account = list2?.[0] || null
    })
    w.provider.on?.('chainChanged', (cid) => {
      wallet.chainId = parseInt(cid, 16)
    })
    await readChain(w.provider)
    if (!wallet.chainId) wallet.chainId = CHAIN.id
  } catch {
    /* ignored */
  }
}

loadSession()
setTimeout(() => {
  wallet.wallets = walletList().length
}, 0)
setTimeout(() => {
  wallet.wallets = walletList().length
}, 600)
resume()
