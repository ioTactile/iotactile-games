<template>
  <div class="d-flex flex-column justify-space-evenly">
    <button
      v-for="(item, i) in menuItems"
      :key="i"
      class="button-takuzu"
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
// .button-takuzu:nth-child(odd) {
//   margin: 3rem 0;

//   @media screen and (max-width: 600px) {
//     margin: 2rem 0;
//   }
// }
</style>
