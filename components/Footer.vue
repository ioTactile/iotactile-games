<template>
  <v-footer
    :class="{ 'rounded-t-lg': width > 1200 }"
    color="surface"
    absolute
    app
  >
    <div class="d-flex flex-wrap justify-space-evenly align-center w-100">
      <NuxtLink
        to="/a-propos"
        class="text-decoration-none text-onSurface pt-2 px-6"
      >
        À propos
      </NuxtLink>
      <div :class="{ 'order-3': xs }" class="pt-2 px-6">
        © {{ new Date().getFullYear() }} - Réalisé par
        <a
          href="https://github.com/ioTactile"
          target="_blank"
          class="text-decoration-none"
        >
          <strong class="text-onSurface">iotactile</strong>
        </a>
      </div>
      <a
        href="mailto:jbs.io@protonmail.com"
        class="text-decoration-none text-onSurface pt-2 px-6"
      >
        Me contacter
      </a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import { VFooter } from 'vuetify/components'
import { useDisplay } from 'vuetify'

const { width, xs } = useDisplay()
</script>
