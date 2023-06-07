<template>
  <div>
    <v-card rounded="xl" height="42" class="d-flex justify-center align-center px-2">
      <v-btn :icon="isSoundMuted ? mdiVolumeOff : mdiVolumeHigh" variant="text" />
      <v-slider
        v-model="newVolume"
        density="compact"
        min="0"
        max="1"
        step="0.01"
        thumb-size="12"
        track-size="2"
        hide-details
        direction="vertical"
        @update:model-value="emits('update:modelValue', $event)"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import {
  VCard,
  VBtn,
  VSlider
} from 'vuetify/components'
import { mdiVolumeHigh, mdiVolumeOff } from '@mdi/js'

const props = defineProps<{
  modelValue: number
}>()

const emits = defineEmits<{(e: 'update:modelValue', value: number): void }>()

const isSoundMuted = ref(false)
const newVolume = ref<number>(props.modelValue)

watch(newVolume, (newValue) => {
  newVolume.value = newValue
  if (newValue === 0) {
    isSoundMuted.value = true
  } else {
    isSoundMuted.value = false
  }
})
</script>
