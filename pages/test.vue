<template>
  <div class="container">
    <div
      class="cube"
      @mousedown="startRotation"
      @mouseup="stopRotation"
      @mousemove="rotateCube"
    >
      <div class="face front" />
      <div class="face right" />
      <div class="face back" />
      <div class="face left" />
    </div>
  </div>
</template>

<script setup lang="ts">
const isMouseDown = ref(false)
const initialX = ref(0)
const initialY = ref(0)

const startRotation = (e: MouseEvent) => {
  isMouseDown.value = true
  initialX.value = e.clientX
  initialY.value = e.clientY
}

const stopRotation = () => {
  isMouseDown.value = false
}

const rotateCube = (e: MouseEvent) => {
  if (!isMouseDown.value) return

  const x = e.clientX
  const y = e.clientY

  const deltaX = x - initialX.value
  const deltaY = y - initialY.value

  initialX.value = x
  initialY.value = y

  const cube = document.querySelector('.cube') as HTMLElement
  cube.style.transform = `rotateY(${deltaX}deg) rotateX(${deltaY}deg)`
}
</script>

<style scoped lang="scss">
.container {
  margin: 200px;
}
.cube {
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateY(45deg);
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #3498db;
  border: 1px solid #ccc;
  transform-origin: 0 0;
}

.front {
  transform: rotateY(0deg) translateZ(50px);
}
.right {
  transform: skewY(-10deg) rotateY(90deg) translateZ(50px);
}

.back {
  transform: rotateY(180deg) translateZ(50px);
}

.left {
  transform: skewY(10deg) rotateY(-90deg) translateZ(50px);
}
</style>
