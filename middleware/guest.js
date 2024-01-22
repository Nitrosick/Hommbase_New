import { getToken } from '@/utils/auth'

export default defineNuxtRouteMiddleware(() => {
  const { isLogged } = useUserStore()
  const token = getToken()
  if (isLogged || token) return navigateTo({ path: '/user/profile' })
})
