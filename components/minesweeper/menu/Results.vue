<template>
  <div class="results-container" :class="{ 'results-container--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir tes résultats.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <template v-else-if="playerResults">
      <div v-for="(difficulty, i) in difficulties" :key="i" class="content">
        <button class="button-difficulty" @click="getDifficultyResults(difficulty)">
          <h2>{{ getDifficultyName(difficulty) }}</h2>
          <v-icon :icon="mdiChevronDown" color="onSurface" />
        </button>
        <template v-if="isDifficulty(difficulty)">
          <template v-if="playerResults[difficulty].victories > 0">
            <div class="content__header">
              <div>Victoires</div>
              <div>Temps</div>
              <div>Date</div>
            </div>
            <div class="content__main">
              <div>
                {{ playerResults[difficulty].victories }}
              </div>
              <div>
                {{ timerFormatter(playerResults[difficulty].bestTime, true) }}
              </div>
              <div>
                {{ dateFormatter(playerResults[difficulty].victoryDate) }}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-best-time">Aucune partie n'a été gagnée dans cette difficulté</div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { VIcon } from 'vuetify/components';
import { mdiChevronDown } from '@mdi/js';
import { timerFormatter, dateFormatter } from '~/utils';
import { loadPlayerScoreboard } from '~/infrastructure/firestore/mineSweeperScoreboardRepository';
import { createEmptyMineSweeperScoreboard } from '~/utils/minesweeper/scoreboard';
import type { MineSweeperScoreboard } from '~/types/models';
import type { Difficulty } from '~/utils/minesweeper/types';

type DifficultyWithoutCustom = Exclude<Difficulty, 'custom'>;

const difficulties: DifficultyWithoutCustom[] = ['beginner', 'intermediate', 'expert'];

const playerResults = ref<MineSweeperScoreboard | null>(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const loadError = ref('');

const showStatus = computed(
  () => !isAuthenticated.value || isLoading.value || Boolean(loadError.value),
);

const difficultyState = ref<{ [key in Difficulty]: boolean }>({
  beginner: true,
  intermediate: true,
  expert: true,
  custom: true,
});

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
      createEmptyMineSweeperScoreboard(currentUser.uid, currentUser.displayName ?? 'Anonyme');
  } catch {
    loadError.value = 'Impossible de charger tes résultats.';
  } finally {
    isLoading.value = false;
  }
});

const getDifficultyResults = (difficulty: Difficulty): void => {
  difficultyState.value[difficulty] = !difficultyState.value[difficulty];
};

const isDifficulty = (difficulty: Difficulty): boolean => {
  return difficultyState.value[difficulty];
};

const getDifficultyName = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'Débutant';
    case 'intermediate':
      return 'Intermédiaire';
    case 'expert':
      return 'Expert';
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
    color: rgb(var(--v-theme-mineSweeperOnSurface));
    margin: 0;
    padding: 0 1rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .content__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 40px;
      font-size: 1.25rem;
      color: rgb(var(--v-theme-onSurfaceButton));
      background-color: rgb(var(--v-theme-mineSweeperMainSecondary));

      div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media screen and (max-width: 600px) {
        font-size: 1rem;
      }
    }

    .content__main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 50px;
      font-size: 1.25rem;
      color: rgb(var(--v-theme-onSurfaceButton));
      background-color: rgb(var(--v-theme-mineSweeperMainPrimary));

      div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media screen and (max-width: 600px) {
        font-size: 1rem;
      }
    }

    .button-difficulty {
      display: grid;
      grid-template-columns: 1fr 2rem;
      align-items: center;
      width: 100%;
      height: 50px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      border-top: 4px solid rgb(var(--v-theme-mineSweeperMainSecondary));
      border-left: 4px solid rgb(var(--v-theme-mineSweeperMainSecondary));
      border-right: 4px solid rgb(var(--v-theme-mineSweeperMainTertiary));
      border-bottom: 4px solid rgb(var(--v-theme-mineSweeperMainTertiary));
      background-color: rgb(var(--v-theme-mineSweeperMainPrimary));

      h2 {
        text-transform: uppercase;
        font-size: 1.5rem;
        margin-left: 2rem;
        color: rgb(var(--v-theme-onSurface));
        font-weight: 400;

        @media screen and (max-width: 600px) {
          font-size: 1.25rem;
        }
      }
    }

    .no-best-time {
      margin-top: 1rem;
      text-align: center;
      font-size: 1.25rem;
      color: rgb(var(--v-theme-mineSweeperOnSurface));

      @media screen and (max-width: 600px) {
        font-size: 1rem;
      }
    }
  }
}
</style>
