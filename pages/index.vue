<template>
  <div>
    <h1 class="d-none">iotactile games</h1>
    <v-row class="d-flex">
      <v-col cols="12" sm="6" md="4" class="pa-2 ma-0">
        <GameFramework
          img="/dice/dice.png"
          alt="Dice"
          title="Dice"
          link="/dice"
          font="'Indie Flower', cursive"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" class="pa-2 ma-0">
        <GameFramework
          img="/minesweeper/minesweeper.png"
          alt="Démineur"
          title="Démineur"
          link="/demineur"
          font="'Orbitron', sans-serif"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" class="pa-2 ma-0">
        <GameFramework
          img="/takuzu/takuzu.png"
          alt="Takuzu"
          title="Takuzu"
          link="/takuzu"
          font="'Quicksand', sans-serif"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { VRow, VCol } from "vuetify/components";

useSeoMeta({
  title: "Accueil - ioTactile Games",
  ogTitle: "Accueil - ioTactile Games",
  twitterTitle: "Accueil - ioTactile Games",
  description:
    "ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs",
  ogDescription:
    "ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs",
  twitterDescription:
    "ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs",
  ogImage: "/iotactile-games.png",
  twitterImage: "/iotactile-games.png",
  twitterCard: "summary_large_image",
  ogUrl: "https://iotactile.games",
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});
</script>

<style scoped lang="scss">
div {
  margin: 0.5rem 0;
}
</style>
