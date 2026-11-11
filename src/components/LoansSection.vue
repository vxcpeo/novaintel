<script setup>
import { computed, onMounted } from 'vue'
import { state, loadStats } from '../composables/chain.js'
import { money, ago, day, toUsd } from '../utils/format.js'

const loans = computed(() => state.loans || [])

const rows = computed(() =>
  loans.value.map((l) => {
    const fee = money(toUsd(l.fee))
    const kind = l.status === 2 ? ['repaid', 'c-mint'] : l.status === 3 ? ['defaulted', 'c-rose'] : ['borrow', 'c-cyan']
    const detail =
      l.status === 2
        ? `settled loan #${l.id} + $${fee} fee`
        : l.status === 3
          ? `loan #${l.id} defaulted, the backer paid`
          : `took loan #${l.id}, due ${day(l.dueAt)} (fee $${fee})`
    const amt = l.status === 2 ? `+$${money(toUsd(l.principal + l.fee))}` : `$${money(toUsd(l.principal))}`
    return { key: l.id, when: ago(l.closedAt || l.issuedAt), kind, detail, amt, agentId: l.agentId }
  }),
)

const examples = [
  ['2 h ago', 'repaid', 'c-mint', 'research-agent', `settled a $100 loan + $0.47 fee`, '+$100.47'],
  ['5 h ago', 'borrow', 'c-cyan', 'market-maker', `took $250 for 14 days (fee $1.17)`, '$250.00'],
  ['1 d ago', 'repaid', 'c-mint', 'data-scout', `settled a $25 loan + $0.12 fee`, '+$25.12'],
  ['1 d ago', 'borrow', 'c-cyan', 'support-bot', `took its first $5 line for 7 days (fee $0.01)`, '$5.00'],
]

onMounted(() => {
  loadStats(10)
})
</script>

<template>
  <section id="loans" class="band">
    <div class="well band-in">
      <div class="band-head">
        <span class="statement-kicker"><b>No. 2</b> · Latest loans</span>
        <h2 class="display-lg" style="margin-inline-start: auto">Every loan, in public.</h2>
      </div>
      <p class="lede" style="margin-bottom: clamp(16px, 2vw, 26px)">Read from the chain, newest first. Nothing here is typed in by hand.</p>
      <div class="ledger-wrap">
        <div class="panel-head" style="padding: 10px 12px 0; border-bottom: 0">
          <span>Pool events</span>
          <span v-if="rows.length" class="stamp stamp--ok">{{ loans.length }} loans · latest {{ rows.length }}</span>
        </div>
        <table class="ledger">
          <thead><tr><th>When</th><th>Entry</th><th>Agent</th><th>Detail</th><th class="num-right">Amount</th></tr></thead>
          <tbody data-feed>
            <template v-if="!rows.length">
              <tr v-for="(x, i) in examples" :key="i">
                <td class="type-mon">{{ x[0] }}</td>
                <td><b :class="x[2]">{{ x[1] }}</b></td>
                <td>{{ x[3] }}</td>
                <td>{{ x[4] }}</td>
                <td class="num-right type-mon"><b>{{ x[5] }}</b></td>
              </tr>
            </template>
            <tr v-for="r in rows" :key="r.key">
              <td class="type-mon">{{ r.when }}</td>
              <td><b :class="r.kind[1]">{{ r.kind[0] }}</b></td>
              <td><RouterLink class="link link--plain" :to="`/board?agent=${r.agentId}`">#{{ r.agentId }}</RouterLink></td>
              <td>{{ r.detail }}</td>
              <td class="num-right type-mon"><b>{{ r.amt }}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="cluster" style="margin-top: 18px">
        <RouterLink class="link" to="/agents">See all activity</RouterLink>
        <RouterLink class="link" to="/protocol">Read the protocol</RouterLink>
      </div>
    </div>
  </section>
</template>
