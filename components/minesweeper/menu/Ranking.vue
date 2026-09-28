<template>
  <div
    v-if="menuPage === 2"
    class="results-container"
    :class="{ 'results-container--status': showStatus }"
  >
    <p v-if="!isAuthenticated && !isLoading" class="status-message">
      Connecte-toi pour voir le classement.
    </p>
    <p v-else-if="isLoading" class="status-message">Chargement…</p>
    <p v-else-if="loadError" class="status-message">{{ loadError }}</p>
    <template v-else>
      <button
        v-for="(item, i) in menuItems"
        :key="i"
        class="button-mineSweeper"
        @click="getRanking(item.action, item.value)"
      >
        {{ item.title }}
      </button>
    </template>
  </div>
  <div v-else class="results-container-2">
    <div v-for="(difficulty, i) in ['beginner', 'intermediate', 'expert']" :key="i">
      <div v-if="menuPage === getRankingPage(i)" class="content">
        <div class="content__header">
          <div>Classement</div>
          <div>Joueur</div>
          <div>Temps</div>
        </div>
        <template v-if="isBestTime(difficulty)">
          <div class="content__main">
            <div v-for="(player, j) in ranking" :key="j" class="result">
              <div>{{ j + 1 }}</div>
              <div>{{ player.username }}</div>
              <div>
                {{ getFormattedTime(player, difficulty) }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-best-time">Aucune partie n'a été gagnée dans cette difficulté</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { loadAllScoreboards } from '~/infrastructure/firestore/mineSweeperScoreboardRepository';
import { timerFormatter } from '~/utils';
import type { MineSweeperScoreboard } from '~/types/models';
import type { Difficulty } from '~/utils/minesweeper/types';

type DifficultyWithoutCustom = Exclude<Difficulty, 'custom'>;

defineProps<{
  menuPage: number;
}>();

const emit = defineEmits<{
  (e: 'action', value: string): void;
}>();

const menuItems = [
  {
    title: 'Débutant',
    action: 'rankingBeginner',
    value: 'beginner',
  },
  {
    title: 'Intermédiaire',
    action: 'rankingIntermediate',
    value: 'intermediate',
  },
  {
    title: 'Expert',
    action: 'rankingExpert',
    value: 'expert',
  },
];

const allScoreboards = ref<MineSweeperScoreboard[]>([]);
const ranking = ref<MineSweeperScoreboard[]>([]);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const loadError = ref('');

const showStatus = computed(
  () => (!isAuthenticated.value && !isLoading.value) || isLoading.value || Boolean(loadError.value),
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
    allScoreboards.value = await loadAllScoreboards();
  } catch {
    loadError.value = 'Impossible de charger le classement.';
  } finally {
    isLoading.value = false;
  }
});

const getRanking = (action: string, value: string) => {
  emit('action', action);

  const source = allScoreboards.value;

  if (value === 'beginner') {
    ranking.value = source
      .filter((item) => item.beginner.victories > 0)
      .sort((a, b) => a.beginner.bestTime - b.beginner.bestTime);
  } else if (value === 'intermediate') {
    ranking.value = source
      .filter((item) => item.intermediate.victories > 0)
      .sort((a, b) => a.intermediate.bestTime - b.intermediate.bestTime);
  } else if (value === 'expert') {
    ranking.value = source
      .filter((item) => item.expert.victories > 0)
      .sort((a, b) => a.expert.bestTime - b.expert.bestTime);
  } else {
    ranking.value = [];
  }
};

const getRankingPage = (index: number): number => {
  return Number.parseFloat(`2.${index + 1}`);
};

const getFormattedTime = (player: MineSweeperScoreboard, difficulty: string) => {
  const difficultyKey = difficulty as DifficultyWithoutCustom;
  const time = player[difficultyKey].bestTime;

  return timerFormatter(time, true);
};

const isBestTime = (difficulty: string): boolean => {
  return ranking.value.some((item) => item[difficulty as DifficultyWithoutCustom].bestTime > 0);
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
}

.results-container-2 {
  width: 100%;

  .content__header {
    display: flex;
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
    overflow-y: auto;

    .result {
      display: flex;
      justify-content: space-between;
      height: 50px;
      font-size: 1.25rem;
      color: rgb(var(--v-theme-onSurfaceButton));
      background-color: rgb(var(--v-theme-mineSweeperMainPrimary));

      &:nth-child(even) {
        background-color: rgb(var(--v-theme-mineSweeperMainSecondary));
      }

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

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-mineSweeperMainBackground));
  border-radius: 0;
}
</style>
