<template>
  <v-card class="mx-2 yellow-plate card-container" rounded="0">
    <div class="d-flex text-center text-h6 pa-2">
      <span class="letter-spacing">{{ orderLetter }}</span>
      <span>{{ player?.username }}</span>
      <v-spacer />
      <v-img v-if="isPlayerTurn && !isFinished" src="https://media.tenor.com/LG4kcNOmsw4AAAAi/noisy-chicken.gif" alt="Noisy Chicken" height="32" />
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { VCard, VImg, VSpacer } from 'vuetify/components'
import { CardUser } from '~/functions/src/types'

// Props

defineProps<{
    player?: CardUser
    orderLetter?: string
    isPlayerTurn: boolean
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
