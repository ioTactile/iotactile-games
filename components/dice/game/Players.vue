<template>
  <div class="d-flex players-wrapper">
    <button v-for="player in players" :key="player.id">
      {{ player.username }}
    </button>
    <button v-for="player in players" :key="player.id">
      {{ player.username }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CardUser } from '~/functions/src/types'

defineProps<{
  players: CardUser[]
  playerTurnId: string
}>()
</script>

<style scoped lang="scss">
button {
  width: 220px;
  height: 64px;
  background-color: rgb(var(--v-theme-diceMainTertiary));
  color: white;
  font-size: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.3);
  cursor: default;
}

button:not(:last-child) {
  margin-right: 16px;
}
</style>
