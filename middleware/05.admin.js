export default defineNuxtRouteMiddleware(() => {
  if (process.server) return
  const { isAdmin } = useUserStore()
  if (!isAdmin) throw createError({ statusCode: 403 })
})
