<template>
  <div>
    <Head>
      <Title>À Propos - ioTactile Games</Title>
      <Meta name="description" content="Page où je présente le site et moi-même" />
    </Head>
    <v-container class="container">
      <h3 class="text-h3">
        À propos
      </h3>
      <section class="mt-10">
        <p>
          Salut moi c'est <strong>Jordan</strong> et je suis développeur web.
          Je suis passionné par le développement web et j'aime apprendre de nouvelles choses.<br>
          <br>
          <strong>iotactile Games</strong> est né du vide laisser par la fin d'Adobe Flash Player qui a entrainé
          la fermeture de nombreux sites de jeux en ligne.<br>
          <br>
          Ce projet est un site de jeux en ligne ou solo qui propose et proposera de nombreux jeux qui me tiennent à cœur.<br>
          <br>
          Le premier jeu que j'ai réalisé est <strong><NuxtLink to="/dice/jouer" class="text-decoration-none text-headline">Dice</NuxtLink></strong>
          qui est un jeu de dés qui se joue jusqu'à 4 joueurs. Le second sera problablement
          <strong><NuxtLink to="/lingua-vault/jouer" class="text-decoration-none text-headline">Lingua Vault</NuxtLink></strong>
          qui est un jeu similaire au jeu du mot de passe se jouant en un contre un.<br>
          <br>
          Ce site est en quelque sorte mon bac à sable, dans lequel je mets en pratique mes connaissances et mes idées.
          J'expérimente et j'apprends de nouvelles choses au fur et à mesure de l'avancement du projet.<br>
          <br>
          Si tu souhaites me contacter pour me relever un bogue, des idées ou un concept que tu souhaiterais avoir, des modifications que tu trouves
          pertinentes, tu peux le faire par email en cliquant
          <strong><NuxtLink to="/me-contacter" class="text-decoration-none text-headline">ici</NuxtLink></strong>.
        </p>
      </section>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { VContainer } from 'vuetify/components'
</script>

<style scoped>
.container {
  max-width: 1200px !important;
}
</style>
