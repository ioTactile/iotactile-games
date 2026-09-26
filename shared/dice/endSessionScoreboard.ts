import type { DicePlayerSheet, DiceScoreboard } from "../../types/models";

export type SessionPlayerScore = Pick<DicePlayerSheet, "id" | "total" | "dice">;

export type SessionEndPlayerInput = SessionPlayerScore | null | undefined;

export const resolveSessionWinner = (
  players: SessionEndPlayerInput[],
): string | undefined => {
  let winner: string | undefined;
  let bestTotal: number | undefined;

  for (const player of players) {
    if (!player) continue;
    const total = player.total ?? 0;
    if (bestTotal === undefined || total > bestTotal) {
      bestTotal = total;
      winner = player.id;
    }
  }

  return winner;
};

export const collectSessionPlayers = (scores: {
  playerOne?: SessionEndPlayerInput;
  playerTwo?: SessionEndPlayerInput;
  playerThree?: SessionEndPlayerInput;
  playerFour?: SessionEndPlayerInput;
}): SessionPlayerScore[] =>
  [scores.playerOne, scores.playerTwo, scores.playerThree, scores.playerFour]
    .filter((player): player is SessionPlayerScore => !!player)
    .map((player) => ({
      id: player.id,
      total: player.total ?? 0,
      dice: player.dice ?? null,
    }));

export const applyDiceSessionResult = (
  scoreboard: DiceScoreboard,
  player: SessionPlayerScore,
  winnerId: string | undefined,
  username: string,
): DiceScoreboard => {
  const total = player.total ?? 0;
  const isDicePlayer = player.dice === 50;
  const averageScore =
    scoreboard.games === 0
      ? total
      : (scoreboard.totalScore + total) / (scoreboard.games + 1);

  return {
    userId: player.id,
    username,
    games: scoreboard.games + 1,
    maxScore: Math.max(scoreboard.maxScore, total),
    averageScore,
    totalScore: scoreboard.totalScore + total,
    victories:
      winnerId === player.id ? scoreboard.victories + 1 : scoreboard.victories,
    dice: isDicePlayer ? scoreboard.dice + 1 : scoreboard.dice,
  };
};
