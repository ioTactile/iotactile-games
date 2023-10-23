import { defineStore } from 'pinia'
import { Dice } from '~/functions/src/types'

export const useDicesStore = defineStore(
  'dices',
  () => {
    const dices = ref<Dice[]>([])

    return {
      dices
    }
  },
  {
    persist: true
  }
)
