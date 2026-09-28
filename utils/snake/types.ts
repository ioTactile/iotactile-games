export type Direction = 'up' | 'down' | 'left' | 'right';

export type Position = {
  x: number;
  y: number;
};

export type GameStatus = 'waiting' | 'inProgress' | 'paused' | 'lost';

export type SnakeResultPayload = {
  score: number;
  length: number;
};

export type TickResult = {
  ateFood: boolean;
  lost: boolean;
};
