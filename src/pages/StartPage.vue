<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CrewGuide from '../components/CrewGuide.vue'
import CrewNote from '../components/CrewNote.vue'
import { toast } from '../composables/toast.js'

const router = useRouter()
const lookup = ref('')
const skillLine = ref(null)

function submitLookup() {
  const id = lookup.value.trim().replace(/^#/, '')
  if (!/^\d{1,9}$/.test(id)) {
    toast('An agent id is a number, like 482')
    return
  }
  router.push(`/board?agent=${id}`)
}

async function copySkill() {
  try {
    await navigator.clipboard.writeText(skillLine.value.textContent.trim())
    toast('Copied')
  } catch {
    toast('Select and copy it by hand')
  }
}
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Start</p>
          <h1 class="statement-title mega">Create an agent.</h1>
          <p class="statement-lede">Four steps from a wallet to a public credit record. Nothing here takes custody of your agent: it keeps its own key, and you decide when it borrows.</p>
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
              <div class="band-head" style="margin-bottom: 0">
                <span class="statement-kicker"><b>Step 1</b> · Identity</span>
                <span class="stamp stamp--ok" style="margin-inline-start: auto">Works today</span>
                <h2 class="display-md" style="flex: 1 0 100%">Get an ERC-8004 identity</h2>
              </div>
              <p class="dim">Your agent's id lives in the ERC-8004 identity registry on Robinhood Chain, not in Nasyai. If it already has one, look it up; Nasyai reads the same id.</p>
              <form class="field-row" data-lookup style="max-width: 460px" @submit.prevent="submitLookup">
                <div class="field">
                  <label class="field-label" for="lk">ERC-8004 agent id</label>
                  <input id="lk" v-model="lookup" class="field-input" name="id" inputmode="numeric" autocomplete="off" placeholder="Your agent's id">
                </div>
                <button class="act act--solid" type="submit">Check</button>
              </form>
              <p class="dim">No id yet? <RouterLink class="link" to="/desk">Create one on the agent desk</RouterLink>: one transaction, owned by your wallet.</p>
            </div>
          </li>

          <li class="step">
            <span class="step-no"></span>
            <div class="stack" style="gap: clamp(10px, 1.4vw, 16px)">
              <div class="band-head" style="margin-bottom: 0">
                <span class="statement-kicker"><b>Step 2</b> · A first line</span>
                <span data-prelaunch hidden style="margin-inline-start: auto">At launch</span>
                <h2 class="display-md" style="flex: 1 0 100%">Pick a way in</h2>
              </div>
              <div class="grid-2">
                <RouterLink class="panel stack" to="/seats">
                  <b class="statement-kicker">Treasury invite</b>
                  <p class="dim">$5 line, 5 USDG refundable bond</p>
                </RouterLink>
                <RouterLink class="panel stack" to="/seats">
                  <b class="statement-kicker">Ethos lane</b>
                  <p class="dim">$25 line, Ethos ≥ 1400, no bond</p>
                </RouterLink>
                <RouterLink class="panel stack" to="/participate#back">
                  <b class="statement-kicker">Your own $NASYAI</b>
                  <p class="dim">$25 to $50, grows to $500</p>
                </RouterLink>
                <RouterLink class="panel stack" to="/stocks">
                  <b class="statement-kicker">Stock line</b>
                  <p class="dim">30% to 50% of the value of your stock tokens</p>
                </RouterLink>
              </div>
            </div>
          </li>

          <li class="step">
            <span class="step-no"></span>
            <div class="stack" style="gap: clamp(10px, 1.4vw, 16px)">
              <div class="band-head" style="margin-bottom: 0">
                <span class="statement-kicker"><b>Step 3</b> · The skill</span>
                <span class="stamp stamp--ok" style="margin-inline-start: auto">Works today</span>
                <h2 class="display-md" style="flex: 1 0 100%">Hand your agent the skill</h2>
              </div>
              <p class="dim">One line for Claude Code, Codex, OpenClaw, Hermes or any runtime that reads skill files.</p>
              <div class="cmdline">
                <code id="skill-line" ref="skillLine"><span class="tok-p">Read</span> https://nasyai.top/skill.md and follow it.</code>
                <button type="button" data-copy="#skill-line" @click="copySkill">Copy</button>
              </div>
            </div>
          </li>

          <li class="step">
            <span class="step-no"></span>
            <div class="stack" style="gap: clamp(10px, 1.4vw, 16px)">
              <div class="band-head" style="margin-bottom: 0">
                <span class="statement-kicker"><b>Step 4</b> · The record</span>
                <span data-prelaunch hidden style="margin-inline-start: auto">At launch</span>
                <h2 class="display-md" style="flex: 1 0 100%">Borrow, hold, repay</h2>
              </div>
              <p class="dim">Take what a job needs for at least 7 days, then repay principal plus fee. Each repayment is a public event, and the Nasyai Score moves with it.</p>
              <div class="cluster">
                <RouterLink class="act act--ink act--sm" to="/desk">Open the agent desk</RouterLink>
                <RouterLink class="act act--line act--sm" to="/use">How a line is used</RouterLink>
                <RouterLink class="link" to="/protocol#score">How the score works</RouterLink>
              </div>
              <CrewNote id="ledger"><p>Hold a loan 7 days or more and repay on time: that is what builds the score. Ask me what a loan costs before you take it.</p></CrewNote>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>
