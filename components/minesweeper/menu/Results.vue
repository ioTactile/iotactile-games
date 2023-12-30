<template>
  <div v-if="playerResults" class="results-container">
    <div v-for="(difficulty, i) in difficulties" :key="i" class="content">
      <button
        class="button-difficulty"
        @click="getDifficultyResults(difficulty)"
      >
        <h2>{{ getDifficultyName(difficulty) }}</h2>
        <v-icon :icon="mdiChevronDown" color="onSurface" />
      </button>
      <template v-if="isDifficulty(difficulty)">
        <template
          v-if="
            playerResults[difficulty as DifficultyWithoutCustom].victories > 0
          "
        >
          <div class="content__header">
            <div>Victoires</div>
            <div>Temps</div>
            <div>Date</div>
          </div>
          <div class="content__main">
            <div>
              {{
                playerResults[difficulty as DifficultyWithoutCustom].victories
              }}
            </div>
            <div>
              {{
                timerFormatter(
                  playerResults[difficulty as DifficultyWithoutCustom].bestTime,
                  true,
                )
              }}
            </div>
            <div>
              {{
                dateFormatter(
                  playerResults[difficulty as DifficultyWithoutCustom]
                    .victoryDate,
                )
              }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-best-time">
            Aucune partie n'a été gagnée dans cette difficulté
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script async setup lang="ts">
import { doc, getDoc } from "firebase/firestore";
import { VIcon } from "vuetify/components";
import { mdiChevronDown } from "@mdi/js";
import { timerFormatter, dateFormatter } from "~/utils";
import { mineSweeperScoreboardConverter } from "~/stores";
import type { Difficulty } from "~/utils/minesweeper/types";

type DifficultyWithoutCustom = Exclude<Difficulty, "custom">;

const db = useFirestore();
const user = useCurrentUser();

const playerScoreboardRef = doc(
  db,
  "mineSweeperScoreboard",
  user.value!.uid,
).withConverter(mineSweeperScoreboardConverter);
const playerScoreboardDoc = await getDoc(playerScoreboardRef);
const playerResults = playerScoreboardDoc.data();

const difficulties: Difficulty[] = ["beginner", "intermediate", "expert"];

const difficultyState = ref<{ [key in Difficulty]: boolean }>({
  beginner: true,
  intermediate: true,
  expert: true,
  custom: true,
});

const getDifficultyResults = (difficulty: Difficulty): void => {
  difficultyState.value[difficulty] = !difficultyState.value[difficulty];
};

const isDifficulty = (difficulty: Difficulty): boolean => {
  return difficultyState.value[difficulty];
};

const getDifficultyName = (difficulty: string): string => {
  switch (difficulty) {
    case "beginner":
      return "Débutant";
    case "intermediate":
      return "Intermédiaire";
    case "expert":
      return "Expert";
    default:
      return "";
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
