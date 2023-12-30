export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err, vm, info) => {
    // eslint-disable-next-line no-console
    console.log("Error handler", err, vm, info);
  };
});
