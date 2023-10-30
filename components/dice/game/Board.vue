<template>
  <div class="board-wrapper">
    <div v-if="shakeClass" class="shake-wrapper">
      <v-img
        src="/dice/ui/cup-animation.png"
        alt="Animation gobelet secoué"
        height="250"
        width="250"
        :class="shakeClass"
      />
    </div>
    <div v-if="dicesOnBoard && isDicesOnBoard">
      <button
        v-for="dice in dicesOnBoard"
        :key="dice.id"
        :style="{
          position: 'absolute',
          top: calculateTop(dice.id),
          left: calculateLeft(dice.id),
          cursor: isPlayerTurn ? 'pointer' : 'default'
        }"
        @click="removeDiceFromBoard(dice.id)"
      >
        <v-img
          :src="getDiceFace(dice.face)"
          alt="dé sur le plateau"
          height="70"
          width="70"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VImg } from 'vuetify/components'
import { doc, updateDoc } from 'firebase/firestore'
import { sleep } from '~/utils'
import type { Dice } from '~/functions/src/types'
import SoundService from '~/utils/soundService'

// Types

type diceFaces = {
  [key: number]: { light: string }
}

// Vuefire

const db = useFirestore()

// Props & Emits

const props = defineProps<{
  isPlayerTurn: boolean
  sessionId: string
  dices: Dice[]
  playerTries: number
  soundService: SoundService
}>()

// Refs

const shakeClass = ref<string>('')
const isDicesOnBoard = ref<boolean>(true)

// Firebase refs

const dicesRef = doc(db, 'diceSessionDices', props.sessionId).withConverter(
  diceSessionDicesConverter
)

// Computed

const dicesOnBoard = computed(() => {
  if (props.dices) {
    return props.dices.filter((dice: Dice) => dice.isOnBoard)
  } else {
    return []
  }
})

// Methods

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

const removeDiceFromBoard = async (diceId: number) => {
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
        isOnBoard: false
      }
    ]
  })
}

const calculateTop = (id: number) => {
  switch (id) {
    case 0:
      return '500px'
    case 1:
      return '300px'
    case 2:
      return '450px'
    case 3:
      return '250px'
    case 4:
      return '400px'
    default:
      return '0px'
  }
}

const calculateLeft = (id: number) => {
  switch (id) {
    case 0:
      return '560px'
    case 1:
      return '660px'
    case 2:
      return '760px'
    case 3:
      return '860px'
    case 4:
      return '960px'
    default:
      return '0px'
  }
}

// Watchers

watch(
  () => props.playerTries,
  async (newValue, oldValue) => {
    if (newValue !== undefined && oldValue !== undefined && newValue !== 3) {
      if (oldValue !== newValue) {
        isDicesOnBoard.value = false
        if (!props.soundService.isSoundMuted('shakeRoll')) {
          props.soundService.playSound('shakeRoll')
        }
        await sleep(500)
        shakeClass.value = 'shake'
        await sleep(1800)
        shakeClass.value = ''
        await sleep(100)
        isDicesOnBoard.value = true
      }
    }
  }
)

watch(
  () => props.dices,
  (newValue, oldValue) => {
    if (newValue !== undefined && oldValue !== undefined) {
      if (oldValue !== newValue) {
        const newDices = newValue.filter((dice: Dice) => !dice.isOnBoard)
        const oldDices = oldValue.filter((dice: Dice) => !dice.isOnBoard)

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
.board-wrapper {
  width: 665px;
  height: 555px;

  .shake-wrapper {
    z-index: 9999;
    position: absolute;
    top: 250px;
    left: 700px;
  }
  .shake {
    animation: shake 0.5s ease-in-out 0s 3;
  }

  @keyframes shake {
    0% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(20px);
    }
    50% {
      transform: translateY(-20px);
    }
    75% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
    }
  }
}
</style>
