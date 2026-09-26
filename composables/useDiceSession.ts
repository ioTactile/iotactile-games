import { DiceSession } from '~/utils/dice/diceSession';
import type { IDiceSession } from '~/utils/dice/diceSession';

export const useDiceSession = (): IDiceSession => {
  const db = useFirestore();
  const user = useCurrentUser();
  const { notifier } = useNotifier();

  return new DiceSession({
    db,
    getUserId: () => user.value?.uid,
    notify: notifier,
  });
};
