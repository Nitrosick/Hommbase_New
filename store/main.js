export const useMainStore = defineStore('main', {
  state: () => ({
    language: 'ru'
  }),

  actions: {
    changeLanguage (ln) {
      if (!['en', 'ru'].includes(ln)) return
      this.language = ln
      localStorage.setItem('language', ln)
    }
  },
})
