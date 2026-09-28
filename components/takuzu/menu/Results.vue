<template>
  <div class="results-container" :class="{ 'results-container--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir tes résultats.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <template v-else>
      <div v-for="(size, i) in results" :key="i" class="content">
        <div class="content__header">
          <div>Grilles {{ sizeFormatter(i) }}</div>
        </div>
        <div class="content__main">
          <button
            v-for="(difficulty, j) in size"
            :key="j"
            class="button-difficulty"
            :style="difficultyBackgroundColorStyle(j)"
          >
            {{ difficulty.victories }}

            <div v-if="difficulty.bestTime > 0" class="timer">
              {{ timerFormatter(difficulty.bestTime, true) }}
            </div>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { timerFormatter } from '~/utils';
import { loadPlayerScoreboard } from '~/infrastructure/firestore/takuzuScoreboardRepository';
import { createEmptyTakuzuScoreboard } from '~/utils/takuzu/scoreboard';
import type { TakuzuVictory } from '~/types/models';

interface SizeBoard {
  easy: TakuzuVictory;
  medium: TakuzuVictory;
  hard: TakuzuVictory;
  expert: TakuzuVictory;
}

const results = ref<SizeBoard[]>([]);
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
      createEmptyTakuzuScoreboard(currentUser.uid, currentUser.displayName ?? 'Anonyme');

    results.value = [
      scoreboard.sixBySix,
      scoreboard.eightByEight,
      scoreboard.tenByTen,
      scoreboard.twelveByTwelve,
    ];
  } catch {
    loadError.value = 'Impossible de charger tes résultats.';
  } finally {
    isLoading.value = false;
  }
});

const sizeFormatter = (value: number) => {
  const sizes = ['6 x 6', '8 x 8', '10 x 10', '12 x 12'];
  return sizes[value];
};

const difficultyBackgroundColorStyle = (value: string) => {
  const colors = ['#4CAF50', '#3F51B5', '#FF9800', '#F44336'];
  switch (value) {
    case 'easy':
      return `background-color: ${colors[0]}`;
    case 'medium':
      return `background-color: ${colors[1]}`;
    case 'hard':
      return `background-color: ${colors[2]}`;
    case 'expert':
      return `background-color: ${colors[3]}`;
    default:
      return '';
  }
};
</script>

<style scoped lang="scss">
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;

  &--status {
    justify-content: flex-start;
    padding-top: 1.5rem;
  }

  .status-message {
    text-align: center;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
    margin: 0;
    padding: 0 1rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--v-theme-takuzuMainShadow));
    color: #000000;
    width: 100%;
    padding: 10px;

    .content__header {
      text-align: center;
      margin-bottom: 10px;
    }

    .content__main {
      display: flex;
      align-items: center;
      justify-content: center;

      .button-difficulty {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        font-weight: 700;
        font-size: 0.85rem;
        margin: 0 10px;

        &:hover {
          .timer {
            display: block;
          }
        }

        .timer {
          position: absolute;
          top: -35px;
          left: -17.5px;
          display: none;
          background-color: #ffffff;
          color: #000000;
          border-radius: 8px;
          font-weight: 500;
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>
