import { defineStore } from 'pinia'

export const useDicesStore = defineStore('dices', () => {
  const diceOnBoard = ref<number[]>([])
  const diceOnHand = ref<number[]>([])

  // const addDiceOnBoard = (dice: number) => {
  //   diceOnHand.value.splice(diceOnHand.value.indexOf(dice), 1)
  //   diceOnBoard.value.push(dice)
  // }
  // const removeDiceOnBoard = (dice: number) => {
  //   diceOnBoard.value.splice(diceOnBoard.value.indexOf(dice), 1)
  //   diceOnHand.value.push(dice)
  // }
  // const addDiceOnHand = (dice: number) => {
  //   diceOnBoard.value.splice(diceOnBoard.value.indexOf(dice), 1)
  //   diceOnHand.value.push(dice)
  // }
  // const removeDiceOnHand = (dice: number) => {
  //   diceOnHand.value.splice(diceOnHand.value.indexOf(dice), 1)
  //   diceOnBoard.value.push(dice)
  // }
  // const resetDices = () => {
  //   diceOnBoard.value = []
  //   diceOnHand.value = []
  // }

  return {
    diceOnBoard,
    diceOnHand
  }
}, {
  persist: true
})
