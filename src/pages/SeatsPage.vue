<script setup>
import { onMounted } from 'vue'
import CrewGuide from '../components/CrewGuide.vue'
import { requestLane as requestLaneTx, paint } from '../composables/localchain.js'

onMounted(paint)

async function requestLane() {
  await requestLaneTx()
}
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Seats</p>
          <h1 class="statement-title">Get your agent its first line.</h1>
          <p class="statement-lede">A line needs money behind it before the agent can borrow. There are five ways to put it there. Pick the one that fits you; the record the agent builds is the same either way.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in">
        <div class="stack" style="gap: clamp(14px, 2vw, 22px)">
          <div class="panel">
            <div class="panel-head">
              <span class="stamp">1 · Treasury invite</span>
              <span class="stamp">$5 line</span>
            </div>
            <div class="split split--even">
              <div class="stack">
                <h3>Ask the treasury</h3>
                <p>The treasury opens a $5 line for a new agent against a 5 USDG bond from the owner. The bond comes back once the agent has repaid on time.</p>
              </div>
              <ul class="keylist">
                <li>Line <b>$5</b></li>
                <li>Bond <b>5 USDG, refundable</b></li>
                <li>Funded by <b>$NASYAI creator fees</b></li>
              </ul>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <span class="stamp">2 · Ethos lane</span>
              <span class="stamp">$25 line</span>
            </div>
            <div class="split split--even">
              <div class="stack">
                <h3>Bring your reputation</h3>
                <p>An owner who proves an Ethos score of 1400 or more can open a new agent's first line at $25 with no bond. Five a day, first come.</p>
              </div>
              <ul class="keylist">
                <li>Line <b>$25</b></li>
                <li>Bond <b>none</b></li>
                <li>Limit <b>5 a day</b></li>
              </ul>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <span class="stamp">3 · Owner's $NASYAI</span>
              <span class="stamp">$25 to $50</span>
            </div>
            <div class="split split--even">
              <div class="stack">
                <h3>Stake your own token</h3>
                <p>The owner locks their own $NASYAI in the seat vault, which backs the line in USDG. A default burns three quarters of the stake.</p>
              </div>
              <ul class="keylist">
                <li>Line <b>$25 to $50, up to $500</b></li>
                <li>Who <b>the agent's owner only</b></li>
                <li>Default <b>75% burned</b></li>
              </ul>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <span class="stamp">4 · A backer</span>
              <span class="stamp">any size</span>
            </div>
            <div class="split split--even">
              <div class="stack">
                <h3>Find someone who vouches</h3>
                <p>A sponsor stakes USDG behind your agent and earns a quarter of every fee it pays. If it defaults, the sponsor's stake repays the pool.</p>
              </div>
              <ul class="keylist">
                <li>Line <b>up to the stake</b></li>
                <li>Backer earns <b>25% of fees</b></li>
                <li>Switch backer <b>between loans</b></li>
              </ul>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <span class="stamp">5 · Stock line</span>
              <span class="stamp">50% of value</span>
            </div>
            <div class="split split--even">
              <div class="stack">
                <h3>Use stock tokens</h3>
                <p>Deposit Robinhood stock tokens and the stock vault backs a line against them, priced by Chainlink. Keep the shares, borrow USDG.</p>
              </div>
              <ul class="keylist">
                <li>Line <b>30% to 50% of the value</b></li>
                <li>Tokens <b>16, live prices</b></li>
                <li><RouterLink class="link" to="/stocks">See the tokens</RouterLink></li>
              </ul>
            </div>
          </div>

          <div class="panel">
            <p class="statement-kicker">Open a seat</p>
            <div class="stack" style="margin-top: 10px">
              <h3>Treasury and stock lines open on the desk</h3>
              <p>Connect the wallet that owns the agent, choose the sponsor, and open the seat or the stock line yourself on the <RouterLink class="link" to="/desk">agent desk</RouterLink>. Lane seats (Ethos) need an off-chain check first: tell us about your agent below.</p>
              <form class="field-row" data-soon-form="Lane requests open once the Ethos check is set up" @submit.prevent="requestLane">
                <div class="field">
                  <label class="field-label" for="sid">ERC-8004 agent id</label>
                  <input class="field-input" id="sid" inputmode="numeric" placeholder="e.g. 482">
                </div>
                <div class="field">
                  <label class="field-label" for="suse">What it will borrow for</label>
                  <input class="field-input" id="suse" placeholder="x402 API calls, compute, inventory…">
                </div>
                <button class="act act--line" type="submit">Request a lane seat</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well well--narrow band-in">
        <div class="callout"><b>Seats are not a way to earn.</b> Backing your own agent with $NASYAI is collateral, not a yield product: the best case is that you get it back. Only stake what you can lose if your agent doesn't repay.</div>
      </div>
    </section>
  </main>
</template>
