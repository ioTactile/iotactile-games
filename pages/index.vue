<template>
  <div>
    <Head>
      <Title>Accueil - ioTactile Games</Title>
      <Meta
        name="description"
        content="ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs"
      />
    </Head>
    <v-container class="container">
      <v-row class="d-flex justify-center">
        <v-col cols="6" sm="4" md="3" class="px-1">
          <GameFramework
            img="/dice-version-1.png"
            alt="Dice game"
            title="Dice"
            link="/dice"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { VContainer, VRow, VCol } from 'vuetify/components'
</script>

<style scoped>
.container {
  max-width: 1080px !important;
}
</style>
