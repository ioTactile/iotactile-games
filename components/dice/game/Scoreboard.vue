<template>
  <div class="scoreboard-wrapper">
    <div class="button-playersheet-wrapper">
      <button
        class="button-playersheet"
        @click="emit('update:isScoreboardActive', false)"
      >
        <div class="svg-container">
          <svg
            height="46px"
            width="46px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
            fill="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g>
                <path
                  class="st0"
                  d="M479.568,159.192H294.751l22.54-96.459c2.094-8.92-1.451-18.198-8.937-23.475 c-7.488-5.268-17.419-5.463-25.111-0.496L10.34,235.768C3.846,240.461,0,247.987,0,256.001c0,8.013,3.846,15.539,10.34,20.232 L283.243,473.24c7.692,4.965,17.623,4.771,25.111-0.506c7.486-5.267,11.021-14.546,8.937-23.465l-22.54-96.459h184.817 c17.905,0,32.432-14.518,32.432-32.433V191.623C512,173.708,497.474,159.192,479.568,159.192z"
                />
              </g>
            </g>
          </svg>
        </div>
      </button>
    </div>
    <div class="scoreboard-content">
      <div class="scoreboard-value" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
