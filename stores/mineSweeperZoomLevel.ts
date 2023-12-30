import { defineStore } from "pinia";

export const useMineSweeperZoomLevelStore = defineStore(
  "mineSweeperZoomLevel",
  () => {
    const zoomLevel = ref<number>(24);

    return {
      zoomLevel,
    };
  },
  {
    persist: true,
  },
);
