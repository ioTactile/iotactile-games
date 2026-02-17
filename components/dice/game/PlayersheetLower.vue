<template>
  <div class="right-column">
    <div class="right-column-border">
      <div v-for="(row, j) in lowerPlayerSheet" :key="j" class="right-row">
        <div>
          <v-img :src="row.src" width="50" height="50" />
        </div>
        <button
          v-if="isPlayerTurn && row.input === null"
          class="button-save mr-4"
          @click="$emit('save-input', row.value)"
        >
          {{ getInput(row.value) }}
        </button>
        <button v-else class="button-input mr-4">
          {{ row.input === null ? "-" : row.input }}
        </button>
      </div>
      <div class="right-row-bottom-wrapper">
        <div>TOTAL</div>
        <div class="mr-4">
          {{ lowerPlayerSheetTotal }}
        </div>
      </div>
    </div>
    <button class="button-lower-total">
      {{ playerSheetTotal }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { VImg } from "vuetify/components";
import type { PlayerSheetRow } from "./Playersheet.types";

defineProps<{
  lowerPlayerSheet: PlayerSheetRow[];
  lowerPlayerSheetTotal: number;
  playerSheetTotal: number;
  isPlayerTurn: boolean;
  getInput: (value: string) => number | undefined;
}>();

defineEmits<{
  (e: "save-input", value: string): void;
}>();
</script>

