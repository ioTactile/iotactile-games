<template>
  <div class="main-container">
    <button
      v-for="(item, i) in menuItems"
      :key="i"
      class="button-mineSweeper"
      @click="emit('action', item.action)"
    >
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'action', value: string): void
}>()

const menuItems = [
  {
    title: 'Jouer',
    action: 'play'
  },
  {
    title: 'Classement',
    action: 'ranking'
  },
  {
    title: 'Résultats',
    action: 'results'
  },
  {
    title: 'Règles',
    action: 'rules'
  }
]
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
