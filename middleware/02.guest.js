export default defineNuxtRouteMiddleware(() => {
  if (process.server) return
  const { isLogged } = useUserStore()
  if (isLogged) return navigateTo('/user/profile')
})
