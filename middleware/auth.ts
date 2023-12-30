import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, _) => {
  const { notifier } = useNotifier()
  const { currentUser, adminClaims } = useUserStore()

  if (!currentUser) {
    notifier({
      content: 'Tu dois être connecté pour accéder aux jeux multijoueurs.',
      color: 'error'
    })
    return await navigateTo('/')
  }

  if (
    adminClaims === false &&
    (to.fullPath === '/admin' || to.fullPath === '/admin/utilisateurs')
  ) {
    return await navigateTo('/')
  }
})
