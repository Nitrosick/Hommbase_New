export const useMainStore = defineStore('main', {
  state: () => ({
    toastOpened: false,
    toastMessage: ''
  }),

  actions: {
    showToast (message, time) {
      this.toastOpened = true
      this.toastMessage = message

      setTimeout(() => {
        this.toastOpened = false
        this.toastMessage = ''
      }, time * 1000)
    }
  },
})
