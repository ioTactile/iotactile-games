<template>
  <div class="ranking-container" :class="{ 'ranking-container--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir le classement.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <template v-else-if="rankedPlayers.length === 0">
      <p class="status-message">Aucune partie enregistrée pour le moment.</p>
    </template>
    <template v-else>
      <div class="players-header">
        <div>#</div>
        <div>Joueur</div>
        <div>Score</div>
        <div>Tuile</div>
      </div>
      <div class="players-list">
        <div v-for="(player, i) in rankedPlayers" :key="player.userId" class="player-row">
          <div>{{ i + 1 }}</div>
          <div>{{ player.username }}</div>
          <div>{{ player.bestScore }}</div>
          <div>{{ player.bestTile }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { loadAllScoreboards } from '~/infrastructure/firestore/game2048ScoreboardRepository';

type RankedPlayer = {
  userId: string;
  username: string;
  bestScore: number;
  bestTile: number;
};

const rankedPlayers = ref<RankedPlayer[]>([]);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const loadError = ref('');

const showStatus = computed(
  () =>
    !isAuthenticated.value ||
    isLoading.value ||
    Boolean(loadError.value) ||
    rankedPlayers.value.length === 0,
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
    const all = await loadAllScoreboards();
    rankedPlayers.value = all
      .filter((sb) => sb.bestScore > 0)
      .map((sb) => ({
        userId: sb.userId,
        username: sb.username,
        bestScore: sb.bestScore,
        bestTile: sb.bestTile,
      }))
      .sort((a, b) => b.bestScore - a.bestScore || b.bestTile - a.bestTile);
  } catch {
    loadError.value = 'Impossible de charger le classement.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.ranking-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  color: rgb(var(--v-theme-game2048MainOnSurface));

  &--status {
    justify-content: flex-start;
    padding-top: 2rem;
  }

  .status-message {
    text-align: center;
  }

  .players-header,
  .player-row {
    display: grid;
    grid-template-columns: 48px 1fr 88px 72px;
    gap: 0.5rem;
    align-items: center;
    padding: 0.65rem 0.75rem;
  }

  .players-header {
    font-weight: 700;
    color: rgb(var(--v-theme-game2048MainPrimary));
    border-bottom: 2px solid rgba(45, 212, 168, 0.35);
  }

  .players-list {
    overflow-y: auto;
    flex: 1;
  }

  .player-row {
    border-bottom: 1px solid rgba(45, 212, 168, 0.15);

    &:nth-child(odd) {
      background: rgba(45, 212, 168, 0.06);
    }
  }
}
</style>
