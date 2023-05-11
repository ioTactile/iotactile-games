<template>
  <v-container fluid>
    <div class="d-flex flex-wrap justify-center mb-4">
      <v-btn
        v-for="(item, i) in items"
        :key="i"
        :to="`/dice${item.link}`"
        :append-icon="item.icon"
        color="buttonBack"
        variant="outlined"
        rounded="xl"
        class="mx-1"
        :class="xs || sm ? 'mb-2' : ''"
        :size="xs ? 'small' : 'default'"
      >
        {{ item.title }}
      </v-btn>
    </div>
    <NuxtPage />
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VBtn } from 'vuetify/components'
import { useDisplay } from 'vuetify'
import { mdiAccountMultiple, mdiTextBox, mdiAccountDetails, mdiNoteText } from '@mdi/js'

const { xs, sm } = useDisplay()

const items = [
  {
    title: 'Jouer',
    link: '/jouer',
    icon: mdiAccountMultiple
  },
  {
    title: 'Classement',
    link: '/classement',
    icon: mdiTextBox
  },
  {
    title: 'Résultats',
    link: '/resultats',
    icon: mdiAccountDetails
  },
  {
    title: 'Règles',
    link: '/regles',
    icon: mdiNoteText
  }
]
</script>
