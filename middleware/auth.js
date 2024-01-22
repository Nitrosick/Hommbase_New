export default defineNuxtRouteMiddleware((to) => {
  const { isLogged } = useUserStore()
  if (!isLogged) return navigateTo({
    path: '/auth/login',
    query: { to: to.fullPath },
  })

})
