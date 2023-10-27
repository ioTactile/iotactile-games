<template>
  <div class="chat-modal-wrapper">
    <section class="header">
      <div />
      <h3>SALON DE DISCUSSION</h3>
      <button @click="emit('open-chat', false)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path
            d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"
          />
        </svg>
      </button>
    </section>
    <section class="content">
      <div v-for="(message, i) in chatMessages" :key="i">
        <span :class="getPlayerClass(message.index)"
          >{{ message.username }} :</span
        >
        <p>{{ message.content }}</p>
      </div>
    </section>
    <section class="footer">
      <div>
        <span>{{ text.length }} / 45</span>
        <input
          v-model="text"
          type="text"
          placeholder="Ton message"
          maxlength="45"
          @keyup.enter="sendMessage"
        />
      </div>
      <button @click="sendMessage">ENVOYER</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { doc, arrayUnion, setDoc } from 'firebase/firestore'
import { diceSessionChatConverter } from '~/stores'
import type { LocalDiceSessionChatType } from '~/stores'
import type { CardUser } from '~/functions/src/types'

const props = defineProps<{
  sessionId: string
  chatMessages: LocalDiceSessionChatType['messages'] | undefined
  players: CardUser[]
}>()

const emit = defineEmits<{
  (e: 'open-chat', value: boolean): void
}>()

const user = useCurrentUser()
const db = useFirestore()

const chatRef = doc(db, 'diceSessionChat', props.sessionId).withConverter(
  diceSessionChatConverter,
)

const text = ref<string>('')

const sendMessage = async () => {
  if (!user.value) {
    return
  }
  if (!text.value) {
    return
  }

  try {
    const uid = user.value.uid

    const currentUser = props.players.find(
      (player: CardUser) => player.id === uid,
    )

    if (!currentUser) {
      return
    }

    const { username } = currentUser

    const index =
      props.players.findIndex((player: CardUser) => player.id === uid) + 1

    await setDoc(
      chatRef,
      {
        id: props.sessionId,
        messages: arrayUnion({
          index,
          username,
          content: text.value,
        }),
      },
      { merge: true },
    )
  } finally {
    text.value = ''
  }
}

const getPlayerClass = (index: number) => {
  switch (index) {
    case 1:
      return 'text-pink'
    case 2:
      return 'text-indigo'
    case 3:
      return 'text-yellow'
    case 4:
      return 'text-brown'
  }
}
</script>

<style scoped lang="scss">
.chat-modal-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999;
  position: absolute;
  top: 30px;
  left: 30px;
  width: 1140px;
  height: 740px;
  background-color: rgba(#d9d9d9, 0.7);
  border-radius: 8px;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      width: 70px;
    }

    h3 {
      font-size: 3rem;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70px;
      height: 70px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      border-radius: 8px;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    margin: 20px 0;

    div {
      display: flex;

      span {
        width: 200px;
        font-size: 2rem;
        text-align: end;
      }

      p {
        width: 940px;
        font-size: 2rem;
        word-wrap: break-word;
        padding: 0 20px;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: end;

    div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      span {
        align-self: flex-end;
        font-size: 1.5rem;
        font-weight: bold;
        margin-right: 20px;
      }

      input {
        width: 786px;
        height: 80px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 30px;
        padding: 0 20px;
        font-size: 2rem;
      }
    }

    button {
      width: 220px;
      height: 80px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      border-radius: 8px;
      font-size: 2.5rem;
      color: white;
    }
  }
}

::-webkit-scrollbar {
  width: 20px;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgb(204, 204, 204);
  border-radius: 8px;
}
</style>
