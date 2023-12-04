export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err, vm, info) => {
    console.log('Error handler', err, vm, info)
  }

  // nuxtApp.hook('vue:error', (error, instance, info) => {
  //   console.log('Vue error', error, instance, info)
  // })
})
