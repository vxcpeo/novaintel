<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CrewGuide from '../components/CrewGuide.vue'
import CrewFace from '../components/CrewFace.js'
import { STOCKS } from '../data/stocks.js'
import { wallet, connectWallet, short, session } from '../composables/wallet.js'
import {
  paint,
  registerAgent as registerAgentTx,
  loadAgent as loadAgentState,
  borrow as borrowTx,
  repay as repayTx,
  seatOpen,
  seatBondBack,
  seatClose,
  setSponsor as setSponsorTx,
  lockNasyai,
  closeNasyai,
  openStock,
  closeStock,
  setOperator,
} from '../composables/localchain.js'
import { toast } from '../composables/toast.js'

const agentId = ref('')
const agentError = ref('')

const netText = computed(() => (!wallet.account ? 'not connected' : wallet.chainId === 4663 ? 'Robinhood Chain' : 'wrong network'))
const netClass = computed(() => 'tag ' + (wallet.account && wallet.chainId === 4663 ? 'live' : 'soon'))
const me = computed(() => (wallet.account ? short(wallet.account) : '—'))

function loadAgent() {
  const id = agentId.value.trim().replace(/^#/, '')
  if (!/^\d{1,9}$/.test(id)) {
    agentError.value = 'An agent id is a number.'
    return
  }
  agentError.value = ''
  if (loadAgentState(id)) toast(`Agent #${id} loaded`)
}

async function registerAgent() {
  await registerAgentTx()
}

async function walletAction(ev) {
  const ds = ev?.currentTarget?.dataset || {}
  const has = (k) => Object.prototype.hasOwnProperty.call(ds, k)
  if (has('setSponsor')) return setSponsorTx()
  if (has('seatOpen')) return seatOpen()
  if (has('seatBondBack')) return seatBondBack()
  if (has('seatClose')) return seatClose()
  if (has('nvOpen')) return lockNasyai(1)
  if (has('nvGrow')) return lockNasyai(1)
  if (has('nvClose')) return closeNasyai()
  if (has('stockOpen')) return openStock()
  if (has('stockClose')) return closeStock()
  if (has('borrow')) return borrowTx()
  if (has('setOp')) return setOperator()
  return false
}

onMounted(paint)
watch(
  () => wallet.account,
  () => paint(),
)
watch(
  () => session.usdg,
  () => paint(),
)
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">Agent desk</p>
          <h1 class="statement-title mega">Run your agent's credit.</h1>
          <p class="statement-lede">Everything an agent's owner does on Nasyai, from one wallet: create the agent, choose who backs it, open its line, borrow and repay. Each step is a transaction you approve in your wallet. Nothing here holds a key.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="grid-2" style="align-items: start">
          <article class="panel stack" id="d-wallet">
            <header class="panel-head"><h3>Your wallet</h3><span class="stamp" :class="netClass" data-net>{{ netText }}</span></header>
            <ul class="keylist">
              <li>Address <b data-me>{{ me }}</b></li>
              <li>ETH for gas <b data-eth>—</b></li>
              <li>USDG <b data-usdg>—</b></li>
            </ul>
            <button class="act act--solid act--sm" type="button" data-connect :hidden="!!wallet.account" @click="connectWallet()">Connect wallet</button>
          </article>

          <article class="panel stack" id="d-agent">
            <header class="panel-head"><h3>Your agent</h3></header>
            <form class="field-row" data-load @submit.prevent="loadAgent">
              <div class="field">
                <label class="field-label" for="aid">ERC-8004 agent id</label>
                <input id="aid" v-model="agentId" class="field-input" name="id" inputmode="numeric" autocomplete="off" placeholder="ERC-8004 agent id">
              </div>
              <button class="act act--ink" type="submit">Load</button>
            </form>
            <p class="quiet">No agent yet? <button class="link link--plain" type="button" data-register @click="registerAgent">Create one now</button>: it registers an ERC-8004 identity owned by your wallet.</p>
            <p class="small-note" :class="{ bad: !!agentError }" data-out="agent" :hidden="!agentError">{{ agentError }}</p>
          </article>
        </div>
      </div>
    </section>

    <div data-agent-panel hidden>
      <section class="band">
        <div class="well band-in">
          <header class="band-head">
            <h2 class="display-sm">Agent <span>#<span data-a-id></span></span> <span class="stamp" data-a-tier></span></h2>
            <span class="stamp" data-a-own></span>
          </header>
          <div class="beats">
            <div class="beat"><div class="beat-cap">Line</div><div class="beat-figure" data-a-line>—</div><div class="beat-note" data-a-sponsor>—</div></div>
            <div class="beat"><div class="beat-cap">Owes now</div><div class="beat-figure beat-figure--violet" data-a-owed>—</div><div class="beat-note" data-a-active>—</div></div>
            <div class="beat"><div class="beat-cap">Repaid</div><div class="beat-figure beat-figure--mint" data-a-repaid>—</div><div class="beat-note" data-a-repaidn>—</div></div>
            <div class="beat"><div class="beat-cap">Nasyai Score</div><div class="beat-figure" data-a-score>—</div><div class="beat-note" data-a-def>—</div></div>
          </div>
        </div>
      </section>

      <section class="band">
        <div class="well band-in">
          <div class="grid-2" style="align-items: start">
            <article class="panel stack" id="d-sponsor">
              <span class="statement-kicker"><b>1</b> · Sponsor</span>
              <h3>Who backs this agent</h3>
              <p>An agent has one sponsor at a time. Only its owner can choose, and only while it owes nothing.</p>
              <div class="choice-row" role="radiogroup" aria-label="Sponsor">
                <label class="choice"><input type="radio" name="sp" value="treasury" checked><span>Treasury</span></label>
                <label class="choice"><input type="radio" name="sp" value="stock"><span>Stock vault</span></label>
                <label class="choice"><input type="radio" name="sp" value="seat"><span>$NASYAI seat</span></label>
                <label class="choice"><input type="radio" name="sp" value="other"><span>Another backer</span></label>
                <label class="choice"><input type="radio" name="sp" value="none"><span>None</span></label>
              </div>
              <div class="field" data-sp-other hidden>
                <label class="field-label" for="spaddr">Backer address</label>
                <input class="field-input" id="spaddr" placeholder="0x…" autocomplete="off">
              </div>
              <button class="act act--solid act--sm" type="button" data-set-sponsor @click="walletAction">Choose this sponsor</button>
              <p class="small-note" data-out="sponsor" hidden></p>
            </article>

            <article class="panel stack" id="d-seat">
              <span class="statement-kicker"><b>2a</b> · Treasury seat</span>
              <h3>A $5 first line</h3>
              <p>Post a 5 USDG bond and the treasury opens a $5 line. The bond comes back after a loan held 7 days or more is repaid on time. One seat per agent, ever.</p>
              <ul class="keylist">
                <li>Seat <b data-seat>—</b></li>
                <li>Bond held <b data-seat-bond>—</b></li>
                <li>Treasury's free backing <b data-tr-free>—</b></li>
              </ul>
              <div class="cluster">
                <button class="act act--solid act--sm" type="button" data-seat-open @click="walletAction">Open the seat</button>
                <button class="act act--line act--sm" type="button" data-seat-bond-back @click="walletAction">Get the bond back</button>
                <button class="act act--line act--sm" type="button" data-seat-close @click="walletAction">Close the seat</button>
              </div>
              <p class="small-note" data-out="seat" hidden></p>
            </article>
          </div>
        </div>
      </section>

      <section class="band">
        <div class="well band-in">
          <article class="panel stack" id="d-nasyai">
            <header class="panel-head">
              <span class="statement-kicker"><b>2c</b> · $NASYAI seat · holders</span>
              <span class="stamp stamp--ok" data-nv-state>live</span>
            </header>
            <h3>Back your own agent with $NASYAI</h3>
            <p>Lock your own $NASYAI behind the agent and the seat vault backs its line in USDG, in $25 steps: two to start ($50), one more for every three loans repaid on time, up to $500. It is collateral, not a yield product: if the agent defaults, 75% of the locked $NASYAI burns and the rest comes back to you. <RouterLink class="link" to="/nasyai">What $NASYAI does</RouterLink></p>
            <div class="split split--even">
              <ul class="keylist">
                <li>Seat <b data-nv-seat>—</b></li>
                <li>$NASYAI locked <b data-nv-locked>—</b></li>
                <li>Steps this agent may hold now <b data-nv-allowed>—</b></li>
                <li>$NASYAI per $25 step <b data-nv-price>—</b></li>
                <li>Your $NASYAI <b data-nv-bal>—</b></li>
                <li>Seat vault's free backing <b data-nv-free>—</b></li>
              </ul>
              <div class="stack">
                <div class="field">
                  <label class="field-label" for="nvsteps">Steps ($25 each)</label>
                  <input class="field-input" id="nvsteps" inputmode="numeric" value="2">
                </div>
                <p class="quiet" data-nv-preview>Load an agent to open its seat.</p>
                <div class="cluster">
                  <button class="act act--ink act--sm" type="button" data-nv-open disabled @click="walletAction">Lock and open the seat</button>
                  <button class="act act--line act--sm" type="button" data-nv-grow disabled @click="walletAction">Add steps</button>
                  <button class="act act--line act--sm" type="button" data-nv-close disabled @click="walletAction">Close and take $NASYAI back</button>
                  <button class="act act--line act--sm" type="button" data-nv-settle hidden @click="walletAction">Settle after a default</button>
                </div>
              </div>
            </div>
            <p class="small-note" data-out="nasyai" hidden></p>
          </article>
        </div>
      </section>

      <section class="band">
        <div class="well band-in">
          <div class="grid-2" style="align-items: start">
            <article class="panel stack" id="d-stock">
              <span class="statement-kicker"><b>2b</b> · Stock line</span>
              <h3>Borrow against stock tokens</h3>
              <p>Deposit Robinhood stock tokens; the stock vault backs a line at 30% to 50% of their value, up to $500, priced live by Chainlink.</p>
              <ul class="keylist">
                <li>Position <b data-pos>—</b></li>
                <li>Stock vault's free backing <b data-sk-free>—</b></li>
              </ul>
              <div class="field-row" data-stock-form>
                <div class="field">
                  <label class="field-label" for="stok">Token</label>
                  <select class="field-select" id="stok"><option v-for="(s, i) in STOCKS" :key="s.sym" :value="i">{{ s.sym }} · {{ s.ltv }}%</option></select>
                </div>
                <div class="field">
                  <label class="field-label" for="samt">Amount (tokens)</label>
                  <input class="field-input" id="samt" inputmode="decimal" placeholder="1">
                </div>
              </div>
              <p class="quiet" data-stock-preview>Enter an amount to see the line it opens.</p>
              <div class="cluster">
                <button class="act act--solid act--sm" type="button" data-stock-open @click="walletAction">Open the stock line</button>
                <button class="act act--line act--sm" type="button" data-stock-close @click="walletAction">Close and take tokens back</button>
                <button class="act act--line act--sm" type="button" data-stock-settle hidden @click="walletAction">Settle after a default</button>
              </div>
              <p class="small-note" data-out="stock" hidden></p>
            </article>

            <article class="panel stack" id="d-borrow">
              <span class="statement-kicker"><b>3</b> · Borrow</span>
              <h3>Draw USDG inside the line</h3>
              <p>1% per 30 days, by the day. Hold at least 7 days and repay on time for it to count fully toward the Nasyai Score.</p>
              <div class="field-row">
                <div class="field">
                  <label class="field-label" for="bamt">Amount (USDG)</label>
                  <input class="field-input" id="bamt" inputmode="decimal" placeholder="5">
                </div>
                <div class="field">
                  <label class="field-label" for="bdays">Days</label>
                  <input class="field-input" id="bdays" inputmode="numeric" value="14">
                </div>
              </div>
              <p class="quiet" data-quote>Enter an amount to get a quote.</p>
              <button class="act act--ink act--sm" type="button" data-borrow @click="walletAction">Borrow</button>
              <p class="small-note" data-out="borrow" hidden></p>
            </article>
          </div>
        </div>
      </section>

      <section class="band" id="d-loans">
        <div class="well band-in">
          <header class="cluster" style="justify-content: space-between; margin-bottom: 14px">
            <span class="statement-kicker"><b>4 · Loans</b> · repay before the due date</span>
            <span class="stamp" data-loans-n>0 loans</span>
          </header>
          <div class="ledger-wrap">
            <table class="ledger">
              <thead><tr><th>Loan</th><th>Status</th><th>Due</th><th class="num-right">Principal</th><th class="num-right">Fee</th><th class="num-right"></th></tr></thead>
              <tbody data-loans><tr><td colspan="6"><div class="ledger-empty" data-face="pilot" data-face-size="44"><CrewFace id="pilot" :size="44" />No loans yet.</div></td></tr></tbody>
            </table>
          </div>
          <p class="small-note" data-out="loans" hidden style="margin-top: 10px"></p>
        </div>
      </section>

      <section class="band">
        <div class="well band-in">
          <details class="panel" id="d-operator">
            <summary class="display-sm" style="cursor: pointer">Operator: let another wallet borrow for this agent</summary>
            <p style="margin-top: 12px">Name a hot wallet your agent runs on. It can borrow for the agent; the USDG goes to it. It stops working the moment the agent changes owner. Leave empty to clear it.</p>
            <div class="field-row" style="max-width: 520px; margin-top: 12px">
              <div class="field">
                <label class="field-label" for="opaddr">Operator address</label>
                <input class="field-input" id="opaddr" placeholder="0x… or empty to clear" autocomplete="off">
              </div>
              <button class="act act--ink" type="button" data-set-op @click="walletAction">Set</button>
            </div>
            <p class="small-note" data-out="op" hidden></p>
          </details>
        </div>
      </section>
    </div>

    <section class="band">
      <div class="well band-in band-in--tight">
        <footer class="small-note">Every transaction needs a little ETH on Robinhood Chain for gas. The contracts are new and have no outside audit. <RouterLink class="link" to="/protocol">How the pool works</RouterLink></footer>
      </div>
    </section>
  </main>
</template>
