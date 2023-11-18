<template>
  <div class="dices-wrapper">
    <div v-for="(_, i) in 5" :key="i" class="dice-content">
      <button
        :style="{
          cursor: isPlayerTurn ? 'pointer' : 'default'
        }"
        @click="removeDiceFromHand(dicesOnHand[i].id)"
      >
        <v-img
          v-if="dicesOnHand[i]"
          :src="getDiceFace(dicesOnHand[i].face)"
          alt="dé dans ta main"
          height="70"
          width="70"
        />
      </button>
    </div>
    <button
      class="button-roll-cup"
      :class="{
        highlight:
          isPlayerTurn &&
          playerTries > 0 &&
          sessionIsStarted &&
          !sessionIsFinished
      }"
      :disabled="isRolling"
      @click="rollCup"
    >
      <v-img
        class="cup"
        src="/dice/ui/cup-no-bg.png"
        alt="Gobelet"
        height="56"
        width="46"
      />
      <v-img
        class="dice-three"
        src="/dice/colors/dice-white-three.png"
        alt="Dé trois"
        height="26"
        width="26"
      />
      <v-img
        class="dice-five"
        src="/dice/colors/dice-white-five.png"
        alt="Dé cinq"
        height="26"
        width="26"
      />
    </button>
    <div class="player-tries">
      {{ playerTries }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { VImg } from 'vuetify/components'
import { doc, updateDoc } from 'firebase/firestore'
import {
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter
} from '~/stores'
import type { Dice } from '~/functions/src/types'
import type { ISoundService } from '~/utils/music/soundService'
import { random } from '~/utils'

type diceFaces = {
  [key: number]: { light: string }
}

const props = defineProps<{
  isPlayerTurn: boolean
  sessionId: string
  dices: Dice[]
  playerTries: number
  sessionIsStarted: boolean
  sessionIsFinished: boolean
  soundService: ISoundService
}>()

const db = useFirestore()

const dicesRef = doc(db, 'diceSessionDices', props.sessionId).withConverter(
  diceSessionDicesConverter
)
const playerTriesRef = doc(
  db,
  'diceSessionPlayerTries',
  props.sessionId
).withConverter(diceSessionPlayerTriesConverter)

const isRolling = ref<boolean>(false)

const dicesOnHand = computed(() => {
  if (props.dices) {
    return props.dices.filter((dice: Dice) => !dice.isOnBoard)
  } else {
    return []
  }
})

const getDiceFace = (dice: number) => {
  const diceFaces: diceFaces = {
    1: { light: '/dice/colors/dice-white-one.png' },
    2: { light: '/dice/colors/dice-white-two.png' },
    3: { light: '/dice/colors/dice-white-three.png' },
    4: { light: '/dice/colors/dice-white-four.png' },
    5: { light: '/dice/colors/dice-white-five.png' },
    6: { light: '/dice/colors/dice-white-six.png' }
  }

  return diceFaces[dice].light
}

const removeDiceFromHand = async (diceId: number) => {
  if (!props.isPlayerTurn) {
    return
  }

  const currentDice = props.dices.find((dice: Dice) => dice.id === diceId)
  const otherDices = props.dices.filter((dice: Dice) => dice.id !== diceId)

  if (!currentDice) {
    return
  }

  await updateDoc(dicesRef, {
    dices: [
      ...otherDices,
      {
        ...currentDice,
        isOnBoard: true
      }
    ]
  })
}

const rollCup = async () => {
  if (!props.isPlayerTurn) {
    return
  }
  if (!props.sessionIsStarted) {
    return
  }
  if (props.sessionIsFinished) {
    return
  }
  if (props.playerTries === 0) {
    return
  }

  try {
    isRolling.value = true

    let rollDices = props.dices
    const diceOnBoard = rollDices
      ? rollDices.filter((dice: Dice) => dice.isOnBoard)
      : []

    await updateDoc(playerTriesRef, { tries: props.playerTries - 1 })

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (diceOnBoard.length === 0) {
          rollDices = []
          for (let i = 0; i < 5; i++) {
            const dice = random(6, 1)
            rollDices.push({
              id: i,
              face: dice,
              isOnBoard: true
            })
          }
        } else {
          for (const dice of diceOnBoard) {
            dice.face = random(6, 1)
          }
        }
        resolve()
      }, 2300)
    })

    await updateDoc(dicesRef, {
      dices: rollDices
    })
  } finally {
    isRolling.value = false
  }
}

// Watchers

watch(
  () => props.dices,
  (newValue, oldValue) => {
    if (newValue !== undefined && oldValue !== undefined) {
      if (oldValue !== newValue) {
        const newDices = newValue.filter((dice: Dice) => dice.isOnBoard)
        const oldDices = oldValue.filter((dice: Dice) => dice.isOnBoard)

        if (newDices.length > oldDices.length) {
          if (!props.soundService.isSoundMuted('dice')) {
            props.soundService.playSound('dice')
          }
        }
      }
    }
  }
)
</script>

<style scoped lang="scss">
.dices-wrapper {
  width: 665px;
  height: 100px;
  display: flex;
  align-items: center;

  .dice-content {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(#000000, 0.2);
    border-radius: 8px;
    margin-left: 20px;
  }

  .button-roll-cup {
    width: 120px;
    height: 100px;
    background-color: rgb(var(--v-theme-diceMainTertiary));
    border-radius: 8px;
    margin-left: auto;
    &.highlight {
      animation: borderAnimation 3s linear infinite;
    }

    .cup {
      position: absolute;
      bottom: 72px;
      right: 42px;
      transform: rotate(-130deg);
    }

    .dice-three {
      position: absolute;
      bottom: 70px;
      right: 110px;
      transform: rotate(-120deg);
    }

    .dice-five {
      position: absolute;
      bottom: 40px;
      right: 90px;
      transform: rotate(-70deg);
    }
  }

  .player-tries {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 46px;
    height: 46px;
    background-color: rgb(var(--v-theme-diceMainSecondary));
    border-radius: 8px;
    font-size: 2rem;
    color: white;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  }
}

@keyframes borderAnimation {
  0% {
    border: 4px solid transparent;
  }
  25% {
    border: 4px solid white;
  }
  50% {
    border: 4px solid transparent;
  }
  75% {
    border: 4px solid white;
  }
  100% {
    border: 4px solid transparent;
  }
}
</style>
~/utils/music/soundService
