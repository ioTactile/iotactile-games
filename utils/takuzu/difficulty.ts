import type { Difficulty } from './types';

/** Max human-strategy tier allowed for each difficulty (1–4). */
export const DIFFICULTY_MAX_TIER: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
};

/** Soft minimum empty-cell ratio; used as a retry filter, not the primary grade. */
export const DIFFICULTY_MIN_EMPTY_RATIO: Record<Difficulty, number> = {
  easy: 0.35,
  medium: 0.45,
  hard: 0.55,
  expert: 0.6,
};

/** Hard/expert must not be fully solvable with a weaker strategy set. */
export const requiresHarderThanPrevious = (difficulty: Difficulty): boolean =>
  difficulty === 'hard' || difficulty === 'expert';
