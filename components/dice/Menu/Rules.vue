<template>
  <div class="rules-wrapper">
    <section>
      <h3>Le jeu</h3>
      <p>
        Dice est un jeu de dés qui se joue jusqu'à 4 joueurs. <br />
        <br />
        Les joueurs lancent les dés jusqu’à trois fois de suite par manche. Au premier lancer, les
        cinq dés sont utilisés. Ensuite, à vous de décider combien de dés vous souhaitez utiliser
        pour le deuxième et troisième lancer. <br />
        <br />
        Pour ce faire, touchez les dés que vous voulez garder et ne lancez que ceux dont vous n’avez
        pas besoin pour faire le meilleur score possible. Vous pouvez ainsi tenter d’améliorer votre
        score au deuxième et troisième essai.
      </p>
    </section>
    <section>
      <h3>Les Points</h3>
      <p>
        La fiche de scores comporte une partie supérieure et une partie inférieure. <br />
        <br />
        La partie supérieure comporte les cases des 1, 2, 3, 4, 5 et 6. Si vous décidez de saisir le
        résultat de votre lancer dans cette partie, tous les points correspondant à la valeur de la
        case seront additionnés et saisis ici. <br />
        <br />
        Pour avoir le bonus de <strong>35 points</strong>, vous devez marquer au moins 63 points au
        total dans la partie supérieure. <br />
        <br />
        La partie inférieur comporte les lancers spéciaux : <br />
        <br />
        - Le <strong>Brelan</strong> nécessite 3 dés identiques. [6] [6] [6] [3] [1] = 22 points
        <br />
        - Le <strong>Carré</strong> nécessite 4 dés identiques. [3] [3] [3] [3] [5] = 17 points
        <br />
        - Le <strong>Full</strong> nécessite 3 dés identiques et 2 dés identiques. [4] [4] [4] [3]
        [3] = 25 points <br />
        - La <strong>Petite suite</strong> nécessite 4 dés consécutifs. [1] [2] [3] [4] [6] = 30
        points <br />
        - La <strong>Grande suite</strong> nécessite 5 dés consécutifs. [2] [3] [4] [5] [6] = 40
        points <br />
        - Le <strong>Yams</strong> nécessite 5 dés identiques. [5] [5] [5] [5] [5] = 50 points
        <br />
        - La <strong>Chance</strong> est la somme de tous les dés. [2] [3] [4] [5] [5] = 19 points
        <br />
        <br />
        Si vous ne pouvez pas saisir le résultat de votre lancer dans la partie supérieure, vous
        devez saisir le résultat dans la partie inférieure et inversement. <br />
        <br />
        La partie se termine lorsque tous les joueurs ont rempli toutes les cases de leur fiche de
        scores. <br />
      </p>
    </section>
    <section>
      <h3>Scores et résultats</h3>
      <p>
        Celui qui obtient le plus haut score remporte la victoire. <br />
        <br />
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

  section {
    margin-bottom: 20px;

    h3 {
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
        color: rgb(var(--v-theme-diceMainTertiary));
      }
    }
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgb(204, 204, 204);
}
</style>
