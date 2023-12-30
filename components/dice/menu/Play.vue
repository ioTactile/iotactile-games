<template>
  <div class="d-flex flex-column">
    <button
      v-for="(item, i) in menuItems"
      :key="i"
      class="button-dice"
      @click="handleAction(item.action)"
    >
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { DiceSession } from '~/utils/dice/diceSession'

const emit = defineEmits<{
  (e: 'action', value: string): void
}>()

const menuItems = [
  {
    title: 'Partie rapide',
    action: 'quickGame'
  },
  {
    title: 'Nouvelle partie',
    action: 'newGame'
  },
  {
    title: 'Voir les parties',
    action: 'viewGames'
  }
]

const handleAction = async (action: string) => {
  if (action === 'quickGame') {
    const diceSession = new DiceSession()

    const result = await diceSession.quickJoin()
    if (result === false) {
      return
    }
    emit('action', 'quickGame')
  } else {
    emit('action', action)
  }
}
</script>

<style scoped lang="scss">
.button-dice:nth-child(even) {
  margin: 3rem 0;
}
</style>
