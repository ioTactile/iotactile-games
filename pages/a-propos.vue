<template>
  <div>
    <h1>À propos</h1>
    <p>
      Salut moi c'est <strong>Jordan</strong> et je suis développeur web. Je
      suis passionné par le développement web et j'aime apprendre de nouvelles
      choses.
      <br />
      <br />
      <strong>iotactile Games</strong> est né du vide laisser par la fin d'Adobe
      Flash Player qui a entrainé la fermeture de nombreux sites de jeux en
      ligne.
      <br />
      <br />
      Ce projet est un site de jeux en ligne ou solo qui propose et proposera de
      nombreux jeux qui me tiennent à cœur.
      <br />
      <br />
      Le premier jeu que j'ai réalisé est
      <NuxtLink to="/dice" class="text-decoration-none text-onBackground">
        <strong>Dice</strong>
      </NuxtLink>
      qui est un jeu de dés qui se joue jusqu'à 4 joueurs. Le second jeu que
      j'ai réalisé est le
      <NuxtLink to="/demineur" class="text-decoration-none text-onBackground">
        <strong>Démineur</strong>
      </NuxtLink>
      qui se joue en solo.
      <br />
      <br />
      Ce site est en quelque sorte mon bac à sable, dans lequel je mets en
      pratique mes connaissances et mes idées. J'expérimente et j'apprends de
      nouvelles choses au fur et à mesure de l'avancement du projet.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'À propos - ioTactile Games',
  ogTitle: 'À propos - ioTactile Games',
  twitterTitle: 'À propos - ioTactile Games',
  description: 'Page où je présente le site et moi-même',
  ogDescription: 'Page où je présente le site et moi-même',
  twitterDescription: 'Page où je présente le site et moi-même',
  ogImage: '/iotactile-games.png',
  twitterImage: '/iotactile-games.png',
  twitterCard: 'summary_large_image',
  ogUrl: 'https://iotactile.games/a-propos'
})

useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})
</script>

<style scoped lang="scss">
div {
  max-width: 800px;
  text-align: justify;
  margin: 20px auto;

  h1 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 10px;
    color: rgb(var(--v-theme-onBackground));
  }

  p {
    margin: 0 20px;
  }
}
</style>
