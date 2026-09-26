export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err, vm, info) => {
    console.log('Error handler', err, vm, info);
  };
});
