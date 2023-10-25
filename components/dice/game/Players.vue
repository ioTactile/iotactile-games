<template>
  <div class="d-flex">
    <div v-for="player in players" :key="player.id" />
  </div>
</template>

<script setup lang="ts">
import { type CardUser } from '~/functions/src/types'

defineProps<{
  players: CardUser[]
  playerTurnId: string
}>()
</script>
