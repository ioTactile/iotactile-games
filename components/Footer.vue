<template>
  <div>
    <v-footer color="secondary" class="py-4">
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in links"
          :key="link"
          color="buttonBack"
          variant="outlined"
          class="mx-2"
          rounded="xl"
        >
          {{ link }}
        </v-btn>
    
        <v-col cols="12" class="text-center mt-4">
          © {{ new Date().getFullYear() }} - Réalisé par
          <a href="https://github.com/ioTactile" class="text-decoration-none text-headline">
            <strong>iotactile</strong>
          </a>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts" setup>
const links = [
    'Page d\'accueil',
    'À propos',
    'Me contacter'
]
</script>