<template>
  <div class="d-flex flex-column">
    <div class="header d-flex justify-space-between">
      <div>Classement</div>
      <div>Joueur</div>
      <div>Victoire</div>
    </div>
    <div class="content-wrapper">
      <div v-for="(player, i) in scoreboard" :key="i" class="content d-flex justify-space-between">
        <div>{{ i + 1 }}</div>
        <div>{{ player.username }}</div>
        <div>{{ player.victories }}</div>
      </div>
    </div>
  </div>
</template>

<script async setup lang="ts">
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { diceScoreboardConverter } from '~/stores'

const db = useFirestore()

const scoreboardRef = collection(db, 'diceScoreboard').withConverter(diceScoreboardConverter)
const scoreboardQuery = query(scoreboardRef, orderBy('victories', 'desc'))
const scoreboardDocs = await getDocs(scoreboardQuery)
const scoreboard = scoreboardDocs.docs.map((doc) => doc.data())
</script>

<style scoped lang="scss">
.header {
  width: 500px;
  height: 40px;
  font-size: 1.25rem;
  background-color: rgb(var(--v-theme-diceMainLightTertiary));

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.content-wrapper {
  height: 400px;
  width: 500px;
  overflow-y: auto;
  .content {
    height: 50px;
    font-size: 1.25rem;
    background-color: rgb(var(--v-theme-diceMainDarkTertiary));

    div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .content:nth-child(even) {
    background-color: rgb(var(--v-theme-diceMainLightTertiary));
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgb(204, 204, 204);
}
</style>
