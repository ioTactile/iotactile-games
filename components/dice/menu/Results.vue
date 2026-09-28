<template>
  <div class="results-wrapper" :class="{ 'results-wrapper--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir tes résultats.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <div v-else-if="playerResults" class="d-flex flex-column">
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
            playerResults.games > 0
              ? numberFormatter(playerResults.victories / playerResults.games, true)
              : numberFormatter(0, true)
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
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { numberFormatter } from '~/utils';
import { loadPlayerScoreboard } from '~/infrastructure/firestore/diceScoreboardRepository';
import { createEmptyDiceScoreboard } from '~/utils/dice/scoreboardRepository';
import type { DiceScoreboard } from '~/types/models';

const playerResults = ref<DiceScoreboard | null>(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const loadError = ref('');

const showStatus = computed(
  () => !isAuthenticated.value || isLoading.value || Boolean(loadError.value),
);

onMounted(async () => {
  isLoading.value = true;
  loadError.value = '';

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      isAuthenticated.value = false;
      return;
    }

    isAuthenticated.value = true;
    const scoreboard = await loadPlayerScoreboard(currentUser.uid);
    playerResults.value =
      scoreboard ??
      createEmptyDiceScoreboard(currentUser.uid, currentUser.displayName ?? 'Anonyme');
  } catch {
    loadError.value = 'Impossible de charger tes résultats.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.results-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  &--status {
    align-items: stretch;
    padding-top: 1.5rem;
  }
}

.status-message {
  text-align: center;
  color: rgb(var(--v-theme-onSurface));
  margin: 0;
  padding: 0 1rem;
}

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
