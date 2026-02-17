import { collection, doc, updateDoc } from "firebase/firestore";
import type { LocalDiceSessionScoresType } from "~/stores";

interface PlayerData {
  playerSheet: LocalDiceSessionScoresType["playerOne"];
  playerLocation: string;
}

export const useDiceGame = (sessionId: string) => {
  const db = useFirestore();
  const user = useCurrentUser();

  const {
    diceSessionConverter,
    diceSessionPlayerTurnConverter,
    diceSessionScoresConverter,
    diceSessionDicesConverter,
    diceSessionRemainingTurnsConverter,
    diceSessionPlayerTriesConverter,
    diceSessionChatConverter,
  } = await import("~/stores");

  const sessionRef = doc(db, "diceSessions", sessionId).withConverter(
    diceSessionConverter,
  );
  const playerTurnRef = doc(
    db,
    "diceSessionPlayerTurn",
    sessionId,
  ).withConverter(diceSessionPlayerTurnConverter);
  const scoresRef = doc(db, "diceSessionScores", sessionId).withConverter(
    diceSessionScoresConverter,
  );
  const dicesRef = doc(db, "diceSessionDices", sessionId).withConverter(
    diceSessionDicesConverter,
  );
  const remainingTurnsRef = doc(
    db,
    "diceSessionRemainingTurns",
    sessionId,
  ).withConverter(diceSessionRemainingTurnsConverter);
  const playerTriesRef = doc(
    db,
    "diceSessionPlayerTries",
    sessionId,
  ).withConverter(diceSessionPlayerTriesConverter);
  const chatRef = doc(db, "diceSessionChat", sessionId).withConverter(
    diceSessionChatConverter,
  );

  const session = useDocument(
    doc(collection(db, "diceSessions"), sessionRef.id),
  );
  const playerTurn = useDocument(
    doc(collection(db, "diceSessionPlayerTurn"), playerTurnRef.id),
  );
  const scores = useDocument(
    doc(collection(db, "diceSessionScores"), scoresRef.id),
  );
  const dices = useDocument(
    doc(collection(db, "diceSessionDices"), dicesRef.id),
  );
  const remainingTurns = useDocument(
    doc(collection(db, "diceSessionRemainingTurns"), remainingTurnsRef.id),
  );
  const playerTries = useDocument(
    doc(collection(db, "diceSessionPlayerTries"), playerTriesRef.id),
  );
  const chat = useDocument(
    doc(collection(db, "diceSessionChat"), chatRef.id),
  );

  const isScoreboardActive = ref(false);
  const isVolumesModalActive = ref(false);
  const isChatModalActive = ref(false);
  const isFirstVolumesModalOpen = ref(true);
  const isEndgameModalActive = ref(false);
  const isRulesModalActive = ref(false);

  const isPlayerTurn = computed(() => {
    if (playerTurn.value?.playerId === user.value?.uid) {
      return true;
    }
    return false;
  });

  const playerData = computed<PlayerData>(() => {
    let playerSheet;
    let playerLocation = "";

    if (scores.value) {
      if (scores.value.playerOne.id === user.value?.uid) {
        playerSheet = scores.value.playerOne;
        playerLocation = "playerOne";
      } else if (scores.value.playerTwo?.id === user.value?.uid) {
        playerSheet = scores.value.playerTwo;
        playerLocation = "playerTwo";
      } else if (scores.value.playerThree?.id === user.value?.uid) {
        playerSheet = scores.value.playerThree;
        playerLocation = "playerThree";
      } else if (scores.value.playerFour?.id === user.value?.uid) {
        playerSheet = scores.value.playerFour;
        playerLocation = "playerFour";
      }
    }

    // @ts-expect-error temporary until types are tightened
    return {
      playerSheet,
      playerLocation,
    };
  });

  const scoreboard = computed(
    (): LocalDiceSessionScoresType["playerOne"][] | undefined => {
      const scoreboardValue = scores.value;
      if (!scoreboardValue) {
        return undefined;
      }

      const list: LocalDiceSessionScoresType["playerOne"][] = [];
      if (scoreboardValue.playerOne) list.push(scoreboardValue.playerOne);
      if (scoreboardValue.playerTwo) list.push(scoreboardValue.playerTwo);
      if (scoreboardValue.playerThree) list.push(scoreboardValue.playerThree);
      if (scoreboardValue.playerFour) list.push(scoreboardValue.playerFour);

      return list;
    },
  );

  watch(
    () => playerTurn.value?.playerId,
    async (playerId) => {
      if (!session.value?.isFinished) {
        if (playerId === user.value?.uid) {
          await sleep(2000);
          isScoreboardActive.value = false;
        } else {
          isScoreboardActive.value = true;
        }
      }
    },
    { immediate: true },
  );

  watch(
    () => session.value?.isFinished,
    (isFinished) => {
      if (isFinished) {
        isEndgameModalActive.value = true;
      }
    },
    { immediate: true },
  );

  watch(
    () => remainingTurns.value?.remainingTurns,
    async (newValue, oldValue) => {
      if (oldValue !== undefined && newValue !== undefined && newValue === 0) {
        if (oldValue !== newValue) {
          await updateDoc(sessionRef, {
            isFinished: true,
          });
        }
      }
    },
    { immediate: true },
  );

  return {
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
  };
};

