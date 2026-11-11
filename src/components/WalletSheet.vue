<script setup>
import { watch } from 'vue'
import { sheet, closeSheet, confirmRequest, chooseWallet, disconnect } from '../composables/wallet.js'

watch(
  () => sheet.open,
  (v) => {
    document.documentElement.style.overflow = v ? 'hidden' : ''
  },
)

function onKey(e) {
  if (e.key !== 'Escape' || !sheet.open) return
  closeSheet()
}
if (typeof window !== 'undefined') window.addEventListener('keydown', onKey)
</script>

<template>
  <div v-if="sheet.open" class="sheet-veil" @click.self="closeSheet">
    <div class="sheet-card" role="dialog" aria-modal="true" :aria-label="sheet.title">
      <div class="wallet-head">
        <span class="wallet-dot" aria-hidden="true"></span>
        <h3>{{ sheet.title }}</h3>
      </div>
      <p class="wallet-text">{{ sheet.text }}</p>
      <p v-if="sheet.code" class="wallet-addr"><code>{{ sheet.code }}</code></p>

      <ul v-if="sheet.rows.length" class="wallet-rows">
        <li v-for="row in sheet.rows" :key="row.k">
          <span>{{ row.k }}</span>
          <b>{{ row.v }}</b>
        </li>
      </ul>

      <div v-if="sheet.mode === 'pending'" class="wallet-progress" aria-hidden="true">
        <i></i><i></i><i></i>
      </div>

      <div v-if="sheet.list.length" class="wallet-list">
        <button v-for="w in sheet.list" :key="w.rdns" type="button" class="act act--line" @click="chooseWallet(w.rdns)">
          <img v-if="w.icon && /^data:image\//.test(w.icon)" :src="w.icon" alt="">
          <span>{{ w.name }}</span>
          <span class="wallet-chev" aria-hidden="true">→</span>
        </button>
      </div>

      <div v-if="sheet.mode === 'connected'" class="wallet-list">
        <RouterLink class="act act--line" to="/desk" @click="closeSheet"><span>Open the agent desk</span></RouterLink>
        <button type="button" class="act act--line" @click="disconnect"><span>Disconnect here</span></button>
      </div>

      <div class="panel-foot">
        <template v-if="sheet.mode === 'tx' || sheet.mode === 'sign'">
          <button class="act act--line act--sm" type="button" @click="closeSheet">{{ sheet.rejectLabel }}</button>
          <button class="act act--solid act--sm" type="button" @click="confirmRequest">{{ sheet.acceptLabel }}</button>
        </template>
        <template v-else-if="sheet.mode === 'pending' || sheet.mode === 'sent'">
          <span class="wallet-state">{{ sheet.stateLabel }}</span>
        </template>
        <template v-else>
          <span class="wallet-state">{{ sheet.balanceLabel }}</span>
          <button class="act act--line act--sm" type="button" @click="closeSheet">Close</button>
        </template>
      </div>
    </div>
  </div>
</template>
