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
      <button
        class="button-scoreboard"
        @click="emit('update:isScoreboardActive', true)"
      >
        <v-icon :icon="mdiArrowRightBold" /><span>VOIR TABLEAU</span>
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
  mdiArrowRightBold,
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

// Vuefire

const db = useFirestore()

// Props & Emits

const props = defineProps<{
  sessionId: string
  dices: Dice[]
  playerData: {
    playerSheet: LocalDiceSessionScoresType['playerOne'] | null
    playerLocation: string | null
  }
  isPlayerTurn: boolean
  playerTurnId: string
  remainingTurns: number
  players: CardUser[]
}>()

const emit = defineEmits<{
  (e: 'update:isScoreboardActive', value: boolean): void
}>()

// Refs

const upperPlayerSheet = ref([
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

const lowerPlayerSheet = ref([
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

const upperPlayerSheetTotal = computed(() => {
  let result = 0
  upperPlayerSheet.value.forEach((row) => {
    if (row.input !== null) {
      result += row.input
    }
  })
  if (result >= 63) {
    result += 35
  }
  return result
})

const upperPlayerSheetBonus = computed(() => {
  if (upperPlayerSheetTotal.value >= 63) {
    return 35
  } else {
    return 0
  }
})

const lowerPlayerSheetTotal = computed(() => {
  let result = 0
  lowerPlayerSheet.value.forEach((row) => {
    if (row.input !== null) {
      result += row.input
    }
  })
  return result
})

const playerSheetTotal = computed(() => {
  return upperPlayerSheetTotal.value + lowerPlayerSheetTotal.value
})

const oneInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 1).length
  return faceLength * 1
})

const twoInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 2).length
  return faceLength * 2
})

const threeInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 3).length
  return faceLength * 3
})

const fourInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 4).length
  return faceLength * 4
})

const fiveInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 5).length
  return faceLength * 5
})

const sixInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 6).length
  return faceLength * 6
})

const threeOfAKindInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceCounts: { [key: number]: number } = {}

  for (const dice of props.dices) {
    if (faceCounts[dice.face]) {
      faceCounts[dice.face]++
    } else {
      faceCounts[dice.face] = 1
    }
  }

  const hasThreeOfAKind = Object.values(faceCounts).some(
    (count: number) => count >= 3,
  )

  if (hasThreeOfAKind) {
    return props.dices.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
  } else {
    return 0
  }
})

const fourOfAKindInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceCounts: { [key: number]: number } = {}

  for (const dice of props.dices) {
    if (faceCounts[dice.face]) {
      faceCounts[dice.face]++
    } else {
      faceCounts[dice.face] = 1
    }
  }

  const hasFourOfAKind = Object.values(faceCounts).some(
    (count: number) => count >= 4,
  )

  if (hasFourOfAKind) {
    return props.dices.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
  } else {
    return 0
  }
})

const fullHouseInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const sortedDices = props.dices
    .slice()
    .sort((a: Dice, b: Dice) => a.face - b.face)

  const isFullHouse =
    (sortedDices[0].face === sortedDices[1].face &&
      sortedDices[0].face === sortedDices[2].face &&
      sortedDices[3].face === sortedDices[4].face) ||
    (sortedDices[0].face === sortedDices[1].face &&
      sortedDices[2].face === sortedDices[3].face &&
      sortedDices[2].face === sortedDices[4].face)

  return isFullHouse ? 25 : 0
})

const smallStraightInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const sortedDices = props.dices
    .slice()
    .sort((a: Dice, b: Dice) => a.face - b.face)

  const faces = new Set(sortedDices.map((dice: Dice) => dice.face))

  const isSmallStraight =
    (faces.has(1) && faces.has(2) && faces.has(3) && faces.has(4)) ||
    (faces.has(2) && faces.has(3) && faces.has(4) && faces.has(5)) ||
    (faces.has(3) && faces.has(4) && faces.has(5) && faces.has(6))

  return isSmallStraight ? 30 : 0
})

const largeStraightInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const sortedDices = props.dices
    .slice()
    .sort((a: Dice, b: Dice) => a.face - b.face)

  const isLargeStraight =
    (sortedDices[0].face === 1 &&
      sortedDices[1].face === 2 &&
      sortedDices[2].face === 3 &&
      sortedDices[3].face === 4 &&
      sortedDices[4].face === 5) ||
    (sortedDices[0].face === 2 &&
      sortedDices[1].face === 3 &&
      sortedDices[2].face === 4 &&
      sortedDices[3].face === 5 &&
      sortedDices[4].face === 6)

  return isLargeStraight ? 40 : 0
})

const diceInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const firstFace = props.dices[0].face

  const isDice = props.dices.every((dice: Dice) => dice.face === firstFace)

  return isDice ? 50 : 0
})

const chanceInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const chance = props.dices
  return chance.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
})

// Mappings

const inputMappings: Record<string, number> = {
  one: oneInput.value,
  two: twoInput.value,
  three: threeInput.value,
  four: fourInput.value,
  five: fiveInput.value,
  six: sixInput.value,
  threeOfAKind: threeOfAKindInput.value,
  fourOfAKind: fourOfAKindInput.value,
  fullHouse: fullHouseInput.value,
  smallStraight: smallStraightInput.value,
  largeStraight: largeStraightInput.value,
  dice: diceInput.value,
  chance: chanceInput.value,
}

// Methods

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
  return inputMappings[value] || 0
}

const saveInput = async (value: string) => {
  if (props.isPlayerTurn) {
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
          border-radius: 8px;
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
