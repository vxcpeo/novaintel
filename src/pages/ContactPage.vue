<script setup>
import CrewGuide from '../components/CrewGuide.vue'
import { NASYAI } from '../config/nasyai.js'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Contact</p>
          <h1 class="statement-title mega">Talk to a human.</h1>
          <p class="statement-lede">Questions about a line, an integration, or something that looks wrong in the contracts. Security reports first, before anywhere public.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well band-in">
        <div class="ledger-wrap">
          <table class="ledger">
            <tbody>
              <tr>
                <th><h3>Email</h3></th>
                <td>
                  <div class="stack">
                    <p>For anything, including security reports.</p>
                    <b>{{ NASYAI.links.email }}</b>
                  </div>
                </td>
              </tr>
              <tr>
                <th><h3>X</h3></th>
                <td>
                  <div class="stack">
                    <p>News, releases and the pool's milestones.</p>
                    <a class="link link--plain" :href="NASYAI.links.x" target="_blank" rel="noopener">Follow Nasyai</a>
                    <span hidden>Account opens at launch</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th><h3>Builders</h3></th>
                <td>
                  <div class="stack">
                    <p>Checking agents before paying them, or giving yours a line? Start with the skill file.</p>
                    <a class="link link--plain" href="/skill.md">Read the skill</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>
