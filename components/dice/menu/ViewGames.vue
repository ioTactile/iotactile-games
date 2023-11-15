<template>
  <div class="d-flex flex-column">
    <div class="header d-flex justify-space-between">
      <div>Session</div>
      <div>Joueurs</div>
      <div />
    </div>
    <div
      v-for="(session, i) in sessions"
      :key="i"
      class="content d-flex justify-space-between"
    >
      <div>{{ session.name }}</div>
      <div class="players-wrapper">
        <div class="players-name">
          {{ session.players.map((player) => player.username).join(', ') }}
        </div>
        <v-icon
          v-for="(player, j) in 4"
          :key="j"
          :icon="mdiAccount"
          width="30"
          height="30"
          :color="j < session.players.length ? 'white' : 'grey'"
        />
      </div>
      <div>
        <button @click="handleButtonClick(session)">
          {{ getButtonLabel(session) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { collection, where, query, orderBy } from 'firebase/firestore'
import { mdiAccount } from '@mdi/js'
import { diceSessionConverter } from '~/stores'
import { DiceSession } from '~/utils/dice/diceSession'

const db = useFirestore()
const user = useCurrentUser()

const sessionsRef = collection(db, 'diceSessions').withConverter(
  diceSessionConverter
)
const sessions = useCollection(
  query(
    sessionsRef,
    where('isFinished', '==', false),
    orderBy('creationDate', 'desc')
  )
)

const handleButtonClick = (session: LocalDiceSessionType) => {
  const host = session.players[0].id === user.value?.uid
  const isPlayerInSession = session.players.some(
    (player) => player.id === user.value?.uid
  )

  if (!session.isStarted) {
    const diceSession = new DiceSession()
    if (host && session.players.length === 1) {
      return diceSession.delete(session)
    }
    if (host) {
      return diceSession.start(session)
    }
    if (isPlayerInSession) {
      return diceSession.leave(session)
    }
    return diceSession.join(session)
  } else if (session.isStarted) {
    return navigateTo({ path: `/dice/${session.id}` })
  }
}

const getButtonLabel = (session: LocalDiceSessionType) => {
  const host = session.players[0].id === user.value?.uid
  const isPlayerInSession = session.players.some(
    (player) => player.id === user.value?.uid
  )

  if (!session.isStarted) {
    if (host && session.players.length === 1) {
      return 'Supprimer'
    }
    if (host) {
      return 'Commencer'
    }
    if (isPlayerInSession) {
      return 'Quitter'
    }
    return 'Rejoindre'
  } else if (session.isStarted && isPlayerInSession) {
    return 'Rejoindre!'
  } else {
    return 'Regarder!'
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 500px;
  height: 40px;
  font-size: 1.25rem;
  background-color: rgb(var(--v-theme-diceMainLightTertiary));

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.content {
  width: 500px;
  height: 50px;
  font-size: 1.25rem;
  background-color: rgb(var(--v-theme-diceMainDarkTertiary));

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 120px;
      height: 30px;
      background-color: rgb(var(--v-theme-diceMainSecondary));
      font-size: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.3);
    }
  }

  .players-wrapper {
    position: relative;
    cursor: pointer;

    .players-name {
      display: none;
      z-index: 9999;
      position: absolute;
      top: -30px;
      left: 0;
      width: 100%;
      background-color: rgba(var(--v-theme-surface), 0.9);
      color: rgb(var(--v-theme-onSurface));
      font-size: 1rem;
      padding: 5px;
      border-radius: 8px;
    }

    &:hover {
      .players-name {
        display: block;
        animation: fade-in 0.5s;
      }
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
