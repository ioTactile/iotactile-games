<template>
  <dice-template
    v-if="
      session && playerTurn && scores && dices && remainingTurns && playerTries
    "
  >
    <div class="pa-8">
      <div class="left-background" />
      <dice-game-first-volumes-modal
        v-if="isFirstVolumesModalOpen"
        @open-modal="isFirstVolumesModalOpen = $event"
        @activate-sound="activateSound"
        @desactivate-sound="desactivateSound"
      />
      <dice-game-volumes-modal
        v-if="isVolumesModalActive"
        :sound-service="soundService"
        @open-volumes="isVolumesModalActive = $event"
      />
      <dice-game-chat-modal
        v-if="isChatModalActive"
        :session-id="sessionId"
        :chat-messages="chat?.messages"
        :players="session.players"
        @open-chat="isChatModalActive = $event"
      />
      <dice-game-endgame-modal
        v-if="isEndgameModalActive"
        :session-id="sessionId"
        :players="session.players"
        :scoreboard="scoreboard"
        @open-endgame="isEndgameModalActive = $event"
      />
      <dice-game-rules-modal
        v-if="isRulesModalActive"
        @open-rules="isRulesModalActive = $event"
      />
      <dice-game-rules @open-rules="isRulesModalActive = $event" />
      <div class="d-flex justify-space-between mb-4">
        <dice-game-players :players="session.players" />
        <div class="d-flex">
          <dice-game-volumes @open-volumes="isVolumesModalActive = $event" />
          <dice-game-chat
            :chat-messages="chat?.messages"
            :is-chat-active="isChatModalActive"
            :sound-service="soundService"
            @open-chat="isChatModalActive = $event"
          />
        </div>
      </div>
      <div class="d-flex">
        <div class="left-side-wrapper">
          <dice-game-scoreboard
            v-if="isScoreboardActive"
            :scoreboard="scoreboard"
            :dices="dices.dices"
            :player-turn="playerTurn.playerId"
            @update:is-scoreboard-active="isScoreboardActive = $event"
          />
          <dice-game-playersheet
            v-else
            :session-id="sessionId"
            :is-player-turn="isPlayerTurn"
            :dices="dices.dices"
            :player-data="playerData"
            :player-turn-id="playerTurn.playerId"
            :players="session.players"
            :remaining-turns="remainingTurns.remainingTurns"
            @update:is-scoreboard-active="isScoreboardActive = $event"
          />
        </div>
        <div class="right-side-wrapper">
          <dice-game-board
            :session-id="sessionId"
            :is-player-turn="isPlayerTurn"
            :dices="dices.dices"
            :player-tries="playerTries.tries"
            :sound-service="soundService"
          />
          <dice-game-dices
            :session-id="sessionId"
            :is-player-turn="isPlayerTurn"
            :dices="dices.dices"
            :player-tries="playerTries.tries"
            :session-is-started="session.isStarted"
            :session-is-finished="session.isFinished"
            :sound-service="soundService"
          />
        </div>
      </div>
    </div>
  </dice-template>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDiceSoundsStore } from "~/stores/diceSounds";
import { SoundService } from "~/utils/music/soundService";
import type { ISoundService } from "~/utils/music/soundService";
import { useDiceGame } from "~/composables/useDiceGame";

const route = useRoute();
const sessionId = route.params.id as string;

useSeoMeta({
  title: "Session Dice - ioTactile Games",
  ogTitle: "Session Dice - ioTactile Games",
  twitterTitle: "Session Dice - ioTactile Games",
  description: "Session de jeu Dice",
  ogDescription: "Session de jeu Dice",
  twitterDescription: "Session de jeu Dice",
  ogImage: "/dice/dice.png",
  twitterImage: "/dice/dice.png",
  twitterCard: "summary_large_image",
  ogUrl: `https://iotactile.games/dice/${sessionId}`,
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});

definePageMeta({
  middleware: ["auth"],
});

const {
  session,
  playerTurn,
  scores,
  dices,
  remainingTurns,
  playerTries,
  chat,
  isScoreboardActive,
  isVolumesModalActive,
  isChatModalActive,
  isFirstVolumesModalOpen,
  isEndgameModalActive,
  isRulesModalActive,
  isPlayerTurn,
  playerData,
  scoreboard,
} = useDiceGame(sessionId);

const diceSoundsStore = useDiceSoundsStore();
const { isSoundEffectsActive, isNotificationsActive } =
  storeToRefs(diceSoundsStore);

const soundService = ref<ISoundService>(new SoundService());

const activateSound = () => {
  isSoundEffectsActive.value = true;
  isNotificationsActive.value = true;
  loadSounds(1);
};

const desactivateSound = () => {
  isSoundEffectsActive.value = false;
  isNotificationsActive.value = false;
  loadSounds(0);
};

const loadSounds = (volume: number) => {
  soundService.value.loadSound("dice", "/dice/sounds/dice.mp3", volume);
  soundService.value.loadSound("message", "/dice/sounds/message.mp3", volume);
  soundService.value.loadSound(
    "shakeRoll",
    "/dice/sounds/shake-and-roll.mp3",
    volume,
  );
};

onBeforeRouteLeave(() => {
  soundService.value.stopAllSounds();
  soundService.value.unloadAllSounds();
});
</script>

<style scoped lang="scss">
.left-background {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 800px;
  background-color: rgb(var(--v-theme-diceMainSecondary));
  border-radius: 8px 0 0 8px;
}

.left-side-wrapper {
  width: 500px;
  height: 655px;
}

.right-side-wrapper {
  width: 700px;
  height: 655px;
}
</style>
