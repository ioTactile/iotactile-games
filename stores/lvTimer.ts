import { defineStore } from 'pinia'

export const useLvTimerStore = defineStore('lvTimer', () => {
  const timer = ref<number>(0)
  const savedTimer = ref<number>(0)
  // const comingTime = ref<number>(0)
  // const leavedTime = ref<number>(0)
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

  // onMounted(() => {
  //   comingTime.value = Date.now()

  //   if (leavedTime.value > 0) {
  //     const timeDiff = Math.floor((leavedTime.value - comingTime.value) / 1000)
  //     if (timeDiff > 0) {
  //       timer.value = timer.value - timeDiff
  //     }
  //   }
  // })

  // onUnmounted(() => {
  //   leavedTime.value = Date.now()
  // })

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
