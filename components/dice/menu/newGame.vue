<template>
  <div class="d-flex flex-column">
    <input
      v-model="sessionName"
      type="text"
      placeholder="Nom de la session"
      minlength="4"
      maxlength="12"
    />
    <button class="button-dice" @click="createSession">Créer la session</button>
  </div>
</template>

<script setup lang="ts">
import DiceSession from '~/utils/dice/diceSession'

const emit = defineEmits<{
  (e: 'action', value: string): void
}>()

const sessionName = ref<string>('')

const createSession = () => {
  if (!sessionName.value) {
    return
  }
  const diceSession = new DiceSession()

  try {
    diceSession.create(sessionName.value)
  } finally {
    sessionName.value = ''
    emit('action', 'viewGames')
  }
}
</script>

<style scoped lang="scss">
input {
  width: 300px;
  height: 64px;
  font-size: 2rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.button-dice {
  margin: 3rem 0;
}
</style>
~/utils/dice/diceSession
