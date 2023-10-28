<template>
  <div class="button" @click="emit('update', !isActive)">
    <input v-model="isActive" type="checkbox" class="checkbox" />
    <div class="knobs">
      <span />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', value: boolean): void
}>()

const props = defineProps<{
  isActive: boolean
}>()

const { isActive } = toRefs(props)

console.log(isActive.value)
</script>

<style scoped lang="scss">
.button {
  position: relative;
  width: 140px;
  height: 70px;
  background-color: #fff;
  border-radius: 8px;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.knobs:before,
.knobs:after,
.knobs span {
  position: absolute;
  top: 5px;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 5px 10px;
  border-radius: 8px;
  transition: 0.3s ease all;
}

.knobs:before,
.knobs:after {
  color: #000000;
  z-index: 1;
}

.knobs:before {
  content: 'OUI';
  top: 18px;
  left: 4px;
}

.knobs:after {
  content: 'NON';
  top: 18px;
  right: 12px;
}

.knobs span {
  left: 75px;
  background-color: #03a9f4;
  z-index: 2;
}

.checkbox:checked + .knobs span {
  left: 5px;
  background-color: #f44336;
}
</style>
