import { defineStore } from 'pinia'

export const useLvTimerStore = defineStore('lvTimer', () => {
  const timer = ref<number>(0)
  const savedTimer = ref<number>(0)
  const linearProgress = ref<number>(0)
  const intervalId = ref<NodeJS.Timeout|null>(null)
  const isRunning = computed(() => intervalId.value !== null)

  const start = () => {
    timer.value = 60
    savedTimer.value = 0
    intervalId.value = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
        linearProgress.value = (timer.value / 60) * 100
      } else {
        stop()
      }
    }, 1000)
  }

  const stop = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value as NodeJS.Timeout)
      intervalId.value = null
    }
  }

  const save = () => {
    savedTimer.value = 60 - timer.value
    stop()
  }

  return {
    timer,
    linearProgress,
    isRunning,
    savedTimer,
    start,
    stop,
    save
  }
}, {
  persist: true
})
