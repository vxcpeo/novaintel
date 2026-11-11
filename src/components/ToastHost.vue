<script setup>
import { toastState } from '../composables/toast.js'
</script>

<template>
  <div class="toast-stack" role="status" aria-live="polite">
    <div v-if="toastState.on" class="toast-msg">{{ toastState.msg }}</div>
  </div>
</template>
