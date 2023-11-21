import { defineStore } from 'pinia'

export const useDiceSoundsStore = defineStore(
  'diceSounds',
  () => {
    const isSoundEffectsActive = ref<boolean>(true)
    const isNotificationsActive = ref<boolean>(true)

    return {
      isSoundEffectsActive,
      isNotificationsActive
    }
  },
  {
    persist: true
  }
)
