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
        <div class="stat-card accent">
          <span class="stat-label">Meilleur score</span>
          <span class="stat-value">{{ stats.bestScore }}</span>
        </div>
        <div class="stat-card accent">
          <span class="stat-label">Longueur max</span>
          <span class="stat-value">{{ stats.bestLength }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { loadPlayerScoreboard } from '~/infrastructure/firestore/snakeScoreboardRepository';
import { createEmptySnakeScoreboard } from '~/utils/snake/scoreboard';

const stats = ref({
  gamesPlayed: 0,
  bestScore: 0,
  bestLength: 0,
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
      createEmptySnakeScoreboard(currentUser.uid, currentUser.displayName ?? 'Anonyme');

    stats.value = {
      gamesPlayed: scoreboard.gamesPlayed,
      bestScore: scoreboard.bestScore,
      bestLength: scoreboard.bestLength,
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
  font-family: 'Rajdhani', sans-serif;
  color: rgb(var(--v-theme-snakeMainOnSurface));

  &--status {
    justify-content: flex-start;
    padding-top: 2rem;
  }

  .status-message {
    text-align: center;
    font-size: 1.15rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
    max-width: 320px;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.25rem 1rem;
    border-radius: 4px;
    background: rgba(184, 255, 60, 0.06);
    border: 1px solid rgba(184, 255, 60, 0.25);

    &.accent {
      border-color: rgb(var(--v-theme-snakeMainPrimary));
    }

    .stat-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.75;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: rgb(var(--v-theme-snakeMainPrimary));
    }
  }
}
</style>
