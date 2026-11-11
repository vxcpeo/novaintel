<script setup>
import CrewGuide from '../components/CrewGuide.vue'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Dev log</p>
          <h1 class="statement-title mega">Every release, with the details.</h1>
          <p class="statement-lede">What changed, why, and what is still open. Newest first.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well well--narrow band-in">
        <ol class="steps">
          <li class="step">
            <span class="step-no"></span>
            <div class="stack" style="gap: clamp(10px, 1.4vw, 16px)">
              <div class="cluster" style="justify-content: space-between">
                <span class="stamp">Desk</span>
                <span class="small-note">2026-11-08</span>
              </div>
              <h3>The agent desk and wallet buttons</h3>
              <p>Connect a wallet (any EIP-6963 browser wallet; Robinhood Chain is added for you) and do everything from the site: create an ERC-8004 agent, choose its sponsor, open a treasury seat or a stock line, borrow, repay, get the bond back, close a line. On Participate, lend and withdraw USDG, or stake as a sponsor and set lines for agents that chose you. Every refusal comes back in plain words before your wallet opens.</p>
              <p>Tested end to end in a real browser against a fork of Robinhood Chain with the live contracts: 28 checks, from a new agent to a returned bond.</p>
            </div>
          </li>

          <li class="step">
            <span class="step-no"></span>
            <div class="stack" style="gap: clamp(10px, 1.4vw, 16px)">
              <div class="cluster" style="justify-content: space-between">
                <span class="stamp">Contracts</span>
                <span class="small-note">2026-11-08</span>
              </div>
              <h3>The pool is live on Robinhood Chain</h3>
              <p>Four contracts: NasyaiPool (lenders, sponsors, lines, loans, defaults), NasyaiTreasury (bonded $5 first lines and the signed lane), NasyaiSeatVault (an owner's $NASYAI behind their agent) and NasyaiStockVault (stock tokens priced by Chainlink). 55 tests pass, including invariant runs that throw thousands of random deposits, loans, repayments and defaults at the pool and check that the share price never falls, that every lender can leave at once, and that every line stays covered.</p>
              <p>They also ran against Robinhood Chain itself on a local fork first: a real ERC-8004 registration, real USDG and a TSLA stock line priced by its live feed.</p>
              <p><strong>Deployed</strong> at block 108,855,338 and verified on Sourcify (exact match): NasyaiPool <code>0x3b84…205f</code>, NasyaiTreasury <code>0x9882…7Fb2</code>, NasyaiStockVault <code>0x75c9…Adad</code>, with all 16 stock tokens set. Full addresses are on the protocol page.</p>
              <p><strong>Still to come:</strong> USDG staked behind the treasury and the stock vault (no first line or stock line can open until then), the lane signer, wallet buttons on this site, the seat vault (it needs $NASYAI) and the SDK. No outside audit.</p>
            </div>
          </li>

          <li class="step">
            <span class="step-no"></span>
            <div class="stack" style="gap: clamp(10px, 1.4vw, 16px)">
              <div class="cluster" style="justify-content: space-between">
                <span class="stamp">Site</span>
                <span class="small-note">2026-11-08</span>
              </div>
              <h3>Nasyai opens its doors</h3>
              <p>The site is up at nasyai.top with the protocol written down in full: how lines open, what a default does, the Nasyai Score and every launch parameter. Two things already read Robinhood Chain live: the agent lookup reads the ERC-8004 identity registry, and the stock page prices 16 stock tokens from their Chainlink feeds.</p>
              <p><strong>Still open:</strong> the pool, treasury and vault contracts, the SDK and CLI, the hosted MCP server and the $NASYAI contract address. Each switches on here when it ships.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>
