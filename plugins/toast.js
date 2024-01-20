export const toast = (message, time = 5) => {
  if (!message) return
  const { showToast } = useMainStore()
  showToast(message, time)
}

export default defineNuxtPlugin({
  parallel: true,

  setup () {
    return {
      provide: { toast }
    }
  }
})
