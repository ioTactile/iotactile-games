<template>
  <div>
    <Head>
      <Title>Accueil - ioTactile Games</Title>
      <Meta name="description" content="ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs" />
    </Head>
    <v-container class="container">
      <!-- Hero -->
      <v-row class="mx-auto">
        <!-- Text -->
        <v-col cols="12">
          <h1 class="text-h4 text-md-h3 mb-4 font-weight-bold">
            ioTactile Games
          </h1>
          <span class="text-h5 text-md-h4 mb-4">
            Bienvenue à toi
          </span>
          <p class="text-h6 text-md-h5">
            De nombreux jeux t'attendent pour t'amuser en famille ou entre
            amis.<br>
            Tu trouveras les jeux dans la barre de navigation à gauche de ton
            écran.
          </p>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-alert
            color="secondary"
            elevation="2"
            class="text-h6 text-md-h5"
          >
            <v-row align="center">
              <v-col cols="12" md="8">
                <v-row align="center">
                  <v-col cols="12">
                    <span class="text-h6 text-md-h5">
                      Un nouveau jeu est disponible !
                    </span>
                    <h3 class="text-h6 text-md-h5 mt-2">
                      <strong>Dice</strong>
                    </h3>
                  </v-col>
                  <v-col cols="12">
                    <v-img
                      src="/dice-version-1.png"
                      alt="Dice"
                      aspect-ratio="16/9"
                      cover
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  color="diceClosePrimary"
                  to="/dice/jouer"
                  width="200"
                  height="56"
                  class="text-h5 text-md-h4"
                >
                  Jouer
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        <!-- Logo -->
        <!-- <img/> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { VContainer, VRow, VCol, VAlert, VImg, VBtn } from 'vuetify/components'
</script>

<style scoped>
.container {
  max-width: 1200px !important;
}
</style>
