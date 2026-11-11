// Local protocol state for the browser session: the pool, the agent, the holder seat and the
// receipts. Pages paint their existing data-* hooks from here, so the UI moves the way it does
// on chain without shipping a backend.
import { reactive } from 'vue'
import { NASYAI } from '../config/nasyai.js'
import { session, save, short, usd, transact, sign, wallet, ensureWallet } from './wallet.js'
import { toast } from './toast.js'

const mono = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const one = (n) => Number(n).toLocaleString('en-US')

export const demo = reactive({
  block: 108855338,
  pool: { total: 48210.55, lenders: 128, vouched: 39640 },
  agent: null,
  holder: { linked: false, handle: '', tier: 'Guest', code: '' },
  lane: null,
})

export function block() {
  demo.block += 1
  return demo.block
}

const set = (sel, text) => {
  if (typeof document === 'undefined') return
  document.querySelectorAll(sel).forEach((el) => {
    el.textContent = text
  })
}

const show = (sel) => {
  if (typeof document === 'undefined') return
  document.querySelectorAll(sel).forEach((el) => {
    el.hidden = false
  })
}

const hide = (sel) => {
  if (typeof document === 'undefined') return
  document.querySelectorAll(sel).forEach((el) => {
    el.hidden = true
  })
}

const input = (id) => {
  const el = document.getElementById(id)
  return el ? Number(String(el.value).replace(/[^0-9.]/g, '')) || 0 : 0
}

/* --------------------------------------------------------------- painter */

export function paint() {
  // wallet panel (desk)
  set('[data-me]', wallet.account ? short(wallet.account) : 'Not connected')
  set('[data-eth]', `${session.eth.toFixed(4)} ETH`)
  set('[data-usdg]', `${usd(session.usdg)} USDG`)
  set('[data-net]', 'Robinhood Chain')

  // lender side
  set('[data-l-pos]', session.deposit > 0 ? `${usd(session.deposit)} USDG` : wallet.account ? 'no position yet' : 'connect a wallet')
  set('[data-l-total]', `${usd(demo.pool.total)} USDG`)
  set('[data-l-window]', session.deposit > 0 ? 'open' : '—')
  set('[data-s-free]', `${usd(Math.max(0, session.usdg - session.stake))} USDG`)
  set('[data-s-stake]', session.stake > 0 ? `${usd(session.stake)} USDG` : '—')
  set('[data-s-fees]', session.stake > 0 ? `${usd(session.stake * 0.0121)} USDG` : '—')
  set('[data-s-vouched]', session.stake > 0 ? `${usd(session.stake * 2)} USDG` : '—')

  // agent panel
  const a = demo.agent
  if (a) {
    set('[data-a-id]', String(a.id))
    set('[data-a-tier]', a.tier)
    set('[data-a-own]', a.own ? 'Your agent' : 'Agent')
    set('[data-a-line]', `$${mono(a.line, 0)}`)
    set('[data-a-sponsor]', a.sponsor)
    set('[data-a-owed]', `$${mono(a.owed)}`)
    set('[data-a-active]', a.active ? `${a.active} open loan${a.active > 1 ? 's' : ''}` : 'no open loan')
    set('[data-a-repaid]', `$${mono(a.repaid)}`)
    set('[data-a-repaidn]', `${a.loans.filter((l) => l.status === 'repaid').length} repaid`)
    set('[data-a-score]', String(a.score))
    set('[data-a-def]', a.defaults ? `${a.defaults} default` : 'no defaults')
    set('[data-seat]', a.seat ? 'open' : '—')
    set('[data-seat-bond]', a.seat ? '5.00 USDG' : '—')
    set('[data-tr-free]', `${mono(demo.pool.vouched)} USDG`)
    set('[data-nv-seat]', a.seat ? 'open' : '—')
    set('[data-nv-locked]', a.nasyaiLocked ? `${one(a.nasyaiLocked)} $NASYAI` : '—')
    set('[data-nv-price]', '$25.00')
    set('[data-nv-bal]', `${one(session.nasyai)} $NASYAI`)
    set('[data-nv-allowed]', a.nasyaiLocked ? '2 steps' : '0 steps')
    set('[data-nv-free]', a.nasyaiLocked ? `${mono(a.nasyaiLocked * 0.0000021)} USDG` : '—')
    set('[data-nv-preview]', '≈ $50.00')
    set('[data-pos]', a.owed > 0 ? `$${mono(a.owed)} owed` : 'nothing open')
    set('[data-quote]', `${mono(0.01)} USDG`)

    const loans = document.querySelector('[data-loans]')
    if (loans && a.loans.length) {
      loans.innerHTML = a.loans
        .map(
          (l) =>
            `<tr><td class="type-mon">#${l.id}</td><td>${l.status === 'repaid' ? 'repaid' : 'open'}</td><td class="type-mon">${l.due}</td><td class="num-right type-mon">$${mono(l.amount)}</td><td class="num-right type-mon">$${mono(l.fee ?? 0)}</td><td class="num-right">${l.status === 'repaid' ? '' : '<span class="stamp stamp--warn">Repay</span>'}</td></tr>`,
        )
        .join('')
    }
    const openLoans = a.loans.filter((l) => l.status !== 'repaid').length
    set('[data-loans-n]', `${a.loans.length} loan${a.loans.length === 1 ? '' : 's'} · ${openLoans} open`)
  }

  // holder side
  const h = demo.holder
  if (wallet.account) set('[data-h-addr]', short(wallet.account))
  set('[data-h-bal]', `${one(session.nasyai)} $NASYAI`)
  set('[data-h-tier]', wallet.account ? (h.linked ? h.tier : 'Guest · 5 a day') : '—')
  set('[data-h-x]', h.linked ? `@${h.handle}` : 'not linked')
  set('[data-h-tag]', h.linked ? 'signed in' : wallet.account ? 'signed in' : 'signed out')
  if (wallet.account) {
    show('[data-h-signout]')
    hide('[data-h-signin]')
    show('[data-h-link]')
  }
  if (h.linked) {
    show('[data-h-unlink]')
    show('[data-h-post]')
    set('[data-h-text]', `@${h.handle} · ${h.code}`)
  }
}

/* -------------------------------------------------------------- protocol */

export async function deposit(amount) {
  if (!(await ensureWallet())) return false
  const value = Number(amount) || 0
  if (value <= 0) return toast('Enter an amount to deposit')
  if (value > session.usdg) return toast('Not enough USDG in this wallet')
  return transact({
    title: 'Deposit USDG',
    method: 'deposit(uint256)',
    kind: 'deposit',
    amount: value,
    toLabel: 'NasyaiPool',
    done: `Deposited ${usd(value)} USDG`,
    onDone() {
      session.usdg -= value
      session.deposit += value
      demo.pool.total += value
      demo.pool.lenders += session.deposit === value ? 1 : 0
      save()
      paint()
    },
  })
}

export async function withdraw(amount) {
  if (!(await ensureWallet())) return false
  const value = Number(amount) || 0
  if (value <= 0) return toast('Enter an amount to withdraw')
  if (value > session.deposit) return toast('That is more than your position')
  const fee = value < session.deposit && demo.block % 3 === 0 ? value * 0.005 : 0
  return transact({
    title: 'Withdraw USDG',
    method: 'withdraw(uint256)',
    kind: 'withdraw',
    amount: value,
    toLabel: 'NasyaiPool',
    done: `Withdrew ${usd(value - fee)} USDG`,
    onDone() {
      session.deposit -= value
      session.usdg += value - fee
      demo.pool.total = Math.max(0, demo.pool.total - value)
      save()
      paint()
    },
  })
}

export async function maxOut() {
  if (session.deposit <= 0) return toast('Nothing to withdraw yet')
  const el = document.getElementById('l-wd')
  if (el) el.value = session.deposit.toFixed(2)
  toast('Max filled')
}

export async function stake(amount) {
  if (!(await ensureWallet())) return false
  const value = Number(amount) || 0
  if (value <= 0) return toast('Enter an amount to stake')
  if (value > session.usdg - session.stake) return toast('Not enough USDG to stake')
  return transact({
    title: 'Stake as a sponsor',
    method: 'stake(uint256)',
    kind: 'stake',
    amount: value,
    toLabel: 'NasyaiPool',
    done: `Staked ${usd(value)} USDG`,
    onDone() {
      session.stake += value
      demo.pool.vouched += value
      save()
      paint()
    },
  })
}

export async function unstake() {
  if (!(await ensureWallet())) return false
  if (session.stake <= 0) return toast('Nothing staked yet')
  const value = session.stake
  return transact({
    title: 'Unstake USDG',
    method: 'unstake(uint256)',
    kind: 'unstake',
    amount: value,
    toLabel: 'NasyaiPool',
    done: `Unstaked ${usd(value)} USDG`,
    onDone() {
      session.stake = 0
      demo.pool.vouched = Math.max(0, demo.pool.vouched - value)
      save()
      paint()
    },
  })
}

export async function claimFees() {
  if (!(await ensureWallet())) return false
  const value = session.stake > 0 ? session.stake * 0.0121 : 3.42
  return transact({
    title: 'Claim fees',
    method: 'claim()',
    kind: 'claim',
    amount: value,
    toLabel: 'NasyaiPool',
    done: `Claimed ${usd(value)} USDG`,
    onDone() {
      session.usdg += value
      save()
      paint()
    },
  })
}

export async function setLine() {
  if (!(await ensureWallet())) return false
  const amount = input('s-line')
  const id = input('s-agent')
  if (!amount) return toast('Enter the line to set')
  return transact({
    title: 'Set a line',
    method: 'setLine(uint256,uint256)',
    kind: 'line',
    amount,
    toLabel: 'NasyaiPool',
    done: `Line of ${usd(amount)} USDG set`,
    onDone() {
      toast(`Line set for agent #${id || 1}`)
      paint()
    },
  })
}

export async function requestLane() {
  if (!(await ensureWallet())) return false
  return transact({
    title: 'Request a treasury lane',
    method: 'openLane(uint256)',
    kind: 'lane',
    toLabel: 'NasyaiTreasury',
    done: 'Lane request signed',
    onDone() {
      demo.lane = { at: Date.now() }
      hide('[data-soon-form]')
      set('[data-out="lane"]', 'Request received. The treasury opens the line within one block.')
    },
  })
}

/* ------------------------------------------------------------------ agent */

function blankAgent(id) {
  return {
    id,
    line: 5,
    owed: 0,
    repaid: 0,
    active: 0,
    defaults: 0,
    score: 120,
    tier: 'Spark',
    seat: false,
    own: true,
    sponsor: 'the treasury',
    nasyaiLocked: 0,
    loans: [],
  }
}

function tierFor(score) {
  if (score >= 850) return 'Pulsar'
  if (score >= 600) return 'Nasyai'
  if (score >= 300) return 'Flare'
  if (score >= 100) return 'Spark'
  return 'Dust'
}

function rescore(a) {
  a.score = Math.min(1000, Math.round(140 * Math.log(1 + a.repaid * 14 / 100)) + 110)
  a.tier = tierFor(a.score)
}

export async function registerAgent() {
  if (!(await ensureWallet())) return false
  return transact({
    title: 'Register an ERC-8004 agent',
    method: 'register(string)',
    kind: 'register',
    toLabel: 'Identity registry',
    done: 'Agent registered',
    onDone() {
      const id = 480 + (session.txs.length % 20)
      demo.agent = blankAgent(id)
      demo.agent.loans = []
      save()
      show('[data-agent-panel]')
      paint()
      toast(`Agent #${id} is yours`)
    },
  })
}

export function loadAgent(id) {
  const n = Number(String(id).replace(/[^0-9]/g, ''))
  if (!n) return false
  const base = blankAgent(n)
  const age = (n % 7) + 2
  base.line = 50
  base.repaid = 137.5
  base.score = 412
  base.tier = 'Flare'
  base.sponsor = 'a sponsor'
  base.loans = [
    { id: 1011, due: `${age * 9} days ago`, amount: 5, fee: 0.01, status: 'repaid' },
    { id: 1024, due: `${age * 6} days ago`, amount: 10, fee: 0.02, status: 'repaid' },
    { id: 1038, due: `${age * 3} days ago`, amount: 25, fee: 0.06, status: 'repaid' },
    { id: 1051, due: `in ${14 - (age % 7)} days`, amount: 50, fee: 0.12, status: 'open' },
  ]
  base.owed = 50.17
  base.active = 1
  demo.agent = base
  show('[data-agent-panel]')
  paint()
  return true
}

export async function borrow() {
  if (!(await ensureWallet())) return false
  const amount = input('bamt') || 5
  const a = demo.agent
  if (!a) return toast('Load an agent first')
  if (a.owed > 0) return toast('Repay the open loan before borrowing again')
  if (amount + a.owed > a.line) return toast(`That is over the ${usd(a.line)} line`)
  return transact({
    title: 'Borrow USDG',
    method: 'borrow(uint256,uint256,uint256)',
    kind: 'borrow',
    amount,
    toLabel: 'NasyaiPool',
    done: `Borrowed ${usd(amount)} USDG`,
    onDone() {
      a.owed += amount
      a.active = 1
      a.loans.unshift({
        id: 1100 + a.loans.length,
        due: 'in 14 days',
        amount,
        fee: Math.round(amount * 0.01 * 14) / 100,
        status: 'open',
      })
      session.usdg += amount
      save()
      paint()
    },
  })
}

export async function repay() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a) return toast('Load an agent first')
  if (a.owed <= 0) return toast('Nothing to repay')
  const due = a.owed
  if (session.usdg < due) return toast('Not enough USDG in this wallet')
  return transact({
    title: 'Repay the loan',
    method: 'repay(uint256,uint256)',
    kind: 'repay',
    amount: due,
    toLabel: 'NasyaiPool',
    done: `Repaid ${usd(due)} USDG`,
    onDone() {
      a.owed = 0
      a.active = 0
      a.repaid += due
      a.line = Math.min(500, a.line + 25)
      a.loans = a.loans.map((l, i) => (i === 0 ? { ...l, status: 'repaid' } : l))
      rescore(a)
      session.usdg -= due
      save()
      paint()
    },
  })
}

export async function seatOpen() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a) return toast('Load an agent first')
  return transact({
    title: 'Open the treasury seat',
    method: 'open(uint256)',
    kind: 'bond',
    amount: 5,
    toLabel: 'NasyaiTreasury',
    done: 'Seat opened',
    onDone() {
      a.seat = true
      a.line = Math.max(a.line, 5)
      paint()
    },
  })
}

export async function seatBondBack() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a?.seat) return toast('No bond is held for this agent')
  return transact({
    title: 'Release the bond',
    method: 'releaseBond(uint256)',
    kind: 'bond',
    toLabel: 'NasyaiTreasury',
    done: '5.00 USDG bond returned',
    onDone() {
      session.usdg += 5
      save()
      paint()
    },
  })
}

export async function seatClose() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a?.seat) return toast('No seat is open')
  return transact({
    title: 'Close the seat',
    method: 'close(uint256)',
    kind: 'bond',
    toLabel: 'NasyaiTreasury',
    done: 'Seat closed',
    onDone() {
      a.seat = false
      paint()
    },
  })
}

export async function setSponsor() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a) return toast('Load an agent first')
  const picked = document.querySelector('input[name="sp"]:checked')
  const label = { treasury: 'the treasury', stock: 'the stock vault', seat: 'a $NASYAI seat', other: 'another backer', none: 'no sponsor' }
  return transact({
    title: 'Choose the sponsor',
    method: 'setSponsor(uint256,address)',
    kind: 'line',
    toLabel: 'NasyaiPool',
    done: 'Sponsor updated',
    onDone() {
      a.sponsor = label[picked?.value] || 'the treasury'
      paint()
    },
  })
}

export async function lockNasyai(steps = 1) {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a) return toast('Load an agent first')
  const amount = 12500 * steps
  return transact({
    title: 'Lock $NASYAI in the seat vault',
    method: 'open(uint256,uint256,uint256)',
    kind: 'stake',
    amount: 0,
    unit: 'NASYAI',
    toLabel: 'NasyaiSeatVault',
    done: `${one(amount)} $NASYAI locked`,
    onDone() {
      a.nasyaiLocked = (a.nasyaiLocked || 0) + amount
      session.nasyai = Math.max(0, session.nasyai - amount)
      a.line = Math.max(a.line, 50 + steps * 25)
      save()
      paint()
    },
  })
}

export async function closeNasyai() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a?.nasyaiLocked) return toast('No seat is open for this agent')
  const amount = a.nasyaiLocked
  return transact({
    title: 'Close the seat and take $NASYAI back',
    method: 'close(uint256)',
    kind: 'unstake',
    toLabel: 'NasyaiSeatVault',
    done: `${one(amount)} $NASYAI returned`,
    onDone() {
      session.nasyai += amount
      a.nasyaiLocked = 0
      save()
      paint()
    },
  })
}

export async function openStock() {
  if (!(await ensureWallet())) return false
  const a = demo.agent
  if (!a) return toast('Load an agent first')
  return transact({
    title: 'Open a stock line',
    method: 'open(uint256,address,uint256)',
    kind: 'line',
    amount: 250,
    toLabel: 'NasyaiStockVault',
    done: 'Stock line open for $250 USDG',
    onDone() {
      a.line = Math.max(a.line, 250)
      a.sponsor = 'the stock vault'
      paint()
    },
  })
}

export async function closeStock() {
  if (!(await ensureWallet())) return false
  return transact({
    title: 'Close the stock line',
    method: 'close(uint256)',
    kind: 'line',
    toLabel: 'NasyaiStockVault',
    done: 'Tokens returned to your wallet',
    onDone() {
      paint()
    },
  })
}

export async function setOperator() {
  if (!(await ensureWallet())) return false
  const addr = (document.getElementById('opaddr')?.value || '').trim()
  if (addr && !/^0x[0-9a-fA-F]{6,}$/.test(addr)) return toast('That is not an address')
  return transact({
    title: addr ? 'Set the operator' : 'Clear the operator',
    method: 'setOperator(uint256,address)',
    kind: 'line',
    toLabel: 'NasyaiPool',
    done: addr ? 'Operator set' : 'Operator cleared',
    onDone() {
      toast('Saved')
    },
  })
}

/* ---------------------------------------------------------------- holder */

export async function holderSignIn() {
  if (!(await ensureWallet())) return false
  if (!session.nasyai) {
    session.nasyai = 10000
    save()
  }
  const ok = await sign(`nasyai.top wants you to sign in with your wallet.\n\nAddress: ${window.__addr || '0x'}\nNonce: ${Math.floor(Math.random() * 1e9)}\nIssued: ${new Date().toUTCString()}`)
  if (!ok) return false
  demo.holder.tier = 'Holder'
  demo.holder.linked = !!demo.holder.handle
  paint()
  return true
}

export async function linkX(handle) {
  if (!(await ensureWallet())) return false
  const name = String(handle || '').replace(/^@/, '').trim()
  if (!/^[A-Za-z0-9_]{2,15}$/.test(name)) return toast('Enter your X handle, like @name')
  const ok = await sign(`Link @${name} to this wallet.\n\nnasyai.top · ${new Date().toISOString()}`)
  if (!ok) return false
  demo.holder.handle = name
  demo.holder.linked = true
  demo.holder.code = `NASY-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const el = document.getElementById('xh')
  if (el) el.value = ''
  paint()
  toast(`@${name} linked`)
  return true
}

export function unlinkX() {
  demo.holder.linked = false
  demo.holder.handle = ''
  demo.holder.code = ''
  hide('[data-h-signout]')
  show('[data-h-signin]')
  paint()
  toast('Account unlinked')
}
