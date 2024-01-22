import { getToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  getters: {
    isLogged: (state) => Boolean((state.user && state.user.id)),
    isAdmin: (state) => Boolean(state.user && state.user.is_admin)
  },

  actions: {
    setUser (data) {
      this.user = data
      localStorage.setItem('token', data.token)
    },
    async autologon () {
      const token = getToken()
      if (!token) return

      const { $api } = useNuxtApp()
      const [res, err] = await $api('auth/autologon', { token })

      if (err) {
        console.error(err)
        return
      }

      this.user = res
    },
    logout () {
      this.user = null
      localStorage.removeItem('token')
      navigateTo({ path: '/' })
    }
  },
})
