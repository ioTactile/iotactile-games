<template>
  <div class="playersheet-wrapper">
    <div class="left-column">
      <div class="left-column-border">
        <div v-for="(row, i) in upperPlayerSheet" :key="i" class="left-row">
          <v-icon :icon="row.icon" size="66" />
          <button
            v-if="isPlayerTurn && row.input === null"
            class="button-save mr-4"
            @click="saveInput(row.value)"
          >
            {{ getInput(row.value) }}
          </button>
          <button v-else class="button-input mr-4">
            {{ row.input === null ? '-' : row.input }}
          </button>
        </div>
        <div class="left-row-bottom-wrapper">
          <div class="mb-2">
            <div>BONUS</div>
            <div class="mr-4">
              {{ upperPlayerSheetBonus }}
            </div>
          </div>
          <div>
            <div>TOTAL</div>
            <div class="mr-4">
              {{ upperPlayerSheetTotal }}
            </div>
          </div>
        </div>
      </div>
      <button class="button-scoreboard" @click="clickScoreboardButton">
        <div class="svg-container">
          <svg
            id="Layer_1"
            fill="#ffffff"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="40px"
            height="40px"
            viewBox="0 0 100 100"
            enable-background="new 0 0 100 100"
            xml:space="preserve"
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
                  d="M50.868,78.016l36.418-26.055c0.66-0.471,1.049-1.233,1.051-2.043c0-0.006,0-0.006,0-0.006 c-0.002-0.815-0.396-1.575-1.059-2.048L50.86,21.977c-0.767-0.546-1.776-0.616-2.612-0.183c-0.835,0.426-1.361,1.292-1.361,2.236 v12.183l-32.709-0.001c-1.39,0-2.515,1.125-2.515,2.516l0.001,22.541c-0.001,1.389,1.124,2.515,2.516,2.516l32.706,0v12.187 c0,0.94,0.53,1.803,1.366,2.237C49.089,78.641,50.1,78.567,50.868,78.016z"
                />
              </g>
            </g>
          </svg>
        </div>
        <span>VOIR TABLEAU</span>
      </button>
    </div>
    <div class="right-column">
      <div class="right-column-border">
        <div v-for="(row, j) in lowerPlayerSheet" :key="j" class="right-row">
          <div>
            <v-img :src="row.src" width="50" height="50" />
          </div>
          <button
            v-if="isPlayerTurn && row.input === null"
            class="button-save mr-4"
            @click="saveInput(row.value)"
          >
            {{ getInput(row.value) }}
          </button>
          <button v-else class="button-input mr-4">
            {{ row.input === null ? '-' : row.input }}
          </button>
        </div>
        <div class="right-row-bottom-wrapper">
          <div>TOTAL</div>
          <div class="mr-4">
            {{ lowerPlayerSheetTotal }}
          </div>
        </div>
      </div>
      <button class="button-lower-total">
        {{ playerSheetTotal }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateDoc, doc } from 'firebase/firestore'
import { VIcon, VImg } from 'vuetify/components'
import {
  mdiDice1,
  mdiDice2,
  mdiDice3,
  mdiDice4,
  mdiDice5,
  mdiDice6,
} from '@mdi/js'
import {
  diceSessionScoresConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionPlayerTurnConverter,
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter,
} from '~/stores'
import type { LocalDiceSessionScoresType } from '~/stores'
import type { Dice, CardUser } from '~/functions/src/types'
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
  chanceInput,
  getUpperSectionTotal,
  getLowerSectionTotal,
} from '~/utils/diceInputs'
import SoundService from '~/utils/soundService'

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

type PlayerSheetRow = {
  value: string
  icon?: string
  src?: string
  input: number | null
}

// Vuefire

const db = useFirestore()

// Props & Emits

const props = defineProps<{
  sessionId: string
  dices: Dice[]
  playerData: {
    playerSheet: LocalDiceSessionScoresType['playerOne']
    playerLocation: string
  }
  isPlayerTurn: boolean
  playerTurnId: string
  remainingTurns: number
  players: CardUser[]
  soundService: SoundService
}>()

const emit = defineEmits<{
  (e: 'update:isScoreboardActive', value: boolean): void
}>()

// Refs

const upperPlayerSheet = ref<PlayerSheetRow[]>([
  {
    value: 'one',
    icon: mdiDice1,
    input: props.playerData.playerSheet.one,
  },
  {
    value: 'two',
    icon: mdiDice2,
    input: props.playerData.playerSheet.two,
  },
  {
    value: 'three',
    icon: mdiDice3,
    input: props.playerData.playerSheet.three,
  },
  {
    value: 'four',
    icon: mdiDice4,
    input: props.playerData.playerSheet.four,
  },
  {
    value: 'five',
    icon: mdiDice5,
    input: props.playerData.playerSheet.five,
  },
  {
    value: 'six',
    icon: mdiDice6,
    input: props.playerData.playerSheet.six,
  },
])

const lowerPlayerSheet = ref<PlayerSheetRow[]>([
  {
    value: 'threeOfAKind',
    src: '/dice/inputs/three-of-a-kind.png',
    input: props.playerData.playerSheet.threeOfAKind,
  },
  {
    value: 'fourOfAKind',
    src: '/dice/inputs/four-of-a-kind.png',
    input: props.playerData.playerSheet.fourOfAKind,
  },
  {
    value: 'fullHouse',
    src: '/dice/inputs/full-house.png',
    input: props.playerData.playerSheet.fullHouse,
  },
  {
    value: 'smallStraight',
    src: '/dice/inputs/small-straight.png',
    input: props.playerData.playerSheet.smallStraight,
  },
  {
    value: 'largeStraight',
    src: '/dice/inputs/large-straight.png',
    input: props.playerData.playerSheet.largeStraight,
  },
  {
    value: 'dice',
    src: '/dice/inputs/dice.png',
    input: props.playerData.playerSheet.dice,
  },
  {
    value: 'chance',
    src: '/dice/inputs/chance.png',
    input: props.playerData.playerSheet.chance,
  },
])

// Firebase refs

const scoresRef = doc(db, 'diceSessionScores', props.sessionId).withConverter(
  diceSessionScoresConverter,
)
const remainingTurnsRef = doc(
  db,
  'diceSessionRemainingTurns',
  props.sessionId,
).withConverter(diceSessionRemainingTurnsConverter)
const playerTurnRef = doc(
  db,
  'diceSessionPlayerTurn',
  props.sessionId,
).withConverter(diceSessionPlayerTurnConverter)
const dicesRef = doc(db, 'diceSessionDices', props.sessionId).withConverter(
  diceSessionDicesConverter,
)
const playerTriesRef = doc(
  db,
  'diceSessionPlayerTries',
  props.sessionId,
).withConverter(diceSessionPlayerTriesConverter)

// Computed

const upperPlayerSheetTotal = computed(() =>
  getUpperSectionTotal(upperPlayerSheet.value),
)

const lowerPlayerSheetTotal = computed(() =>
  getLowerSectionTotal(lowerPlayerSheet.value),
)

const upperPlayerSheetBonus = computed(() => {
  return upperPlayerSheetTotal.value >= 63 ? 35 : 0
})

const playerSheetTotal = computed(() => {
  return upperPlayerSheetTotal.value + lowerPlayerSheetTotal.value
})

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
    chance: chanceInput(dices),
  }
})

// Methods

const clickScoreboardButton = () => {
  props.soundService.playSound('click')
  emit('update:isScoreboardActive', true)
}

const switchPlayerTurn = async () => {
  const playerTurnIndex = props.players.findIndex(
    (player: CardUser) => player.id === props.playerTurnId,
  )
  const nextPlayerTurnIndex =
    playerTurnIndex === props.players.length - 1 ? 0 : playerTurnIndex + 1

  await updateDoc(playerTurnRef, {
    playerId: props.players[nextPlayerTurnIndex].id,
  })
  await updateDoc(dicesRef, { dices: [] })
  await updateDoc(remainingTurnsRef, {
    remainingTurns: props.remainingTurns - 1,
  })
  await updateDoc(playerTriesRef, { tries: 3 })
}

const getInput = (value: string) => {
  return inputMappings.value[value]
}

const saveInput = async (value: string) => {
  if (props.isPlayerTurn) {
    props.soundService.playSound('click')

    const input = getInput(value)

    if (input !== undefined) {
      await updateDoc(scoresRef, {
        [props.playerData.playerLocation]: {
          ...props.playerData.playerSheet,
          [value]: input,
        },
      })

      await switchPlayerTurn()
    }
  }
}
</script>

<style scoped lang="scss">
.playersheet-wrapper {
  display: flex;
  justify-content: space-between;
  width: 455px;
  height: 655px;

  .left-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .left-column-border {
      width: 220px;
      height: 600px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      border-radius: 8px;
      padding: 20px;

      .left-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        font-size: 2rem;
        color: white;
        margin-bottom: 22px;
      }

      .left-row-bottom-wrapper {
        align-items: center;
        font-size: 1.75rem;
        color: white;

        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    .button-scoreboard {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 220px;
      height: 40px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      color: white;
      font-size: 1.25rem;
      border-radius: 8px;
      padding-right: 10px;
    }
  }

  .right-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .right-column-border {
      width: 220px;
      height: 550px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      border-radius: 8px;
      padding: 20px;

      .right-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        font-size: 2rem;
        color: white;
        margin-bottom: 10px;

        div {
          height: 50px;
          width: 50px;
          background-color: white;
          border-radius: 6px;
        }
      }

      .right-row-bottom-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.75rem;
        color: white;
      }
    }

    .button-lower-total {
      width: 120px;
      height: 80px;
      background-color: rgba(#cfcfcf, 0.3);
      font-size: 3rem;
      color: white;
      border-radius: 50px;
      cursor: default;
    }
  }

  .button-save {
    width: 50px;
    height: 50px;
    background-color: rgb(var(--v-theme-diceMainTertiary));
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  .button-input {
    width: 50px;
    height: 50px;
    cursor: default;
    font-family: 'Indie Flower', cursive;
  }
}
</style>
