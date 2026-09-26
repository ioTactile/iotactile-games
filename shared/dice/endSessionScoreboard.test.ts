import { describe, test, expect } from "vitest";
import type { DiceScoreboard } from "../../types/models";
import {
  applyDiceSessionResult,
  collectSessionPlayers,
  resolveSessionWinner,
} from "./endSessionScoreboard";

describe("endSessionScoreboard", () => {
  test("resolveSessionWinner picks highest total", () => {
    expect(
      resolveSessionWinner([
        { id: "a", total: 100, dice: null },
        { id: "b", total: 180, dice: 50 },
        { id: "c", total: 120, dice: null },
      ]),
    ).toBe("b");
  });

  test("resolveSessionWinner keeps first max on ties", () => {
    expect(
      resolveSessionWinner([
        { id: "a", total: 150, dice: null },
        { id: "b", total: 150, dice: null },
      ]),
    ).toBe("a");
  });

  test("collectSessionPlayers ignores empty slots", () => {
    expect(
      collectSessionPlayers({
        playerOne: { id: "a", total: 10, dice: null },
        playerTwo: undefined,
        playerThree: { id: "c", total: 20, dice: 50 },
      }),
    ).toEqual([
      { id: "a", total: 10, dice: null },
      { id: "c", total: 20, dice: 50 },
    ]);
  });

  test("applyDiceSessionResult updates aggregates", () => {
    const scoreboard: DiceScoreboard = {
      userId: "a",
      username: "Old",
      games: 1,
      maxScore: 100,
      averageScore: 100,
      totalScore: 100,
      victories: 0,
      dice: 0,
    };

    const updated = applyDiceSessionResult(
      scoreboard,
      { id: "a", total: 200, dice: 50 },
      "a",
      "Alice",
    );

    expect(updated).toEqual({
      userId: "a",
      username: "Alice",
      games: 2,
      maxScore: 200,
      averageScore: 150,
      totalScore: 300,
      victories: 1,
      dice: 1,
    });
  });

  test("applyDiceSessionResult uses session total as average on first game", () => {
    const scoreboard: DiceScoreboard = {
      userId: "a",
      username: "Alice",
      games: 0,
      maxScore: 0,
      averageScore: 0,
      totalScore: 0,
      victories: 0,
      dice: 0,
    };

    const updated = applyDiceSessionResult(
      scoreboard,
      { id: "a", total: 90, dice: null },
      "b",
      "Alice",
    );

    expect(updated.averageScore).toBe(90);
    expect(updated.victories).toBe(0);
    expect(updated.dice).toBe(0);
  });
});
