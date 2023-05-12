import { defineStore } from 'pinia'

export const useDicesStore = defineStore('dices', () => {
  const diceOnBoard = ref<number[]>([])
  const diceOnHand = ref<number[]>([])

  return {
    diceOnBoard,
    diceOnHand
  }
}, {
  persist: true
})
