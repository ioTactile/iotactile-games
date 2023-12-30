<template>
  <div class="endgame-modal-wrapper">
    <section class="header">
      <button class="svg-container" @click="closeEndgame">
        <svg
          :style="{ transform: 'rotate(180deg)' }"
          fill="#ffffff"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="64px"
          height="64px"
          viewBox="0 0 100 100"
          enable-background="new 0 0 100 100"
          xml:space="preserve"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M50.868,78.016l36.418-26.055c0.66-0.471,1.049-1.233,1.051-2.043c0-0.006,0-0.006,0-0.006 c-0.002-0.815-0.396-1.575-1.059-2.048L50.86,21.977c-0.767-0.546-1.776-0.616-2.612-0.183c-0.835,0.426-1.361,1.292-1.361,2.236 v12.183l-32.709-0.001c-1.39,0-2.515,1.125-2.515,2.516l0.001,22.541c-0.001,1.389,1.124,2.515,2.516,2.516l32.706,0v12.187 c0,0.94,0.53,1.803,1.366,2.237C49.089,78.641,50.1,78.567,50.868,78.016z"
              />
            </g>
          </g>
        </svg>
      </button>
      <h3>PARTIE TERMINÉE</h3>
      <div />
    </section>
    <section class="content">
      <div
        v-for="(player, i) in orderedPlayers"
        :key="i"
        class="player-wrapper"
      >
        <h4>{{ player.username }}</h4>
        <h4>{{ player.total }}</h4>
      </div>
    </section>
    <section class="footer">
      <button @click="goToMenu">Menu</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { LocalDiceSessionScoresType } from "~/stores";
import type { CardUser } from "~/functions/src/types";

const props = defineProps<{
  sessionId: string;
  players: CardUser[];
  scoreboard: LocalDiceSessionScoresType["playerOne"][];
}>();

const emit = defineEmits<{ (e: "openEndgame", value: boolean): void }>();

const closeEndgame = () => {
  emit("openEndgame", false);
};

const goToMenu = () => {
  navigateTo("/dice");
};

const orderedPlayers = computed(() => {
  const players = props.players.map((player, i) => {
    return {
      ...player,
      total: props.scoreboard[i]!.total,
    };
  });

  return players.sort((a, b) => b.total - a.total);
});
</script>

<style scoped lang="scss">
.endgame-modal-wrapper {
  display: flex;
  flex-direction: column;
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  height: 800px;
  background-color: rgb(var(--v-theme-diceMainPrimary));
  padding: 20px;
  border-radius: 8px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      width: 70px;
    }

    h3 {
      font-size: 3rem;
      color: white;
    }

    button {
      width: 70px;
      height: 70px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      border-radius: 8px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    .player-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 550px;
      height: 100px;
      background-color: rgb(var(--v-theme-diceMainSecondary));
      border-radius: 8px;
      padding: 0 20px;
      margin: 20px 0;
      color: white;
      font-size: 2rem;
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;

    button {
      width: 400px;
      height: 100px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      border-radius: 8px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      font-size: 3rem;
      color: white;
    }
  }
}
</style>
