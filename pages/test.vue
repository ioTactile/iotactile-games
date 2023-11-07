<template>
  <div class="wrapper">
    <div class="one">Un</div>
    <div class="two">Deux</div>
    <div class="three">Trois</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;

  div {
    width: 200px;
    margin: 10px;
    background-color: rgba(#eee, 0.8);
    border: 2px solid #aaa;
    padding: 10px;
  }

  .two,
  .three {
    flex-grow: 1;
  }
}
</style>
