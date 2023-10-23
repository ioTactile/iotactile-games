<template>
  <td class="text-center border-lighter">
    <div v-for="player in players" :key="player.id">
      <v-btn
        v-if="isDices && isPlayerTurn(player) && player.score === null"
        :disabled="playerAction(player)"
        variant="plain"
        height="23"
        rounded="0"
        class="indie-flower"
        @click="saveInput(player)"
      >
        {{ inputValue(player) }}
      </v-btn>
      <span v-else class="indie-flower">
        {{ player.score !== null ? player.score : '' }}
      </span>
    </div>
  </td>
</template>

<script lang="ts" setup>
import { VBtn } from 'vuetify/components'

const props = defineProps<{
  players: CardUser[]
  playerTurnId: string
  isDices: boolean
}>()

// const emits = defineEmits<{(e: 'saveInputOne', value: number): void}>()

const isPlayerTurn = (player: CardUser) => {
  return player.id === props.playerTurnId
}
</script>

<style scoped>
.border-lighter {
  border-right: 1px solid rgb(var(--v-theme-diceBorder));
}
</style>
