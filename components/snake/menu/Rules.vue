<template>
  <div class="rules-container">
    <section>
      <h3>Le jeu</h3>
      <p>
        Snake se joue sur une grille 20×20. Le serpent avance automatiquement. Utilise les flèches
        du clavier, le swipe ou les boutons pour changer de direction.
        <br />
        <br />
        Mange la pastille corail pour grandir et gagner des points. La partie se termine si tu
        touches un mur ou ton propre corps. Tu peux mettre en pause avec Espace.
      </p>
    </section>
    <section>
      <h3>Scores et résultats</h3>
      <p>
        Le classement est basé sur le meilleur score. Connecte-toi pour enregistrer tes parties via
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
  color: rgb(var(--v-theme-snakeMainOnSurface));
  font-family: 'Rajdhani', sans-serif;

  section {
    margin-bottom: 20px;

    h3 {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: rgb(var(--v-theme-snakeMainPrimary));
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    p {
      text-align: justify;
      padding: 0 20px;
      line-height: 1.5;
      font-size: 1.1rem;

      em {
        cursor: pointer;
        color: rgb(var(--v-theme-snakeMainPrimary));
        font-style: normal;
        font-weight: 700;
        text-decoration: underline;
      }
    }
  }
}
</style>
