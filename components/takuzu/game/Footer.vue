<template>
  <div class="content__footer">
    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
    <div class="actions">
      <button class="button-action undo svg-container" @click="undo">
        <svg
          fill="#CFD8DC"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#CFD8DC"
          stroke-width="0.0002"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            <path
              d="M17.959 4.571L10.756 9.52s-.279.201-.279.481.279.479.279.479l7.203 4.951c.572.38 1.041.099 1.041-.626V5.196c0-.727-.469-1.008-1.041-.625zm-9.076 0L1.68 9.52s-.279.201-.279.481.279.479.279.479l7.203 4.951c.572.381 1.041.1 1.041-.625v-9.61c0-.727-.469-1.008-1.041-.625z"
            />
          </g>
        </svg>
      </button>
      <button class="button-action pause svg-container" @click="togglePause">
        <svg
          v-if="isPaused"
          width="28px"
          height="28px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            <path
              d="M8.286 3.407A1.5 1.5 0 0 0 6 4.684v14.632a1.5 1.5 0 0 0 2.286 1.277l11.888-7.316a1.5 1.5 0 0 0 0-2.555L8.286 3.407z"
              fill="#CFD8DC"
            />
          </g>
        </svg>
        <svg
          v-else
          width="28px"
          height="28px"
          viewBox="0 0 24 24"
          fill=""
          data-name="Flat Color"
          xmlns="http://www.w3.org/2000/svg"
          class="icon flat-color"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            <path
              id="primary"
              d="M19,4V20a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h2A2,2,0,0,1,19,4ZM9,2H7A2,2,0,0,0,5,4V20a2,2,0,0,0,2,2H9a2,2,0,0,0,2-2V4A2,2,0,0,0,9,2Z"
              fill="#cfd8dc"
            />
          </g>
        </svg>
      </button>
      <button class="button-action svg-container" @click="reset">
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ rotate: isRotating }"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            <path
              d="M12.207 2.293a1 1 0 0 1 0 1.414L10.914 5H12.5c4.652 0 8.5 3.848 8.5 8.5S17.152 22 12.5 22 4 18.152 4 13.5a1 1 0 1 1 2 0c0 3.548 2.952 6.5 6.5 6.5s6.5-2.952 6.5-6.5S16.048 7 12.5 7h-1.586l1.293 1.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0z"
              fill="#CFD8DC"
            />
          </g>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage: string
  isPaused: boolean
  isRotating: boolean
}>()

const emit = defineEmits<{
  (e: 'undo'): void
  (e: 'reset'): void
  (e: 'togglePause'): void
}>()

const undo = () => {
  emit('undo')
}

const reset = () => {
  emit('reset')
}

const togglePause = () => {
  emit('togglePause')
}
</script>

<style scoped lang="scss">
.content__footer {
  margin: 0 1rem;

  .error-message {
    max-width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
    margin-bottom: 20px;

    @media screen and (max-width: 600px) {
      font-size: 0.85rem;
      margin-bottom: 10px;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .button-replay {
      width: 200px;
      padding: 0.25rem 0.5rem;
      background-color: rgb(var(--v-theme-takuzuMainOnSurface));
      color: rgb(var(--v-theme-background));
      border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
      border-radius: 20px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease-in-out;
      font-weight: 700;
    }

    .button-action {
      width: 30px;
      height: 30px;
      background-color: rgb(var(--v-theme-takuzuMainOnSurface));
      border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
      border-radius: 50%;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease-in-out;
    }

    .pause {
      width: 40px;
      height: 40px;
    }

    .undo {
      padding-right: 2px;
    }

    .rotate {
      animation: rotate 1s forwards;
    }

    @keyframes rotate {
      to {
        transform: rotate(-360deg);
      }
    }
  }
}
</style>
