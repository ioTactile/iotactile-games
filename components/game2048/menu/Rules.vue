<template>
  <div class="rules-container">
    <section>
      <h3>Le jeu</h3>
      <p>
        2048 se joue sur une grille 4×4. À chaque coup, toutes les tuiles glissent dans une
        direction (flèches du clavier, swipe ou boutons).
        <br />
        <br />
        Deux tuiles de même valeur fusionnent en une tuile de valeur double. Après chaque coup
        valide, une nouvelle tuile (2 ou 4) apparaît.
        <br />
        <br />
        Atteindre la tuile <strong>2048</strong> compte comme une victoire. Tu peux continuer à
        jouer pour viser un meilleur score. La partie se termine quand aucun coup n’est possible.
      </p>
    </section>
    <section>
      <h3>Scores et résultats</h3>
      <p>
        Le classement est basé sur le meilleur score. Connecte-toi pour enregistrer tes parties et
        consulter les sections
        <em @click="emit('action', 'ranking')">Classement</em> et
        <em @click="emit('action', 'results')">Résultats</em>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'action', value: string): void;
}>();
</script>

<style scoped lang="scss">
.rules-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: rgb(var(--v-theme-game2048MainOnSurface));
  font-family: 'Space Grotesk', sans-serif;

  section {
    margin-bottom: 20px;

    h3 {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: rgb(var(--v-theme-game2048MainPrimary));
    }

    p {
      text-align: justify;
      padding: 0 20px;
      line-height: 1.5;

      em {
        cursor: pointer;
        color: rgb(var(--v-theme-game2048MainPrimary));
        font-style: normal;
        font-weight: 600;
        text-decoration: underline;
      }
    }
  }
}
</style>
