<template>
  <div class="results-container" :class="{ 'results-container--status': showStatus }">
    <p v-if="!isAuthenticated" class="status-message">Connecte-toi pour voir le classement.</p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <template v-else>
      <div v-for="(size, i) in scoreboard" :key="i" class="results-content">
        <div class="results-content__header">
          <div>Grilles {{ sizeFormatter(i) }}</div>
        </div>
        <div class="results-content__main">
          <button
            v-for="(_, j) in size"
            :key="j"
            class="button-difficulty"
            :style="difficultyBackgroundColorStyle(j)"
            @click="setSelectResults(i, j)"
          >
            {{ numPlayers(i, j) }}
          </button>
        </div>
      </div>
      <template v-if="selectResults.length > 0">
        <div class="players-content">
          <div class="players-content__header">
            <div class="header">Classement</div>
            <div class="header">Joueur</div>
            <div class="header">Temps</div>
          </div>
          <div class="players-content-wrapper">
            <div v-for="(player, k) in selectResults" :key="k" class="players-content__main">
              <div class="content">{{ k + 1 }}</div>
              <div class="content">{{ player.username }}</div>
              <div class="content">
                {{ timerFormatter(player.bestTime, true) }}
              </div>
            </div>
          </div>
          <div class="players-content__footer">
            <button class="button-back" @click="backToRanking">Retour</button>
          </div>
        </div>
      </template>
      <template v-if="isNotResults === true">
        <span class="no-best-time"> Aucune partie n'a été gagnée dans cette difficulté </span>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { loadAllScoreboards } from '~/infrastructure/firestore/takuzuScoreboardRepository';
import { timerFormatter } from '~/utils';
import type { TakuzuVictory } from '~/types/models';
import type { Difficulty } from '~/utils/takuzu/types';

interface SizeBoard {
  easy: TakuzuVictory;
  medium: TakuzuVictory;
  hard: TakuzuVictory;
  expert: TakuzuVictory;
}

interface PlayerScoreboard {
  username: string;
  scoreboard: SizeBoard[];
}

interface RankedPlayer {
  username: string;
  bestTime: number;
}

const playersScoreboard = ref<PlayerScoreboard[]>([]);
const selectResults = ref<RankedPlayer[]>([]);
const isNotResults = ref(false);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const loadError = ref('');

const showStatus = computed(
  () => !isAuthenticated.value || isLoading.value || Boolean(loadError.value),
);

const scoreboard = [
  { easy: {}, medium: {}, hard: {}, expert: {} },
  { easy: {}, medium: {}, hard: {}, expert: {} },
  { easy: {}, medium: {}, hard: {}, expert: {} },
  { easy: {}, medium: {}, hard: {}, expert: {} },
];

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
    const scoreboards = await loadAllScoreboards();

    playersScoreboard.value = scoreboards.map((playerScoreboard) => ({
      username: playerScoreboard.username,
      scoreboard: [
        playerScoreboard.sixBySix,
        playerScoreboard.eightByEight,
        playerScoreboard.tenByTen,
        playerScoreboard.twelveByTwelve,
      ],
    }));
  } catch {
    loadError.value = 'Impossible de charger le classement.';
  } finally {
    isLoading.value = false;
  }
});

const setSelectResults = (size: number, difficulty: Difficulty): void => {
  const ranked = playersScoreboard.value
    .map((player) => ({
      username: player.username,
      bestTime: player.scoreboard[size][difficulty].bestTime,
    }))
    .filter((player) => player.bestTime > 0)
    .sort((a, b) => a.bestTime - b.bestTime);

  selectResults.value = ranked;
  isNotResults.value = ranked.length === 0;
};

const sizeFormatter = (value: number): string => {
  const sizes = ['6 x 6', '8 x 8', '10 x 10', '12 x 12'];
  return sizes[value];
};

const difficultyBackgroundColorStyle = (value: string): string => {
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

const numPlayers = (size: number, difficulty: Difficulty): number => {
  return playersScoreboard.value.filter(
    (player) => player.scoreboard[size][difficulty].bestTime > 0,
  ).length;
};

const backToRanking = (): void => {
  selectResults.value = [];
  isNotResults.value = false;
};
</script>

<style scoped lang="scss">
.results-container {
  position: relative;
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

  .results-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--v-theme-takuzuMainShadow));
    color: #000000;
    width: 100%;
    padding: 10px;

    .results-content__header {
      text-align: center;
      margin-bottom: 10px;
    }

    .results-content__main {
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
      }
    }
  }

  .players-content {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--v-theme-takuzuMainShadow));
    width: 100%;
    height: 100%;

    .players-content__header {
      height: 40px;
      background-color: rgb(var(--v-theme-takuzuMainPrimary));
    }

    .players-content-wrapper {
      overflow-y: auto;

      .players-content__main {
        height: 50px;
        background-color: rgb(var(--v-theme-takuzuMainTertiary));

        &:nth-child(even) {
          background-color: rgb(var(--v-theme-takuzuMainPrimary));
        }
      }
    }

    .players-content__header,
    .players-content__main {
      display: flex;

      .header,
      .content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(var(--v-theme-takuzuMainOnSurface));
      }
    }

    .players-content__footer {
      align-self: center;
      margin-top: auto;

      .button-back {
        width: 200px;
        padding: 0.5rem 1rem;
        margin: 1rem 0;
        font-size: 1.25rem;
        font-weight: 700;
        border-radius: 20px;
        background-color: rgb(var(--v-theme-takuzuMainOnSurface));
        color: #ffffff;
        border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
        font-family: 'Quicksand', sans-serif;
        transition: all 0.2s ease-in-out;
      }
    }
  }

  .no-best-time {
    text-align: center;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }
}
</style>
