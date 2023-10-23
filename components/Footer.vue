<template>
  <div>
    <v-divider />
    <v-footer class="py-4 bg-background">
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="(link, i) in links"
          :key="i"
          :to="link.link"
          color="buttonBack"
          variant="outlined"
          class="mx-2 mb-1"
          :size="xs ? 'small' : 'default'"
        >
          {{ link.title }}
        </v-btn>
        <v-btn
          color="buttonBack"
          variant="outlined"
          class="mx-2 mb-1"
          :size="xs ? 'small' : 'default'"
        >
          <a href="mailto:jbs.io@protonmail.com" class="text-decoration-none text-buttonBack">
            Me contacter
          </a>
        </v-btn>
        <v-col cols="12" class="text-center mt-4">
          © {{ new Date().getFullYear() }} - Réalisé par
          <a href="https://github.com/ioTactile" class="text-decoration-none">
            <strong class="text-tertiary">iotactile</strong>
          </a>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts" setup>
import { VFooter, VBtn, VRow, VCol, VDivider } from 'vuetify/components'
import { useDisplay } from 'vuetify'

// Vuetify

const { xs } = useDisplay()

const links = [
  {
    title: "Page d'accueil",
    link: '/'
  },
  {
    title: 'À propos',
    link: '/a-propos'
  }
]
</script>
