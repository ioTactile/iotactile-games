import {
  collection,
  getDoc,
  setDoc,
  doc,
  type DocumentData
} from 'firebase/firestore'
import type { BoardSize, Difficulty } from './types'
import type { LocalTakuzuScoreboardType } from '~/stores'

type TakuzuVictory = {
  victories: number
  bestTime: number
  victoryDate: Date
}

const DEFAULT_VICTORY: TakuzuVictory = {
  victories: 0,
  bestTime: 0,
  victoryDate: new Date()
}

const takuzuScoreboard = (): ReturnType<typeof collection> => {
  const db = useFirestore()
  const takuzuScoreboard = collection(db, 'takuzuScoreboard').withConverter(
    takuzuScoreboardConverter
  )
  return takuzuScoreboard
}

const translateBoardSize = (
  boardSize: BoardSize
): keyof LocalTakuzuScoreboardType => {
  switch (boardSize) {
    case 6:
      return 'sixBySix'
    case 8:
      return 'eightByEight'
    case 10:
      return 'tenByTen'
    case 12:
      return 'twelveByTwelve'
    default:
      return 'sixBySix'
  }
}

const getUserData = async (userId: string): Promise<DocumentData | null> => {
  const db = useFirestore()
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)

  return userDoc.exists() ? userDoc.data() : null
}

const getInitialValues = async (
  userId: string
): Promise<LocalTakuzuScoreboardType> => {
  const userData = await getUserData(userId)

  const { username } = userData || { username: 'Anonyme' }

  const scoreboard: LocalTakuzuScoreboardType = {
    userId,
    username,
    sixBySix: {
      easy: { ...DEFAULT_VICTORY },
      medium: { ...DEFAULT_VICTORY },
      hard: { ...DEFAULT_VICTORY },
      expert: { ...DEFAULT_VICTORY }
    },
    eightByEight: {
      easy: { ...DEFAULT_VICTORY },
      medium: { ...DEFAULT_VICTORY },
      hard: { ...DEFAULT_VICTORY },
      expert: { ...DEFAULT_VICTORY }
    },
    tenByTen: {
      easy: { ...DEFAULT_VICTORY },
      medium: { ...DEFAULT_VICTORY },
      hard: { ...DEFAULT_VICTORY },
      expert: { ...DEFAULT_VICTORY }
    },
    twelveByTwelve: {
      easy: { ...DEFAULT_VICTORY },
      medium: { ...DEFAULT_VICTORY },
      hard: { ...DEFAULT_VICTORY },
      expert: { ...DEFAULT_VICTORY }
    }
  }

  const scoreboardRef = doc(takuzuScoreboard(), userId)
  const scoreboardDoc = await getDoc(scoreboardRef)

  if (scoreboardDoc.exists()) {
    Object.assign({}, scoreboard, scoreboardDoc.data())
  }

  return scoreboard
}

const updateScoreboard = (
  scoreboard: LocalTakuzuScoreboardType,
  size: keyof LocalTakuzuScoreboardType,
  time: number,
  difficulty: Difficulty
): LocalTakuzuScoreboardType => {
  const sizeBoard = scoreboard[size] as Record<Difficulty, TakuzuVictory>
  const boardDifficulty = sizeBoard[difficulty]

  boardDifficulty.victories += 1
  if (boardDifficulty.bestTime === 0 || time < boardDifficulty.bestTime) {
    boardDifficulty.bestTime = time
  }
  boardDifficulty.victoryDate = new Date(Date.now())

  sizeBoard[difficulty] = boardDifficulty

  const newScoreboard = { ...scoreboard, [size]: sizeBoard }

  return newScoreboard
}

export const saveScoreboard = async (
  userId: string,
  time: number,
  boardSize: BoardSize,
  difficulty: Difficulty
): Promise<void> => {
  const scoreboard = await getInitialValues(userId)

  console.log('init', scoreboard)

  const sizeKey = translateBoardSize(boardSize)
  const updatedScoreboard = updateScoreboard(
    scoreboard,
    sizeKey,
    time,
    difficulty
  )

  console.log('update', updatedScoreboard)

  const scoreboardRef = doc(takuzuScoreboard(), userId)
  await setDoc(scoreboardRef, updatedScoreboard)
}
