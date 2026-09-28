<template>
  <div ref="gameRoot" class="game-root">
    <Game2048GameHeader :score="score" :best-tile="bestTile" />
    <div class="board-wrap">
      <Game2048GameBoard :board="board" />
      <Game2048GameVictoryModal
        v-if="status === 'won'"
        :score="score"
        @keep-playing="onKeepPlaying"
        @restart="onRestart"
        @return-to-menu="returnToMenu"
      />
      <Game2048GameGameOverModal
        v-if="status === 'lost'"
        :score="score"
        :best-tile="bestTile"
        @restart="onRestart"
        @return-to-menu="returnToMenu"
      />
    </div>
    <Game2048GameFooter :can-undo="canUndo" @undo="onUndo" @restart="onRestart" @move="onMove" />
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { useSwipe } from '@vueuse/core';
import { Game2048 } from '~/utils/game2048/game2048';
import type { Board, Direction, GameStatus } from '~/utils/game2048/types';
import { saveScoreboard } from '~/infrastructure/firestore/game2048ScoreboardRepository';

const emit = defineEmits<{
  (e: 'action', value: string): void;
}>();

const game = shallowRef(new Game2048());
const board = ref<Board>(game.value.getBoard());
const score = ref(0);
const bestTile = ref(0);
const status = ref<GameStatus>('waiting');
const canUndo = ref(false);
const victoryRecorded = ref(false);
const lossRecorded = ref(false);
const gameRoot = ref<HTMLElement | null>(null);

const syncView = () => {
  board.value = game.value.getBoard();
  score.value = game.value.getScore();
  bestTile.value = game.value.getBestTile();
  status.value = game.value.getGameStatus();
  canUndo.value = game.value.getCanUndo();
};

const persistIfNeeded = async () => {
  const currentStatus = game.value.getGameStatus();
  const user = await getCurrentUser();
  if (!user) return;

  if (currentStatus === 'won' && !victoryRecorded.value) {
    victoryRecorded.value = true;
    await saveScoreboard(user.uid, {
      score: game.value.getScore(),
      bestTile: game.value.getBestTile(),
      won: true,
    });
  }

  if (currentStatus === 'lost' && !lossRecorded.value) {
    lossRecorded.value = true;
    await saveScoreboard(user.uid, {
      score: game.value.getScore(),
      bestTile: game.value.getBestTile(),
      won: false,
    });
  }
};

const onMove = async (direction: Direction) => {
  const result = game.value.move(direction);
  if (!result?.moved) {
    syncView();
    return;
  }
  syncView();
  await persistIfNeeded();
};

const onUndo = () => {
  game.value.undo();
  syncView();
};

const onRestart = () => {
  game.value.restart();
  victoryRecorded.value = false;
  lossRecorded.value = false;
  syncView();
};

const onKeepPlaying = () => {
  game.value.keepPlaying();
  syncView();
};

const returnToMenu = () => {
  emit('action', 'menu');
};

const start = () => {
  game.value.start();
  victoryRecorded.value = false;
  lossRecorded.value = false;
  syncView();
};

onMounted(() => {
  start();
  window.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
});

const onKey = (e: KeyboardEvent) => {
  const map: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };
  const direction = map[e.key];
  if (!direction) return;
  e.preventDefault();
  void onMove(direction);
};

useSwipe(gameRoot, {
  threshold: 40,
  onSwipeEnd(_e, direction) {
    const map: Record<string, Direction> = {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
    };
    const moveDirection = map[direction];
    if (moveDirection) void onMove(moveDirection);
  },
});

defineExpose({ start });
</script>

<style scoped lang="scss">
.game-root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;

  .board-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
