import { useTheme, useDisplay } from "vuetify";
import {
  MineSweeper,
  type IMineSweeper,
} from "~/utils/minesweeper/mineSweeper";
import type {
  GameOptions,
  Difficulty,
  GameStatus,
} from "~/utils/minesweeper/types";
import type { Cell } from "~/utils/minesweeper/cell";
import type { Timer } from "~/utils/minesweeper/Timer";
import { saveScoreboard } from "~/utils/minesweeper/database";

const actionMap: Record<string, number> = {
  play: 1,
  ranking: 2,
  rankingBeginner: 2.1,
  rankingIntermediate: 2.2,
  rankingExpert: 2.3,
  rankingCustom: 2.4,
  results: 3,
  rules: 4,
  gameBoard: 5,
};

export const useMinesweeperGame = () => {
  const { current } = useTheme();
  const { width } = useDisplay();
  const user = useCurrentUser();

  const mineSweeper = ref<IMineSweeper>(new MineSweeper());
  const numRows = ref<number>(9);
  const numCols = ref<number>(9);
  const numMines = ref<number>(10);
  const difficulty = ref<Difficulty>("beginner");
  const menuPage = ref<number>(0);
  const isCustom = ref<boolean>(false);
  const selectedAction = ref<string>("mine");

  const toggleIsCustom = (value?: boolean): void => {
    isCustom.value = value ?? !isCustom.value;
  };

  const handleActions = (action: string): void => {
    menuPage.value = actionMap[action] || 0;
  };

  const returnToPreviousPage = (actualPage: number): void => {
    if (actualPage > 2 && actualPage < 3) {
      menuPage.value = 2;
    } else if (actualPage === 1 && isCustom.value === true) {
      isCustom.value = false;
    } else {
      menuPage.value = 0;
    }
  };

  const gameBoard = computed((): Cell[][] => {
    const board = mineSweeper.value.getBoard();
    if (width.value > 600) {
      return board;
    }

    const newBoard: Cell[][] = [];
    for (let i = 0; i < board[0].length; i++) {
      newBoard.push([]);
      for (let j = 0; j < board.length; j++) {
        newBoard[i].push(board[j][i]);
      }
    }

    return newBoard;
  });

  const timer = computed((): Timer => mineSweeper.value.getTimer());

  const gameStatusToString = computed((): string =>
    mineSweeper.value.getGameStatusString(),
  );

  const gameStatus = computed(
    (): GameStatus => mineSweeper.value.getGameStatus(),
  );

  const getArrowBackColor = computed((): string => {
    return current.value.dark
      ? "/minesweeper/ui/left-arrow-grey.svg"
      : "/minesweeper/ui/left-arrow.svg";
  });

  const startGame = (options: GameOptions): void => {
    if (options.numMines > options.numRows * options.numCols) {
      return;
    }

    mineSweeper.value.setup(options);
    numRows.value = options.numRows;
    numCols.value = options.numCols;
    numMines.value = options.numMines;
    difficulty.value = options.difficulty;
  };

  const restartGame = (): void => {
    mineSweeper.value.restart({
      numRows: numRows.value,
      numCols: numCols.value,
      numMines: numMines.value,
      difficulty: difficulty.value,
    });
  };

  const handleRightClick = (data: {
    rowIndex: number;
    colIndex: number;
  }): void => {
    const { rowIndex, colIndex } = data;

    if (width.value > 600) {
      mineSweeper.value.handleCellAction(rowIndex, colIndex, "flag");
    } else {
      mineSweeper.value.handleCellAction(colIndex, rowIndex, "flag");
    }
  };

  const handleLeftClick = async (data: {
    rowIndex: number;
    colIndex: number;
    callback: (gameStatus: GameStatus) => void;
  }): Promise<void> => {
    const { rowIndex, colIndex } = data;

    if (width.value > 600) {
      mineSweeper.value.handleCellAction(rowIndex, colIndex, "click");
    } else if (width.value <= 600 && selectedAction.value === "flag") {
      mineSweeper.value.handleCellAction(colIndex, rowIndex, "flag");
    } else if (width.value <= 600 && selectedAction.value === "mine") {
      mineSweeper.value.handleCellAction(colIndex, rowIndex, "click");
    }

    data.callback(mineSweeper.value.getGameStatus());
    if (mineSweeper.value.getGameStatus() === "won") {
      if (!user.value) return;

      await saveScoreboard(
        user.value.uid,
        mineSweeper.value.getTimer().getElapsedTime(),
        difficulty.value,
        numCols.value,
        numRows.value,
        numMines.value,
      );
    }
  };

  onBeforeRouteLeave((): void => {
    mineSweeper.value.getTimer().reset();
  });

  if (process.client) {
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        returnToPreviousPage(menuPage.value);
      }
    });
  }

  return {
    menuPage,
    isCustom,
    selectedAction,
    gameBoard,
    timer,
    gameStatusToString,
    gameStatus,
    getArrowBackColor,
    startGame,
    restartGame,
    handleRightClick,
    handleLeftClick,
    handleActions,
    toggleIsCustom,
    returnToPreviousPage,
  };
};

