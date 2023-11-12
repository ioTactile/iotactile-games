<template>
  <div class="d-flex flex-column">
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
.button-mineSweeper:nth-child(odd) {
  margin: 3rem 0;
}
</style>
