<template>
  <div class="tooltip-container">
    <div v-if="isHovering" class="tooltip-content" :style="getPosition">
      {{ content }}
    </div>
    <slot
      name="activator"
      :on-mouseover="onMouseover"
      :on-mouseleave="onMouseleave"
      :on-click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
  position:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
  slotHeight: number
  slotWidth: number
}>()

const emit = defineEmits<{
  (e: 'onClick'): void
}>()

const isHovering = ref<boolean>(false)

const onMouseover = (): void => {
  isHovering.value = true
}

const onMouseleave = (): void => {
  isHovering.value = false
}

const onClick = (): void => {
  isHovering.value = false
  emit('onClick')
}

const getPosition = computed(() => {
  if (props.position.split(' ').length === 2) {
    const [y, x] = props.position.split(' ')
    if (y === 'top' && x === 'left') {
      return {
        top: `calc(-${props.slotHeight}px - 0.25rem)`,
        right: '-0.25rem'
      }
    } else if (y === 'top' && x === 'right') {
      return {
        top: `calc(-${props.slotHeight}px - 0.25rem)`,
        left: '-0.25rem'
      }
    } else if (y === 'bottom' && x === 'left') {
      return {
        bottom: `calc(-${props.slotHeight}px - 0.25rem)`,
        right: '-0.25rem'
      }
    } else if (y === 'bottom' && x === 'right') {
      return {
        bottom: `calc(-${props.slotHeight}px - 0.25rem)`,
        left: '-0.25rem'
      }
    }
  }

  if (props.position === 'top') {
    return {
      top: `calc(-${props.slotHeight}px - 0.25rem)`,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  } else if (props.position === 'bottom') {
    return {
      bottom: `calc(-${props.slotHeight}px - 0.25rem)`,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  } else if (props.position === 'left') {
    return {
      top: '50%',
      right: `calc(${props.slotWidth}px + 0.25rem)`,
      transform: 'translateY(-50%)'
    }
  } else if (props.position === 'right') {
    return {
      top: '50%',
      left: `calc(${props.slotWidth}px + 0.25rem)`,
      transform: 'translateY(-50%)'
    }
  }
})
</script>

<style scoped lang="scss">
.tooltip-container {
  position: relative;

  .tooltip-content {
    position: absolute;
    width: max-content;
    padding: 0.5rem;
    background-color: rgb(var(--v-theme-mineSweeperMainBackground));
    color: white;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    z-index: 1000;
  }
}
</style>
