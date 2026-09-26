import { describe, test, expect } from 'vitest';
import {
  canDeleteSession,
  canJoinSession,
  canLeaveSession,
  canStartSession,
  createEmptyPlayerScores,
  isHost,
  nextRemainingTurnsOnJoin,
  nextRemainingTurnsOnLeave,
  playerSlotForJoin,
  playerSlotForUser,
  withPlayerJoined,
  withPlayerLeft,
} from './sessionRules';

const session = (
  overrides: Partial<{
    players: { id: string; username?: string }[];
    isStarted: boolean;
    isFull: boolean;
  }> = {},
) => ({
  players: overrides.players ?? [{ id: 'host', username: 'Host' }],
  isStarted: overrides.isStarted ?? false,
  isFull: overrides.isFull ?? false,
});

describe('sessionRules', () => {
  test('createEmptyPlayerScores initializes sheet for a user', () => {
    expect(createEmptyPlayerScores('u1')).toMatchObject({
      id: 'u1',
      bonus: 0,
      total: 0,
      one: null,
    });
  });

  test('canStartSession requires at least two players and not started', () => {
    expect(canStartSession(session())).toBe(false);
    expect(
      canStartSession(
        session({
          players: [{ id: 'a' }, { id: 'b' }],
        }),
      ),
    ).toBe(true);
    expect(
      canStartSession(
        session({
          players: [{ id: 'a' }, { id: 'b' }],
          isStarted: true,
        }),
      ),
    ).toBe(false);
  });

  test('canJoinSession blocks full, started, or already joined players', () => {
    expect(canJoinSession(session(), 'guest')).toBe(true);
    expect(canJoinSession(session(), 'host')).toBe(false);
    expect(canJoinSession(session({ isStarted: true }), 'guest')).toBe(false);
    expect(
      canJoinSession(
        session({
          players: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
        }),
        'guest',
      ),
    ).toBe(false);
  });

  test('canLeaveSession and canDeleteSession', () => {
    expect(canLeaveSession(session(), 'host')).toBe(true);
    expect(canLeaveSession(session({ isStarted: true }), 'host')).toBe(false);
    expect(canDeleteSession(session(), 'host')).toBe(true);
    expect(
      canDeleteSession(
        session({
          players: [{ id: 'host' }, { id: 'guest' }],
        }),
        'host',
      ),
    ).toBe(false);
  });

  test('isHost and remaining turns helpers', () => {
    expect(isHost(session(), 'host')).toBe(true);
    expect(isHost(session(), 'guest')).toBe(false);
    expect(nextRemainingTurnsOnJoin(13)).toBe(26);
    expect(nextRemainingTurnsOnLeave(26)).toBe(13);
  });

  test('withPlayerJoined / withPlayerLeft update roster and fullness', () => {
    const joined = withPlayerJoined(session(), {
      id: 'guest',
      username: 'Guest',
    });
    expect(joined.players).toHaveLength(2);
    expect(joined.isFull).toBe(false);

    const full = withPlayerJoined(
      session({
        players: [{ id: '1' }, { id: '2' }, { id: '3' }],
      }),
      { id: '4', username: 'Four' },
    );
    expect(full.isFull).toBe(true);

    const left = withPlayerLeft(joined, 'guest');
    expect(left.players).toHaveLength(1);
    expect(left.isFull).toBe(false);
  });

  test('player slot helpers', () => {
    expect(playerSlotForJoin(2)).toBe('playerTwo');
    expect(playerSlotForJoin(3)).toBe('playerThree');
    expect(playerSlotForJoin(4)).toBe('playerFour');
    expect(playerSlotForJoin(1)).toBe(null);

    expect(
      playerSlotForUser(
        {
          playerTwo: { id: 'b' },
          playerThree: { id: 'c' },
          playerFour: null,
        },
        'c',
      ),
    ).toBe('playerThree');
    expect(playerSlotForUser({}, 'missing')).toBe(null);
  });
});
