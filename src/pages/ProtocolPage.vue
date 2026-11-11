<script setup>
import CrewGuide from '../components/CrewGuide.vue'
import CrewNote from '../components/CrewNote.vue'
import { NASYAI } from '../config/nasyai.js'

const contracts = [
  ['ERC-8004 identity registry', NASYAI.contracts.registry],
  ['Credit pool', NASYAI.contracts.pool],
  ['Treasury', NASYAI.contracts.treasury],
  ['Seat vault', NASYAI.contracts.seatVault],
  ['Stock vault', NASYAI.contracts.stockVault],
  ['USDG', NASYAI.contracts.usdg],
]

</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Protocol</p>
          <h1 class="statement-title">How the pool works, in full.</h1>
          <p class="statement-lede">One pool of USDG, lines that are always fully backed, and a score built from repayments alone. This page is the plain-language spec; the contracts are the source of truth.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="spec">
          <nav class="spec-nav" aria-label="On this page">
            <a href="#model">Model</a><a href="#lifecycle">Loan lifecycle</a><a href="#default">What a default does</a><a href="#score">Nasyai Score</a><a href="#invariants">Invariants</a><a href="#parameters">Parameters</a><a href="#token">$NASYAI and the treasury</a><a href="#interface">Interface</a><a href="#addresses">Addresses</a><a href="#security">Security</a>
          </nav>

          <section class="spec-sec" id="model">
            <h2 class="display-md">Model</h2>
            <p class="lede">Three roles share one pool on Robinhood Chain.</p>
            <ul class="bullets">
              <li><strong>Lenders</strong> deposit USDG and hold pool shares. They take 50% of every fee.</li>
              <li><strong>Backers</strong> (the treasury, sponsors, seat vaults, stock vaults, or an owner staking $NASYAI) lock value behind one agent's line. They take 25% of that agent's fees and cover its defaults.</li>
              <li><strong>Agents</strong> are ERC-8004 identities. An agent borrows inside its line, from its own wallet, and builds a record by repaying.</li>
            </ul>
            <p class="dim">A line can never exceed what backs it. The pool lends lenders' USDG, but a lender's deposit is never the thing that pays for a default.</p>
          </section>

          <section class="spec-sec" id="lifecycle">
            <h2 class="display-md">Loan lifecycle</h2>
            <ol class="steps">
              <li class="step">
                <span class="step-no"></span>
                <div><strong>Consent.</strong><span>The agent's owner chooses its sponsor on the pool, <code>setSponsor(agentId, sponsor)</code>. Only the owner can, and only while the agent owes nothing.</span></div>
              </li>
              <li class="step">
                <span class="step-no"></span>
                <div><strong>Line opened.</strong><span>The backer's stake is locked for the full line. <code>LineOpened(agentId, backer, amount)</code></span></div>
              </li>
              <li class="step">
                <span class="step-no"></span>
                <div><strong>Borrow.</strong><span>The agent draws up to its free line for 1 to 30 days. Amount, due time and fee are fixed now. <code>Borrowed(agentId, loanId, amount, due, fee)</code></span></div>
              </li>
              <li class="step">
                <span class="step-no"></span>
                <div><strong>Repay.</strong><span>Principal plus fee, any time before it is due. The fee splits 50 / 25 / 25. <code>Repaid(agentId, loanId, amount, fee)</code></span></div>
              </li>
              <li class="step">
                <span class="step-no"></span>
                <div><strong>Late.</strong><span>Repaying after the due time still settles the loan, but it counts for less in the score.</span></div>
              </li>
            </ol>
          </section>

          <section class="spec-sec" id="default">
            <h2 class="display-md">What a default does</h2>
            <p class="lede">Seven days after the due time, anyone can mark an unpaid loan as defaulted. The backer's locked stake repays the pool the principal plus the fee, in full, in the same transaction. Lenders are made whole; the backer takes the loss; the agent's record shows the default permanently. For an owner's $NASYAI stake, three quarters of the slashed amount burns and the rest returns to the owner. For a stock line, the vault takes tokens worth what was owed plus 20% at the feed price and returns the rest.</p>
          </section>

          <section class="spec-sec" id="score">
            <h2 class="display-md">Nasyai Score</h2>
            <p class="lede">A number from 0 to 1000, recomputed from events, never stored by hand.</p>
            <ul class="bullets">
              <li>The base is <strong>dollar-days repaid on time</strong>: amount × days held, for loans held 7 days or more.</li>
              <li>Debt someone else put at risk counts in full. Debt backed only by the agent owner's own collateral counts at a quarter.</li>
              <li>A late repayment counts at half. A default subtracts heavily and caps the score at 600 for good.</li>
              <li>The curve is logarithmic, so the first month matters and farming size matters less.</li>
            </ul>
            <pre class="codeblock"><code><span class="tok-c">// sketch; the reference implementation ships with the SDK</span>
score = min(1000, 140 * ln(1 + weighted_dollar_days / 100))
weighted_dollar_days = Σ amount × days × backing_weight × timing_weight
backing_weight = 1.0 (someone else's stake) | 0.25 (owner's own)
timing_weight  = 1.0 (on time) | 0.5 (late) ; loans under 7 days = 0.05</code></pre>
            <CrewNote id="scout"><p>That is the formula behind every record I read. Give me an agent's id and I'll show you where its score comes from.</p></CrewNote>
          </section>

          <section class="spec-sec" id="invariants">
            <h2 class="display-md">Invariants</h2>
            <ul class="tick-list">
              <li>For every agent: open principal ≤ line ≤ locked backing.</li>
              <li>A default is always repaid from backing in the same call; pool assets never fall because of one.</li>
              <li>Withdrawals are paid from idle USDG and never wait for agents to repay.</li>
              <li>Only the agent's owner, or a wallet the owner named as its operator, can borrow, and the USDG goes to that caller.</li>
              <li>New stake cannot leave for a day, so nobody can stake just around a default or a repayment.</li>
              <li>A sponsor may name a view-only guard the pool asks before each loan on its lines; it can refuse a loan, never block a repayment.</li>
              <li>Parameters move inside hard bounds written into the contract.</li>
            </ul>
          </section>

          <section class="spec-sec" id="parameters">
            <h2 class="display-md">Parameters</h2>
            <div class="ledger-wrap">
              <table class="ledger">
                <tbody>
                  <tr><td class="type-mon">Fee</td><td><span data-param="feePer30d">1%</span> per 30 days, by the day, 1 day minimum</td></tr>
                  <tr><td class="type-mon">Fee split</td><td><span data-param="lenderShare">50%</span> lenders · <span data-param="backerShare">25%</span> backer · <span data-param="treasuryShare">25%</span> treasury</td></tr>
                  <tr><td class="type-mon">Loan length</td><td>1 to 30 days</td></tr>
                  <tr><td class="type-mon">Counts toward score</td><td><span data-param="minHoldDays">7</span> days held or more</td></tr>
                  <tr><td class="type-mon">Treasury first line</td><td><span data-param="firstLine">$5</span>, with a <span data-param="bond">$5</span> refundable bond</td></tr>
                  <tr><td class="type-mon">Ethos lane</td><td>$25 first line, Ethos ≥ 1400, no bond, 5 a day</td></tr>
                  <tr><td class="type-mon">Largest line</td><td><span data-param="maxLine">$500</span></td></tr>
                  <tr><td class="type-mon">Stock line</td><td>30% to 50% of value by token, capped at $500, default penalty <span data-param="defaultPenalty">20%</span></td></tr>
                  <tr><td class="type-mon">Early exit (lenders)</td><td>0.5% within 7 days of a deposit</td></tr>
                  <tr><td class="type-mon">Grace before default</td><td>7 days after due</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="spec-sec" id="token">
            <h2 class="display-md">$NASYAI and the treasury</h2>
            <p class="lede">$NASYAI is the Nasyai token on Robinhood Chain. It has two jobs in the protocol: an agent's owner can lock it as collateral behind their own agent, and part of what the protocol earns buys it back. Creator fees from $NASYAI fund the treasury, and the treasury funds the $5 first lines. The treasury is topped up in USDG.</p>
            <div class="addr"><span class="stamp">$NASYAI</span><code>{{ NASYAI.token.ca }}</code></div>
          </section>

          <section class="spec-sec" id="interface">
            <h2 class="display-md">Interface</h2>
            <p class="lede">Read-only checks need no key: any app can ask whether to trust an agent before paying it.</p>
            <pre class="codeblock"><code><span class="tok-c">// NasyaiPool: reads</span>
getAgent(agentId)              <span class="tok-c">→ sponsor, line, principalOut, loansRepaid, qualifiedOnTime, weightedDollarDays, defaults…</span>
loansOf(agentId) · getLoan(loanId) · stats()
canBorrow(agentId, amount, term) <span class="tok-c">→ (ok, fee)</span>
quoteFee(amount, term)

<span class="tok-c">// agents (the ERC-8004 owner)</span>
setSponsor(agentId, sponsor) · setOperator(agentId, operator)
borrow(agentId, amount, term, maxFee)
repay(loanId, maxDue)          <span class="tok-c">// anyone may repay</span>
markDefault(loanId)            <span class="tok-c">// anyone, 7 days after due</span>

<span class="tok-c">// lenders and sponsors</span>
deposit(assets, minShares) · withdraw(shares, to, minAssets)
stake(assets) · unstake(shares, to) · setLine(agentId, line) · claimSponsorFees(to)

<span class="tok-c">// sponsor contracts</span>
NasyaiTreasury.open(agentId) · openLane(agentId, deadline, sig) · releaseBond(agentId) · close(agentId)
NasyaiSeatVault.open(agentId, steps, maxCost) · grow(…) · close(agentId) · settle(agentId)
NasyaiStockVault.open(agentId, token, amount) · close(agentId) · settle(agentId)

<span class="tok-c">// check an agent from an agent (the CLI ships later)</span>
<span class="tok-p">$</span> npx nasyai check &lt;agentId&gt;
<span class="tok-c"># an agent record, printed:</span>
<span class="tok-s">#&lt;id&gt; · Nasyai Score 412 (Flare) · 38 repaid · 0 defaults · line $50 backed by sponsor</span></code></pre>
          </section>

          <section class="spec-sec" id="addresses">
            <h2 class="display-md">Addresses</h2>
            <div class="ledger-wrap">
              <table class="ledger">
                <tbody>
                  <template v-for="[label, address] in contracts" :key="label">
                    <tr>
                      <td class="type-mon">{{ label }}</td>
                      <td class="type-mon">{{ address }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <p class="dim">Robinhood Chain, chain id 4663. Every contract will be verified on the explorer at deploy.</p>
          </section>

          <section class="spec-sec" id="security">
            <h2 class="display-md">Security</h2>
            <div class="callout"><b>No outside audit yet.</b> The design removes the largest risk on purpose (lenders never carry unbacked credit), and line sizes start small for the same reason. That is not a proof. Size your exposure like someone who knows an audit hasn't happened.</div>
            <p class="dim">Found something? Write to <b>{{ NASYAI.links.email }}</b> before you write anywhere else. A bounty is coming.</p>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>
