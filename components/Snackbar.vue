<!-- <template>
  <v-snackbar v-model="show" :color="color">
    <div class="text-body-1">
      {{ message }}
      <template #actions>
        <v-btn color="button" icon="mdi-close" @click="show = false" />
      </template>
    </div>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { useSnackbarStore } from '~/stores/snackbar'

const show = ref(false)
const message = ref('')
const color = ref('')

const snackbarStore = useSnackbarStore()
snackbarStore.$subscribe((_, state) => {
  message.value = state.message
  color.value = state.color
  show.value = true
})
</script> -->

<template>
  <div />
</template>