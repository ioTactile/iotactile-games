import { describe, test, expect } from "vitest";
import { generateBoard, generateRows, splitBoardIntoCells } from "./generator";
import { checkBoard } from "./checker";

describe("takuzu generator", () => {
  test("generateRows only keeps balanced non-triple patterns", () => {
    const rows = generateRows(6);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row).toHaveLength(6);
      const zeros = [...row].filter((cell) => cell === "0").length;
      const ones = [...row].filter((cell) => cell === "1").length;
      expect(zeros).toBe(ones);
      expect(row.includes("000")).toBe(false);
      expect(row.includes("111")).toBe(false);
    }
  });

  test("splitBoardIntoCells keeps a square matrix", () => {
    const board = ["0101", "1010", "0101", "1010"];
    const cells = splitBoardIntoCells(board);
    expect(cells).toHaveLength(4);
    expect(cells[0]).toEqual(["0", "1", "0", "1"]);
  });

  test("generateBoard returns a valid completed board for size 6", () => {
    let board = null;
    for (let attempt = 0; attempt < 20 && !board; attempt++) {
      board = generateBoard(6);
    }
    expect(board).not.toBeNull();
    expect(board).toHaveLength(6);
    expect(checkBoard(board!).error).toBe(false);
  });
});
