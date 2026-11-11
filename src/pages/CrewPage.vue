<script setup>
import CrewPane from '../components/CrewPane.vue'
import CrewPageCards from '../components/CrewPageCards.vue'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well band-in">
        <div class="statement">
          <p class="statement-kicker">Ask Nasyai · the crew</p>
          <h1 class="statement-title mega">Meet the crew.</h1>
          <p class="statement-lede">Eight specialists on Grok, one set of live contracts. Pick who to ask: Scout researches agents, Ledger quotes fees, Warden looks for risk, Pilot walks you through the desk. They read Robinhood Chain as it stands and never sign anything.</p>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <CrewPane use-hash />
        <p class="quiet" style="margin-top: 18px; max-width: 74ch">Grok by xAI. The crew reads, never signs. Answers can be wrong and are not financial advice; the contracts are the source of truth. Chats stay in this tab.</p>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">Who does what</h2>
        </div>
        <p class="lede" style="margin-bottom: clamp(14px, 2vw, 22px)">Every member reads the same live contracts and follows the same rules. What changes is the focus, so the answers go deeper where you need them.</p>
        <div class="ledger-wrap">
          <CrewPageCards />
        </div>
      </div>
    </section>

    <section class="band band--tint">
      <div class="well band-in">
        <div class="panel">
          <div class="split split--even" style="align-items: start">
            <div class="stack">
              <p class="statement-kicker">How much you can ask</p>
              <h2 class="display-sm">One allowance for the whole crew.</h2>
              <p class="dim">Questions to any member count once. $NASYAI is live: holders of 10,000 or more get the full allowance and the due diligence room.</p>
            </div>
            <ul class="keylist">
              <li>$NASYAI holders <b>60 a day + credit reports</b></li>
              <li>Everyone else <b>5 a day</b></li>
              <li>Due diligence room <b>holders</b></li>
              <li>Holder sign-in <b><RouterLink class="link" to="/nasyai">on the $NASYAI page</RouterLink></b></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
