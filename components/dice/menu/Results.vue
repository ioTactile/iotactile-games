<template>
  <div v-if="playerResults" class="d-flex flex-column">
    <div class="header d-flex justify-space-between">
      <div>Parties</div>
      <div>Victoires</div>
      <div>Taux</div>
    </div>
    <div class="content d-flex justify-space-between">
      <div>{{ playerResults.games }}</div>
      <div>{{ playerResults.victories }}</div>
      <div>
        {{
          numberFormatter(playerResults.victories / playerResults.games, true)
        }}
      </div>
    </div>
    <div class="header d-flex justify-space-between">
      <div>Score Max</div>
      <div>Score moyen</div>
      <div>Dice</div>
    </div>
    <div class="content d-flex justify-space-between">
      <div>{{ playerResults.maxScore }}</div>
      <div>{{ numberFormatter(playerResults.averageScore, false) }}</div>
      <div>{{ playerResults.dice }}</div>
    </div>
  </div>
</template>

<script async setup lang="ts">
import { doc, getDoc } from "firebase/firestore";
import { numberFormatter } from "~/utils";

const db = useFirestore();
const user = useCurrentUser();

const playerScoreboardRef = doc(
  db,
  "diceScoreboard",
  user.value!.uid,
).withConverter(diceScoreboardConverter);
const playerScoreboardDoc = await getDoc(playerScoreboardRef);
const playerResults = playerScoreboardDoc.data();
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

.content {
  width: 500px;
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
</style>
