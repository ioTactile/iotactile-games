import { defineStore } from "pinia";
import type { User } from "firebase/auth";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUser = ref<User | null>(null);
    const adminClaims = ref<boolean>(false);

    return {
      currentUser,
      adminClaims,
    };
  },
  {
    persist: true,
  }
);
