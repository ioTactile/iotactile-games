<template>
  <v-row>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2 yellow-plate card-container"
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">A</span>
          <span>{{ players[0]?.username }}</span>
          <v-spacer />
          <v-img v-if="!isFinished && playerTurnId === players[0].id" src="https://media.tenor.com/LG4kcNOmsw4AAAAi/noisy-chicken.gif" alt="Noisy Chicken" height="32" />
        </div>
      </v-card>
    </v-col>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2 yellow-plate card-container"
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">B</span>
          <span>{{ players[1]?.username }}</span>
          <v-spacer />
          <v-img v-if="playerTurnId === players[1]?.id" src="https://media.tenor.com/LG4kcNOmsw4AAAAi/noisy-chicken.gif" alt="Noisy Chicken" height="32" />
        </div>
      </v-card>
    </v-col>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2 yellow-plate card-container"
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">C</span>
          <span>{{ players[2]?.username }}</span>
          <v-spacer />
          <v-img v-if="playerTurnId === players[2]?.id" src="https://media.tenor.com/LG4kcNOmsw4AAAAi/noisy-chicken.gif" alt="Noisy Chicken" height="32" />
        </div>
      </v-card>
    </v-col>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2 yellow-plate card-container"
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">D</span>
          <span>{{ players[3]?.username }}</span>
          <v-spacer />
          <v-img v-if="playerTurnId === players[3]?.id" src="https://media.tenor.com/LG4kcNOmsw4AAAAi/noisy-chicken.gif" alt="Noisy Chicken" height="32" />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup async>
import { VRow, VCol, VCard, VImg, VSpacer } from 'vuetify/components'
import { CardUser } from '~/functions/src/types'

// Props

defineProps<{
  players: CardUser[]
  playerTurnId: string
  isFinished: boolean
}>()
</script>

<style scoped>
.letter-spacing {
  width: 30px;
}

.card-container {
  border: 1px solid rgb(var(--v-theme-dicePlayersBorder));
}

/* players background */
.yellow-plate {
  background: linear-gradient(to top left, rgb(var(--v-theme-dicePrimary)), rgb(var(--v-theme-diceClosePrimary)));
}
</style>
