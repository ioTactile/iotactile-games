// build a store for dices during a round of a player (not the dices of the game)

import { defineStore } from 'pinia'

export const useDicesStore = defineStore('dices', () => {
  const dices = ref<number[]>([])
  const selectedDices = ref<number[]>([])

  const addDice = (dice: number) => {
    selectedDices.value.push(dice)
  }
  const removeDice = (dice: number) => {
    dices.value.splice(dices.value.indexOf(dice), 1)
  }
  const resetDices = () => {
    dices.value = []
  }
  const getDices = () => {
    return dices.value
  }

  return {
    dices,
    selectedDices,
    addDice,
    removeDice,
    resetDices,
    getDices
  }
}, {
  persist: true
})
