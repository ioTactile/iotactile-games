
import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', () => {
  const timer = ref<number>()

  return {
    timer
  }
}, {
  persist: true
})
