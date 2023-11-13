<template>
  <v-text-field
    :model-value="modelValue"
    :append-inner-icon="show ? mdiEye : mdiEyeOff"
    :rules="rules"
    :type="show ? 'text' : 'password'"
    :rounded="rounded"
    :variant="variant"
    name="password"
    label="Mot de passe"
    class="input-group--focused"
    @click:append-inner="show = !show"
    @update:model-value="$emit('update:model-value', $event)"
    @keypress.enter="$emit('press-enter')"
  />
</template>

<script setup lang="ts">
import { VTextField } from 'vuetify/components'
import { mdiEye, mdiEyeOff } from '@mdi/js'

const MIN_LENGTH = 6

defineProps<{
  modelValue?: string
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
  rounded?: boolean
}>()
defineEmits<{
  (e: 'update:model-value', value?: string): void
  (e: 'press-enter'): void
}>()

const show = ref(false)

const rules = [
  (v?: string) => !!v || 'Mot de passe requis',
  (v: string) => (v && v.length >= MIN_LENGTH) || '6 caractères minimum'
]
</script>
