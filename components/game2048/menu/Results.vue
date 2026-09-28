<template>
  <div class="results-container" :class="{ 'results-container--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir tes résultats.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <template v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Parties</span>
          <span class="stat-value">{{ stats.gamesPlayed }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Victoires</span>
          <span class="stat-value">{{ stats.victories }}</span>
        </div>
        <div class="stat-card accent">
          <span class="stat-label">Meilleur score</span>
          <span class="stat-value">{{ stats.bestScore }}</span>
        </div>
        <div class="stat-card accent">
          <span class="stat-label">Tuile max</span>
          <span class="stat-value">{{ stats.bestTile }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { loadPlayerScoreboard } from '~/infrastructure/firestore/game2048ScoreboardRepository';
import { createEmptyGame2048Scoreboard } from '~/utils/game2048/scoreboard';

const stats = ref({
  gamesPlayed: 0,
  victories: 0,
  bestScore: 0,
  bestTile: 0,
});
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
    const playerResults = await loadPlayerScoreboard(currentUser.uid);
    const scoreboard =
      playerResults ??
      createEmptyGame2048Scoreboard(currentUser.uid, currentUser.displayName ?? 'Anonyme');

    stats.value = {
      gamesPlayed: scoreboard.gamesPlayed,
      victories: scoreboard.victories,
      bestScore: scoreboard.bestScore,
      bestTile: scoreboard.bestTile,
    };
  } catch {
    loadError.value = 'Impossible de charger tes résultats.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  color: rgb(var(--v-theme-game2048MainOnSurface));

  &--status {
    justify-content: flex-start;
    padding-top: 2rem;
  }

  .status-message {
    text-align: center;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    max-width: 360px;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border-radius: 12px;
    background: rgba(13, 17, 23, 0.08);
    border: 1px solid rgba(45, 212, 168, 0.25);

    &.accent {
      border-color: rgb(var(--v-theme-game2048MainPrimary));
      background: rgba(45, 212, 168, 0.12);
    }

    .stat-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 0.75;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: rgb(var(--v-theme-game2048MainPrimary));
    }
  }
}
</style>
