export const useMainStore = defineStore('main', {
  state: () => ({
    toast: {
      opened: false,
      message: '',
      mark: null
    }
  }),

  actions: {
    showToast (message, time, mark) {
      this.toast.opened = true
      this.toast.message = message
      if (['error', 'success'].includes(mark)) this.toast.mark = mark

      setTimeout(() => {
        this.toast.opened = false
        this.toast.message = ''
        this.toast.mark = null
      }, time * 1000)
    }
  },
})
