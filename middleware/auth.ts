export default defineNuxtRouteMiddleware(async () => {
  const { notifier } = useNotifier()
  const user = await getCurrentUser()

  if (!user) {
    notifier({
      content: 'Tu dois être connecté pour accéder aux jeux multijoueurs.',
      color: 'error'
    })
    return navigateTo('/')
  }
})
