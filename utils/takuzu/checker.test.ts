import { test, expect, describe } from "vitest";
import { checkBoard } from "./checker";
import { ERRORS } from "./constants";
import type { TakuzuCheckErrorType } from "./types";

interface TakuzuCheckError {
  error: true;
  type: TakuzuCheckErrorType;
  message: string;
  position: string[];
}

describe("checkBoard", () => {
  test("should return error if there are duplicate rows", () => {
    const board = [
      ["1", "0", "1", "0"],
      ["1", "0", "1", "0"],
      ["0", "1", "0", "1"],
      ["1", "0", "0", "1"],
    ];
    const result = checkBoard(board) as TakuzuCheckError;
    expect(result.error).toBe(true);
    expect(result.type).toBe("duplicate");
    expect(result.message).toBe(ERRORS.DUPLICATE);
    expect(result.position).toEqual(["row-0, row-1"]);
  });

  test("should return error if there are duplicate columns", () => {
    const board = [
      ["1", "1", "0", "1"],
      ["0", "0", "1", "0"],
      ["1", "1", "0", "0"],
      ["0", "0", "1", "1"],
    ];
    const result = checkBoard(board) as TakuzuCheckError;
    expect(result.error).toBe(true);
    expect(result.type).toBe("duplicate");
    expect(result.message).toBe(ERRORS.DUPLICATE);
    expect(result.position).toEqual(["col-0, col-1"]);
  });

  test("should return error if a row has tripled numbers", () => {
    const board = [
      ["1", "0", "1", "0"],
      ["0", "1", "0", "1"],
      ["1", "1", "1", "0"],
      ["1", "0", "0", "1"],
    ];
    const result = checkBoard(board) as TakuzuCheckError;
    expect(result.error).toBe(true);
    expect(result.type).toBe("triple");
    expect(result.message).toBe(ERRORS.TRIPLE);
    expect(result.position).toEqual(["row-2"]);
  });

  test("should return error if a column has tripled numbers", () => {
    const board = [
      ["1", "0", "1", "0"],
      ["0", "1", "0", "1"],
      ["1", "1", "0", "0"],
      ["1", "0", "0", "1"],
    ];
    const result = checkBoard(board) as TakuzuCheckError;
    expect(result.error).toBe(true);
  });

  test("should return error if a row is not balanced", () => {
    const board = [
      ["1", "0", "1", "0"],
      ["0", "1", "0", "1"],
      ["1", "0", "0", "0"],
      ["1", "0", "1", "0"],
    ];
    const result = checkBoard(board) as TakuzuCheckError;
    expect(result.error).toBe(true);
  });

  test("should return error if a column is not balanced", () => {
    const board = [
      ["1", "0", "1", "0"],
      ["0", "1", "0", "1"],
      ["1", "0", "0", "1"],
      ["1", "0", "0", "0"],
    ];
    const result = checkBoard(board) as TakuzuCheckError;
    expect(result.error).toBe(true);
  });

  test("should return no error if the board is valid", () => {
    const board = [
      ["1", "0", "1", "0"],
      ["1", "1", "0", "0"],
      ["0", "0", "1", "1"],
      ["0", "1", "0", "1"],
    ];
    const result = checkBoard(board);
    expect(result.error).toBe(false);
  });
});
