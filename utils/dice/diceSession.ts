import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteField,
  type Firestore,
} from 'firebase/firestore';
import {
  diceSessionConverter,
  diceSessionPlayerTurnConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter,
  diceSessionScoresConverter,
  diceScoreboardConverter,
  diceSessionChatConverter,
} from '~/infrastructure/firestore/converters';
import type { LocalDiceSessionType } from '~/infrastructure/firestore/converters';
import {
  canDeleteSession,
  canJoinSession,
  canLeaveSession,
  canStartSession,
  createEmptyPlayerScores,
  nextRemainingTurnsOnJoin,
  nextRemainingTurnsOnLeave,
  playerSlotForJoin,
  playerSlotForUser,
  withPlayerJoined,
  withPlayerLeft,
} from './sessionRules';

export type DiceSessionNotifier = (payload: { content?: string; color?: string }) => void;

export type DiceSessionDeps = {
  db: Firestore;
  getUserId: () => string | undefined;
  notify: DiceSessionNotifier;
};

export interface IDiceSession {
  create(name: string): Promise<void>;
  start(session: LocalDiceSessionType): Promise<void>;
  leave(session: LocalDiceSessionType): Promise<void>;
  delete(session: LocalDiceSessionType): Promise<void>;
  join(session: LocalDiceSessionType): Promise<void>;
  quickJoin(): Promise<boolean>;
}

/** Firestore adapter for dice multiplayer sessions (infra). Domain rules live in sessionRules. */
export class DiceSession implements IDiceSession {
  private readonly db: Firestore;
  private readonly getUserId: () => string | undefined;
  private readonly notify: DiceSessionNotifier;

  private sessionsRef;
  private playerTurnRef;
  private remainingTurnsRef;
  private dicesRef;
  private playerTriesRef;
  private scoresRef;
  private scoreboardRef;
  private chatRef;

  constructor(deps: DiceSessionDeps) {
    this.db = deps.db;
    this.getUserId = deps.getUserId;
    this.notify = deps.notify;

    this.sessionsRef = collection(this.db, 'diceSessions').withConverter(diceSessionConverter);
    this.playerTurnRef = collection(this.db, 'diceSessionPlayerTurn').withConverter(
      diceSessionPlayerTurnConverter,
    );
    this.remainingTurnsRef = collection(this.db, 'diceSessionRemainingTurns').withConverter(
      diceSessionRemainingTurnsConverter,
    );
    this.dicesRef = collection(this.db, 'diceSessionDices').withConverter(
      diceSessionDicesConverter,
    );
    this.playerTriesRef = collection(this.db, 'diceSessionPlayerTries').withConverter(
      diceSessionPlayerTriesConverter,
    );
    this.scoresRef = collection(this.db, 'diceSessionScores').withConverter(
      diceSessionScoresConverter,
    );
    this.scoreboardRef = collection(this.db, 'diceScoreboard').withConverter(
      diceScoreboardConverter,
    );
    this.chatRef = collection(this.db, 'diceSessionChat').withConverter(diceSessionChatConverter);
  }

  private async getUsername(userId: string) {
    const userRef = doc(this.db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return;
    }
    return userDoc.data()?.username as string | undefined;
  }

  private async checkScoreboard(userId: string) {
    const scoreboardQuery = query(this.scoreboardRef, where('userId', '==', userId));
    const scoreboardSnapshot = await getDocs(scoreboardQuery);
    const scoreboard = scoreboardSnapshot.docs.map((entry) => entry.data());
    if (scoreboard.length === 0) {
      const username = await this.getUsername(userId);
      await setDoc(doc(this.scoreboardRef, userId), {
        userId,
        username,
        games: 0,
        maxScore: 0,
        averageScore: 0,
        totalScore: 0,
        victories: 0,
        dice: 0,
      });
    }
  }

  public async create(name: string) {
    const userId = this.getUserId();
    if (!userId) return;

    const sessionId = doc(this.sessionsRef).id;
    const sessionRef = doc(this.sessionsRef, sessionId);
    const username = await this.getUsername(userId);

    await setDoc(sessionRef, {
      id: sessionId,
      name,
      players: [{ id: userId, username }],
      isFull: false,
      isStarted: false,
      isFinished: false,
      creationDate: new Date(),
    });

    await setDoc(doc(this.playerTurnRef, sessionId), {
      id: sessionId,
      playerId: userId,
    });

    await setDoc(doc(this.remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: 13,
    });

    await setDoc(doc(this.dicesRef, sessionId), {
      id: sessionId,
      dices: [],
    });

    await setDoc(doc(this.playerTriesRef, sessionId), {
      id: sessionId,
      tries: 3,
    });

    await setDoc(doc(this.scoresRef, sessionId), {
      id: sessionId,
      playerOne: createEmptyPlayerScores(userId),
      creationDate: new Date(),
    });

    await this.checkScoreboard(userId);
  }

  public async start(session: LocalDiceSessionType) {
    const userId = this.getUserId();
    if (!userId || !canStartSession(session)) {
      return;
    }

    await updateDoc(doc(this.sessionsRef, session.id), { isStarted: true });
  }

  public async leave(session: LocalDiceSessionType) {
    const userId = this.getUserId();
    if (!userId || !canLeaveSession(session, userId)) {
      return;
    }

    const sessionId = session.id;
    const sessionRef = doc(this.sessionsRef, sessionId);
    const scoresDocRef = doc(this.scoresRef, sessionId);
    const remainingTurnsDoc = doc(this.remainingTurnsRef, sessionId);
    const scoresDoc = await getDoc(scoresDocRef);
    const scores = scoresDoc.data();

    const slot = scores ? playerSlotForUser(scores, userId) : null;
    if (slot) {
      await updateDoc(scoresDocRef, {
        [slot]: deleteField(),
      });
    }

    const updatedSession = withPlayerLeft(session, userId);
    const joinRemainingTurnsDoc = await getDoc(remainingTurnsDoc);

    if (!joinRemainingTurnsDoc.exists()) {
      return;
    }

    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns;

    await updateDoc(remainingTurnsDoc, {
      id: sessionId,
      remainingTurns: nextRemainingTurnsOnLeave(joinRemainingTurns),
    });

    await updateDoc(sessionRef, updatedSession);
  }

  public async delete(session: LocalDiceSessionType) {
    const userId = this.getUserId();
    if (!userId || !canDeleteSession(session, userId)) {
      return;
    }

    const sessionId = session.id;
    await deleteDoc(doc(this.sessionsRef, sessionId));
    await deleteDoc(doc(this.playerTurnRef, sessionId));
    await deleteDoc(doc(this.scoresRef, sessionId));
    await deleteDoc(doc(this.remainingTurnsRef, sessionId));
    await deleteDoc(doc(this.dicesRef, sessionId));
    await deleteDoc(doc(this.playerTriesRef, sessionId));
    await deleteDoc(doc(this.chatRef, sessionId));
  }

  public async join(session: LocalDiceSessionType) {
    const userId = this.getUserId();
    if (!userId || !canJoinSession(session, userId)) {
      return;
    }

    const sessionId = session.id;
    const sessionRef = doc(this.sessionsRef, sessionId);
    const username = await this.getUsername(userId);
    const updatedSession = withPlayerJoined(session, { id: userId, username });

    const joinRemainingTurnsRef = doc(this.remainingTurnsRef, sessionId);
    const joinRemainingTurnsDoc = await getDoc(joinRemainingTurnsRef);

    if (!joinRemainingTurnsDoc.exists()) {
      return;
    }

    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns;

    await updateDoc(doc(this.remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: nextRemainingTurnsOnJoin(joinRemainingTurns),
    });

    await updateDoc(sessionRef, updatedSession);

    const slot = playerSlotForJoin(updatedSession.players.length);
    if (slot) {
      await updateDoc(doc(this.scoresRef, sessionId), {
        [slot]: createEmptyPlayerScores(userId),
      });
    }

    await this.checkScoreboard(userId);
  }

  public async quickJoin() {
    const userId = this.getUserId();
    if (!userId) {
      return false;
    }

    const sessionsQuery = query(
      this.sessionsRef,
      where('isFull', '==', false),
      where('isStarted', '==', false),
    );
    const sessionsSnapshot = await getDocs(sessionsQuery);
    const sessions = sessionsSnapshot.docs.map((entry) => entry.data());

    if (sessions.length === 0) {
      this.notify({
        content: 'Aucune session disponible',
        color: 'primary',
      });
      return false;
    }

    const session = sessions[Math.floor(Math.random() * sessions.length)];
    if (!canJoinSession(session, userId)) {
      return false;
    }

    await this.join(session);
    return true;
  }
}
