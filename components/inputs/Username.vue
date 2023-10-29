<template>
  <v-text-field
    :model-value="modelValue"
    :rules="rules"
    :name="name"
    type="text"
    :variant="variant"
    :rounded="rounded"
    :density="density"
    :append-inner-icon="icon ? mdiAccount : undefined"
    @update:model-value="$emit('update:model-value', $event)"
  />
</template>

<script lang="ts" setup>
import {VTextField} from 'vuetify/components'
import {mdiAccount} from '@mdi/js'

const MIN_LENGTH = 3

withDefaults(
  defineProps<{
    modelValue?: string
    name?: string
    icon?: boolean
    variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
    rounded?: string
    density?: 'default' | 'comfortable' | 'compact'
  }>(),
  {
    modelValue: undefined,
    name: 'username',
    variant: undefined,
    rounded: undefined,
    density: undefined
  }
)

defineEmits<{ (e: 'update:model-value', value: string): void }>()

const rules = [
  (v?: string) => !!v || "Nom d'utilisateur requis",
  (v?: string) => (v && v.length >= MIN_LENGTH) || '3 caractères minimum'
]
</script>
