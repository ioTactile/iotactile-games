<template>
  <div class="container">
    <div class="container-content">
      <div class="content content-status">
        <div class="game-status">{{ gameStatus }}</div>
        <!-- <button @click="timer.togglePause()">
          <v-icon :icon="timer.getIsPaused() ? mdiPause : mdiPlay" size="12" />
        </button> -->
      </div>
      <div class="content content-data">
        <MinesweeperCustomGameForm
          v-if="isCustom"
          @start-custom-game="startGame"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { VIcon } from 'vuetify/components'
// import { mdiPause, mdiPlay } from '@mdi/js'
import type { Timer } from '~/utils/minesweeper/Timer'
import type { GameOptions } from '~/utils/minesweeper/mineSweeper'

defineProps<{
  gameStatus: string
  timer: Timer
  isCustom: boolean
}>()

const emit = defineEmits<{
  (e: 'startCustomGame', args: GameOptions): void
}>()

const startGame = (options: GameOptions) => {
  emit('startCustomGame', options)
}
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  bottom: 11.5px;
  right: -130px;
  background-color: #c0c0c0;
  border-bottom: 4px solid #808080;
  border-left: 5px solid #808080;
  height: calc(100% - 4.5px);
  width: 130px;
  transform: skewY(-10deg);
  backface-visibility: hidden;

  .container-content {
    border: 8px solid #c6c6c6;
    width: 100%;
    height: 100%;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      border-top: 5px solid #808080;
      border-right: 5px solid #fff;
      border-bottom: 5px solid #fff;
      border-left: 5px solid #808080;
      .game-status {
        font-size: 0.9rem;
        font-weight: bold;
        text-transform: uppercase;
        margin-right: 5px;
      }
    }
    .content-status {
      height: 48px;
    }

    .content-data {
      margin-top: 8px;
      height: calc(100% - 56px);
    }
  }
}

.container::before {
  content: '';
  position: absolute;
  top: -1px;
  right: 0;
  left: 0;
  height: 1px;
  background: transparent;
  transform: rotate(0.1deg);
}
</style>
