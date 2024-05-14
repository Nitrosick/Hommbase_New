export const useCacheStore = defineStore('cache', {
  state: () => ({
    cache: {},
    settings: {}
  }),

  getters: {
    cacheSettings: (state) => state.settings
  },

  actions: {
    async fetchCacheSettings () {
      const { $api } = useNuxtApp()
      const [res, err] = await $api('caching')

      if (err) return console.error(err)
      if (!res.length) return

      this.settings = res.reduce(
        (carry, item) => {
          carry[item.section] = Boolean(+item.enabled)
          return carry
        }, {}
      )
    },
    setCacheSettings (data) {
      if (!data) return
      this.settings = data
    },
    writeCache (data, key) {
      this.cache[key] = data
    },
    readCache (key) {
      return this.cache[key] ?? null
    },
    clearCache () {
      this.cache = {}
    }
  },
})
