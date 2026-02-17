import { describe, it, expect } from "vitest";
import { Takuzu } from "./takuzu";
import { CellValues } from "./constants";

describe("Takuzu core logic", () => {
  it("initialise un plateau à la taille demandée avec start()", () => {
    const game = new Takuzu();

    game.start(6, "easy");

    const board = game.getBoard();
    const task = game.getTask();

    expect(board.length).toBe(6);
    expect(task.length).toBe(6);
    expect(game.getBoardSize()).toBe(6);
    expect(game.getDifficulty()).toBe("easy");
    expect(game.getGameStatus()).toBe("waiting");
  });

  it("change(), undo() et reset() modifient correctement la task et l’historique", () => {
    const game = new Takuzu();
    game.start(6, "easy");

    const initialTask = game.getTask().map((row) => [...row]);

    game.change(0, 0, CellValues.ONE);
    expect(game.getCell(0, 0)).toBe(CellValues.ONE);
    expect(game.getBoardHistory().length).toBe(1);

    game.undo();
    expect(game.getTask()).toEqual(initialTask);

    game.change(0, 0, CellValues.ZERO);
    expect(game.getCell(0, 0)).toBe(CellValues.ZERO);

    game.reset();
    expect(game.getTask()).toEqual(game.getStartedTask());
    expect(game.getBoardHistory().length).toBe(0);
    expect(game.getGameStatus()).toBe("waiting");
  });

  it("isFull() retourne true quand la grille est entièrement remplie", () => {
    const game = new Takuzu();

    // on force un plateau 2x2 rempli pour un test déterministe
    const filledBoard = [
      [CellValues.ZERO, CellValues.ONE],
      [CellValues.ONE, CellValues.ZERO],
    ] as const;

    // @ts-expect-error accès interne pour les besoins du test
    game.task = filledBoard.map((row) => [...row]);
    // @ts-expect-error taille interne pour les besoins du test
    game.boardSize = 2;

    expect(game.isFull()).toBe(true);
  });

  it("startGame() et handleWin() gèrent le statut et le timer", () => {
    const game = new Takuzu();

    expect(game.getGameStatus()).toBe("waiting");

    game.startGame();
    expect(game.getGameStatus()).toBe("inProgress");

    game.handleWin();
    expect(game.getGameStatus()).toBe("won");
  });
});

