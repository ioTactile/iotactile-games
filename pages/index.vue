<template>
  <v-container class="container">
    <!-- Hero -->
    <v-row class="mx-auto">
      <!-- Text -->
      <v-col cols="12">
        <h1 class="text-h2 text-md-h1 mb-8">
          ioTactile Games
        </h1>
        <h2 class="text-h5 text-md-h4 mb-4">
          Bienvenue à toi
        </h2>
        <p class="text-h6 text-md-h5">
          De nombreux jeux t'attendent pour t'amuser en famille ou entre
          amis.<br>
          Tu trouveras les jeux dans la barre de navigation à gauche de ton
          écran.
        </p>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-alert
          color="green"
          elevation="2"
          class="text-h6 text-md-h5"
        >
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-row align="center">
                <v-col cols="12">
                  <h3 class="text-h6 text-md-h5 mb-2">
                    Un nouveau jeu est disponible !
                  </h3>
                  <p class="text-h6 text-md-h5">
                    <strong>Le jeu Dice</strong>
                  </p>
                </v-col>
                <v-col cols="12">
                  <v-img
                    src="/dice.png"
                    alt="Dice"
                    aspect-ratio="16/9"
                    cover
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                color="dicePrimary"
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
</template>

<script lang="ts" setup>
</script>

<style scoped>
.container {
  max-width: 1200px !important;
}
</style>
