export const toast = (message, time = 5, mark) => {
  if (!message) return
  const { showToast } = useMainStore()
  showToast(message, time, mark)
}

export default defineNuxtPlugin({
  parallel: true,

  setup () {
    return {
      provide: { toast }
    }
  }
})
