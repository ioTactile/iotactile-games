<template>
  <div class="rules-wrapper">
    <section>
      <h3>Le jeu</h3>
      <p>
        Le démineur est un jeu de réflexion dont le but est de localiser toutes
        les mines du champ de mines le plus rapidement possible. Le jeu est
        considéré comme terminé lorsque le joueur a mis en évidence toutes les
        cases libres, c'est-à-dire sans mine, ou lorsque le joueur a cliqué sur
        une mine.
        <br />
        <br />
        Le jeu est composé de 3 niveaux de difficulté : facile, moyen et dur. Le
        nombre de mines est défini en fonction du niveau de difficulté. Il
        existe également un mode personnalisé qui permet de choisir le nombre de
        lignes, de colonnes et de mines.
        <br />
        <br />
        Le joueur peut placer avec le clic droit un drapeau sur les cases qu'il
        pense être des mines pour l'aider à les localiser. Le clic gauche quant
        à lui permet de révéler une case qui vous semble sûre. Si une case a été
        marquée d'un drapeau, il est possible de l'enlever en cliquant à nouveau
        sur la case avec le clic droit.
        <br />
        <br />
        Une case révélée peut contenir un nombre qui indique le nombre de mines
        à proximité de cette case. Si aucune mine n'est à proximité, la case est
        vide et les cases adjacentes sont révélées automatiquement.
        <br />
        <br />
        J'ai fais le choix de sécuriser le premier clic du joueur afin
        d'amoindrir la part d'aéatoire. Si le joueur clique sur une mine, il
        peut à nouveau cliquer sur une case jusqu'à ce qu'il tombe sur une case
        sûre.
        <br />
        <br />
        Le temps de jeu est enregistré pour chaque niveau de difficulté. Le but
        est de battre son propre record. Il faut être connecté pour pouvoir
        enregistrer son score.
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
  color: rgb(var(--v-theme-mineSweeperMainOnSurface));

  section {
    margin-bottom: 20px;

    h3 {
      font-family: 'Orbitron', sans-serif;
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
        color: rgb(var(--v-theme-mineSweeperMainPrimary));
      }
    }
  }
}
</style>
