export default defineNuxtRouteMiddleware(async () => {
  const { notifier } = useNotifier()
  const user = await getCurrentUser()

  if (!user) {
    notifier({
      content: 'Tu dois être connecté pour accéder aux différents jeux.',
      color: 'error'
    })
    return navigateTo('/')
  }
})
