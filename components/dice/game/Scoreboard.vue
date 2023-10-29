<template>
  <div class="scoreboard-wrapper">
    <div class="button-playersheet-wrapper">
      <button class="button-playersheet" @click="OpenPlayerSheet">
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
    <div class="scoreboard-content-wrapper">
      <div class="scoreboard-upper">
        <div class="scoreboard-header-wrapper">
          <div v-for="(score, i) in scoreboardHeaderIcons" :key="i">
            <v-icon :icon="score" color="white" size="40" />
          </div>
          <div class="text">BONUS</div>
          <div class="text">TOTAL</div>
        </div>
        <div class="scoreboard-values-wrapper">
          <div
            v-for="(player, k) in scoreboard"
            :key="k"
            class="scoreboard-values-upper"
          >
            <div v-for="(value, l) in upperPlayerSheet(k)" :key="l">
              <button
                v-if="getPlayerTurn(player!.id) && value === null"
                class="button-dynamic"
              >
                {{ getInput(l) }}
              </button>
              <button v-else>
                {{ value === null ? '-' : value }}
              </button>
            </div>
            <div>
              {{ upperPlayerSheetBonus(k) }}
            </div>
            <div>
              {{ upperPlayerSheetTotal(k) }}
            </div>
          </div>
        </div>
      </div>
      <div class="scoreboard-lower">
        <div class="scoreboard-header-wrapper">
          <div v-for="(src, j) in scoreboardHeaderImages" :key="j" class="img">
            <v-img :src="src" width="30" height="30" />
          </div>
          <div class="text">TOTAL</div>
        </div>
        <div class="scoreboard-values-wrapper">
          <div
            v-for="(player, k) in scoreboard"
            :key="k"
            class="scoreboard-values-lower"
          >
            <div v-for="(value, m) in lowerPlayerSheet(k)" :key="m">
              <button
                v-if="getPlayerTurn(player!.id) && value === null"
                class="button-dynamic"
              >
                {{ getInput(m) }}
              </button>
              <button v-else>
                {{ value === null ? '-' : value }}
              </button>
            </div>
            <div>
              {{ lowerPlayerSheetTotal(k) }}
            </div>
          </div>
        </div>
      </div>
      <div class="scoreboard-total">
        <div class="scoreboard-header-wrapper">
          <div class="text">TOTAL</div>
        </div>
        <div class="scoreboard-values-wrapper">
          <div
            v-for="(player, k) in scoreboard"
            :key="k"
            class="scoreboard-values-lower"
          >
            <div>
              {{ playerSheetTotal(k) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon, VImg } from 'vuetify/components'
import {
  mdiDice1,
  mdiDice2,
  mdiDice3,
  mdiDice4,
  mdiDice5,
  mdiDice6
} from '@mdi/js'
import type { LocalDiceSessionScoresType } from '~/stores'
import type { Dice } from '~/functions/src/types'
import { sum } from '~/utils'
import {
  oneInput,
  twoInput,
  threeInput,
  fourInput,
  fiveInput,
  sixInput,
  threeOfAKindInput,
  fourOfAKindInput,
  fullHouseInput,
  smallStraightInput,
  largeStraightInput,
  diceInput,
  chanceInput
} from '~/utils/diceInputs'

type InputMappings = {
  one: number
  two: number
  three: number
  four: number
  five: number
  six: number
  threeOfAKind: number
  fourOfAKind: number
  fullHouse: number
  smallStraight: number
  largeStraight: number
  dice: number
  chance: number
  [key: string]: number
}

const props = defineProps<{
  scoreboard: LocalDiceSessionScoresType['playerOne'][]
  dices: Dice[]
  playerTurn: string
}>()

const emit = defineEmits<{
  (e: 'update:isScoreboardActive', value: boolean): void
}>()

const scoreboardHeaderIcons: Record<number, string> = {
  1: mdiDice1,
  2: mdiDice2,
  3: mdiDice3,
  4: mdiDice4,
  5: mdiDice5,
  6: mdiDice6
}

const scoreboardHeaderImages: Record<number, string> = {
  1: '/dice/inputs/three-of-a-kind.png',
  2: '/dice/inputs/four-of-a-kind.png',
  3: '/dice/inputs/full-house.png',
  4: '/dice/inputs/small-straight.png',
  5: '/dice/inputs/large-straight.png',
  6: '/dice/inputs/dice.png',
  7: '/dice/inputs/chance.png'
}

const OpenPlayerSheet = () => {
  emit('update:isScoreboardActive', false)
}

const upperPlayerSheet = (key: number): Record<string, number> | {} => {
  const playerData = props.scoreboard[key]

  if (!playerData) {
    return {}
  }

  return {
    one: playerData.one,
    two: playerData.two,
    three: playerData.three,
    four: playerData.four,
    five: playerData.five,
    six: playerData.six
  }
}

const lowerPlayerSheet = (key: number): Record<string, number> | {} => {
  const playerData = props.scoreboard[key]

  if (!playerData) {
    return {}
  }

  return {
    threeOfAKind: playerData.threeOfAKind,
    fourOfAKind: playerData.fourOfAKind,
    fullHouse: playerData.fullHouse,
    smallStraight: playerData.smallStraight,
    largeStraight: playerData.largeStraight,
    dice: playerData.dice,
    chance: playerData.chance
  }
}

const upperPlayerSheetBonus = (key: number): number => {
  const upperTotal = sum(upperPlayerSheet(key))
  if (upperTotal! >= 63) {
    return 35
  }
  return 0
}

const upperPlayerSheetTotal = (key: number): number => {
  const result = sum(upperPlayerSheet(key))
  return result! + upperPlayerSheetBonus(key)
}

const lowerPlayerSheetTotal = (key: number): number => {
  const result = sum(lowerPlayerSheet(key))
  return result!
}

const playerSheetTotal = (key: number): number => {
  const upperTotal = upperPlayerSheetTotal(key)
  const lowerTotal = lowerPlayerSheetTotal(key)
  if (upperTotal >= 63) {
    return upperTotal + lowerTotal + 35
  }
  return upperTotal + lowerTotal
}

// Mappings

const inputMappings = computed<InputMappings>(() => {
  const dices = props.dices

  return {
    one: oneInput(dices),
    two: twoInput(dices),
    three: threeInput(dices),
    four: fourInput(dices),
    five: fiveInput(dices),
    six: sixInput(dices),
    threeOfAKind: threeOfAKindInput(dices),
    fourOfAKind: fourOfAKindInput(dices),
    fullHouse: fullHouseInput(dices),
    smallStraight: smallStraightInput(dices),
    largeStraight: largeStraightInput(dices),
    dice: diceInput(dices),
    chance: chanceInput(dices)
  }
})

const getInput = (value: string) => {
  return inputMappings.value[value]
}

const getPlayerTurn = (playerId: string) => {
  return props.playerTurn === playerId
}
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
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }
  }

  .scoreboard-content-wrapper {
    width: 376px;
    height: 655px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;

    .scoreboard-upper,
    .scoreboard-lower {
      display: flex;
      align-items: center;
      height: 47%;
      width: 376px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      padding: 5px 20px;
    }

    .scoreboard-upper {
      border-radius: 8px 8px 0 0;
    }

    .scoreboard-lower {
      border-top: none;
      border-radius: 0 0 8px 8px;
    }

    .scoreboard-total {
      display: flex;
      align-items: center;
      width: 376px;
      border: 3px solid transparent;
      padding: 5px 20px;
      margin-top: 5px;
      font-weight: 600;
      background-color: rgba(#cfcfcf, 0.3);
      border-radius: 8px;
    }

    .scoreboard-header-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 67.2px;
      height: 100%;
    }

    .scoreboard-values-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      height: 100%;
      font-size: 1.125rem;
    }

    .scoreboard-values-upper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 67.2px;
      height: 100%;

      button {
        width: 40px;
        height: 40px;
      }
    }

    .scoreboard-values-lower {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 67.2px;
      height: 100%;

      button {
        width: 30px;
        height: 30px;
      }
    }

    .button-dynamic {
      cursor: default;
      color: rgb(var(--v-theme-diceMainTertiary));
      font-weight: bold;
    }

    .img {
      height: 30px;
      width: 30px;
      background-color: white;
      border-radius: 3px;

      &.img:nth-child(4) {
        display: flex;
        justify-content: center;
        align-items: center;

        .v-img {
          width: 24px !important;
          height: 24px !important;
        }
      }
    }

    .text {
      font-size: 1.125rem;
    }
  }
}
</style>
