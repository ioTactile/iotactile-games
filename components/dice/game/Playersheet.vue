<template>
  <div class="player-sheet-wrapper">
    <div class="left-column">
      <div />
      <button>
        <v-icon :icon="mdiArrowRightBold" /><span>VOIR TABLEAU</span>
      </button>
    </div>
    <div class="right-column">
      <div />
      <button @click="getPlayerSheet">0</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiArrowRightBold } from '@mdi/js'
import type { LocalDiceSessionScoresType } from '~/stores'

const props = defineProps<{
  playerSheet: LocalDiceSessionScoresType['playerOne']
}>()

const getPlayerSheet = () => {
  console.log(props.playerSheet)
}
</script>

<style scoped lang="scss">
.player-sheet-wrapper {
  display: flex;
  justify-content: space-between;
  width: 455px;
  height: 655px;

  .left-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div {
      width: 220px;
      height: 600px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      border-radius: 8px;
    }

    button {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 220px;
      height: 40px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      color: white;
      font-size: 1.25rem;
      border-radius: 8px;
      padding-right: 10px;
    }
  }

  .right-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    div {
      width: 220px;
      height: 550px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      border-radius: 8px;
    }

    button {
      width: 120px;
      height: 80px;
      background-color: rgba(#cfcfcf, 0.3);
      font-size: 3rem;
      color: white;
      border-radius: 50px;
      cursor: default;
    }
  }
}
</style>
