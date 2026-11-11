<script setup>
import CrewGuide from '../components/CrewGuide.vue'
import CrewCards from '../components/CrewCards.vue'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Brand</p>
          <h1 class="statement-title mega">An N, stamped on the plate.</h1>
          <p class="statement-lede">The mark is a monogram: a heavy grotesque N drawn on a 256 grid as two stems and one diagonal, printed in paper white on the accent plate. Three shapes, two colours, no gradient, no effects. It sets beside the wordmark the way a stamp sets beside a signature, and it still reads as a letter at 16 pixels.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="grid-3">
          <div class="panel" style="display: grid; place-items: center">
            <img src="/img/brand/mark-n.svg?v=2" alt="Nasyai mark" width="180" height="180">
          </div>
          <div class="panel" style="display: grid; place-items: center">
            <span class="cluster">
              <img src="/img/brand/mark-n.svg?v=2" alt="" width="64" height="64">
              <span class="display-sm">Nas<b>yai</b></span>
            </span>
          </div>
          <div class="panel" style="display: grid; place-items: center; background: #fff">
            <img src="/img/brand/mark-n.svg?v=2" alt="Nasyai mark on white" width="120" height="120">
          </div>
        </div>
        <div class="cluster" style="margin-top: 22px">
          <a class="act act--line act--sm" href="/img/brand/mark-n.svg?v=2" download="mark-n.svg">mark-n.svg</a>
          <a class="act act--line act--sm" href="/img/brand/mark-512.png?v=2" download="mark-512.png">mark-512.png</a>
          <a class="act act--line act--sm" href="/img/brand/n.svg?v=2" download="n.svg">n.svg</a>
          <a class="act act--line act--sm" href="/img/brand/x-avatar.png?v=2" download="x-avatar.png">x-avatar.png</a>
          <a class="act act--line act--sm" href="/img/brand/x-banner.png?v=2" download="x-banner.png">x-banner.png</a>
          <a class="act act--line act--sm" href="/og.png?v=2" download="og.png">og.png</a>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">Palette</h2>
        </div>
        <p class="lede" style="max-width: 78ch; margin-bottom: clamp(14px, 2vw, 22px)">Paper, ink and one signal. The ground is a warm off-white, the type is near-black, and red is reserved for the plate, the actions and the thing you have to read.</p>
        <div class="grid-4">
          <div class="panel stack">
            <div style="background: #FAFAF9; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Paper</b> <code>#FAFAF9</code> · ground</p>
          </div>
          <div class="panel stack">
            <div style="background: #FFFFFF; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Sheet</b> <code>#FFFFFF</code> · cards, panels</p>
          </div>
          <div class="panel stack">
            <div style="background: #FFE3D6; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Tint</b> <code>#FFE3D6</code> · highlight bands</p>
          </div>
          <div class="panel stack">
            <div style="background: #161616; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Ink</b> <code>#161616</code> · text, rules</p>
          </div>
          <div class="panel stack">
            <div style="background: #6E625C; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Dust</b> <code>#6E625C</code> · secondary text</p>
          </div>
          <div class="panel stack">
            <div style="background: #FF0421; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Signal red</b> <code>#FF0421</code> · the plate, actions</p>
          </div>
          <div class="panel stack">
            <div style="background: #C1000C; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Deep red</b> <code>#C1000C</code> · links, focus</p>
          </div>
          <div class="panel stack">
            <div style="background: #FF7A00; height: 64px; border: 2px solid var(--ink)"></div>
            <p><b>Second</b> <code>#FF7A00</code> · the other signal</p>
          </div>
        </div>
        <p class="dim" style="margin-top: 16px">Status colours stay in the ledger: repaid <code>#1E6B47</code>, default <code>#B00016</code>, pending <code>#8F4B00</code>. They never appear in the mark.</p>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">Type</h2>
        </div>
        <div class="grid-2">
          <div class="panel stack">
            <p class="statement-kicker">Headlines</p>
            <p class="display-md">Arial Black</p>
            <p class="dim">Uppercase, tight tracking, no weight below black.</p>
          </div>
          <div class="panel stack">
            <p class="statement-kicker">Wordmark</p>
            <p class="display-md">NASY<span class="accent-bar">AI</span></p>
            <p class="dim">Arial Black, the last two letters on the plate.</p>
          </div>
          <div class="panel stack">
            <p class="statement-kicker">Body</p>
            <p class="lede">Arial for everything you read. Calm, neutral, and out of the way of the numbers.</p>
          </div>
          <div class="panel stack">
            <p class="statement-kicker">Numbers</p>
            <p class="data-pair"><b>$410.42 · #482 · 0x8004…a432</b></p>
            <p class="dim">Courier New for amounts, ids and addresses.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">The crew</h2>
        </div>
        <p class="lede" style="max-width: 78ch; margin-bottom: clamp(14px, 2vw, 22px)">Eight characters answer on every page, one shape and two eyes each. Each page has a guide from the crew, and the whole crew lives on <RouterLink class="link link--plain" to="/crew">the crew page</RouterLink>.</p>
        <div class="grid-4"><CrewCards /></div>
      </div>
    </section>
  </main>
</template>
