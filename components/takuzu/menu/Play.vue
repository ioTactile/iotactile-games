<template>
  <div class="play-container">
    <h3>Taille</h3>
    <div class="button-size-container">
      <button
        v-for="(size, i) in boardSizes"
        :key="i"
        class="button-size"
        :class="{ 'button-size-selected': boardSize === size.value }"
        @click="boardSize = size.value"
      >
        {{ size.name }}
      </button>
    </div>

    <h3>Difficulté</h3>
    <div class="button-difficulty-container">
      <button
        v-for="(diff, j) in difficulties"
        :key="j"
        class="button-difficulty"
        :class="{
          'button-difficulty-selected': difficulty === diff.value,
        }"
        :style="difficultyStyle(diff.value)"
        @click="difficulty = diff.value"
      >
        {{ diff.name }}
      </button>
    </div>

    <button class="button-play" @click="startGame">Jouer</button>
  </div>
</template>

<script setup lang="ts">
import type { Difficulty, BoardSize, GameOptions } from "~/utils/takuzu/types";

const emit = defineEmits<{
  (e: "start-game", args: GameOptions): void;
}>();

const boardSize = ref<BoardSize>(6);
const difficulty = ref<Difficulty>("easy");

const boardSizes: {
  name: string;
  value: BoardSize;
}[] = [
  {
    name: "6 x 6",
    value: 6,
  },
  {
    name: "8 x 8",
    value: 8,
  },
  {
    name: "10 x 10",
    value: 10,
  },
  {
    name: "12 x 12",
    value: 12,
  },
];

const difficulties: {
  name: string;
  value: Difficulty;
}[] = [
  {
    name: "Facile",
    value: "easy",
  },
  {
    name: "Moyen",
    value: "medium",
  },
  {
    name: "Difficile",
    value: "hard",
  },
  {
    name: "Expert",
    value: "expert",
  },
];

const difficultyStyle = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "easy":
      return "background-color: #4CAF50;";
    case "medium":
      return "background-color: #3F51B5;";
    case "hard":
      return "background-color: #FF9800;";
    case "expert":
      return "background-color: #F44336;";
  }
};

const startGame = (): void => {
  emit("start-game", {
    boardSize: boardSize.value,
    difficulty: difficulty.value,
  });
};
</script>

<style scoped lang="scss">
.play-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-top: 2rem;

  @media screen and (max-width: 600px) {
    padding-top: 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
    font-family: "Quicksand", sans-serif;
  }

  .button-size-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-bottom: 5rem;

    @media screen and (max-width: 600px) {
      flex-wrap: wrap;
      margin-bottom: 0;
    }

    .button-size {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background-color: rgb(var(--v-theme-takuzuMainSuface));
      color: rgb(var(--v-theme-takuzuMainOnSurface));
      border: 1px solid rgb(var(--v-theme-takuzuMainOnSurface));
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      font-family: "Quicksand", sans-serif;
      transition: all 0.2s ease-in-out;

      @media screen and (max-width: 600px) {
        margin-bottom: 1rem;
      }
    }

    .button-size-selected {
      background-color: rgb(var(--v-theme-takuzuMainOnSurface));
      color: #ffffff;
      border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
    }
  }

  .button-difficulty-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-bottom: 5rem;

    @media screen and (max-width: 600px) {
      flex-wrap: wrap;
      margin-bottom: 0;
    }

    .button-difficulty {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      font-family: "Quicksand", sans-serif;
      color: #000000;
      transition: all 0.2s ease-in-out;
      opacity: 0.5;

      @media screen and (max-width: 600px) {
        margin-bottom: 1rem;
      }
    }

    .button-difficulty-selected {
      opacity: 1;
    }
  }

  .button-play {
    width: 200px;
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
    font-weight: 700;
    border-radius: 20px;
    background-color: rgb(var(--v-theme-takuzuMainOnSurface));
    color: #ffffff;
    border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    font-family: "Quicksand", sans-serif;
    transition: all 0.2s ease-in-out;
  }
}
</style>
