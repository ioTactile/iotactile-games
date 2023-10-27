<template>
  <div class="board-wrapper">
    <div v-if="dicesOnBoard">
      <button
        v-for="dice in dicesOnBoard"
        :key="dice.id"
        :style="{
          position: 'absolute',
          top: calculateTop(dice.id),
          left: calculateLeft(dice.id),
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
import type { Dice } from '~/functions/src/types'

type diceFaces = {
  [key: number]: { light: string }
}

const props = defineProps<{
  isPlayerTurn: boolean
  sessionId: string
  dices: Dice[]
}>()

const db = useFirestore()

const dicesRef = doc(db, 'diceSessionDices', props.sessionId).withConverter(
  diceSessionDicesConverter,
)

const dicesOnBoard = computed(() => {
  if (props.dices) {
    return props.dices.filter((dice: Dice) => dice.isOnBoard)
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
    6: { light: '/dice/colors/dice-white-six.png' },
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
        isOnBoard: false,
      },
    ],
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
</script>

<style scoped lang="scss">
.board-wrapper {
  width: 665px;
  height: 555px;
}
</style>
