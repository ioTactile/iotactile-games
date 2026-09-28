<template>
  <div class="ranking-wrapper" :class="{ 'ranking-wrapper--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir le classement.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <div v-else class="d-flex flex-column">
      <div class="header d-flex justify-space-between">
        <div>Classement</div>
        <div>Joueur</div>
        <div>Victoire</div>
      </div>
      <div class="content-wrapper">
        <div
          v-for="(player, i) in scoreboard"
          :key="player.userId"
          class="content d-flex justify-space-between"
        >
          <div>{{ i + 1 }}</div>
          <div>{{ player.username }}</div>
          <div>{{ player.victories }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { loadRankingScoreboards } from '~/infrastructure/firestore/diceScoreboardRepository';
import type { DiceScoreboard } from '~/types/models';

const scoreboard = ref<DiceScoreboard[]>([]);
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
    scoreboard.value = await loadRankingScoreboards();
  } catch {
    loadError.value = 'Impossible de charger le classement.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.ranking-wrapper {
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

    &:nth-child(even) {
      background-color: rgb(var(--v-theme-diceMainLightTertiary));
    }
  }
}
</style>
