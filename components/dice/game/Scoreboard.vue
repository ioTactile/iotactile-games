<template>
  <div class="scoreboard-wrapper">
    <div class="button-playersheet-wrapper">
      <button
        class="button-playersheet"
        @click="emit('update:isScoreboardActive', false)"
      >
        <v-icon :icon="mdiArrowLeftBold" size="60" color="white" />
      </button>
    </div>
    <div class="scoreboard-content">
      <div class="scoreboard-value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiArrowLeftBold } from '@mdi/js'
import type { LocalDiceSessionScoresType } from '~/stores'

// interface PlayerType {
//   one: number
//   two: number
//   three: number
//   four: number
//   five: number
//   six: number
//   threeOfAKind: number
//   fourOfAKind: number
//   fullHouse: number
//   smallStraight: number
//   largeStraight: number
//   dice: number
//   chance: number
//   [key: string]: number
// }

defineProps<{
  scoreboard: Omit<LocalDiceSessionScoresType, 'id' | 'creationDate'> | null
}>()

const emit = defineEmits<{
  (e: 'update:isScoreboardActive', value: boolean): void
}>()

// const upperScoreboardValue = ['one', 'two', 'three', 'four', 'five', 'six']
// const lowerScoreboardValue = [
//   'threeOfAKind',
//   'fourOfAKind',
//   'fullHouse',
//   'smallStraight',
//   'largeStraight',
//   'dice',
//   'chance',
// ]

// const getPlayerValues = (player: PlayerType) => {
//   const upperValues = upperScoreboardValue.map((key) => player[key])
//   const lowerValues = lowerScoreboardValue.map((key) => player[key])
//   return { upperValues, lowerValues }
// }

// const getUpperTotal = (values: number[]) => {
//   let result = 0
//   values.forEach((value) => {
//     if (value !== null) {
//       result += value
//     }
//   })
//   if (result >= 63) {
//     result += 35
//   }
//   return result
// }

// const getLowerTotal = (values: number[]) => {
//   let result = 0
//   values.forEach((value) => {
//     if (value !== null) {
//       result += value
//     }
//   })
//   return result
// }

// const getPlayerBonus = (upperTotal: number) => {
//   return upperTotal >= 63 ? 35 : 0
// }

// const getPlayerTotal = (player: PlayerType) => {
//   const { upperValues, lowerValues } = getPlayerValues(player)
//   const upperTotal = getUpperTotal(upperValues)
//   const lowerTotal = getLowerTotal(lowerValues)
//   return upperTotal + lowerTotal
// }

// const playerOne = computed(() => {
//   const { id, ...playerWithoutId } = scoreboard.value.playerOne
//   return playerWithoutId
// })

// const playerTwo = computed(() => {
//   const { id, ...playerWithoutId } = scoreboard.value.playerTwo
//   return playerWithoutId
// })

// const playerThree = computed(() => {
//   const { id, ...playerWithoutId } = scoreboard.value.playerThree
//   return playerWithoutId
// })

// const playerFour = computed(() => {
//   const { id, ...playerWithoutId } = scoreboard.value.playerFour
//   return playerWithoutId
// })

// const playerOneTotal = computed(() => getPlayerTotal(playerOne))
// const playerTwoTotal = computed(() => getPlayerTotal(playerTwo))
// const playerThreeTotal = computed(() => getPlayerTotal(playerThree))
// const playerFourTotal = computed(() => getPlayerTotal(playerFour))
</script>

<style scoped lang="scss">
.scoreboard-wrapper {
  display: flex;
  justify-content: space-between;
  width: 455px;
  height: 655px;

  .button-playersheet-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .button-playersheet {
      width: 64px;
      height: 64px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      border-radius: 8px;
    }
  }

  .scoreboard-content {
    width: 376px;
    height: 655px;
    border: 3px solid rgb(var(--v-theme-diceMainPrimary));
    border-radius: 8px;
    padding: 5px 20px;
  }
}
</style>
