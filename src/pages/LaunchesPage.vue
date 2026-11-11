<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CrewGuide from '../components/CrewGuide.vue'
import CrewNote from '../components/CrewNote.vue'
import { LAUNCHES } from '../data/launches.js'
import { toast } from '../composables/toast.js'

const now = ref(Date.now())
let timer = 0

const L = LAUNCHES
const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—')
const initials = (t) => String(t || '?').slice(0, 2)

function usd(n, small = false) {
  if (n == null) return '—'
  if (small && n < 0.01) return '$' + Number(n.toPrecision(3)).toString()
  const a = Math.abs(n)
  if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (a >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (a >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K'
  return '$' + n.toFixed(small ? 4 : 0)
}

function ago(iso) {
  const s = Math.max(0, (now.value - Date.parse(iso)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const rows = computed(() =>
  L.items.map((c) => ({
    ...c,
    m: c.market || {},
    shortToken: short(c.token),
    when: ago(c.at),
  })),
)

const leftNote = computed(() =>
  L.launcher.ready
    ? `ready · ${L.launcher.balance_eth != null ? L.launcher.balance_eth.toFixed(4) : '?'} ETH`
    : 'paused: the launcher needs ETH',
)

const failed = ref({})
function onImgError(sym) {
  failed.value = { ...failed.value, [sym]: true }
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast('Copied')
  } catch {
    toast('Select and copy it by hand')
  }
}

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 60000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">Launch from X</p>
          <h1 class="statement-title mega">Coins launched by replying to Nasyai.</h1>
          <p class="statement-lede">A $NASYAI holder posts <code>@nasyai_top launch Name $TICKER</code> and Nasyai launches it on the Pons launchpad, paying the fee and gas. Its 2% creator fee goes to the holder. Every launch, with its live market.</p>
          <CrewGuide />
          <div class="statement-actions">
            <a class="act act--solid" href="#coins">See the coins</a>
            <RouterLink class="link" to="/nasyai#x">How launching works</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="beats">
          <div class="beat">
            <div class="beat-cap">Coins launched</div>
            <div class="beat-figure">{{ L.total }}</div>
            <div class="beat-note">through Nasyai on X</div>
          </div>
          <div class="beat">
            <div class="beat-cap">Today</div>
            <div class="beat-figure beat-figure--violet">{{ L.today.used }} / {{ L.today.cap }}</div>
            <div class="beat-note">launches, resets 00:00 UTC</div>
          </div>
          <div class="beat">
            <div class="beat-cap">Launcher</div>
            <div class="beat-figure beat-figure--mint">{{ L.launcher.launches_left }}</div>
            <div class="beat-note">{{ leftNote }}</div>
          </div>
          <div class="beat">
            <div class="beat-cap">Creator fee</div>
            <div class="beat-figure beat-figure--gold">{{ L.creator_fee_pct }}%</div>
            <div class="beat-note">of every trade, to the holder</div>
          </div>
        </div>
      </div>
    </section>

    <section id="coins" class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">Every coin, live</h2>
        </div>
        <p class="lede" style="margin-bottom: clamp(16px, 2vw, 26px)">Price, market cap, liquidity and 24 hour volume from GeckoTerminal, read about once a minute. A coin launched a moment ago can take a few minutes to show its market.</p>
        <div class="ledger-wrap">
          <div class="panel-head" style="padding: 10px 12px 0; border-bottom: 0">
            <span>{{ L.items.length }} coin{{ L.items.length === 1 ? '' : 's' }} launched from X · Robinhood Chain</span>
            <span class="stamp" :class="L.launcher.ready ? 'live' : 'soon'">{{ L.launcher.ready ? 'Launches open' : 'Launches paused' }}</span>
          </div>
          <table class="ledger">
            <thead>
              <tr><th>Coin</th><th>Launched by</th><th class="num-right">Price</th><th class="num-right">Market cap</th><th class="num-right">Liquidity</th><th class="num-right">24h volume</th><th>Contract</th><th class="num-right">When</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="c in rows" :key="c.token">
                <td>
                  <div class="cluster">
                    <span v-if="failed[c.symbol]" class="coin-chip" style="width: 34px; height: 34px; padding: 0; justify-content: center">{{ initials(c.symbol) }}</span>
                    <span v-else class="stock-coin" style="width: 34px; height: 34px">
                      <img :src="c.m.image || c.logo" alt="" loading="lazy" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover" @error="onImgError(c.symbol)">
                    </span>
                    <span><b>{{ c.name }}</b><br><span class="quiet">${{ c.symbol }}</span></span>
                  </div>
                </td>
                <td><span>@{{ c.user }}</span></td>
                <td class="num-right type-mon">{{ usd(c.m.price_usd, true) }}</td>
                <td class="num-right type-mon">{{ usd(c.m.market_cap_usd) }}</td>
                <td class="num-right type-mon">{{ usd(c.m.liquidity_usd) }}</td>
                <td class="num-right type-mon">{{ usd(c.m.volume_24h_usd) }}</td>
                <td><button class="stamp" type="button" title="Copy the contract" @click="copy(c.token)">{{ c.shortToken }}</button></td>
                <td class="num-right quiet">{{ c.when }}</td>
                <td class="num-right"><button class="act act--line act--sm" type="button" @click="copy(c.token)">Chart and buy</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">Launch yours, in three steps</h2>
        </div>
        <div class="grid-3">
          <div class="panel stack">
            <span class="step-no">01</span>
            <h3>Hold and link</h3>
            <p>Hold 10,000 $NASYAI and link your X account once on <RouterLink to="/nasyai#holder">the $NASYAI page</RouterLink>.</p>
          </div>
          <div class="panel stack">
            <span class="step-no">02</span>
            <h3>Reply to Nasyai</h3>
            <p>Post <code>@nasyai_top launch Name $TICKER</code> anywhere on X. Attach an image for the logo, or your profile picture is used.</p>
          </div>
          <div class="panel stack">
            <span class="step-no">03</span>
            <h3>It goes live</h3>
            <p>Nasyai launches it on Pons, pays the fee and gas, and replies with a card that shows the contract. You earn its 2% creator fee.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in">
        <div class="grid-2">
          <article class="panel stack">
            <h2 class="display-sm">The rules</h2>
            <ul class="keylist">
              <li>Who <b>X accounts linked to 10,000 $NASYAI</b></li>
              <li>Per account <b>1 launch a day</b></li>
              <li>In all <b>20 launches a day</b></li>
              <li>Ticker <b>2 to 10 letters or digits, once each</b></li>
              <li>Creator fee <b>2% of trades, to your linked wallet</b></li>
              <li>Costs you <b>nothing: Nasyai pays fee and gas</b></li>
            </ul>
          </article>
          <article class="panel stack">
            <h2 class="display-sm">Read this first</h2>
            <ul class="tick-list">
              <li><b>These coins are not endorsed by Nasyai.</b> Each one belongs to the holder who launched it.</li>
              <li><b>New coins are risky.</b> Most lose their value. Check the market before you buy.</li>
              <li><b>Names and tickers that belong to others are refused</b>, and so is $NASYAI.</li>
              <li><b>Not financial advice.</b> The contracts are the source of truth.</li>
            </ul>
            <CrewNote id="warden"><p>Before you buy a fresh coin, tag Nasyai with its ticker: it reads the market and what people on X are saying.</p></CrewNote>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
