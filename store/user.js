import { getToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  getters: {
    me: (state) => state.user,
    isLogged: (state) => Boolean(state.user),
    isAdmin: (state) => Boolean(state.user && state.user.is_admin)
  },

  actions: {
    async autologon () {
      const token = getToken()
      if (!token) return

      const { $api } = useNuxtApp()
      const [res, err] = await $api('auth/autologon', { token })

      if (err) {
        console.error(err)
        localStorage.removeItem('token')
        return
      }
      this.user = res
    },
    logout () {
      this.user = null
      localStorage.removeItem('token')
      navigateTo('/')
    },
    setUser (data) {
      this.user = data
      localStorage.setItem('token', data.token)
    },
    setBalance (value) {
      if (!this.user) return
      this.user.balance = value
    },
    setAvatar (data) {
      if (!this.user) return
      this.user.avatar = data
    },
    setAvatarsList (data) {
      if (!this.user) return
      this.user.avatars = data
    }
  },
})
