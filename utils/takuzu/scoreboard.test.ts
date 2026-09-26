import { describe, test, expect } from "vitest";
import {
  applyTakuzuVictory,
  createEmptyTakuzuScoreboard,
  translateBoardSize,
} from "./scoreboard";

describe("takuzu scoreboard domain", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");

  test("translateBoardSize maps sizes", () => {
    expect(translateBoardSize(6)).toBe("sixBySix");
    expect(translateBoardSize(8)).toBe("eightByEight");
    expect(translateBoardSize(10)).toBe("tenByTen");
    expect(translateBoardSize(12)).toBe("twelveByTwelve");
  });

  test("createEmptyTakuzuScoreboard", () => {
    const scoreboard = createEmptyTakuzuScoreboard("u1", "Bob");
    expect(scoreboard.sixBySix.easy.victories).toBe(0);
    expect(scoreboard.twelveByTwelve.expert.bestTime).toBe(0);
  });

  test("applyTakuzuVictory increments and tracks best time", () => {
    const base = createEmptyTakuzuScoreboard("u1", "Bob");
    const first = applyTakuzuVictory(base, 8, "medium", 120, now);
    expect(first.eightByEight.medium.victories).toBe(1);
    expect(first.eightByEight.medium.bestTime).toBe(120);

    const second = applyTakuzuVictory(first, 8, "medium", 90, now);
    expect(second.eightByEight.medium.victories).toBe(2);
    expect(second.eightByEight.medium.bestTime).toBe(90);

    const slower = applyTakuzuVictory(second, 8, "medium", 150, now);
    expect(slower.eightByEight.medium.bestTime).toBe(90);
    expect(slower.eightByEight.medium.victories).toBe(3);
  });
});
