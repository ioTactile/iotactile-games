import { logger } from "~/utils/logging";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err, vm, info) => {
    logger.error("Vue error handler", { err, vm, info });
  };
});
