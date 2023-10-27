<template>
  <button
    class="ml-6"
    :class="isNewMessage ? 'highlight' : ''"
    @click="clickButton"
  >
    <v-icon :icon="mdiChatProcessingOutline" size="46" color="white" />
  </button>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiChatProcessingOutline } from '@mdi/js'
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

const clickButton = () => {
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
          props.soundService.playSound('message')
          isNewMessage.value = true
        }
      }
    }
  },
)
</script>

<style scoped lang="scss">
button {
  width: 64px;
  height: 64px;
  background-color: rgb(var(--v-theme-diceMainTertiary));
  border-radius: 8px;
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.3);
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
