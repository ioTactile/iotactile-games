<template>
  <form class="form-inline" @submit.prevent="initCustomGame">
    <div class="form-group">
      <label for="custom_width"> Hauteur </label>
      <input
        id="custom_width"
        v-model="numRows"
        type="number"
        min="1"
        max="100"
        class="form-control custom-input"
      />
    </div>
    <div class="form-group">
      <label for="custom_height"> Largeur </label>
      <input
        id="custom_height"
        v-model="numCols"
        type="number"
        min="1"
        max="100"
        class="form-control custom-input"
      />
    </div>
    <div class="form-group">
      <label for="custom_mines"> Mines </label>
      <input
        id="custom_mines"
        v-model="numMines"
        type="number"
        min="1"
        max="10000"
        class="form-control custom-input"
      />
    </div>
    <button type="submit" class="btn">Valider</button>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (
    e: 'initCustomGame',
    { customRows: number, customCols: number, customMines: number }
  ): void
}>()

const numRows = ref<number>(30)
const numCols = ref<number>(30)
const numMines = ref<number>(150)

const initCustomGame = () => {
  emit('initCustomGame', {
    customRows: numRows.value,
    customCols: numCols.value,
    customMines: numMines.value
  })
}
</script>

<style scoped lang="scss">
.form-inline .form-group {
  display: inline-block;
  width: auto;
}

@media screen and (min-width: 768px) {
  .form-inline .form-group {
    margin-bottom: 0;
    vertical-align: middle;
  }
}

.form-group {
  margin-bottom: 15px;
}

@media screen and (min-width: 768px) {
  .form-inline .form-control {
    display: inline-block;
    margin-bottom: 0;
    vertical-align: middle;
  }
}

.custom-input {
  display: block;
  height: 28px;
  width: 47px;
  margin: 0 15px 0 5px;
  padding: 3px 6px;
  font-size: 14px;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition:
    border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition:
    border-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;
  transition:
    border-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;
}

label {
  display: inline-block;
  max-width: 100%;
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 700;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn {
  display: inline-block;
  color: #333;
  background-color: #fff;
  border-color: #ccc;
  margin-bottom: 0;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  border: 1px solid #ccc;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media screen and (min-width: 768px) {
  .btn {
    padding: 4px 10px;
    margin-left: 4px;
  }
}
</style>
