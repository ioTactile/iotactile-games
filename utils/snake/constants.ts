export const GRID_SIZE = 20;

export const INITIAL_SNAKE_LENGTH = 3;

/** Points gained when eating one food. */
export const FOOD_SCORE = 10;

/** Default tick interval in ms (UI uses this; domain is tick-driven). */
export const DEFAULT_TICK_MS = 120;

/**
 * Extra ticks without moving when the next step would hit a wall,
 * so the player can still turn away (~120ms at DEFAULT_TICK_MS).
 */
export const WALL_GRACE_TICKS = 1;
