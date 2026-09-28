<template>
  <div ref="gameRoot" class="game-root">
    <SnakeGameHeader :score="score" :length="length" :paused="status === 'paused'" />
    <div class="board-wrap">
      <SnakeGameBoard :grid-size="gridSize" :snake="snake" :food="food" :lost="status === 'lost'" />
    </div>
    <SnakeGameFooter
      :paused="status === 'paused'"
      @toggle-pause="onTogglePause"
      @restart="onRestart"
      @move="onDirection"
    />
    <GameOverModal
      v-if="status === 'lost'"
      :score="score"
      :length="length"
      @restart="onRestart"
      @return-to-menu="returnToMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { getCurrentUser } from 'vuefire';
import { useSwipe } from '@vueuse/core';
import GameOverModal from '~/components/snake/game/GameOverModal.vue';
import { DEFAULT_TICK_MS } from '~/utils/snake/constants';
import { Snake } from '~/utils/snake/snake';
import type { Direction, GameStatus, Position } from '~/utils/snake/types';
import { saveScoreboard } from '~/infrastructure/firestore/snakeScoreboardRepository';

const emit = defineEmits<{
  (e: 'action', value: string): void;
}>();

const game = shallowRef(new Snake());
const snake = ref<Position[]>([]);
const food = ref<Position | null>(null);
const score = ref(0);
const length = ref(0);
const status = ref<GameStatus>('waiting');
const gridSize = ref(game.value.getGridSize());
const lossRecorded = ref(false);
const gameRoot = ref<HTMLElement | null>(null);
let tickTimer: ReturnType<typeof setInterval> | null = null;

const syncView = () => {
  snake.value = game.value.getSnake();
  food.value = game.value.getFood();
  score.value = game.value.getScore();
  length.value = game.value.getLength();
  status.value = game.value.getGameStatus();
  gridSize.value = game.value.getGridSize();
};

const stopLoop = () => {
  if (tickTimer) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
};

const startLoop = () => {
  stopLoop();
  tickTimer = setInterval(() => {
    void onTick();
  }, DEFAULT_TICK_MS);
};

const persistLoss = async () => {
  if (lossRecorded.value) return;
  lossRecorded.value = true;
  try {
    const user = await getCurrentUser();
    if (!user) return;
    await saveScoreboard(user.uid, {
      score: game.value.getScore(),
      length: game.value.getLength(),
    });
  } catch {
    // Scoreboard persistence must not block the game-over UI.
  }
};

const onTick = async () => {
  const result = game.value.tick();
  syncView();
  if (result?.lost) {
    stopLoop();
    await persistLoss();
  }
};

const onDirection = (direction: Direction) => {
  if (status.value === 'lost') return;
  game.value.setDirection(direction);
};

const onTogglePause = () => {
  if (status.value === 'lost') return;
  if (game.value.getGameStatus() === 'paused') {
    game.value.resume();
    startLoop();
  } else if (game.value.getGameStatus() === 'inProgress') {
    game.value.pause();
    stopLoop();
  }
  syncView();
};

const onRestart = () => {
  lossRecorded.value = false;
  game.value.restart();
  syncView();
  startLoop();
};

const returnToMenu = () => {
  stopLoop();
  emit('action', 'menu');
};

const start = () => {
  lossRecorded.value = false;
  game.value.start();
  syncView();
  startLoop();
};

const onKey = (e: KeyboardEvent) => {
  const map: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    onTogglePause();
    return;
  }
  const direction = map[e.key];
  if (!direction) return;
  e.preventDefault();
  onDirection(direction);
};

onMounted(() => {
  start();
  window.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  stopLoop();
  window.removeEventListener('keydown', onKey);
});

useSwipe(gameRoot, {
  threshold: 30,
  onSwipeEnd(_e, direction) {
    const map: Record<string, Direction> = {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
    };
    const moveDirection = map[direction];
    if (moveDirection) onDirection(moveDirection);
  },
});
</script>

<style scoped lang="scss">
.game-root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
