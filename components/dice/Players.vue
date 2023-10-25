<template>
  <v-row>
    <v-col v-for="index in 4" :key="index" cols="3" class="px-0 py-2">
      <dice-player-card
        :player="getPlayer(index)"
        :order-letter="getLetter(index)"
        :is-player-turn="getPlayer(index)?.id === playerTurnId"
        :is-finished="isFinished"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { VRow, VCol } from 'vuetify/components'
import type { CardUser } from '~/functions/src/types'

// Props

const props = defineProps<{
  players: CardUser[]
  playerTurnId: string
  isFinished: boolean
}>()

const getLetter = (index: number) => {
  if (index === 1) {
    return 'A'
  }
  if (index === 2) {
    return 'B'
  }
  if (index === 3) {
    return 'C'
  }
  if (index === 4) {
    return 'D'
  }
}

const getPlayer = (index: number) => {
  return props.players[index - 1]
}
</script>
