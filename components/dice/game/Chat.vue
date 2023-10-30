<template>
  <button
    class="ml-6"
    :class="isNewMessage ? 'highlight' : ''"
    @click="openChat"
  >
    <div class="svg-container">
      <svg
        width="46px"
        height="46px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />

        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          <path
            d="M8 10.5H16"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M8 14H13.5"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </g>
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { LocalDiceSessionChatType } from '~/stores'
import SoundService from '~/utils/soundService'

const props = defineProps<{
  chatMessages: LocalDiceSessionChatType['messages'] | undefined
  isChatActive: boolean
  soundService: SoundService
}>()

const emit = defineEmits<{
  (e: 'openChat', value: boolean): void
}>()

const isNewMessage = ref<boolean>(false)

const openChat = () => {
  isNewMessage.value = false
  emit('openChat', true)
}

watch(
  () => props.chatMessages,
  (newValue, oldValue) => {
    if (
      newValue !== undefined &&
      oldValue !== undefined &&
      newValue.length > 0
    ) {
      if (oldValue !== newValue) {
        if (!props.isChatActive) {
          if (!props.soundService.isSoundMuted('message')) {
            props.soundService.playSound('message')
          }
          isNewMessage.value = true
        }
      }
    }
  }
)
</script>

<style scoped lang="scss">
button {
  width: 64px;
  height: 64px;
  background-color: rgb(var(--v-theme-diceMainTertiary));
  border-radius: 8px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  &.highlight {
    animation: borderAnimation 3s linear infinite;
  }
}

@keyframes borderAnimation {
  0% {
    border: 2px solid transparent;
  }
  25% {
    border: 2px solid white;
  }
  50% {
    border: 2px solid transparent;
  }
  75% {
    border: 2px solid white;
  }
  100% {
    border: 2px solid transparent;
  }
}
</style>
