<script setup>
import { computed, onMounted } from 'vue'
import CrewGuide from '../components/CrewGuide.vue'
import CrewNote from '../components/CrewNote.vue'
import CrewFace from '../components/CrewFace.js'
import { NASYAI } from '../config/nasyai.js'
import { wallet } from '../composables/wallet.js'
import { paint, deposit, withdraw, maxOut, stake, unstake, claimFees, setLine } from '../composables/localchain.js'

const pool = computed(() => NASYAI.contracts.pool)

onMounted(paint)

function amountOf(id) {
  const el = document.getElementById(id)
  return el ? Number(String(el.value).replace(/[^0-9.]/g, '')) || 0 : 0
}

async function walletOnly(action) {
  if (action === 'Max') return maxOut()
  if (action === 'Depositing') return deposit(amountOf('l-dep'))
  if (action === 'Withdrawing') return withdraw(amountOf('l-wd'))
  if (action === 'Staking') return stake(amountOf('s-amt'))
  if (action === 'Unstaking') return unstake()
  if (action === 'Claiming fees') return claimFees()
  if (action === 'Setting a line') return setLine()
  return false
}
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Participate</p>
          <h1 class="statement-title">Lend USDG. Or back your own agent.</h1>
          <p class="statement-lede">Lenders fund the pool and take half of every fee. Backers stand behind a specific agent and take a quarter of what that agent pays. Both see every loan on chain.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="grid-2" style="align-items: start">
          <div class="panel" id="lend">
            <div class="panel-head" style="align-items: center">
              <span class="ink-chip" data-face="harbor"><CrewFace id="harbor" :size="46" /></span>
              <span data-prelaunch hidden><span class="stamp">Opens at launch</span></span>
            </div>
            <div class="stack">
              <h2 class="display-sm">Lend USDG</h2>
              <p>Deposit USDG into the pool. You get pool shares; their value grows as fees come in. Because every line is fully backed by someone else's stake, a default is repaid from that stake, not from deposits.</p>
              <ul class="keylist">
                <li>Your share of fees <b data-param="lenderShare">50%</b></li>
                <li>Fee agents pay <b>1% per 30 days</b></li>
                <li>Withdraw <b>any time, from idle USDG</b></li>
                <li>Leave within 7 days <b>0.5%, kept by other lenders</b></li>
                <li>Pool contract <b class="type-mon" data-addr="pool">{{ pool }}</b></li>
              </ul>
              <div class="stack" data-lend>
                <ul class="keylist">
                  <li>Your position <b data-l-pos>connect a wallet</b></li>
                  <li>Exit fee window <b data-l-window>—</b></li>
                  <li>Pool total <b data-l-total>$0.00</b></li>
                </ul>
                <div class="field-row">
                  <div class="field">
                    <label class="field-label" for="l-dep">USDG to deposit</label>
                    <input id="l-dep" class="field-input" inputmode="decimal" placeholder="USDG to deposit">
                  </div>
                  <button class="act act--solid" type="button" data-l-deposit @click="walletOnly('Depositing')">Deposit</button>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label class="field-label" for="l-wd">USDG to withdraw</label>
                    <input id="l-wd" class="field-input" inputmode="decimal" placeholder="USDG to withdraw">
                  </div>
                  <button class="act act--line" type="button" data-l-withdraw @click="walletOnly('Withdrawing')">Withdraw</button>
                  <button class="act act--line" type="button" data-l-max @click="walletOnly('Max')">Max</button>
                </div>
                <p class="small-note" data-out="lend" hidden></p>
              </div>
              <RouterLink class="link" to="/protocol#parameters" style="justify-self: start">All parameters</RouterLink>
            </div>
          </div>

          <div class="panel" id="back">
            <div class="panel-head" style="align-items: center">
              <span class="ink-chip" data-face="herald"><CrewFace id="herald" :size="46" /></span>
              <span class="stamp">Once $NASYAI launches</span>
            </div>
            <div class="stack">
              <h2 class="display-sm">Back your own agent</h2>
              <p>Lock $NASYAI behind your agent's line. The seat vault backs the line in USDG from its own stake. If the agent defaults, three quarters of your stake burns and the rest comes back.</p>
              <ul class="keylist">
                <li>Line to start <b>$50 (two $25 steps)</b></li>
                <li>Grows in steps to <b data-param="maxLine">$500</b></li>
                <li>On default <b>75% of the stake burns</b></li>
                <li>Who can do it <b>the agent's owner only</b></li>
              </ul>
              <div class="cluster">
                <RouterLink class="act act--ink" to="/desk">Open the agent desk</RouterLink>
                <RouterLink class="link" to="/nasyai">What $NASYAI does</RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: clamp(20px, 3vw, 34px)">
          <CrewNote id="warden"><p>No outside audit yet: the contracts are new, and money lent or staked can be lost. Ask me what can go wrong before you put money in.</p></CrewNote>
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in">
        <div class="band-head">
          <span class="statement-kicker"><b>Root sponsors</b></span>
          <h2 class="display-md" style="margin-inline-start: auto">Stake USDG from your own wallet.</h2>
        </div>
        <p class="lede">A root sponsor stakes USDG and vouches for agents directly, without $NASYAI. Each line you open is covered by your stake in full; you earn a quarter of the fees those agents pay and you lose the principal and fee of any that default.</p>

        <div class="grid-2" style="align-items: start; margin-top: clamp(18px, 2.6vw, 30px)">
          <div class="panel" id="sponsor-desk">
            <div class="stack">
              <h3>Your sponsor desk</h3>
              <ul class="keylist">
                <li>Stake <b data-s-stake>connect a wallet</b></li>
                <li>Lines you back <b data-s-vouched>—</b></li>
                <li>Free to back or take out <b data-s-free>—</b></li>
                <li>Fees to claim <b data-s-fees>—</b></li>
              </ul>
              <div class="field-row">
                <div class="field">
                  <label class="field-label" for="s-amt">USDG</label>
                  <input id="s-amt" class="field-input" inputmode="decimal" placeholder="USDG">
                </div>
                <button class="act act--solid" type="button" data-s-stake-btn @click="walletOnly('Staking')">Stake</button>
                <button class="act act--line" type="button" data-s-unstake @click="walletOnly('Unstaking')">Unstake</button>
              </div>
              <div class="field-row">
                <div class="field">
                  <label class="field-label" for="s-agent">Agent id</label>
                  <input id="s-agent" class="field-input" inputmode="numeric" placeholder="Agent id">
                </div>
                <div class="field">
                  <label class="field-label" for="s-line">Line in USDG</label>
                  <input id="s-line" class="field-input" inputmode="decimal" placeholder="Line, USDG">
                </div>
                <button class="act act--line" type="button" data-s-line @click="walletOnly('Setting a line')">Set line</button>
              </div>
              <button class="act act--line act--sm" type="button" data-s-claim style="justify-self: start" @click="walletOnly('Claiming fees')">Claim fees</button>
              <p class="dim">The agent's owner chooses you first on the <RouterLink class="link" to="/desk">agent desk</RouterLink> (Another backer, your address). New stake can leave after a day; stake that backs a line or an open loan's fee stays put.</p>
              <p class="small-note" data-out="sponsor" hidden></p>
            </div>
          </div>

          <div class="panel">
            <div class="stack">
              <h3>Before you put money in</h3>
              <ul class="tick-list">
                <li>The contracts are new. They have had internal reviews, no outside audit.</li>
                <li>A default costs you; it never costs the lenders.</li>
                <li>Lines and fees are capped while the pool is young.</li>
                <li>Every parameter and address is on the protocol page, and on chain.</li>
              </ul>
              <RouterLink class="link" to="/protocol" style="justify-self: start">Read the protocol</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
