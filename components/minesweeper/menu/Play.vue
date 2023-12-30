<template>
  <div class="play-container">
    <minesweeper-menu-custom-game-form
      v-if="isCustom"
      @start-custom-game="startGame"
    />
    <minesweeper-menu-difficulty-selector
      v-else
      @toggle-custom-game="toggleCustomGame"
      @start-game="startGame"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameOptions } from "~/utils/minesweeper/types";

defineProps<{
  isCustom: boolean;
}>();

const emit = defineEmits<{
  (e: "start-game", args: GameOptions): void;
  (e: "action", value: string): void;
  (e: "is-custom", value?: boolean): void;
}>();

const startGame = (options: GameOptions): void => {
  emit("start-game", options);
  emit("is-custom", false);
  emit("action", "gameBoard");
};

const toggleCustomGame = (): void => emit("is-custom");
</script>

<style scoped lang="scss">
.play-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
