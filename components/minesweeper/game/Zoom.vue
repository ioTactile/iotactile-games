<template>
  <div class="zoom-container">
    <Tooltip
      content="Zoom"
      position="top left"
      :slot-height="35"
      :slot-width="35"
    >
      <template #activator="{ onMouseover, onMouseleave }">
        <button
          @mouseover="onMouseover"
          @mouseleave="onMouseleave"
          @click="toggleMenu"
        >
          <v-icon :icon="mdiLoupe" :size="getIconSize" />
        </button>
      </template>
    </Tooltip>
    <div v-if="isMenuOpen" ref="menu" class="zoom-menu">
      <div
        v-for="(level, i) in zoomLevels"
        :key="i"
        class="zoom-menu-item"
        :class="currentZoomStyle(level)"
      >
        <button @click="setZoom(level)">{{ level }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { onClickOutside } from "@vueuse/core";
import { VIcon } from "vuetify/components";
import { mdiLoupe } from "@mdi/js";
import { useMineSweeperZoomLevelStore } from "~/stores/mineSweeperZoomLevel";

const { width } = useDisplay();

const zoomLevelStore = useMineSweeperZoomLevelStore();
const { zoomLevel } = storeToRefs(zoomLevelStore);

const isMenuOpen = ref<boolean>(false);
const menu = ref<HTMLElement>();

onClickOutside(menu, (): void => {
  isMenuOpen.value = false;
});

const getIconSize = computed(() => {
  return width.value > 600 ? 40 : 25;
});

const zoomLevels: number[] = [
  10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
  48, 50, 52, 54, 56, 58, 60,
];

const setZoom = (level: number): void => {
  zoomLevel.value = level;
  isMenuOpen.value = false;
};

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value;
};

const currentZoomStyle = (level: number) => {
  return {
    "current-zoom": zoomLevel.value === level,
  };
};
</script>

<style scoped lang="scss">
.zoom-container {
  position: relative;

  .zoom-menu {
    position: absolute;
    top: 42px;
    left: -5px;
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--v-theme-background));
    z-index: 1;
    max-height: 300px;
    overflow-y: auto;

    .zoom-menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 15px 5px 10px;

      button {
        background-color: transparent;
        border: none;
        color: rgba(var(--v-theme-onBackground), 0.5);
        font-size: 1.2rem;
        transition: all 0.2s ease-in-out;

        &:hover {
          color: rgb(var(--v-theme-onBackground));
        }
      }
    }

    .current-zoom {
      background-color: rgba(var(--v-theme-mineSweeperMainPrimary), 0.3);
    }
  }
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-mineSweeperMainPrimary), 0.7);
  border-radius: 0;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--v-theme-mineSweeperMainPrimary), 0.9);
}
</style>
