<template>
  <div class="rules-wrapper">
    <section>
      <h3>Le jeu</h3>
      <p>
        Takuzu ou Binairo est un jeu de réflexion dont le but est de remplir une
        grille avec des boules noires et blanches en respectant les règles de
        jeu suivantes :
        <br />
        <br />
        - Il doit y avoir autant de boules blanches que de boules noires sur
        chaque ligne et chaque colonne.
        <br />
        <br />
        - Il ne doit pas y avoir plus de deux boules de la même couleur côte à
        côte.
        <br />
        <br />
        - Chaque ligne et chaque colonne doit être unique.
        <br />
        <br />
        Le jeu est composé de 4 tailles de grille : 6x6, 8x8, 10x10 et 12x12.
        Ainsi que 4 niveaux de difficulté : facile, moyen et difficile et
        expert.
        <br />
        <br />
        Le joueur peut placer à l'aide du clic gauche une boule qui suit la
        rotation suivante : noire, blanche, vide.
        <br />
        <br />
        Le temps de jeu est enregistré après chaque victoire. Le but est de
        battre son propre record. Il faut être connecté pour pouvoir enregistrer
        son score.
      </p>
    </section>
    <section>
      <h3>Scores et résultats</h3>
      <p>
        Vos scores, ainsi que votre classement, se trouve dans les sections
        <em @click="emit('action', 'ranking')">Classement</em> et
        <em @click="emit('action', 'results')">Résultats</em> du menu.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'action', value: string): void
}>()
</script>

<style scoped lang="scss">
.rules-wrapper {
  height: 400px;
  width: 500px;
  overflow-y: auto;
  color: rgb(var(--v-theme-takuzuMainOnSurface));

  @media screen and (max-width: 600px) {
    width: 100%;
    height: 100%;
  }

  section {
    margin-bottom: 20px;

    h3 {
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 10px;
      text-align: center;
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
      text-align: justify;
      padding: 0 20px;

      em {
        cursor: pointer;
        color: rgb(var(--v-theme-takuzuMainSecondary));
      }
    }
  }
}
</style>
