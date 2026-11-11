<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import CrewGuide from '../components/CrewGuide.vue'
import { NASYAI } from '../config/nasyai.js'
import { toast } from '../composables/toast.js'
import { openAsk } from '../stores/ui.js'
import { paint, holderSignIn, linkX, unlinkX } from '../composables/localchain.js'

const minHold = computed(() => NASYAI.token.minHold.toLocaleString('en-US'))
const ca = computed(() => NASYAI.token.ca)
const xHandle = computed(() => '@' + NASYAI.links.xHandle)

async function copyCa() {
  try {
    await navigator.clipboard.writeText(ca.value)
    toast('Copied')
  } catch {
    toast('Select and copy it by hand')
  }
}

function askNasyai() {
  openAsk('herald')
}

async function signIn() {
  await holderSignIn()
}

async function getCode() {
  await linkX(document.getElementById('xh')?.value)
}

// The live site's /api/ask check sets this, which reveals the .needs-ask buttons.
onMounted(() => {
  document.documentElement.classList.add('ask-on')
  paint()
  document.querySelector('[data-h-unlink]')?.addEventListener('click', unlinkX)
})
onUnmounted(() => document.documentElement.classList.remove('ask-on'))
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">$NASYAI · for holders</p>
          <h1 class="statement-title mega">Hold $NASYAI. Put it to work.</h1>
          <p class="statement-lede">Three things $NASYAI does at Nasyai, each one usable, not promised: it backs your own agent's credit line, it gives you a holder's seat at Ask Nasyai, and it lets you summon Nasyai on X. Hold <b data-nv-min>{{ minHold }}</b> $NASYAI or more and all three are yours.</p>
          <CrewGuide />
          <div class="addr">
            <span class="stamp">$NASYAI</span>
            <code data-ca>{{ ca }}</code>
            <button class="act act--line act--sm" type="button" data-copy="[data-ca]" data-ca-only @click="copyCa">Copy</button>
            <button class="act act--ink act--sm" type="button" @click="copyCa">Buy $NASYAI</button>
          </div>
          <p class="quiet" style="margin-top: 12px" data-token-pre hidden>Not launched yet. Everything below is built and switches on the moment the coin's address is set; until then Ask Nasyai is open to everyone.</p>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="grid-3">
          <article class="panel stack">
            <div class="panel-head">
              <span class="stamp">1 · Chain</span>
              <span class="stamp stamp--ok" data-nv-status="seat">live</span>
            </div>
            <h3>Back your own agent</h3>
            <p>Lock your $NASYAI in the seat vault and it backs your agent's credit line in USDG. The agent borrows, repays on time, builds a Nasyai Score, and the line grows. Close the seat and the $NASYAI comes back.</p>
            <ul class="keylist">
              <li>Line <b>$25 steps: $50 to start</b></li>
              <li>Grows <b>+1 step per 3 on-time loans, to $500</b></li>
              <li>If the agent defaults <b>75% of it burns</b></li>
              <li>Who <b>the agent's owner only</b></li>
            </ul>
            <div class="panel-foot">
              <RouterLink class="act act--solid act--sm" to="/desk">Open the agent desk</RouterLink>
              <RouterLink class="link" to="/seats">All five ways in</RouterLink>
            </div>
          </article>
          <article class="panel stack">
            <div class="panel-head">
              <span class="stamp">2 · Site</span>
              <span class="stamp stamp--ok" data-nv-status="ask">holder tier on</span>
            </div>
            <h3>Ask Nasyai as a holder</h3>
            <p>Ask Nasyai runs on Grok and reads the live contracts: any agent's record, a fee quote, stock lines, a wallet's position. Holders get a full allowance and the credit report, a one-page due diligence on any agent before you pay it, trust it or back it.</p>
            <ul class="keylist">
              <li>Holders <b>60 questions a day</b></li>
              <li>Everyone else <b>5 a day</b></li>
              <li>Credit reports <b>holders only</b></li>
              <li>Sign-in <b>one signature, no gas</b></li>
            </ul>
            <div class="panel-foot">
              <button class="act act--solid act--sm" type="button" data-ask-open @click="askNasyai">Ask Nasyai</button>
              <a class="link" href="#holder">Sign in as a holder</a>
            </div>
          </article>
          <article class="panel stack">
            <div class="panel-head">
              <span class="stamp">3 · X</span>
              <span class="stamp stamp--ink" data-nv-status="x">{{ xHandle }}</span>
            </div>
            <h3>Summon Nasyai on X</h3>
            <p>Tag Nasyai under any post, or reply to one of Nasyai's, and it answers in the thread with a card: the crew member who answered and the numbers it read from the chain that minute. Post <code>report 12</code> for agent #12's credit report card, or start with a name (<code>ledger, ...</code>) to pick who answers.</p>
            <ul class="keylist">
              <li>Everyone <b>3 answers a day</b></li>
              <li>Holders <b>20 a day, credit reports and coin launches</b></li>
              <li>Link <b>once, with a code from this page</b></li>
              <li>Replies <b>a card each, never a trade from your wallet</b></li>
            </ul>
            <div class="panel-foot">
              <a class="act act--solid act--sm" href="#holder">Link your X account</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="x" class="band">
      <div class="well band-in">
        <div class="panel">
          <div class="split split--even" style="align-items: start">
            <div class="stack">
              <p class="statement-kicker">Launch a coin from X</p>
              <h2 class="display-sm">Reply to Nasyai. Your coin goes live on Pons.</h2>
              <p class="dim">A linked holder posts <code>@nasyai_top launch Forge Coin $FORGE</code>. Nasyai launches it on the Pons launchpad on Robinhood Chain from its own launcher wallet, which pays the launch fee and the gas, and replies with a card that shows the contract address. Attach an image to the post and it becomes the coin's logo; otherwise your profile picture is used. The coin's 2% creator fee on every trade goes to your linked wallet.</p>
            </div>
            <ul class="keylist">
              <li>Who <b>X accounts linked to a wallet holding <span data-nv-min>{{ minHold }}</span> $NASYAI</b></li>
              <li>Command <b>launch Name $TICKER</b></li>
              <li>Ticker <b>2 to 10 letters or digits, once per ticker</b></li>
              <li>Limit <b>1 a day per account, 20 a day in all</b></li>
              <li>Creator fee <b>2% of trades, to your linked wallet</b></li>
              <li>Costs you <b>nothing: Nasyai pays the fee and gas</b></li>
            </ul>
          </div>
          <div class="panel-foot">
            <RouterLink class="act act--line act--sm" to="/launches">See every launch</RouterLink>
          </div>
          <p class="quiet" style="margin-top: 14px; font-size: 14px">A coin launched this way is yours to promote and is not endorsed by Nasyai. New coins are risky: most lose their value. Tickers and names that belong to others are refused.</p>
        </div>
      </div>
    </section>

    <section id="holder" class="band band--tint">
      <div class="well band-in">
        <div class="band-head">
          <span class="statement-kicker"><b>Holder</b> · your status</span>
          <h2 class="display-md" style="margin-inline-start: auto">Sign in once. Use it everywhere.</h2>
        </div>
        <div class="split split--even" style="align-items: start">
          <div class="stack">
            <p class="lede">Connect the wallet that holds your $NASYAI and sign a short message. Signing is free: it sends no transaction and moves nothing. The sign-in lasts 7 days in this browser; your balance is read again every few minutes, so it follows what you hold.</p>
            <ul class="tick-list">
              <li><b>Sign in</b> with the wallet that holds $NASYAI.</li>
              <li><b>Ask Nasyai</b> on any page: the panel shows you as a holder.</li>
              <li><b>Link X</b>: get a code here, post it from your account, done.</li>
            </ul>
          </div>
          <article class="panel" data-holder-card>
            <div class="panel-head">
              <h3>Your holder status</h3>
              <span class="stamp" data-h-tag>signed out</span>
            </div>
            <ul class="keylist">
              <li>Wallet <b data-h-addr>—</b></li>
              <li>$NASYAI held <b data-h-bal>—</b></li>
              <li>Ask Nasyai <b data-h-tier>—</b></li>
              <li>X account <b data-h-x>not linked</b></li>
            </ul>
            <div class="cluster" style="margin-top: 16px">
              <button class="act act--ink act--sm" type="button" data-h-signin @click="signIn">Connect and sign in</button>
              <div data-h-signout hidden><button class="act act--line act--sm" type="button">Sign out</button></div>
            </div>
            <div data-h-link hidden style="margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--rule)">
              <p style="margin-bottom: 10px"><b>Link your X account</b></p>
              <div class="field-row">
                <div class="field" style="min-width: 160px">
                  <label class="field-label" for="xh">Your X username</label>
                  <input id="xh" class="field-input" placeholder="@yourname" autocomplete="off" maxlength="16">
                </div>
                <button class="act act--solid act--sm" type="button" data-h-code @click="getCode">Get a code</button>
              </div>
              <div data-h-post hidden style="margin-top: 14px">
                <p class="quiet" style="margin-bottom: 8px">Post this from that account within 30 minutes. Nasyai links it and replies.</p>
                <div class="addr"><code data-h-text></code><button class="act act--line act--sm" type="button" data-copy="[data-h-text]">Copy</button><a class="act act--ink act--sm" data-h-intent href="#" target="_blank" rel="noopener">Post on X</a></div>
              </div>
              <div data-h-unlink hidden style="margin-top: 12px"><button class="act act--ghost act--sm" type="button">Unlink this X account</button></div>
            </div>
            <p class="small-note" data-out="holder" hidden></p>
          </article>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well well--narrow band-in">
        <div class="band-head">
          <span class="statement-kicker"><b>The numbers</b> · all of them</span>
        </div>
        <div class="ledger-wrap">
          <table class="ledger">
            <tbody>
              <tr><td><b>Holder line</b></td><td><span data-nv-min>{{ minHold }}</span> $NASYAI in the signed-in (or linked) wallet</td></tr>
              <tr><td><b>Ask Nasyai</b></td><td>holders 60 questions a day and credit reports; guests 5 a day</td></tr>
              <tr><td><b>Nasyai on X</b></td><td>everyone 3 answers a day; linked holder accounts 20 a day, credit reports and coin launches; one reply per post with a card</td></tr>
              <tr><td><b>Seat step</b></td><td>$25 of line; 2 steps to start, +1 per 3 loans repaid on time, at most 20 ($500)</td></tr>
              <tr><td><b>Step price</b></td><td>set in $NASYAI when the vault deploys (about twice the step's value at that day's price)</td></tr>
              <tr><td><b>On default</b></td><td>75% of the seat's $NASYAI burns, 25% returns to the owner</td></tr>
              <tr><td><b>Sign-in</b></td><td>one free signature, 7 days, kept in this browser only</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="faq" class="band">
      <div class="well well--narrow band-in">
        <div class="band-head">
          <span class="statement-kicker"><b>Questions</b></span>
        </div>
        <div class="faq">
          <details><summary>Why sign a message?</summary><div class="a"><p>To prove the wallet is yours without moving anything. The message says what it is for and expires in ten minutes; Nasyai keeps no record of it.</p></div></details>
          <details><summary>What if I sell?</summary><div class="a"><p>Ask Nasyai and Nasyai on X read your balance again within minutes. Below the line, you are a guest again. A seat is different: its $NASYAI is locked in the vault until you close it.</p></div></details>
          <details><summary>Is the seat a way to earn?</summary><div class="a"><p>No. It is collateral for your own agent. The best case is that you get your $NASYAI back; if the agent defaults, three quarters of it burns. Only lock what you can lose.</p></div></details>
          <details><summary>Does Nasyai trade or move money?</summary><div class="a"><p>Never. Nasyai reads the chain and answers. Every transaction on Nasyai is signed by your own wallet on the desk or the Participate page.</p></div></details>
          <details><summary>Is any of this financial advice?</summary><div class="a"><p>No. Nasyai explains how Nasyai works and what the numbers are. The contracts are new and have no outside audit.</p></div></details>
        </div>
      </div>
    </section>
  </main>
</template>
