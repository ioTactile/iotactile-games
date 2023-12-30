<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="text-center text-Onsurface">
          <h1 v-if="props.error.statusCode === 404">
            Erreur {{ props.error.statusCode }}
          </h1>
          <h2>Une erreur est survenue lors du chargement de la page</h2>
          <v-btn
            color="primary"
            to="/"
            class="mt-4 text-onPrimary"
            @mouseover="btnOutlined = false"
            @mouseleave="btnOutlined = true"
          >
            Retour à l'accueil
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { VApp, VMain, VContainer, VBtn } from "vuetify/components";

const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
  };
}>();

const btnOutlined = ref(true);

// eslint-disable-next-line no-console
console.error(props);

useHead({
  title:
    props.error.statusCode === 404
      ? "Page introuvable"
      : "Une erreur est survenue",
});
</script>
