<script setup>
import CrewGuide from '../components/CrewGuide.vue'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Use a line</p>
          <h1 class="statement-title mega">Credit lines for agents, fully backed.</h1>
          <p class="statement-lede">Working capital for software that pays its own way: borrow when a job needs money up front, repay when the job pays, and keep the record that proves it.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="band-head">
          <h2 class="display-lg">What it is for</h2>
        </div>
        <div class="beats">
          <div class="beat">
            <h3>Paid APIs over x402</h3>
            <p class="beat-note">Pay per call for data, search or models before the client pays you.</p>
          </div>
          <div class="beat">
            <h3>Gas and fees</h3>
            <p class="beat-note">Keep an agent's wallet topped up so a job never stalls on an empty balance.</p>
          </div>
          <div class="beat">
            <h3>Hiring other agents</h3>
            <p class="beat-note">Buy minutes from a worker agent and settle when the work is accepted.</p>
          </div>
          <div class="beat">
            <h3>Inventory</h3>
            <p class="beat-note">Front the cost of a trade, a listing or a print run and repay from the sale.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="split split--wide">
          <div class="stack" style="gap: clamp(14px, 2vw, 22px)">
            <h2 class="display-md">How, in three steps</h2>
            <p class="lede">From a terminal or from inside the agent. The same calls work over MCP once the hosted server opens.</p>
            <ul class="tick-list">
              <li><b>Join.</b> Register an ERC-8004 identity for the key that owns the agent, or bring the one you have.</li>
              <li><b>Borrow.</b> Take what the job needs, for as long as it needs, inside the line.</li>
              <li><b>Repay.</b> Principal plus fee, before the due date. Hold at least 7 days for it to count.</li>
            </ul>
          </div>
          <pre class="codeblock"><code><span class="tok-c"># the SDK and CLI ship later; the contracts are live</span>
<span class="tok-p">$</span> export NASYAI_KEY=0x…        <span class="tok-c"># env or .env only, never on a command line</span>
<span class="tok-p">$</span> npx nasyai join            <span class="tok-c"># registers an ERC-8004 identity, prints its id</span>
<span class="tok-p">$</span> npx nasyai join --invite &lt;code&gt;
<span class="tok-p">$</span> npx nasyai borrow 5 --days 14
<span class="tok-c">  … the agent does its work …</span>
<span class="tok-p">$</span> npx nasyai repay --all
<span class="tok-p">$</span> npx nasyai status</code></pre>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="grid-2">
          <div class="panel stack">
            <h2 class="display-sm">What it costs</h2>
            <p>1% per 30 days, charged by the day, one day minimum. The fee is fixed when you borrow.</p>
            <ul class="keylist">
              <li>$5 for 7 days <b>≈ $0.012</b></li>
              <li>$5 for 14 days <b>≈ $0.023</b></li>
              <li>$50 for 30 days <b>$0.50</b></li>
              <li>$500 for 30 days <b>$5.00</b></li>
            </ul>
          </div>
          <div class="panel stack">
            <h2 class="display-sm">The rules, plainly</h2>
            <ul class="tick-list">
              <li>The agent borrows only when its owner wants it to. The skill file says so in its first line.</li>
              <li>A loan held under 7 days settles fine but barely adds to the score.</li>
              <li>Late is better than never: it counts at half.</li>
              <li>Seven days past due, anyone can mark the loan defaulted. The backer pays; the record keeps it.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
