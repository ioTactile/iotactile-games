<template>
  <div ref="gameContainer" class="game-container">
    <takuzu-game-rules-modal
      v-if="isRulesModalActive"
      @open-rules="closeRulesModal"
    />
    <takuzu-game-victory-modal
      v-if="isFinished"
      :elapsed-time="elapsedTime"
      @restart="restart"
      @return-to-menu="returnToMenu"
    />
    <div class="content">
      <takuzu-game-header
        :elapsed-time="elapsedTime"
        @open-rules-modal="openRulesModal"
      />
      <takuzu-game-main
        :timer="timer"
        :task-board="taskBoard"
        :disabled-cells="disabledCells"
        :options="props.options"
        :game-container="gameContainer"
        :scale="scale"
        :background-color="backgroundColor"
        @toggle-cell="toggleCell"
      />
      <takuzu-game-footer
        :error-message="errorMessage"
        :is-paused="isPaused"
        :is-rotating="isRotating"
        @undo="undo"
        @toggle-pause="togglePause"
        @reset="reset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameOptions } from "~/utils/takuzu/types";
import { useTakuzuGame } from "~/composables/useTakuzuGame";

const props = defineProps<{
  options: GameOptions | null;
}>();

const emits = defineEmits<{
  (e: "action", value: string): void;
}>();

const returnToMenu = (): void => {
  emits("action", "play");
};

const {
  gameContainer,
  errorMessage,
  disabledCells,
  isRulesModalActive,
  isRotating,
  scale,
  backgroundColor,
  taskBoard,
  timer,
  elapsedTime,
  isFinished,
  isPaused,
  restart,
  reset,
  togglePause,
  undo,
  openRulesModal,
  closeRulesModal,
  toggleCell,
} = useTakuzuGame(props, emits);
</script>

<style scoped lang="scss">
.game-container {
  position: relative;
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 600px) {
      justify-content: space-evenly;
    }
  }
}
</style>
