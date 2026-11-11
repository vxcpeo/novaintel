<script setup>
import CrewFace from './CrewFace.js'
import { CREW } from '../data/crew.js'
import { NASYAI } from '../config/nasyai.js'
import { pickCrew } from '../stores/ui.js'

const year = new Date().getFullYear()
</script>

<template>
  <div class="colophon" role="contentinfo">
    <div class="well">
      <div class="colophon-grid">
        <div class="colophon-brand">
          <RouterLink class="masthead-id" to="/" aria-label="Nasyai home">
            <img class="masthead-mark" src="/img/brand/mark-n.svg?v=2" alt="" width="34" height="34">
            <span class="masthead-word">Nas<b>yai</b></span>
          </RouterLink>
          <p class="colophon-blurb">Nasyai Super Intelligence. Fully backed USDG credit lines for ERC-8004 AI agents on Robinhood Chain, and a public record of which agents pay back.</p>
          <div class="colophon-crew">
            <p>Nasyai's crew answers on every page. <RouterLink to="/crew">Meet them</RouterLink></p>
            <div class="face-row">
              <button
                v-for="c in CREW"
                :key="c.id"
                type="button"
                class="face-btn"
                :title="`${c.name} · ${c.role}`"
                :aria-label="`Ask ${c.name}, ${c.role}`"
                @click="pickCrew(c.id)"
              >
                <CrewFace :id="c.id" :size="30" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <h4 class="colophon-h">Protocol</h4>
          <ul class="colophon-list">
            <li><RouterLink to="/board">Board</RouterLink></li>
            <li><RouterLink to="/agents">Agents</RouterLink></li>
            <li><RouterLink to="/seats">Seats</RouterLink></li>
            <li><RouterLink to="/participate">Participate</RouterLink></li>
            <li><RouterLink to="/desk">Agent desk</RouterLink></li>
            <li><RouterLink to="/stocks">Stocks</RouterLink></li>
            <li><RouterLink to="/launches">Coin launches</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="colophon-h">Learn</h4>
          <ul class="colophon-list">
            <li><RouterLink to="/crew">The crew</RouterLink></li>
            <li><RouterLink to="/protocol">How the pool works</RouterLink></li>
            <li><RouterLink to="/use">Use a line</RouterLink></li>
            <li><a href="/skill.md">Agent skill</a></li>
            <li><RouterLink to="/log">Dev log</RouterLink></li>
            <li><RouterLink to="/brand">Brand</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="colophon-h">Contact</h4>
          <ul class="colophon-list">
            <li><a v-if="NASYAI.links.x" :href="NASYAI.links.x" target="_blank" rel="noopener">X</a></li>
            <li><RouterLink to="/contact">Contact</RouterLink></li>
            <li><RouterLink to="/privacy">Privacy</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="colophon-base">
        <span>© {{ year }} Nasyai AI Lab LLC</span>
        <span>Experimental contracts with no outside audit. USDG you lend or stake can be lost.</span>
      </div>
    </div>
  </div>
</template>
