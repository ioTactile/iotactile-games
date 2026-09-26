import type { LocalDiceSessionType } from '~/infrastructure/firestore/converters';

export type DiceSessionPlayerRef = {
  id: string;
};

export type DiceSessionLike = Pick<LocalDiceSessionType, 'players' | 'isStarted' | 'isFull'>;

export const MAX_DICE_PLAYERS = 4;
export const TURNS_PER_PLAYER = 13;

export const createEmptyPlayerScores = (userId: string) => ({
  id: userId,
  one: null,
  two: null,
  three: null,
  four: null,
  five: null,
  six: null,
  bonus: 0,
  threeOfAKind: null,
  fourOfAKind: null,
  fullHouse: null,
  smallStraight: null,
  largeStraight: null,
  chance: null,
  dice: null,
  total: 0,
});

export const canStartSession = (session: DiceSessionLike): boolean =>
  !session.isStarted && session.players.length >= 2;

export const canJoinSession = (session: DiceSessionLike, userId: string): boolean =>
  !session.isStarted &&
  session.players.length < MAX_DICE_PLAYERS &&
  !session.players.some((player) => player.id === userId);

export const canLeaveSession = (session: DiceSessionLike, userId: string): boolean =>
  !session.isStarted && session.players.some((player) => player.id === userId);

export const canDeleteSession = (session: DiceSessionLike, userId: string): boolean =>
  !session.isStarted && session.players.length === 1 && session.players[0]?.id === userId;

export const isHost = (session: Pick<DiceSessionLike, 'players'>, userId: string): boolean =>
  session.players[0]?.id === userId;

export const nextRemainingTurnsOnJoin = (current: number): number => current + TURNS_PER_PLAYER;

export const nextRemainingTurnsOnLeave = (current: number): number => current - TURNS_PER_PLAYER;

export const withPlayerJoined = <T extends DiceSessionLike>(
  session: T,
  player: { id: string; username: string | undefined },
): T => {
  const players = [...session.players, player];
  return {
    ...session,
    players,
    isFull: players.length >= MAX_DICE_PLAYERS,
  };
};

export const withPlayerLeft = <T extends DiceSessionLike>(session: T, userId: string): T => {
  const players = session.players.filter((player) => player.id !== userId);
  return {
    ...session,
    players,
    isFull: players.length >= MAX_DICE_PLAYERS,
  };
};

export const playerSlotForJoin = (
  playerCountAfterJoin: number,
): 'playerTwo' | 'playerThree' | 'playerFour' | null => {
  if (playerCountAfterJoin === 2) return 'playerTwo';
  if (playerCountAfterJoin === 3) return 'playerThree';
  if (playerCountAfterJoin === 4) return 'playerFour';
  return null;
};

export const playerSlotForUser = (
  scores: {
    playerTwo?: DiceSessionPlayerRef | null;
    playerThree?: DiceSessionPlayerRef | null;
    playerFour?: DiceSessionPlayerRef | null;
  },
  userId: string,
): 'playerTwo' | 'playerThree' | 'playerFour' | null => {
  if (scores.playerTwo?.id === userId) return 'playerTwo';
  if (scores.playerThree?.id === userId) return 'playerThree';
  if (scores.playerFour?.id === userId) return 'playerFour';
  return null;
};
