import { getToken } from '@/utils/auth'

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return
  const token = getToken()
  const { isLogged, autologon } = useUserStore()

  if (token && !isLogged) await autologon()
})
