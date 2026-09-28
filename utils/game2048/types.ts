export type TileValue = 0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | number;

export type Board = TileValue[][];

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'waiting' | 'inProgress' | 'won' | 'lost';

export type MoveResult = {
  board: Board;
  scoreGained: number;
  moved: boolean;
};

export type Game2048ResultPayload = {
  score: number;
  bestTile: number;
  won: boolean;
};
