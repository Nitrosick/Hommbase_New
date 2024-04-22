export const useCacheStore = defineStore('cache', {
  state: () => ({
    cache: {}
  }),

  actions: {
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
