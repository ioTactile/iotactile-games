<template>
  <v-container class="container">
    <section class="my-4">
      <h2 class="pb-2">
        Le jeu
      </h2>
      <p>
        Lingua-vault est un jeu de mots similaire au jeu <em>Mot de passe</em> dont le principe est
        de deviner et faire deviner des mots. <br> <br>
        L'objectif est de faire deviner le mot qui vous est proposé à votre complice avec le moins d'indices
        possible et inversement. <br> <br>
        Le jeu se déroule en <strong>4 manches</strong> et vous avez le droit à
        <strong>1 minute</strong> et <strong>4 indices</strong> par manche. <br> <br>
      </p>
    </section>
    <section class="my-4">
      <h2 class="pb-2">
        Les indices interdits
      </h2>
      <p>
        Certains indices vous sont interdits pour faire devenir un mot. Si votre indice n'est pas
        autorisé, un message vous en informera. <br> <br>
        Un indice doit être dans le dictionnaire francais (une faute d'ortographe est tolérée pour les
        mots de plus de cinq lettres). <br> <br>
        Les trois premières lettres de l'indice doivent être différentes des trois premières lettres
        du mot à faire deviner. <strong>Tartiflette</strong> est un indice interdit pour le mot
        <strong>tarte</strong>. <br> <br>
        les seuls caractères autorisés sont les lettres. <strong>Centre-ville</strong> n'est pas
        autorisé en revanche <strong>centreville</strong> l'est. <br> <br>
      </p>
    </section>
    <section class="my-4">
      <h2 class="pb-2">
        Scores et résultats
      </h2>
      <p>
        Il y a deux scores. Un score "faire deviner" et un score "deviner". Tout le monde commence à
        <strong>1000</strong> points. Lorsqu'une manche est gagnée le socre correspondant augmente.
        À l'inverse lorsqu'une manche est perdue le score correspondant diminue. <br> <br>
        Vos scores, ainsi que votre classement, se trouve dans les pages <em>Classement</em> et
        <em>Résultats</em>
        du menu. <br> <br>
      </p>
    </section>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 1200px !important;
}
</style>