<template>
  <div class="playersheet-wrapper">
    <dice-game-playersheet-upper
      :upper-player-sheet="upperPlayerSheet"
      :upper-player-sheet-bonus="upperPlayerSheetBonus"
      :upper-player-sheet-total="upperPlayerSheetTotal"
      :is-player-turn="props.isPlayerTurn"
      :get-input="getInput"
      @save-input="saveInput"
      @open-scoreboard="openScoreboard"
    />
    <dice-game-playersheet-lower
      :lower-player-sheet="lowerPlayerSheet"
      :lower-player-sheet-total="lowerPlayerSheetTotal"
      :player-sheet-total="playerSheetTotal"
      :is-player-turn="props.isPlayerTurn"
      :get-input="getInput"
      @save-input="saveInput"
    />
  </div>
</template>

<script setup lang="ts">
import { updateDoc, doc } from "firebase/firestore";
import {
  mdiDice1,
  mdiDice2,
  mdiDice3,
  mdiDice4,
  mdiDice5,
  mdiDice6,
} from "@mdi/js";
import type { PlayerSheetRow } from "./Playersheet.types";
import {
  diceSessionScoresConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionPlayerTurnConverter,
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter,
} from "~/stores";
import type { LocalDiceSessionScoresType } from "~/stores";
import type { Dice, CardUser } from "~/functions/src/types";
import {
  oneInput,
  twoInput,
  threeInput,
  fourInput,
  fiveInput,
  sixInput,
  threeOfAKindInput,
  fourOfAKindInput,
  fullHouseInput,
  smallStraightInput,
  largeStraightInput,
  diceInput,
  chanceInput,
  getUpperSectionTotal,
  getLowerSectionTotal,
} from "~/utils/dice/diceInputs";

type InputMappings = {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  six: number;
  threeOfAKind: number;
  fourOfAKind: number;
  fullHouse: number;
  smallStraight: number;
  largeStraight: number;
  dice: number;
  chance: number;
  [key: string]: number;
};

const DiceGamePlayersheetUpper = defineAsyncComponent(
  () => import("~/components/dice/game/PlayersheetUpper.vue"),
);
const DiceGamePlayersheetLower = defineAsyncComponent(
  () => import("~/components/dice/game/PlayersheetLower.vue"),
);

// Vuefire

const db = useFirestore();

// Props & Emits

const props = defineProps<{
  sessionId: string;
  dices: Dice[];
  playerData: {
    playerSheet: LocalDiceSessionScoresType["playerOne"];
    playerLocation: string;
  };
  isPlayerTurn: boolean;
  playerTurnId: string;
  remainingTurns: number;
  players: CardUser[];
}>();

const emit = defineEmits<{
  (e: "update:isScoreboardActive", value: boolean): void;
}>();

// Refs

const upperPlayerSheet = ref<PlayerSheetRow[]>([
  {
    value: "one",
    icon: mdiDice1,
    input: props.playerData.playerSheet.one,
  },
  {
    value: "two",
    icon: mdiDice2,
    input: props.playerData.playerSheet.two,
  },
  {
    value: "three",
    icon: mdiDice3,
    input: props.playerData.playerSheet.three,
  },
  {
    value: "four",
    icon: mdiDice4,
    input: props.playerData.playerSheet.four,
  },
  {
    value: "five",
    icon: mdiDice5,
    input: props.playerData.playerSheet.five,
  },
  {
    value: "six",
    icon: mdiDice6,
    input: props.playerData.playerSheet.six,
  },
]);

const lowerPlayerSheet = ref<PlayerSheetRow[]>([
  {
    value: "threeOfAKind",
    src: "/dice/inputs/three-of-a-kind.png",
    input: props.playerData.playerSheet.threeOfAKind,
  },
  {
    value: "fourOfAKind",
    src: "/dice/inputs/four-of-a-kind.png",
    input: props.playerData.playerSheet.fourOfAKind,
  },
  {
    value: "fullHouse",
    src: "/dice/inputs/full-house.png",
    input: props.playerData.playerSheet.fullHouse,
  },
  {
    value: "smallStraight",
    src: "/dice/inputs/small-straight.png",
    input: props.playerData.playerSheet.smallStraight,
  },
  {
    value: "largeStraight",
    src: "/dice/inputs/large-straight.png",
    input: props.playerData.playerSheet.largeStraight,
  },
  {
    value: "dice",
    src: "/dice/inputs/dice.png",
    input: props.playerData.playerSheet.dice,
  },
  {
    value: "chance",
    src: "/dice/inputs/chance.png",
    input: props.playerData.playerSheet.chance,
  },
]);

// Firebase refs

const scoresRef = doc(db, "diceSessionScores", props.sessionId).withConverter(
  diceSessionScoresConverter,
);
const remainingTurnsRef = doc(
  db,
  "diceSessionRemainingTurns",
  props.sessionId,
).withConverter(diceSessionRemainingTurnsConverter);
const playerTurnRef = doc(
  db,
  "diceSessionPlayerTurn",
  props.sessionId,
).withConverter(diceSessionPlayerTurnConverter);
const dicesRef = doc(db, "diceSessionDices", props.sessionId).withConverter(
  diceSessionDicesConverter,
);
const playerTriesRef = doc(
  db,
  "diceSessionPlayerTries",
  props.sessionId,
).withConverter(diceSessionPlayerTriesConverter);

// Computed

const upperPlayerSheetTotal = computed(() =>
  getUpperSectionTotal(upperPlayerSheet.value),
);

const lowerPlayerSheetTotal = computed(() =>
  getLowerSectionTotal(lowerPlayerSheet.value),
);

const upperPlayerSheetBonus = computed(() => {
  return upperPlayerSheetTotal.value >= 63 ? 35 : 0;
});

const playerSheetTotal = computed(() => {
  return (
    upperPlayerSheetTotal.value +
    lowerPlayerSheetTotal.value +
    upperPlayerSheetBonus.value
  );
});

// Mappings

const inputMappings = computed<InputMappings>(() => {
  const dices = props.dices;

  return {
    one: oneInput(dices),
    two: twoInput(dices),
    three: threeInput(dices),
    four: fourInput(dices),
    five: fiveInput(dices),
    six: sixInput(dices),
    threeOfAKind: threeOfAKindInput(dices),
    fourOfAKind: fourOfAKindInput(dices),
    fullHouse: fullHouseInput(dices),
    smallStraight: smallStraightInput(dices),
    largeStraight: largeStraightInput(dices),
    dice: diceInput(dices),
    chance: chanceInput(dices),
  };
});

// Methods

const openScoreboard = () => {
  emit("update:isScoreboardActive", true);
};

const switchPlayerTurn = async () => {
  const playerTurnIndex = props.players.findIndex(
    (player: CardUser) => player.id === props.playerTurnId,
  );
  const nextPlayerTurnIndex =
    playerTurnIndex === props.players.length - 1 ? 0 : playerTurnIndex + 1;

  await updateDoc(playerTurnRef, {
    playerId: props.players[nextPlayerTurnIndex].id,
  });
  await updateDoc(dicesRef, { dices: [] });
  await updateDoc(remainingTurnsRef, {
    remainingTurns: props.remainingTurns - 1,
  });
  await updateDoc(playerTriesRef, { tries: 3 });
};

const getInput = (value: string) => {
  return inputMappings.value[value];
};

const saveInput = async (value: string) => {
  if (props.isPlayerTurn) {
    const input = getInput(value);

    if (input !== undefined) {
      await updateDoc(scoresRef, {
        [props.playerData.playerLocation]: {
          ...props.playerData.playerSheet,
          [value]: input,
          total: playerSheetTotal.value,
        },
      });

      await switchPlayerTurn();
    }
  }
};
</script>

<style scoped lang="scss">
.playersheet-wrapper {
  display: flex;
  justify-content: space-between;
  width: 455px;
  height: 655px;

  .left-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .left-column-border {
      width: 220px;
      height: 600px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      border-radius: 8px;
      padding: 20px;

      .left-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        font-size: 2rem;
        color: white;
        margin-bottom: 22px;
      }

      .left-row-bottom-wrapper {
        align-items: center;
        font-size: 1.75rem;
        color: white;

        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    .button-scoreboard {
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
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }
  }

  .right-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .right-column-border {
      width: 220px;
      height: 550px;
      border: 3px solid rgb(var(--v-theme-diceMainPrimary));
      border-radius: 8px;
      padding: 20px;

      .right-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        font-size: 2rem;
        color: white;
        margin-bottom: 10px;

        div {
          height: 50px;
          width: 50px;
          background-color: white;
          border-radius: 6px;
        }

        &.right-row:nth-child(4) > div {
          display: flex;
          justify-content: center;
          align-items: center;

          .v-img {
            width: 40px !important;
            height: 40px !important;
          }
        }
      }

      .right-row-bottom-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.75rem;
        color: white;
      }
    }

    .button-lower-total {
      width: 120px;
      height: 80px;
      background-color: rgba(#cfcfcf, 0.3);
      font-size: 3rem;
      color: white;
      border-radius: 50px;
      cursor: default;
    }
  }

  .button-save {
    width: 50px;
    height: 50px;
    background-color: rgb(var(--v-theme-diceMainTertiary));
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  .button-input {
    width: 50px;
    height: 50px;
    cursor: default;
    font-family: "Indie Flower", cursive;
  }
}
</style>
