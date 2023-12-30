import { test, expect, describe } from "vitest";
import { CellValues, ERRORS, OUT_OF_RANGE } from "./constants";

describe("constants", () => {
  test("should have the correct CellValues values", () => {
    expect(CellValues.ZERO).toBe("0");
    expect(CellValues.ONE).toBe("1");
    expect(CellValues.EMPTY).toBe(".");
  });

  test("should have the correct ERRORS values", () => {
    expect(ERRORS.DUPLICATE).toBe(
      "Toutes les lignes et colonnes doivent être uniques",
    );
    expect(ERRORS.BALANCE).toBe(
      "Il doit y avoir autant de boules blanches que de boules noires sur chaque ligne et chaque colonne",
    );
    expect(ERRORS.TRIPLE).toBe(
      "Il ne doit pas y avoir plus de deux boules de la même couleur côte à côte",
    );
  });

  test("should have the correct OUT_OF_RANGE value", () => {
    expect(OUT_OF_RANGE("row")).toBe("Hors de porté: row (index)");
    expect(OUT_OF_RANGE("col")).toBe("Hors de porté: col (index)");
  });
});
