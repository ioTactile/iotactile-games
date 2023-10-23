<template>
  <div v-if="isRoundFinished">
    <v-card :color="isWin ? 'green' : 'red'" elevation="0" rounded="0" class="opacity">
      <v-card-title class="d-flex align-center justify-center text-subtitle-1 text-sm-h6">
        <v-icon :icon="isWin ? mdiCheck : mdiClose" />
        {{ isWin ? 'Victoire' : 'Défaite' }}
      </v-card-title>
    </v-card>
    <v-row class="mt-1">
      <v-col cols="6">
        <v-card width="100%" rounded="0" elevation="0">
          <v-card-text class="pa-0">
            <div class="text-center text-h6 pa-0">
              Difficulté du mot
            </div>
            <div class="text-center text-h6 pa-0">
              Durée
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card width="100%" rounded="0" elevation="0">
          <v-card-text class="pa-0">
            <div class="text-center text-h6 pa-0" :class="`bg-${getColorFromDifficulty}`">
              {{ wordDifficulty }}
            </div>
            <div class="text-center text-h6 pa-0">
              {{ savedTimer + 'sec' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { VRow, VCol, VCard, VCardTitle, VCardText, VIcon } from 'vuetify/components'
import { mdiCheck, mdiClose } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useLvTimerStore } from '~/stores/lvTimer'

// Props

const props = defineProps<{
  isWin: boolean
  wordDifficulty: number
  isRoundFinished: boolean
}>()

// Store

const lvTimerStoreRef = useLvTimerStore()
const { savedTimer } = storeToRefs(lvTimerStoreRef)

// computed

const getColorFromDifficulty = computed(() => {
  const difficulty = props.wordDifficulty

  if (difficulty <= 3999) {
    return 'green'
  } else if (difficulty >= 4000) {
    return 'yellow'
  } else if (difficulty >= 8000) {
    return 'red'
  } else if (difficulty >= 12000) {
    return 'purple'
  }
})
</script>

<style scoped>
.opacity {
  opacity: 0.8;
}
</style>
